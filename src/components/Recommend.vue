<template>
    <div class="recommend">
        <div class="recommend-title">{{recommendTitle}}</div>
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
                            <van-tag class="tag" plain :color="item.isSerial ? '#52c2a9' : '#ff781c'" type="primary">{{item.isSerial ? '连载' : '完结'}}</van-tag>
                            <van-tag plain color="#fc6878" type="primary">{{item.minorCate}}</van-tag>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            recommendTitle: {
                type: String
            },
            bookData: {
                type: Array
            }
        },
        methods: {
            // 跳转书籍详情
            goBookDetail(id){
                this.$emit('goBookDetail', id)
            }
        },
    }
</script>

<style lang="scss" scoped>
.recommend{
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