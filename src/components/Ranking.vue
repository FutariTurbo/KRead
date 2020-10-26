<template>
    <div class="ranking">
        <div class="ranking-box">
            <!-- 男生女生选择 -->
            <div class="sex">
                <span class="sex-box" :class="item.isSelect ? 'sex-active' : ''" v-for="(item, index) in sex" :key="item.type" @click="toggleSex(index)">
                    <img class="sex-img" :src="item.isSelect ? item.active : item.normal" alt="">
                </span>
            </div>
            <div class="menu-container">
                <!-- 类型列表 -->
                <div class="menu-list" ref="menuList">
                    <ul>
                        <li class="menu-item" :class="item.isSelect ? 'active' : ''" v-for="(item, index) in rankingData[selectSex]" :key="index" @click="toggleRanking(index)">{{item.name}}</li>
                    </ul>
                </div>
                <!-- 书籍列表 -->
                <div class="book-list" ref="bookList">
                    <ul>
                        <li>
                            <div class="recommend-list">
                                <div class="recommend-item" v-for="item in rankingData.childData" :key="item.id" @click="goBookDetail(item.id)">
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
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import BScroll from 'better-scroll'
    export default {
        data() {
            return {
                sex: [
                    {
                        type: 'male', 
                        isSelect: true,
                        active: require('../assets/images/category_male.png'),
                        normal: require('../assets/images/category_male_normal.png')
                    },
                    {
                        type: 'female', 
                        isSelect: false,
                        active: require('../assets/images/category_female.png'),
                        normal: require('../assets/images/category_female_normal.png')
                    }
                ],
                rankingData: {
                    male: [],
                    female: [],
                    childData: []
                },
                selectSex: 'male',
            }
        },
        created() {
            this.getRankingData()
        },
        methods: {
            // 获取排行类型
            getRankingData(){
                this.$toast.loading({
                    message: '加载中...',
                    forbidClick: true,
                    duration: 0,
                }),
                this.axios({
                    method: 'GET',
                    url: '/ranking/gender',
                }).then(res => {
                    console.log('res ==> ', res)
                    this.$toast.clear();
                    if(res.status === 200){
                        this.rankingData.male = res.data.male.map( v => {
                            return {
                                id: v._id,
                                name: v.shortTitle,
                                isSelect: false
                            }
                        })
                        this.rankingData.female = res.data.female.map( v => {
                            return {
                                id: v._id,
                                name: v.shortTitle,
                                isSelect: false
                            }
                        })
                        this.rankingData.male[0].isSelect = true;
                        this.rankingData.female[0].isSelect = true;   
                        this.getChildData(this.rankingData.male[0].id)
                        this.initBScoller()
                    }
                }).catch(err => {
                    console.log('err ==> ', err);
                    this.$toast.clear();
                })
            },
            // 获取排行书籍
            getChildData(id){
                this.$toast.loading({
                    message: '加载中...',
                    forbidClick: true,
                    duration: 0,
                }),
                this.axios({
                    method: 'GET',
                    url: `/ranking/${id}`,
                }).then(res => {
                    console.log('res ==> ', res)
                    this.$toast.clear();
                    if(res.status === 200){
                        this.rankingData.childData = res.data.ranking.books.map(v =>{
                            return {
                                id: v._id,
                                author: v.author,
                                title: v.title,
                                shortIntro: v.shortIntro,
                                url: this.$store.state.imgHeader + v.cover,
                                minorCate: v.minorCate,
                                latelyFollower: v.latelyFollower || 0
                            }
                        })
                    }
                    this.rankingData.childData.sort((a,b) =>{
                        return b.latelyFollower - a.latelyFollower;
                    })
                    this.initBScoller()
                }).catch(err => {
                    console.log('err ==> ', err);
                    this.$toast.clear();
                })
            },
            // 初始BScoller
            initBScoller() {
                this.$nextTick(() => {
                    if (!this.menuScroll) {
                        this.menuScroll = new BScroll(this.$refs.menuList, {
                            click: true,
                        });
                    } else {
                        this.menuScroll.refresh();
                    }
                    if (!this.bookScroll) {
                        this.bookScroll = new BScroll(this.$refs.bookList, {
                            click: true,
                        });
                    } else {
                        this.bookScroll.refresh();

                    }
                });
            },
            // 切换男生女生
            toggleSex(index){
                for(let i in this.sex){
                    this.sex[i].isSelect = false
                }
                this.sex[index].isSelect = true
                this.selectSex = this.sex[index].type
                this.toggleRanking(0)
            },
            // 切换排行类型
            toggleRanking(index){
                for(let i in this.rankingData[this.selectSex]){
                    this.rankingData[this.selectSex][i].isSelect = false
                }
                this.rankingData[this.selectSex][index].isSelect = true
                this.getChildData(this.rankingData[this.selectSex][index].id)
            },
            // 跳转书籍详情
            goBookDetail(id){
                this.$router.push({name: 'BookDetail', query: {id}})
            }
        },
        beforeDestroy() {
            if (this.menuScroll) {
                this.menuScroll.destroy();
            }
            if (this.bookScroll) {
                this.bookScroll.destroy();
            }
        }
    }
</script>

<style lang="scss" scoped>
.ranking{
    background-color: #fff;
    position: fixed;
    top: 168px;
    right: 0;
    left: 0;
    bottom: 100px;
    .sex{
        display: flex;
    }
    .sex-img{
        width: 40px;
        height: 40px;
    }
    .sex-box{
        background-color: #f5f6f8;
        padding: 16px;
        border-right: 1px solid #e3e3e3;
        &:first-child{
            border-right: none;
        }
        &.sex-active{
            background-color: #fff;
        }
    }
    .ranking-box{
        width: 100%;
        overflow: hidden;
        font-size: 28px;
    }
    .menu-container{
        display: flex;
        position: absolute;
        top: 75px;
        right: 0;
        bottom: 0;
        left: 0;
    }
    .menu-list{
        overflow: hidden;
        flex: 0 0 146px;
        height: 100%;
        border-right: 1px solid #e3e3e3;
    }
    .menu-item{
        width: 146px;
        height: 80px;
        text-align: center;
        line-height: 80px;
        position: relative;
        color: #333;
        &.active::after{
            content: '';
            position: absolute;
            left: 0;
            top: 30px;
            display: block;
            height: 20px;
            width: 6px;
            background-color: #f70909;
            font-weight: 400;
            border-top-right-radius: 4px;
            border-bottom-right-radius: 4px;
        }
    }
    .book-list{
        overflow: hidden;
        flex: 1;
        padding: 30px;
        margin-top: -74px;
    }
    .recommend-list{
        padding-top: 10px;
    }
    .recommend-item{
        display: flex;
        margin: 30px 0;
    }
    .item-desc{
        margin-left: 20px;
    }
    .item-img{
        width: 138px;
        height: 176px;
        border-radius: 10px;
    }
    .item-title{
        font-size: 28px;
        margin-bottom: 30px;
        margin-top: 5px;
        color: #333;
        letter-spacing: 1px;
        overflow : hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
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