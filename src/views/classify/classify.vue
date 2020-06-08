<template>
    <div class="wrap">
        <van-sticky>
            <van-search class="search" v-model="searchValue" placeholder="请输入搜索关键词" />
        </van-sticky>

        <van-tabs @click="changeTab" v-model="active" animated sticky offset-top="54">
            <van-tab v-for="(item, index) in tabs" :key="item.type" :title="item.title">
                <ClassifyHome v-if="index === 0"></ClassifyHome>
                <ClassifyAllGoods v-if="index === 1" :cateList="cateList"></ClassifyAllGoods>
                <ClassifySave v-if="index === 2"></ClassifySave>
            </van-tab>
        </van-tabs>
    </div>
</template>

<script>
// @ is an alias to /src
import { getMenu } from '@/api/classify';
import ClassifySave from './classify-save';
import ClassifyAllGoods from './classify-all-goods';
import ClassifyHome from './classify-home';

export default {
    name: 'Home',
    components: {
        ClassifySave,
        ClassifyAllGoods,
        ClassifyHome,
    },
    data() {
        return {
            active: 0,
            activeKey: 0,
            productList: [],
            cateList: [],
            tabs: [],
            searchValue: '',
        };
    },
    created() {
        this.init();
    },
    methods: {
        async init() {
            const [data] = await getMenu();
            if (!data) return;
            const { tabs, cateList } = data.result;
            this.cateList = cateList;
            this.tabs = tabs;
        },
        changeTab() {},
    },
};
</script>

<style lang="scss" scoped>
.wrap {
    height: 100%;
}
</style>
