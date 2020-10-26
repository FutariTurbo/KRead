<template>
    <div class="finished-book">
        <!-- 完本大作 -->
        <div class="finished-box">
            <div class="finished-title">完本大作</div>
            <div class="finished-info" @click="goBookDetail(oneBookData[0]._id)">
                <div class="info-content">
                    <div class="content">
                        {{oneBookData[0].shortIntro}}
                    </div>
                    <div class="title">《{{oneBookData[0].title}}》</div>
                    <div>{{oneBookData[0].author}}</div>
                </div>
                <div>
                    <img class="item-img" :src="oneBookData[0].cover" alt="">
                </div>
            </div>
        </div>
        <!-- 引入组件 -->
        <Horizontal @goBookDetail="goBookDetail" :bestSellerData="classicBoyBookData" :title="classicBoyTitle" />
        <Horizontal @goBookDetail="goBookDetail" :bestSellerData="classicGirlBookData" :title="classicGirlTitle" />
        <Recommend @goBookDetail="goBookDetail" :bookData="finishedClassicBookData" :recommendTitle="finishedClassiclTitle" />
    </div>
</template>

<script>
import Recommend from '../components/Recommend'
import Horizontal from '../components/Horizontal'
import {bookData} from '../assets/js/bookData'
    export default {
        components: {
            Recommend,
            Horizontal
        },
        data() {
            return {
                classicBoyBookData: [],
                classicBoyTitle: '男生经典',
                classicGirlBookData: [],
                classicGirlTitle: '女生经典',
                finishedClassicBookData: [],
                finishedClassiclTitle: '完结经典',
                oneBookData: []
            }
        },
        created() {
            this.oneBookData = bookData.finishedData
            this.getClassicBookData()
            this.getClassicGirlBookData()
            this.getFinishedClassicBookData()
        },
        methods: {
            // 获取男生经典
            getClassicBookData(){
                this.$toast.loading({
                    message: '加载中...',
                    forbidClick: true,
                    duration: 0,
                }),
                this.axios({
                    method: 'GET',
                    url: '/book/by-categories?gender=male&type=over&major=奇幻&minor=&start=0&limit=4',
                }).then(res => {
                    console.log('res ==> ', res)
                    this.$toast.clear();
                    if(res.status === 200){
                        this.classicBoyBookData = res.data.books
                        this.classicBoyBookData.forEach( data => {
                            data.url = this.$store.state.imgHeader + data.cover
                        })
                    }
                }).catch(err => {
                    console.log('err ==> ', err);
                    this.$toast.clear();
                })
            },
            // 获取女生经典
            getClassicGirlBookData(){
                this.$toast.loading({
                    message: '加载中...',
                    forbidClick: true,
                    duration: 0,
                }),
                this.axios({
                    method: 'GET',
                    url: '/book/by-categories?gender=female&type=over&major=古代言情&minor=&start=3&limit=5',
                }).then(res => {
                    console.log('res ==> ', res)
                    this.$toast.clear();
                    if(res.status === 200){
                        this.classicGirlBookData = res.data.books.slice(0, 4)
                        this.classicGirlBookData.forEach( data => {
                            data.url = this.$store.state.imgHeader + data.cover
                        })
                    }
                }).catch(err => {
                    console.log('err ==> ', err);
                    this.$toast.clear();
                })
            },
            // 获取完结经典
            getFinishedClassicBookData(){
                this.$toast.loading({
                    message: '加载中...',
                    forbidClick: true,
                    duration: 0,
                }),
                this.axios({
                    method: 'GET',
                    url: '/book/by-categories?gender=female&type=over&major=科幻&minor=&start=0&limit=8',
                }).then(res => {
                    console.log('res ==> ', res)
                    this.$toast.clear();
                    if(res.status === 200){
                        this.finishedClassicBookData = res.data.books
                        this.finishedClassicBookData.forEach( data => {
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
        },
    }
</script>

<style lang="scss" scoped>
.finished-book{
    background-color: #fff;
    padding: 40px 30px;
    padding-bottom: 100px;
    .finished-title{
        font-size: 32px;
        color: #333;
        font-weight: bold;
        letter-spacing: 1px;
    }
    .finished-info{
        display: flex;
        padding: 30px 30px;
        background-color: #f5f7f9;
        border-radius: 10px;
        margin-top: 40px;
    }
    .info-content{
        flex: 1;
        margin-right: 20px;
        
    }
    .item-img{
        width: 158px;
        height: 216px;
        border-radius: 10px;
    }
    .content{
        font-size: 26px;
        line-height: 46px;
        color: #333;
        letter-spacing: 1px;
        overflow : hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
    }
    .title{
        font-size: 26px;
        line-height: 46px;
        color: #333;
        margin-left: -10px;
        margin-bottom: 10px;
    }
}
</style>