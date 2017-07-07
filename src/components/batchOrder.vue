<template>
  <div class="w-batch-list">
  	
  	<h3>批量下单列表</h3>
  	<p class="batchList-bar" v-if="batchOrderList.length != 0">
	  	<span></span>
	  	<span>商品信息</span>
	  	<span>商品ID</span>
	  	<span>数量</span>
	  	<span>单价</span>
	  	<span>小计</span>
	  	<span>收货地址</span>
  	</p>

  	<div class="batchList" v-if="batchOrderList.length != 0">

		<dl class="batchList-list" v-for="(item,index) in batchOrderList" key="index">
			<dt>
				<span v-text="`导入时间：${item.add_time}`"></span>
				<i class="iconfont icon-iconfont19" @click="removeGood(index,item.id)"></i>
			</dt>

			<dd>
				<div class="icon-wrap"></div>
				
				<div class="image-wrap">
					<img :src="imgPre" :onerror="imgErr" />
				</div>

				<div class="name-wrap">
					<span>{{item.goods_name}}</span>
					<i>{{item.spec_key_name}}</i>
					<em>
						<i>{{item.tip.msg}}</i>
					</em>
				</div>

				<div class="id-wrap">
					<span>{{item.goods_id}}</span>
				</div>

				<div class="num-wrap">
					<p>x{{item.goods_num}}</p>
				</div>

				<div class="price-wrap">
					<span>{{item.goods_price}}</span>
				</div>

				<div class="tot-wrap">
					<span>{{(item.goods_num*item.goods_price).toFixed(2)}}</span>
					<i>{{`运费：包邮`}}</i>
				</div>

				<div class="add-wrap">
					<p class="add-name-wrap">
						<span>{{item.consignee}}</span>
						<input v-model="item.mobile" type="number" />
					</p>
					<p class="add-add-wrap" v-if="item.province != -1">
						<span>{{item.province}}</span>
						<span>{{item.city}}</span>
						<span>{{item.district}}</span>
						<em>{{ellipsis(item.address)}}</em>
					</p>
				</div>

			</dd>

		</dl>

  	</div>

  	<div class="kongb" v-if="batchOrderList.length == 0">
  		<img src="/static/images/kongb.png" alt=""  />
  		<h4>没有找到相关的订单信息</h4>
  	</div>

  	<div class="clearList" v-if="batchOrderList.length != 0">
	  	
	  	<span>{{`商品价格: ${total_price.total_fee}元`}}</span>
	  	<span class="pointer">运费：包邮</span>
		
		<button id="orders" v-bind:class="{activeBtn:batchOrderList.length !=0}" @click="confirmOrder(bAffirmSign)">去付款</button>
		<p>
			<span>
				<em>商品总额：</em>
				<b>{{`￥${total_price.total_fee}`}}</b>
			</span>
		</p>
	  	
  	</div>

  </div>
</template>

<script>

