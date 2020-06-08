<template>
    <div class="wrap">
        <div class="left">
            <van-image width="65" height="65" src="https://img.yzcdn.cn/vant/cat.jpeg" />
        </div>
        <div class="right">
            <p></p>
            <div>
                <span></span>
                <span></span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ClassifyItem',
    props: {
        itemData: {
            default: () => ({}),
        },
    },
    data() {
        return {};
    },
};
</script>

<style lang="scss" scoped>
.wrap {
    padding: 16px;
    display: flex;
}
</style>
