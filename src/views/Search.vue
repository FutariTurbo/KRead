<template>
    <div class="search">
        <!-- 导航栏 -->
        <van-nav-bar
            left-arrow
            :border="false"
            @click-left="goBack"
            :fixed="true"
        >
            <template #right>
                <van-search 
                    @input="delay(searchValue)" 
                    shape="round" 
                    :left-icon="icon" 
                    show-action 
                    v-model.trim="searchValue" 
                    placeholder="搜索作者、书籍、关键词"
                >
                    <template #action>
                        <div @click="goSearchResult(searchValue)">搜索</div>
                    </template>
                </van-search>
            </template>
        </van-nav-bar>
        <!-- 搜索结果列表 -->
        <div class="search-result" v-if="searchValue">
            <div class="result-item" @click="goSearchResult(item)" v-for="item in searchResult" :key="item" v-html="changeColor(item, searchValue)">{{item}}</div>
        </div>
        <!-- 搜索历史记录 -->
        <div class="search-history" v-if="searchHistory.length > 0 && !searchValue">
            <div class="history-title">
                <div>历史搜索</div>
                <img @click="deleteHistory" class="history-img" src="../assets/images/search_history_delete.png" alt="">
            </div>
            <div class="history-list">
                <div class="history-item" @click="goSearchResult(item)" v-for="item in searchHistory" :key="item">{{item}}</div>
            </div>
        </div>
        <!-- 热搜词 -->
        <div class="search-hot-words" v-if="!searchValue">
            <div class="words-title">
                <div>搜索热词</div>
                <div class="change-words" @click="changeHotWords">
                    <div>换一批</div>
                    <img class="words-img" src="../assets/images/retry.png" alt="">
                </div>
            </div>
            <div class="words-list">
                <div class="words-item" @click="goSearchResult(item.word)" v-for="(item, index) in hotWordsRandom" :key="index">
                    <span class="num" :class="color(index + 1)">{{index + 1}}</span> {{item.word}}</div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                searchValue: '',
                searchResult: [],
                icon: require('../assets/images/search_gray.png'),
                searchHotWords: [],
                hotWordsRandom: [],
                searchHistory: [],
                showBook: true
            }
        },
        created() {
            this.getHotWorlds()
            this.getHistory()
        },
        methods: {
            // 返回
            goBack(){
                this.$router.go(-1)
            },
            // 获取热搜词
            getHotWorlds(){
                this.$toast.loading({
                    message: '加载中...',
                    forbidClick: true,
                    duration: 0,
                }),
                this.axios({
                    method: 'GET',
                    url: '/book/search-hotwords'
                }).then(res => {
                    console.log('res ==> ', res)
                    this.$toast.clear();
                    if(res.status === 200){
                        this.searchHotWords = res.data.searchHotWords.map(v => {
                            return {
                                word: v.word
                            }
                        })
                    }
                    this.changeHotWords()
                }).catch(err => {
                    console.log('err ==> ', err);
                    this.$toast.clear();
                })
            },
            // 判断颜色
            color(index){
                if (index === 1) {
                    return 'one'
                }else if(index === 2){
                    return 'two'
                }else if(index === 3){
                    return 'three'
                }
            },
            // 换一批热搜词
            changeHotWords(){
                let num = 8
                let tempIndex = {}
                let hotWordsRandom = []
                if(this.searchHotWords.length < 8){
                    num = this.searchHotWords.length
                }
                for(let i = 0; i < num; i++){
                    this.getHotWordsRandom(tempIndex, hotWordsRandom)
                }
                this.hotWordsRandom = hotWordsRandom
            },
            // 随机获取热搜词
            getHotWordsRandom(tempIndex, hotWordsRandom){
                let tempItem = Math.floor(Math.random() * this.searchHotWords.length)
                if(tempIndex[tempItem]){
                    this.getHotWordsRandom(tempIndex, hotWordsRandom)
                }else{
                    tempIndex[tempItem] = true
                    hotWordsRandom.push(this.searchHotWords[tempItem])
                }
            },
            // 获取自动匹配搜索词
            automatchWords(value){
                if(!value){
                    return
                }
                this.$toast.loading({
                    message: '加载中...',
                    forbidClick: true,
                    duration: 0,
                }),
                this.axios({
                    method: 'GET',
                    url: `/book/auto-complete?query=${value}`
                }).then(res => {
                    console.log('res ==> ', res)
                    this.$toast.clear();
                    if(res.status === 200){
                        if(res.data && res.data.keywords){
                            this.searchResult = res.data.keywords
                        }
                    }
                }).catch(err => {
                    console.log('err ==> ', err);
                    this.$toast.clear();
                })
            },
            // 缓存搜索历史记录
            getHistory() {
                let history = localStorage.getItem("searchHistory");
                if (history) {
                    this.searchHistory = JSON.parse(history);
                }
            },
            // 跳转搜索结果
            goSearchResult(value){
                let history = localStorage.getItem("searchHistory");
                if(history){
                    history = JSON.parse(history)
                    if(history.length >= 5){
                        history.splice(4, history.length - 4);
                    }
                }else {
                    history = [];
                }
                let isNotIn = history.every(item => {
                    return item !== value;
                });
                if (isNotIn) {
                    history.unshift(value);
                }
                localStorage.setItem("searchHistory", JSON.stringify(history));
                this.searchHistory = JSON.parse(localStorage.getItem("searchHistory"));
                this.$router.push({name: "SearthResult", query: {value}});
            },
            // 删除搜索历史记录
            deleteHistory() {
                this.searchHistory = [];
                localStorage.removeItem("searchHistory");
                this.$toast.success({
                    message: '删除历史记录成功',
                    forbidClick: true,
                    duration: 300,
                })
            },
            // 匹配搜索词颜色
            changeColor(val, keyword) {  
                let Reg = new RegExp(keyword, 'g');
                if (val) {
                    let res = val.replace(Reg, `<span style="color: #ff8b07;">${keyword}</span>`);
                    return res;
                }
            },
            // 防抖
            delay(value){
                if (this.timer) {
                    clearTimeout(this.timer);
                }
                this.timer = setTimeout(() => {
                    this.automatchWords(value);
                    this.timer = null;
                }, 300);
            }
            
        }
    }
