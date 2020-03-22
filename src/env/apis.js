import vue from 'vue';
import config from './config'
var requestUrl = config.isDevEnv?config.devUrl:config.onlineUrl

const apis = {
    baseUrl: requestUrl,
    loginF: requestUrl + 'tea/cms/login/login',
    isLogin: requestUrl + 'tea/cms/login/isLogin',
    tologout: requestUrl + 'tea/cms/login/loginOut',
    getUserListFS: requestUrl+'tea/cms/user/list',
    addUser: requestUrl+'tea/cms/user/add',
    deleteUser: requestUrl+'tea/cms/user/delete',
    updateUser: requestUrl+'tea/cms/user/update',
    getMenuListFS: requestUrl + 'tea/cms/menu/list',
    getGoodListFS: requestUrl + 'tea/cms/goods/list',
    addGoods: requestUrl + 'tea/cms/goods/add',
    deleteGoods: requestUrl + 'tea/cms/goods/delete',
    updateGoods: requestUrl + 'tea/cms/goods/update',
    getOrderListFS: requestUrl+'tea/cms/order/orderList/',
    updateOrderStatus: requestUrl + 'tea/cms/order/updateOrder/',
    getOrderDetail: requestUrl + 'tea/cms/order/findOrderDetail',
    toPrintingOrder: requestUrl + 'tea/cms/order/orderPrint',
    toPrintingDesc: requestUrl + 'tea/cms/order/orderItemPrint',
    getShopListFS: requestUrl+'tea/cms/store/list',
    getSKUTypeList: requestUrl+'tea/cms/skuType/list',
    getSKUDesList: requestUrl+'tea/cms/skuDetail/list',
    getActivityListFS: requestUrl+'tea/cms/activity/list',
    addActivity: requestUrl+'tea/cms/activity/add',
    updateActivity: requestUrl+'tea/cms/activity/update',
    deleteActivity: requestUrl+'tea/cms/activity/delete',
    getCouponsListByActivityFS: requestUrl+'tea/cms/activity/couponsList',
    addActivityCoupons: requestUrl+'tea/cms/activity/addCoupons',
    deleteActivityCoupons: requestUrl+'tea/cms/activity/deleteCoupons',
    getCategoryListFS: requestUrl+'tea/cms/category/list',
    getHomeRotationFS: requestUrl+'tea/cms/carousel/list',
    addHomeRotatio: requestUrl+'tea/cms/carousel/add',
    deleteHomeRotation: requestUrl+'tea/cms/carousel/delete',
    getCouponFS: requestUrl+'tea/cms/coupons/list',
    addCoupon: requestUrl + 'tea/cms/coupons/add',
    deleteCoupon: requestUrl + 'tea/cms/coupons/delete',
    updateCoupon: requestUrl+'tea/cms/coupons/update',
    getShopStorageListFS: requestUrl + 'tea/cms/inventory/list',
    initStorage: requestUrl + 'tea/cms/inventory/init',
    deleteStorage: requestUrl + 'tea/cms/inventory/delete',
    addStorage: requestUrl + 'tea/cms/inventory/add',
    updateStorage: requestUrl + 'tea/cms/inventory/update',
    clearStorage: requestUrl + 'tea/cms/inventory/clear',
    getPrinterListFS: requestUrl + 'tea/cms/printer/list',
    addPrinter: requestUrl + 'tea/cms/printer/add',
    deletePrinter: requestUrl + 'tea/cms/printer/delete',
    updatePrinter: requestUrl + 'tea/cms/printer/update',
    getUserList: requestUrl + 'tea/cms/user/apiUser/list',
    bandUserToCompany: requestUrl + 'tea/cms/user/apiUser/bindCompany',
    getCompanyList: requestUrl + 'tea/cms/company/list',
    addCompany: requestUrl + 'tea/cms/company/add',
    toDeleteCompany: requestUrl + 'tea/cms/company/delete',
    getExperienceList: requestUrl + 'tea/cms/coupons/experienceList',
    updateExperience: requestUrl + 'tea/cms/coupons/updateExperience',
    turnoverStatistical: requestUrl + 'tea/cms/order/turnoverStatistical',
    orderStatistical: requestUrl + 'tea/cms/order/orderStatistical',
    getRecommendGoods: requestUrl + 'tea/cms/recommend/list',
    addRecommendGoods: requestUrl + 'tea/cms/recommend/add',
    deleteRecommendGoods: requestUrl + 'tea/cms/recommend/delete'

}

const mixinObj = {
    data () {
        return {
            apis,
        }
    }
}

vue.mixin( mixinObj );

export default apis;
