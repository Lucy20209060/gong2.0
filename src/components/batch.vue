<template>
  <div class="w-batch">
  	<h3>批量订单列表</h3>
  	<div class="step">
  		<h4>操作步骤：</h4>
  		<p>
  			<span>1</span>点击<a href="javascript:;">下载最新商品列表</a>，获取最新的商品清单
  		</p>
  		<p>
  			<a :href="exportGoodsList">
  				<button>点击下载</button>
  			</a>
  		</p>

  		<p>
  			<span>2</span>点击<a href="javascript:;">下载订单导入模板</a>，获取导入模板，根据模板格式填入订单信息；
  		</p>
  		<p>
  			<a :href="exportOrderTem">
  				<button>点击下载</button>
  			</a>
  		</p>

  		<p>
  			<span>3</span>上传订单导入模板，上传后如有失败条目，可下载失败文件并重新上传；
  		</p>
  		<p>
  			上传成功后，可在“个人中心-交易管理-批量订单列表”查看导入成功的订单，并且进行付款操作。
  		</p>

		<el-upload
			class="upload"
			accept="excel"
			:data="{'name':'excel'}"
			:action="loadUrl"
			:on-change="handleSuccess"
			:on-success="success"
			:on-error="backError"
			:file-list="fileList"
			:on-preview="loadSuccess"
			:before-upload="beforeUpload"
		>
			<el-button size="small" type="primary">点击上传</el-button>
		</el-upload>

		<p>
	  		成功：<i>{{loadResponse.successNum}}</i>
	  		失败：<i>{{loadResponse.failNum}}</i>
  		</p>

  		<p v-if="loadResponse.failNum > 0">
  			<a class="load-failed" :href="loadFailedUrl" @click="loadfail">下载导入失败商品</a>
  		</p>

	
  	</div>
  </div>
</template>

<script>
export default {
	name: 'batch',
	data () {
		return {
			fileList:[],
			loadUrl:this.$api.batch.importOrders,				// 文件上传地址
			loadFailedUrl:this.$api.batch.getFailExcel,			// 下载失败商品
			exportGoodsList:this.$api.batch.exportGoodsList,	// 下载商品列表
			exportOrderTem:this.$api.batch.exportOrderTem,		// 下载上传模板
			loadResponse:this.$store.state.fileLoadNum,
			fileName:[]
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
	created(){
		// console.log(this.$store.state.fileLoadNum)
	},
	methods:{

		// 点击下载失败商品
		loadfail(){
			this.$store.commit('setFileLoad',{
				failed:0,
            	success:0
			});
		},

	  	// 上传文件之前调用函数
	  	beforeUpload(file){

	  		const fileSuffix = file.name.slice(file.name.lastIndexOf('.')+1)

	  		if(this.fileName.length >= 1){
	  			this.$message.error('请勿重复上传');
	  			return false;
	  		}

	  		if(fileSuffix.indexOf('xl') == 0){

	  			this.fileName.push(file.name);

	  		}else{
	  			this.$message.error('文件格式错误，请重新上传');
	  			this.fileList = [];
	  			return false;
	  		}

	  	},

	  	// 上传成功 回调
	  	loadSuccess(file){
	  		console.log(file)
	  		if(file.status =="fail"){
	  			this.$message.error('文件上传失败');
	  			return false;
	  		}else if(file.status =="ready"){
	  			return false;
	  		}

	  		if(file.response.error == 0){
	  			// 返回的数据 存到vuex
	  			this.$store.commit('setFileLoad',file.response.data);
	  		}else{
	  			this.$message.error(file.response.error_msg);
	  			this.fileList=[];
	  			this.fileName=[];
	  			
	  		}
	  	},

	  	// 上传完成 自动完成点击事件 获取回调数据
	  	handleSuccess(file, fileList) {
	  		// console.log(this.loadUrl)
	  		this.$nextTick(function(){

                document.getElementsByClassName('el-upload-list__item-name')[0].click();

            })
			

	    },
	    success(){
	    	// console.log('success')
	    },
	    backError(){
	    	this.$message.error('上传失败');
	    }
  }
}
</script>

<style scoped>
	/* 2.0版 注释 2017/06/21 */

	/* 1.*版 注释 */
	.w-batch{
		width:972px;
		float: left;
		padding:0 25px 130px 22px;
		background-color:#fff;
		min-height: 500px;
	}
	.w-batch button{
		cursor:pointer;
		font-size:14px;
	}
	.w-batch h3{
		color:#333;
		text-align: left;
		padding-bottom:15px;
		font-size: 16px;
		border-bottom: 1px solid #D8D8D8;
		margin-bottom: 22px;
		font-weight: 900;
	}
	.w-batch h4,.w-batch p{
		text-align: left;
		font-size:14px;
		color:#333;
	}
	.w-batch h4{
		margin-bottom:26px;
	}
	.w-batch p span{
		display: inline-block;
		width:19px;
		height:19px;
		color:#fff;
		border-radius:4px;
		background-color: #009E4D;
		text-align: center;
		font-size:14px;
		line-height:19px;
		margin:0 15px;
	}
	.w-batch p a{
		color:#E64346;
		cursor: pointer;
	}
	.w-batch p button{
		width:78px;
		height:28px;
		border:1px solid #D8D8D8;
		background-color: #F2F2F2;
		margin-left:48px;
	}
	.w-batch .step p:nth-of-type(2),.w-batch .step p:nth-of-type(4){
		margin:12px 0 24px;
	}
	.w-batch .step p:nth-of-type(6){
		margin:44px 0 16px;
		box-sizing: border-box;
		padding-left:15px;
		color:#999;
	}
	.w-batch .upload{
		margin-left: 16px;
		display: inline-block;
	}
	.w-batch .step p:nth-of-type(7){
		color:#E64346;
		margin-top:14px;
		box-sizing: border-box;
		padding-left: 15px;
	}
	.w-batch .step p:nth-of-type(7) i{
		color:#E64346;
		margin-right: 20px;
	}
	.w-batch .step p:last-of-type{
		color:#E64346;
		margin-top:14px;
		box-sizing: border-box;
		padding-left: 15px;
	}
	.w-batch .step p:last-of-type a{
		color:#E64346;
		margin-right: 20px;
		text-decoration:underline;
	}
</style>