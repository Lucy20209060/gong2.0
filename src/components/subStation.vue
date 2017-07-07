<template>
	<div class="substation">
		<tIndexHeader></tIndexHeader>
		<section class="substation-wrap">

			<p class="all-name">站点选择</p>

			<div
				class="substation-title" 
				v-for="(item, index) in currList" key="index"
				@click="goSitePage(item)"
			>
				<img v-bind:src="imgPre+item.ad_code" :onerror="imgErr">
			</div>

		</section>
			
		<div class="choiceBtn" v-if="pagination.pagetotal > 1">
			<i 
				class="iconfont" 
				@click="choicePage(index)" 
				v-for="(item, index) in pagination.pagetotal" key="index" 
				:class="{'icon-weibiaoti-5':index == pagination.page,'icon-xuanze1':index != pagination.page}"
			>
			</i>
		</div>	

		<IndexFooter></IndexFooter>

		<div class="index-fixed-nav">
	      <fixedNav></fixedNav>
	    </div>
	</div>
</template>

<script>
import tIndexHeader from '@/components/common/index_header'
import IndexFooter from '@/components/common/index_footer'
import fixedNav from '@/components/common/fixed_nav'
export default {
	name: "subStation",
	data() {
		return {
			imgPre:this.$store.state.img.imgPre,  				//图片前缀
			imgErr:'this.src="/static/images/imgtem.png"',

			siteIdList:{},										// 所有站点id，生成链接时 需要站点id
			siteList: [],   									// 所有站点列表
			currList:[],										// 当前页面列表

			pagination:{										// 分页信息
				page:0,											// 当前页计算从 0 开始
				pagetotal:0
			}
		}
	},
	components: {
	    tIndexHeader,IndexFooter,fixedNav
	},
	created() {
		this.getAllSite();
		this.getSite();
		
	},
	mounted() {
	},
	methods: {

		// 获取所有站点
	    getSite() {
	  		var _this = this;
	  		$.ajax({
	  			type: "get",
	  			url: this.$api.home.getAdList,
	            data:{
	                pid:4,
	                limit:10
	            },
	  			dataType: "json",
	  			success:function(res){
	                // 获取地域
		            _this.siteList = res.data;
		            _this.currList =  _this.siteList.slice(0,6);

		            // 总页数 (总数/每页个数 向上取整)
		            _this.pagination.pagetotal = Math.ceil(res.data.length/6);


	  			},
	            error:function(err){
	                // console.log(err)
	            }
	  		});
	    },

	    // 选择当前页数
	    choicePage(index) {
	    	this.pagination.page = index;							// 当前页数

	    	// 截取截取当前页数据     所有站点列表中的数据 ==> 当前页面列表
	    	const numberTem = 6*index;								// 截取起始点
	    	this.currList =  this.siteList.slice(numberTem,numberTem + 6);		// 截取当前页 数据
	    },

	    getAllSite(){
	    	const _this = this;
	    	$.ajax({
		        type: "get",
		        url: this.$store.state.apilink+"?s=api/site/getlist",
		        dataType: "json",
		        success:function(res){
		        	// 获取地域
		        	const siteData = res.data;

		        	// 保存站点及id
		        	for(let i in siteData){
		        		_this.siteIdList[siteData[i].region] = siteData[i].id;
		        	}
		        	// console.log(_this.siteIdList)
		        }
		    });
	    },

	    // 点击站点 去对应的分类页
	    goSitePage(item){
	    	const [name,id] = [item.ad_name,this.siteIdList[item.ad_name]];

	    	// 获取点击的站点 跳转至对应的站点分类页
	    	this.$router.push({
		    	path:'/classify',
		    	query:{
		    		id: id,
		    		type:'site',
		    		name:name
		    	}
			});
	    },
	}

}

</script>

<style scoped>
.substation {
	background: #eee;
}
.substation-wrap {
	width: 1200px;
	height: 726px;
	overflow: hidden;
	background: #eee;
	margin: 0 auto;
}
.all-name {
	width: 100%;
	font-size: 16px;
	font-weight: 900;
	padding: 30px 0 30px 0;
	clear: both;
}	
.substation-title {
	float: left;
	width: 580px;
	height: 200px;
	margin-bottom: 20px;
	cursor: pointer;
}
.substation-title img{
	display: block;
	width: 100%;
	height: 100%;
}
.substation-wrap .substation-title:nth-of-type(odd) {
	margin-right: 30px;	
}
.substation-title dt{
	float: left;
	width: 420px;
	height: 100%;
}
.substation-title dd {
	float: left;
	width: 160px;
	height: 100%;
	background: #fff;
}
.substation-title dd p{
	padding-top: 60px;
	text-align: center;
	font-size: 20px;
	color: #333;
}
.substation-title dd span {
	padding-top: 10px;
	display: inline-block;
	width: 160px;
	text-align: center;
	font-size: 14px;
	color: #999;
}
.choiceBtn {
	width: 100%;
	padding: 30px 0;
	margin: 0 auto;
	clear: both;
	text-align: center;

}
.choiceBtn i {
	display: inline-block;
	border-radius: 100%;
	width: 20px;
	height: 20px;
	margin-right: 8px;
	color: #009e4d;
	cursor: pointer;
}

</style>
