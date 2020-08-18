<template>
  <div class="channels_box">
    <el-row style="width: 100%;padding: 10px 10px 10px 20px;background-color: #ececec">
      <el-button type="primary"  @click="toAddGoods()" icon="el-icon-edit-outline">新增优惠企业</el-button>
      <span style="margin-left:20px;">公司名称:</span>
      <el-input
        style="display:inline-block;width:200px;"
        placeholder="请输入内容"
        prefix-icon="el-icon-search"
        v-model="company">
      </el-input>
      <el-button @click=toSearch() style="margin-left:20px;" icon="el-icon-search" circle></el-button>
    </el-row>
    <el-table
      :data="tableData"
      stripe
      style="width: 100%;padding: 20px">
      <el-table-column
        prop="id"
        label="id"
        width="180">
      </el-table-column>

      <el-table-column
        prop="companyName"
        label="公司名称">
      </el-table-column>
       <el-table-column
        prop="companyAddress"
        label="公司地址">
      </el-table-column>
      <el-table-column
        prop="companyRatio"
        label="折扣比例">
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
    <!-- <el-pagination
      class="pagination"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentpage"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalnum">
    </el-pagination> -->
    <el-dialog :title="type=='add'?'新增企业':'修改企业'" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="公司名称" :label-width="formLabelWidth">
          <el-input v-model="form.companyName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="公司地址" :label-width="formLabelWidth">
          <el-input type="textarea" v-model="form.companyAdress" ></el-input>
        </el-form-item>
        <el-form-item label="折扣比例" :label-width="formLabelWidth">
          <el-input v-model="form.companyRate" autocomplete="off"></el-input>
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
        type: 'add',
        dialogFormVisible: false,
        form: {
          companyName: '',
          companyAdress: '',
          companyRate: '',
        },
        formLabelWidth: '120px',
        company: ''
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
      toSave(){
        if(this.type=="add"){
          let parm = {
            companyName: this.form.companyName,
            companyAddress: this.form.companyAdress,
            companyRatio: this.form.companyRate,
          }
          let url = apis.addCompany
          axios.post(url,parm).then(res =>{
            if(res.data.code==100000){
              this.$message({
                type:'success',
                message: "添加成功"
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
        }else{
          let skuTypeIds = this.getSkuTypeIds()
          let defaultSkuDetailIds = this.getDefaultSkuDetailIds()
          let cid = this.getCid()
          let parm = {
            title: this.form.productName,
            sellPoint: this.form.pointDesc,
            price: this.form.price.replace('(元)',''),
            cid: cid,
            status: this.form.status=="上架"?1:0,
            skuTypeIds: skuTypeIds,
            defaultSkuDetailIds: defaultSkuDetailIds,
            simpleDesc: this.form.productDesc,
            image: this.form.image,
            posterImage: this.form.image1,
            id: this.form.id
          }
          let url = apis.updateGoods
          axios.post(url,parm).then(res =>{
            if(res.data.code==100000){
              this.$message({
                type:'success',
                message: "修改成功"
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
        }
      },
      toAddGoods(){
        this.type = "add"
        this.dialogFormVisible = true
        this.form = {
          companyName: '',
          companyAdress: '',
          companyRate: '',
        }
        this.fileList = []
      },
      getTableListFS(){
          let pram = {
            //"pageSize":this.pagesize,"pageNum":this.currentpage
          }
          if(this.company!=''){
            pram.companyName = this.company
          }
          let url = apis.getCompanyList
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
        this.$confirm('此操作将永久删除该公司, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            this.toDeleteCompany(row)
        }).catch(() => {
            this.$message({
                type: 'info',
                message: '已取消删除'
            });          
        });
      },
      toDeleteCompany(val){
        let url = apis.toDeleteCompany+"/"+val.id
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
        this.form.productName = row.title
        this.form.pointDesc = row.sellPoint
        this.form.price = row.price
        this.form.productType = this.getProductTypeArry(row.cid)
        this.form.status = row.status
        this.form.skuType = this.getSkuTypeArry(row.skuTypeIds)
        this.form.defaultSku = this.getDefaultSkuArray(row.defaultSkuDetailIds)
        this.form.productDesc = row.simpleDesc
        this.form.image = row.image
        this.form.image1 = row.posterImage
        this.fileList = [{name: row.image, url: row.image}]
        this.fileList1 = [{name: row.posterImage, url: row.posterImage}]
        this.form.id = row.id
        
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
