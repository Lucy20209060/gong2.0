<template>
  <div class="register">
    <loginHeader>用户注册</loginHeader>
    <div class="content">
        <ul class="register-ul">
            <li>
                <i>用户注册</i>
                <router-link to="/login">马上登录</router-link>
                <span>已有账号?</span>
            </li>

            <!-- 提示信息 -->
            <li class="hint" v-html="Prompt"></li>

            <!-- 手机号 输入框 -->
            <li ref="phoneNum"><!-- input-active-warn -->
                <i class="iconfont icon-shouji"></i>
                <input 
                    type="text" 
                    ref="tel"
                    v-focus
                    placeholder="请输入手机号" 
                    maxlength="11"
                    v-model="phoneNum"
                    v-on:keyup.13='telEnter'
                    @focus="phoneFocus($event)"
                    @blur="phoneBlur($event)"
                />
                <span 
                    v-if="iconStatus" 
                    class="iconfont icon-iconfontshanchu"
                    @click="clearInput"
                >
                </span>
            </li>

            <!-- 验证码输入框 -->
            <li ref="codeNum"><!-- input-active-warn -->
                <i class="iconfont icon-icon-"></i>
                <input 
                    type="text" 
                    ref="verification"
                    placeholder="请输入验证码" 
                    maxlength="6"
                    v-model="codeNum"
                    v-on:keyup.13='verificationEnter' 
                    @focus="verificationFocus($event)"
                    @blur="verificationBlur($event)"
                />
                <a 
                    href="javascript:;" 
                    @click="getCode"
                    v-text="getCodeInfo"
                > 
                </a>
            </li>

            <!-- 密码输入框 -->
            <li ref="passwordNum"><!-- input-active-warn -->
                <i class="iconfont icon-shouji"></i>
                <input 
                    :type="inputType" 
                    ref="password"
                    placeholder="请输入密码" 
                    maxlength="16"
                    @input="passwordImport($event)"
                    v-on:keyup.13='passwordEnter' 
                    @focus="passwordFocus($event)"
                    @blur="passwordBlur($event)"
                />
                <span 
                    class="iconfont" 
                    :class="passIconType"
                    @click="changePasswordType" 
                >
                    
                </span>
            </li>

            <li>必须使用数字、字母、符号两种及以上的组合，6-16个字符</li>
            
            <!-- 安厨供应链条款 -->
            <li>
                <input 
                    type="radio" 
                    id="clause" 
                    :checked="checked"
                    @click="radio"
                 />
                <label for="clause">
                    <span>我已阅读并同意</span>
                    <i class="pointer" @click="dialogVisible = true">《安厨供应链服务条款》</i>
                </label>
                
            </li>

            <!-- 注册按钮 -->
            <li class="button-wrap">
                <input type="button" value="注册" @click="registerBtn" />
            </li>

        </ul>


        <el-dialog title="服务条款" v-model="dialogVisible" size="small" :close-on-click-modal='false' :close-on-press-escape='false'>
              <p style="line-height: 20px;height: 500px;overflow-y: scroll;">
                <span style="font-weight: bold;">甲方：杭州安厨电子商务有限公司</span><br/>
                <span style="font-weight: bold;">乙方：注册方</span><br/>
                <br/>
                根据相关法律法规的规定，甲乙双方通过友好协商，本着平等、自愿、公平和诚实信用的原则，就乙方在其合作平台销售甲方商品事宜订立本协议<br/>
                <br/>
                第一条条款目的<br/>
                1.1为了规范安厨经营秩序，保障安厨自营商品的质量，以维护采购方的合法权益，安厨与采购方就安厨自营商品的合作运营事宜，根据《用户的权利和义务》、《安厨平台规则》的有关内容制定。<br/>
                1.2本条款由杭州安厨电子商务有限公司（以下简称“安厨”或“甲方"）与申请成为采购方的会员（以下简称”采购方“或者”乙方“）共同认证。<br/>
                <br/>
                第二条合作内容及方式<br/>
                2.1乙方在其合作平台上架销售甲方商品，消费者在乙方合作平台下单后，乙方在甲方平台自助下单或批量导入订单，由甲方为消费者配送商品。<br/>
                2.2乙方将完整的订单信息发送给甲方，包括商品信息、数量、收件地址、收件人、电话等,如产品、数量、包裹地址等信息有误造成售后顾客退换货的，产生的责任由出错方承担。<br/>
                2.3发货时间：乙方通过安厨平台向甲方系统下单，并且提供收件人正确的收货地址等信息。甲方在接到订单后，正常情况下，商品48小时内完成发货。<br/>
                2.4 邮资说明：货物运输产生的费用由乙方承担（包邮商品除外）。<br/>
                <br/>
                第三条退换货与责任界定<br/>
                3.1甲方保证所售为正品农产品，因商品质量问题发生的退、换货，甲方会协助完成货品退换且因退、换货产生的一切物流费用由甲方承担；因食品的特殊性，非质量问题的商品甲方不接受退换货，相应售后由乙方自行处理。<br/>
                3.2若因甲方错发、漏发、物流等原因发生的乙方消费者退、换货，因退、换货产生的一切费用由甲方承担。<br/>
                3.3乙方消费者收到货物后，如有破损、质量不合格、商品漏发等异常情况，乙方需明确要求消费者提供证据并拍照，包括但不限于商品外箱、破损商品和快递单号的照片，并在（2）个工作日内反馈给甲方，甲方应在收到乙方反馈后及时配合处理。<br/>
                <br/>
                第四条财务结算及预付款<br/>
                4.1  甲乙双方约定开展合作前乙方应向甲方支付10000元（壹万元）预付货款，以积分形式充入乙方在线账户，每日订单从预付款中扣取，预付款不足时需要乙方补足货款方能正常发货。<br/>
                4.2  乙方也可按每批订单实际金额进行在线支付，付款成功后甲方按乙方订单要求进行发货。<br/>
                4.3  甲乙双方在结算、汇款、收款过程中产生的手续费由甲乙双方各自承担。<br/>
                4.4  协议解除甲乙双方根据实际履行结算费用，预付款如有多出部分甲方应退还给乙方。<br/>
                <br/>
                第五条保密条款<br/>
                本协议所称商业秘密包括但不限于本协议任何补充协议所述内容及在合作过程中涉及的其他秘密信息。任何一方未经另一方书面同意，均不得将该信息向任何第三方披露、传播、编辑或展示。保密期限直至该商业秘密进入公众领域或双方书面同意解除本条限制。<br/>
                <br/>
                第六条不可抗力<br/>
                不可抗力致使本协议不能履行或不能完全履行的，遭受方可以免责或部分免责。本协议不可抗力是指：不能预见、不可避免、无法克服的客观情况。如因发生地震、台风、水灾、火灾、战争、内乱、政府行为导致协议迟延履行或不能履行，遭遇不可抗力的一方应在不可抗力发生后15个工作日内由事故发生地主管当局出具事故证明书。双方就不可抗力造成的后果进行协商，根据其影响程度，免除或部分免除相应责任。<br/>
                <br/>
                第七条争议解决<br/>
                凡因本协议引起的或与本协议有关的任何争议，如双方不能通过友好协商解决，双方均可提交给合同签署地有管辖权的法院解决。因本协议引起的纠纷，甲乙双方约定适用中华人民共和国法律解决。<br/>
                <br/>
                第八条协议终止<br/>
                8.1协议期间，如果发生下列情况之一时，守约方有权提前解除本协议：<br/>
                （1）违约方违反本协议约定给对方造成严重损失，经守约方通知后仍不改正，守约方有权经提前5日通知违约方后解除本协议。<br/>
                （2）任何一方发生无力偿债，其事业为债权人接管、结束、解散、宣告破产等事情时，对方有权终止本合同。<br/>
                8.2除前款约定情况外，任何一方由于自身原因不能继续履行本协议，必须以书面形式向对方提出，并取得对方同意，协议解除甲乙双方根据实际履行结算费用。<br/>
                8.3协议终止后，乙方应配合甲方完成相关的交接工作；业务交接完毕以后，配合甲方进行费用对账结算。<br/>
              </p>
            <input type="button" name="" @click="dialogVisible = false" value="确定" style="margin: 20px auto 0 auto;border:1px solid #D8D8D8;background: #009E4D;color: #fff;padding: 15px 60px;display: block;" />
        </el-dialog>
    </div>

    <index-footer></index-footer>

