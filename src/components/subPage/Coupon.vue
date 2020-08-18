<template>
  <div class="channels_box">
    <el-row style="width: 100%;padding: 10px 10px 10px 20px;background-color: #ececec">
      <el-button type="primary"  @click="toAdd()" icon="el-icon-edit-outline">新增优惠券</el-button>
    </el-row>
    <el-table :data="tableData" stripe style="width: 100%;padding: 20px">
      <el-table-column prop="couponsType" label="优惠券类型"> </el-table-column>
      <el-table-column prop="couponsName" label="优惠券名称"> </el-table-column>
      <el-table-column prop="couponsRatio" label="折扣比列"> </el-table-column>
      <el-table-column prop="consumeAmount" label="消费金额"> </el-table-column>
      <el-table-column prop="reduceAmount" label="立减金额"> </el-table-column>
      <el-table-column prop="consumeCount" label="购买数量"> </el-table-column>
      <el-table-column prop="giveCount" label="赠送数量"> </el-table-column>
      <el-table-column label="优惠券海报图">
        <template slot-scope="scope">
          <div >
            <img width="80px" height="60px" :src="scope.row.couponsPoster">
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180">
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
    <el-dialog :title="type=='add'?'新增优惠券':'修改优惠券'" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="优惠券类型" :label-width="formLabelWidth">
          <el-select v-model="form.couponsType" placeholder="请选择优惠券类型">
            <el-option label="折扣券" value="折扣券" ></el-option>
            <el-option label="满减券" value="满减券" ></el-option>
            <el-option label="团购券" value="团购券" ></el-option>
            <el-option label="免费券" value="免费券" ></el-option>
            <el-option label="通用券" value="通用券" ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="优惠券名称" :label-width="formLabelWidth">
          <el-input v-model="form.couponsName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="折扣比列" :label-width="formLabelWidth">
          <el-input v-model="form.couponsRatio" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="消费金额" :label-width="formLabelWidth">
          <el-input v-model="form.consumeAmount" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="立减金额" :label-width="formLabelWidth">
          <el-input v-model="form.reduceAmount" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="购买数量" :label-width="formLabelWidth">
          <el-input v-model="form.consumeCount" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="赠送数量" :label-width="formLabelWidth">
          <el-input v-model="form.giveCount" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="使用规则" :label-width="formLabelWidth">
          <el-input type="textarea" v-model="form.useRules" ></el-input>
        </el-form-item>
        <el-form-item label="使用范围" :label-width="formLabelWidth">
          <el-input type="textarea" v-model="form.useScope" ></el-input>
        </el-form-item>
        <el-form-item label="海报图" :label-width="formLabelWidth">
          <el-upload
            class="upload-demo"
            action="http://47.106.172.126:9001/tea/cms/image/upload"
            :on-success="handleSuccess"
            :on-remove="handleRemove"
            :file-list="fileList"
            list-type="picture">
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
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
  import axios from '../../env/axios'
  export default {
    name: 'OrderList',
    data() {
      return {
        tableData: [],
        totalnum: 0,
        currentpage: 1,
        pagesize: 10,
        shopid:'',
        options:[],
        type:'add',
        dialogFormVisible: false,
        formLabelWidth: '120px',
        form: {
          couponsType: '',
          couponsName: '',
          couponsRatio: '',
          consumeAmount: '',
          reduceAmount: '',
          consumeCount: '',
          giveCount: '',
          couponsPoster: '',
          useRules: '',
          useScope: ''
        },
        fileList: [],
      }
    },
    created(){
    },
    mounted(){
      this.getTableListFS()
    },
    methods: {
      toAdd(){
        this.type = "add"
        this.dialogFormVisible = true
        this.form = {
          couponsType: '',
          couponsName: '',
          couponsRatio: '',
          consumeAmount: '',
          reduceAmount: '',
          consumeCount: '',
          giveCount: '',
          couponsPoster: '',
          useRules: '',
          useScope: ''
        }
        this.fileList = []
      },
      getCouponsType(val){
        let int = 0
        if(val=="折扣券"){
          int = 1
        }else if(val=="满减券"){
          int = 2
        }else if(val=="团购券"){
          int = 3
        }else if(val=="免费券"){
          int = 4
        }else if(val=="通用券"){
          int = 5
        }
        return int
      },
      toSave(){
        if(this.type=="add"){
          let couponsType = this.getCouponsType(this.form.couponsType)
          let parm = {
            couponsType: couponsType,
            couponsName: this.form.couponsName,
            couponsRatio: this.form.couponsRatio,
            consumeAmount: this.form.consumeAmount,
            reduceAmount: this.form.reduceAmount,
            consumeCount: this.form.consumeCount,
            giveCount: this.form.giveCount,
            couponsPoster: this.form.couponsPoster,
            useRules: this.form.useRules,
            useScope: this.form.useScope
          }
          let url = apis.addCoupon
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
          let couponsType = this.getCouponsType(this.form.couponsType)
          let parm = {
            id: this.form.id,
            couponsType: couponsType,
            couponsName: this.form.couponsName,
            couponsRatio: this.form.couponsRatio,
            consumeAmount: this.form.consumeAmount,
            reduceAmount: this.form.reduceAmount,
            consumeCount: this.form.consumeCount,
            giveCount: this.form.giveCount,
            couponsPoster: this.form.couponsPoster,
            useRules: this.form.useRules,
            useScope: this.form.useScope
          }
          let url = apis.updateCoupon
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
          let url = apis.getCouponFS
          axios.get(url).then(res =>{
              this.tableData = this.getListData(res.data.data)
              this.totalnum = res.data.total
          }).catch(err =>{
            console.log(err)
          })
      },
      getListData(val){
          var list = []
          for(var i=0;i<val.length;i++){
             let couponsType = val[i].couponsType
             if(couponsType==1){
               val[i].couponsType = "折扣券"
             }else if(couponsType==2){
               val[i].couponsType = "满减券"
             }else if(couponsType==3){
              val[i].couponsType = "团购券"
             }else if(couponsType==4){
               val[i].couponsType = "免费券"
             }else if(couponsType==5){
               val[i].couponsType = "通用券"
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
        this.form.couponsPoster = file
      },
      handleDelete(index, row){
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            this.toDelete(row)
        }).catch(() => {
            this.$message({
                type: 'info',
                message: '已取消删除'
            });          
        });
      },
      toDelete(val){
        let url = apis.deleteCoupon+"/"+val.id
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
        this.form.couponsType = row.couponsType
        this.form.couponsName = row.couponsName
        this.form.couponsRatio = row.couponsRatio
        this.form.consumeAmount = row.consumeAmount
        this.form.consumeCount = row.consumeCount
        this.form.reduceAmount = row.reduceAmount
        this.form.giveCount = row.giveCount
        this.form.couponsPoster = row.couponsPoster
        this.form.useRules = row.useRules
        this.form.useScope = row.useScope
        this.form.id = row.id
        this.fileList = [{name: row.couponsPoster, url: row.couponsPoster}]
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
