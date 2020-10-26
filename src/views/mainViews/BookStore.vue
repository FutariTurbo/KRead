<template>
    <div class="book-store">
        <div class="store-header">
            <!-- 搜索框 -->
            <van-search @focus="goSearch" shape="round" v-model="value" placeholder="搜索作者、书籍、关键词" />
            <!-- 标签页 -->
            <van-tabs swipeable sticky v-model="active" background="#ff5344" color="#fff" line-width="16px" title-inactive-color="rgba(255, 255, 255, .8)" title-active-color="#fff">
                <van-tab title="精选">
                    <Selected />
                </van-tab>
                <van-tab title="男生">
                    <BoyBook />
                </van-tab>
                <van-tab title="女生">
                    <GirlBook />
                </van-tab>
                <van-tab title="排行">
                    <Ranking />
                </van-tab>
                <van-tab title="完本">
                    <FinishedBook />
                </van-tab>
            </van-tabs>
        </div>
    </div>
</template>

<script>
    import Selected from '../../components/Selected'
    import BoyBook from '../../components/BoyBook'
    import GirlBook from '../../components/GirlBook'
    import FinishedBook from '../../components/FinishedBook'
    import Ranking from '../../components/Ranking'
    export default {
        name: 'BookStore',
        data() {
            return {
                value: '',
                active: 0,
                
            }
        },
        methods: {
            // 跳转到搜索
            goSearch(){
                this.$router.push({name: 'Search'})
            }
        },
        components: {
            Selected,
            BoyBook,
            GirlBook,
            FinishedBook,
            Ranking
        }
    }
</script>

<style lang="scss" scoped>
.book-store{
    .store-header{
        height: 340px;
        background-image: url(~@/assets/images/personal_bg.jpg);
        background-position: 100% 100%;
        background-size: 100% 100%;
        background-repeat: no-repeat;
    }
    /deep/.van-search{
        background-color: transparent;
    }
    /deep/.van-search__content{
        background-color: rgba(255,255,255,.4);
    }
    ::-webkit-input-placeholder {
        color: #fff;
    }
    /deep/.van-icon{
        color: #fff;
    }
    /deep/.van-tab--active{
        font-weight: bold;
        font-size: 16px;
    }
    /deep/.van-tab__text--ellipsis{
        letter-spacing: 1px;
    }
    /deep/.van-tabs__wrap{
        height: 30px;
    }
    .custom-indicator {
        position: absolute;
        right: 5px;
        bottom: 5px;
        padding: 2px 5px;
        font-size: 12px;
        background: rgba(0, 0, 0, 0.1);
        color: #fff;
    }
    .banner{
        margin: 20px;
        border-radius: 10px;
        overflow: hidden;
    }
}
</style>