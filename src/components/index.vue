<template>
  <div class="index">

    <tIndexHeader></tIndexHeader>


    <div class="block index-bannder-wrap">
      <el-carousel trigger="click" height="430px" arrow="never">
        <el-carousel-item v-for="(item,index) in banner" key="index">
          <a 
            v-bind:href="item.ad_link==''?'javascript:;':item.ad_link" 
            v-bind:style="setbackground(imgPre + item.ad_code)"
            target="_blank">
          </a>
        </el-carousel-item>
      </el-carousel>
    </div>

    <dl class="special-site-wrap">
        <dt>
            <span>特色站点 / SPECIAL SITE</span>
        </dt>

        <dd v-for="(item,index) in recommendSite" key="index">
            <a 
                v-bind:href="item.ad_link==''?'javascript:;':item.ad_link"
                v-bind:style="setRecomSitebg(item.ad_code)"
                target="_blank"
            >
            </a>
        </dd>

    </dl>

    <section class="index-center">
        <div 
            class="index-center-list" 
            v-for="(item,index2) in category" 
            key="index2"
            ref="categorys"
        >
            <header>
                <span>
                    <em>{{index2+1}}F</em>
                    <em>{{item.name}}</em>
                </span>
                <div>CONDIMENTS</div>
                <i>
                    <router-link 
                        :to="{path:'/classify',query:{id:item.id,type:'undefined',name:item.name}}"
                    >
                    查看更多>>
                    </router-link>
                </i>
            </header>

            <section class="list-content">
                <router-link 
                    class="list-content-left"
                    v-bind:style="setRecomSitebg(level1Img[item.id])"
                    tag="div" 
                    :to="{path:'/classify',query:{id:item.id,type:'undefined',name:item.name}}"
                >
                    <div class="content-left-class">
                        <p>
                            <span>全部分类</span>
                        </p>
                        <span>
                            <router-link 
                                v-for="(childs,index) in item.child" 
                                :to="{path:'/classify',query:{id:childs.id,type:'undefined',name:childs.name}}"
                                key="index"
                                v-text="childs.name"
                            >
                            </router-link>
                        </span>
                    </div>
                </router-link>

                <div class="list-content-right">
                    <a 
                        v-for="(product,index3) in item.products" key="index3" 
                        v-bind:href="http+'/#/goodsDetails?id='+product.goods_id" target="_blank"
                    >
                        <dl>
                            <dt>
                                <img :src="imgPre + product.image.image_url" :onerror="imgErr" />
                            </dt>
                            <dd v-text="product.goods_name"></dd>
                            <dd v-if="product.price != -1">
                                <i>￥</i>
                                <span v-text="product.price"></span>
                            </dd>
                            <dd v-if="product.price == -1">认证可见</dd>
                        </dl>
                    </a>
                </div>
            </section>
        </div>
    </section>

    <IndexFooter></IndexFooter>
    
    <!-- 右侧悬浮 -->
    <div class="index-fixed-nav">
      <fixedNav></fixedNav>
    </div>

    <!-- 左侧悬浮 -->
    <dl class="fixed_menu" v-show="scrolled > 300">
        <dd 
            ref="fixed_menu_dd" 
            v-for="(item,index) in category" 
            key="index"
            @click="goClass(index)"
            @moveover="overClass(index)"
        >
            <i :class="level1Icon[item.id]"></i>
            <span>{{item.name}}</span>
        </dd>
        
    </dl>


  </div>
</template>

<script>
import tIndexHeader from '@/components/common/index_header'
import IndexFooter from '@/components/common/index_footer'
import fixedNav from '@/components/common/fixed_nav'
import indexNav from '@/components/common/index_nav'

