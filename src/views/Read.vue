<template>
    <div class="read" :style="{backgroundColor: colorIndex}">
        <!-- 导航栏 -->
        <van-nav-bar
            :title="chapterName"
            left-arrow
            @click-left="goBack"
            :fixed="true"
            v-if="isShow"
        />
        <!-- 阅读内容 -->
        <div class="read-info" @click="showSetup">
            <div class="read-title">{{chapterName}}</div>
            <div class="read-chapter" :style="{fontSize: currentFontSize + 2 + 'px',color:colorIndex === '#444545' ? '#888' : ''}">{{chapterinfo.num}}</div>
            <div class="chapter-info">
                <div :style="{fontSize: currentFontSize + 'px',color:colorIndex === '#444545' ? '#888' : ''}" class="content" v-for="(item, index) in chapterinfo.content" :key="index">{{item}}</div>
            </div>
        </div>
        <!-- 设置 -->
        <van-popup v-model="isShow" :overlay="false" position="bottom">
            <div class="chapters">
                <span class="prev-chapter" @click="chapterChange(-1)">上一章</span>
                <div class="line-chapter"></div>
                <span class="next-chapter" @click="chapterChange(1)">下一章</span>
            </div>
            <div class="background-box">
                <div class="background" :class="bg.isActive ? 'active' : ''" @click="toggleBackground(bg)" v-for="bg in backgroundColor" :key="bg.color" :style="{backgroundColor: bg.color}"></div>
            </div>
            <div class="content-font">
                <div class="contents" @click="showContent">目录</div>
                <div>
                    <img @click="changeFontSize(-1)" class="font-img" src="../assets/images/read_font_less.png" alt="">
                    <img @click="changeFontSize(1)" class="font-img" src="../assets/images/read_font_plus.png" alt="">
                </div>
            </div>
        </van-popup>
        <van-popup v-model="isContents" position="left">
            <div class="contents-box">
                <div class="contents-name">{{chapterName}}</div>
                <div class="contents-title">正文</div>
            </div>
            <div class="contents-list">
                <van-cell @click="toggleChapter(index)" :class="index === currentChapter ? 'actives' : ''" :title="i.num" v-for="(i,index) in contentsData" :key="i.url"/>
            </div>
        </van-popup>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                isContents: false,
                isShow: false,
                bookChapter: this.$route.query.url,
                chapterName: '',
                chapterinfo: [],
                chapterData: [],
                currentChapter: this.$route.query.bookChapter -1,
                bookId: this.$route.query.bookId,
                colorIndex: '',
                backgroundColor: [
                    {color: '#f6f6f6', isActive: true},
                    {color: '#d4ddcc', isActive: false},
                    {color: '#d3dce1', isActive: false},
                    {color: '#ece3e8', isActive: false},
                    {color: '#444545', isActive: false}
                ],
                currentFontSize: 16,
                fontSize: [12, 14, 16, 18, 20, 22],
                contentsData: []
            }
        },
        created() {
            this.getChapterData()
        },
        methods: {
            // 返回
            goBack(){
                this.$router.go(-1)
            },
            // 获取章节
            getChapterData(){
                this.$toast.loading({
                    message: '加载中...',
                    forbidClick: true,
                    duration: 0
                }),
                this.axios({
                    method: 'GET',
                    url: `http://47.114.147.221/?xsurl1=${this.bookChapter}`,
                }).then(res => {
                    console.log('res ==> ', res);
                    this.$toast.clear();
                    if(res.data.code === 0){
                        this.chapterData = res.data
                        this.chapterName = res.data.data.name
                        this.contentsData = res.data.list
                        // 判断是否缓存了章节
                        if (window.localStorage.getItem("novelShelf")) {
                            let arr = JSON.parse(window.localStorage.getItem("novelShelf"));
                            for (let i = 0; i < arr.length; i++) {
                                if (arr[i].id === this.bookId) {
                                    this.getChapterContent(this.chapterData.list[arr[i].chapterIndex].url)
                                    this.chapterChange(arr[i].chapterIndex)
                                }
                            }
                        }
                        this.getChapterContent(this.chapterData.list[this.currentChapter].url)
                    }else{
                        this.$toast('未找到小说资源')
                    }
                }).catch(err => {
                    console.log('err ==> ', err);
                    this.$toast.clear();
                })
            },
            // 获取章节内容
            getChapterContent(url){
                this.$toast.loading({
                    message: '加载中...',
                    forbidClick: true,
                    duration: 0,
                }),
                this.axios({
                    method: 'GET',
                    url: `http://47.114.147.221/?xsurl2=${url}`,
                }).then(res => {
                    console.log('res ==> ', res);
                    this.$toast.clear();
                    if(res.data.content){
                        this.chapterinfo = res.data
                        this.$nextTick(() => {
                            this.backTop()
                        })
                    }else{
                        this.$toast('未找到小说资源')
                    }
                }).catch(err => {
                    console.log('err ==> ', err);
                    this.$toast.clear();
                })
            },
            // 设置显示或隐藏
            showSetup(){
                this.isShow = !this.isShow
            },
            // 章节切换
            chapterChange(num){
                if(this.currentChapter + num >= 0 && this.currentChapter + num < this.chapterData.list.length -1){
                    this.currentChapter += num
                    this.getChapterContent(this.chapterData.list[this.currentChapter].url)
                }
                this.setBookLocalStorage()
                this.isShow = false
            },
            // 缓存章节
            setBookLocalStorage(){
                if(window.localStorage.getItem("novelShelf")){
                    let arr = JSON.parse(window.localStorage.getItem("novelShelf"))
                    for(let i = 0; i < arr.length; i++){
                        if(arr[i].id === this.bookId){
                            arr[i].chapterIndex = this.currentChapter
                            window.localStorage.setItem("novelShelf", JSON.stringify(arr))
                        }
                    }
                }
            },
            // 切换背景
            toggleBackground(item){
                if(item.isActive){
                    return
                }
                for(let i = 0; i < this.backgroundColor.length; i++){
                    if(this.backgroundColor[i].isActive){
                        this.backgroundColor[i].isActive = false
                        break
                    }
                }
                item.isActive = true
                this.colorIndex = item.color
            },
            // 切换字体大小
            changeFontSize(value){
                let index = this.fontSize.indexOf(this.currentFontSize) + value
                if(this.fontSize[index]){
                    this.currentFontSize = this.fontSize[index]
                    if(this.currentFontSize === 12){
                        this.$toast('已调整到最小字体')
                    }else if (this.currentFontSize === 22) {
                        this.$toast('已调整到最大字体')
                    }
                }
            },
            // 显示目录
            showContent(){
                this.isContents = !this.isContents
            },
            // 切换章节
            toggleChapter(chapter){
                this.getChapterContent(this.chapterData.list[chapter].url)
                if(window.localStorage.getItem("novelShelf")){
                    let arr = JSON.parse(window.localStorage.getItem("novelShelf"))
                    for(let i = 0; i < arr.length; i++){
                        if(arr[i].id === this.bookId){
                            arr[i].chapterIndex = chapter
                            window.localStorage.setItem("novelShelf", JSON.stringify(arr))
                        }
                    }
                }
                this.currentChapter = chapter
                this.isContents = false
                this.isShow = false
            },
            scrollToTop() {
                let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
                let browserHeight = window.outerHeight;
                if (scrollTop > browserHeight) {
                    this.backToTop = true
                } else {
                    this.backToTop = false
                }
            },
            // 返回顶部
            backTop() {
                let back = setInterval(() => {
                    if (document.body.scrollTop || document.documentElement.scrollTop) {
                        document.body.scrollTop -= 100;
                        document.documentElement.scrollTop -= 100;
                    } else {
                        clearInterval(back);
                    }
                });
            }
        },
        mounted() {
            window.addEventListener("scroll", this.scrollToTop);
        },
        destroyed() {
            window.removeEventListener("scroll", this.scrollToTop);
        }
    }
