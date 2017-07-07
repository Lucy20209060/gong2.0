import babelpolyfill from "babel-polyfill"
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(babelpolyfill);
Vue.use(Vuex);

// 图片前缀
let images = '';
process.env.NODE_ENV === 'development'
? images = 'http://dev.anchumall.cc:9546'
: images = ''


let store = new Vuex.Store({
    state: {
        loginMsg: {
          islogin:false
        },

        // 图片前缀
        img: {  
          imgPre:images      // 线上
        },

        paylink:'',
        apilink:'',

        orderGoodsInfo:[],

        orderMsg:{
          orderNumber:null,
        },

        fileLoadNum:{           // 批量下单上传文件 成功失败文件数量
            failNum:0,
            successNum:0
        }
    },
    mutations: {
        // 修改上传文件 成功 失败 数量
        setFileLoad:(state,value) => {
            state.fileLoadNum.failNum = value.failed;
            state.fileLoadNum.successNum = value.success;
        }
    },
  getters: {
    // 设置cookie
    // SetCookie (name,value) {
    //   if(name == 'userId'){
    //     cookieOperate.setCookie('a34ea2d96d4239d4d86803bb3cd99788',value,'d1');
    //   }else if(name == 'userNumber'){
    //     cookieOperate.setCookie('8e3c824e1d6254b74a013799c1565538',value,'d1');
    //   }else if(name == 'verifyStatus'){
    //     cookieOperate.setCookie('b61a9d162ac1dfaa22d0f05bdc7f6299',value,'d1');
    //   }
      
    // },
    // // 删除cookie
    // RemoveCookie(name){
    //   cookieOperate.delCookie(name)
    // },
    // // 获取cookie 的值
    // GetCookie (state,name) {
    //   return  cookieOperate.getCookie(name);
    // }
  }
});
 export default store;
