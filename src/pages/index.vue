<template>
  <div class="home_box">
    <el-container style="height: 100%;background: #F1F1F1;">
      <el-aside style="border: 0px solid #eee;background: #202D40;width:250px;" class="left_slide">
        <div class="ls_title">
          <p
            style="font-size: 20px;color: #fff;font-weight: bold;line-height: 60px;text-align: center;"
          >Ecup店员微助手</p>
          <el-menu
            default-active="1"
            @open="handleOpen"
            @close="handleClose"
            @select="handselect"
            background-color="#202D40"
            text-color="#fff"
            style="border:none"
          >
            <template v-for="(item, index) in menuData">
              <el-submenu :index="`${index+1}`" :key="item.path+item.name" v-if="item.children && item.children.length">
                <template slot="title">
                  <i :class="item.icon" v-if="item.icon"></i>
                  <img
                    v-else
                    src="../assets/images/messageView.svg"
                    alt
                    style="width: 20px;margin-right: 10px;"
                  />
                  <span slot="title">{{item.name}}</span>
                </template>
                <template v-for="(temp, ind) in item.children">
                  <el-menu-item
                    @click="changeTitle(`${item.name},${temp.name}`, temp.path || temp.href)"
                    :index="`${index+1}-${ind+1}`"
                    v-if="temp.isShow"
                    :key="temp.path+temp.name"
                  >{{temp.name}}</el-menu-item>
                </template>
              </el-submenu>
              <template v-else>
                <el-menu-item
                @click="changeTitle(`${item.name}`, item.path || item.href)"
                :index="`${index+1}-${item.path}`"
                v-if="item.isShow"
                :key="item.path+item.name"
              >
                <i :class="item.icon" v-if="item.icon"></i>
                <img
                  v-else
                  src="../assets/images/messageView.svg"
                  alt
                  style="width: 20px;margin-right: 10px;"
                />
                <span slot="title">{{item.name}}</span>
              </el-menu-item>
              </template>
            </template>
          </el-menu>
        </div>
      </el-aside>

      <el-container>
        <el-header style="background: rgb(32, 45, 64);border-bottom: 1px solid #eee;">
          <el-breadcrumb separator-class="el-icon-arrow-right" class="mianbaoxie">
            <el-breadcrumb-item>首页</el-breadcrumb-item>
            <el-breadcrumb-item v-for="(item,index) in currentPageTitle" :key="index">{{item}}</el-breadcrumb-item>
          </el-breadcrumb>
          <div class="logout">
            <img @click="tologout()" src="../assets/images/logout.svg" alt />
          </div>
        </el-header>

        <el-main style="background-color: #fff;padding: 0;margin-bottom: 70px">
          <div style="width: 100%;height: 100%;" class="welcome" v-if="!currentPageIndex">
            <div>
              <img src="../assets/images/welcome.png" alt="">
            </div>
          </div>
          <user-Info v-if="currentPageIndex === '/admin/user'"></user-Info>
          <role v-if="currentPageIndex === '/admin/role'"></role>
          <menu-manage v-if="currentPageIndex === '/admin/menu'"></menu-manage>
          <order-list v-if="currentPageIndex === '/order/list'"></order-list>
          <goods-list v-if="currentPageIndex === '/goodsList'"></goods-list>
          <shop-list v-if="currentPageIndex === '/shopList'"></shop-list>
          <sku-type-list v-if="currentPageIndex === '/sku/skuType'"></sku-type-list>
          <sku-des-list v-if="currentPageIndex === '/sku/detail'"></sku-des-list>
          <activity-list v-if="currentPageIndex === '/active'"></activity-list>
          <category-list v-if="currentPageIndex === '/category'"></category-list>
          <home-rotation v-if="currentPageIndex === '/carousel'"></home-rotation>
          <coupon v-if="currentPageIndex === '/coupon'"></coupon>
          <experience v-if="currentPageIndex === '/experience'"></experience>
          <shop-storage v-if="currentPageIndex === '/shopStorage'"></shop-storage>
          <printer-manage v-if="currentPageIndex === '/asset/print'"></printer-manage>
          <user-list v-if="currentPageIndex === '/userList'"></user-list>
          <company-list v-if="currentPageIndex === '/preferentialCompany'"></company-list>
          <recommend-statistics v-if="currentPageIndex === '/recommend'"></recommend-statistics>
          <business-statistics v-if="currentPageIndex === '/turnoverForms'"></business-statistics>
          <order-statistics v-if="currentPageIndex === '/orderForms'"></order-statistics>
          <!-- <Recharge v-if="!currentPageIndex" /> -->
          <FreePayUser  v-if="currentPageIndex === '/freeUser'" />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import userInfo from "../components/subPage/UserInfo";