</div>
</template>

<script>
    import loginHeader from "@/components/common/login_header"
    import IndexFooter from "@/components/common/index_footer"
    export default {
        name: 'login',
        data () {
        return {
            dialogVisible:false,
            Prompt:'',                  // 提示信息

            inputType:'password',       // 密码暗明码
            passIconType:'icon-biyan',  // 暗明码 icon
            iconStatus:false,           // X 图标 显示状态

            phoneNum:'',                // 电话号码
            phoneStatus:false,          // 电话号码 是否正确

            getCodeInfo:'获取验证码',
            getCodeStatus:false,        // 获取倒计时 权限
            wait:60,                    // 倒计时

            codeNum:'',                 // 验证码
            codeStatus:false,           // 验证码 是否正确

            passwordNum:'',             // 密码
            passwordStatus:false,       // 密码 是否正确

            checked:false,              // 条款 是否选中

        }
    },
    components:{
        loginHeader,IndexFooter
    },
    directives:{
        focus: {
            inserted: function (el) {
                el.focus();
            }
        }
    },
    mounted(){

    },
    watch:{
        // 电话号码监听
        phoneNum:{
            handler(curval,oldval){
                // X按钮 显示与隐藏
                curval.length >=1 
                ?this.iconStatus = true
                :this.iconStatus = false;

                let tem = this.phoneNumberEntry(curval);

                switch(tem){
                    case '-1':
                        this.promptInfo('首位不为1');
                        this.$refs.phoneNum.setAttribute('class','input-active-warn');
                        this.phoneStatus = false;
                        return false;
                        break;

                    case '1':
                        this.promptInfo();
                        this.phoneStatus = true;
                        break;

                    case '3':
                        this.promptInfo('手机号码格式错误');
                        this.$refs.phoneNum.setAttribute('class','input-active-warn');
                        this.phoneStatus = false;
                        return false;
                        break; 

                    case '0':
                        this.promptInfo('请输入手机号');
                        this.$refs.phoneNum.setAttribute('class','input-active');
                        this.phoneStatus = false;
                        return false;
                        break;

                    case '2':
                        this.promptInfo();
                        this.$refs.phoneNum.setAttribute('class','input-active');
                        this.phoneStatus = false;
                        return false;
                        break;

                };
            },
            deep:true
        },
        
        // 电话号码状态监听 影响获取验证码按钮权限 
        phoneStatus:{
            handler(curval,oldval){
                curval ? this.getCodeStatus = true : this.getCodeStatus = false;

                // console.log(this.getCodeStatus)
            },
            deep:true
        },

        // 验证码监听
        codeNum:{
            handler(curval,oldval){
                let tem = this.codeNumberEntry();
                if(tem == 0){
                    this.promptInfo('请输入验证码');
                    this.codeStatus = false;
                }else if(tem == 1){
                    this.promptInfo('');
                    this.codeStatus = true;
                }else{
                    this.codeStatus = false;
                }
            },
            deep:true
        },

        // 阅读条款 监听
        checked:{
            handler(curval,oldval){
                
                if(curval){
                    this.promptInfo('');
                }
            },
            deep:true
        },

        // 密码监听
        passwordNum:{
            handler(curval,oldval){
                let tem = this.passwordrEntry();
                if(tem == 0){
                    this.promptInfo('请输入密码');
                    this.$refs.passwordNum.setAttribute('class','input-active');
                    this.passwordStatus = false;
                }else if(tem == 1){
                    this.promptInfo();
                    this.passwordStatus = true;
                }else if(tem == -2){
                    this.promptInfo('密码格式错误');
                    this.$refs.passwordNum.setAttribute('class','input-active-warn');
                    this.passwordStatus = false;
                }else{
                    this.promptInfo();
                    this.passwordStatus = false;
                }
            },
            deep:true
        }
    },
    methods:{
        // 手机输入框 按 Enter 键
        telEnter(){
            this.$refs.verification.focus();
        },

        // 验证码输入框 按 Enter 键
        verificationEnter(){
            this.$refs.password.focus();
        },

        // 密码框 按 Enter 键
        passwordEnter(){

        },

        // 选择密码框暗明码
        changePasswordType(){
            if(this.inputType === 'password'){
                this.inputType = 'tel';
                this.passIconType = 'icon-helpeye';
            }else{
                this.inputType = 'password';
                this.passIconType = 'icon-biyan';
            }
        },

        // 条款是否选中
        radio(){
           this.checked ? this.checked = false : this.checked = true;
        },

        // 手机号码输入框 聚焦 和 失焦
        phoneFocus(e){
            this.focus_Or_blur('phoneNum','focus');
        },
        phoneBlur(e){
            this.focus_Or_blur('phoneNum','');
            let tem = this.phoneNumberEntry(this.phoneNum);

            switch(tem){
                case '-1':
                    this.promptInfo('首位不为1');
                    this.phoneStatus = false;
                    this.$refs.phoneNum.setAttribute('class','input-active-warn');
                    return false;
                    break;

                case '0':
                    this.promptInfo('请输入手机号码');
                    this.$refs.phoneNum.setAttribute('class','input-active-warn');
                    this.phoneStatus = false;
                    return false;
                    break;

                case '1':
                    this.promptInfo('');
                    this.phoneStatus = true;
                    break;

                case '2':
                    this.promptInfo('手机号码格式错误');
                    this.phoneStatus = false;
                    this.$refs.phoneNum.setAttribute('class','input-active-warn');
                    return false;
                    break;

                case '3':
                    this.promptInfo('手机号码格式错误');
                    this.phoneStatus = false;
                    return false;
                    break;             
            };
        },

        // 验证码输入框 聚焦 与 失焦
        verificationFocus(e){
            this.focus_Or_blur('codeNum','focus');
        },
        verificationBlur(e){
            this.focus_Or_blur('codeNum','');
            if(this.codeNum.length == 0){

                this.promptInfo('请输入验证码');
                this.$refs.codeNum.setAttribute('class','input-active-warn');
                return false;

            }else if(this.codeNum.length < 4){
                this.promptInfo('验证码错误');
                this.$refs.codeNum.setAttribute('class','input-active-warn');
                return false;
            }else{
                this.promptInfo('');
            }
        },

        // 密码输入框 聚焦 与 失焦
        passwordFocus(e){
            this.focus_Or_blur('passwordNum','focus');
        },
        passwordBlur(e){
            this.focus_Or_blur('passwordNum','');
            let tem = this.passwordrEntry();
            if(tem == 0){
                this.promptInfo('请输入密码');
                this.$refs.passwordNum.setAttribute('class','input-active-warn');
            }else if(tem == 1){
                this.promptInfo();
            }else{
                this.promptInfo('密码格式错误');
                this.$refs.passwordNum.setAttribute('class','input-active-warn');
            }
        },

        // 获取验证码
        getCode(){

            const _this = this;

            // console.log(_this.getCodeStatus)

            $.ajax({
                url:this.$api.register.send_validate_code,
                data:{
                    mobile:this.phoneNum,
                    scene:1,
                    type:'mobile'
                },
                dataType: "json",
                type: 'post',
                beforeSend:function () {
                    if(!_this.getCodeStatus){
                        _this.promptInfo('请输入正确的手机号码');
                        return false;
                    }
                },
                success: function (res) {

                    _this.promptInfo(res.msg);

                    if (res.status == '1') {
                        _this.time();
                    }
                    // _this.$message(res.msg); 
                },
                error:function (res) {
                    _this.$message(res.msg);
                }
            })
        },

        // 注册按钮
        registerBtn(){

            if(!this.phoneStatus){
                this.promptInfo('请填写正确的手机号码');
                return false;
            }

            if(!this.codeStatus){
                this.promptInfo('请填写正确的验证码');
                return false;
            }

            if(!this.passwordStatus){
                this.promptInfo('请填写正确的密码');
                return false;
            }

            if(!this.checked){
                this.promptInfo('请选择已阅读服务条款');
                return false;
            }

            let _this = this;

            $.ajax({
                url: this.$api.register.reg,
                data: {
                    user_name: this.phoneNum,
                    code: this.codeNum,
                    password: this.passwordNum
                },
                type: 'post',
                dataType:"json",
                success: function (res) {
                    _this.promptInfo(res.msg);
                    if (res.code == 1){
                        // 设置用户id
                        _this.$cookie.setCookie('a34ea2d96d4239d4d86803bb3cd99788',res.result.user_id,'d1');
                        // 设置电话号码
                        _this.$cookie.setCookie('8e3c824e1d6254b74a013799c1565538',_this.phoneNum,'d1');
                        // 设置认证状态
                        _this.$cookie.setCookie('b61a9d162ac1dfaa22d0f05bdc7f6299','-4','d1');
                        // 跳转 proof
                        _this.$router.push({path:'/proof'});
                    }
                },
                error:function (res) {
                    _this.$message(res.msg);
                }
            });

        },

        // 验证码倒计时
        time() {

            const _this = this;

            if (_this.wait <= 0) {

                _this.getCodeInfo="获取验证码";
                _this.wait = 60;
                _this.getCodeStatus = true;

            } else {

                _this.getCodeStatus = false;
                _this.getCodeInfo = "请等待" + _this.wait + "s";
                _this.wait--;

                let timeOut = setTimeout(function () {

                    _this.time();

                    if(_this.wait <= 0){
                        clearTimeout(timeOut); 
                    }
                },
                1000)
            }
        },

        // 输入密码
        passwordImport(e){
            this.passwordNum = this.$refs.password.value;

            let tem = this.passwordrEntry();
            if(tem == 0){
                this.promptInfo('请输入密码');
                this.$refs.passwordNum.setAttribute('class','input-active-warn');
            }else if(tem == 1){
                this.promptInfo();
            }else{
                this.promptInfo();
            }
            
        },

        // 电话号码检测
        phoneImport(){
            let tem = this.phoneNumberEntry(this.phoneNum);

            switch(tem){
                case '-1':
                    this.promptInfo('首位不为1');
                    this.phoneStatus = false;
                    this.$refs.tel.setAttribute('class','input-active-warn');
                    return false;
                    break;

                case '1':
                    this.promptInfo('');
                    this.phoneStatus = true;
                    break;

                case '3':
                    this.promptInfo('手机号码格式错误');
                    this.$refs.phoneNum.setAttribute('class','input-active-warn');
                    this.phoneStatus = false;
                    return false;
                    break;             
            };
        },

        // 清除input框内容
        clearInput(){
            this.phoneNum = '';
            this.iconStatus = false;
            this.promptInfo();
            this.$refs.tel.focus();
        },

        // 显示提示
        promptInfo(info = ''){
            if(info == ''){
                this.Prompt =  '';
            }else{
                let Info = `
                    <div class='hint-div'>
                        <i class='iconfont icon-warning'></i>
                        <span>${info}</span>
                    </div>
                `;
                this.Prompt = Info;
            }

        },

        

        // 输入框 失焦 与 聚焦 
        focus_Or_blur(name,value = 'focus'){

            if(name === 'phoneNum'){

                value === "focus"
                ? this.$refs.phoneNum.setAttribute('class','input-active')
                :this.$refs.phoneNum.removeAttribute('class');
                return false;
            }

            if(name === 'codeNum'){
                value === "focus"
                ? this.$refs.codeNum.setAttribute('class','input-active')
                :this.$refs.codeNum.removeAttribute('class');
                return false;
            }

            if(name === 'passwordNum'){
                value === "focus"
                ? this.$refs.passwordNum.setAttribute('class','input-active')
                :this.$refs.passwordNum.removeAttribute('class');
                return false;
            }
        },

        // 检测号码
        phoneNumberEntry(num){

            let reg = /^1[3|4|5|7|8][0-9]\d{4,8}$/i;

            
            if(num.length > 0 && num.substring(0,1) != 1){
                return '-1';                                    // 首位不为1
            }
            if(num.length == 11 && reg.test(num)){
                return '1';                                     // 手机格式正确
            }
            if(num.length == 11 && !reg.test(num)){             // 手机号格式错误
                return '3';
            }
            if(num.length > 11){                                // 手机号格式错误
                return '3';
            }
            if(num.length == 0){
                return '0';                                     // 空
            }

            return '2';                                           // 待检测
        },

        // 验证码检测
        codeNumberEntry(){
            const reg = /^\d{4,6}$/i;
            if(this.codeNum.length == 0){
                return 0;
            }else if(reg.test(this.codeNum)){
                return 1;
            }else{
                return -1;
            }
        },

        // 密码检测
        passwordrEntry(){
            const reg = /^(?![0-9]+$)(?![a-zA-Z]+$)(?!([^(0-9a-zA-Z)]|[\(\)])+$)([^(0-9a-zA-Z)]|[\(\)]|[a-zA-Z]|[0-9]).{4,17}$/i;
            if(this.passwordNum.length == 0){
                return 0;
            }else if(this.passwordNum.length == 16 && !reg.test(this.passwordNum)){
                return -2;
            }else if(reg.test(this.passwordNum)){
                return 1;
            }else{
                return -1;
            }
        },

    }
}

