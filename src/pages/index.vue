<template>
    <div class="home_box">
    <el-container style="height: 100%;background: #F1F1F1;">

      <el-aside style="border: 0px solid #eee;background: #202D40;width:250px;" class="left_slide">
        <div class="ls_title">
          <p style="font-size: 20px;color: #fff;font-weight: bold;line-height: 60px;text-align: center;">
            Ecup店员微助手
          </p>

          <el-menu
            default-active="1"
            @open="handleOpen"
            @close="handleClose"
            @select="handselect"
            background-color="#202D40"
            text-color="#fff"
            style="border:none"
          >
            <el-submenu v-if="menuRole.is_1" index="1">
              <template slot="title">
                <img src="../assets/images/messageView.svg" alt="" style="width: 20px;margin-right: 10px;">
                <span slot="title">admin权限</span>
              </template>
              <el-menu-item index="1-1" @click="changeTitle('admin权限,用户管理','1-1')">用户管理</el-menu-item>
              <!-- <el-menu-item  index="1-2" @click="changeTitle('admin权限,菜单管理','1-2')">菜单管理</el-menu-item> -->
            </el-submenu>
            <el-menu-item v-if="menuRole.is_2" @click="changeTitle('订单列表','2')" index="2">
              <img src="../assets/images/messageView.svg" alt="" style="width: 20px;margin-right: 10px;">
              <span slot="title">订单列表</span>
            </el-menu-item>
            <el-menu-item v-if="menuRole.is_3" @click="changeTitle('商品列表','3')" index="3">
              <img src="../assets/images/finger.svg" alt="" style="width: 20px;margin-right: 10px;">
              <span slot="title">商品列表</span>
            </el-menu-item>
            <el-menu-item v-if="menuRole.is_4" @click="changeTitle('店铺列表','4')" index="4">
              <img src="../assets/images/finger.svg" alt="" style="width: 20px;margin-right: 10px;">
              <span slot="title">店铺列表</span>
            </el-menu-item>
            <el-submenu v-if="menuRole.is_5" index="5">
              <template slot="title">
                <img src="../assets/images/messageView.svg" alt="" style="width: 20px;margin-right: 10px;">
                <span slot="title">sku管理</span>
              </template>
              <el-menu-item index="5-1" @click="changeTitle('sku管理,sku类型列表','5-1')">sku类型列表</el-menu-item>
              <el-menu-item  index="5-2" @click="changeTitle('sku管理,sku明显列表','5-2')">sku明细列表</el-menu-item>
            </el-submenu>
            <el-menu-item v-if="menuRole.is_6" @click="changeTitle('活动管理','6')" index="6">
              <img src="../assets/images/money.svg" alt="" style="width: 20px;margin-right: 10px;">
              <span slot="title">活动管理</span>
            </el-menu-item>
            <el-menu-item v-if="menuRole.is_7" @click="changeTitle('分类列表','7')" index="7">
              <img src="../assets/images/money.svg" alt="" style="width: 20px;margin-right: 10px;">
              <span slot="title">分类列表</span>
            </el-menu-item>
            <el-menu-item v-if="menuRole.is_8" @click="changeTitle('首页轮播配置','8')" index="8">
              <img src="../assets/images/money.svg" alt="" style="width: 20px;margin-right: 10px;">
              <span slot="title">首页轮播配置</span>
            </el-menu-item>
            <el-submenu v-if="menuRole.is_9" index="9">
              <template slot="title">
                <img src="../assets/images/money.svg" alt="" style="width: 20px;margin-right: 10px;">
                <span slot="title">优惠券</span>
              </template>
              <el-menu-item index="9-1" @click="changeTitle('优惠券,优惠券管理','9-1')">优惠券管理</el-menu-item>
              <el-menu-item index="9-2" @click="changeTitle('优惠券,体验券管理','9-2')">体验券管理</el-menu-item>
            </el-submenu>
            <el-menu-item v-if="menuRole.is_10" @click="changeTitle('店铺库存管理','10')" index="10">
              <img src="../assets/images/money.svg" alt="" style="width: 20px;margin-right: 10px;">
              <span slot="title">店铺库存管理</span>
            </el-menu-item>
            <el-submenu v-if="menuRole.is_11" index="11">
              <template slot="title">
                <img src="../assets/images/messageView.svg" alt="" style="width: 20px;margin-right: 10px;">
                <span slot="title">资产管理</span>
              </template>
              <el-menu-item index="11-1" @click="changeTitle('资产管理,打印机管理','11-1')">打印机管理</el-menu-item>
            </el-submenu>
            <el-menu-item v-if="menuRole.is_12" @click="changeTitle('用户列表','12')" index="12">
              <img src="../assets/images/money.svg" alt="" style="width: 20px;margin-right: 10px;">
              <span slot="title">用户列表</span>
            </el-menu-item>
            <el-menu-item v-if="menuRole.is_13" @click="changeTitle('优惠企业列表','13')" index="13">
              <img src="../assets/images/money.svg" alt="" style="width: 20px;margin-right: 10px;">
              <span slot="title">优惠企业列表</span>
            </el-menu-item>
            <el-menu-item v-if="menuRole.is_14" @click="changeTitle('优惠企业列表','14')" index="14">
              <img src="../assets/images/money.svg" alt="" style="width: 20px;margin-right: 10px;">
              <span slot="title">推荐管理</span>
            </el-menu-item>
            <el-submenu v-if="menuRole.is_15" index="15">
              <template slot="title">
                <img src="../assets/images/messageView.svg" alt="" style="width: 20px;margin-right: 10px;">
                <span slot="title">统计报表</span>
              </template>
              <el-menu-item index="15-1" @click="changeTitle('统计报表,营业额统计','15-1')">营业额统计</el-menu-item>
              <el-menu-item index="15-2" @click="changeTitle('统计报表,订单统计','15-2')">订单统计</el-menu-item>
            </el-submenu>
            
          </el-menu>

        </div>
      </el-aside>

      <el-container>
        <el-header style="background: rgb(32, 45, 64);border-bottom: 1px solid #eee;">
          <el-breadcrumb separator-class="el-icon-arrow-right" class="mianbaoxie">
            <el-breadcrumb-item>首页</el-breadcrumb-item>
            <el-breadcrumb-item v-for="(item,index) in currentPageTitle" :key="index">{{item}}</el-breadcrumb-item>
          </el-breadcrumb>
          <div class="logout"><img @click="tologout()" src="../assets/images/logout.svg" alt=""></div>
        </el-header>

        <el-main style="background-color: #fff;padding: 0;margin-bottom: 70px">
          <user-admin v-if="currentPageIndex === '1-1'"></user-admin>
          <!-- <menu-manage v-if="currentPageIndex === '1-2'"></menu-manage> -->
          <business-finger v-if="currentPageIndex === '1-3'"></business-finger>
          <order-list v-if="currentPageIndex === '2'"></order-list>
          <goods-list v-if="currentPageIndex === '3'"></goods-list>
          <shop-list v-if="currentPageIndex === '4'"></shop-list>
          <sku-type-list v-if="currentPageIndex === '5-1'"></sku-type-list>
          <sku-des-list v-if="currentPageIndex === '5-2'"></sku-des-list>
          <activity-list v-if="currentPageIndex === '6'"></activity-list>
          <category-list v-if="currentPageIndex === '7'"></category-list>
          <home-rotation v-if="currentPageIndex === '8'"></home-rotation>
          <coupon v-if="currentPageIndex === '9-1'"></coupon>
          <experience v-if="currentPageIndex === '9-2'"></experience>
          <shop-storage v-if="currentPageIndex === '10'"></shop-storage>
          <printer-manage v-if="currentPageIndex === '11-1'"></printer-manage>
          <user-list v-if="currentPageIndex === '12'"></user-list>
          <company-list v-if="currentPageIndex === '13'"></company-list>
          <recommend-statistics v-if="currentPageIndex === '14'"></recommend-statistics>
          <business-statistics v-if="currentPageIndex === '15-1'"></business-statistics>
          <order-statistics v-if="currentPageIndex === '15-2'"></order-statistics>
        </el-main>

      </el-container>
    </el-container>
  </div>
