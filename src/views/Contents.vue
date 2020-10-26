<template>
    <div class="contents">
        <!-- 导航栏 -->
        <van-nav-bar
            title="目录"
            left-arrow
            @click-left="goBack"
            :fixed="true"
        >
            <template #right>
                <div @click="reverse">
                    <img v-if="!isAscDesc" class="contents-img" src="../assets/images/catalog_reverse.png" alt="">
                    <img v-if="isAscDesc" class="contents-img" src="../assets/images/catalog_sequent.png" alt="">
                </div>
            </template>
        </van-nav-bar>
        <van-sticky :offset-top="46">
            <div class="contents-title">正文</div>
        </van-sticky>
        <!-- 目录列表 -->
        <div class="contents-list">
            <van-cell @click="goRead(url, index+1)" :title="i.num" v-for="(i,index) in contentsData" :key="i.url"/>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                url: this.$route.query.url,
                contentsData: [],
                isAscDesc: false,
                bookId: this.$route.query.bookId,
                bookChapter: 1,
                chapter: this.$route.query.chapter
            }
        },
        created() {
            this.getBookContentsData()
            this.$nextTick(()=>{
                window.scroll(0, 0)
            })
        },
        methods: {
            // 返回
            goBack(){
                this.$router.go(-1)
            },
            // 获取目录
            getBookContentsData(){
                this.$toast.loading({
                    message: '加载中...',
                    forbidClick: true,
                    duration: 0,
                }),
                this.axios({
                    method: 'GET',
                    url: 'http://47.114.147.221/?xsurl1='+ this.url,
                }).then(res => {
                    console.log('res ==> ', res);
                    this.$toast.clear();
                    if(res.data.code === 0){
                        this.contentsData = res.data.list
                        
                    }
                }).catch(err => {
                    console.log('err ==> ', err);
                    this.$toast.clear();
                })
            },
            // 排序
            reverse(){
                this.contentsData = this.contentsData.reverse()
                this.isAscDesc = !this.isAscDesc
            },
            // 跳转阅读
            goRead(url, bookChapter){
                if(this.isAscDesc){
                    this.bookChapter = bookChapter
                }else{
                    this.bookChapter = this.contentsData.length - bookChapter
                }
                this.$router.push({name: 'Read', query: {url, bookChapter}})
            }
        }
    }
</script>

<style lang="scss" scoped>
.contents{
    position: relative;
    padding-top: 92px;
    /deep/.van-nav-bar .van-icon,
    /deep/.van-nav-bar__title{
        color: #333; 
        font-weight: bold;
    }
    .contents-title{
        background-color: #f6f7f9;
        padding: 20px 40px;
    }
    .contents-img{
        width: 50px;
        height: 50px;
    }
    .active{
        color: #ff8b07;
    }
}
</style>