<template>
  <div class="channels_box">
    <el-row style="width: 100%;padding: 10px 10px 10px 20px;background-color: #ececec">
      <el-button type="primary"  @click="toAdd()" icon="el-icon-edit-outline">新增活动</el-button>
      <span style="margin-left:20px;">所属店铺:</span>
      <el-select v-model="selectedStore" placeholder="请选所属店铺">
            <el-option label="所有" value=-1 ></el-option>
            <el-option v-for="(item,index) in options" :key="index" 
            :label="item.storeName" :value="item.storeName"></el-option>
      </el-select>
      <span style="margin-left:10px;">活动类型:</span>
      <el-select v-model="activityType" placeholder="请选择活动类型" default="-1">
        <el-option label="全部" value=-1 ></el-option>
        <el-option label="常规活动" value=1 ></el-option>
        <el-option label="节假日活动" value=2 ></el-option>
        <el-option label="全场折扣" value=3 ></el-option>
        <el-option label="买一送一" value=4 ></el-option>
        <el-option label="第二杯半价" value=5 ></el-option>
        <el-option label="门店活动" value=6 ></el-option>
        <el-option label="特价活动" value=7 ></el-option>
      </el-select>
      
    </el-row>
    <el-table
      :data="tableData"
      stripe
      style="width: 100%;padding: 20px">
      <el-table-column
        prop="activityType"
        label="活动类型">
      </el-table-column>
      <el-table-column
        prop="activityName"
        label="活动类型">
      </el-table-column>
      <el-table-column
        prop="tips"
        label="活动提示">
      </el-table-column>
      <el-table-column
        prop="storeId"
        label="所属店铺">
      </el-table-column>
      <el-table-column
        prop="startDate"
        label="活动开始时间">
      </el-table-column>
      <el-table-column
        prop="endDate"
        label="活动结束时间">
      </el-table-column>
      <el-table-column
        label="开抢时间">
        <template slot-scope="scope">
          <div >
            {{scope.row.startHour}}到{{scope.row.endHour}}
          </div>
        </template>
      </el-table-column>
        
      <el-table-column
        width="250"
        label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            @click="handleDesc(scope.$index, scope.row)">优惠券</el-button>
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
    <el-dialog :title="type=='add'?'新增活动':'修改活动'" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="活动类型" :label-width="formLabelWidth">
          <el-select v-model="form.activityType" placeholder="请选择活动类型">
            <el-option label="常规活动" value=1 ></el-option>
            <el-option label="节假日活动" value=2 ></el-option>
            <el-option label="全场折扣" value=3 ></el-option>
            <el-option label="买一送一" value=4 ></el-option>
            <el-option label="第二杯半价" value=5 ></el-option>
            <el-option label="门店活动" value=6 ></el-option>
            <el-option label="特价活动" value=7 ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="活动名称" :label-width="formLabelWidth">
          <el-input v-model="form.activityName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="活动提示" :label-width="formLabelWidth">
          <el-input v-model="form.tips" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="所属店铺" :label-width="formLabelWidth">
          <el-select v-model="form.storeId"  placeholder="请选择" >
            <el-option label="所有" value=-1 ></el-option>
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.storeName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="开始日期" :label-width="formLabelWidth">
          <el-input v-model="form.startDate" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="结束日期" :label-width="formLabelWidth">
          <el-input v-model="form.endDate" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="开抢时间" :label-width="formLabelWidth">
          <el-input v-model="form.startHour" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="结束时间" :label-width="formLabelWidth">
          <el-input v-model="form.endHour" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="未开始海报图" :label-width="formLabelWidth">
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
        <el-form-item label="开抢海报图" :label-width="formLabelWidth">
          <el-upload
            class="upload-demo"
            action="http://47.106.172.126:9001/tea/cms/image/upload"
            :on-success="handleSuccess2"
            :on-remove="handleRemove"
            :file-list="fileList2"
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
    <el-dialog title="优惠券" :visible.sync="dialogFormVisibleDesc">
      <div>
         <el-form :model="form">
            <el-form-item label="添加优惠券" :label-width="formLabelWidth">
              <el-select v-model="selectedcoupon"  placeholder="请选择" >
                <el-option
                  v-for="item in couponList"
                  :key="item.id"
                  :label="item.couponsName"
                  :value="item.id">
                </el-option>
              </el-select>
              <el-button @click="addCoupons" style="margin-left:20px;">添加</el-button>
            </el-form-item>
         </el-form>
      </div>
      <div>
        <el-card v-for="(item,index) in selectedCouponList" :key="index" class="box-card">
          <div slot="header" class="clearfix">
            <span>{{item.couponsName}}</span>
          </div>
          <div  class="text item">
            剩余数量 <el-input style="display:inline-block;width:90px;"
             v-model="item.couponsCount" placeholder="请输入内容"></el-input>
             <el-button type="text" size="small" @click="toSaveCoupons(item)" style="margin-left:20px;display:inline-block;">保存</el-button>
             <el-button type="text" size="small" @click="toDeleteCoupons(item)" style="margin-left:20px;display:inline-block;">删除</el-button>
          </div>
        </el-card>
      </div>
      
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleDesc = false">取 消</el-button>
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
        totalnum: 0,
        currentpage: 1,
        pagesize: 10,
        options: [],
        type:'add',
        dialogFormVisible: false,
        dialogFormVisibleDesc: false,
        formLabelWidth: '120px',
        form: {
          activityType: '',
          activityName: '',
          tips: '',
          storeId: '',
          startDate: '',
          endDate: '',
          startHour: '',
          endHour: '',
          noStartPoster: '',
          startingPoster: '',
          id: ''
        },
        fileList1: [],
        fileList2: [],
        couponList: [],
        selectedcoupon: '',
        selectedCouponList: [],
        selectedActivity: {},
        selectedStore: '',
        activityType: '-1',
      }
    },
    created(){
      this.getShopListFS()
      this.getCouponListFS()
    },
    mounted(){
    },
    watch:{
      selectedStore(val){
        this.getTableListFS()
      },
      activityType(val) {
        this.getTableListFS({activityType: val && Number(val)});
      }
    },
    methods: {
      toDeleteCard(val){
        let list = []
        for(let i=0;i<this.selectedCouponList.length;i++){
          if(val!=this.selectedCouponList[i].couponsId){
            list.push(this.selectedCouponList[i])
          }
        }
        this.selectedCouponList = list
      },
      toDeleteCoupons(val){
        let activityId = this.selectedActivity.id
        let couponsId = val.couponsId
        if(val.id!=null){
          let url = `${apis.deleteActivityCoupons}/${activityId}/${val.id}`
          axios.get(url).then(res =>{
            if(res.data.code==100000){
              this.$message({
                type:'success',
                message: "删除成功"
              })
              this.toDeleteCard(couponsId)
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
          this.toDeleteCard(couponsId)
        }
        
        
      },
      toSaveCoupons(val){
        let activityId = this.selectedActivity.id
        let couponsId = val.couponsId
        let parm = {}
        if(val.id!=null){
          parm = {
            activityId: activityId,
            couponsId: couponsId,
            couponsCount: val.couponsCount,
            id: val.id
          }
        }else{
          parm = {
            activityId: activityId,
            couponsId: couponsId,
            couponsCount: val.couponsCount,
          }
        }
        
        let url = apis.addActivityCoupons
        axios.post(url,parm).then(res =>{
          if(res.data.code==100000){
            this.$message({
              type:'success',
              message: "添加成功"
            })
            
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
      addCoupons(){
        for(let i=0;i<this.couponList.length;i++){
          if(this.selectedcoupon == this.couponList[i].id){
            let obj = {
              couponsName: this.couponList[i].couponsName,
              couponsCount: this.couponList[i].couponsCount,
              couponsId: this.couponList[i].id
            }
            this.selectedCouponList.push(obj)
          }
        }
      },
      getCouponListFS(){
        let url = apis.getCouponFS
        axios.get(url).then(res =>{
            this.couponList = res.data.data
        }).catch(err =>{
          console.log(err)
        })
      },
      toAdd(){
        this.type = "add"
        this.dialogFormVisible = true
        this.form = {
          activityType: '',
          activityName: '',
          tips: '',
          storeId: '',
          startDate: '',
          endDate: '',
          startHour: '',
          endHour: '',
          noStartPoster: '',
          startingPoster: '',
          id: ''
        }
        this.fileList1 = []
        this.fileList2 = []
      },
      toSave(){
        if(this.type=="add"){
          let parm = {
            activityType: this.form.activityType,
            activityName: this.form.activityName,
            tips: this.form.tips,
            storeId: this.form.storeId,
            startDate: this.form.startDate,
            endDate: this.form.endDate,
            startHour: this.form.startHour,
            endHour: this.form.endHour,
            noStartPoster: this.form.noStartPoster,
            startingPoster: this.form.startingPoster
          }
          let url = apis.addActivity
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
          let activityType = this.getActivityType(this.form.activityType)
          let storeid = this.getStoreid(this.form.storeId)
          let parm = {
            id: this.form.id,
            activityType: activityType,
            activityName: this.form.activityName,
            tips: this.form.tips,
            storeId: storeid,
            startDate: this.form.startDate,
            endDate: this.form.endDate,
            startHour: this.form.startHour,
            endHour: this.form.endHour,
            noStartPoster: this.form.noStartPoster,
            startingPoster: this.form.startingPoster
          }
          let url = apis.updateActivity
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
      getStoreid(val){
        let str = ""
        for(let i=0;i<this.options.length;i++){
          if(val==this.options[i].storeName){
            str = this.options[i].id
          }
        }
        return str
      },
      getActivityType(val){
        let str = ""
        if(val=="常规活动"){
          str = 1
        }else if(val=="节假日活动"){
          str = 2
        }else if(val=="全场折扣"){
          str = 3
        }else if(val=="买一送一"){
          str = 4
        }else if(val=="第二杯半价"){
          str = 5
        }else if(val=="门店活动"){
          str = 6
        }else if(val=="特价活动"){
          str = 7
        }
        return str
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
          let url = apis.getActivityListFS
          let pram = {
            pageSize: this.pagesize,
            pageNum: this.currentpage,
            storeId: this.shopid,
            activityType: -1,
          };
          axios({
            method: "post",
            url,
            data: {
              ...pram,
              ...options
            }
          }).then(res =>{
              if (res && res.data.code === 100000) {
                this.tableData = this.getListData(res.data.data)
                this.totalnum = res.data.total
              }
          }).catch(err =>{
            console.log(err)
          })
      },
      getListData(val){
          var list = []
          let ownShop = this.options || [];
          for(var i=0;i<val.length;i++){
            let obj = val[i]
            for(let j=0;j<ownShop.length;j++){
              if(ownShop[j].id==obj.storeId){
                let activityType = val[i].activityType
                if(activityType==1){
                  val[i].activityType = "常规活动"
                }else if(activityType==2){
                  val[i].activityType = "节假日活动"
                }else if(activityType==3){
                  val[i].activityType = "全场折扣"
                }else if(activityType==4){
                  val[i].activityType = "买一送一"
                }else if(activityType==5){
                  val[i].activityType = "第二杯半价"
                }else if(activityType==6){
                  val[i].activityType = "门店活动"
                }else if(activityType==7){
                  val[i].activityType = "特价活动"
                }
                let stroe = this.getStroeName(val[i].storeId)
                val[i].storeId = stroe
                list.push(obj)
              }
            }
          }
          return list
      },
      getStroeName(val){
          let str = ""
          for(let i=0;i<this.options.length;i++){
            if(val == this.options[i].id){
              str = this.options[i].storeName
            }
            if(val==-1){
              str = "所有"
            }
          }
          return str
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
      handleEdit(index, row) {
        this.type = "update"
        this.dialogFormVisible = true
        this.form.activityType = row.activityType
        this.form.activityName = row.activityName
        this.form.tips = row.tips
        this.form.storeId = row.storeId
        this.form.startDate = row.startDate
        this.form.endDate = row.endDate
        this.form.startHour = row.startHour
        this.form.endHour = row.endHour
        this.form.noStartPoster = row.noStartPoster
        this.form.startingPoster = row.startingPoster
        this.form.id = row.id
        this.fileList1 = [{name: row.noStartPoster, url: row.noStartPoster}]
        this.fileList2 = [{name: row.startingPoster, url: row.startingPoster}]
      },
      handleDesc(index, row){
        this.dialogFormVisibleDesc = true
        this.selectedActivity = row
        let url = `${apis.getCouponsListByActivityFS}/${row.id}`
        axios.get(url).then(res =>{
            this.selectedCouponList = res.data.data
        }).catch(err =>{
          console.log(err)
        })
      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handleSuccess1(file) {
        this.form.noStartPoster = file
      },
      handleSuccess2(file) {
        this.form.startingPoster = file
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
        let url = apis.deleteActivity+"/"+val.id
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
  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }

  .box-card {
    width: 290px;
    margin-left: 20px;
    margin-top: 20px;
    display: inline-block;
    visibility:top;
  }
</style>
