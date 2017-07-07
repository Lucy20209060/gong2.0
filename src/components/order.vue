<template>
  <div class="order">

    <Headertop></Headertop>

    <section class="order-title-wrap">
	    <h2 class="order-title">
	    	<a href="/"><img class="logo" src="/static/images/image.png" alt="安厨供应链" /></a>
	    </h2>
    </section>

    <section class="order-wrap">
      <div class="order-center-wrap">
        <indentStatus>
            <span slot="indentName">确认订单</span>
        </indentStatus>
        <div class="indentinfo">
          <h4>选择收货地址<span @click="addAddress">使用新地址</span></h4>
          <ul class="addresslist">
            <a href="javascript:;" 
              @click="getadd($event,item.address_id,1,index)" 
              v-for="(item,index) in addlist" 
              key="index" 
              :class="{selectAddress: selectadd == index}"
            >
              <li class="namedetail" v-text="item.consignee">姓名</li>
              <li class="phonedetail" v-text="item.mobile">电话</li>
              <li class="addressdetail">{{item.province_name}}&nbsp;{{item.city_name}}&nbsp;{{item.district_name}}&nbsp;{{item.address}} </li>
              <li class="defaultaddress" v-if="item.is_default == 1"><span>默认地址</span></li>
              <li class="setaddress" 
                v-if="item.is_default != 1"
                @click="item.is_default == 1?'':toDefault(item.address_id,index)"><span>设为默认地址</span></li>
              <li class="editaddress" @click.stop="getadd($event,item.address_id,2,index)">编辑</li>
              <li class="deladdress" @click="addressDelete(item.address_id,index)">删除</li>
              
            </a>
          </ul>          
        </div>

    		<dl class="goods-list-wrap">
    			<dt style="margin-top: 48px;">确认商品信息</dt>
    			<dd class="goods-info-wrap" >
    				<dl>
    					<dt class="info-title-wrap">
    						<span></span>
    						<span>商品信息</span>
    						<span>商品ID</span>
    						<span>单价</span>
    						<span>数量</span>
    						<span>小结</span>
    						<span>操作</span>
    					</dt>
    					<dd class="info-info-wrap" 
    				    v-for="(goods,index) in goodsList" key="index" 
    						v-bind:class="{siteMate: (goods.bar_code==false || goods.goodsStatus == 1)}"
	    					>

    						<div class="info-info-img">
    							<img v-lazy="imgPre + goods.image.image_url" />
    						</div>
    						<div class="info-info-message">
    							<p v-text="goods.goods_name">商品名</p>
    							<p class="order-meth-info" v-if="!goods.bar_code">该商品不在此配送范围内</p>
                  <p class="order-meth-info" v-if="goods.goodsStatus == 1" v-text = "goods.backInfo"></p>
                  <p class="order-spec_key_name" v-if="goods.bar_code && goods.goodsStatus == ''" v-text="goods.spec_key_name">规格</p>
    						</div>

    						<div class="info-info-id" v-text="goods.goods_id">商品ID</div>
    						<div class="info-info-price">
    							<p>{{goods.price}}</p>
    						</div>
    						<div class="info-info-num">x{{goods.goods_num}}</div>
    						<div class="info-info-operate">{{goods.goods_fee}}</div>


    						<div 
	    						class="info-info-operate pointer" 
	    						v-if="!goods.bar_code && goods.goodsStatus == '' "
	    						@click="delGoods(index,goods.id,goods.goods_fee)"
	    						>
    								<el-tooltip class="item" effect="dark" content="非常抱歉" placement="top-start">
    							      <el-button style="border: none;color: #009e4d;padding: 0;">删除</el-button>
    							    </el-tooltip>
        				</div>

                <div 
                  class="info-info-operate pointer" 
                  v-if="goods.goodsStatus == 1"
                  @click="delGoods(index,goods.id,goods.goods_fee)"
                  >
                      <el-tooltip class="item" effect="dark" content="非常抱歉" placement="top-start">
                        <el-button style="border: none;color: #009e4d;padding: 0;">删除</el-button>
                      </el-tooltip>
                </div>

    					</dd>
    				</dl>
    			</dd>
          
          <dt style="margin-top: 30px;">结算信息</dt>
    			<dd class="info-center-dd">
    				<p>
    					<i>商品合计：</i>
    					<span>￥{{totalPrice.total_fee}}</span>
    				</p>
    				<p>
    					<i>运费：</i>
    					<span>包邮</span>
    				</p>
    			</dd>
          
    			<dd class="info-bottom-dd">
    				<p>
    					<i>应付金额：</i>
    					<span style="color:#e64346;font-size:20px;">￥{{totalPrice.total_fee}}</span>
    				</p>
    				<p class="info-bottom-dd-p2">
    					<i>
    						{{selectaddress.province_name}}
    						{{selectaddress.city_name}}
    						{{selectaddress.district_name}}
    						{{selectaddress.address}}
    					</i>
    					<i>{{selectaddress.consignee}}</i>
    					<i>{{selectaddress.mobile}}</i>
    				</p>
    			</dd>
    			<dd class="info-bottom-affirm">
    				<button 
    					@click="confirmOrder(bAffirmSign)"
						  v-bind:class="{confirmOrderbg:bAffirmSign==false}"
              style="font-size: 20px;" 
    					>去付款
    				</button>
    			</dd>
          <p class="paytotast"><i class="iconfont icon-tishi1"></i>请您在提交订单成功后24小时内完成支付，否则订单将被自动取消</p>
        </dl>
    	</div>
    </section>

    <IndexFooter></IndexFooter>


	<!-- 添加地址 弹窗 -->
    <el-dialog title="收货地址" v-model="dialogFormVisible">
		  <p class="order-dialog order-dialog-add">
		  	<label><i>*</i>所在地区：</label>
		  	<select v-model="addform.selProvince" @click="selectCity($event)">
		  		<option v-for="(item,index1) in addform.province" key="index1" :value="item.id">{{item.name}}</option>
		  	</select>
		  	<select v-model="addform.selCity" @click="selectArea($event)">
		  		<option v-for="(item,index2) in addform.city" key="index2" :value="item.id">{{item.name}}</option>
		  	</select>
		  	<select v-model="addform.selArea">
		  		<option v-for="(item,index3) in addform.district" key="index3" :value="item.id">{{item.name}}</option>
		  	</select>
			
		  </p>
		  <p class="order-dialog order-dialog-textarea">
		  	<label><i>*</i>详细地址：</label>
		  	<textarea v-model="addform.address" placeholder="建议您填写详细收货地址，如街道名称，街道门牌号，楼层和房间号等信息"></textarea>
		  </p>
		  <p class="order-dialog order-dialog-name">
		  	<label><i>*</i>收货人姓名：</label>
		  	<input type="text" v-model="addform.consigneename" placeholder="请填写真实姓名，不能为昵称、X小姐、X先生等" />
		  </p>
		  <p class="order-dialog order-dialog-phone">
		  	<label><i>*</i>联系方式：</label>
		  	<input type="text" v-model="addform.phone" maxlength="11" placeholder="收货人的手机号码" />
		  </p>
		  <p class="order-dialog order-dialog-btn">
		  	<button class="button1" @click="addressCreate">确定</button>
		  	<button class="button2" @click="dialogFormVisible = false">取消</button>
		  </p>
	</el-dialog>

	<!-- 编辑地址 弹窗 -->
	<el-dialog title="编辑地址" v-model="dialogFormVisible2">
		  <p class="order-dialog order-dialog-add">
		  	<label><i>*</i>所在地区：</label>

			<!-- 省 -->
		  	<select @click="selectCity($event)">
		  		<option v-for="(item,index1) in addform.province" key="index1" :value="item.id" :selected="item.id == editform.selProvince ? true :false ">{{item.name}}</option>
		  	</select>

			<!-- 市 -->
		  	<select @click="selectArea($event)">
		  		<option value="-1" selected="editform.selCity == -1 ? true :false ">-请选择-</option>
		  		<option v-for="(item,index2) in addform.city" key="index2" :value="item.id" :selected="item.id == editform.selCity ? true :false ">{{item.name}}</option>
		  	</select>

			<!-- 区 -->
		  	<select @click="selectArea2($event)">
		  		<option value="-1" selected="editform.selArea == -1 ? true :false ">-请选择-</option>
		  		<option v-for="(item,index3) in addform.district" key="index3" :value="item.id" :selected="item.id == editform.selArea ? true :false ">{{item.name}}</option>
		  	</select>
		  </p>

		  <p class="order-dialog order-dialog-textarea">
		  	<label><i>*</i>详细地址：</label>
		  	<textarea v-model="editform.address" placeholder="建议您填写详细收货地址，如街道名称，街道门牌号，楼层和房间号等信息"></textarea>
		  </p>
		  <p class="order-dialog order-dialog-name">
		  	<label><i>*</i>收货人姓名：</label>
		  	<input type="text" v-model="editform.consigneename" placeholder="请填写真实姓名，不能为昵称、X小姐、X先生等" />
		  </p>
		  <p class="order-dialog order-dialog-phone">
		  	<label><i>*</i>联系方式：</label>
		  	<input type="text" maxlength="11" v-model="editform.phone" placeholder="收货人的手机号码" />
		  </p>
		  <p class="order-dialog order-dialog-btn">
		  	<button class="button1" @click="addressEdit">确定</button>
		  	<button class="button2" @click="dialogFormVisible2 = false">取消</button>
		  </p>
	</el-dialog>
    
  </div>
