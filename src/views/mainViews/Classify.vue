<template>
    <div class="classify">
        <!-- 导航栏 -->
        <van-nav-bar
            :fixed="true"
            title="全部分类"
        />
        <!-- 分类列表 -->
        <div class="male" v-for="(item, index) in classify" :key="index">
            <div class="male-header">
                <img class="icon-img" :src="item.img" alt="">
                <div class="header-title">{{item.value}}</div>
            </div>
            <div class="classify-list">
                <div class="classify-item" v-for="(i, index) in item.children" :key="index" @click="goCategory(item.type, i.name)">
                    <img class="item-img" v-lazy="i.bookCover[0]" alt="">
                    <div class="item-title">{{item.children[index].name}}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'Classify',
        data() {
            return {
                classify: [
                    {value: '男生', type:'male', img: require('../../assets/images/category_male.png'), children: []},
                    {value: '女生', type:'female', img: require('../../assets/images/category_female.png'), children: []}
                ]
            }
        },
        created() {
            this.getClassifyData()
        },
        methods: {
            // 获取分类
            getClassifyData(){
                this.$toast.loading({
                    message: '加载中...',
                    forbidClick: true,
                    duration: 0,
                }),
                this.axios({
                    method: 'GET',
                    url: '/cats/lv2/statistics',
                }).then(res => {
                    console.log('res ==> ', res)
                    this.$toast.clear();
                    if(res.status === 200){
                        for(let i = 0; i < this.classify.length; i++){
                            this.classify[i].children = res.data[this.classify[i].type]
                            this.classify[i].children.map(v => {
                                return v.bookCover[0] = this.$store.state.imgHeader + v.bookCover[0]
                            })
                        }
                    }
                }).catch(err => {
                    console.log('err ==> ', err);
                    this.$toast.clear();
                })
            },
            // 跳转类别详情
            goCategory(gender, name){
                this.$router.push({name: 'Category', query: {gender, name}})
            }
        },
    }
</script>

<style lang="scss" scoped>
.classify{
    background-color: #f6f7f9;
    padding-top: 92px;
    .male{
        background-color: #fff;
        padding: 30px;
        margin-bottom: 20px;
    }
    .male-header{
        display: flex;
        align-items: center;
    }
    .icon-img{
        width: 40px;
    }
    .header-title{
        font-size: 30px;
        color: #333;
        font-weight: 400;
        margin-left: 10px;
    }
    .classify-list{
        padding-top: 20px;
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
    }
    .classify-item{
        display: flex;
        align-items: center;
        margin: 20px 0;
        // flex: 0 0 33%;
        width: 300px;
    }
    .item-img{
        width: 118px;
        height: 166px;
        border-radius: 10px;
    }
    .item-title{
        font-size: 28px;
        color: #333;
        font-weight: 400;
        margin-left: 20px;
    }
}
</style>