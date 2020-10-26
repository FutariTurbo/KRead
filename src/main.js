import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueConfig from './vant.config.js'
import 'lib-flexible/flexible'
import FastClick from "fastclick";

Vue.config.productionTip = false

Vue.use(VueAxios, axios)


//设置请求基础路径
axios.defaults.baseURL = 'https://api.kele8.cn/agent/http://api.zhuishushenqi.com'

Vue.use(VueConfig)

FastClick.attach(document.body)

Vue.filter('million', (value) =>{
  //过万处理
  if(value > 9999){//大于9999显示x.xx万
    value = (Math.floor(value/1000)/10) + '万'
  }else if( value < 9999 && value > -9999){
    return value
  }else if(value < -9999){//小于-9999显示-x.xx万
    value = -(Math.floor(Math.abs(value)/1000)/10) + '万'
  }
  return value;
})
  


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
