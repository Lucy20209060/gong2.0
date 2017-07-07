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
						<input v-model="item.goods_num" type="number" readonly="readonly" />
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
						<span>{{ellipsis(item.consignee,4)}}</span>
						<i v-if="item.tip.mobile != -1">{{item.mobile}}</i>
						<input v-if="item.tip.mobile == -1" v-model="item.mobile" type="text" :maxlength="11" />
					</p>
					<p class="add-add-wrap" v-if="item.tip.error != -1">

						<!-- 地址正确时 显示的 省 市 区 -->
						<span v-if="item.tip.add != -1">{{ellipsis(item.province,4)}}</span>
						<span v-if="item.tip.add != -1">{{ellipsis(item.city,4)}}</span>
						<span v-if="item.tip.add != -1">{{ellipsis(item.district,4)}}</span>
						<em v-if="item.tip.add != -1">{{ellipsis(item.address,25)}}</em>

						<!-- 地址错误时 显示省市区的选择框 -->
						<el-select 
							v-if="item.tip.add == -1" 
							v-model="item.province" 
							placeholder="选择省" 
							size="mini" 
							@change="selectProvince(item)"
						>
						    <el-option
								v-for="item1 in editAddress[item.id].add.province"
								:label="ellipsis(item1.name,3)" 
								key="index"
								:value="item1.id"
							>
						    </el-option>
						</el-select>

						<el-select 
							v-if="item.tip.add == -1" 
							v-model="item.city" 
							placeholder="选择市" 
							size="mini" 
							@change="selectCity(item)"
						>
						    <el-option
								v-for="(item2,index) in editAddress[item.id].add.city"
								key="index"
								:label="ellipsis(item2.name,3)" 
								:value="item2.id"
							>
						    </el-option>
						</el-select>

						<el-select 
							v-if="item.tip.add == -1" 
							v-model="item.district" 
							placeholder="选择区" 
							size="mini" 
							@change="selectDistrict(item)"
						>
						    <el-option
								v-for="(item3,index) in editAddress[item.id].add.district"
								key="index"
								:label="ellipsis(item3.name,3)" 
								:value="item3.id"
						    >
						    </el-option>
						</el-select>


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
  		<h4>没有获取到商品信息</h4>
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

	    	timeoutflag:null,
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
		// 选择 省
		selectProvince(item){

			// 清空 市
			this.editAddress[item.id].add.city = [];
			item.city='';

			// 清空 区
			this.editAddress[item.id].add.district = [];
			item.district = '';

			this.address.city = [];
			this.selectAddressInfo(item.province);
			this.editAddress[item.id].add.city = this.address.city;

			// console.log(`this.editAddress[${item.id}].add.city`,this.editAddress[item.id].add.city)

		},

		// 选择 市
		selectCity(item){
			// console.log(`this.editAddress[${item.id}].add.city`,this.editAddress[item.id].add.city)

			this.editAddress[item.id].add.district = [];
			item.district = '';

			this.selectAddressInfo(item.city);
			this.editAddress[item.id].add.district = this.address.district;
		},

		// 选择 区
		selectDistrict(item){
			// console.log(item)
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

			// console.log(objTem)

			$.ajax({
				url: this.$api.batchList.updateRegion,
				data:objTem,
				dataType:"json",
				type: 'get',
				success: function (res) {
					// console.log(res)
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

			// 检测是否存在异常商品
			for(let item of this.batchList){

				if(item.selected == 1 && item.tip.error != 0){
					this.$message.error('订单中不能出现异常商品，建议删除，或修改相关信息');
					return false;
				}

			}

			// 检测是否选择商品
			if(!sign){

				this.$message({
	         		message: '请选择商品',
	        		type: 'warning'
	        	});

				return false;
			}


			// 没有异常商品 跳转 批量下单的订单页

			this.$router.push('/mine/batchOrder');

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
							

							// 省正确时（！=0）获取对应的 市 
							// if(value.province >= 0){
							// 	_this.selectAddressInfo(value.province);
							// 	_this.editAddress[value.id].add.city = _this.address.city;
							// 	// 省 正确 市赋一个错误的值 重新选择
							// 	value.city = -1;
							// }


							if(reg2.test(value.province)){

								// 地址错误
								value.tip['add'] = '-1';
								value.province = '';
								value.city = '';
								value.district = '';

								_this.$set(_this.editAddress,value.id,objTem);
							}else{

								value.tip['add'] = '1';

							}

							if(!reg1.test(value.mobile)){
				      			// 电话错误
								value.tip['mobile'] = '-1';

								_this.$set(_this.editAddress,value.id,objTem);

				      		}else{
								value.tip['mobile'] = '1';
				      		}


						}

						// 检测是否全选
						_this.checkSelectAll();
						_this.detection();

				},
				error:function(res){
					// console.log(res)
				}
			})
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

						// 匹配地址是数字 即地址错误 标记地址正确与否 并在错误时清空值
						if(reg2.test(value.province)){

								// 地址错误
								value.tip['add'] = '-1';
								value.province = '';
								value.city = '';
								value.district = '';

								_this.$set(_this.editAddress,value.id,objTem);
							}else{

								value.tip['add'] = '1';

							}

							if(!reg1.test(value.mobile)){
				      			// 电话错误
								value.tip['mobile'] = '-1';

								_this.$set(_this.editAddress,value.id,objTem);
				      		}else{
								value.tip['mobile'] = '1';
				      		}


					}

					// 检测是否全选
					_this.checkSelectAll();
					// 检测是否开启按钮
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
		ellipsis(world,n){

			if(world.length > n){
				return world.slice(0,n) + "..."
			}else{
				return world;
			}

		},

		// 加 减 数量 1加  2减
		add_Or_Reduce(value,index){

			if(index == 1){

				if( Number(value.goods_num) >= Number(value.store_count) ){
					value.goods_num = value.store_count;
					
				}else{
					value.goods_num++;
				}

			}else{

				if(Number(value.goods_num) > 1){
					value.goods_num--;
				}else{
					value.goods_num = 1;
				}

			}

			let obj = {};
			obj[`cart_select[${value.id}]`] = value.selected.toString();
			obj[`goods_num[${value.id}]`] = value.goods_num.toString();

			this.batchListUpdate(obj);

			// 防止连续点击 频繁后台请求
			// const _this = this;
			
			// if(this.timeoutflag != null){
			// 	clearTimeout(this.timeoutflag);
			// 	this.timeoutflag = null;
			// }else{
			// 	this.timeoutflag = setTimeout(function(){
					
			// 	},500);
			// }
			// console.log(this.timeoutflag)
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

			// this.detection();


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
			// this.detection();

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
			this.removeHttp();
			// this.detection();
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
			// this.detection();
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
			// console.log(idsStr)
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
  			for(let item of this.batchList){

				if(item.selected == 1 && item.tip.error != 0){
					this.orderBtnStatue = false;
					return false;
				}

			}

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
	    margin: 6px 0;
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
		border: 1px solid rgb(191, 217, 206);
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
		border: 1px solid rgb(191, 217, 206);
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
		height: 94px;
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
	    border: 1px solid rgb(191, 217, 206);
	    background-color: #F2F2F2;
	}

	.w-batch-list{
		float:left;
		width:963px;
		background-color: #fff;
		padding:0 25px 0 22px;
	}
	.w-batch-list h3{
		text-align: left;
		color:#333;
		font-weight: 900;
		font-size: 16px;
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