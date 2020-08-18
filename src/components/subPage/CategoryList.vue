<template>
  <div class="channels_box">
    <el-row style="width: 100%;padding: 10px 10px 10px 20px;background-color: #ececec">
      <el-button type="primary"  @click="toAdd()" icon="el-icon-edit-outline">新增分类</el-button>
      <span style="margin-left:20px;">所属店铺:</span>
      <el-select v-model="storeId" placeholder="请选所属店铺" style="margin-left:10px;margin-bottom: 10px;">
            <!-- <el-option label="所有" value=-1 ></el-option> -->
            <el-option v-for="(item,index) in shopList" :key="index" 
            :label="item.storeName" :value="item.id"></el-option>
      </el-select>
      <el-button @click=toSearch() style="margin-left:20px;" icon="el-icon-search" circle></el-button>
    </el-row>
    <el-table
      :data="tableData"
      stripe
      style="width: 100%;padding: 20px">
      <el-table-column
        prop="id"
        label="分类编号">
      </el-table-column>
      <el-table-column
        prop="name"
        label="系列">
      </el-table-column>
      <el-table-column
        prop="sortOrder"
        label="订单排名">
      </el-table-column>
      <el-table-column
        prop="status"
        label="上下架">
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
      
     
    </el-table>
  </div>

</template>

<script>
  import apis from '../../env/apis.js'
  import axios from '../../env/axios.js'
  export default {
    name: 'CateGoryList',
    data() {
      return {
        tableData: [],
        shopList: [],
        storeId: '',
      }
    },
    created(){
      
    },
    mounted(){
      this.getShopListFS()
    },
    methods: {
      toSearch(){
        this.getTableListFS()
      },
      getShopListFS(){
        const storeUrl = apis.getStoreByUser;
        // storeId
        axios.get(storeUrl).then(res => {
          if (res.data && res.data.code === 100000) {
            this.shopList = res.data.data;
            if (this.shopList && this.shopList.length) {
              this.storeId = this.shopList[0].id;
            }
            this.getTableListFS()
          }
        });
      },
      getTableListFS(){
          let url = apis.getCategoryListFS
          let pram = {}
          if(this.storeId!=''){
            pram.storeId = this.storeId
          }
          axios({
            method: 'get',
            url,
            params: {
              ...pram,
            }
          }).then(res =>{
             console.log(res)
              this.tableData = this.getListData(res.data.data)
              this.totalnum = res.data.total
          }).catch(err =>{
            console.log(err)
          })
      },
      getListData(val){
          var list = []
          for(var i=0;i<val.length;i++){
             if(val[i].status==1){
               val[i].status = "上架"
             }else{
               val[i].status = "下架"
             }
             list.push(val[i])
          }
          return list
      },
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
        this.pagesize = val
        this.getTableListFS()
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        this.currentpage = val
        this.getTableListFS()
      },
    }
  }
</script>

<style scoped>
  .channels_box {
    width: 100%;
    height: 100%;
    position: relative;
  }

  .pagination {
    text-align: center;
    position: fixed;
    bottom: 0;
    left: 300px;
    right: 0;
    margin: auto;
    padding: 20px;
  }
</style>
