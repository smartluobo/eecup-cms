<template>
  <div class="channels_box">
    <el-row style="width: 100%;padding: 10px 10px 10px 20px;background-color: #ececec">
      <span style="margin-left:20px;">电话号码:</span>
      <el-input
        style="display:inline-block;width:200px;"
        placeholder="请输入内容"
        prefix-icon="el-icon-search"
        v-model="phoneNum">
      </el-input>
      <span style="margin-left:20px;">所属公司:</span>
      <el-select v-model="selectedCompany" placeholder="请选公司">
            <el-option label="所有" value=''></el-option>
            <el-option v-for="(item,index) in companyList" :key="index" 
            :label="item.companyName" :value="item.id"></el-option>
      </el-select>
      <el-button @click=toSearch() style="margin-left:20px;" icon="el-icon-search" circle></el-button>
    </el-row>
    <el-table
      :data="tableData"
      stripe
      style="width: 100%;padding: 20px">
      <el-table-column
        prop="nickName"
        label="昵称"
        width="180">
      </el-table-column>
      <el-table-column
        prop="storeName"
        label="店铺名称">
      </el-table-column>
      <el-table-column
        prop="userBindPhoneNum"
        label="电话号码">
      </el-table-column>
       <el-table-column
        prop="oppenId"
        label="oppenid">
      </el-table-column>
      <el-table-column
        prop="companyName"
        label="公司名称">
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleEdit(scope.$index, scope.row)">绑定企业</el-button>
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
    <el-dialog title="绑定企业" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="所属公司" :label-width="formLabelWidth">
          <el-select v-model="form.company" placeholder="请选择企业">
            <el-option v-for="(item,index) in companyList" :key="index" 
            :label="item.companyName" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="toSave()">确 定</el-button>
      </div>
    </el-dialog>
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
        phoneNum: '',
        dialogFormVisible: false,
        formLabelWidth: '120px',
        form: {
          company: '',
          id: ''
        },
        companyList: [],
        selectedCompany: ""
      }
    },
    created(){
      this.getCompanyListFS()
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
      toSave(){
          let parm = {
            userId: this.form.id,
            companyId: this.form.company,
          }
          let url = apis.bandUserToCompany
          axios.post(url,parm).then(res =>{
            if(res.data.code==100000){
              this.$message({
                type:'success',
                message: "绑定成功"
              })
              this.dialogFormVisible = false
              this.getTableListFS()
            }else{
              this.$message({
                  type: 'info',
                  message: res.data.msg
              });
            }
            
          }).catch(err =>{
            console.log(err)
          })
        
      },
      
      getCompanyListFS(){
          let url = apis.getCompanyList
          axios.get(url).then(res =>{
             this.companyList = res.data.data
          }).catch(err =>{
            console.log(err)
          })
      },
      getTableListFS(){
          let pram = {
            "pageSize":this.pagesize,"pageNum":this.currentpage
          }
          if(this.phoneNum!=''){
            pram.userPhone = this.phoneNum
          }
          if(this.selectedCompany!=""){
            pram.companyId = this.selectedCompany
          }
          let url = apis.getUserList
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
      handleDelete(index, row){
        this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            this.toDeleteGoods(row)
        }).catch(() => {
            this.$message({
                type: 'info',
                message: '已取消删除'
            });          
        });
      },
      toDeleteGoods(val){
        let url = apis.deleteGoods+"/"+val.id
        axios.get(url).then(res =>{
          if(res.data.code==100000){
            this.$message({
              type:'success',
              message: "删除成功"
            })
            this.dialogFormVisible = false
            this.getTableListFS()
          }else{
            this.$message({
                type: 'info',
                message: res.data.msg
            });
          }
          
        }).catch(err =>{
          console.log(err)
        })
      },
      handleEdit(index, row) {
        
        this.type = "update"
        this.dialogFormVisible = true
        this.form.id = row.id
        
      },
      getDefaultSkuArray(str){
        let list = []
        let arr = str.split(',')
        for(let i=0;i<arr.length;i++){
          let id = arr[i]
          for(let j=0;j<this.defaultSkuList.length;j++){
            if(id==this.defaultSkuList[j].id){
              list.push(this.defaultSkuList[j].cmsView)
            }
          }
        }
        
        return list
      },
      getSkuTypeArry(str){
        this.defaultSkuList = []
        let list = []
        let arr = str.split(',')
        for(let i=0;i<str.length;i++){
          let id = str[i]
          for(let j=0;j<this.skuTypeList.length;j++){
            if(id==this.skuTypeList[j].id){
              list.push(this.skuTypeList[j].remark)
              let l = this.skuTypeList[j].skuDetails
              for(let k=0;k<l.length;k++){
                this.defaultSkuList.push(l[k])
              }
            }
          }
        }
        return list
      },
      getProductTypeArry(id){
        let str = ''
        for(let i=0;i<this.productTypeList.length;i++){
          if(id == this.productTypeList[i].id){
            str = this.productTypeList[i].name
          }
        }
        return str
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
