<template>
    <div class="gac-slider-wrap" @click="onClick" :class="[disabled ? 'gac-slider-disabled' : '', sliderClass]">
        <div class="gac-slider-bar" :style="barStyle" :class="[disabled ? 'gac-slider-disabled' : '', barClass]">
            <div
                class="gac-slider-button-wrap"
                :class="[buttonWrapClass]"
                @touchstart.stop.prevent="onTouchStart"
                @touchmove.stop.prevent="onTouchMove"
                @touchend.stop.prevent="onTouchEnd"
            >
                <slot name="button">
                    <div class="gac-slider-button" :class="[barClass]"></div>
                </slot>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'gacSlider',
    props: {
        disabled: Boolean,
        sliderClass: String,
        barClass: String,
        buttonWrapClass: String,
        buttonClass: String,
        min: {
            type: [Number, String],
            default: 1,
        },
        max: {
            type: [Number, String],
            default: 100,
        },
        step: {
            type: [Number, String],
            default: 1,
        },
        value: {
            type: [Number, Array],
            default: 0,
        },
    },
    data() {
        return {
            currentValue: this.value,
        };
    },
    computed: {
        scope: function scope() {
            return this.max - this.min;
        },
        barWidth() {
            return ((this.value - this.min) * 100) / this.scope;
        },
        barStyle() {
            const style = {
                width: this.barWidth + '%',
            };
            if (this.dragStatus) style.transition = 'none';
            return style;
        },
    },
    methods: {
        onTouchStart(event) {
            console.log('onTouchStart');
            if (this.disabled) return;
            this.touchStart(event);
            this.currentValue = this.value;
            this.startValue = this.format(this.value);
            this.dragStatus = 'start';
        },
        onTouchMove(event) {
            console.log('onTouchMove');
            if (this.disabled) return;

            if (this.dragStatus === 'start') {
                this.$emit('drag-start');
            }
            this.touchMove(event);
            this.dragStatus = 'draging';
            let rect = this.$el.getBoundingClientRect();
            let delta = this.deltaX;
            let total = rect.width;
            let diff = (delta / total) * this.scope;

            this.currentValue = this.startValue + diff;

            this.updateValue(this.currentValue);
        },
        onTouchEnd() {
            console.log('onTouchEnd');
            if (this.disabled) {
                return;
            }

            if (this.dragStatus === 'draging') {
                this.updateValue(this.currentValue, true);
                this.$emit('drag-end');
            }

            this.dragStatus = '';
        },
        onClick(event) {
            event.stopPropagation();
            if (this.disabled) return;
            let rect = this.$el.getBoundingClientRect();
            let delta = event.clientX - rect.left;
            let total = rect.width;
            let value = +this.min + (delta / total) * this.scope;
            this.startValue = this.value;
            this.updateValue(value, true);
        },
        updateValue(value, end) {
            value = this.format(value);
            if (!this.isSameValue(value, this.value)) {
                this.$emit('input', value);
                console.log(value);
            }
            if (end && !this.isSameValue(value, this.startValue)) {
                this.$emit('change', value);
            }
        },
        format(value) {
            let min = +this.min;
            let max = +this.max;
            let step = +this.step;
            value = this.range(value, min, max);
            let diff = Math.round((value - min) / step) * step;
            return this.addNumber(min, diff);
        },
        range(num, min, max) {
            return Math.min(Math.max(num, min), max);
        },
        addNumber(num1, num2) {
            let cardinal = Math.pow(10, 10);
            return Math.round((num1 + num2) * cardinal) / cardinal;
        },
        isSameValue(newValue, oldValue) {
            return JSON.stringify(newValue) === JSON.stringify(oldValue);
        },
        touchStart(event) {
            this.resetTouchStatus();
            this.startX = event.touches[0].clientX;
            this.startY = event.touches[0].clientY;
        },
        touchMove(event) {
            const touch = event.touches[0]; // Fix: Safari back will set clientX to negative number
            this.deltaX = touch.clientX < 0 ? 0 : touch.clientX - this.startX;
            this.deltaY = touch.clientY - this.startY;
            this.offsetX = Math.abs(this.deltaX);
            this.offsetY = Math.abs(this.deltaY);
        },
        resetTouchStatus() {
            this.deltaX = 0;
            this.deltaY = 0;
            this.offsetX = 0;
            this.offsetY = 0;
        },
    },
};
</script>

<style lang="scss" scoped>
.gac-slider-wrap {
    position: relative;
    width: 100%;
    height: 2px;
    background-color: #dce0de;
    border-radius: 999px;
    cursor: pointer;
}
.gac-slider-disabled {
    cursor: not-allowed;
    opacity: 0.5;
}
.gac-slider-bar {
    position: relative;
    width: 80%;
    height: 100%;
    background-color: #4b526a;
    border-radius: inherit;
    transition: all 0.2s;
}
.gac-slider-button-wrap {
    position: absolute;
    top: 50%;
    right: 0;
    transform: translate3d(50%, -50%, 0);
    cursor: grab;
}
.gac-slider-button {
    width: 24px;
    height: 24px;
    background-color: #fff;
    border-radius: 50%;
    box-shadow: 0 1px 2px rgb(0 0 0 / 50%);
}
</style>
