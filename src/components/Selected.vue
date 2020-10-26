<template>
    <div class="selected">
        <!-- 轮播图 -->
        <div class="banner">
            <van-swipe @change="onChange" :autoplay="3000">
                <van-swipe-item v-for="item in bannerList" :key="item.src" @click="goBookDetail(item._id)">
                    <img class="auto-img" :src="item.src" alt="">
                </van-swipe-item>
                <template #indicator>
                    <div class="custom-indicator">
                    {{current + 1}} / {{bannerList.length}}
                    </div>
                </template>
            </van-swipe>
        </div>
        <!-- 编辑力荐 -->
        <div class="recommend">
            <div class="recommend-title">编辑力荐</div>
            <div class="recommend-list">
                <div class="recommend-item" v-for="item in recommendBookData" :key="item.cover" @click="goBookDetail(item._id)">
                    <div>
                        <img class="auto-img item-img" v-lazy="item.cover" alt="">
                    </div>
                    <div class="item-desc">
                        <div class="item-title">{{item.title}}</div>
                        <div class="item-info">{{item.shortIntro}}</div>
                        <div class="item-author">
                            <div class="author-name">{{item.author}}</div>
                            <div>
                                <van-tag class="tag" plain :color="item.isSerial ? '#52c2a9' : '#ff781c'" type="primary">{{item.isSerial ? '连载' : '完结'}}</van-tag>
                                <van-tag plain color="#fc6878" type="primary">{{item.cat}}</van-tag>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- 畅销精选 -->
        <div class="best-seller">
            <div class="best-title">畅销精选</div>
            <div class="seller-list">
                <div class="seller-item" v-for="item in bestSellerBookData" :key="item.cover" @click="goBookDetail(item._id)">
                    <div>
                        <img class="auto-img item-img" v-lazy="item.cover" alt="">
                    </div>
                    <div class="seller-title">{{item.title}}</div>
                    <div class="seller-author">{{item.author}}</div>
                </div>
            </div>
        </div>
        <!-- 广告 -->
        <div class="adv"></div>
        <!-- 男生必读 -->
        <div class="boy">
            <div class="recommend-title">男生必读</div>
            <div class="recommend-list">
                <div class="recommend-item" v-for="item in boyBookData" :key="item.url" @click="goBookDetail(item._id)">
                    <div>
                        <img class="auto-img item-img" v-lazy="item.url" alt="">
                    </div>
                    <div class="item-desc">
                        <div class="item-title">{{item.title}}</div>
                        <div class="item-info">{{item.shortIntro}}</div>
                        <div class="item-author">
                            <div class="author-name">{{item.author}}</div>
                            <div>
                                <van-tag class="tag" plain :color="item.isSerial ? '#52c2a9' : '#ff781c'" type="primary">{{item.isSerial ? '连载' : '完结'}}</van-tag>
                                <van-tag plain color="#fc6878" type="primary">{{item.minorCate}}</van-tag>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- 女生爱看 -->
        <div class="girl">
            <div class="recommend-title">女生爱看</div>
            <div class="recommend-list">
                <div class="recommend-item" v-for="item in girlBookData" :key="item.url" @click="goBookDetail(item._id)">
                    <div>
                        <img class="auto-img item-img" v-lazy="item.url" alt="">
                    </div>
                    <div class="item-desc">
                        <div class="item-title">{{item.title}}</div>
                        <div class="item-info">{{item.shortIntro}}</div>
                        <div class="item-author">
                            <div class="author-name">{{item.author}}</div>
                            <div>
                                <van-tag class="tag" plain :color="item.isSerial ? '#52c2a9' : '#ff781c'" type="primary">{{item.isSerial ? '连载' : '完结'}}</van-tag>
                                <van-tag plain color="#fc6878" type="primary">{{item.minorCate}}</van-tag>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- 往期专题 -->
        <div class="previous-topics">
            <div class="recommend-title">往期专题</div>
            <div class="previous-topics-box">
                <div v-for="item in previousTopicsList" :key="item.src">
                    <img class="previous-topics-img" :src="item.src" alt="">
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {bookData} from '../assets/js/bookData'
    export default {
        data() {
            return { 
                current: 0,
                bannerList: [
                    {src: require('../assets/images/banner_01.jpeg'), _id: '5f48c35362e69b87a8586109'},
                    {src: require('../assets/images/banner_02.jpeg'), _id: '5eb5230a2c29728b2e56a042'},
                    {src: require('../assets/images/banner_03.jpeg'), _id: '5f48c35562e69b0661586758'},
                    {src: require('../assets/images/banner_04.jpeg'), _id: '5f48c35337b4dcc97c1c0c1d'},
                ],
                recommendBookData:[],
                bestSellerBookData: [],
                boyBookData: [],
                girlBookData: [],
                previousTopicsList: [
                    {src: require('../assets/images/previous_topics_01.jpeg')},
                    {src: require('../assets/images/previous_topics_02.jpeg')},
                    {src: require('../assets/images/previous_topics_03.jpeg')},
                    {src: require('../assets/images/previous_topics_04.jpeg')}
                ]
            }
        },
        created() {
            this.recommendBookData = bookData.recommendListData
            this.bestSellerBookData = bookData.bestSellerData
            this.getBoyBookData()
            this.getGirlBookData()
        },
        methods: {
            // 轮播图数字
            onChange(index) {
                this.current = index;
            },
            // 获取男生书籍
            getBoyBookData(){
                this.$toast.loading({
                    message: '加载中...',
                    forbidClick: true,
                    duration: 0,
                }),
                this.axios({
                    method: 'GET',
                    url: '/book/by-categories?gender=male&type=hot&major=武侠&minor=&start=0&limit=2',
                }).then(res => {
                    console.log('res ==> ', res)
                    this.$toast.clear();
                    if(res.status === 200){
                        this.boyBookData = res.data.books
                        this.boyBookData.forEach( data => {
                            data.url = this.$store.state.imgHeader + data.cover
                        })
                    }
                }).catch(err => {
                    console.log('err ==> ', err);
                    this.$toast.clear();
                })
            },
            // 获取女生书籍
            getGirlBookData(){
                this.$toast.loading({
                    message: '加载中...',
                    forbidClick: true,
                    duration: 0,
                }),
                this.axios({
                    method: 'GET',
                    url: '/book/by-categories?gender=female&type=hot&major=青春校园&minor=&start=0&limit=3',
                }).then(res => {
                    console.log('res ==> ', res)
                    this.$toast.clear();
                    if(res.status === 200){
                        this.girlBookData = res.data.books
                        this.girlBookData.forEach( data => {
                            data.url = this.$store.state.imgHeader + data.cover
                        })
                    }
                }).catch(err => {
                    console.log('err ==> ', err);
                    this.$toast.clear();
                })
            },
            // 跳转到书籍详情
            goBookDetail(id){
                this.$router.push({name: 'BookDetail', query: {id}})
            }
        }
    }