</template>

<script>
import Headertop from '@/components/common/header_top'
import IndexFooter from '@/components/common/index_footer'
import indentStatus from '@/components/common/indentStatus'

export default {
  name: 'order',
  data () {
    return {
    	imgPre:this.$store.state.img.imgPre,
    	classSign:'0',					// 选中index
    	addlist:[],						// 选择收货地址列表
    	formLabelWidth: '120px',
    	dialogFormVisible: false,		// 添加地址框 显示-隐藏 状态
    	dialogFormVisible2:false,		// 编辑地址框 显示-隐藏 状态
    	selectaddress:[],				// 订单选中的地址详细信息

    	selectaddressId:[],				// 订单选中的地址详细信息id
    	addressId:'',					// 订单选中的地址id
    	shippingArea:[],				// 配送地址id数组

    	allGoodsList:[],				// 订单中的总的商品信息 (存储，不可修改)
    	goodsList:[],					// 订单中的商品信息 	(使用的 可以修改的)
      totalPrice:'',					// 订单总价
      siteId:[],						// 仓库数组
      addform:{
        	province:[],				// 添加地址 所有省
        	city:[],					// 添加地址 省对应的所有市
        	district:[],				// 添加地址 市对应的所有区
        	selProvince:'',				// 添加地址 省id
        	selCity:'',					// 添加地址 市id
        	selArea:'',					// 添加地址 区id
        	address:'',					// 添加地址 详细地址 
        	consigneename:'',			// 添加地址 收货人 
        	phone:''					// 添加地址 收货人电话号码
      },
      editform:{
        	province:[],				// 编辑地址 所有省
        	city:[],					// 编辑地址 省对应的所有市
        	district:[],				// 编辑地址 市对应的所有区
        	selProvince:'',
        	selCity:'',
        	selArea:'',
        	address:'',
        	consigneename:'',
        	phone:'',
        	addressId:''				// 编辑地址 该地址id
        },
        updateInfo:{
        	cart_select:{},
        	goods_num:{}
        },
        bAffirmSign:false, 		// 是否开启确认下单
        selectadd: false,     //地址选中效果  
        errorMsg: '',          //错误信息提示
        indentError: true     //错误信息状态
    }
  },
  watch:{

  },
  beforeCreate(){

  		// 先检测是否注册
        let proof  = this.$cookie.getCookie('b61a9d162ac1dfaa22d0f05bdc7f6299');

        if(proof == 1 ){

        }else if(proof == -1){            // 审核中
        	this.$message("认证状态中，暂无权限访问该页面");
        	this.$router.push('/');
        }else if(proof == -2 || proof == -3 ){     // 审核没通过 未查询到数据
        	this.$message("认证失败，请重新进行审核");
            this.$router.push('/proof');
        }else if(proof == -4 ){     // 未提交认证
        	this.$message("未提交认证，请先认证");
            this.$router.push('/proof');
        }else{
        	this.$router.push('/login');
        }

        // 再检测是否是从shopCart 过来
        if(this.$cookie.getCookie('path1Sign')){
            return;
        }else{
            this.$router.push('/shopCart');
        }
	},
  created(){
  	this.getaddlist();
  	this.getOrderList();
  },
  methods:{
  	// 检测是否有地址不匹配  否则开启 去付款 按钮
  	detection(){
  			for(let i in this.goodsList){
  				if(this.goodsList[i].bar_code == false){
  					this.bAffirmSign = false;
  					return false;
  				}else{
  					this.bAffirmSign = true;
  				}
  			}
  	},

  	// 选择地址 推入id数组
  	selectAddId(){
  		this.selectaddressId = [];
  		this.selectaddressId.push(this.selectaddress.province);
  		this.selectaddressId.push(this.selectaddress.city);
  		this.selectaddressId.push(this.selectaddress.district);

  		// 地区匹配
  		for(let i in this.goodsList){

	        this.updateInfo.cart_select[this.goodsList[i].id] = 1;
	        this.updateInfo.goods_num[this.goodsList[i].id] = this.goodsList[i].goods_num;

  			// 地址匹配  true-地址匹配  false-地址不匹配
  			if(this.goodsList[i].shipping_area_ids == ''){

  				this.goodsList[i].bar_code = false;

  			}else if(this.goodsList[i].shipping_area_ids == 'all'){

  				this.goodsList[i].bar_code = true;

  			}else{

  				// 合并数组 去重
  				let arr = this.selectaddressId.concat(this.goodsList[i].shipping_area_ids);
  				arr = [...new Set(arr)];

  				// 数组没有相同元素 即不匹配
  				arr.length == this.selectaddressId.length + this.goodsList[i].shipping_area_ids.length
  				?this.goodsList[i].bar_code = false
  				:this.goodsList[i].bar_code = true
  			}
  		}
  		// 检测 是否开启 "去付款" 按钮
      this.detection();
  	},

  	// 删除地址不匹配商品
  	delGoods(index,id,fee){
      // console.log(this.goodsList)
  		// 只是HTML页面标签的删除 
  		this.goodsList.splice(index,1);

      // 选中数组 发生变化 update 请求参数
  		// 标记 0 删除 标记 1 保留
      // this.updateInfo.cart_select[id] = 0; 下次试试
  		for(let i in this.updateInfo.cart_select){
  			if(i == id){
  				this.updateInfo.cart_select[i] = 0;
  			}
  		}
      // console.log(id)
      // console.log(this.updateInfo)

  		
      // 前台价格相应变化
  		this.totalPrice.total_fee = (this.totalPrice.total_fee - fee).toFixed(2);

      // 更新后台数据
      const _this = this;
  		$.ajax({
  			type:"post",
  			url:_this.$store.state.apilink+"?s=api/cart/update",
  			dataType:"json",
  			data:_this.updateInfo,
  			success:function(data){
  				// console.log(_this.updateInfo);
  				// console.log(data)

  				// 检测 是否开启 "去付款" 按钮
          _this.detection();

  			},
  			error:function(res){
  				// console.log('error')
  				// console.log(res)
  			}
  		});	

  	},

  	// 确认下单 按钮
  	confirmOrder(sign){
  		if(!sign){
  			return false;
  		}

  		const _this = this;

  		$.ajax({
  			type:"post",
  			url:_this.$store.state.apilink+"?s=api/cart/update",
  			dataType:"json",
  			data:_this.updateInfo,
  			success:function(data){

  				$.ajax({
			    	type: "post",
			    	url: _this.$store.state.apilink+"?s=api/order/create",
			    	data:{
			    		address_id:_this.addressId
			    	},
			    	dataType: "json",
			    	beforeSend: function (res) {
			    		if(_this.addressId == ''){
				  			_this.$message('请选择地址!');
				  			return false;
				  		}
		            },
			    	success:function(res){
			    		if(res.status == false ){   
                _this.errorMsg = res.error_msg;
                // _this.indentError = res.status;
                // console.log(res.data)

                //判断error内容
                for(let i in _this.goodsList) {
                  for(let j in res.data) {
                    if(_this.goodsList[i].sku == res.data[j].sku) {
                      _this.goodsList[i].backInfo = res.data[j].msg;
                      _this.goodsList[i].goodsStatus = 1;
                    }
                  }
                }

			    			// _this.$message({
					     //      	message: res.error_msg,
					     //      	type: 'warning'
					     //    });

                


			    		}else{
			    			// order 页面标志 是否进入支付页标志
			    			_this.$cookie.setCookie('path2Sign','true','s10');
			    			_this.$router.push("/payment?trade_sn="+res.data.trade_sn);
			    		}
			    		
			      	}
			    })

  			},
  			error:function(res){
  				// console.log('error')
  			}
  		});	
  	},
  	// 获取订单 列表
  	getOrderList(){
  		let _this = this;
  		$.ajax({
	    	type: "post",
	    	url: this.$store.state.apilink+"?s=api/cart/getordercart",
	    	dataType: "json",
	    	async:false,
	    	success:function(res){
          if(res.error == 1) {
            return false;
          }          
	    		// 地域id 数组去重
	    		for(let i in res.data.cart_list){
            // res.data.cart_list['backInfo'] = '';
	    			_this.siteId.push(res.data.cart_list[i].site_id);
	    			_this.siteId = [...new Set(_this.siteId)];
	    		}


        // 商品信息 存储 不可修改
        // _this.allGoodsList = res.data.cart_list;
        // 商品信息 可修改 可操作
          _this.goodsList = res.data.cart_list;
          for(let j in _this.goodsList) {
            let value = _this.goodsList[j];
            _this.$set(value, 'backInfo', '');
            _this.$set(value, 'goodsStatus', '')
          }

          console.log(_this.goodsList)
	    		// 订单总价
	    		_this.totalPrice = res.data.total_price;

	    		// 检测 是否开启 "去付款" 按钮
  				_this.detection();


	    	},
        error:function(res){
          //console.log(res)
        }


				
		})
  	},
    //修改默认的地址
    toDefault(id,index){
        let _this = this;
        $.ajax({
          url: _this.$store.state.apilink+"?s=api/address/set_default",
          data:{id:id},
          dataType: "json",
          type: 'post',
          success: function (res) {
            if (res.error == 0) {
              for (let i = 0; i < _this.addlist.length; i++) {
                _this.addlist[i].is_default = 0;
              }
              _this.addlist[index].is_default = 1;
            }
          },
          error:function (res) {
            _this.$message('未知错误！');
          }
        });
      },
  	// 地址编辑 确定按钮
  	addressEdit(){
  		let _this = this;
  		let Data = {
  			id:_this.editform.addressId,
    		province:_this.editform.selProvince, 
    		city:_this.editform.selCity,
    		district:_this.editform.selArea, 
    		address:_this.editform.address, 
    		consignee:_this.editform.consigneename,
    		mobile:_this.editform.phone
  		};
  		$.ajax({
	    	type: "post",
	    	url: this.$store.state.apilink+"?s=api/address/update",
	    	data:Data,
	    	dataType: "json",
	    	beforeSend: function (res) {
	    		if(_this.editform.selCity == -1 ||
	    			_this.editform.selArea==-1||
	    			_this.editform.address==''){

		  			_this.$message('请填写地址信息!');
		  			return false;
		  		}
		  		if(_this.editform.consigneename==''){

		  			_this.$message('请填写收货人!');
		  			return false;
		  		}
		  		
            },
	    	success:function(res){
	    		let errMess = res.error_msg;
	    		if(errMess){
			        _this.$message({
			          message: errMess,
			          type: 'warning'
			        });
	    		}else{
	    			_this.dialogFormVisible2 = false;
			        _this.$message({
			          message: '地址编辑成功！',
			          type: 'success'
			        });
			        _this.getaddlist();
	    		}
	      	}
	    })
  	},

  	// 增加地址
  	addressCreate(){
  		const _this = this;
  		$.ajax({
	    	type: "post",
	    	url: this.$store.state.apilink+"?s=api/address/create",
	    	data:{
	    		province:_this.addform.selProvince, 
	    		city:_this.addform.selCity,
	    		district:_this.addform.selArea, 
	    		address:_this.addform.address, 
	    		consignee:_this.addform.consigneename, 
	    		mobile:_this.addform.phone
	    	},
	    	dataType: "json",
	    	beforeSend: function () {
	    		
	    		// 验证必要信息是否为空
                for(var j in _this.addform){
                	if(_this.addform[j] == ''){
				        _this.$message({
				          message: '请将信息填写完整！',
				          type: 'warning'
				        });
                		return false;
                	}
                }

                // 手机号验证
	    		const reg = /^1(3|4|5|7|8)\d{9}$/; //验证手机正则(输入前7位至11位)
	      		if(!reg.test(_this.addform.phone)){
	      			_this.$message.error('手机号码格式错误');
	      			return false;
	      		}
            },
	    	success:function(res){
	    		let errMess = res.error_msg;
	    		if(errMess){
			        _this.$message.error(errMess);
	    		}else{
	    			_this.dialogFormVisible = false;
			        _this.$message({
			          message: '地址添加成功！',
			          type: 'success'
			        });
			        _this.getaddlist();
	    		}

	    		
	      	}
	    })
  	},
    //删除地址
    addressDelete(id,index){
        let _this = this;
        $.ajax({
          url: _this.$store.state.apilink+"?s=api/address/delete",
          data:{id:id},
          dataType: "json",
          type: 'post',
          success: function (res) {
            if (res.error == 0) {
              _this.getaddlist();
            }
          },
          error:function (res) {
            _this.$message('未知错误！');
          }
        });
      },

  	// 获取选择收货地址列表
  	getaddlist(){
  		let _this = this;
  		$.ajax({
        	type: "post",
        	url: this.$store.state.apilink+"?s=api/address/getlist",
        	dataType: "json",
        	success:function(res){
        		_this.addlist = res.data;
        		for(var i in res.data){
              if(_this.classSign !=0){

                _this.selectaddress = res.data[_this.classSign];
                _this.addressId = res.data[_this.classSign].address_id;

              }else if(res.data[i].is_default == 1){

        				_this.selectaddress = res.data[i];
        				_this.addressId = res.data[i].address_id;

        			}
        		}

            // 地址匹配
            _this.selectAddId();

          }
      	});
  	},
  	// 编辑 选择地址
  	getadd(e,addId,types,index){
      this.selectadd = index;
  		let _this = this;
  		$.ajax({
        	type: "get",
        	url: this.$store.state.apilink+"?s=api/address/get",
        	data:{
        		id:addId
        	},
        	dataType: "json",
        	success:function(res){
        		if(types == 2){	// 编辑

        			_this.editform.selProvince = res.data.province;
        			_this.editform.selCity = res.data.city;
        			_this.editform.selArea = res.data.district;

        			_this.editform.address = res.data.address;
        			_this.editform.consigneename = res.data.consignee;
        			_this.editform.phone = res.data.mobile;
        			_this.editform.addressId = res.data.address_id;

        			// console.log(_this.editform)
        			// 省
        			_this.selectAddressInfo(0);
        			// 编辑省 对应的市
        			_this.selectAddressInfo(_this.editform.selProvince);
        			// 编辑市 对应的县
        			_this.selectAddressInfo(_this.editform.selCity);

        			_this.dialogFormVisible2 = true;

        		}else{	// 选地址
        			_this.selectaddress = res.data;
        			_this.classSign = index;
        			_this.addressId = addId;

        // 			// 信息还原
	    			// _this.goodsList = _this.allGoodsList;

	    			// console.log(_this.allGoodsList)
	    			// console.log(_this.goodsList)
	    			// _this.getOrderList();

        			// 地址匹配
        			_this.selectAddId();

        			
        		} 
        		
          	}
      	});
  	},
	addAddress(){
		this.addform.selProvince = '';
		this.addform.selCity = '';
		this.addform.selArea = '';
		this.addform.address = '';
		this.addform.consigneename = ''; 
		this.addform.phone = '';

		this.dialogFormVisible = true;
		this.selectAddressInfo(0);
	},
	selectCity(e){	// 点击省 保存省 获取对应的市
		if(e.target.value != ""){
			this.editform.selProvince = e.target.value;
			this.editform.selCity = -1;
			this.editform.selArea = -1;
			this.selectAddressInfo(e.target.value);
		}
	},
	selectArea(e){	// 点击市 保存市 获取对应的区
		if(e.target.value != ""){
			this.editform.selCity = e.target.value;
			this.editform.selArea = -1;
			this.selectAddressInfo(e.target.value);
		}
	},
	selectArea2(e){	// 点击区 保存区
		if(e.target.value != ""){
			this.editform.selArea = e.target.value;
		}
	},
	selectAddressInfo(id){
		let _this = this;
		$.ajax({
			url: this.$store.state.apilink+"?s=api/address/getregion",
			data:{
				parent_id:id || 0
			},
			dataType:"json",
			type: 'get',
			success: function (res) {
        let sitData = res.data;
				switch(sitData[0].level){
				case '1':
					_this.addform.province = sitData;
				  break;
				case '2':
				  _this.addform.city = sitData;
				  break;
				case '3':
				  _this.addform.district = sitData;
				  break;
				default:
				  // console.log('default');
				}
			}
		});
	}
  },
  components: {
    Headertop,IndexFooter,indentStatus
  }
}

