<template>
    <div class="best-seller">
        <div class="best-title">{{title}}</div>
        <div class="seller-list">
            <div class="seller-item" v-for="item in bestSellerData" :key="item.url" @click="goBookDetail(item._id)">
                <div>
                    <img class="item-img" v-lazy="item.url" alt="">
                </div>
                <div class="seller-title">{{item.title}}</div>
                <div class="seller-author">{{item.author}}</div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            title: {
                type: String
            },
            bestSellerData: {
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
.best-seller{
    margin: 80px 0;
    
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