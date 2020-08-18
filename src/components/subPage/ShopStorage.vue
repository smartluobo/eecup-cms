<template>
  <div class="channels_box">
    <el-row style="width: 100%;padding: 10px 10px 10px 20px;background-color: #ececec">
      <span>所属分店:</span>
      <el-select v-model="shopid" placeholder="请选择分店">
        <el-option v-for="(item,index) in options" :key="index" :label="item.storeName" :value="item.id"></el-option>
      </el-select>
      <span style="margin-left:10px;">商品名称:</span>
      <el-input
        style="display:inline-block;width:200px;margin-left:10px;"
        placeholder="请输入内容"
        prefix-icon="el-icon-search"
        v-model="goodsName"
      ></el-input>
      <!-- goodsName -->
      <!-- <el-button style="margin-left:30px;" type="primary"  @click="toAdd()" icon="el-icon-edit-outline">新增库存</el-button> -->
      <el-button style="margin-left:30px;" type="primary"  @click="showInitGoods()" icon="el-icon-edit-outline">初始化商品</el-button>
      <el-button style="margin-left:30px;" type="info"  @click="toInit()" icon="el-icon-s-tools">初始化库存</el-button>
      <el-button style="margin-left:30px;" type="info"  @click="toClear()" icon="el-icon-s-tools">清空库存</el-button>
    </el-row>
    <el-table
      :data="tableData"
      stripe
      style="width: 100%;padding: 20px">
      <el-table-column
        prop="goodsId"
        label="商品编号"
        width="180">
      </el-table-column>
      <el-table-column
        prop="goodsName"
        label="商品名称">
      </el-table-column>
      <el-table-column
        prop="storeName"
        label="所属店铺">
      </el-table-column>
      <el-table-column
        prop="goodsInventory"
        label="商品库存">
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
    <el-dialog :title="type=='add'?'新增库存':'修改库存'" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <!-- <el-form-item label="商品编号" :label-width="formLabelWidth">
          <el-input v-model="form.goodsId" autocomplete="off"></el-input>
        </el-form-item> -->
        <el-form-item label="商品名称" :label-width="formLabelWidth">
          <el-select v-model="form.goodsName" placeholder="请选商品类型" :disabled="type !== 'add'">
            <el-option v-for="(item,index) in goodList" :key="index" 
            :label="item.title" :value="item.title"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品数量" :label-width="formLabelWidth">
          <el-input v-model="form.goodsInventory" autocomplete="off"></el-input>
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
    name: 'ShopStorage',
    data() {
      return {
        tableData: [],
        dialogFormVisible: false,
        shopid: '',
        goodsName: '',
        form: {
          goodsId: '',
          goodsName: '',
          goodsInventory: '',
          storeId: '',
          storeName: '',
          id: '',
        },
        formLabelWidth: '120px',
        options: [],
        type:'add',
        totalnum: 0,
        currentpage: 1,
        pagesize: 10,
        goodList: [],
      }
    },
    watch:{
      shopid(val){
        this.getTableListFS()
      },
      goodsName(val) {
        this.getTableListFS({goodsName: val})
      }
    },
    created(){
      this.getShopListFS()
      this.getGoodsListFS()
    },
    mounted(){
      
    },
    methods: {
      showInitGoods() {
        this.$confirm('确认初始化商品？谨慎操作!', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            this.initGoods()
        }).catch(() => {
            this.$message({
                type: 'info',
                message: '已取消'
            });          
        });
      },
      initGoods() {
          let url = apis.initGoods
          axios.post(url, {storeId: this.shopid}).then(res =>{
            if (res.data.code === 100000) {
              this.dialogVisible = false
              this.$message({
                type: 'success',
                message: '初始化成功'
              })
              this.getTableListFS()
            } else {
              this.$message({
                type: 'warn',
                message: res.data.msg
              })
            }
          }).catch(err =>{
            console.log(err)
          })
      },
      getGoodsListFS(){
        let pram = {
            "pageSize":1000,"pageNum":1
          }
          let url = apis.getGoodListFS
          axios.post(url,pram).then(res =>{
              this.goodList = res.data.data
          }).catch(err =>{
            console.log(err)
          })
      },
      toClear(){
        this.$confirm('确认清空库?存请谨慎操作!', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            this.clear()
        }).catch(() => {
            this.$message({
                type: 'info',
                message: '已取消'
            });          
        });
      },
      toInit(){
        this.$confirm('确认初始化?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            this.init()
        }).catch(() => {
            this.$message({
                type: 'info',
                message: '已取消'
            });          
        });
      },
      clear(){
        let url = `${apis.clearStorage}/${this.shopid}`
        axios.get(url).then(res =>{
          if(res.data.code==100000){
            this.$message({
              type:'success',
              message: "初始化成功"
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
      init(){
        let url = `${apis.initStorage}/${this.shopid}`
        axios.get(url).then(res =>{
          if(res.data.code==100000){
            this.$message({
              type:'success',
              message: "初始化成功"
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
      toAdd(){
        this.type = "add"
        this.dialogFormVisible = true
        this.form = {
          goodsId: '',
          goodsName: '',
          goodsInventory: '',
          storeId: '',
          storeName: '',
          id: '',
        }
      },
      getGoodsId(name){
        let str = ''
        for(let i=0;i<this.goodList.length;i++){
          if(this.goodList[i].title==name){
            str = this.goodList[i].id
          }
        }
        return str
      },
      getStoreName(){
        let str = ''
        for(let i=0;i<this.options.length;i++){
          if(this.options[i].id==this.shopid){
            str = this.options[i].storeName
          }
        }
        return str
      },
      toSave(){
        if(this.type=="add"){
          let goodsId = this.getGoodsId(this.form.goodsName)
          let storeName = this.getStoreName()
          let parm = {
            goodsId: goodsId,
            goodsName: this.form.goodsName,
            goodsInventory: this.form.goodsInventory,
            storeId: this.shopid,
            storeName: storeName
          }
          let url = apis.addStorage
          
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
          let goodsId = this.getGoodsId(this.form.goodsName)
          let storeName = this.getStoreName()
          let parm = {
            goodsId: goodsId,
            goodsName: this.form.goodsName,
            goodsInventory: this.form.goodsInventory,
            storeId: this.shopid,
            storeName: storeName,
            id: this.form.id
          }
          let url = apis.updateStorage
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
            this.shopid = res.data.data[0].id;
            this.getTableListFS()
          }
        });
      },
      getTableListFS(options={}){
          let url = apis.getShopStorageListFSNew
          let pram = {
            pageSize: this.pagesize,
            pageNum: this.currentpage,
            storeId: this.shopid,
          };
          axios({
            method: "post",
            url,
            data: {
              ...pram,
              ...options
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
        this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
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
        let url = apis.deleteStorage+"/"+val.id
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
        this.form.goodsName = row.goodsName
        this.form.goodsInventory = row.goodsInventory
        this.form.id = row.id
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
    },
    
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