export default {
	name: 'batch-list',
	data () {
	    return {
	    	imgPre:this.$store.state.img.imgPre,
	    	imgErr:'this.src="/static/images/imgtem.png"',

	    	total_price:{				// 总金额 总商品数
	    		total_fee:0.00,
	    		num:0
	    	},

	    	address:{
	    		province:[],
	    		city:[],
	    		district:[]
	    	},

	    	batchRemove:[],				// 删除商品数组
	    	batchOrderList:[],
	    	bAffirmSign:false			// 检测是否有异常商品
	    }
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
	watch:{
		// batchList:{
		// 	handler(curval,oldval){
		// 		console.log(curval)
		// 	}
		// }
	},
	mounted(){
		this.batchHttp();
		$('body,html').animate({scrollTop:0},10);
	},
	methods:{
		// 去付款
		confirmOrder(sign){

			// 存在异常商品 阻止
			if(!sign){
				this.$message.error('订单中存在异常商品，建议删除');
				return false;
			}

			
			const _this = this;
			$.ajax({
				type:"get",
				url:this.$api.batchOrder.create,
				dataType: "json",
				success:function(res){

						if(res.data){

							// this.$router.push('/mine/batchOrder');
							// order 页面标志 是否进入支付页标志
			    			_this.$cookie.setCookie('path2Sign','true','s10');
							_this.$router.push({
								path:'/payment',
								query:{
									trade_sn:res.data.trade_sn
								}
							});

						}else{

							_this.$message({
					        	message: res.error_msg,
					        	type: 'warning'
					        });

						}
				},
				error:function(res){
					// console.log(res)
				}
			})
		},

		// 详细地址省略过多字符
		ellipsis(world){

			if(world.length >= 20){
				return world.slice(0,20) + "..."
			}else{
				return world;
			}

		},

		//初始化
		batchHttp(){
		const _this = this;
			$.ajax({
				type:"get",
				url:this.$api.batchList.getCartBatchs,
				data:{
					confirm:1
				},
				dataType: "json",
				success:function(res){

						_this.batchOrderList = res.data.cartList;
						_this.total_price.total_fee = res.data.total_price.total_fee;

						_this.detection();
				},
				error:function(res){
					// console.log(res)
				}
			})
		},

		// 删除 单个商品
		removeGood(index,value){
			this.batchRemove = [];
			this.batchRemove.push(value);
			this.removeHttp(index);
		},
		//删除请求 -1 删除多个 ， >0 删除单个
		removeHttp(index=-1){
			let idsStr = this.batchRemove.join(",");
			const _this = this;
			$.ajax({
				type:"get",
				url:this.$api.batchList.remove,
				data:{
					ids:idsStr
				},
				dataType: "json",
				success:function(res){

					if(res.error == 0){

						// if(index >=0){
						// 	_this.batchOrderList.splice(index,1);
						// }else{
							_this.batchHttp();
						//}
						_this.$message('删除成功');

					}else{

						_this.$message({
	                    message: res.error_msg,
	                    type: 'warning'
	                });

					}

				},
				error:function(res){
					// console.log(res)
				}
			})
		},

		// 检测是否有 开启 确认下单 按钮
	  	detection(){
	  		for(let value of this.batchOrderList){
	  			if(value.tip.error == 0){
	  				this.bAffirmSign = true;
	  			}else{
	  				this.bAffirmSign = false;
	  				return false;
	  			}
	  			
	  		}

	  	},

	}
}
</script>

<style scoped>
	.add-wrap p select{
		float: left;
		border: 1px solid #ebebeb;
		margin: 10px 0 5px;
    	width: 33.33%;
    	border-right: 0;
	}
	.add-wrap p select:last-child{
    	border-right: 1px solid #ebebeb;
	}
	.add-name-wrap,.add-add-wrap{
		overflow: hidden;
	}
	.add-name-wrap span{
		float: left;
		width: 40%;
	}
	.add-add-wrap span{
		float: left;
		padding: 10px 0 5px;
		width: 33.33%;
		white-space: nowrap;
	    overflow: hidden;
	    text-overflow: ellipsis;

	}
	.add-add-wrap em{
		float: left;
		/*text-overflow: -o-ellipsis-lastline;
		overflow: hidden;
		text-overflow: ellipsis;
		display: flex;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;*/
	}
	.add-name-wrap input{
		float: left;
		width: 60%;
	}
	.batchList-list{
		width: 100%;
		border: 1px solid #ebebeb;
		margin-bottom: 28px;
		overflow: hidden;
		font-size: 14px;
	}
	.batchList-list dt{
		float: left;
		width: 100%;
		-moz-box-sizing: border-box;
	    -webkit-box-sizing: border-box;
	    -o-box-sizing: border-box;
	    -ms-box-sizing: border-box;
	    box-sizing: border-box;
		background: #f7f7f7;
		height: 34px;
		line-height: 34px;
		border-bottom:1px solid #ebebeb; 
		color: #b1b1b1;
		padding: 0 8px 0 16px;
	}
	.batchList-list dt i{
		float: right;
		cursor: pointer;
		width: 40px;
		text-align: center;
	}
	.batchList-list dt i:hover{
		font-size: 20px;
	}
	.batchList-list dd{
		float: left;
		height: 114px;
		-moz-box-sizing: border-box;
	    -webkit-box-sizing: border-box;
	    -o-box-sizing: border-box;
	    -ms-box-sizing: border-box;
	    box-sizing: border-box;
	}
	.batchList-list dd div{
		float: left;
	}
	.batchList-list .icon-wrap{
		width: 40px;
		padding: 48px 12px;
		-moz-box-sizing: border-box;
	    -webkit-box-sizing: border-box;
	    -o-box-sizing: border-box;
	    -ms-box-sizing: border-box;
	    box-sizing: border-box;
	}
	.batchList-list .icon-wrap i{
		display: block;
		border: 1px solid #A7A7A7;
		height: 100%;
		width: 100%;
		line-height: 16px;
		text-align: center;
		cursor: pointer;
	}
	.batchList-list .image-wrap{
		width: 94px;
		padding: 8px 4px;
	}
	.image-wrap img{
		width: 100%;
		height: 100%;
	}
	.batchList-list .name-wrap{
		padding: 16px 0 16px 16px;
	    width: 160px;
	    height: 100%;
	    -moz-box-sizing: border-box;
	    -webkit-box-sizing: border-box;
	    -o-box-sizing: border-box;
	    -ms-box-sizing: border-box;
	    box-sizing: border-box;
	    position: relative;
	}
	.name-wrap span{
		display: block;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.name-wrap > i{
		display: block;
		margin-top: 16px;
		color: #b1b1b1;
	}
	.name-wrap em{
		position: absolute;
		color: red;
		bottom: 10px;
		word-break:keep-all;
		white-space:nowrap;
	}
	.name-wrap em i{
		margin-right: 5px;
	}

	.batchList-list .id-wrap{
		width: 74px;
		text-align: center;
		padding-top: 16px;
	}
	.batchList-list .num-wrap{
		padding: 16px 0 0 68px;
    	width: 82px;
	}
	.num-wrap p{
		display: inline-block;
		width: 66px;
		height: 24px;
		text-align: center;
	}

	.batchList-list .price-wrap{
		width: 100px;
		text-align: center;
		padding-top: 16px;
	}
	.batchList-list .tot-wrap{
		width: 74px;
		text-align: left;
		padding: 16px 0 0 34px;
	}
	.tot-wrap span{
		display: block;
	}
	.tot-wrap i{
		display: block;
		color: #b1b1b1;
		margin-top: 16px;
	}
	.batchList-list .add-wrap{
		position: relative;
		padding: 16px 16px 0 16px;
		margin-left: 10px;
		width: 184px;
	}
	.add-wrap:after{
		content: '';
		position: absolute;
		width: 1px;
		height: 75%;
		left: 0;
		top: 16px;
		background: #ebebeb;
	}

	.w-batch-list{
		float:left;
		width:963px;
		background-color: #fff;
		padding:16px 25px 0 32px;
	}
	.w-batch-list h3{
		text-align: left;
		color:#333;
		padding-bottom:14px;
		border-bottom:1px solid #D8D8D8
	}
	.batchList-bar{
		height:44px;
		font-size:14px;
		color:#333;
		text-align: left;
		display: flex;
		align-items: center;
		margin:12px 0 22px;
	}
	.batchList-bar i{
		float: right;
		cursor: pointer;
		display: inline-block;
		line-height:1;
		width:15px;
		height:15px;
		border:1px solid #A7A7A7;
		margin:0 15px;
	}
	.batchList-bar span:nth-of-type(2){
		margin:0 184px 0 80px
	}
	.batchList-bar span:nth-of-type(4){
		margin:0 70px 0 107px
	}
	.batchList-bar span:nth-of-type(6){
		margin:0 130px 0 70px;
	}
	.kongb{
		text-align: center;
		padding: 150px 0;
	}
	.kongb img{
		width: 100px;
		height: auto;
	}
	.kongb h4{
		color:#999;
		margin-top:10px;
		font-size: 14px;
	}
	.clearList{
		font-size:14px;
		line-height:58px;
		text-align: left;
		width:961px;
		height:58px;
		border:1px solid #D8D8D8;
		margin-bottom: 50px;
	}
	.clearList p{
		float: right;
		margin-right: 30px;
		height: 100%;
	}
	.clearList button{
		float: right;
	}
	.clearList i{
		cursor: pointer;
		float: left;
		background-color: #F2F2F2;
		line-height:16px;
		width:15px;
		height:15px;
		border:1px solid #A7A7A7;
		margin:20px 15px 0 15px;
	}
	.clearList span{
		float: left;
		height: 100%;
		margin-left: 20px;
		display: inline-block;
		line-height: 58px;
	}
	.clearList p span b{
		color: #e64346;
		font-size: 20px;
	}
	.w-batch-list .clearList .pointer{
		margin-left:34px; 
		float: left;
	}
	.w-batch-list .clearList button{
		position:relative;
		display: block;
		float: right;
		width:120px;
		height:100%;
		background-color:#ccc;
		font-size: 20px;
		color: #fff;
		cursor: pointer;
	}
	.w-batch-list .clearList .activeBtn{
		background: #e64364;
	}
	.w-batch-list .clearList button div{
		position:absolute;
		left:0;
		top:0;
		width:100%;height:100%;
	}
</style>