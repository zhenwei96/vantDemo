<template>
    <div ref="wrapper" class="bs-list-wrapper">
        <div class="bs-list-content">
            <div v-show="pulldownLoading" class="bs-loading-wrap">
                <svg
                    width="24px"
                    height="24px"
                    viewBox="0 0 50 50"
                    style="enable-background: new 0 0 50 50"
                    xml:space="preserve"
                >
                    <path
                        fill="#c8c9cc"
                        d="M43.935,25.145c0-10.318-8.364-18.683-18.683-18.683c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615c8.072,0,14.615,6.543,14.615,14.615H43.935z"
                        transform="rotate(275.098 25 25)"
                    >
                        <animateTransform
                            attributeType="xml"
                            attributeName="transform"
                            type="rotate"
                            from="0 25 25"
                            to="360 25 25"
                            dur="0.6s"
                            repeatCount="indefinite"
                        ></animateTransform>
                    </path>
                </svg>
                <span class="bs-loading-text">{{ loadingText }}</span>
            </div>
            <div v-show="pulldown && !pulldownLoading" class="bs-pulldown-tip">{{ pulldownText }}</div>

            <slot></slot>
            <div v-show="bottomLoading" class="bs-loading-wrap bs-bottom-loading-wrap">
                <svg
                    width="24px"
                    height="24px"
                    viewBox="0 0 50 50"
                    style="enable-background: new 0 0 50 50"
                    xml:space="preserve"
                >
                    <path
                        fill="#c8c9cc"
                        d="M43.935,25.145c0-10.318-8.364-18.683-18.683-18.683c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615c8.072,0,14.615,6.543,14.615,14.615H43.935z"
                        transform="rotate(275.098 25 25)"
                    >
                        <animateTransform
                            attributeType="xml"
                            attributeName="transform"
                            type="rotate"
                            from="0 25 25"
                            to="360 25 25"
                            dur="0.6s"
                            repeatCount="indefinite"
                        ></animateTransform>
                    </path>
                </svg>
                <span class="bs-loading-text">{{ loadingText }}</span>
            </div>
            <div v-show="pullup && LoadingOrFinishing" class="bs-pullup-tip">{{ pullupText }}</div>
            <div class="bs-finished-wrap" v-show="finished">
                {{ finishedText }}
            </div>
        </div>
    </div>
</template>
<script>
// TODO: 优化加载中样式
import BScroll from '@better-scroll/core';