</script>

<style lang="scss" scoped>
.search{
    background-color: #f6f7f9;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    padding-top: 92px;
    /deep/.van-nav-bar .van-icon{
        color: #333; 
        font-weight: bold;
    }
    /deep/.van-search{
        padding: 0;
    }
    /deep/.van-search .van-cell{
        width: 260px;
    }
    /deep/.van-search__action{
        color: #f70909;
    }
    .search-result{
        background-color: #fff;
    }
    .result-item{
        padding: 30px 0;
        margin: 0 30px;
        border-bottom: .5px solid #ececec;
        color: #333;
        font-size: 28px;
    }
    .search-hot-words{
        padding: 30px;
        background-color: #fff;
    }
    .words-title{
        font-size: 28px;
        color: #333;
        font-weight: bold;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .words-img{
        width: 30px;
        height: 30px;
        margin-top: -4px;
        margin-left: 5px;
    }
    .change-words{
        font-weight: 400;
        color: #888;
        display: flex;
    }
    .words-list{
        display: flex;
        justify-content: space-around;
        flex-wrap: wrap;
    }
    .words-item{
        font-size: 28px;
        width: 300px;
        margin-top: 40px;
        color: #333;
        overflow : hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
    }
    .num{
        color: #888;
        &.one{
            color: #df1314;
        }
        &.two{
            color:#fe8230;
        }
        &.three{
            color: #fdb51d;
        }
    }
    .search-history{
        padding: 30px;
        background-color: #fff;
    }
    .history-title{
        font-size: 28px;
        color: #333;
        font-weight: bold;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .history-list{
        display: flex;
        flex-wrap: wrap;
    }
    .history-item{
        margin-top: 30px;
        font-size: 28px;
        color: #333;
        background-color: #f6f7f9;
        padding: 20px;
        border-radius: 5px;
        margin-right: 20px;
    }
    .history-img{
        width: 50px;
    }
    
}
</style>