export default {
  name: 'index',
  data () {
    return {
        imgPre:this.$store.state.img.imgPre,
        imgErr:'this.src="/static/images/imgtem.png"',

        category:[],                              // 首页商品

        banner:[],                                // 轮播图
        recommendSite:[],                         // 推荐站点

        http:'',
        siteList:[],                              // 站点列表
        scrolled:0,                               // 滚动条高度

        level1Icon:{                              // 楼层对应的图标
            1:'iconfont icon-diaoweipin',
            2:'iconfont icon-liangyoufushi',
            3:'iconfont icon-rouqindanlei',
            4:'iconfont icon-jinkoulingshi',
            5:'iconfont icon-guochanshuiguo',
            6:'iconfont icon-shuichan',
            7:'iconfont icon-yangshengicon',
            8:'iconfont icon-shuichan',
            9:'iconfont icon-8shucai',
            10:'iconfont icon-bbgjiushui',
            926:'iconfont icon-diaoweipin',
            927:'iconfont icon-liangyoufushi',
            928:'iconfont icon-rouqindanlei',
            929:'iconfont icon-jinkoulingshi',
            930:'iconfont icon-guochanshuiguo',
            931:'iconfont icon-shuichan',
            932:'iconfont icon-8shucai',
            933:'iconfont icon-yangshengicon',
            934:'iconfont icon-bbgjiushui'
        },
        level1Img:{}                               // 一级分类图片

    }
  },
  
  components: {
    tIndexHeader,
    IndexFooter,
    fixedNav,
    indexNav
  },

  created(){
    this.getlevel1Img();
    // 1移动端banner 2PC端banner  3特色站点
    this.bannerlist(2);
    this.bannerlist(3);
    this.getSite();
    this.category_products();
  },

  mounted(){
  	if(!window.location.origin){
 		this.http = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port: '');
 	}else{
 		this.http = window.location.origin;
 	}
    window.addEventListener('scroll', this.handleScroll);
  },

  methods:{

    // 获取一级分类图片
    getlevel1Img(){
        const _this = this;
        $.ajax({
            type: "get",
            url: this.$api.home.getlevel1,
            dataType: "json",
            success:function(res){
                for(let value of res.data){
                    if(value.image){
                        _this.level1Img[value.id] = value.image;
                    }
                }
            },
            error:function(res){
                // console.log('error')
            }
      });
    },

    // 获取滚动条
    handleScroll(){
        this.scrolled = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;

        for(let i in this.$refs.fixed_menu_dd){
            this.$refs.fixed_menu_dd[i].removeAttribute('class');
        }

        let categorys = this.$refs.categorys;
        
        for(let i in categorys){
            if( this.scrolled+340 >= categorys[i].offsetTop && 
                this.scrolled+340 < categorys[i].offsetTop+categorys[i].clientHeight)
            {
                this.$refs.fixed_menu_dd[i].setAttribute('class','active');
            }
        }

    },

    // 回到对应分类高度
    goClass(index){ 
        $('body,html').animate({
            scrollTop:this.$refs.categorys[index].offsetTop-300
        },500);  
    },

    // banner图 设置为背景
    setbackground(img){
        return 'background:url('+img+') no-repeat center';
    },

    // 设置站点推荐背景
    setRecomSitebg(img){
        return 'background:url('+this.imgPre+img+') no-repeat center';

    },

    // 首页商品推荐
    category_products() {
        var _this = this;
        $.ajax({
            type: "post",
            url: this.$store.state.apilink+"?s=api/index/category_products",
            dataType: "json",
            success:function(res){
                _this.category = res.data;
            },
            error:function(res){
                // console.log('error')
            }
      });
    },

    // 轮播图
    bannerlist(value) {
  		var _this = this;
  		$.ajax({
  			type: "get",
  			url: this.$api.home.getAdList,
            data:{
                pid:value
            },
  			dataType: "json",
  			success:function(res){
                value == 2 ? _this.banner = res.data : _this.recommendSite = res.data; 
  			},
            error:function(err){
                // console.log(err)
            }
  		});
    },

    // 获取站点
    getSite(){
        const _this = this;
        $.ajax({
            type: "post",
            url: this.$store.state.apilink+"?s=api/site/getlist",
            dataType: "json",
            success:function(res){
                // 获取地域
              _this.siteList = res.data;
              // console.log(_this.siteList);
            }
        });
    }
  }
  
}

</script>

<style scoped>
/* 2.0版本 2017/6/16 注释 */

