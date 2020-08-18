<template>
  <div class="channels_box">
    <el-row style="width: 100%;padding: 10px 10px 10px 20px;background-color: #ececec">
      <el-button type="primary"  @click="toAddGoods()" icon="el-icon-edit-outline">新增商品</el-button>
      <span style="margin-left:20px;">所属店铺:</span>
      <el-select v-model="storeId" placeholder="请选所属店铺" style="margin-left:10px;margin-bottom: 10px;">
            <!-- <el-option label="所有" value=-1 ></el-option> -->
            <el-option v-for="(item,index) in shopList" :key="index" 
            :label="item.storeName" :value="item.id"></el-option>
      </el-select>
      <span style="margin-left:20px;">分类状态:</span>
      <el-select v-model="productType" placeholder="请选商品类型" style="margin-left: 10px;">
            <el-option v-for="(item,index) in productTypeList" :key="index" 
            :label="item.name" :value="item.id"></el-option>
      </el-select>
      <span style="margin-left:20px;">商品名称:</span>
      <el-input
        style="display:inline-block;width:200px;margin-left: 10px;"
        placeholder="请输入内容"
        prefix-icon="el-icon-search"
        v-model="goodName">
      </el-input>
      <el-button @click=toSearch() style="margin-left:20px;" icon="el-icon-search" circle></el-button>
    </el-row>
    <el-table
      :data="tableData"
      stripe
      style="width: 100%;padding: 20px">
      <el-table-column
        prop="title"
        label="商品名称"
        width="180">
      </el-table-column>

      <el-table-column
        prop="channelsNum"
        label="商品展示">
        <template slot-scope="scope">
          <div >
            <img width="80px" height="60px" :src="scope.row.image">
          </div>
        </template>
      </el-table-column>
       <el-table-column
        prop="channelsNum"
        label="详情页海报">
        <template slot-scope="scope">
          <div >
            <img width="80px" height="60px" :src="scope.row.posterImage">
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="price"
        label="商品价格">
      </el-table-column>
      <el-table-column
        prop="tejiaPrice"
        label="商品特价">
      </el-table-column>
      <el-table-column
        prop="status"
        label="商品状态">
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
    <el-dialog :title="type=='add'?'新增商品':'修改商品'" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <!-- <el-form-item label="sku类型" :label-width="formLabelWidth">
          <select-table :list="skuTypeList" :onChange="setSkuTypeArry"></select-table>
        </el-form-item>
        <el-form-item label="默认类型" :label-width="formLabelWidth">
          <select-table :list="defaultSkuList"></select-table>
        </el-form-item> -->
        
        <el-form-item label="商品名称" :label-width="formLabelWidth">
          <el-input v-model="form.productName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="列表页介绍" :label-width="formLabelWidth">
          <el-input type="textarea" v-model="form.pointDesc" ></el-input>
        </el-form-item>
        <el-form-item label="商品价格" :label-width="formLabelWidth">
          <el-input v-model="form.price" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="商品特价" :label-width="formLabelWidth">
          <el-input v-model="form.tejiaPrice" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="商品分类" :label-width="formLabelWidth">
          <el-select v-model="form.productType" placeholder="请选商品类型">
            <el-option v-for="(item,index) in productTypeList" :key="index" 
            :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上架状态" :label-width="formLabelWidth">
          <el-select v-model="form.status" placeholder="请选商品类型">
            <el-option label="上架" value="上架" ></el-option>
            <el-option label="下架" value="下架" ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="sku类型" :label-width="formLabelWidth">
          <el-checkbox-group v-model="form.skuType">
            <el-checkbox  v-for="(item,index) in skuTypeList" :key="index"
             :label="item.remark"  name="type"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="默认sku" :label-width="formLabelWidth">
          <el-checkbox-group v-model="form.defaultSku">
            <el-checkbox  v-for="(item,index) in defaultSkuList" :key="index"
             :label="item.cmsView"  name="type"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="详情页介绍" :label-width="formLabelWidth">
          <el-input type="textarea" v-model="form.productDesc" ></el-input>
        </el-form-item>
        <el-form-item label="列表页海报" :label-width="formLabelWidth">
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
        <el-form-item label="详情页海报" :label-width="formLabelWidth">
          <el-upload
            class="upload-demo"
            action="http://47.106.172.126:9001/tea/cms/image/upload"
            :on-success="handleSuccess1"
            :on-remove="handleRemove"
            :file-list="fileList1"
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
  import SelectTable from '../pubulicComp/selectTable'
  export default {
    name: 'GoodList',
    data() {
      return {
        tableData: [],
        shopList: [], 
        storeId: '',
        totalnum: 0,
        currentpage: 1,
        pagesize: 10,
        type: 'add',
        dialogFormVisible: false,
        form: {
          productName: '',
          pointDesc: '',
          price: '',
          tejiaPrice: '',
          productType: '',
          status: '',
          skuType: [],
          defaultSku: [],
          productDesc: '',
          image: '',
          image1: '',
          id: ''
        },
        formLabelWidth: '120px',
        fileList: [],
        fileList1: [],
        productTypeList: [],
        skuTypeList: [],
        defaultSkuList: [],
        productType: '',
        goodName: ''
      }
    },
    components: {
      'select-table': SelectTable,
    },
    created(){
      // this.getProdctListFS()
      this.getSkuTypeListFS()
      this.getDefautSkuFS()
    },
    mounted(){
      this.getShopListFS();
    },
    watch:{
      'form.skuType'(newValue, oldValue) {
  　　　　this.setSkuTypeArry(newValue)
  　　},
      storeId(newVal, oldVal) {
        this.getProdctListFS({ storeId: newVal })
        this.productType = '';
      }
    },
    methods: {
      getShopListFS(){
        const storeUrl = apis.getStoreByUser;
        axios.get(storeUrl).then(res => {
          if (res.data && res.data.code === 100000) {
            this.shopList = res.data.data;
            if (this.shopList && this.shopList.length) {
              this.storeId = this.shopList[0].id;
              this.getProdctListFS({ storeId: this.storeId })
            }
            this.getTableListFS();
          }
        });
      },
      setSkuTypeArry(list){
        this.defaultSkuList = []
        for(let i=0;i<list.length;i++){
          let name = list[i]
          for(let j=0;j<this.skuTypeList.length;j++){
            if(name==this.skuTypeList[j].remark){
              let l = this.skuTypeList[j].skuDetails
              for(let k=0;k<l.length;k++){
                this.defaultSkuList.push(l[k])
              }
            }
          }
        }
        console.log('defaultSkuList', this.defaultSkuList)
      },
      toSearch(){
        this.getTableListFS()
      },
      getSkuTypeIds(){
        let str = ""

        for(let i=0;i<this.form.skuType.length;i++){
          for(let j=0;j<this.skuTypeList.length;j++){
            if(this.form.skuType[i]==this.skuTypeList[j].remark){
              if(i==0){
                str = this.skuTypeList[j].id
              }else{
                str = str+","+this.skuTypeList[j].id
              }
            }
          }
          
        }
        return str
      },
      getDefaultSkuDetailIds(){
        let str = ""
        for(let i=0;i<this.form.defaultSku.length;i++){
          for(let j=0;j<this.defaultSkuList.length;j++){
            if(this.form.defaultSku[i]==this.defaultSkuList[j].cmsView){
              if(i==0){
                str = this.defaultSkuList[j].id
              }else{
                str = str+","+this.defaultSkuList[j].id
              }
            }
          }
          
        }
        return str
      },
      getCid(){
        let str = ""
        for(let i=0;i<this.productTypeList.length;i++){
            let porductType = this.form.productType
            if(porductType == this.productTypeList[i].name){
              str = this.productTypeList[i].id
            }
        }
        return str
      },
      toSave(){
        if(this.type=="add"){
          let skuTypeIds = this.getSkuTypeIds()
          let defaultSkuDetailIds = this.getDefaultSkuDetailIds()
          let cid = this.getCid()
          let parm = {
            title: this.form.productName,
            sellPoint: this.form.pointDesc,
            price: this.form.price,
            tejiaPrice: this.form.tejiaPrice,
            cid: this.form.productType,
            status: this.form.status=="上架"?1:0,
            skuTypeIds: skuTypeIds,
            defaultSkuDetailIds: defaultSkuDetailIds,
            simpleDesc: this.form.productDesc,
            image: this.form.image,
            posterImage: this.form.image1
          }
          let url = apis.addGoods
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
            tejiaPrice: this.form.tejiaPrice && this.form.tejiaPrice.replace('(元)',''),
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
      getDefautSkuFS(){
        let url = apis.getSKUDesList
          axios.get(url).then(res =>{
             //this.defaultSkuList = res.data.data
          }).catch(err =>{
            console.log(err)
          })
      },
      initList(data) {
        return data.map(item => {
          const obj = {...item, uid: item.id};
          const child = item.skuDetails.map(tmp => {
            return {
              ...tmp,
              remark: tmp.skuDetailName,
              uid: `${obj.uid}-${tmp.id}`
            }
          })
          obj.children = child;
          return obj;
        })
      },
      getSkuTypeListFS(){
          let url = apis.getSKUTypeList
          axios.get(url).then(res =>{
             this.skuTypeList = this.initList(res.data.data);
            //  this.skuTypeList = res.data.data;
          }).catch(err =>{
            console.log(err)
          })
      },
      getProdctListFS(option={}){
          let url = apis.getCategoryListFS
          axios({
            method: 'get',
            url,
            params: {
              ...option
            }
          }).then(res =>{
             this.productTypeList = res.data.data
          }).catch(err =>{
            console.log(err)
          })
      },
      toAddGoods(){
        this.type = "add"
        this.dialogFormVisible = true
        this.form = {
          productName: '',
          pointDesc: '',
          price: '',
          tejiaPrice: '',
          productType: '',
          status: '',
          skuType: [],
          defaultSku: [],
          productDesc: '',
          image: '',
          image1: '',
          id: ''
        }
        this.fileList = []
      },
      getTableListFS(option={}){
          let pram = {
            "pageSize":this.pagesize,
            "pageNum":this.currentpage,
            ...option,
          }
          if(this.productType!=''){
            pram.cid = this.productType
          }
          if(this.goodName!=''){
            pram.title = this.goodName
          }
          if(this.storeId!=''){
            pram.storeId = this.storeId
          }
          let url = apis.getGoodListFS
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
             val[i].price = val[i].price+"(元)"
             val[i].tejiaPrice = val[i].tejiaPrice && (val[i].tejiaPrice+"(元)")
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
        this.form.productName = row.title
        this.form.pointDesc = row.sellPoint
        this.form.price = row.price
        this.form.tejiaPrice = row.tejiaPrice
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
