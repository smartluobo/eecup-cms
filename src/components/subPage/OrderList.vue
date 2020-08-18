<template>
  <div class="channels_box">
    <el-row style="width: 100%;padding: 10px 10px 10px 20px;background-color: #ececec">
      <span>所属分店:</span>
      <el-select v-model="shopid" placeholder="请选择分店">
        <el-option v-for="(item,index) in options" :key="index" :label="item.storeName" :value="item.id"></el-option>
      </el-select>
      <span>订单状态:</span>
      <el-select v-model="status" placeholder="请选择订单状态">
        <el-option label="全部" value="-1"></el-option>
        <el-option label="未支付" value="0"></el-option>
        <el-option label="已支付" value="1"></el-option>
        <el-option label="制作完成" value="2"></el-option>
        <el-option label="订单关闭" value="3"></el-option>
        <el-option label="订单超时" value="4"></el-option>
      </el-select>
      <span>取单码:</span>
      <el-input
        style="display:inline-block;width:200px;"
        placeholder="请输入内容"
        prefix-icon="el-icon-search"
        v-model="input">
      </el-input>

      
    </el-row>
    <el-table
      :data="tableData"
      stripe
      style="">
      <el-table-column
        prop="buyerNick"
        label="用户昵称"
        width="150">
      </el-table-column>
      <el-table-column
        prop="phoneNum"
        label="用户手机"
        width="150">
      </el-table-column>
      <el-table-column
        prop="orderId"
        label="订单编号"
        width="150">
      </el-table-column>
      <el-table-column
        prop="goodsName"
        width="120"
        label="商品">
      </el-table-column>
      <el-table-column
        prop="goodsTotalCount"
        label="商品数量">
      </el-table-column>
      <el-table-column
        prop="orderPayment"
        label="订单总价">
      </el-table-column>
      <el-table-column
        prop="payment"
        label="支付金额">
      </el-table-column>
      <el-table-column
        prop="selfGet"
        label="是否自提">
      </el-table-column>
      <el-table-column
        prop="address"
        width="150"
        label="收货地址">
      </el-table-column>
      <el-table-column
        prop="createDateStr"
        width="150"
        label="创建时间">
      </el-table-column>
      <el-table-column
        prop="takeCode"
        width="100"
        label="取单码">
      </el-table-column>
      <el-table-column
        prop="makeCompleteSendStatus"
        label="完成通知">
        <template slot-scope="scope">
          <span v-if="scope.row.makeCompleteSendStatus=='已发送'" style="color: green;">{{scope.row.makeCompleteSendStatus}}</span>
          <span v-else style="color: red;">{{scope.row.makeCompleteSendStatus}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="closeSendStatus"
        label="关闭通知">
        <template slot-scope="scope">
          <span v-if="scope.row.makeCompleteSendStatus=='已发送'" style="color: green;">{{scope.row.closeSendStatus}}</span>
          <span v-else style="color: red;">{{scope.row.closeSendStatus}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="storeName"
        width="100"
        label="店铺">
      </el-table-column>
      <el-table-column
        prop="status"
        width="80"
        label="订单状态">
        <template slot-scope="scope">
          <span>{{scope.row.status}}</span>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="180">
        <template slot-scope="scope">
          <el-button @click="toDesc(scope.row)" type="text" size="small">详情</el-button>
          <el-button @click="toUpdateStatus(scope.row,2)" type="text" size="small">制作完成</el-button>
          <el-button @click="toUpdateStatus(scope.row,3)" type="text" size="small">关闭</el-button>
          <el-button @click="toPrintingOrder(scope.row)" type="text" size="small">打印</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="订单详情" :visible.sync="dialogFormVisible">
      <el-table :data="orderDescData">
        <el-table-column property="id" label="明细id" width="70" ></el-table-column>
        <el-table-column property="title" label="商品名称" ></el-table-column>
        <el-table-column property="price" label="单价" ></el-table-column>
        <el-table-column property="num" label="数量" ></el-table-column>
        <el-table-column property="totalFee" label="总价"></el-table-column>
        <el-table-column property="skuDetailDesc" label="规格"></el-table-column>
        <el-table-column
        fixed="right"
        label="操作"
        width="80">
        <template slot-scope="scope">
          <el-button @click="toPrintingDesc(scope.row,'')" type="text" size="small">打印</el-button>
        </template>
      </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="toPrintingDesc(orderDescData[0],'all')">全部打印</el-button>
      </div>
    </el-dialog>
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
    
  </div>

</template>

<script>
  import apis from '../../env/apis.js'
  import axios from '../../env/axios.js'
  export default {
    name: 'OrderList',
    data() {
      return {
        status:'-1',
        options: [],
        shopid: '',
        tableData: [],
        totalnum: 0,
        currentpage: 1,
        pagesize: 10,
        dialogFormVisible: false,
        formLabelWidth: '120px',
        orderDescData:  [],
        input: '',
        ownShop: []
      }
    },
    watch:{
      status(val){
        this.getTableListFS()
      },
      shopid(val){
        this.getTableListFS()
      },
      input(val){
        this.getTableListFS()
      },
      // "$store.state.base.userinfo"(val){
      //   let list = val.storeIds.split(',')
      //   this.ownShop = list
      //   this.getShopListFS()
      // }
    },
    created(){
      this.initList();
    },
    mounted(){
      
    },
    methods: {
      async initList() {
        const shopApi = apis.getStoreByUser;
        const shopRes = await axios.get(shopApi);
        if (shopRes && shopRes.data && shopRes.data.code === 100000) {
          this.ownShop = shopRes.data.data;
          this.shopid = shopRes.data.data[0].id;
          this.options = shopRes.data.data;
          this.getShopListFS();
        }
      },
      getShopListFS(){
        let url = `${apis.getShopListFS}/-1`
        axios.get(url).then(res =>{
            //this.options = res.data.data
            let list = res.data.data
            for(let i=0;i<list.length;i++){
              let obj = list[i]
              for(let j=0;j<this.ownShop.length;j++){
                if(this.ownShop[j]==obj.id){
                  this.options.push(obj)
                }
              }
            }
            this.shopid = this.options[0].id
            this.getTableListFS()
        }).catch(err =>{
          console.log(err)
        })
      },
      getTableListFS(options={}){
          // let url = ''
          // if(this.input!=""){
          //   url = `${apis.getOrderListFS}${this.shopid}/${this.status}/${this.pagesize}/${this.currentpage}/${this.input}`
          // }else{
          //   url = `${apis.getOrderListFS}${this.shopid}/${this.status}/${this.pagesize}/${this.currentpage}/-1`
          // }
          let url = apis.getOrderListFS
          let pram = {
            pageSize: this.pagesize,
            pageNum: this.currentpage,
            storeId: this.shopid,
            orderStatus: this.status,
          };
          if (this.input) {
            pram.takeCode = this.input;
          }

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
             let status = val[i].status
             if(status==0){
               val[i].status = "未支付"
             }else if(status==1){
               val[i].status = "已支付"
             }else if(status==2){
               val[i].status = "制作完成"
             }else if(status==3){
               val[i].status = "订单关闭"
             }else if(status==4){
               val[i].status = "订单超时"
             }
             let selfGet = val[i].selfGet
             if(selfGet==0){
               val[i].selfGet = "自提"
             }else if(selfGet==1){
               val[i].selfGet = "外送"
             }
             let makeCompleteSendStatus = val[i].makeCompleteSendStatus
             if(makeCompleteSendStatus==0){
               val[i].makeCompleteSendStatus = "未发送"
             }else if(makeCompleteSendStatus==1){
               val[i].makeCompleteSendStatus = "已发送"
             }else{
               val[i].makeCompleteSendStatus = "发送失败"
             }
             let closeSendStatus = val[i].closeSendStatus
             if(closeSendStatus==0){
               val[i].closeSendStatus = "未发送"
             }else if(closeSendStatus==1){
               val[i].closeSendStatus = "已发送"
             }else{
               val[i].closeSendStatus = "发送失败"
             }
             list.push(val[i])
          }
          return list
      },
      handleSizeChange(val) {
        this.pagesize = val
        this.getTableListFS()
      },
      handleCurrentChange(val) {
        this.currentpage = val
        this.getTableListFS()
      },
      toDesc(val){
        this.dialogFormVisible = true
        let url = `${apis.getOrderDetail}/${val.orderId}`
        axios.get(url).then(res =>{
            this.orderDescData = res.data.data
        }).catch(err =>{
          console.log(err)
        })
      },
      toUpdateStatus(val1,val2){
        let url = `${apis.updateOrderStatus}${val1.storeId}/${val1.orderId}/${val2}`
        axios.get(url).then(res =>{
            this.getTableListFS()
            this.$message({
              type:'success',
              message: "修改成功"
            })
        }).catch(err =>{
          console.log(err)
        })
      },
      toPrintingOrder(val){
        let url = `${apis.toPrintingOrder}/${val.orderId}`
        axios.get(url).then(res =>{
            this.$message({
              type:'success',
              message: "打印成功"
            })
        }).catch(err =>{
          console.log(err)
        })
      },
      toPrintingDesc(val,val2){
        let url;
        if(val2=='all'){
          url = `${apis.toPrintingDesc}/${val.orderId}/-1`
        }else{
          url = `${apis.toPrintingDesc}/${val.orderId}/${val.id}`
        }
        axios.get(url).then(res =>{
            this.$message({
              type:'success',
              message: "打印成功"
            })
        }).catch(err =>{
          console.log(err)
        })
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