.special-site-wrap{
    width: 1200px;
    height: auto;
    margin: 0 auto 14px;
    overflow: hidden;

}
.content-left-class{
    position: absolute;
    bottom: 15px;
    background: #fff;
    width: 190px;
    height: 190px;
    left: 15px;
}
.content-left-class p{
    position: relative;
    width: 100%;
    height: 50px;
    text-align: center;
}
.content-left-class p:after{
    position: absolute;
    content:'';
    width: 80%;
    height: 1px;
    background: #333;
    left: 10%;
    top: 50%;
    z-index:99;
}
.content-left-class p span{
    position: absolute;
    line-height: 50px;
    font-size: 18px;
    background: #fff;
    z-index: 999;
    width: 60%;
    left: 20%;
}
.content-left-class span{
    display: block;
    overflow: hidden;
}
.content-left-class span a{
    float: left;
    width: 80px;
    height: 24px;
    border: 1px solid #9A9A9A;
    border-radius: 40px;
    -moz-border-radius: 40px;
    -webkit-border-radius: 40px;
    color: #9A9A9A;
    font-size: 14px;
    line-height: 24px;
    margin: 0 0 14px 8px;
}
.special-site-wrap dt{
    text-align: center;
    width: 100%;
    clear: both;
    padding: 54px 0 30px 0;
    font-size: 22px;
    color: #3e3a39;
    position: relative;
}
.special-site-wrap dt:after{
    position: absolute;
    content: '';
    top: 60%;
    left: 0;
    width: 100%;
    height: 1px;
    background-color: #ebebeb;
    z-index: 98;
}
.special-site-wrap dt span{
    padding: 0 50px;
    position: relative;
    background:#fff;
    z-index: 100;
}
.special-site-wrap dd{
    float: left;
    width: 228px;
    height: 160px;
    margin-right: 12px;
    cursor: pointer;
    border-radius: 4px;
    -moz-border-radius: 6px;
    -webkit-border-radius: 6px;
    overflow: hidden;
}
.special-site-wrap dd:last-child{
    margin-right: 0;
}
.special-site-wrap dd a{
    display: block;
    height: 100%;
}
.special-site-wrap dd span{
    display: block;
    text-align: center;
    font-size: 20px;
    margin-top: 20px;
}
.special-site-wrap dd>i{
    display: block;
    text-align: center;
    font-size: 14px;
    margin-top: 6px;
    color: #d8d8d8;
}
.special-all{
    padding: 26px;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
    -o-box-sizing: border-box;
    -ms-box-sizing: border-box;
    box-sizing: border-box;
    background: #EEE6DB;
}
.special-all div{
    width: 100%;
    height: 100%;
    background: #FCFAF8;
    text-align: center;
}
.special-all div p{
    font-size: 20px;
    position: relative;
    line-height: 36px;
}
.special-all div p:after{
    position: absolute;
    content: '';
    width: 30%;
    height: 2px;
    background-color:  #636363;
    bottom: -14px;
    left: 35%;
}
.special-site-wrap .special-all span{
    background: #009e4d;
    width: 80px;
    height: 80px;
    display: inline-block;
    border-radius: 40px;
    -moz-border-radius: 40px;
    -webkit-border-radius: 40px;
    color: #fff;
    font-size: 20px;
    line-height: 20px;
    margin-top: 28px;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
    -o-box-sizing: border-box;
    -ms-box-sizing: border-box;
    box-sizing: border-box;
    padding: 14px;
}
.special-site-wrap .special-all span i{
    line-height: 26px;
}
.fixed_menu{
    position: fixed;
    width: 42px;
    left: 5%;
    top: 40%;
    z-index: 9999;
    background: #fff;
}
.fixed_menu dd{
    width: 42px;
    height: 42px;
    text-align: center;
    padding: 2px;
    border:1px solid #d8d8d8;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
    -o-box-sizing: border-box;
    -ms-box-sizing: border-box;
    box-sizing: border-box;
    font-size: 14px;
    border-bottom: 0;
    cursor: pointer;
}

.fixed_menu dd span{
    display: none;
    width: 100%;
    height: 100%;
}


.fixed_menu dd:hover{
    border-color: #009e4d;
    background: #009e4d;
    color: #fff;
}
.fixed_menu dd:hover i{
    display: none;
}
.fixed_menu dd:hover span{
    display: block;
}

/*active*/
.fixed_menu dd.active{
    border-color: #009e4d;
    background: #009e4d;
    color: #fff;
}
.fixed_menu dd.active i{
    display: none;
}
.fixed_menu dd.active span{
    display: block;
    width: 100%;
    height: 100%;
}

