<template>
  <div class="channels_box">
    <el-row style="width: 100%;padding: 10px 10px 10px 20px;background-color: #ececec">
      <el-button type="primary"  @click="toAdd()" icon="el-icon-edit-outline">新增轮播</el-button>
      <span style="margin-left:20px;">所属店铺:</span>
      <el-select v-model="storeId" placeholder="请选所属店铺" style="margin-left:10px;margin-bottom: 10px;">
            <el-option label="所有" value=-1 v-if="userInfo.isAdmin == 1"></el-option>
            <el-option v-for="(item,index) in options" :key="index" 
            :label="item.storeName" :value="item.id"></el-option>
      </el-select>
    </el-row>
    <el-table
      :data="tableData"
      stripe
      style="width: 100%;padding: 20px">
      <el-table-column
        prop="storeId"
        label="所属店铺">
      </el-table-column>
      <el-table-column
        label="图片">
        <template slot-scope="scope">
          <div >
            <img width="180px" height="120px" :src="scope.row.imageUrl">
          </div>
        </template>
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
        <el-form-item label="所属分店" :label-width="formLabelWidth">
          <el-select v-model="form.storeId"  placeholder="请选择" style="width:100%">
            <el-option label="所有" value=-1 ></el-option>
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.storeName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        
        <el-form-item label="优惠券海报图" :label-width="formLabelWidth">
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
  import axios from '../../env/axios.js'
  export default {
    name: 'OrderList',
    data() {
      return {
        userInfo: {},
        tableData: [],
        options:[],
        storeId: [],
        dialogFormVisible: false,
        form: {
          storeId: '',
          imageUrl: '',
        },
        formLabelWidth: '120px',
        type:'add',
        fileList: [],
      }
    },
    created(){
      this.getShopListFS();
      this.getCurrentUserInfo();
    },
    mounted(){
    },
    watch: {
      storeId: function(newVal, oldVal) {
        if (newVal) {
          this.getTableListFS({storeId: newVal})
        }
      }
    },
    methods: {
      getCurrentUserInfo() {
        const url = apis.getCurrentUserInfo;
        axios.get(url).then(res => {
          if (res.data && res.data.code === 100000) {
            this.userInfo = res.data.data;
          }
        });
      },
      toAdd(){
        this.type = "add"
        this.dialogFormVisible = true
        this.form = {
          storeId: '',
          imageUrl: '',
        }
        this.fileList = []
      },
      toSave(){
        if(this.type=="add"){
          let parm = {
            storeId: this.form.storeId,
            imageUrl: this.form.imageUrl,
          }
          let url = apis.addHomeRotatio
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
          let url = apis.updateHomeRotatio
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
      getShopListFS(){
        const storeUrl = apis.getStoreByUser;
        axios.get(storeUrl).then(res => {
          if (res.data && res.data.code === 100000) {
            this.options = res.data.data;
            if (this.options && this.options.length) {
              console.log('this.options[0]', this.options[0])
              this.storeId = this.options[0].id;
              this.getTableListFS()
            }
          }
        });
      },
      // getShopListFS(){
      //   let url = `${apis.getShopListFS}/-1`
      //   axios.get(url).then(res =>{
      //       this.options = res.data.data
      //       this.getTableListFS()
      //   }).catch(err =>{
      //     console.log(err)
      //   })
      // },
      getTableListFS(option={}){
          let url = apis.getHomeRotationFS
          let pram = {}
          if(this.storeId != ''){
            pram.storeId = this.storeId
          }
          axios({
            method: 'get',
            url,
            params: {
              ...pram,
              ...option,  
            }
          }).then(res =>{
              this.tableData = this.getListData(res.data.data)
              this.totalnum = res.data.total
          }).catch(err =>{
            console.log(err)
          })
      },
      getListData(val){
          var list = []
          for(var i=0;i<val.length;i++){
             let store = val[i].storeId
             let storeName
             if(store==-1){
               storeName = "所有"
             }else{
               storeName = this.getStoreName(store)
             }
             val[i].storeId = storeName
             list.push(val[i])
          }
          return list
      },
      getStoreName(val){
        let str = ''
        for(let i=0;i<this.options.length;i++){
          if(val==this.options[i].id){
            str = this.options[i].storeName
          }
        }
        return str
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
        let url = apis.deleteHomeRotation+"/"+val.id
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
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handleSuccess(file) {
        this.form.imageUrl = file
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
