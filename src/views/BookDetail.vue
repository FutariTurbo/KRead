<template>
    <div class="book-detail">
        <div class="book-detail-bg">
            <!-- 导航栏 -->
            <van-nav-bar
                left-arrow
                :border="false"
                @click-left="goBack"
                :fixed="true"
                :title="bookDetailData.title"
            />
            <!-- 详情书籍信息 -->
            <div class="detail-info">
                <div>
                    <img class="detail-img" v-lazy="bookDetailData.cover" alt="">
                </div>
                <div class="info-desc">
                    <div class="desc-title">{{bookDetailData.title}}</div>
                    <div class="desc-author">{{bookDetailData.author}}</div>
                    <div class="desc-type">
                        <div class="type-item">{{bookDetailData.cat}}</div>
                        <div class="type-item">{{bookDetailData.wordCount | million}}字</div>
                        <div class="type-item">{{bookDetailData.isSerial ? '连载中' : '完结'}}</div>
                    </div>
                </div>
            </div>
        </div>
        <!-- 书籍人气 -->
        <div class="total-ranking-box">
            <div class="total-ranking">
                <div>
                    <div>追书人气</div>
                    <div class="total-num">{{bookDetailData.latelyFollower | million}}</div>
                </div>
                <div>
                    <div>日更字数</div>
                    <div class="total-num">{{bookDetailData.totalFollower | million}}</div>
                </div>
                <div>
                    <div>总保留率</div>
                    <div class="total-num">{{bookDetailData.retentionRatio}}%</div>
                </div>
            </div>
        </div>
        <!-- 书籍介绍 -->
        <div class="introduce-box">
            <div class="introduce">
                <div class="introduce-title" :class="isExpend ? '' : 'ellipsis'" @click="toggleExpend">
                    {{bookDetailData.longIntro}}
                </div>
                <div class="introduce-type">
                    <div class="type-item" v-for="tag in bookDetailData.tags" :key="tag">{{tag}}</div>
                </div>
            </div>
        </div>
        <!-- 目录 -->
        <van-cell @click="goBookContent" :border="false" :title="bookDetailData.lastChapter" is-link :icon="require('../assets/images/book_catalog.png')" />
        <!-- 评论 -->
        <div class="comment">
            <div class="comment-title">
                <div class="title-hot">热门书评</div>
                <div v-if="commentData.length !== 0" @click="goMoreComment">更多评论</div>
            </div>
            <van-empty
                class="custom-image"
                :image='require("../assets/images/nodata_comment_icon.png")'
                description="该书还暂无评论！"
                v-if="commentData.length === 0"
            />
            <div class="comment-item" v-for="item in commentData" :key="item.id">
                <div class="comment-info">
                    <div>
                        <img class="comment-img" v-lazy="item.avatar" alt="">
                    </div>
                    <div class="info-title">
                        <div class="info-nickname">{{item.nickname}}</div>
                        <div class="info-like">
                            <div>{{item.time}}</div>
                            <div>{{item.likeCount}}人喜欢</div>
                        </div>
                    </div>
                </div>
                <div class="comment-type">{{item.title}}</div>
                <div class="comment-desc">{{item.content}}</div>
            </div>
        </div>
        <!-- 推荐 -->
        <div class="best-seller">
            <div class="best-title">相关推荐</div>
            <div class="seller-list">
                <div class="seller-item" v-for="item in sellerData" :key="item.url" @click="goSearthResult(item.title)">
                    <div>
                        <img class="auto-img item-img" v-lazy="item.url" alt="">
                    </div>
                    <div class="seller-title">{{item.title}}</div>
                </div>
            </div>
        </div>
        <!-- 底部tabBar -->
        <van-goods-action>
            <van-goods-action-icon @click="joinOrRemoveBookShelf" icon="star" :color="isAddBookShelf ? '#f70909' : '#aaa'" :text="isAddBookShelf ? '移出书架': '加入书架'" />
            <van-goods-action-button
                text="立即阅读"
                color="#f70909"
                @click="goRead(bookContent.url, bookDetailData._id, 1)"
            />
        </van-goods-action>
    </div>
</template>

