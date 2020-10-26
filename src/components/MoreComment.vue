<template>
    <div class="more-comment">
        <!-- 导航栏 -->
        <van-nav-bar
            left-arrow
            :border="false"
            @click-left="goBack"
            :fixed="true"
            title="更多评论"
        />
        <!-- 评论列表 -->
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
</template>

<script>
import {formatUpdatedTime} from '../assets/js/tool.js'
    export default {
        data() {
            return {
                commentData: []
            }
        },
        created() {
            this.getCommentData()
        },
        methods: {
            // 返回
            goBack(){
                this.$router.go(-1)
            },
            // 获取评论
            getCommentData(){
                this.$toast.loading({
                    message: '加载中...',
                    forbidClick: true,
                    duration: 0,
                }),
                this.axios({
                    method: 'GET',
                    url: `/post/review/best-by-book?book=${this.$route.query.id}&limit=30`,
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
            }
        }
    }
</script>

<style lang="scss" scoped>
.more-comment{
    padding-top: 92px;
    /deep/.van-nav-bar .van-icon{
        color: #333; 
        font-weight: bold;
    }
    .comment-item{
        padding: 30px;
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
}

</style>