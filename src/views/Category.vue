<template>
    <div class="category">
        <!-- 导航栏 -->
        <van-nav-bar
            left-arrow
            :border="false"
            @click-left="goBack"
            :fixed="true"
            :title="title"
        />
        <!-- 类别选择 -->
        <div class="category-select">
            <div class="select-title active" @click="selectType">
                <span>{{selectTitle}}</span>
                <img v-show="!isShow" class="select-img" src="../assets/images/icon_selected.png" alt="">
                <img v-show="isShow" class="select-img" src="../assets/images/icon_popshow.png" alt="">
            </div>
            <div class="select-title" :class="isSort ? 'active' : ''" @click="sort">最畅销</div>
        </div>
        <!-- 类别选项 -->
        <div v-show="isShow" class="selected">
            <div class="selected-item" :class="item.isActive ? 'active' : ''" v-for="(item, index) in checkerTypeOptions" :key="index" @click="toggleType(item)">{{item.text}}</div>
        </div>
        <!-- 类别列表 -->
        <div class="recommend-list">
            <div class="recommend-item" v-for="item in categoryData" :key="item._id" @click="goBookDetail(item._id)">
                <div>
                    <img class="item-img" v-lazy="item.url" alt="">
                </div>
                <div class="item-desc">
                    <div class="item-title">{{item.title}}</div>
                    <div class="item-info">{{item.shortIntro}}</div>
                    <div class="item-author">
                        <div class="author-name">{{item.author}}</div>
                        <div>
                            <van-tag class="tag" plain color="#fc6878" type="primary">{{item.minorCate}}</van-tag>
                            <van-tag plain color="#c6c7ca" type="primary">{{item.latelyFollower | million}}</van-tag>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- 空状态 -->
        <van-empty
            class="custom-image"
            :image='require("../assets/images/nodata_book_cover.png")'
            description="未找到该类型的书"
            v-if="categoryData.length === 0"
        />
    </div>
</template>

<script>
    export default {
        data() {
            return {
                title: this.$route.query.name,
                isShow: false,
                isSort: false,
                checkerTypeOptions: [
                    { value: "hot", text: "热门", isActive: true},
                    { value: "new", text: "新书", isActive: false },
                    { value: "reputation", text: "好评", isActive: false },
                    { value: "over", text: "完结", isActive: false },
                    { value: "monthly", text: "包月", isActive: false }
                ],
                checkerType: "hot",
                checkerClassifyChild: 'all',
                categoryData: [],
                selectTitle: '热门'
            }
        },
        created() {
            this.getCategoryData(this.checkerType)
        },
        methods: {
            // 返回
            goBack(){
                this.$router.go(-1)
            },
            // 显示或隐藏类别
            selectType(){
                this.isShow = !this.isShow
            },
            // 切换类别
            toggleType(item){
                if(item.isActive){
                    return
                }
                for(let i = 0; i < this.checkerTypeOptions.length; i++){
                    if(this.checkerTypeOptions[i].isActive){
                        this.checkerTypeOptions[i].isActive = false
                    }
                }
                item.isActive = true
                this.selectTitle = item.text
                this.getCategoryData(item.value)
            },
            // 获取类别
            getCategoryData(checkerType){
                this.$toast.loading({
                    message: '加载中...',
                    forbidClick: true,
                    duration: 0,
                }),
                this.axios({
                    method: 'GET',
                    url: `/book/by-categories?gender=${this.$route.query.gender}&type=${checkerType}&major=${this.$route.query.name}&minor=${this.checkerClassifyChild === "all"? "": this.checkerClassifyChild}&start=0&limit=20`,
                }).then(res => {
                    console.log('res ==> ', res)
                    this.$toast.clear();
                    if(res.status === 200){
                        this.categoryData = res.data.books
                        this.categoryData.forEach(v =>{
                            v.url = this.$store.state.imgHeader + v.cover
                        })
                    }
                }).catch(err => {
                    console.log('err ==> ', err);
                    this.$toast.clear();
                })
            },
            // 畅销排序
            sort(){
                this.isSort = !this.isSort
                this.categoryData.sort((a,b) =>{
                    if(this.isSort){
                        return b.latelyFollower - a.latelyFollower;
                    }else{
                        return a.latelyFollower - b.latelyFollower;
                    }
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
.category{
    padding-top: 92px;
    /deep/.van-nav-bar .van-icon{
        color: #333; 
        font-weight: bold;
    }
    /deep/.van-dropdown-menu__bar{
        box-shadow: none;
        border-bottom: 1px solid #f2f2f2;
    }
    .category-select{
        display: flex;
        padding: 20px;
        justify-content: space-around;
        border-bottom: 1px solid #f2f2f2;
        // color: #333;
        font-size: 28px;
        letter-spacing: 1px;
    }
    .select-title{
        &.active{
            color: #333;
        }
    }
    .select-img{
        width: 12px;
        margin-left: 10px;
        margin-bottom: 3px;
    }
    .selected{
        display: flex;
        justify-content: space-around;
        padding-top: 30px;
    }
    .selected-item{
        padding: 10px 34px;
        background-color: #f6f7f9;
        border-radius: 5px;
        color: #333;
        font-size: 26px;
        letter-spacing: 1px;
        &.active{
            background-color: #ffecee;
            color: #f81d1c;
        }
    }
    .item-img{
        width: 138px;
        height: 176px;
        border-radius: 10px;
    }
    .recommend-list{
        padding: 0 30px;
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
}
</style>