<script>
import {formatUpdatedTime} from '../assets/js/tool.js'
    export default {
        data() {
            return {
                isExpend: false,
                bookDetailData: [],
                sellerListData: [],
                bookId: '',
                isAddBookShelf: false,
                bookContent: [],
                commentData: [],
                chapterIndex: '',
                url: ''
            }
        },
        created() {
            this.bookId = this.$route.query.id
            this.getBookDetailById(this.$route.query.id)
            this.getAll()
        },
        computed: {
            // 相关推荐
            sellerData(){
                return this.sellerListData.slice(0, 4)
            },
        },
        methods: {
            // 返回
            goBack(){
                this.$router.go(-1)
            },
            // 显示或隐藏介绍
            toggleExpend(){
                this.isExpend = !this.isExpend
            },
            // 获取localStorage数据
            getAll() {
                if (window.localStorage.getItem("novelShelf")) {
                    let arr = JSON.parse(window.localStorage.getItem("novelShelf"));
                    for (let i = 0; i < arr.length; i++) {
                        if (arr[i].id === this.bookId) {
                            this.isAddBookShelf = true;
                            break;
                        }
                    }
                }
            },
            // 根据书籍id获取详情
            getBookDetailById(bookId){
                this.$toast.loading({
                    message: '加载中...',
                    forbidClick: true,
                    duration: 0,
                }),
                this.axios({
                    method: 'GET',
                    url: `/book/${bookId}`,
                }).then(res => {
                    console.log('res ==> ', res)
                    this.$toast.clear();
                    if(res.status === 200){
                        res.data.cover = this.$store.state.imgHeader + res.data.cover
                        this.bookDetailData = res.data
                        this.bookDetailData.tags = this.bookDetailData.tags.slice(0, 4)
                        this.getBookContentUrl(this.bookDetailData.title, this.bookDetailData.author)
                        this.getSellerListData(this.bookDetailData.gender[0], this.bookDetailData.majorCate)
                        this.getCommentData(bookId)
                    }
                }).catch(err => {
                    console.log('err ==> ', err);
                    this.$toast.clear();
                })
            },
            // 获取目录
            getBookContentUrl(title, author){
                this.$toast.loading({
                    message: '加载中...',
                    forbidClick: true,
                    duration: 0,
                }),
                this.axios({
                    method: 'GET',
                    url: `http://47.114.147.221/?xsname=${title}`,
                }).then(res => {
                    console.log('nres ==> ', res);
                    this.$toast.clear();
                    if(res.data.code === 0){
                        let contentAuthor = res.data.list.find( v =>
                            v.name === title && v.author === author
                        )
                        let contentName = res.data.list.find( v =>
                            v.name === title
                        )
                        if(contentAuthor){
                            this.bookContent = contentAuthor
                            this.setBookLocalStorage()
                        }else{
                            this.bookContent = contentName
                            this.setBookLocalStorage()
                        }
                    }else{
                        console.log(res.data.message);
                    }
                }).catch(err => {
                    console.log('err ==> ', err);
                    this.$toast.clear();
                })
            },
            // 缓存书籍信息
            setBookLocalStorage(){
                if(window.localStorage.getItem("novelContent")){
                    let arr = JSON.parse(window.localStorage.getItem("novelContent"));
                    for(let i = 0; i < arr.length; i++){
                        if(arr[i].bookId === this.bookId){
                            return
                        }
                    }
                    arr.push({
                        bookContent: this.bookContent,
                        bookId: this.bookId
                    })
                    window.localStorage.setItem("novelContent", JSON.stringify(arr));
                }else{
                    window.localStorage.setItem("novelContent", JSON.stringify([
                        {
                            bookContent: this.bookContent,
                            bookId: this.bookId
                        }
                    ]));
                }
            },
            // 获取推荐
            getSellerListData(gender, majorCate){
                this.$toast.loading({
                    message: '加载中...',
                    forbidClick: true,
                    duration: 0,
                }),
                this.axios({
                    method: 'GET',
                    url: `/book/by-categories?gender=${gender}&type=hot&major=${majorCate}&minor=&start=6&limit=8`,
                }).then(res => {
                    console.log('res ==> ', res)
                    this.$toast.clear();
                    if(res.status === 200){
                        this.sellerListData = res.data.books
                        this.sellerListData.forEach( data => {
                            data.url = this.$store.state.imgHeader + data.cover
                        })
                    }
                }).catch(err => {
                    console.log('err ==> ', err);
                    this.$toast.clear();
                })
            },
            // 获取评论
            getCommentData(bookId){
                this.$toast.loading({
                    message: '加载中...',
                    forbidClick: true,
                    duration: 0,
                }),
                this.axios({
                    method: 'GET',
                    url: `/post/review/best-by-book?book=${bookId}&limit=5`,
                }).then(res => {
                    console.log('res ==> ', res);
                    this.$toast.clear();
                    if(res.status === 200){
                        this.commentData = res.data.reviews.map( v => {
                            if(v !== ''){
                                return {
                                    id: v.author._id,
                                    nickname: v.author.nickname,
                                    avatar: this.$store.state.imgHeader + v.author.avatar,
                                    title: v.title,
                                    content: v.content,
                                    time: formatUpdatedTime(v.updated),
                                    likeCount: v.likeCount
                                }
                            }
                        })
                    }
                }).catch(err => {
                    console.log('err ==> ', err);
                    this.$toast.clear();
                })
            },
            // 移入或移出书架
            joinOrRemoveBookShelf() {
                if (this.isAddBookShelf) {
                    //remove
                    let arr = JSON.parse(window.localStorage.getItem("novelShelf"));
                    for (let i = 0; i < arr.length; i++) {
                        if (arr[i].id === this.bookId) {
                            this.$dialog.confirm({
                                title: '温馨提示',
                                message: '您确定要从书架中移出吗？',
                            }).then(() => {
                                arr.splice(i, 1);
                                if (arr.length > 0) {
                                    window.localStorage.setItem("novelShelf", JSON.stringify(arr));
                                } else {
                                    window.localStorage.removeItem("novelShelf");
                                }
                                this.$toast.success({
                                    message: '移出书架成功',
                                    forbidClick: true,
                                    duration: 300,
                                })
                                this.isAddBookShelf = false
                            })
                        }
                    }
                } else {
                    //add
                    if (window.localStorage.getItem("novelShelf")) {
                        let arr = JSON.parse(window.localStorage.getItem("novelShelf"));
                        let array = JSON.parse(window.localStorage.getItem("novelContent"));
                        for(let i = 0; i < array.length; i++){
                            if(array[i].bookId === this.bookId){
                                arr.push({
                                    id: this.bookId,
                                    name: this.bookDetailData.title,
                                    img: this.bookDetailData.cover,
                                    url: array[i].bookContent.url,
                                    isSerial: this.bookDetailData.isSerial,
                                    chapterIndex: 0
                                });
                            }
                        }
                        window.localStorage.setItem("novelShelf", JSON.stringify(arr));
                    } else {
                        let array = JSON.parse(window.localStorage.getItem("novelContent"));
                        for(let i = 0; i < array.length; i++){
                            if(array[i].bookId === this.bookId){
                                window.localStorage.setItem("novelShelf", JSON.stringify([
                                    {
                                        id: this.bookId,
                                        name: this.bookDetailData.title,
                                        img: this.bookDetailData.cover,
                                        url: array[i].bookContent.url,
                                        isSerial: this.bookDetailData.isSerial,
                                        chapterIndex: 0
                                    }
                                ]))
                            }
                        }
                    }
                    this.isAddBookShelf = true;
                    this.$toast.success({
                        message: '加入书架成功',
                        forbidClick: true,
                        duration: 300,
                    })
                }
            },
            // 跳转目录
            goBookContent(url){
                if(window.localStorage.getItem("novelContent")){
                    let arr = JSON.parse(window.localStorage.getItem("novelContent"))
                    for(let i = 0; i < arr.length; i++){
                        if(arr[i].bookId === this.bookId){
                            url = arr[i].bookContent.url
                        }
                    }
                }
                this.$router.push({name: 'Contents', query: {url}})
            },
            // 跳转阅读
            goRead(url, bookId, bookChapter){
                if(window.localStorage.getItem("novelContent")){
                    let arr = JSON.parse(window.localStorage.getItem("novelContent"))
                    for(let i = 0; i < arr.length; i++){
                        if(arr[i].bookId === this.bookId){
                            url = arr[i].bookContent.url
                        }
                    }
                }
                this.$router.push({name: 'Read', query: {url, bookId, bookChapter}})
            },
            // 跳转更多评论
            goMoreComment(){
                this.$router.push({name: 'MoreComment', query: {id: this.$route.query.id}})
            },
            // 跳转搜索结果
            goSearthResult(value){
                this.$router.push({name: 'SearthResult', query: {value}})
            },
            
        }
    }