import role from "../components/subPage/Role";
import menuManage from "../components/subPage/Menu";
import orderList from "../components/subPage/OrderList";
import goodsList from "../components/subPage/GoodsList";
import shopList from "../components/subPage/ShopList";
import skuTypeList from "../components/subPage/SKUTypeList";
import skuDesList from "../components/subPage/SKUDesList";
import activityList from "../components/subPage/ActivityList";
import categoryList from "../components/subPage/CategoryList";
import homeRotation from "../components/subPage/HomeRotation";
import coupon from "../components/subPage/Coupon";
import experience from "../components/subPage/Experience";
import shopStorage from "../components/subPage/ShopStorage";
import printerManage from "../components/subPage/PrinterManage";
import userList from "../components/subPage/UserList";
import companyList from "../components/subPage/CompanyList";
import recommendStatistics from "../components/subPage/RecommendStatistics";
import businessStatistics from "../components/subPage/BusinessStatistics";
import orderStatistics from "../components/subPage/OrderStatistics";
import Recharge from "../components/subPage/Recharge";
import FreePayUser from "../components/subPage/FreePayUser";
import routes from "./routeConfig";
import apis from "../env/apis.js";
import axios from "../env/axios.js";
export default {
  name: "Index",
  state: ["userinfo"],
  components: {
    userInfo,
    role,
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
    orderStatistics,
    // Recharge,
    FreePayUser,
  },
  data() {
    return {
      currentPageTitle: ["welcome"],
      currentPageIndex: "",
      menuData: [],
      pathMap: [],
    };
  },
  created() {
    this.getSysMenuTreeByUser();
  },
  methods: {
    async getSysMenuTreeByUser() {
      const url = apis.getSysMenuTreeByUser;
      const res = await axios.get(url);
      if (res && res.data.code === 100000) {
        const menuList = res.data.data;
        this.initTree(menuList);
      }
    },
    initTree(data) {
      const menuDataById = {};
      const menuDataByPath = {};
      const getSourceData = (arr = []) => {
        const sourceData = [];
        arr.forEach(item => {
          const {
            href = null,
            isShow,
            icon = "setting",
            name="",
            id,
            subMenuList = []
          } = item;
          const menuItem = {
            id,
            path: href || `${id}`,
            href,
            icon: icon ? icon : false,
            name,
            isShow: isShow === 1
          };
          if (subMenuList.length) {
            // eslint-disable-next-line no-param-reassign
            menuItem.children = getSourceData(subMenuList);
            menuItem.routes = menuItem.children;
          }
          menuDataById[id] = menuItem;
          menuDataByPath[menuItem.path] = menuItem;
          sourceData.push(menuItem);
        });
        return sourceData;
      };
      const menuDataFromServers = getSourceData([data]);
      let menuDataFromServersChildren = [];
      if (menuDataFromServers[0]) {
        menuDataFromServersChildren = menuDataFromServers[0].children;
      }
      const menuData = this.filterMenuData(menuDataFromServersChildren, routes);
      this.menuData = menuData;
      // const pathArr = this.getShowMenu(menuData);
     //   const pathMap = this.getMapDate(pathArr);
    },
    /**
     * 权限控制
     */
    filterServerAuthority(path, serverAuthority) {
      for (let i = 0; i < serverAuthority.length; i += 1) {
        if (serverAuthority[i].path === path) {
          return true;
        }
        if (serverAuthority[i].children) {
          const res = this.filterServerAuthority(
            path,
            serverAuthority[i].children
          );
          if (res) {
            return true;
          }
        }
      }
      return false;
    },
    getSubMenu(item, serverAuthority) {
      if (
        item.children &&
        !item.hideChildrenInMenu &&
        item.children.some(child => child.name)
      ) {
        return {
          ...item,
          children: this.filterMenuData(item.children, serverAuthority) // eslint-disable-line
        };
      }
      return item;
    },
    filterMenuData(menuData, serverAuthority) {
      if (!menuData) {
        return [];
      }
      return menuData
        .filter(item => item.name && !item.hideInMenu)
        .map(item => {
          let res = true;
          if (serverAuthority) {
            res = this.filterServerAuthority(item.path, serverAuthority);
          }
          // res为true，表示有访问权限，继续遍历子菜单，false则过滤掉
          return res && this.getSubMenu(item, serverAuthority);
        })
        .filter(item => item);
    },
    // 根据菜单最终返回的菜单控制是否展示侧边菜单
    getShowMenu(menuData) {
      let keysArr = [];
      menuData.forEach(item => {
        if (item.path) {
          keysArr.push(item.path);
        }
        if (item.children) {
          keysArr = keysArr.concat(this.getShowMenu(item.children));
        }
      });
      return keysArr;
    },
    getMapDate(pathArr) {
      const pathSet = new Set(pathArr);
      const pathList = Array.from(pathSet);
      const pathMap = pathList.map(item => ({ [item]: true }));
      return pathMap;
    },
    /**
     * 权限控制
     */
    checkLogin() {
      var parm = {};
      axios
        .post(apis.isLogin, parm)
        .then(res => {
          if (res.data.code == 601) {
            this.$router.push({ path: "/login" });
          } else {
            this.$store.commit("userinfo", res.data.data);
            this.showMenu(res.data.data.menuIds);
          }
        })
        .catch(err => {
          this.$message({
            type: "info",
            message: err
          });
        });
    },
    showMenu(val) {
      let list = val.split(",");
      for (let i = 0; i < list.length; i++) {
        let str = "is_" + list[i];
        this.menuRole[str] = true;
      }
    },
    tologout() {
      this.$confirm("是否确认退出登陆?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          var parm = {};
          axios
            .post(apis.tologout, parm)
            .then(res => {
              this.$router.push({ path: "/login" });
            })
            .catch(err => {
              this.$message({
                type: "info",
                message: err
              });
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
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
      this.currentPageTitle = title.split(",");
      this.currentPageIndex = index;
      console.log("index", index);
    },
    saveView() {
      this.getSysView();
    },
    setView() {
      this.setSysView({
        state: {
          base: {
            area: "xxx"
          },
          test: {
            com_test: true
          }
        },
        path: "/"
      });
    }
  },
  updated() {}
};
</script>

<style scoped lang="less">
.home_box {
  width: 100%;
  height: 100%;
}
.welcome {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  div{
    font-family:'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
    font-size: 60px;
    margin-bottom: 50px;
  }
  img {
    width: 458px;
    height: 204.5px;
  }
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
