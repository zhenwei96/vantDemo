<template>
    <div class="home">
        <van-tabs @click="changeTab" v-model="active" animated>
            <van-tab title="绿茶">
                <ItemCard :productList="productList"></ItemCard>
                <van-search class="search" placeholder="请输入搜索关键词" />
            </van-tab>
            <van-tab title="红茶">
                <ItemCard :productList="productList"></ItemCard>
            </van-tab>
            <van-tab title="龙井">
                <ItemCard :productList="productList"></ItemCard>
            </van-tab>
            <van-tab title="碧螺春">
                <ItemCard :productList="productList"></ItemCard>
            </van-tab>
        </van-tabs>
    </div>
</template>

<script>
// @ is an alias to /src
import { getTabData, getTabDataList } from '@/api/home';
import ItemCard from '@/components/item-card';

const url = {
    0: '../../static/lc.json',
    1: '../../static/lj.json',
    2: '../../static/lc.json',
    3: '../../static/lj.json',
};

export default {
    name: 'Home',
    components: { ItemCard },
    data() {
        return {
            active: 0,
            productList: [],
        };
    },
    created() {
        this.init();
    },
    methods: {
        async init() {
            const [data] = await getTabData({ productReco: 0, pageNum: 1 });
            const [resData] = await getTabDataList(url[this.active]);
            if (!data || !resData) return;
            this.productList = resData.data.productList;
        },
        async changeTab() {
            const [resData] = await getTabDataList(url[this.active]);
            if (!resData) return;
            this.productList = resData.data.productList;
        },
    },
};
</script>

<style lang="scss" scoped>
.home {
}
</style>