</script>

<style>
    input::-ms-clear, input::-ms-reveal{
        display: none;
    }
    .register{width:100%;height:100%}
    .register .content{
        height:600px;
        background:#F0F0F0 url(/static/images/login_bg.png) no-repeat center 0;
    }
    .register-ul{
        width:350px;
        float:right;
        margin:100px 15% 0 0;
        padding:20px 40px;
        background:#fff;
        line-height: 26px;
    }
    .register-ul li:nth-child(1){
        overflow: hidden;
    }
    .register-ul li:nth-child(1) i{ float: left; font-size: 20px; }
    .register-ul li:nth-child(1) span{ float: right; }
    .register-ul li:nth-child(1) a{ float: right; color: #009e4d; }

    /*去除scoped后 .hint .hint-div 由login页面中的提供*/
    
    .register-ul li:nth-child(3),
    .register-ul li:nth-child(4),
    .register-ul li:nth-child(5){
        height: 46px;
        line-height: 46px;
        overflow: hidden;
        border:1px solid #d8d8d8;
        margin-bottom:20px;
    }
    .register-ul li:nth-child(5){
        margin-bottom:0;
    }
    .register-ul li:nth-child(3) i,
    .register-ul li:nth-child(4) i,
    .register-ul li:nth-child(5) i{
        float: left;
        text-align: center;
        width: 50px;
        border-right: 1px solid #d8d8d8;
        background-color: #f2f2f2;
    }
    .register-ul li:nth-child(3) input,
    .register-ul li:nth-child(4) input,
    .register-ul li:nth-child(5) input{
        float: left;
        height: 100%;
        width: 180px;
        padding-left: 16px;
    }
    .register-ul li:nth-child(3) span,
    .register-ul li:nth-child(5) span{
        float: right;
        height: 100%;
        margin: 0 17px;
        color: #9a9a9a;
        cursor: pointer;
    }
    .register-ul li:nth-child(5) span{
        color: #333;
    }

    .register-ul li:nth-child(4) a{
        font-size: 14px;
        padding-left: 16px;
        position: relative;
    }
    .register-ul li:nth-child(4) a:after{
        position: absolute;
        content: '';
        width: 1px;
        height: 150%;
        left: 0;
        top: -25%;
        background: #d8d8d8;
    }
    .register-ul li:nth-child(6){
        font-size: 12px;
        color: rgb(153, 153, 153);
    }
    .register-ul li:nth-child(7) input{
        color: rgb(153, 153, 153);
        font-size: 12px;
        vertical-align: middle;
    }
    .register-ul li:nth-child(7) label{
        color: rgb(153, 153, 153);
        font-size: 12px;
    }
    .register-ul li:nth-child(7) i{
        font-size: 12px;
        color: #333;
    }
    .register-ul li:nth-child(7) i:hover{
        color: #009e4d;
    }

    /*警示框*/
    .input-active-warn{
        border:1px solid red !important;
    } 
    .input-active-warn i{
        border-right: 1px solid red !important;
        color: red;
    }

    .input-active-warn input::-webkit-input-placeholder{/* WebKit browsers */ 
        color: red;
    }
    .input-active-warn input:-moz-placeholder{ /* Mozilla Firefox 4 to 18 */ 
        color: red;
    }
    .input-active-warn input::-moz-placeholder { /* Mozilla Firefox 19+ */ 
        color: red;
    } 
    .input-active-warn input:-ms-input-placeholder { /* Internet Explorer 10+ */ 
        color: red;
    }

    .input-active{
        border:1px solid #009e4d !important;
    }
    .input-active i{
        border-right: 1px solid #009e4d !important;
        color: #009e4d;
    }

    .button-wrap{
        margin-top:10px;
        height: 46px;
        border-radius: 4px;
        background: #009448;
        line-height: 46px;
    }
    .button-wrap input{
        width: 100%;
        height: 100%;
        color: #fff;
        font-size: 20px;
    }
</style>