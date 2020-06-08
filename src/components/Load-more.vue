<template>
    <div class="load-more-wrapper">
        <div class="inner">
            <slot></slot>
            <div class="load-more" v-show="enableLoadMore">{{ loadMoreText }}</div>
            <div class="load-end" v-show="!enableLoadMore">已经到底了!</div>
        </div>
    </div>
</template>
<script>
// TODO: 优化加载中样式
export default {
    name: 'LoadMore',
    props: {
        enableLoadMore: {
            type: Boolean,
            default: true,
        },
        onLoadMore: {
            type: Function,
            default: undefined,
            require: false,
        },
        scrollEl: {
            type: Element,
            require: true,
        },
    },
    data() {
        return {
            loadMoreText: '上拉加载更多',
            startX: 0,
            startY: 0,
            isLoading: false,
        };
    },
    methods: {
        touchStart(e) {
            this.startY = e.targetTouches[0].pageY;
            this.startX = e.targetTouches[0].pageX;
            console.log('touchStart', this.startY, this.startX);
        },
        scrollToEnd() {
            const { scrollHeight, clientHeight, scrollTop } = this.scrollEl;
            if (scrollTop + clientHeight >= scrollHeight && this.enableLoadMore) {
                this.doLoadMore();
            }
        },
        touchEnd(e) {
            if (this.isLoading) {
                return;
            }
            const endX = e.changedTouches[0].pageX;
            const endY = e.changedTouches[0].pageY;
            const dy = this.startY - endY;
            const dx = endX - this.startX;
            if (Math.abs(dx) < 2 && Math.abs(dy) < 2) {
                return;
            }
            if (endY < this.startY) {
                this.scrollToEnd(e);
            }
        },
        doLoadMore() {
            this.isLoading = true;
            this.loadMoreText = '加载中...';
            this.onLoadMore(this.loadDone);
        },
        loadDone() {
            this.isLoading = false;
            this.loadMoreText = '上拉加载更多';
        },
    },
    watch: {
        scrollEl(el) {
            el.addEventListener('touchstart', this.touchStart);
            el.addEventListener('touchend', this.touchEnd);
        },
    },
};
</script>

<style lang="scss" scoped>
.load-more-wrapper {
    height: 100%;
    /* overflow-y: auto; */
    overflow: hidden;
    -webkit-overflow-scrolling: touch;
    transition-duration: 300ms;
    .load-more,
    .load-end {
        color: #aea699;
        font-size: 0.26rem;
        margin: 0.3rem 0;
        text-align: center;
    }
}
</style>
