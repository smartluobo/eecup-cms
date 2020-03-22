<template>
  <div class="channels_box">
    <el-row style="width: 100%;padding: 10px 10px 10px 20px;background-color: #ececec">
      <el-button type="primary"  @click="toAdd()" icon="el-icon-edit-outline">新增店铺</el-button>
    </el-row>
    <el-table
      :data="tableData"
      stripe
      style="width: 100%;padding: 20px">
      <el-table-column
        prop="id"
        label="店铺编号"
        width="180">
      </el-table-column>
      <el-table-column
        prop="storeName"
        label="店铺名称">
      </el-table-column>
      <el-table-column
        prop="storeAddress"
        label="店铺地址">
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
    name: 'UserAdmin',
    data() {
      return {
        searchInput:'',
        tableData: [],
        totalnum: 0,
        currentpage: 1,
        pagesize: 10,
        month:''
      }
    },
    created(){
      
    },
    mounted(){
      this.getTableListFS()
    },
    methods: {
      getTableListFS(){
          let url = `${apis.getShopListFS}/-1`
          axios.get(url).then(res =>{
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
             val[i].orderPayment = val[i].orderPayment+"(元)"
             val[i].goodsTotalCount = val[i].goodsTotalCount+"(份)"
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
