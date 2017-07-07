<template>
  <div class="shop-cart">
  	<div style="background: #f3f3f3" id="ccc">
		  <tIndexHeader ref="childMethod"></tIndexHeader>
		
		  <div class="w-shop-cart">
		  	<indentStatus>
		  		<span slot="indentName">我的购物车</span>
		  	</indentStatus>
		  	<p v-show="cartnone == true">
		  		<i class="iconfont" :class="{ 'icon-duigou': bWatchAll }" v-on:click="getAll"></i>
		  		<span>全选</span>
		  		<span>商品信息</span>
		  		<span>商品ID</span>
		  		<span>单价</span>
		  		<span>数量</span>
		  		<span>小计</span>
		  		<span>操作</span>
		  	</p>
		  	<div class="carList">
		  		<div 
		  			class="carCase" 
		  			v-for="(item,w_index) in cartList" 
		  			key="w_index" 
		  			:class="{saleout: saleoutStyle(item),'saleoutbg': item.selected==1}" >

		  			<i class="iconfont" 
              v-on:click="selfCheck(item)" 
              :count="w_index" 
              v-show="Number(item.goods_num)<=Number(item.store_count)&&item.store_count!=0&&item.is_on_sale==1"
            >
              {{item.selected==1?'&#xe618;':''}}
            </i>
		  			<router-link :to="{path:'/goodsDetails',query:{id:item.goods_id}}">
		  				<img v-bind:src="imgPre + item.image.image_url"/>
		  				<h6 v-if="item.is_on_sale==0||item.store_count==0||Number(item.goods_num)>Number(item.store_count)"></h6>
		  			</router-link>
		  			
				  		<strong v-if="item.store_count==0&&item.is_on_sale==1">此商品已售罄</strong>
			  			<strong v-if="Number(item.goods_num)>Number(item.store_count)&&item.store_count!=0&&item.is_on_sale==1">商品库存不足,请修改</strong>
			  			<strong v-if="item.is_on_sale==0">[失效]该商品已失效</strong>
		  			<span>
		  				<router-link :to="{path:'/goodsDetails',query:{id:item.goods_id}}" :class="{saleoutfont: saleoutStyle(item)}">{{item.goods_name}}</router-link>
		  			</span>
		  			<span :class="{saleoutfont: saleoutStyle(item)}">{{item.spec_key_name}}</span>
		  			<span :class="{saleoutfont: saleoutStyle(item)}">{{item.goods_id}}</span>
		  			<span :class="{saleoutfont: saleoutStyle(item)}">￥{{item.member_goods_price}}</span>
		  			<div>
		  				<button 
		  					v-on:click="jian(item)" 
		  					:class="{saleoutfont: saleoutStyle(item)}"
		  				>
		  					-
		  				</button>
		  				<b 
		  					class="goodsNum" 
		  					:class="{saleoutfont: saleoutStyle(item)}"
		  				>
		  					{{item.goods_num}}
		  				</b>
		  				<button 
		  					v-on:click="jia(item)" 
		  					:count="item.store_count" 
		  					:class="{saleoutfont: saleoutStyle(item)}"
		  				>
		  					+
		  				</button>
		  			</div>
		  			<span :class="{saleoutfont: saleoutStyle(item)}">￥{{item.goods_fee}}</span>
		  			<span 
		  				class="remove_menu" 
		  				v-on:click="shan(item, w_index)" 
		  				:remove_id="item.id" 
		  				:count="w_index" 
		  				:class="{saleoutfont: saleoutStyle(item)}"
		  			>
		  				删除
		  			</span>
		  		</div>
		  	</div>

			<!-- 支付栏未固定 -->
  			<div class="paybox" v-show="cartnone == true">				
  			  	<div class="clearList" v-if="!fixShow">
  			  		<i class="iconfont" :class="{ 'icon-duigou': bWatchAll }" v-on:click="getAll"></i>
  			  		<span>全选</span>
  			  		<span v-on:click="pishan">批量删除</span>
  			  		<span v-on:click="delfailure">清除失效商品</span>
  			  		<span>
  						<span>共{{this.jianshu}}件商品</span>	
  			  			商品总额（不含运费）：
  			  			<b :class="[payNum ? 'payText' : 'payNotText']">¥&nbsp;{{this.zongjia}}</b>
  			  		</span>
  			  		<button id="orders" :class="[payNum ? 'paySure' : 'payNotSure' ]" v-on:click="ok_go">确认下单</button>
  			  	</div>
  			</div>

			<!-- 支付栏固定 -->
		  	<div v-show="cartnone==true && fixShow" class="fixbox"></div>

		  	<div class="fixPosition" v-show="cartnone == true && fixShow" >
		  		<i class="iconfont" :class="{ 'icon-duigou': bWatchAll }" v-on:click="getAll"></i>
		  		<span>全选</span>
		  		<span v-on:click="pishan">批量删除</span>
		  		<span v-on:click="delfailure">清除失效商品</span>
		  		<span>
					   <span>共{{this.jianshu}}件商品</span>	
		  			 商品总额（不含运费）：
		  			 <b :class="[payNum ? 'payText' : 'payNotText']">¥&nbsp;{{this.zongjia}}</b>
		  		</span>
		  		<button  :class="[payNum ? 'paySure' : 'payNotSure' ]" v-on:click="ok_go">确认下单</button>
		  	</div>

			<!-- 购物车为空 -->
		  	<div class="cartnone" v-show="cartnone == false">
		  		<img src="../../static/images/cartnone.png">
		  		<span>您的购物车里还没有商品</span>
		  		<span>赶紧<router-link to="/">去逛逛吧</router-link></span>
		  	</div>
		  </div>
	  	</div>
	  	<indexFooter></indexFooter>
  </div>  
