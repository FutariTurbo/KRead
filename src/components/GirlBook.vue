<template>
    <div class="girlbook">
        <!-- 引用组件 -->
        <Recommend @goBookDetail="goBookDetail" :bookData="bookData" :recommendTitle="recommendTitle"/>
        <Horizontal @goBookDetail="goBookDetail" :bestSellerData="bestSellerData" :title="title"/>
        <Recommend @goBookDetail="goBookDetail" :bookData="boyNewBookData" :recommendTitle="newTitle"/>
        <Horizontal @goBookDetail="goBookDetail" :bestSellerData="boyWorksBookData" :title="worksTitle"/>
    </div>
</template>

<script>
import Recommend from '../components/Recommend'
import Horizontal from '../components/Horizontal'
    export default {
        components: {
            Recommend,
            Horizontal
        },
        data() {
            return {
                bookData: [],
                recommendTitle: '编辑力荐',
                bestSellerData: [],
                title: '女生必读',
                boyNewBookData: [],
                newTitle: '畅销新书',
                boyWorksBookData: [],
                worksTitle: '热门作品'
            }
        },
        created() {
            this.getBoyRecommendBookData()
            this.getBoyHotBookData()
            this.getBoyNewBookData()
            this.getBoyWorksBookData()
        },
        methods: {
            // 获取编辑力荐
            getBoyRecommendBookData(){
                this.$toast.loading({
                    message: '加载中...',
                    forbidClick: true,
                    duration: 0,
                }),
                this.axios({
                    method: 'GET',
                    url: '/book/by-categories?gender=female&type=hot&major=现代言情&minor=&start=0&limit=4',
                }).then(res => {
                    console.log('res ==> ', res)
                    this.$toast.clear();
                    if(res.status === 200){
                        this.bookData = res.data.books.slice(0, 3)
                        this.bookData.forEach( data => {
                            data.url = this.$store.state.imgHeader + data.cover
                        })
                    }
                }).catch(err => {
                    console.log('err ==> ', err);
                    this.$toast.clear();
                })
            },
            // 获取女生必读
            getBoyHotBookData(){
                this.$toast.loading({
                    message: '加载中...',
                    forbidClick: true,
                    duration: 0,
                }),
                this.axios({
                    method: 'GET',
                    url: '/book/by-categories?gender=female&type=hot&major=青春校园&minor=&start=4&limit=8',
                }).then(res => {
                    console.log('res ==> ', res)
                    this.$toast.clear();
                    if(res.status === 200){
                        this.bestSellerData = res.data.books.slice(0, 8)
                        this.bestSellerData.forEach( data => {
                            data.url = this.$store.state.imgHeader + data.cover
                        })
                    }
                }).catch(err => {
                    console.log('err ==> ', err);
                    this.$toast.clear();
                })
            },
            // 获取畅销新书
            getBoyNewBookData(){
                this.$toast.loading({
                    message: '加载中...',
                    forbidClick: true,
                    duration: 0,
                }),
                this.axios({
                    method: 'GET',
                    url: '/book/by-categories?gender=female&type=new&major=玄幻奇幻&minor=&start=0&limit=4',
                }).then(res => {
                    console.log('res ==> ', res)
                    this.$toast.clear();
                    if(res.status === 200){
                        this.boyNewBookData = res.data.books.slice(0, 3)
                        this.boyNewBookData.forEach( data => {
                            data.url = this.$store.state.imgHeader + data.cover
                        })
                    }
                }).catch(err => {
                    console.log('err ==> ', err);
                    this.$toast.clear();
                })
            },
            // 获取热门作品
            getBoyWorksBookData(){
                this.$toast.loading({
                    message: '加载中...',
                    forbidClick: true,
                    duration: 0,
                }),
                this.axios({
                    method: 'GET',
                    url: '/book/by-categories?gender=female&type=hot&major=古代言情&minor=&start=2&limit=4',
                }).then(res => {
                    console.log('res ==> ', res)
                    this.$toast.clear();
                    if(res.status === 200){
                        this.boyWorksBookData = res.data.books.slice(0, 4)
                        this.boyWorksBookData.forEach( data => {
                            data.url = this.$store.state.imgHeader + data.cover
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
.girlbook{
    background-color: #fff;
    padding: 40px 30px;
}
</style>