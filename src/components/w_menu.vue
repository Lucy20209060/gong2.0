<template>
	<div class="w-menu">
		<div class="w-tManagement">
			<p v-on:click="tmt">交易管理</p>
			<ul>
				<router-link tag="li" to="/mine/myIndent" >我的订单</router-link>
				<router-link tag="li" to="/shopCart" >购物车</router-link>
				<router-link tag="li" to="/mine/batch" >批量下单</router-link>
				<router-link tag="li" to="/mine/batchList" >批量下单列表</router-link>
			</ul>
		</div>
		<div class="w-dManagement">
			<p v-on:click="dmt">资料管理</p>
			<ul>
				<router-link tag="li" to="/mine/certification" >认证信息</router-link>
				<router-link tag="li" to="/mine/address" >收货地址</router-link>
				<router-link tag="li" to="/mine/safe" >安全中心</router-link>
			</ul>
		</div>
	</div>
</template>

<script>
	export default {
		name:'w-menu',
		data(){
			return{
				show:true,
				show2:true
			}
		},
		methods:{
			//添加点击动画效果
			tmt(){
				if(this.show){
					$(".w-tManagement").animate({
						height:32
					},500,function(){
						$(".w-tManagement i").html("&#xe60b;")
					})
				}else{
					$(".w-tManagement").animate({
						height:150
					},500,function(){
						$(".w-tManagement i").html("&#xe60c;")
					})
				}
				this.show=!this.show
			},
			dmt(){
				if(this.show2){
					$(".w-dManagement").animate({
						height:32
					},500,function(){
						$(".w-dManagement i").html("&#xe60b;")
					})
				}else{
					$(".w-dManagement").animate({
						height:130
					},500,function(){
						$(".w-dManagement i").html("&#xe60c;")
					})
				}
				this.show2=!this.show2;
			}
		}
	}
</script>

<style scoped>
	.w-menu{
		float:left;
		width:130px;
		background-color: #fff;
		margin-right:10px;
		/*display: -webkit-box;
		-webkit-box-pack: center;
		-moz-box-pack: center;
		flex-direction: column;*/
		/*padding:0 5px 0 9px;*/
	}
	.w-menu .w-tManagement{
		width:156px;
		height:160px;
		border-bottom: 1px dashed #dcdcdc;
		padding-bottom: 8px;
		overflow: hidden;
	}
	.w-menu .w-tManagement p{
		cursor: pointer;
		position:relative;
		padding-bottom: 22px;
		font-size:16px;
		font-weight: 900;
	}
	.w-menu ul{
		overflow: hidden;
	}
	
	.w-menu .w-tManagement li{
		text-align: left;
		box-sizing: content-box;
		padding-bottom: 12px;
		font-size:12px;
		cursor: pointer;
	}
	.router-link-active{
		color: #009e4d!important;
	}
	.w-menu .w-tManagement a:last-of-type li{
		padding-bottom: 20px;
	}
	.w-menu .w-dManagement{
		width:130px;
		height:130px;
		overflow: hidden;
		padding-bottom: 16px;
	}
	.w-menu .w-dManagement p{
		cursor: pointer;
		position:relative;
		padding: 20px 0 22px 0;
		font-weight: 900;
	}
	.w-menu .w-dManagement li{
		text-align: left;
		box-sizing: content-box;
		padding-bottom: 12px;
		font-size:12px;
		cursor: pointer;
	}
</style>