<template>
    <div class="classify-home-wrap">
        {{ value }}
        <van-slider v-model="value" :step="0.1" min="1" max="50" />
        <div style="margin-top: 100px"></div>
        {{ value1 }}
        <gac-slider v-model="value1" :step="1" min="0" max="50" button-wrap-class="custom-button-wrap">
            <template #button>
                <div class="custom-button"></div>
            </template>
        </gac-slider>
    </div>
</template>

<script>
import gacSlider from '@/components/gac-slider';

export default {
    name: 'ClassifyHome',
    components: { gacSlider },
    data() {
        return {
            value: 10,
            value1: 10,
        };
    },
};
</script>

<style lang="scss">
.classify-home-wrap {
    padding: 0 10px;
    padding-top: 100px;
    height: 300px;
}
.custom-button-wrap {
    top: 100% !important;
    transform: translate3d(50%, 0, 0) !important;
}
.custom-button {
    width: 20px;
    height: 20px;
    background: #000;
}
</style>
