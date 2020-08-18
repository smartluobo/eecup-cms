<template>
  <div class="channels_box">
    <el-row style="width: 100%;padding: 10px 10px 10px 20px;background-color: #ececec">
      <el-button type="primary"  @click="toAddUser()" icon="el-icon-edit-outline">新增用户</el-button>
    </el-row>
    <el-table
      :data="tableData"
      stripe
      style="width: 100%;padding: 20px">
      <el-table-column
        prop="loginName"
        label="登陆名称"
        width="180">
      </el-table-column>
      <el-table-column
        prop="storeIds"
        label="所属分店">
      </el-table-column>
      <el-table-column
        prop="userName"
        label="真实姓名">
      </el-table-column>
      <el-table-column
        prop="password"
        label="密码">
      </el-table-column>
      <el-table-column
        prop="menuIds"
        label="菜单权限">
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

    <el-dialog :title="type=='add'?'新增用户':'修改用户'" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="用户名称" :label-width="formLabelWidth">
          <el-input v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="真实姓名" :label-width="formLabelWidth">
          <el-input v-model="form.realname" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="用户密码" :label-width="formLabelWidth">
          <el-input v-model="form.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="菜单权限" :label-width="formLabelWidth">
          <el-select v-model="form.meun" multiple placeholder="请选择">
            <el-option
              v-for="item in meunList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属分店" :label-width="formLabelWidth">
          <el-select v-model="shoplist" multiple placeholder="请选择" style="width:100%">
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.storeName"
              :value="item.id">
            </el-option>
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
    name: 'UserAdmin',
    data() {
      return {
        tableData: [],
        dialogFormVisible: false,
        form: {
          username: '',
          realname: '',
          password: '',
          meun: [],
          id: ''
        },
        formLabelWidth: '120px',
        options: [],
        shoplist: [],
        type:'add',
        meunList: [{
          value: '1',
          label: '用户管理'
        }, {
          value: '2',
          label: '订单列表'
        }, {
          value: '3',
          label: '商品列表'
        }, {
          value: '4',
          label: '店铺列表'
        }, {
          value: '5',
          label: 'sku管理'
        },{
          value: '6',
          label: '活动管理'
        }, {
          value: '7',
          label: '分类列表'
        }, {
          value: '8',
          label: '首页轮播配置'
        }, {
          value: '9',
          label: '优惠券'
        }, {
          value: '10',
          label: '店铺库存管理'
        }, {
          value: '11',
          label: '打印机管理'
        }],
        
        
      }
    },
    created(){
      this.getShopListFS()
    },
    mounted(){
      
    },
    methods: {
      toAddUser(){
        this.type = "add"
        this.dialogFormVisible = true
        this.form = {
          username: '',
          realname: '',
          password: '',
          meun: [],
          id: ''
        }
        this.shoplist = []
      },
      
      toSave(){
        if(this.type=="add"){
          let storelist = this.getStoreList()
          let menuIds = this.getStrMenuIds(this.form.meun)
          let parm = {
            loginName: this.form.username,
            userName: this.form.realname,
            password: this.form.password,
            storeIds: storelist,
            menuIds: menuIds
          }
          let url = apis.addUser
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
          let storeIds = this.getStrStoreIds()
          let menuIds = this.getStrMenuIds(this.form.meun)
          let parm = {
            loginName: this.form.username,
            userName: this.form.realname,
            password: this.form.password,
            storeIds: storeIds,
            menuIds: menuIds,
            id: this.form.id
          }
          let url = apis.updateUser
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
      getStrMenuIds(list){
        let str = ""
        for(let i=0;i<list.length;i++){
          if(i==0){
            str=list[i]
          }else{
            str=str+","+list[i]
          }
        }
        return str
      },
      getStoreList(){
        let str = ""
        for(let i=0;i<this.shoplist.length;i++){
          if(i==0){
            str=this.shoplist[i]
          }else{
            str=str+","+this.shoplist[i]
          }
        }
        return str
      },
      getShopListFS(){
        let url = `${apis.getShopListFS}/-1`
        axios.get(url).then(res =>{
            this.options = res.data.data
            this.getTableListFS()
        }).catch(err =>{
          console.log(err)
        })
      },
      getTableListFS(){
          let url = apis.getUserListFS
          axios.get(url).then(res =>{
              this.tableData = this.getListData(res.data.data)
          }).catch(err =>{
            console.log(err)
          })
      },
      getListData(val){
          var list = []
          for(var i=0;i<val.length;i++){
             let storelist = val[i].storeIds==null?'':val[i].storeIds.split(',')
             let str = ""
             for(let i=0;i<storelist.length;i++){
               let id = storelist[i]
               for(let j=0;j<this.options.length;j++){
                 if(id==JSON.stringify(this.options[j].id)){
                   str = str +","+ this.options[j].storeName
                 }
               }
             }
             val[i].storeIds = str.substring(1,str.length)
             list.push(val[i])
          }
          return list
      },
      handleDelete(index, row){
        this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            this.toDeleteUser(row)
        }).catch(() => {
            this.$message({
                type: 'info',
                message: '已取消删除'
            });          
        });
      },
      toDeleteUser(val){
        let url = apis.deleteUser+"/"+val.id
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
        this.form.username = row.loginName
        this.form.realname = row.userName
        this.form.password = row.password
        this.shoplist = this.getStoreIds(row.storeIds)
        this.form.id = row.id
        
      },
      getStrStoreIds(){
        let str = ''
        for(let i=0;i<this.shoplist.length;i++){
          if(i==0){
            str = this.shoplist[i]
          }else{
            str = str+","+this.shoplist[i]
          }
        }
        return str
      },
      getStoreIds(val){
        let list = []
        let storelist = val==null?'':val.split(',')
        for(let i=0;i<storelist.length;i++){
          let value = storelist[i]
          console.log(this.options)
          for(let j=0;j<this.options.length;j++){
            if(value==this.options[j].storeName){
              list.push(this.options[j].id)
            }
          }
        }
        return list
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