</script>

<style lang="scss" scoped>
.book-detail{
    background-color: #f8f9fb;
    /deep/.van-nav-bar {
        background-color: #cccccc;
    }
    /deep/.van-nav-bar .van-icon{
        color: #333; 
        font-weight: bold;
    }
    .book-detail-bg{
        padding-top: 100px;
        height: 280px;
        background-image: url(~@/assets/images/book_detail_bg.png);
        background-size: cover;
        background-color: #fff;
    }
    .detail-info{
        padding: 20px 30px;
        display: flex;
    }
    .detail-img{
        width: 138px;
        height: 176px;
        border-radius: 10px;
    }
    .info-desc{
        margin-left: 30px;
    }
    .desc-title{
        font-size: 30px;
        color: #333;
        font-weight: bold;
        margin-bottom: 60px;
        margin-top: 5px;
    }
    .desc-author{
        font-size: 26px;
        color: #333;
        margin-bottom: 30px;
    }
    .desc-type{
        display: flex;
    }
    .type-item{
        padding: 0 10px;
        border-right: 1px solid #888;
        &:first-child{
            padding-left: 0;
        }
        &:last-child{
            border-right: none;
        }
    }
    .total-ranking-box{
        background-color: #fff;
    }
    .total-ranking{
        display: flex;
        justify-content: space-around;
        text-align: center;
        margin: 0 30px;
        padding-top: 70px;
        padding-bottom: 40px;
        font-size: 26px;
        border-bottom: 1px solid #f7f7f7;
    }
    .total-num{
        color: #333;
        font-size: 34px;
        font-weight: 400;
        margin-top: 30px;
    }
    .introduce-box{
        background-color: #fff;
    }
    .introduce{
        margin: 0 30px;
        padding: 30px 0;
        border-bottom: 1px solid #f7f7f7;
    }
    .introduce-title{
        margin: 10px 0 30px 0;
        color: #333;
        font-size: 26px;
        line-height: 36px;
        position: relative;
    }
    .ellipsis{
        overflow : hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
    }
    .introduce-type{
        display: flex;
        flex-wrap: wrap;
    }
    /deep/.van-cell__title{
        color: #888;
        font-size: 13px;
        margin-left: 5px;
    }
    /deep/.van-goods-action-icon{
        width: 200px;
    }
    /deep/.van-goods-action-button--first,
    .van-goods-action-button--last{
        border-radius: 0;
    }
    .comment{
        background-color: #fff;
        margin-top: 20px;
        padding: 30px 30px;
    }
    .comment-title{
        display: flex;
        justify-content: space-between;
    }
    .comment-not{
        padding: 30px 0;
        font-size: 26px;
    }
    .comment-item{
        padding: 30px 0;
        border-bottom: 1px solid #f7f7f7;
    }
    .comment-info{
        display: flex;
        padding-bottom: 30px;
    }
    .comment-img{
        width: 80px;
        height: 80px;
        border-radius: 50%;
    }
    .info-title{
        flex: 1;
        margin-left: 20px;
    }
    .info-like{
        
        display: flex;
        justify-content: space-between;
    }
    .info-nickname{
        color: #333;
        font-size: 26px;
        font-weight: 400;
        margin-bottom: 20px;
    }
    .comment-desc{
        font-size: 26px;
        line-height: 34px;
        overflow : hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
    }
    .comment-type{
        font-size: 28px;
        color: #333;
        font-weight: 400;
        margin-bottom: 20px;
    }
    .best-seller{
        margin-top: 20px;
        padding: 30px;
        padding-bottom: 120px;
        background-color: #fff;
    }
    .best-title,
    .title-hot{
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
    .item-img{
        width: 138px;
        height: 176px;
        border-radius: 10px;
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
}
</style>