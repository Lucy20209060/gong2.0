<template>
    <section class="index-footer">

        <div class="footerImg">
            <img src='/static/images/footer-img.png' />
        </div>

        <div class="footerLink">
            <dl class="index-footer-logo">
                <dd>{{contact.contactWay}}</dd>
                <dd>{{contact.contactTime}}</dd>
                <dt>
                    <p class="pointer" @click="kefu">
                        <i class="iconfont icon-xinxi"></i>
                        <span>联系在线客服</span>   
                    </p>
                </dt>
            </dl>

            <dl 
                class="index-footer-link" 
                v-for="(item,index) in footerLink" 
                key="index"
            >
                <dt>{{item.title}}</dt>
                <router-link 
                    tag="dd" 
                    v-for="(contents,index) in item.content" 
                    key="index" 
                    v-text="contents.subheading"
                    :to="contents.link"
                >
                </router-link>
            </dl>
        </div>

        <div class="footerInfo" v-text="footerInfo"></div>

    </section>
</template>

<script>
export default {
    name: 'index-footer',
    data () {
        return {
            footerInfo:'',
            contact:{
                contactWay:'0517-28272936',
                contactTime:'周一至周五：9:00-18:00',   
            },
            footerLink:[
                {
                    title:'品牌承诺',
                    content:[
                        {
                            subheading:'原产地直供',
                            link:'/help/origin'
                        },
                        {
                            subheading:'品质保证',
                            link:'/help/quality'
                        },
                        {
                            subheading:'闪电发货',
                            link:'/help/delivery'
                        },
                        {
                            subheading:'优质服务',
                            link:'/help/bestservice'
                        }
                    ]
                },
                {
                    title:'采购方须知',
                    content:[
                        {
                            subheading:'注册及认证',
                            link:'/help/registercertify'
                        },
                        {
                            subheading:'用户的权利和义务',
                            link:'/help/userrights'
                        },
                        {
                            subheading:'平台规则',
                            link:'/help/platformrules'
                        },
                        {
                            subheading:'服务条款',
                            link:'/help/termsofservice'
                        }
                    ]
                },
                {
                    title:'售后服务',
                    content:[
                        {
                            subheading:'服务承诺',
                            link:'/help/pledge'
                        },
                        {
                            subheading:'退货条款',
                            link:'/help/pledge'
                        },
                        {
                            subheading:'退换货流程',
                            link:'/help/returnprocess'
                        },
                        {
                            subheading:'发票制度',
                            link:'/help/invoice'
                        },
                        {
                            subheading:'常见问题',
                            link:'/help/problem'
                        }
                    ]
                },
                {
                    title:'关于我们',
                    content:[
                        {
                            subheading:'我们是谁',
                            link:'/help/weare'
                        },
                        {
                            subheading:'联系我们',
                            link:'/help/contactus'
                        }
                    ]
                }
            ]
        }
    },
    mounted(){
        let date = new Date,
            year = date.getFullYear(); 
        this.footerInfo = `©${year} 杭州安厨电子商务有限公司 版权所有 浙ICP备13026319号-1`;
    },
    methods:{
        kefu(){
            ysf.open();
        },    
    }

    

}

</script>
<style scoped>
    .index-footer{
        font-size:14px;
        background:#fff;
        overflow: hidden;        
    }
    .footerImg{
        height: 50px;
        background:#fff;
        background-size: 50%;
        padding: 20px 0;
        text-align: center;
        width: 1200px;
        margin: 0 auto;
        border-bottom: 1px solid #efefef;
    }
    .footerImg img{
        display: inline-block;
        height: 100%;
        width: auto;

    }
    .footerLink{
        width: 1200px;
        margin: 0 auto;
        overflow: hidden;
        padding: 30px 0;
    }
    .footerLink dl{
        width: 20%;
    }
    .index-footer-logo{
        float: left;
    }
    .index-footer-logo dt{
        margin-top: 10px;
        color: #009e4d;
    }
    .index-footer-logo dt p{
        display: inline-block;
        border: 2px solid #009e4d;
        padding: 6px 10px;
    }
    .index-footer-logo dt p span{
        margin-left: 6px;
    }
    .index-footer-logo dd:nth-child(1){
        color: #8a8a8a;
        line-height: 30px;
        font-size: 18px;
    }
    .index-footer-logo dd:nth-child(2){
        color: #8a8a8a;
    }
    .index-footer-link{
        float: left;
    }
    .index-footer-link dt{
        line-height: 22px;
        font-weight: 900;
        font-size: 14px;
    }
    .index-footer-link dd{
        font-size: 12px;
        line-height: 24px;
        cursor: pointer;
    }
    .footerInfo{
        text-align:center;
        border-top: 1px solid #efefef;
        clear: both;
        line-height: 60px;
    }
</style>