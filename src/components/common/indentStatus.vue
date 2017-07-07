<template>
	<h3 class="indentStatus">
		<slot name="indentName"></slot>
		<ul >
			<li v-if="routename == '/shopCart'">
				<span>我的购物车</span>
				<span>填写核对订单</span>
				<span>提交订单</span>
				<img src="/static/images/myshopcar.png" alt="" >				
			</li>
			<li v-if="routename == '/order'">
				<span>我的购物车</span>
				<span>填写核对订单</span>
				<span>提交订单</span>
				<img src="/static/images/myindent.png" alt="" >
			</li>
			<li v-if="routename == '/payment' || routename =='/paywayWeixin'">
				<span>我的购物车</span>
				<span>填写核对订单</span>
				<span>提交订单</span>
				<img src="/static/images/indentpay.png" alt="" >
			</li>
		</ul>
	</h3>

</template>

<script>
	export default {
		name: 'indentStatus',
		data() {
			return {
				routename: this.$route.path
			}
		},
		created() {
			this.getPath()
		},
		methods:{
			getPath() {
			// console.log(this.$route.path)

			}
		}
	}
</script>

<style scoped>
	.indentStatus{
		font-weight: 600;
		font-size: 20px;
		text-align: left;
		color:#333;
		height: 38px;
		padding-top: 18px;
		background: #f3f3f3;
	}
	.indentStatus ul{
		float: right;
	}
	.indentStatus li {
		position: relative;
		font-weight: 100;
	}
	.indentStatus li span:nth-of-type(1) {
		position: absolute;
		left: 20px;
		top: 2px;
		color: #fff;
		font-size: 12px;
	}
	.indentStatus li span:nth-of-type(2) {
		position: absolute;
		left: 130px;
		top: 2px;
		color: #fff;
		font-size: 12px;
	}
	.indentStatus li span:nth-of-type(3) {
		position: absolute;
		left: 260px;
		top: 2px;
		color: #fff;
		font-size: 12px;
	}
	.indentStatus li img {
		
	}
</style>