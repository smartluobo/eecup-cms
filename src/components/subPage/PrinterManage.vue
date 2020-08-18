<template>
  <div class="channels_box">
    <el-row style="width: 100%;padding: 10px 10px 10px 20px;background-color: #ececec">
      <el-button type="primary"  @click="toAddData()" icon="el-icon-edit-outline">新增打印机</el-button>
    </el-row>
    <el-table
      :data="tableData"
      stripe
      style="width: 100%;padding: 20px">
      <el-table-column
        prop="printerSn"
        label="打印机编号"
        width="180">
      </el-table-column>
      <el-table-column
        prop="printerKey"
        label="打印机识别码">
      </el-table-column>
      <el-table-column
        prop="printerRemark"
        label="描述">
      </el-table-column>
      <el-table-column
        prop="printerType"
        label="打印机类型">
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

    <el-dialog :title="type=='add'?'新增打印机':'修改打印机'" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="打印机编号" :label-width="formLabelWidth">
          <el-input v-model="form.printerSn" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="打印机识别码" :label-width="formLabelWidth">
          <el-input v-model="form.printerKey" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="描述" :label-width="formLabelWidth">
          <el-input type="textarea" v-model="form.printerRemark" ></el-input>
        </el-form-item>
        <el-form-item label="打印机类型" :label-width="formLabelWidth">
          <el-select v-model="form.printerType" placeholder="请选打印机类型">
            <el-option label="订单" value=1 ></el-option>
            <el-option label="明细" value=2 ></el-option>
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
    name: 'printerManage',
    data() {
      return {
        tableData: [],
        dialogFormVisible: false,
        form: {
          printerSn: '',
          printerKey: '',
          printerRemark: '',
          printerType: ''
        },
        formLabelWidth: '120px',
        type:'add'
        
      }
    },
    created(){
      this.getTableListFS()
    },
    mounted(){
      
    },
    methods: {
      toAddData(){
        this.type = "add"
        this.dialogFormVisible = true
        this.form = {
          printerSn: '',
          printerKey: '',
          printerRemark: '',
          printerType: '',
          id: ''
        }
      },
      toSave(){
        if(this.type=="add"){
          let parm = {
            printerSn: this.form.printerSn,
            printerKey: this.form.printerKey,
            printerRemark: this.form.printerRemark,
            printerType: this.form.printerType
          }
          let url = apis.addPrinter
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
          let parm = {
            id: this.form.id,
            printerSn: this.form.printerSn,
            printerKey: this.form.printerKey,
            printerRemark: this.form.printerRemark,
            printerType: this.form.printerType=='订单'?'1':'2'
          }
          let url = apis.updatePrinter
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
      getTableListFS(){
          let url = apis.getPrinterListFS
          axios.get(url).then(res =>{
              this.tableData = this.getListData(res.data.data)
          }).catch(err =>{
            console.log(err)
          })
      },
      getListData(val){
          var list = []
          for(var i=0;i<val.length;i++){
             if(val[i].printerType==1){
               val[i].printerType = "订单"
             }else{
               val[i].printerType = "明细"
             }
             list.push(val[i])
          }
          return list
      },
      handleDelete(index, row){
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            this.toDeleteRow(row)
        }).catch(() => {
            this.$message({
                type: 'info',
                message: '已取消删除'
            });          
        });
      },
      toDeleteRow(val){
        let url = apis.deletePrinter+"/"+val.id
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
        this.form.printerSn = row.printerSn
        this.form.printerKey = row.printerKey
        this.form.printerRemark = row.printerRemark
        this.form.printerType = row.printerType
        this.form.id = row.id
      }
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
