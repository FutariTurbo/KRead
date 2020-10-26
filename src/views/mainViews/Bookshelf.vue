<template>
    <div class="bookshelf">
        <!-- 书架导航栏 -->
        <van-nav-bar class="nav" :fixed="true">
            <template #left>
                <div class="logo">K阅文学</div>
            </template>
            <template #right>
                <van-icon @click="goSearch" v-show="!isEdit" class="search" name="search" size="18" />
                <van-icon :name="!isEdit ? 'ellipsis' : 'cross'" size="18" @click="editBook" />
            </template>
        </van-nav-bar>
        <!-- 书架列表 -->
        <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
            <div class="book-list">
                <div v-for="(item,index) in bookShelfData" :key="item.id">
                    <van-swipe-cell class="book-box" :disabled="!isEdit">
                        <div class="list-item" @click="goRead(item.url, item.chapterIndex + 1)">
                            <div>
                                <img class="item-img" v-lazy="item.img" alt="">
                            </div>
                            <div class="item-desc">
                                <div class="item-title">{{item.name}}</div>
                                <div class="item-text">最新：{{item.lastChapter}}</div>
                                <div class="item-date">{{item.time | getTemplateTimeByDate('YYYY/MM/dd hh:mm:ss')}}</div>
                            </div>
                            <div class="update-box" v-if="item.isSerial">
                                <img class="update-img" src="../../assets/images/update_flag.png" alt="">
                            </div>
                        </div>
                        <template #right>
                            <van-button @click="removeBookShelf(index)" square text="删除" color="#f70909" type="danger" class="delete-button" />
                        </template>
                    </van-swipe-cell>
                </div>
            </div>
        </van-pull-refresh>
        <!-- 空状态 -->
        <van-empty
            class="custom-image"
            :image='require("../../assets/images/nodata_shelf.png")'
            description="书架空了，快去添加吧"
            v-if="bookShelfData.length === 0"
        />
    </div>
</template>

<script>
    import { getTemplateTimeByDate } from '../../assets/js/tool'
    export default {
        name: 'Bookshelf',
        data() {
            return {
                isEdit: false,
                bookShelfData: [],
                hasBook: false,
                bookContent: [],
                isLoading: false,
            }
        },
        created() {
            this.getBookShelfData()
        },
        methods: {
            // 是否编辑
            editBook() {
                this.isEdit = !this.isEdit
            },
            // 下拉刷新
            onRefresh(){
                this.$router.go(0)
            },
            // 获取书架数据
            getBookShelfData(){
                // 判断localStorage是否存在"novelShelf"
                if(window.localStorage.getItem("novelShelf")){
                    let arr = JSON.parse(window.localStorage.getItem("novelShelf"))
                    let bookShelf = []
                    arr.map(v => {
                        bookShelf.push(v.id)
                    })
                    this.$toast.loading({
                        message: '加载中...',
                        forbidClick: true,
                        duration: 0,
                    }),
                    this.axios({
                        method: 'GET',
                        url: '/book',
                        params: {
                            view: "updated",
                            id: bookShelf.toString(),
                        }
                    }).then(res => {
                        console.log('res ==> ', res);
                        this.$toast.clear();
                        if(res.status === 200){
                            if(res.data && res.data.length > 0){
                                let bookData = []
                                for(let i = 0; i < res.data.length; i++){
                                    bookData.unshift({
                                        id: res.data[i]._id,
                                        img: arr[i].img,
                                        name: arr[i].name,
                                        chapterIndex: arr[i].chapterIndex,
                                        author: res.data[i].author,
                                        lastChapter: res.data[i].lastChapter,
                                        time: res.data[i].updated,
                                        url: arr[i].url,
                                        isSerial: arr[i].isSerial
                                    })
                                }
                                this.bookShelfData = bookData
                                this.hasBook = true
                            }
                        }
                    }).catch(err => {
                        console.log('err ==> ', err);
                        this.$toast.clear();
                    })
                }
            },
            // 删除书架
            removeBookShelf(index){
                if(this.hasBook){
                    let arr = JSON.parse(window.localStorage.getItem("novelShelf"));
                    for (let i = 0; i < arr.length; i++) {
                        if (arr[i].id === this.bookShelfData[index].id) {
                            this.$dialog.confirm({
                                title: '温馨提示',
                                message: '您确定要从书架中移出吗？',
                            }).then(() => {
                                arr.splice(i, 1);
                                if (arr.length > 0) {
                                    window.localStorage.setItem("novelShelf", JSON.stringify(arr));
                                } else {
                                    window.localStorage.removeItem("novelShelf");
                                    this.hasBook = false
                                }
                                this.$toast.success({
                                    message: '移出书架成功',
                                    forbidClick: true,
                                    duration: 300,
                                })
                                this.bookShelfData.splice(index, 1)
                            })
                        }
                    }
                }
            },
            // 跳转到阅读
            goRead(url, bookChapter){
                this.$router.push({name: 'Read', query: {url, bookChapter}})
            },
            // 跳转到搜索
            goSearch(){
                this.$router.push({name: 'Search'})
            }
        },
        filters: {
            getTemplateTimeByDate
        }
    }
</script>

<style lang="scss" scoped>
.bookshelf{
    padding-top: 92px;
    padding-bottom: 50px;
    
    /deep/.van-nav-bar {
        background-color: transparent;
    }
    /deep/.van-nav-bar .van-icon,
    /deep/.van-nav-bar__title{
        color: #333; 
        font-weight: bold;
    }
    .logo{
        font-size: 36px;
        font-weight: bold;
        color: #333;
        letter-spacing: 1;
    }
    .nav{
        background-image: url(~@/assets/images/indicator.png);
        background-repeat: no-repeat;
        background-position: 100%;
        background-size: cover;
    }
    .search{
        margin-right: 20px;
    }
    /deep/.van-popup--right{
        top: 100px;
        right: 12px;
        padding: 0 12px;
        border-radius: 5px;
    }
    .update-img{
        width: 60px;
        margin-top: 10px;
    }
    
    .list-item{
        display: flex;
        padding: 30px;
        border-bottom: 1px solid #f3f3f3;
        &:last-child{
            border-bottom: none;
        }
    }
    .item-img{
        width: 138px;
        height: 176px;
        border-radius: 10px;
    }
    .item-desc{
        margin-left: 20px;
        line-height: 60px;
        flex: 1;
    }
    .item-title{
        font-size: 30px;
        color: #333;
        font-weight: bold;
    }
    .item-text{
        overflow : hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
    }
    .item-text,
    .item-date{
        font-size: 26px;
        color: #979999;
    }
    .item-checkbox{
        margin-left: 80px;
        margin-top: 70px;
    }
    .delete-button{
        height: 100%;
    }
}
</style>