export default {
    props: {
        /**
         * 1 滚动的时候会派发scroll事件，会节流。
         * 2 滚动的时候实时派发scroll事件，不会节流。
         * 3 除了实时派发scroll事件，在swipe的情况下仍然能实时派发scroll事件
         */
        probeType: {
            type: Number,
            default: 1,
        },
        // 点击列表是否派发click事件
        click: {
            type: Boolean,
            default: true,
        },
        // 是否开启横向滚动
        scrollX: {
            type: Boolean,
            default: false,
        },
        // 是否派发滚动到底部的事件，用于上拉加载
        pullup: {
            type: Boolean,
            default: false,
        },
        // 是否派发顶部下拉的事件，用于下拉刷新
        pulldown: {
            type: Boolean,
            default: false,
        },
        // 是否派发列表滚动开始的事件
        beforeScroll: {
            type: Boolean,
            default: false,
        },
        // 当数据更新后，刷新scroll的延时。
        refreshDelay: {
            type: Number,
            default: 20,
        },
        // 下拉刷新loading
        pulldownLoading: {
            type: Boolean,
            default: false,
        },
        // 滚动加载或者上拉加载loading
        bottomLoading: {
            type: Boolean,
            default: false,
        },
        // 已完成
        finished: {
            type: Boolean,
            default: false,
        },
        // 完成文案
        finishedText: {
            type: String,
            default: '没有更多了',
        },
        // loading文案
        loadingText: {
            type: String,
            default: '加载中...',
        },
        // 上拉和下拉的阈值
        threshold: {
            type: Number,
            default: 50,
        },
        // 滚动加载偏移量
        offset: {
            type: Number,
            default: 100,
        },
        // 是否开启滚动加载
        scrollList: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            pulldownText: '下拉刷新',
            pullupText: '上拉加载',
            isInit: true,
        };
    },
    computed: {
        LoadingOrFinishing() {
            return !this.bottomLoading && !this.finished;
        },
    },
    mounted() {
        // 保证在DOM渲染完毕后初始化better-scroll
        this._initScroll();
        this.initEmit();
    },
    methods: {
        _initScroll() {
            if (!this.$refs.wrapper) {
                return;
            }
            // better-scroll的初始化
            this.scroll = new BScroll(this.$refs.wrapper, {
                probeType: this.probeType,
                click: this.click,
                scrollX: this.scrollX,
                momentumLimitTime: 100,
            });
            window.scroll = this.scroll;
            // 是否派发滚动事件
            this.scroll.on('scroll', pos => {
                this.$emit('scroll', pos);
                this.pulldownText = pos.y >= this.threshold ? '松开刷新' : '下拉刷新';
                this.pullupText = pos.y <= this.scroll.maxScrollY - this.threshold - 20 ? '松开加载' : '上拉加载';
                if (this.scrollList) this.handleScrollList();
            });

            if (this.pulldown || this.pullup) {
                this.scroll.on('touchEnd', pos => {
                    // 是否派发顶部下拉事件，用于下拉刷新
                    if (this.pulldown) {
                        // 下拉动作
                        if (pos.y > this.threshold && !this.pulldownLoading) {
                            this.$emit('pulldown');
                            this.$emit('update:pulldown-loading', true);
                        }
                    }
                    // 是否派发滚动到底部事件，用于上拉加载
                    if (this.pullup) {
                        // 上拉动作
                        if (pos.y <= this.scroll.maxScrollY - this.threshold - 20 && this.LoadingOrFinishing) {
                            this.$emit('pullup');
                            this.$emit('update:bottom-loading', true);
                        }
                    }
                });
            }

            // 是否派发列表滚动开始的事件
            if (this.beforeScroll) {
                this.scroll.on('beforeScrollStart', () => {
                    this.$emit('beforeScroll');
                });
            }
        },
        handleScrollList() {
            // 滚动加载
            if (this.scroll.y < this.scroll.maxScrollY + this.offset && this.LoadingOrFinishing) {
                this.$emit('load');
                this.$emit('update:bottom-loading', true);
            }
        },
        initEmit() {
            if (this.pullup) this.$emit('pullup');
            if (this.scrollList) this.$emit('load');
            if (this.pulldown) {
                this.$emit('pulldown');
                this.$emit('update:pulldown-loading', true);
            }
            if (this.pullup || this.scrollList) {
                this.$emit('update:bottom-loading', true);
            }
        },
        disable() {
            // 代理better-scroll的disable方法
            this.scroll && this.scroll.disable();
        },
        enable() {
            // 代理better-scroll的enable方法
            this.scroll && this.scroll.enable();
        },
        refresh() {
            // 代理better-scroll的refresh方法
            this.scroll && this.scroll.refresh();
        },
        scrollTo() {
            // 代理better-scroll的scrollTo方法
            this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments);
        },
        scrollToElement() {
            // 代理better-scroll的scrollToElement方法
            this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments);
        },
    },
    watch: {
        pulldownLoading(val) {
            if (!val) {
                this.$nextTick(() => {
                    this.refresh();
                });
            }
        },
        bottomLoading(val) {
            if (val) {
                this.$nextTick(() => {
                    this.refresh();
                    this.scroll.scrollToElement(document.querySelector('.bs-bottom-loading-wrap'));
                });
            } else {
                const maxScrollY = this.maxScrollY;
                this.$nextTick(() => {
                    this.refresh();
                    this.scroll.scrollBy(maxScrollY);
                });
            }
        },
        finished(val) {
            if (val) {
                this.$nextTick(() => {
                    this.refresh();
                });
            }
        },
    },
};
</script>

<style>
.bs-list-wrapper {
    height: 100%;
}
.bs-list-content {
    position: relative;
}
.bs-pulldown-tip {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    text-align: center;
    transform: translateY(-100%);
    color: #969799;
    padding: 10px 0;
}
.bs-pullup-tip {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    text-align: center;
    transform: translateY(100%);
    text-align: center;
    color: #969799;
    padding: 10px 0;
}
.bs-loading-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px 0;
}
.bs-finished-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px 0;
    color: #969799;
}
.bs-loading-text {
    color: #969799;
    margin-left: 10px;
}
</style>
