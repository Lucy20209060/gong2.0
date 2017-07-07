<template>
  <div class="login">
    <loginHeader>欢迎登录</loginHeader>
    <div class="content">
        <ul class="login-ul">
            <li>用户登录</li>
            <!-- 提示信息 -->
            <li class="hint" v-html="Prompt"></li>
            <li ref="tel">
               <div>
                  <span class="iconfont icon-shouji"></span>
                </div>
                <input 
                    type="tel" 
                    ref="telInput"
                    class="login-phone" 
                    maxlength="11"
                    v-model="phoneNum" 
                    v-focus
                    @focus="phoneFocus($event)"
                    @blur="phoneBlur($event)"
                    @input="telEntry($event)"
                    placeholder="请输入手机号码" 
                    v-on:keyup.13='enter'
                />

                <em 
                    class="iconfont icon-iconfontshanchu" 
                    @click="clearInput"
                    v-if="iconStatus"
                >
                </em>
            </li>

            <li ref="password">
               <div>
                  <span class="iconfont icon-p-password"></span>
                </div>
                <input 
                    type="password" 
                    ref="passwordInput"
                    class="login-password" 
                    placeholder="请输入密码" 
                    v-model="cipherNum" 
                    maxlength="16"
                    @focus="passFocus($event)"
                    @blur="passBlur($event)"
                    @input="passEntry($event)"
                    v-on:keyup.13='loginBtn'
                />
            </li>
            <li>
                <p style="color:#999">必须使用数字、字母、符号两种及以上的组合，6-16个字符</p>
            </li>
            <li>
               <input 
                   type="button"
                   class="login-submit" 
                   value="登录" 
                   @click="loginBtn" 
               />
            </li>
            <li>
               <router-link to="/findBackPsd">忘记密码？</router-link>
               <router-link class="btn-register" to="/register">立即注册</router-link>
            </li>
        </ul>
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
            phoneNum:'',                // 电话号输入框
            phoneStatus:false,          // 电话号码输入框开关

            cipherNum:'',                // 密码输入框
            cipherStatus:false,          // 密码输入框开关

            iconStatus:false,           // X 按钮开关
            Prompt:'',                  // 提示信息

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
    watch:{
        phoneNum(curval,oldval){
            // X按钮 显示与隐藏
            curval.length >=1 
            ?this.iconStatus = true
            :this.iconStatus = false
        }
    },
    methods:{
        // 账号输入框 按回车键
        enter(){
            // this.$refs.telInput.blur();
            this.$refs.passwordInput.focus();
        },

        // 登录按钮
        loginBtn(){

            if(this.phoneNum == '' && this.cipherNum == ''){
                this.promptInfo('请输入手机号码和密码');
                return false;
            }

            // 手机号码检测
            let tem = this.phoneNumberEntry(this.phoneNum);
            this.phoneStatus = false;
            this.$refs.tel.removeAttribute('class');

            switch(tem){
                case '-1':
                    this.promptInfo('首位不为1');
                    this.$refs.tel.setAttribute('class','input-active-warn');
                    this.phoneStatus = false;
                    return false;
                    break;

                case '0':
                    this.promptInfo('请输入手机号码');
                    this.$refs.tel.setAttribute('class','input-active-warn');
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
                    return false;
                    break;

                case '3':
                    this.promptInfo('手机号码格式错误');
                    this.phoneStatus = false;
                    return false;
                    break;             
            };

            // 密码检测
            this.cipherStatus = false;
            this.$refs.password.removeAttribute('class');
            // this.promptInfo('');
            if(this.cipherNum.length ==0){

                this.promptInfo('请输入密码');
                this.$refs.password.setAttribute('class','input-active-warn');
                return false;

            }else if(this.cipherNum.length >=6 && this.cipherNum.length <=16){
                this.cipherStatus = true;
            }else{

                this.promptInfo('密码格式错误');
                return false;
            }

            

            if(this.cipherStatus && this.phoneStatus){
                this.login();
            } 
        },

        // 登录
        login(){
            // 删除userId
            this.$cookie.delCookie('a34ea2d96d4239d4d86803bb3cd99788');
            // 删除电话号码
            this.$cookie.delCookie('8e3c824e1d6254b74a013799c1565538');
            // 删除认证状态
            this.$cookie.delCookie('b61a9d162ac1dfaa22d0f05bdc7f6299');

            this.$cookie.delCookie('PHPSESSID');

            const _this = this;
            $.ajax({
                url: this.$api.login.login,
                data: {
                    username:this.phoneNum,
                    password:this.cipherNum
                },
                dataType: "json",
                type: 'post',
                beforeSend: function () {

                },
                success: function (res) {
                    if (res.status == 200){
                        _this.getUserInfo();
                    }else{
                        // _this.$message(res.msg);
                        _this.promptInfo(res.msg);
                    }
                },
                error:function (res) {
                    _this.$message('系统繁忙~');
                }
            })
        },

        // 获取用户信息
        getUserInfo(){
            const _this = this;
            $.ajax({
                url: this.$api.login.is_login,
                dataType: "json",
                async:false,
                type: 'get',
                success: function (res) {
                    if(res.code == 2){
                        _this.$cookie.setCookie('a34ea2d96d4239d4d86803bb3cd99788',res.user_id,'d1');
                        _this.$cookie.setCookie('b61a9d162ac1dfaa22d0f05bdc7f6299',res.is_verify,'d1');
                        _this.$cookie.setCookie('8e3c824e1d6254b74a013799c1565538',res.mobile,'d1');

                        if(res.is_verify == 1){
                            _this.$router.push({path:'/'});
                        }else if(res.is_verify== -1){
                            _this.$router.push({path:'/verify'});
                        }else{
                            _this.$router.push({path:'/proof'});
                        }

                    }else{
                        _this.$cookie.delCookie('a34ea2d96d4239d4d86803bb3cd99788');
                        _this.$cookie.delCookie('b61a9d162ac1dfaa22d0f05bdc7f6299');
                        _this.$cookie.delCookie('8e3c824e1d6254b74a013799c1565538');
                        _this.$cookie.delCookie('PHPSESSID');
                    }
                }
            });
        },

        // 清除input框内容
        clearInput(){
            this.phoneNum = '';
            this.iconStatus = false;
            this.promptInfo();
            this.$refs.telInput.focus();
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
                `
                this.Prompt = Info;
            }

        },

        //电话号码检测
        telEntry(e){
            
            let tem = this.phoneNumberEntry(this.phoneNum);

            this.phoneStatus = false;

            // console.log(tem)

            switch(tem){
                case '-1':
                    this.promptInfo('首位不为1');
                    this.$refs.tel.setAttribute('class','input-active-warn');
                    break;

                case '0':
                    this.promptInfo('');
                    this.$refs.tel.setAttribute('class','input-active');
                    break;

                case '1':
                    this.promptInfo('');
                    this.phoneStatus = true;
                    break;

                case '2':
                    this.promptInfo('');
                    break;

                case '3':
                    this.promptInfo('手机号格式错误');
                    this.$refs.tel.setAttribute('class','input-active-warn');
                    break;             
            }
        },

        // 密码检测
        passEntry(e){

            this.cipherStatus = false;
            this.promptInfo('');
            if(this.cipherNum.length >=6 && this.cipherNum.length <=16){
                this.cipherStatus = true;
            }
            
        },

        // 手机号码输入框  失焦 与 聚焦
        phoneFocus(e){
            this.focus_Or_blur('tel','focus');
            this.promptInfo('');
        },
        phoneBlur(e){

            let tem = this.phoneNumberEntry(this.phoneNum);

            this.phoneStatus = false;

            this.$refs.tel.removeAttribute('class');

            // console.log(tem)

            switch(tem){
                case '-1':
                    this.promptInfo('首位不为1');
                    this.$refs.tel.setAttribute('class','input-active-warn');
                    break;

                case '0':
                    this.promptInfo('请输入手机号码');
                    this.$refs.tel.setAttribute('class','input-active-warn');
                    break;

                case '1':
                    this.promptInfo('');
                    this.phoneStatus = true;
                    break;

                case '2':
                    this.promptInfo('手机号码格式错误');
                    this.$refs.tel.setAttribute('class','input-active-warn');
                    break;

                case '3':
                    this.promptInfo('手机号码格式错误');
                    this.$refs.tel.setAttribute('class','input-active-warn');
                    break;             
            }
        },

        // 密码框聚焦
        passFocus(e){
            this.focus_Or_blur('password','focus');
            this.promptInfo('');
        },

        // 密码框失焦
        passBlur(e){

            this.cipherStatus = false;
            this.$refs.password.removeAttribute('class');
            this.promptInfo('');
            if(this.cipherNum.length ==0){

                this.promptInfo('请输入密码');
                this.$refs.password.setAttribute('class','input-active-warn');

            }else if(this.cipherNum.length >=6 && this.cipherNum.length <=16){
                this.cipherStatus = true;
            }else{

                this.promptInfo('密码格式错误');
            }
        },

// ------------------------------------------------------------//
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

        // 输入框 失焦 与 聚焦 
        // focus_Or_blur(e,value = 'focus'){
        //     if(value === "focus"){
        //         e.path[1].removeAttribute('class');
        //         e.path[1].setAttribute('class','input-active');
        //     }else{
        //         e.path[1].removeAttribute('class');
        //     }
        // },

        // 输入框 失焦 与 聚焦 
        focus_Or_blur(name,value = 'focus'){

            if(name === 'tel'){

                value === "focus"
                ? this.$refs.tel.setAttribute('class','input-active')
                :this.$refs.tel.removeAttribute('class');
                return false;
            }

            if(name === 'password'){
                value === "focus"
                ? this.$refs.password.setAttribute('class','input-active')
                :this.$refs.password.removeAttribute('class');
                return false;
            }
        },

        // 输入框 警告
        input_warning(e){
            e.path[1].removeAttribute('class');
            e.path[1].setAttribute('class','input-active-warn');
        },
    }
}

</script>

<style>
/* 1.*版本 注释 */
    .login{width:100%;height:100%}
    .login .content{
        height:600px;
        background:#F0F0F0 url(/static/images/login_bg.png) no-repeat center 0;
    }
    .login-ul{
        width:350px;
        float:right;
        margin:100px 15% 0 0;
        padding:20px 40px;
        background:#fff
    }
    .login-ul li:nth-child(1){
        font-size:20px;
        text-align:left;
    }
    .hint{
        height:28px;
        line-height:28px;
        font-size:14px;
        color:red;
        margin:5px 0;
        text-align: left;
    }
    .hint-div{
        height: 100%;
        background-color: #FFEBEB;
        border: 1px solid #FFD0D0;
        padding-left: 12px;
        -moz-box-sizing: border-box;
        -webkit-box-sizing: border-box;
        -o-box-sizing: border-box;
        -ms-box-sizing: border-box;
        box-sizing: border-box;
    }
    .login-ul li:nth-child(3),
    .login-ul li:nth-child(4){
        height:46px;
        line-height:46px;
        font-size:16px;
        margin-top:1px;
        border:1px solid #D8D8D8;
    }
    .login-ul li:nth-child(3) div,
    .login-ul li:nth-child(4) div{
        float: left;
        background:#f2f2f2;
        border-right: 1px solid #D8D8D8;
    }
    .login-ul li:nth-child(3) input,
    .login-ul li:nth-child(4) input{
        float: left;
        width:200px;
        height:100%;
        padding:0 16px;
    }
    .login-ul li:nth-child(3) .iconfont,
    .login-ul li:nth-child(4) .iconfont{
        float: right;
        height:100%;
        margin:0 17px;
        color: #9A9A9A;
        cursor: pointer;
        
    }
    .login-ul li:nth-child(4){
        margin-top:20px
    }
    .login-ul li:nth-child(5){
        height:12px;
        line-height:12px;
        font-size:12px;
        margin-top:12px;
        text-align: left;
    }
    .login-ul li:nth-child(6){
        text-align:center;
        height:46px;
        line-height:46px;
        background:#009448;
        margin-top:20px;
        border-radius:4px
    }
    .login-ul li:nth-child(6) input{
        font-size:20px;
        color:#fff;
        width: 100%;
        height: 100%;
    }
    .login-ul li:nth-child(7){
        height:17px;
        line-height:17px;
        margin-top:20px;
        text-align: left;
    }
    .btn-register{
        float:right;
        color:#009448!important
    }


/* 2.0版本 2017/6/16 注释 */
    
    /*清除IE输入框 默认样式*/
    input::-ms-clear, input::-ms-reveal{
        display: none;
    }
    /*失焦 与 聚焦 效果*/
    .content .login-ul .input-active{
        border: 1px solid #009e4d;
    }
    .content .login-ul .input-active div{
        border-color: #009e4d;
    }
    .content .login-ul .input-active div span{
        color: #009e4d;
    }
    
    
    /*警示 效果*/
    .content .login-ul .input-active-warn{
        border: 1px solid red;
    }
    .content .login-ul .input-active-warn div{
        border-color: red;
    }
    .content .login-ul .input-active-warn div span{
        color: red;
    }
    .content .login-ul .input-active-warn input::-webkit-input-placeholder{/* WebKit browsers */ 
        color: red;
    }
    .content .login-ul .input-active-warn input:-moz-placeholder{ /* Mozilla Firefox 4 to 18 */ 
        color: red;
    }
    .content .login-ul .input-active-warn input::-moz-placeholder { /* Mozilla Firefox 19+ */ 
        color: red;
    } 
    .content .login-ul .input-active-warn input:-ms-input-placeholder { /* Internet Explorer 10+ */ 
        color: red;
    }
    

</style>