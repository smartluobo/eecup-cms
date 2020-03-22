<template>
  <div class="channels_box">
    <el-row style="width: 100%;padding: 10px 10px 10px 20px;background-color: #ececec">
      <span style="margin-left:20px;">体验码:</span>
      <el-input
        style="display:inline-block;width:200px;"
        placeholder="请输入内容"
        prefix-icon="el-icon-search"
        v-model="couponsCode">
      </el-input>
      <el-button @click=toSearch() style="margin-left:20px;" icon="el-icon-search" circle></el-button>
    </el-row>
    <el-table
      :data="tableData"
      stripe
      style="width: 100%;padding: 20px">
      <el-table-column
        prop="oppenId"
        label="用户标识"
        width="180">
      </el-table-column>

      <el-table-column
        prop="couponsCode"
        label="券码">
      </el-table-column>
       <el-table-column
        prop="createTimeStr"
        label="领取时间">
      </el-table-column>
      <el-table-column
        prop="status"
        label="使用状态">
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-button v-if="scope.row.status=='未使用'"
            size="mini"
            @click="handleEdit(scope.$index, scope.row)">使用</el-button>
            <el-button v-if="scope.row.status=='已使用'"
            size="mini"
            @click="handleEdit(scope.$index, scope.row)">取消使用</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="pagination"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentpage"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalnum">
    </el-pagination>
    
  </div>
</template>

<script>
  import apis from '../../env/apis.js'
  import axios from '../../env/axios.js'
  export default {
    name: 'GoodList',
    data() {
      return {
        tableData: [],
        totalnum: 0,
        currentpage: 1,
        pagesize: 10,

        couponsCode: '',
       
        companyList: [],
        selectedCompany: ""
      }
    },
    created(){
    },
    mounted(){
      this.getTableListFS()
    },
    watch:{
      
    },
    methods: {
      toSearch(){
        this.getTableListFS()
      },
      getTableListFS(){
          let pram = {
            "pageSize":this.pagesize,"pageNum":this.currentpage
          }
          if(this.couponsCode!=''){
            pram.couponsCode = this.couponsCode
          }
          if(this.selectedCompany!=""){
            pram.companyId = this.selectedCompany
          }
          let url = apis.getExperienceList
          axios.post(url,pram).then(res =>{
              this.tableData = this.getListData(res.data.data)
              this.totalnum = res.data.total
          }).catch(err =>{
            console.log(err)
          })
      },
      getListData(val){
          var list = []
          for(var i=0;i<val.length;i++){
            if(val[i].status==0){
              val[i].status = "未使用"
            }
            if(val[i].status==1){
              val[i].status = "锁定中"
            }
            if(val[i].status==2){
              val[i].status = "已使用"
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
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handleSuccess(file) {
        this.form.image = file
      },
      handleSuccess1(file) {
        this.form.image1 = file
      },
      
      
      handleEdit(index, row) {
        
        let status = 0
        if(row.status == '未使用'){
          status = 2
        }else if(row.status=='锁定中'){
          status = 1
        }else if(row.status = '已使用'){
          status = 0
        }
        
       let url = `${apis.updateExperience}/${row.id}/${status}`
        axios.get(url).then(res =>{
            this.getTableListFS()
        }).catch(err =>{
          console.log(err)
        })
        
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
