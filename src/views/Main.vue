<template>
    <div class="main">
        <keep-alive include="Bookshelf,BookStore, Classify">
            <transition name="fade">
                <router-view></router-view>
            </transition>
        </keep-alive>
        <!-- 底部tabbar -->
        <div class="tabbar">
            <van-tabbar v-model="tabbarIndex" active-color="#de2323" route>
                <van-tabbar-item v-for="(item, index) in tabbarData" :key="index" :to="item.url">
                    <span>{{item.title}}</span>
                    <template #icon="props">
                    <img :src="props.active ? item.icon.active : item.icon.inactive" />
                    </template>
                </van-tabbar-item>
            </van-tabbar>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                tabbarIndex: 0,
                tabbarData: [
                    {
                        title: '书架',             
                        icon: {
                            active: require('../assets/images/tab_shelf_press.png'),
                            inactive: require('../assets/images/tab_shelf_normal.png')
                        },
                        url: {
                            name: 'Bookshelf'
                        }
                    },
                    {
                        title: '书城',             
                        icon: {
                            active: require('../assets/images/tab_store_press.png'),
                            inactive: require('../assets/images/tab_store_normal.png')
                        },
                        url: {
                            name: 'BookStore'
                        }
                    },
                    {
                        title: '分类',             
                        icon: {
                            active: require('../assets/images/tab_classify_press.png'),
                            inactive: require('../assets/images/tab_classify_normal.png')
                        },
                        url: {
                            name: 'Classify'
                        }
                    }
                ]
            }
        }
    }
</script>

<style lang="scss" scoped>
.main{
    padding-bottom: 50px;
    .fade-enter-active, 
    .fade-leave-avtive {
        transition: opacity 2s;
    }
    .fade-enter, 
    .fade-leave-to {
        opacity: 0
    }
}
</style>