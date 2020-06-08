<template>
    <div id="app">
        <router-view />
        <van-tabbar v-if="isShowTabbar" v-model="active">
            <van-tabbar-item name="home" replace to="/home" icon="home-o">首页</van-tabbar-item>
            <van-tabbar-item name="classify" replace to="/classify" icon="search">分类</van-tabbar-item>
            <van-tabbar-item name="car" replace to="/home" icon="friends-o">购物车</van-tabbar-item>
            <van-tabbar-item name="mine" replace to="/home" icon="setting-o">我的</van-tabbar-item>
        </van-tabbar>
    </div>
</template>

<script>
import { mapState } from 'vuex';

const mapTab = {
    Classify: 'classify',
    Home: 'home',
};
export default {
    name: 'App',
    computed: {
        ...mapState(['isShowTabbar']),
    },
    data() {
        return {
            active: 'home',
        };
    },
    watch: {
        $route(newVal) {
            this.active = mapTab[newVal.name] || 'home';
        },
    },
};
</script>

<style lang="scss" scope>
html,
body {
    height: 100vh;
    width: 100vw;
}
#app {
    height: calc(100vh - 50px);
    padding-bottom: 50px;
    overflow-y: scroll;
}
</style>
