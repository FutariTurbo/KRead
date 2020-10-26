<template>
    <div class="searth-result">
        <!-- 导航栏 -->
        <van-nav-bar
            left-arrow
            :border="false"
            @click-left="goBack"
            :fixed="true"
            title="搜索结果"
        />
        <!-- 搜索结果列表 -->
        <div class="recommend-list">
            <div class="recommend-item" v-for="item in bookData" :key="item._id" @click="goBookDetail(item._id)">
                <div>
                    <img class="item-img" v-lazy="item.url" alt="">
                </div>
                <div class="item-desc">
                    <div class="item-title">{{item.title}}</div>
                    <div class="item-info">{{item.shortIntro}}</div>
                    <div class="item-author">
                        <div class="author-name">{{item.author}}</div>
                        <div>
                            <van-tag class="tag" plain color="#52c2a9" type="primary">{{item.cat}}</van-tag>
                            <van-tag plain color="#c6c7ca" type="primary">{{item.latelyFollower | million}}</van-tag>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- 空状态 -->
        <van-empty
            class="custom-image"
            :image='require("../assets/images/nodata_search.png")'
            description="对不起，没有找到您想要的书"
            v-if="bookData.length === 0"
        />
    </div>
</template>

<script>
    export default {
        data() {
            return {
                bookData: []
            }
        },
        beforeRouteEnter(to,from,next){
            next(vm=>{
             vm.getBookData()
            })
        },
        methods: {
            // 返回
            goBack(){
                this.$router.go(-1)
            },
            // 获取搜索结果
            getBookData(){
                this.$toast.loading({
                    message: '加载中...',
                    forbidClick: true,
                    duration: 0,
                }),
                this.axios({
                    method: 'GET',
                    url: `/book/fuzzy-search?query=${this.$route.query.value}`
                }).then(res => {
                    console.log('res ==> ', res)
                    this.$toast.clear();
                    if(res.status === 200){
                        this.bookData = res.data.books
                        this.bookData.forEach(v =>{
                            v.url = this.$store.state.imgHeader + v.cover
                        })
                    }
                }).catch(err => {
                    console.log('err ==> ', err);
                    this.$toast.clear();
                })
            },
            // 跳转书籍详情
            goBookDetail(id){
                this.$router.push({name: 'BookDetail', query: {id}})
            }
        }
    }
</script>

<style lang="scss" scoped>
.searth-result{
    padding-top: 92px;
    /deep/.van-nav-bar .van-icon{
        color: #333;
        font-weight: bold;
    }
    .recommend-list{
        background-color: #fff;
        padding: 0 30px;
    }
    .item-img{
        width: 138px;
        height: 176px;
        border-radius: 10px;
    }
    .recommend-item{
        display: flex;
        padding: 20px 0;
    }
    .item-desc{
        margin-left: 20px;
        border-bottom: 1px solid #efefef;
        padding-bottom: 20px;
    }
    .item-title{
        font-size: 28px;
        margin-bottom: 30px;
        margin-top: 5px;
        color: #333;
        letter-spacing: 1px;
    }
    .item-info{
        font-size: 26px;
        margin-bottom: 20px;
        color: #9c9da0;
        line-height: 34px;
        overflow : hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
    }
    .item-author{
        display: flex;
        justify-content: space-between;
    }
    .author-name{
        font-size: 26px;
        color: #9c9da0;
    }
    .tag{
        margin-right: 10px;
    }
}
</style>