</script>

<style scoped>
.order {
  min-width: 1210px;
}
.order-dialog-btn .button1{
	background: #009e4d;
	width:80px;
	height:30px;
	-moz-border-radius: 4px;
	-webkit-border-radius: 4px;
	border-radius: 4px;
	margin-left: 50px;
	color: #fff;
	cursor: pointer;
}
.order-dialog-btn .button2{
	background: #f5f5f5;
	width:80px;
	height:30px;
	-moz-border-radius: 4px;
	-webkit-border-radius: 4px;
	border-radius: 4px;
	border: 1px solid #d8d8d8;
	margin-left: 20px;
	cursor: pointer;
}
.order-dialog-phone input,.order-dialog-name input{
	border:1px solid #d8d8d8;
	width:325px;
	height: 20px;
	padding: 3px 5px; 
}
.order-dialog-textarea textarea{
	border:1px solid #d8d8d8;
	resize:none;
	width:335px;
	height: 60px;
	padding:5px;
	-moz-box-sizing: border-box;
	-webkit-box-sizing: border-box;
	-o-box-sizing: border-box;
	-ms-box-sizing: border-box;
	box-sizing: border-box; 
	font-size: 12px;
}
.order-dialog-add select{
	border: 1px solid #d8d8d8;
	width:100px;
	height:20px;
	margin-right:15px;
	padding-left: 10px;
}
.order-dialog-add select option{
	width:100px;
}
.order-dialog label{
	display:inline-block;
	width:100px;
	text-align:right;
	position: absolute;
	top: 0;
	left: 0;
}
.order-dialog{
	line-height: 30px;
	position: relative;
	padding-left: 23%;
	margin-bottom:10px;
}
.order-dialog-btn{
	margin:20px 0 0 0; 
}
#add-select .el-input__inner{
	height:10px ! important;
}
.order-dialog i{
	color:red;
}
.order-title-wrap{
	overflow:hidden;
	height:110px;
	background:#fff;
	line-height:110px;
}
.order-title-wrap h2{
	width:1200px;
	margin:0 auto;
	diplay:inline-block;
	overflow:hidden;
}
.order-title-wrap a{
	float:left;
}
.indentinfo {
  width: 100%;
  margin-bottom: 25px;
}
.indentinfo h4 {
  line-height:30px;
  margin: 10px 0;
  font-size: 16px;
  font-weight:900;
  margin-left: 20px;
}
.indentinfo h4 span {
  margin-left: 10px;
  font-weight: 0;
  font-size: 14px;
  color: #009e4d;
  cursor:pointer;
}
.addresslist {
  margin: 0 20px;
  font-size: 14px;
}
.addresslist a {
  display: block;
  width: 100%;
  height: 40px;
  margin-top: 8px;
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  -o-box-sizing: border-box;
  -ms-box-sizing: border-box;
  box-sizing: border-box;
  border: 2px solid #fff;
}
.addresslist a:hover {
  @extend .address;
  background: #fff;
  border: 2px solid #f3f3f3;
}
.addresslist li {
  display: inline-block;
  line-height: 36px;
  margin-left: 10px;
  overflow: hidden;
}
.addresslist li:nth-of-type(3) {
  margin-right: 20px;
}
.addresslist a:hover .setaddress {
  display: inline-block;
}
.addresslist a:hover .editaddress {
  display: inline-block;
}
.addresslist a:hover .deladdress {
  display: inline-block;
}
.namedetail {
  max-width: 70px;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.phonedetail {
  width: 100px;
}
.addressdetail {
  max-width: 700px;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.defaultaddress span {
  color: #999;
  display: inline-block;
  height: 25px;
  line-height: 25px;
  padding: 0 5px;
  background: #ebebeb
}
.addresslist .setaddress {
  display: none;
}
.setaddress span{
  padding: 0 5px;
  height: 25px;
  line-height: 25px;
  color: #009e4d;
  background: #ebebeb;
  display: inline-block;
}
.addresslist .editaddress {
  color: #009e4d;
  display: none;
}
.addresslist .deladdress {
  color: #009e4d;
  display: none;
}
.order-wrap{
	width:100%;
	height:auto;
	overflow:hidden;
	background:#f3f3f3;
}
.order-center-wrap{
	width:1200px;
	margin:0 auto;
	min-height:200px;
	background: #fff;
}
.order-list-wrap{
	width:100%;
	height:auto;
	overflow:hidden;
	text-align:left;
}
.order-list-wrap dt{
	line-height:30px;
	font-weight:900;

}
.order-list{
	overflow:hidden;
	height:auto;
}
.order-list a{
	float:left;
	width:230px;
	height:160px;
	padding:10px 17px 15px 17px;
	-moz-box-sizing: border-box;
	-webkit-box-sizing: border-box;
	-o-box-sizing: border-box;
	-ms-box-sizing: border-box;
	box-sizing: border-box; 
	margin:13px 13px 13px 0;
	background: url('/static/images/addwrap.png') no-repeat right 0;
}
.order-list a:hover{
	background: url('/static/images/addwrap.png') no-repeat 0 0;
}
.order-list .active{
	background: url('/static/images/addwrap.png') no-repeat 0 0;
}

.concrete-address{
	display:block;
	height:100%;
}
.concrete-address dt{
	line-height:30px;
	border-bottom:1px solid #d8d8d8;
	font-weight:100;
}
.concrete-address dt span{
	float:right;
	width:80px;
	height:22px;
	background:#d8d8d8;
	-moz-border-radius: 10px;
	-webkit-border-radius: 10px;
	border-radius: 10px;
	text-align:center;
	line-height:22px;
	font-size:14px;
}
.address-phone{
	line-height:24px;
	font-size:12px;
}
.address-address{
	line-height:16px;
	font-size:12px;
	height:60px;
}
.address-btn{
	text-align:right;
	padding-right:20px;
	text-decoration:underline;
	display:none;
}
.order-list a:hover .address-btn{
	display:block;
}
.add-address-wrap i{
	display:inline-block;
	width:120px;
	height:30px;
	border:1px solid #d8d8d8;
	background:#f2f2f2;
	text-align:center;
	line-height:30px;
	font-size:14px;
	margin:10px 0;
	cursor:pointer;
}
.goods-list-wrap{
	text-align:left;

	margin:30px 20px 100px;
}
.goods-list-wrap dt{
	line-height:24px;
	font-weight:900;
	margin-top: 17px;
}
.goods-info-wrap dl{
	width:100%;
	overflow:hidden;
}
.info-title-wrap{
	width:100%;
	height:40px;
	overflow:hidden;
	text-align:center;
	background:#fff;
  border-bottom: 1px solid #ebebeb;
	/*border:1px solid #d8d8d8;*/
	-moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
    -o-box-sizing: border-box;
    -ms-box-sizing: border-box;
    box-sizing: border-box;
}
.info-title-wrap span{
	float:left;
	width:14.2%;
	height:100%;
	color:#333;
	font-size: 16px;
	line-height:40px;
	font-weight:100;
}
.info-info-wrap{
	height:110px;
	/*border:1px solid #d8d8d8;*/
	border-top:0;
	-moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
    -o-box-sizing: border-box;
    -ms-box-sizing: border-box;
    box-sizing: border-box;
    overflow:hidden;

}
.siteMate{
  height: 150px;
  color: #999;
	background: #fff;/*f8f8f8*/
}
.info-info-wrap div{
	float:left;
	width:14.2%;
	height:120px;
	text-align:center;
	-moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
    -o-box-sizing: border-box;
    -ms-box-sizing: border-box;
    box-sizing: border-box; 
}
.info-info-img{
	padding: 20px 46px 10px 20px;
	-moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
    -o-box-sizing: border-box;
    -ms-box-sizing: border-box;
    box-sizing: border-box;
    overflow:hidden;
}
.info-info-img img{
	width:90px;
	height:90px;

}
.info-info-message,.info-info-id,.info-info-price,.info-info-num,.info-info-operate{
	padding-top:20px;
	line-height:26px;
	font-size: 14px;
}
.info-info-message .order-meth-info{
  position: relative;
  left: -162px;
  top: 70px;
	color:red;
	font-size: 12px;
}
.info-info-message .order-spec_key_name{
  color: #999;
  font-size: 12px;
}
.info-info-message p{
	text-align:center;
	white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.info-info-message p:nth-of-type(2) {
  padding-top: 10px;
}
.info-info-price :nth-child(2){
	color:#999;
}
.info-center-dd{
	text-align:right;
	line-height:26px;
	margin:10px 0 0 0;
  border-top: 1px solid #d8d8d8;
}
.info-center-dd p {
  padding-top: 26px;
}
.info-center-dd p:nth-of-type(2) {
  padding-top: 5px;
}
.info-center-dd i{
	display:inline-block;
	width:100px;
	font-size: 14px;
	padding-right:20px;
}
.info-center-dd span{
	display:inline-block;
	width:100px;
	text-align:left;
}
.info-bottom-dd{
	height:80px;
	/*background:#f2f2f2;*/
}
.info-bottom-dd-p2{
	color: #999;
	font-size: 14px;
}
.info-bottom-dd p{
	height:40px;
	text-align:right;
	line-height:40px;
}
.info-bottom-dd p i{
	display:inline-block;
	padding-right:20px;
}
.info-bottom-dd p span{
	display:inline-block;
	width:100px;
	text-align:left;
}
.el-button--primary {
    color: #fff;
    background-color: #009e4d ! important;
    border-color: #009e4d ! important;
}
.info-bottom-affirm{
	line-height: 80px;
	text-align: right;
}
.info-bottom-affirm button{
	background: #e64346;
	width:150px;
	height: 50px;
	color: #fff;
	cursor: pointer;
	line-height: 40px;
}
.info-bottom-affirm .confirmOrderbg{
	background: #d8d8d8;
}
.paytotast {
  text-align: right;
  font-size: 14px;
  color: #999;
  padding-bottom: 18px;
}
.paytotast i{
  font-size: 12px;
  margin-right: 10px;
  color: #ffcd35;
  background: #fff;
}
.addresslist .selectAddress {
  border: 2px solid #009e4d;
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  -o-box-sizing: border-box;
  -ms-box-sizing: border-box;
  box-sizing: border-box; 
  background: url('/static/images/selectaddress.png') no-repeat right 12px;
}
.selectGou {
  float: right;
  margin-top: 12px;
}
</style>
