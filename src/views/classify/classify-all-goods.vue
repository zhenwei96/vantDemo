<template>
    <div class="nav">
        <div class="left">
            <van-sidebar class="left" v-model="activeKey">
                <van-sidebar-item v-for="(item, index) in cateList" :key="index" :title="item.title" />
            </van-sidebar>
        </div>
        <div ref="right" class="right">
            <van-tabs :ellipsis="false" v-model="active" v-if="childCategoryList.length">
                <van-tab v-for="(item, index) in childCategoryList" :title="item.title" :key="index"></van-tab>
            </van-tabs>
            <!-- <ClassifyItem v-for="(item, index) in childCategoryList" :itemData="item" :key="index"></ClassifyItem> -->
            <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
                <LoadMore :scrollEl="$refs.right" :onLoadMore="onLoadMore" :enableLoadMore="enableLoadMore">
                    <van-card
                        v-for="(item, index) in listData"
                        :key="index"
                        :price="item.realTimePrice"
                        :desc="item.highOpinion"
                        :title="item.skuName"
                        :thumb="item.imgUrl"
                    />
                </LoadMore>
            </van-pull-refresh>
        </div>
    </div>
</template>

<script>
import { getDataList } from '@/api/classify';
import LoadMore from '@/components/Load-more';

export default {
    name: 'ClassifyAllGoods',
    props: {
        cateList: {
            default: () => [],
        },
    },
    components: { LoadMore },
    data() {
        return {
            activeKey: 0,
            active: 0,
            searchValue: '',
            listData: [],
            isLoading: '',
            enableLoadMore: true,
        };
    },
    computed: {
        childCategoryList() {
            console.log(this.cateList[this.activeKey].childCategoryList);
            return this.cateList[this.activeKey].childCategoryList;
        },
    },
    created() {
        this.getData();
    },
    methods: {
        async getData() {
            const [data] = await getDataList();
            this.listData = data.result.searchCatResultVOList[0].searchResultVOList.slice(0, 10);
        },
        onRefresh() {},
        onLoadMore() {
            debugger;
        },
    },
    watch: {
        active: {
            handler(newVal, oldVal) {
                console.log(newVal, oldVal, this.childCategoryList[newVal]);
            },
        },
    },
};
</script>

<style lang="scss" scoped>
.nav {
    display: flex;
    height: calc(100vh - 148px);
}
.left {
    width: 80px;
    overflow-y: scroll;
    .van-sidebar-item::v-deep {
        padding: 15px 12px;
    }
}
.right {
    flex: 1;
    overflow-y: scroll;
}
</style>
