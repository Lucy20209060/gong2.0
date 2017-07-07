<template>
  <div class="w-batch-list">
  	
  	<h3>批量下单列表</h3>
  	<p class="batchList-bar" v-if="batchList.length != 0">
	  	<i 
		  	class="iconfont" 
		  	v-bind:class="{'icon-duigou':allCheck}" 
		  	@click="selectAll"
	  	>
	  	</i>
	  	<span>全选</span>
	  	<span>商品信息</span>
	  	<span>商品ID</span>
	  	<span>数量</span>
	  	<span>单价</span>
	  	<span>小计</span>
	  	<span>收货地址</span>
  	</p>

  	<div class="batchList" v-if="batchList.length != 0">

		<dl class="batchList-list" v-for="(item,index) in batchList" key="index">
			<dt>
				<span v-text="`导入时间：${item.add_time}`"></span>
				<i class="iconfont icon-iconfont19" @click="removeGood(index,item.id)"></i>
			</dt>

			<dd>
				<div class="icon-wrap">
					<i 
						v-bind:class="{'icon-duigou':item.selected == 1 }" 
						class="iconfont"
						@click="selectSingle(item)"
					>
					</i>
				</div>
				
				<div class="image-wrap">
					<img :src="imgPre + item.image.image_url" :onerror="imgErr" />
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
					<p>
						<i @click="add_Or_Reduce(item,2)">-</i>
						<input v-model="item.goods_num" type="number" />
						<i @click="add_Or_Reduce(item,1)">+</i>
					</p>
				</div>

				<div class="price-wrap">
					<span>{{item.price}}</span>
				</div>

				<div class="tot-wrap">
					<span>{{(item.goods_num*item.price).toFixed(2)}}</span>
					<i>{{`运费：包邮`}}</i>
				</div>

				<div class="add-wrap">
					<p class="add-name-wrap">
						<span>{{item.consignee}}</span>
						<i v-if="item.tip.mobile != -1">{{item.mobile}}</i>
						<input v-if="item.tip.mobile == -1" v-model="item.mobile" type="text" :maxlength="11" />
					</p>
					<p class="add-add-wrap" v-if="item.tip.error != -1">
						<span v-if="item.tip.add != -1">{{item.province}}</span>
						<span v-if="item.tip.add != -1">{{item.city}}</span>
						<span v-if="item.tip.add != -1">{{item.district}}</span>
						<em v-if="item.tip.add != -1">{{ellipsis(item.address)}}</em>


						<el-select v-if="item.tip.add == -1" v-model="item.province" placeholder="请选择省份" size="mini">
						    <el-option
						      v-for="item in editAddress[item.id].add.province"
						      :label="item.name"
						      :value="item.id">
						    </el-option>
						</el-select>




						<!-- <select v-if="item.tip.add == -1" @click="tapProvince(item)" v-model="item.province">
							<option value=""></option>
							<option 
								v-for="(Pro,index1) in editAddress[item.id].add.province" 
								:value="Pro.id"
								v-text="Pro.name"
								key="index1"
							></option>
						</select> -->

						<select v-if="item.tip.add == -1" @click="tapCity($event,item)" v-model="item.city">
							<option value="">--市--</option>
							<option
								v-for="(City,index2) in editAddress[item.id].add.city" 
								:value="City.id"
								key="index2"
							>{{City.name}}</option>
						</select>

						<select v-if="item.tip.add == -1" @click="tapDistrict($event,item)" v-model="item.district">
							<option value="">--区--</option>
							<option
								v-for="(District,index3) in editAddress[item.id].add.district" 
								:value="District.id"
								v-text="District.name"
								key="index3"
							></option>
						</select>

						<textarea v-if="item.tip.add == -1" v-model="item.address"></textarea>
					</p>
					<p class="add-btn-wrap" v-if="item.tip.add == -1 || item.tip.mobile == -1">
						<button v-if="item.tip.error != -1" @click="updateRegion(item)">保存</button>
					</p>
				</div>

			</dd>

		</dl>

  	</div>

  	<div class="kongb" v-if="batchList.length == 0">
  		<img src="/static/images/kongb.png" alt=""  />
  		<h4>没有找到相关的商品信息</h4>
  	</div>

  	<div class="clearList" v-if="batchList.length != 0">
	  	<i 
	  		class="iconfont" 
		  	v-bind:class="{'icon-duigou':allCheck}" 
		  	@click="selectAll"
	  	>
	  	</i>
	  	<span>全选</span>
	  	<span class="pointer" v-on:click="removeGoods">批量删除</span>

	  	<span class="pointer" @click="clearAbnormal">清除异常商品</span>
		
		<button id="orders" v-bind:class="{activeBtn:orderBtnStatue}" @click="affirmOrder(orderBtnStatue)">确认下单</button>
		<p>
			<span>{{`共${total_price.num}件商品`}}</span>
			<span>
				<em>商品总额（不含运费）：</em>
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
	    	batchList:[],				// 商品列表
	    	batchSelected:[],			// 选中列表

	    	total_price:{				// 总金额 总商品数
	    		total_fee:0,
	    		num:0
	    	},
	    	allCheck:false,				// 是否全选

	    	orderBtnStatue:false,		// 是否开启确认下单 按钮

	    	editAddress:{},				// 保存 修改编辑时 各个商品对应的地址 和 电话号码

	    	address:{					// 暂时存放 所有 省 市 区 信息
	    		province:[],
	    		city:[],
				district:[],
	    	},

	    	options: [{
          value: '选项1',
          label: '黄金糕'
        }, {
          value: '选项2',
          label: '双皮奶'
        }, {
          value: '选项3',
          label: '蚵仔煎'
        }, {
          value: '选项4',
          label: '龙须面'
        }, {
          value: '选项5',
          label: '北京烤鸭'
        }, {
          value: '选项2',
          label: '双皮奶'
        }, {
          value: '选项3',
          label: '蚵仔煎'
        }, {
          value: '选项4',
          label: '龙须面'
        }, {
          value: '选项5',
          label: '北京烤鸭'
        }, {
          value: '选项2',
          label: '双皮奶'
        }, {
          value: '选项3',
          label: '蚵仔煎'
        }, {
          value: '选项4',
          label: '龙须面'
        }, {
          value: '选项5',
          label: '北京烤鸭'
        }, {
          value: '选项2',
          label: '双皮奶'
        }, {
          value: '选项3',
          label: '蚵仔煎'
        }, {
          value: '选项4',
          label: '龙须面'
        }, {
          value: '选项5',
          label: '北京烤鸭'
        }, {
          value: '选项2',
          label: '双皮奶'
        }, {
          value: '选项3',
          label: '蚵仔煎'
        }, {
          value: '选项4',
          label: '龙须面'
        }, {
          value: '选项5',
          label: '北京烤鸭'
        }],
        value: ''


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
	mounted(){
		this.selectAddressInfo();
		this.batchHttp();
		$('body,html').animate({scrollTop:0},10);
	},
	methods:{
		handleChange(){
			console.log(111111111111)
		},

		// 点击 修改省 并 获取 该省下面的 市
		tapProvince(item){
			// 点击省 先清空 市 区
			this.editAddress[item.id].add.city = [];
			this.editAddress[item.id].add.district = [];

			// 获取该省下的 市
			// this.selectAddressInfo(e.target.value);
			// 将 市 信息 赋值给对应的地方
			this.editAddress[item.id].add.city = this.address.city;

			console.log(item)

			console.log(this.editAddress)
			return false;

		},

		// 点击 修改市
		tapCity(e,item){
			console.log(this.editAddress[item.id].add.city)

			// 点击市 先清空 区
			this.editAddress[item.id].add.district = [];

			if(item.province != 0){

				// 获取该省下的 市
			this.selectAddressInfo(item.province);
			// 将 市 信息 赋值给对应的地方
			this.editAddress[item.id].add.city = this.address.city;
				
			};

			// 获取该市下的 区
			this.selectAddressInfo(e.target.value);
			// 将 区 信息 赋值给对应的地方
			this.editAddress[item.id].add.district = this.address.district;
		},

		// 点击 修改区
		tapDistrict(e,item){
			console.log(e.target.value,item)
		},

		// 更改地址 及 号码 isRegion 1修改所有  2只修改电话号码
		updateRegion(value){
			let _this = this;

			let objTem = {};
			if( value.tip.mobile == -1 && value.tip.add == 1 ){		// 只有 电话号码错误

				objTem['id'] = value.id;
				objTem['mobile'] = value.mobile;
				objTem['isRegion'] = 2;

			}else{

				objTem['id'] = value.id;
				objTem['mobile'] = value.mobile;
				objTem['province'] = value.province;
				objTem['city'] = value.city;
				objTem['district'] = value.district;
				objTem['address'] = value.address;
				objTem['isRegion'] = 1;

			}

			console.log(objTem)

			$.ajax({
				url: this.$api.batchList.updateRegion,
				data:objTem,
				dataType:"json",
				type: 'get',
				success: function (res) {
					console.log(res)
					if(res.data && res.data == 1){
						_this.batchHttp();
					}else{
						_this.$message({
				          message: res.error_msg,
				          type: 'warning'
				        });
					}
				}
			});
		},

		// 确认下单按钮
		affirmOrder(sign){

			if(!sign){

				this.$message({
	         		message: '请选择商品',
	        		type: 'warning'
	        	});

				return false;
			}

			for(let item of this.batchList){

				if(item.selected == 1 && item.tip.error != 0){
					this.$message.error('订单中不能出现异常商品，建议删除，或修改相关信息');
					return false;
				}

			}

			// 没有异常商品 跳转 批量下单的订单页

			this.$router.push('/mine/batchOrder');

		},
		// 更新数据
		batchListUpdate(obj){
			// console.log('更新参数',obj)
			let _this = this;
			$.ajax({
				url: this.$api.batchList.update,
				data:obj,
				dataType:"json",
				type: 'get',
				success: function (res) {
					// console.log(res)
					_this.batchList = res.data.cartList;
					_this.total_price.total_fee = res.data.total_price.total_fee;
					_this.total_price.num = res.data.total_price.num;

					const reg1 = /^1(3|4|5|7|8)\d{9}$/; //验证手机正则(输入前7位至11位)
					const reg2 = /^[0-9]\d*$/i;

					for(let value of _this.batchList){

						let objTem = {
							mobile:value.mobile,
							add:{
								province:_this.address.province,
					    		city:[],
					    		district:[]
							}
						}

						_this.editAddress[`${value.id}`] = objTem;

						// 省正确时（！=0）获取对应的 市 
						if(value.province >= 0){
							_this.selectAddressInfo(value.province);
							_this.editAddress[value.id].add.city = _this.address.city;
							// 省 正确 市赋一个错误的值 重新选择
							value.city = -1;
						}


						if(reg2.test(value.province)){

							// 地址错误
							value.tip['add'] = '-1';

						}else{

							value.tip['add'] = '1';

						}

						if(!reg1.test(value.mobile)){
			      			// 电话错误
							value.tip['mobile'] = '-1';
			      		}else{
							value.tip['mobile'] = '1';
			      		}


					}

					// console.log(_this.batchList)
					// console.log(_this.editAddress)

					// 检测是否全选
					_this.checkSelectAll();
					_this.detection();
				}
			});
		},

		// 获取 省 市 区
		selectAddressInfo(id = 0){
			let _this = this;
			$.ajax({
				url: this.$api.batchList.getregion,
				data:{
					parent_id:id
				},
				async: false,
				dataType:"json",
				type: 'get',
				success: function (res) {
					let Data = res.data;
					switch(Data[0].level){
						case '1':
							_this.address.province = Data;
						break;

						case '2':
						  _this.address.city = Data;
						break;

						case '3':
						  _this.address.district = Data;
						break;
					}
				}
			});
		},

		// 详细地址省略过多字符
		ellipsis(world){

			if(world.length >= 25){
				return world.slice(0,25) + "..."
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
					confirm:0
				},
				dataType: "json",
				success:function(res){

						_this.batchList = res.data.cartList;
						_this.total_price.total_fee = res.data.total_price.total_fee;
						_this.total_price.num = res.data.total_price.num;

						const reg1 = /^1(3|4|5|7|8)\d{9}$/; //验证手机正则(输入前7位至11位)
						const reg2 = /^[0-9]\d*$/i;

						for(let value of _this.batchList){

							let objTem = {
								mobile:value.mobile,
								add:{
									province:_this.address.province,
						    		city:[],
						    		district:[]
								}
							}

							_this.editAddress[`${value.id}`] = objTem;

							// 省正确时（！=0）获取对应的 市 
							if(value.province >= 0){
								_this.selectAddressInfo(value.province);
								_this.editAddress[value.id].add.city = _this.address.city;
								// 省 正确 市赋一个错误的值 重新选择
								value.city = -1;
							}


							if(reg2.test(value.province)){

								// 地址错误
								value.tip['add'] = '-1';

							}else{

								value.tip['add'] = '1';

							}

							if(!reg1.test(value.mobile)){
				      			// 电话错误
								value.tip['mobile'] = '-1';
				      		}else{
								value.tip['mobile'] = '1';
				      		}


						}

						console.log(_this.batchList)
						console.log(_this.editAddress)

						// 检测是否全选
						_this.checkSelectAll();
						_this.detection();
				},
				error:function(res){
					// console.log(res)
				}
			})
		},

		// 加 减 数量 1加  2减
		add_Or_Reduce(value,index){

			if(index == 1){

				if( value.goods_num < value.store_count ){
					value.goods_num++;
				}else{
					value.goods_num = value.store_count;
				}

			}else{

				if(value.goods_num > 1){
					value.goods_num--;
				}else{
					value.goods_num = 1;
				}

			}


			let obj = {};
			obj[`cart_select[${value.id}]`] = value.selected.toString();
			obj[`goods_num[${value.id}]`] = value.goods_num.toString();

			this.batchListUpdate(obj);
			
		},

		// 全选
		selectAll(){

			if(this.allCheck){
				// 全选状态 去下单按钮状态
				this.allCheck = false;
				this.orderBtnStatue = false;

				for(let item of this.batchList){
					item.selected = 0;
				}

			}else{
				// 全不选状态 去下单按钮状态
				this.allCheck = true;
				this.orderBtnStatue = true;

				for(let item of this.batchList){
					item.selected = 1;
				}
			}

			this.detection();


			let objTem = {};
			for(let item of this.batchList){
				objTem[`cart_select[${item.id}]`] = item.selected.toString();
				objTem[`goods_num[${item.id}]`] = item.goods_num.toString();
			}
			this.batchListUpdate(objTem);

		},

		// 单选
		selectSingle(value){
			if(value.selected == 0){
				value.selected = 1;
			}else{
				value.selected = 0;
			}

			this.checkSelectAll();
			this.detection();

			let obj = {};
			obj[`cart_select[${value.id}]`] = value.selected.toString();
			obj[`goods_num[${value.id}]`] = value.goods_num.toString();

			this.batchListUpdate(obj);
		},

		// 清除异常商品
		clearAbnormal(){

			this.batchRemove = [];
			for(let item of this.batchList){
				if(item.tip.error < 0){
					this.batchRemove.push(item.id);
				}
			}
			console.log(this.batchRemove)
			this.removeHttp();
			this.detection();
		},

		// 删除 多个商品
		removeGoods(index,value){
			this.batchRemove = [];
			for(let item of this.batchList){
				if(item.selected == 1){
					this.batchRemove.push(item.id);
				}
			}
			this.removeHttp();
			this.detection();
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
			console.log(idsStr)
			// return false;
			const _this = this;
			$.ajax({
				type:"get",
				url:this.$api.batchList.remove,
				data:{
					ids:idsStr
				},
				dataType: "json",
				success:function(res){

					console.log(res)

					if(res.error == 0){

						// if(index >=0){
						// 	_this.batchList.splice(index,1);
						// }else{
							_this.batchHttp();
						// }
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

		// 检查是否全选
		checkSelectAll(){
			for(let item of this.batchList){
				if(item.selected == 1){
					this.allCheck = true;
				}else{
					this.allCheck = false;
					return false;
				}
			}
		},

		// 计算价格 和 数量
		amount(){
			this.total_price.total_fee = 0;
	  		this.total_price.num = 0;

  			for(let item of this.batchList){
  				if(item.selected == 1){
	  				this.total_price.total_fee += Number(item.goods_num) * Number(item.goods_price);
	    			this.total_price.num += Number(item.goods_num);	
  				}
  				
    		}
    		this.total_price.total_fee = (this.total_price.total_fee).toFixed(2);
		},

		// 检测是否有 开启 确认下单 按钮
	  	detection(){
	  		// this.amount();
  			for(let item of this.batchList){
  				if(item.selected == 1){
  					this.orderBtnStatue = true;
  					return false;
  				}else{
  					this.orderBtnStatue = false;
  					
  				}
  			}

	  	},

	}
}
</script>

<style scoped>
	.batchList-list .el-select{
	    float: left;
	    width: 33.33%;
	}
	
	.batchList-list .el-select .el-icon-caret-top{
		display: none;
	}
	.add-wrap p select{
		float: left;
		border: 1px solid #ebebeb;
		margin: 10px 0 5px;
    	width: 33.33%;
    	border-right: 0;
	}
	.add-wrap p select:nth-child(3){
    	border-right: 1px solid #ebebeb;
	}
	.add-name-wrap,.add-add-wrap{
		overflow: hidden;
	}
	.add-add-wrap{
		height: 82px;
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
	}
	.add-add-wrap textarea{
		padding: 4px;
		resize:none;
		border: 1px solid #ebebeb;
		width: 100%;
		-moz-box-sizing: border-box;
	    -webkit-box-sizing: border-box;
	    -o-box-sizing: border-box;
	    -ms-box-sizing: border-box;
	    box-sizing: border-box;
	}
	.add-name-wrap{
		height: 22px;
	}
	.add-name-wrap input{
		float: left;
		width: 50%;
		height: 12px;
		padding: 4px 6px;
		border: 1px solid #ebebeb;
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
		height: 150px;
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
		height: 100%;
		padding: 60px 13px 76px;
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
		padding: 16px 4px;
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
		bottom: 36px;
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
		border: 1px solid #ebebeb;
		color: #b1b1b1;
	}
	.num-wrap p i{
		float: left;
		height: 100%;
		line-height: 22px;
		width: 30%;
		text-align: center;
		cursor: pointer;
		-moz-user-select: -moz-none;
	   -khtml-user-select: none;
	   -webkit-user-select: none;
	}
	.num-wrap p input{
		float: left;
		height: 100%;
		line-height: 22px;
		width: 40%;
		text-align: center;
		border-right: 1px solid #ebebeb;
		border-left: 1px solid #ebebeb;
		-moz-box-sizing: border-box;
	    -webkit-box-sizing: border-box;
	    -o-box-sizing: border-box;
	    -ms-box-sizing: border-box;
	    box-sizing: border-box;
	    color: #b1b1b1;
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
		width: 216px;
		height: 100%;
		-moz-box-sizing: border-box;
	    -webkit-box-sizing: border-box;
	    -o-box-sizing: border-box;
	    -ms-box-sizing: border-box;
	    box-sizing: border-box;
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
	.add-btn-wrap{
		text-align: center;
	}
	.add-wrap p button{
		display: inline-block;
		cursor: pointer;
	    width: 58px;
	    height: 26px;
	    color: #333;
	    border: 1px solid #D8D8D8;
	    background-color: #F2F2F2;
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
		margin:0 80px 0 110px
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
		margin-left: 10px;
		display: inline-block;
		line-height: 58px;
	}
	.clearList p span em{
		float: left;
	}
	.clearList p span b{
		float: left;
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