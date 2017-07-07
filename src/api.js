const apiPre = process.env.NODE_ENV === 'production' 
                ? '/api.php' 
                : '/local.php'

// const imgPrefix = process.env.NODE_ENV === 'production' 
//                 ? '' 
//                 : 'http://dev.anchumall.cc:9550'

const Api = {

    // 图片前缀 开发中使用
    // imgPre: imgPrefix,

    // 页面 api
    login:{
        login:`${apiPre}?s=api/User/do_login`,
        is_login:`${apiPre}?s=api/User/is_login`
    },
    register:{
        send_validate_code:`${apiPre}?s=api/Api/send_validate_code`,
        reg:`${apiPre}?s=api/User/reg`
    },
    home:{
        getFeatureSite:`${apiPre}?s=api/site/getFeatureSite`,
        getAdList:`${apiPre}?s=api/ad/getAdList`,
        getlevel1:`${apiPre}?s=api/category/getlevel1`
    },
    batch:{
        importOrders:`${apiPre}?s=api/ImportOrders/importOrders`,
        getFailExcel:`${apiPre}?s=api/ImportOrders/getFailExcel`,
        exportGoodsList:`${apiPre}?s=api/ExportExcel/exportGoodsList`,
        exportOrderTem:`${apiPre}?s=api/ExportExcel/exportOrderTem`
    },
    batchList:{
        getOrdersInfo:`${apiPre}?s=api/ImportOrders/getOrdersInfo`,
        getCartBatchs:`${apiPre}?s=api/CartBatch/getCartBatchs`,
        remove:`${apiPre}?s=api/CartBatch/remove`,
        getregion:`${apiPre}?s=api/address/getregion`,
        update:`${apiPre}?s=api/CartBatch/update`,
        updateRegion:`${apiPre}?s=api/CartBatch/updateRegion`,
    },
    batchOrder:{
        create:`${apiPre}?s=api/CartBatch/create`,
    },
    goodsDetails:{
        getlist:`${apiPre}?s=api/address/getlist`,
        getregion:`${apiPre}?s=api/address/getregion`,
    },
    subStation:{
         getlist:`${apiPre}?s=api/site/getlist`,
    }

    

}

export default Api;