.fixed_menu dd:last-child{
    border-bottom: 1px solid #d8d8d8;

}
.fixed_menu dd i{
    font-size: 22px;
    line-height: 40px;
}



/* 1.*版本 注释 */
.index-fixed-nav{
    position: fixed;
    width: 40px;
    height: 120px;
    right: 5%;
    top: 40%;
    z-index: 9999;
}
.index-bannder-wrap{
  height:auto;
}
.index-bannder-wrap a{
  display: block;
  height: 100%;
  text-align: center;
  overflow: hidden;
}
.index-bannder-wrap a img{
  width: auto;
  height: 100%;
}
.index-logo-wrap{width:100%;height:158px;border-bottom:2px solid #009e4d;}
.logo-up{padding-top:40px;margin:0 auto;}
.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 150px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
   background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n+1) {
   background-color: #d3dce6;
}
.index-center{width:1200px;margin:0 auto 50px;min-height:400px;height:auto!important;height:400px;}
.index-center:after{content:".";display:block;height:0;clear:both;overflow:hidden;visibility:hidden;}
.index-center-list{
  width:100%;
  height:auto;
  padding:40px 0 10px 0;
}
.index-center-list header{
  padding:6px 0;
  height:22px;
  line-height:22px;
  overflow:hidden;
  margin-bottom: 6px;
}
.index-center-list header span{
  float: left;
  font-size: 22px;
  height: 20px;
  line-height: 20px;
  font-weight: 900;
  padding-left: 10px;
  color: #3e3a39;
}
.index-center-list header div{
    float: left;
    margin-left: 20px;
    padding-left: 10px;
    border-left: 1px solid #999;
    font-size: 12px;
}
.index-center-list header i{
  float:right;
  cursor:pointer;
  font-size: 14px;
}
.list-content{
  padding-top:5px;
  overflow:hidden;
  text-align: center;
  height: auto;
}
.list-content-left{
    float: left;
    width: 220px;
    height: 600px;
    position: relative;
    cursor: pointer;
}
.list-content-right{
    float: left;
    width: 980px;
}
.list-content-right :nth-child(4n) dl{
  border-right-color:#ededed;
}
.list-content-right :nth-child(1) dl,
.list-content-right :nth-child(2) dl,
.list-content-right :nth-child(3) dl,
.list-content-right :nth-child(4) dl{
  border-top-color:#ededed;
}
.list-content-right :last-child dl{
  border-right-color:#ededed;
}

.list-content-right a{
  float:left;
  width:25%;
  height: 300px;
  overflow: hidden;
  border:transparent;
}
.list-content dl{
  border:1px solid #ebebeb;
  border-right-color:transparent;
  border-top-color:transparent;
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  -o-box-sizing: border-box;
  -ms-box-sizing: border-box;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
}
.list-content dl dt{
  border-right-color:transparent;
  border-top-color:transparent;
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  -o-box-sizing: border-box;
  -ms-box-sizing: border-box;
  box-sizing: border-box;
  padding: 22px;
  padding-bottom: 0;
}
.list-content a:hover dl{
  border:1px solid #009e4d;
  box-shadow: 0 0 50px 1px #d1cece;
}
.list-content a dl img{
  -webkit-transition: all .3s linear;
  -moz-transition: all .3s linear;
  transition: all .3s linear;
}
.list-content a:hover dl img{
  -webkit-transform: scale(1.05);
  -moz-transform: scale(1.05);
  transform: scale(1.05);
}
.list-content dl :nth-child(1){
  overflow: hidden;
  height:222px;
}
.list-content dl :nth-child(1) img{
  width:100%;
  height:100%;
}
.list-content dl :nth-child(2) {
  font-size: 14px;
  line-height:34px;
  height:34px;
  padding:0 15px;
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  -o-box-sizing: border-box;
  -ms-box-sizing: border-box;
  box-sizing: border-box;
}

.list-content dl :nth-child(3){
  line-height: 34px;
  color:#009e4d;
}
.list-content dl :nth-child(3) i{
  color:#009e4d;
  font-size:16px;
  line-height:30px;
}
.list-content dl :nth-child(3) span{
  color:#009e4d;
  font-size:22px;
  padding: 0;
}
</style>