</template>
 
<script>
import tIndexHeader from '@/components/common/mine_header'
import indexFooter from '@/components/common/index_footer'
import indentStatus from '@/components/common/indentStatus'

export default {
  name: 'shopCart',
  data () {
    return {
  		imgPre:this.$store.state.img.imgPre,
  		cartList:[],
  		soldoutList: [], //失效商品列表
  		check:false,
  		checks:true,
  		shanOK:false,
  		goShop:false,
  		updateInfo:{ // 更新数据所需参数
          	cart_select:{},
          	goods_num:{}
        	},
  		zongjia:0,
  		jianshu:0,
  		cartnone: -1,
  		routename: this.$route.path, //获取路径名称
  		scrolldistance: '', //滚动的距离
  		goodsClientHeight: '', //window 窗口高度
  		goodsScrollHeight: '', //滚动高度
  		shebei: '', //屏幕的高度
  		fixTop:'', //支付栏距离窗口顶部的高度
  		fixShow: false, //支付栏是否固定在底部
  		singleSelectId: [], //单选选中的列表
  		bWatchAll: false, //全选监听
  		payNum: false, //是否有选中的商品
  		payboxId: '', //支付栏ID
  		carNumber:0   // 购物车中的数量
    }
  },
  components:{
  	indexFooter,tIndexHeader,indentStatus
  },
	beforeCreate(){

	let proof  = this.$cookie.getCookie('b61a9d162ac1dfaa22d0f05bdc7f6299');

	if(proof == 1 ){

	}else if(proof == -1){            						// 审核中
		this.$message("认证状态中，暂无权限访问该页面");
		this.$router.push('/');

	}else if(proof == -2 || proof == -3 ){     				// 审核没通过 未查询到数据
		this.$message("认证失败，请重新进行审核");
	    this.$router.push('/proof');
	}else if(proof == -4 ){     							// 未提交认证
		this.$message("未提交认证，请先认证");
	    this.$router.push('/proof');
	}else{
		this.$router.push('/login');
	}

	},

  mounted(){
  	this.getHttp(); 
    this.$nextTick(function(){	
  		window.addEventListener('scroll', this.payPosition)
  	});
  	// this.payPosition();
    $('body,html').animate({scrollTop:0},10);
  },
  watch:{  	
  	scrolldistance: {  		
  		handler(curval,oldval) {	  			
  			if(this.shebei < this.goodsScrollHeight - curval - 515) {
  				this.fixShow = true
  			}else{
  				this.fixShow = false
  		  }
  	}
  }
  },
  methods:{
      removeCookie(cookieName) {
				let cookies = document.cookie.split(";");
				for (let i = 0; i < cookies.length; i++) {
					if (cookies[i].indexOf(" ") == 0) {
						cookies[i] = cookies[i].substring(1);
					}
					if (cookies[i].indexOf(cookieName) == 0) {
						let exp = new Date();
						exp.setTime(exp.getTime() - 60 * 1000);
						document.cookie = cookies[i] + ";expires=" + exp.toUTCString();
						break;
					}
				}
			},
  	//更新数据
  	updataHttp(){
  		this.getInfo();
  		let that = this;
  		$.ajax({
  			type:"post",
  			url:that.$store.state.apilink+"?s=api/cart/update",
  			async:true,
  			dataType:"json",
  			data:that.updateInfo,
  			success:function(data){
  				that.cartList = data.data.cartList;
  				//切换购物车是否为空
  				if(that.cartList.length == "0"){
	    			that.cartnone = false;
	    		}else{
	    			that.cartnone = true;
	    		}
	    		//计算总价
				  that.gongjia();
  				//切换确认下单状态
  				for(let i=0,len = that.cartList.length;i<len;i++) {
  					if(that.cartList[i].selected == 1&&that.cartList[i].is_on_sale != 0&&Number(that.cartList[i].goods_num)<=Number(that.cartList[i].store_count)&&that.cartList[i].store_count!=0){
  						return that.payNum = true;  						 
  					}else{
  						that.payNum = false;
  					}
  				}
  			}
  		});
  	},
  	//计算总价
  	gongjia(){
  		this.jianshu = 0;
  		this.zongjia = 0;
      let goodsNum = 0;
      for(let i=0,len=this.cartList.length;i<len;i++){
        if(this.cartList[i].is_on_sale != 0&&Number(this.cartList[i].goods_num)<=Number(this.cartList[i].store_count)&&this.cartList[i].store_count!=0) {
  				if(this.cartList[i].selected == '1'){
            goodsNum ++;            
  					this.jianshu = goodsNum;
  					this.zongjia = +this.zongjia + this.cartList[i].member_goods_price*this.cartList[i].goods_num;
  					this.zongjia = this.zongjia.toFixed(2)
  				}          
        }
			}
  	},
  	//获取列表
  	getInfo(){
  		for(let i=0,len=this.cartList.length;i<len;i++){
	        this.updateInfo.cart_select[this.cartList[i].id]=this.cartList[i].selected;
	        this.updateInfo.goods_num[this.cartList[i].id]=this.cartList[i].goods_num;
      	}
  	},
  	//请求获取商品列表
  	getHttp(){
  		let that = this;
  		$.ajax({
	    	type:"get",
	    	dataType:"json",
	    	url:that.$store.state.apilink+"?s=api/cart/getlist",
	    	success:function(data){
	    		that.cartList = data.data.cartList; 
          for (let j = 0, lens = that.cartList.length; j<lens;j++) {
            if(that.cartList[j].is_on_sale == 0 ||　Number(that.cartList[j].goods_num)>Number(that.cartList[j].store_count)||that.cartList[j].store_count==0) {
              that.cartList[j].selected = 0;
            } 
          }

          
          // console.log(that.cartList)        
	    		that.gongjia();
	    		if(that.cartList.length == "0"){
	    			that.cartnone = false;
	    		}else{
	    			that.cartnone = true;
	    		}

		        //切换确认下单状态	
  				for(let i=0,len = that.cartList.length;i<len;i++) {
  					if(that.cartList[i].selected == 1){
  						 that.payNum = true;  
  						break;				 
  					}else{
  						that.payNum = false;
  					}
  				}

	    		//切换全选状态
		        for(let i in that.cartList) {
		          if(that.cartList[i].selected == 0) {
		            that.bWatchAll = false;
		            return false;
		          }else{
		            that.bWatchAll = true;
		          }
		        }
	    	}
    	});
  	},
  	//删除请求
  	removeHttp(Ids){
  		let that = this;
  		that.shanOK = false;
  		$.ajax({
	    	type:"post",
	    	url:that.$store.state.apilink+"?s=api/cart/remove&ids="+Ids,
	    	async:false,
	    	success:function(data){
	    		if(JSON.parse(data).error == 0){
	    			that.shanOK = true;
            if(that.cartList.length <= 6) {
              that.fixShow = false;
            }
	    		}         
          
        }
    	});
  	},
  	//删除元素
  	shan(item, w_index){
  		let ids = item.id;
  		let cts = w_index;
  		//发送删除请求
  		this.removeHttp(ids);
  		if(this.shanOK){
  			this.$refs.childMethod.getCarNum();
			  this.cartList.splice(cts,1);
  			this.updataHttp();
  		}else{
  			this.$message("删除失败");
  		}		
  	},
  	//批量删除
  	pishan(){      
  		let goodArr = [];
  		for(let i in this.cartList){
  			if(this.cartList[i].selected == 1) {
  				goodArr.push(this.cartList[i].id)
  			}
  		}

  		goodArr=goodArr.join(",")
  		//发送删除请求
  		this.removeHttp(goodArr)
  		if(this.shanOK){
        this.$refs.childMethod.getCarNum();
  			//发送更新请求
  			this.updataHttp();
  		}else{
  			alert("删除失败")
  		}
  	},
  	//清除失效商品
  	delfailure(){
  		for(let i in this.cartList){
  			if(this.cartList[i].is_on_sale == 0) {
  				this.soldoutList.push(this.cartList[i].id)
  			}
  		}
  		let soldoutStr = this.soldoutList.toString();
  		//发送删除请求
  		this.removeHttp(soldoutStr)
  		if(this.shanOK){
        this.$refs.childMethod.getCarNum();
        //发送更新请求
        this.updataHttp();
        this.$message("删除成功");
  		}else{
  			alert("删除失败")
  		}
  	},
  	//全选
  	getAll(){
      	this.bWatchAll = !this.bWatchAll;  
      	for(let i in this.cartList) {
        	if(this.bWatchAll){
	          	this.cartList[i].selected = 1;
	          	this.singleSelectId.push(this.cartList[i].id);
        	}else{
	          	this.cartList[i].selected = 0;
	          	this.singleSelectId = [];
        	}

        	// 全选 过滤掉 异常商品
        	if(this.cartList[i].is_on_sale == 0 ||　Number(this.cartList[i].goods_num)>Number(this.cartList[i].store_count)||this.cartList[i].store_count==0) {
              this.cartList[i].selected = 0;
            } 
      	}




			this.updataHttp();
  	},
  	//单选
  	selfCheck(item){
      if(item.is_on_sale==0) {
        return false;
      }
  		this.singleSelectId = [];
  		if(item.selected == 0) {
        	item.selected = 1;
      	}else{
        	item.selected = 0;
      	}
  		//console.log(item.selected)

      	this.bWatchAll = true;

      	for(let i=0,len=this.cartList.length;i<len;i++) {
        	if(this.cartList[i].selected == 0) {
          		this.bWatchAll = false;
        	}else{
          		this.singleSelectId.push(this.cartList[i].id);
          	}   


        }
  		this.updataHttp();
  	},
  	//加数量
  	jia(item){
      // console.log(1)
  		if(Number(item.goods_num) < Number(item.store_count)) {
        	item.goods_num++;        
      	}else{
        	item.goods_num = item.store_count;
      	}
  		this.updataHttp();
  	},
  	//减数量
  	jian(item){
  		if(item.goods_num < 2) {
        	item.goods_num = 1;
      	}else{
        	item.goods_num --;
      	}
  		this.updataHttp();
  	},
  	//确认下单
  	ok_go(){
  		if(!this.payNum){
  			this.$message('请选择商品')
  		}else{
  			// 购物车页面标志cookie path1Sign 10s删除 该标志下才能进入 /order 页面
  			this.$cookie.setCookie('path1Sign','true','s10');
  			this.$router.push({path:"order"});
  		}
  	},
  	//失效状态商品文字颜色
  	saleoutStyle(item) {
  		if((item.store_count==0&&item.is_on_sale==1)||(Number(item.goods_num)>Number(item.store_count)&&item.store_count!=0&&item.is_on_sale==1)||(item.is_on_sale==0||item.store_count==0||Number(item.goods_num)>Number(item.store_count))) {
  			return true;
  		}
  	},
  	//支付栏位置切换
  	payPosition() {
  		this.scrolldistance = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
  		this.goodsClientHeight = document.body.clientHeight || document.documentElement.clientHeight;
  		this.goodsScrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
  		this.shebei = window.screen.availHeight;
  

  		if(this.goodsClientHeight - this.scrolldistance  >= this.shebei ) {
  			this.fixShow = true;
  		}else{
  			this.fixShow = false;
  		}
  	}
  }
}
</script>

