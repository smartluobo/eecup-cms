<template>
  <div class="channels_box">
    <el-row style="width: 100%;padding: 10px 10px 10px 20px;background-color: #ececec">
      <span style="margin-left:20px;">店铺名称:</span>
      <el-select v-model="storeId" placeholder="请选所属店铺">
            <el-option v-for="(item,index) in options" :key="index" :label="item.storeName" :value="item.id"></el-option>
      </el-select>
      <el-button style="margin-left:20px;" type="primary"  @click="toAddUser()" icon="el-icon-edit-outline">新增商品</el-button>
    </el-row>
    <el-table
      :data="tableData"
      stripe
      style="width: 100%;padding: 20px">
      <el-table-column
        prop="storeName"
        label="店铺名称"
        width="180">
      </el-table-column>
      <el-table-column
        prop="goodsName"
        label="商品名称">
      </el-table-column>
      <el-table-column
        prop="goodsPoster"
        label="商品海报">
        <template slot-scope="scope">
          <div >
            <img width="80px" height="60px" :src="scope.row.goodsPoster">
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
      
     
    </el-table>

    <el-dialog title="新增推荐商品" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="商品名称" :label-width="formLabelWidth">
          <el-select v-model="form.goodsid"  placeholder="请选择">
            <el-option
              v-for="item in goodsList"
              :key="item.title"
              :label="item.title"
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
        storeId: '',
        tableData: [],
        dialogFormVisible: false,
        form: {
          goodsid: '',
        },
        formLabelWidth: '120px',
        options: [],
        shoplist: [],
        goodsList: []
      }
    },
    created(){
      this.getShopListFS()
    },
    mounted(){
      console.log('推荐管理1')
    },
    watch:{
      storeId(val){
        this.getTableListFS()
        this.getGoodsListFS()
      }
    },
    methods: {
      getGoodsListFS(){
        let pram = {
            storeId: this.storeId
          }
          let url = apis.getGoodsByStore
          axios.post(url,pram).then(res =>{
              this.goodsList = res.data.data
          }).catch(err =>{
            console.log(err)
          })
      },
      toAddUser(){
        this.dialogFormVisible = true
        this.form = {
          goodsid: '',
        }
        this.shoplist = []
      },
      
      toSave(){
          
          let parm = {
            goodsId: this.form.goodsid,
            storeId: this.storeId,
          }
          let url = apis.addRecommendGoods
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
      },
      
     
      getShopListFS(){
        let url = `${apis.getShopListFS}/-1`
        axios.get(url).then(res =>{
            this.options = res.data.data
            this.storeId = this.options[0].id
            this.getGoodsListFS()
            this.getTableListFS()
        }).catch(err =>{
          console.log(err)
        })
      },
      getTableListFS(){
          let url = `${apis.getRecommendGoods}/${this.storeId}`
          axios.get(url).then(res =>{
              this.tableData = this.getListData(res.data.data)
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
        let url = apis.deleteRecommendGoods+"/"+val.id
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