</script>

<style lang="scss" scoped>
.read{
    background-color: #f6f6f6;
    /deep/.van-nav-bar .van-icon{
        color: #333; 
        font-weight: bold;
    }
    .read-info{
        padding: 40px 30px;
    }
    .read-chapter{
        padding: 60px 0;
        font-size: 30px;
        font-weight: 400;
        color: #4e453e;
    }
    .content{
        font-size: 26px;
        line-height: 50px;
        letter-spacing: 3px;
        text-indent: 50px;
        color: #4e453e;
        margin: 20px 0;
    }
    .chapters{
        display: flex;
        padding: 40px;
        justify-content: space-between;
        align-items: center;
    }
    .line-chapter{
        width: 400px;
        height: 1px;
        border-radius: 4px;
        background-color: #b2b2b2;
    }
    .prev-chapter,
    .next-chapter{
        font-size: 28px;
    }
    .background-box{
        padding: 30px;
        display: flex;
        justify-content: space-between;
    }
    .background{
        width: 80px;
        height: 80px;
        &.active{
            background-image: url(~@/assets/images/read_skin_seleced_bg.png);
            background-size: 80px 80px;
        }
    }
    .content-font{
        padding: 20px 0;
        display: flex;
        justify-content: space-around;
        align-items: center;
    }
    .contents{
        font-size: 28px;
    }
    .font-img{
        width: 50px;
        height: 50px;
        margin-left: 60px;
        &:first-child{
            margin-left: 0;
        }
    }
    .contents-name{
        padding: 30px;
        font-size: 28px;
        font-weight: bold;
        color: #333;
    }
    .contents-title{
        background-color: #f6f7f9;
        padding: 20px 40px;
    }
    .contents-img{
        width: 50px;
        height: 50px;
    }
    .actives{
        color: #ff8b07;
    }
}
</style>