<style scoped>
  .shop-cart {
    min-width: 1220px;
  }
	.w-shop-cart{
		width:1200px;
		padding:0 0 40px 0;
		margin:0 auto;
		min-height:350px;    
	}
	.w-shop-cart h3{
		font-weight: 600;
		font-size: 20px;
		text-align: left;
		color:#333;
		height: 38px;
		padding-top: 18px;
	}
	.w-shop-cart p{
		height:60px;
		font-size:16px;
		font-weight: 900;
		background-color: #fff;
		color:#333;
		text-align: left;
		display: flex;
		align-items: center;
		margin:0 0 4px;
	}
	.w-shop-cart p i{
		cursor: pointer;
		display: inline-block;
		line-height:16px;
		text-align: center;
		font-size: 14px;
		width:15px;
		height:15px;
		border:1px solid #A7A7A7;
		margin:0 15px;
	}
	.w-shop-cart p span:nth-of-type(2){
		margin:0 120px 0 130px
	}
	.w-shop-cart p span:nth-of-type(4){
		margin:0 130px 0 130px
	}
	.w-shop-cart p span:nth-of-type(6){
		margin:0 160px 0 150px;
	}
	.w-shop-cart .carCase{
		width:1200px;
		height:116px;
		overflow: hidden;
		position:relative;
		margin-bottom: 1px;
		background: #fff;
	}
	.w-shop-cart .carCase div{
		float:left;
	}
	.w-shop-cart .carCase i{
		line-height:15px;
		text-align: center;
		cursor: pointer;
		position:absolute;
		left:15px;
		top:30px;
		width:15px;
		height:15px;
		background-color:#fff;
		border: 1px solid #D8D8D8;
		font-size: 14px;
	}
	.w-shop-cart .carCase img{
		position:absolute;
		left:50px;
		top:10px;
		width:90px;
		height:90px;
	}
	.w-shop-cart .carCase span{
		display: inline-block;
		font-size:14px;
		color:#333;
		position: absolute;
	}
	.w-shop-cart .carCase span:nth-of-type(1){
		left:172px;
		top:30px;
		width:150px;
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
	}
	.w-shop-cart .carCase span:nth-of-type(2){
		left:172px;
		top:65px;
		color:#999;
	}
	.w-shop-cart .carCase span:nth-of-type(3){
		left:405px;
		top:30px;
	}
	.w-shop-cart .carCase span:nth-of-type(4){
		left:568px;
		top:30px;
	}
	.w-shop-cart .carCase div{
		height:28px;
		position:absolute;
		left:704px;
		top:27px;
		border:1px solid #D8D8D8
	}
	.w-shop-cart .carCase div button{
		float:left;
		cursor: pointer;
		width:28px;
		height:28px;
	}
	.w-shop-cart .carCase div b{
		font-size:14px;
		line-height:29px;
		color:#333;
		height:100%;
		font-weight: 100;
		float: left;
		width:40px;
		border:1px solid #D8D8D8;
		border-top:none;
		border-bottom:none;
		text-align: center;
	}
	.w-shop-cart .carCase span:nth-of-type(5){
		left:910px;
		top:30px;
	}
	.w-shop-cart .carCase span:nth-of-type(6){
		right:60px;
		top:30px;
		cursor: pointer;
	}
	
	.w-shop-cart .clearList{
		font-size:16px;
		position:relative;
		align-items:center;
		text-align: left;
		width:1200px;
		height:64px;
    line-height: 64px;
		background: #fff;
		margin-top: 10px;
	}
	.w-shop-cart .clearList i{
		cursor: pointer;
		display: inline-block;
		background-color: #fff;
		line-height:1;
		width:15px;
		height:15px;
		border:1px solid #A7A7A7;
		margin:0 15px;
	}
	.w-shop-cart .clearList span:nth-of-type(2){
		margin:0 20px 0 40px;
		cursor: pointer;
	}
	.w-shop-cart .clearList span:nth-of-type(3){
		margin: 0 0 0 20px;
		cursor: pointer;
	}
	.w-shop-cart .clearList span:nth-of-type(4){
		position: absolute;
		right: 170px;
	}
	/*.w-shop-cart .clearList span b {
		color: #e64346;
		font-size: 20px;
	}*/
	.w-shop-cart .clearList span span {
		margin-right: 27px;
	}
	.w-shop-cart .clearList button{
		display: block;
		position:absolute;
		cursor:pointer;
		right:0;
		top:0;
		width:150px;
		height:100%;
		font-size: 20px;
	}
	
	.w-shop-cart .cartnone{
		position:relative;
		width:1200px;
		min-height:350px;
		padding:200px auto;
		background: #fff;
	}
	.w-shop-cart .cartnone img{
		position:absolute;
		width:88px;
		height: 68px;
		left: 500px;
		top: 130px;
	}
	.w-shop-cart .cartnone span:first-of-type{
		position:absolute;
		left:600px;
		top: 130px;
	}
	.w-shop-cart .cartnone span:last-of-type {
		position:absolute;
		left: 600px;
		top: 170px;
	}
	.w-shop-cart .cartnone span:last-of-type a{
		color: #009e4d;
		text-decoration: underline;
	}
	.w-shop-cart .carCase strong{
		position:absolute;
		font-size:14px;
		font-weight: 100;
		left:50px;
		top:116px;
		z-index: 100;
	}
	.w-shop-cart .saleout {
		height: 150px;
	}
	.w-shop-cart .carCase .saleoutfont {
		color: #999;
		
	}
	.w-shop-cart .saleoutbg {
		background: #fefdf9;
	}
	.w-shop-cart .carCase h6{
		position:absolute;
		width:90px;
		height:90px;
		background: #ccc;
		top:10px;left:50px;
		opacity: 0.7;
		z-index: 10;
	}
	.w-shop-cart .fixbox {
		font-size:16px;
		position:relative;
		display: flex;
		align-items:center;
		text-align: left;
		width:1200px;
		height:64px;
		margin-top: 10px;
	}
	.w-shop-cart .fixPosition{
		font-size:16px;
		position:fixed;
		bottom: 0;
		display: flex;
		align-items:center;
		text-align: left;
		width:1200px;
		height:64px;
		background: #fff;
		margin-top: 10px;
		z-index: 999;
	}
	.w-shop-cart .fixPosition i{
		cursor: pointer;
		display: inline-block;
		background-color: #fff;
		line-height:15px;
		text-align: center;
		width:15px;
		height:15px;
		border:1px solid #A7A7A7;
		margin:0 15px;
		font-size: 14px;

	}
	.w-shop-cart .fixPosition span:nth-of-type(2){
		margin:0 20px 0 40px;
		cursor: pointer;
	}
	.w-shop-cart .fixPosition span:nth-of-type(3){
		margin: 0 0 0 20px;
		cursor: pointer;
	}
	.w-shop-cart .fixPosition span:nth-of-type(4){
		position: absolute;
		right: 170px;
	}
	.w-shop-cart .fixPosition span b {
		color: #e64346;
		font-size: 20px;
	}
	.w-shop-cart .fixPosition span span {
		margin-right: 27px;
	}
	.w-shop-cart .fixPosition button{
		display: block;
		position:absolute;
		cursor:pointer;
		right:0;
		top:0;
		width:150px;
		height:100%;
		font-size: 20px;
	}
	.paySure {
		color: #fff;
		background-color:#e64346;
	}
	.payNotSure {
		background: #ccc;
		color: #fff;
	}
	.paybox {
		width: 1200px;
		height: 64px;
	}
  .w-shop-cart .clearList span:nth-of-type(4) .payText {
    color: #e64346;
    font-size: 20px;
  }
  .w-shop-cart .clearList span:nth-of-type(4) .payNotText {
    color: #999;
    font-size: 20px;
  }
</style>