<template>
	<div class="w-help-menu">
		<p @click="goAnimate(0,115)"><i class="iconfont">&#xe60c;</i>品牌承诺</p>
		<ul>
			<router-link tag="li" to="/help/origin">原产地直供</router-link>
			<router-link tag="li" to="/help/quality">品质保证</router-link>
			<router-link tag="li" to="/help/delivery">闪电发货</router-link>
			<router-link tag="li" to="/help/bestservice">优质服务</router-link>
		</ul>
		<p @click="goAnimate(1,115)"><i class="iconfont">&#xe60c;</i>采购方须知</p>
		<ul>
			<router-link tag="li" to="/help/registercertify">注册及认证</router-link>
			<router-link tag="li" to="/help/userrights">用户的权利和义务</router-link>
			<router-link tag="li" to="/help/platformrules">平台规则</router-link>
			<router-link tag="li" to="/help/termsofservice">服务条款</router-link>
		</ul>
		<p @click="goAnimate(2,136)"><i class="iconfont">&#xe60c;</i>售后服务</p>
		<ul>
			<router-link tag="li" to="/help/pledge">服务承诺</router-link>
			<router-link tag="li" to="/help/returnterms">退货条款</router-link>
			<router-link tag="li" to="/help/returnprocess">退换货流程</router-link>
			<router-link tag="li" to="/help/invoice">发票制度</router-link>
			<router-link tag="li" to="/help/problem">常见问题</router-link>
		</ul>
		<p @click="goAnimate(3,57)"><i class="iconfont">&#xe60c;</i>关于我们</p>
		<ul>
			<router-link tag="li" to="/help/weare">我们是谁</router-link>
			<router-link tag="li" to="/help/contactus">联系我们</router-link>
		</ul>
	</div>
</template>

<script>
  export default{
  	name:'help_menu',
  	data () {
  	  return{
  	  	msg:''
  	  }
  	},

  	methods:{
  		//动画效果
  		goAnimate(count,hCount){
  			if($(".w-help-menu ul").eq(count).height() > 10){
  				$(".w-help-menu ul").eq(count).animate({
  					height:0
  				},500,function(){
  					$(".w-help-menu p i").eq(count).html("&#xe60b;")
  				})
  			}else{
  				$(".w-help-menu ul").eq(count).animate({
  					height:hCount
  				},500,function(){
  					$(".w-help-menu p i").eq(count).html("&#xe60c;")
  				})
  			}
  		}
  	}
  }
</script>

<style scoped>
	.w-help-menu{
		width:100%;
		height:800px;
		background-color:#fff;
		padding:0 5px;
	}
	.w-help-menu p{
		line-height:52px;
		font-weight: 800;
		color:#333;
		cursor:pointer;
	}
	.w-help-menu p i{
		font-weight: 100;
		margin:0 10px 0 20px;
		font-size:14px;
	}
	.w-help-menu ul{
		overflow: hidden;
		
		padding-bottom:5px;
		border-bottom: 1px dashed #ccc;
	}
	.w-help-menu ul:last-of-type{
		border:none;
	}
	.w-help-menu ul li{
		cursor:pointer;
		padding-left:44px;
		font-size:14px;
		color:#333;
		line-height:26px;
	}
	.router-link-active{
		color:#009e4d !important;
	}
</style>