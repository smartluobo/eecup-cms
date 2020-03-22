<template>
  <div class="channels_box">
    <el-row style="width: 100%;padding: 10px 10px 10px 20px;background-color: #ececec">
      <el-button type="primary"  @click="toAdd()" icon="el-icon-edit-outline">新增分类</el-button>
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
      }
    },
    created(){
      
    },
    mounted(){
      this.getTableListFS()
    },
    methods: {
      getTableListFS(){
          let url = apis.getCategoryListFS
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