</script>

<style lang="scss" scoped>
.selected{
    padding-bottom: 80px;
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
        margin: 30px;
        border-radius: 10px;
        overflow: hidden;
    }
    .recommend{
        margin: 80px 30px;
    }
    .recommend-title{
        font-size: 32px;
        color: #333;
        font-weight: bold;
        letter-spacing: 1px;
    }
    .item-img{
        width: 138px;
        height: 176px;
        border-radius: 10px;
    }
    .recommend-item{
        display: flex;
        margin: 30px 0;
    }
    .item-desc{
        margin-left: 20px;
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
        // word-wrap: break-word;
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
    .best-seller{
        margin: 80px 30px;
    }
    .best-title{
        font-size: 32px;
        color: #333;
        font-weight: bold;
        letter-spacing: 1px;
    }
    .seller-list{
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
    }
    .seller-item{
        margin-top: 30px;
    }
    .seller-title{
        width: 150px;
        line-height: 40px;
        font-size: 28px;
        margin-top: 20px;
        margin-bottom: 10px;
        color: #333;
        overflow : hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        letter-spacing: 1px;
    }
    .adv{
        background-image: url(~@/assets/images/advance.jpeg);
        background-position: 100%;
        background-size: 100% 100%;
        height: 170px;
        margin: 0 30px;
        border-radius: 10px;
    }
    .boy,
    .girl{
        margin: 80px 30px;
    }
    .previous-topics{
        margin: 0 30px;
    }
    .previous-topics-box{
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        margin-top: 30px;
    }
    .previous-topics-img{
        width: 330px;
        margin-bottom: 30px;
        border-radius: 10px;
    }
}
</style>