</template>

<script>
import userAdmin from '../components/subPage/UserAdmin'
import menuManage from '../components/subPage/MenuManage'
import orderList from '../components/subPage/OrderList'
import goodsList from '../components/subPage/GoodsList'
import shopList from '../components/subPage/ShopList'
import skuTypeList from '../components/subPage/SKUTypeList'
import skuDesList from '../components/subPage/SKUDesList'
import activityList from '../components/subPage/ActivityList'
import categoryList from '../components/subPage/CategoryList'
import homeRotation from '../components/subPage/HomeRotation'
import coupon from '../components/subPage/Coupon'
import experience from '../components/subPage/Experience'
import shopStorage from '../components/subPage/ShopStorage'
import printerManage from '../components/subPage/PrinterManage'
import userList from '../components/subPage/UserList'
import companyList from '../components/subPage/CompanyList'
import recommendStatistics from '../components/subPage/RecommendStatistics'
import businessStatistics from '../components/subPage/BusinessStatistics'
import orderStatistics from '../components/subPage/OrderStatistics'
import apis from '../env/apis.js'
import axios from '../env/axios.js'
export default {
    state:[
      'userinfo'
    ],
    components: {
      userAdmin,
      menuManage,
      orderList,
      goodsList,
      shopList,
      skuTypeList,
      skuDesList,
      activityList,
      categoryList,
      homeRotation,
      coupon,
      experience,
      shopStorage,
      printerManage,
      userList,
      companyList,
      recommendStatistics,
      businessStatistics,
      orderStatistics
    },
    data () {
        return {
            currentPageTitle: ['订单列表'],
            currentPageIndex: '2',
            menuRole: {
              is_1: false,
              is_2: false,
              is_3: false,
              is_4: false,
              is_5: false,
              is_6: false,
              is_7: false,
              is_8: false,
              is_9: false,
              is_10: false,
              is_11: false,
              is_12: true,
              is_13: true,
              is_14: true,
              is_15: true,
            },

        }
    },
    created () {
      this.checkLogin()
    },
    methods : {
        checkLogin(){
          var parm = {}
          axios.post(apis.isLogin,parm).then(res =>{
            if(res.data.code==601){
                this.$router.push({path:'/login'});
            }else{
                this.$store.commit("userinfo", res.data.data)
                this.showMenu(res.data.data.menuIds)
            }
          }).catch(err => {
              this.$message({
                type: 'info',
                message: err
              });
          })
        },
        showMenu(val){
          let list = val.split(',')
          for(let i=0;i<list.length;i++){
            let str = 'is_'+list[i]
            this.menuRole[str] = true
          }
        },
        tologout(){
            this.$confirm('是否确认退出登陆?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).then(() => {
              var parm = {}
              axios.post(apis.tologout,parm).then(res =>{
                  this.$router.push({path:'/login'});
              }).catch(err => {
                  this.$message({
                  type: 'info',
                  message: err
                  });
              })
            }).catch(() => {
            this.$message({
                type: 'info',
                message: '已取消'
            });
            });

        },
        handleOpen(key, keyPath) {
            console.log(key, keyPath);
        },
        handleClose(key, keyPath) {
            console.log(key, keyPath);
        },
        handselect(key, keyPath) {
            console.log(key, keyPath);
        },
        changeTitle(title, index) {
            this.currentPageTitle = title.split(',');
            this.currentPageIndex = index;
        },
        saveView () {
            this.getSysView();
        },
        setView () {
            this.setSysView( {
                state : {
                    base : {
                        area : "xxx"
                    },
                    test : {
                        com_test : true,
                    }
                },
                path : '/',
            } );
        }
    },
    updated () {
    },
    
}
</script>

<style scoped lang="less">
  .home_box {
    width: 100%;
    height: 100%;
  }

  .logout {
    width: 60px;
    float: right;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    img {
      width: 24px;
    }
  }

  .el-menu-item.is-active {
    color: #fff;
    background-color: #394659 !important;
  }

  .mianbaoxie {
    width: 60%;
    float: left;
    height: 100%;
    line-height: 60px;
  }

</style>
