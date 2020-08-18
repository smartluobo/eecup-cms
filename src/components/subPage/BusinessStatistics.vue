<template>
  <div class="channels_box">
    <el-row style="width: 100%;padding: 10px 10px 10px 20px;background-color: #ececec">
      <span style="margin-left:20px;">店铺名称:</span>
      <el-select v-model="storeId" placeholder="请选所属店铺">
            <el-option v-for="(item,index) in options" :key="index" :label="item.storeName" :value="item.id"></el-option>
      </el-select>
      <span style="margin-left:20px;">时间:</span>
      <el-date-picker
        v-model="time"
        style="width:400px;"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期">
      </el-date-picker>
      <el-button @click=toSearch() style="margin-left:20px;" icon="el-icon-search" circle></el-button>
    </el-row>
    <el-table
      :data="tableData"
      stripe
      style="width: 100%;padding: 20px">
      <el-table-column
        prop="goodsCount"
        label="商品数量"
        width="180">
      </el-table-column>
      <el-table-column
        prop="orderCount"
        label="订单数量">
      </el-table-column>
      <el-table-column
        prop="payAmount"
        label="实付金额">
      </el-table-column>
      <el-table-column
        prop="originalPriceAmount"
        label="原价金额">
      </el-table-column>
      
    </el-table>
    
    
  </div>
</template>

<script>
  import apis from '../../env/apis.js'
  import axios from '../../env/axios.js'
  export default {
    name: 'GoodList',
    data() {
      return {
        storeId:'',
        options: [],
        time: [new Date(), new Date()],
        tableData: [],
      }
    },
    created(){
      this.getShopListFS()
    },
    mounted(){
      
    },
    watch:{
      
    },
    methods: {
      toSearch(){
        this.getTableListFS()
      },
      getShopListFS(){
        const storeUrl = apis.getStoreByUser;
        axios.get(storeUrl).then(res => {
          if (res.data && res.data.code === 100000) {
            this.options = res.data.data;
            this.storeId = res.data.data[0].id;
            this.getTableListFS()
          }
        });
       
      },
      
    
      getTableListFS(){
          let pram = {}
          let startTime = this.time[0]
          startTime = this.dateFtt('yyyy-MM-dd',startTime)
          pram.startTime = new Date(startTime+' 00:00:00').getTime();
          let endTime = this.time[1]
          endTime = this.dateFtt('yyyy-MM-dd',endTime)
          pram.endTime = new Date(endTime+' 23:59:59').getTime();
          if(this.storeId!=""){
            pram.storeId = this.storeId
          }else{
            pram.storeId = this.options[0].id
          }
          let url = apis.turnoverStatistical
          axios.post(url,pram).then(res =>{
              this.tableData = this.getListData(res.data.data)
          }).catch(err =>{
            console.log(err)
          })
      },
      dateFtt(fmt,date){ 
          var o = {   
              "M+" : date.getMonth()+1,                 //月份   
              "d+" : date.getDate(),                    //日   
              "h+" : date.getHours(),                   //小时   
              "m+" : date.getMinutes(),                 //分   
              "s+" : date.getSeconds(),                 //秒   
              "q+" : Math.floor((date.getMonth()+3)/3), //季度   
              "S"  : date.getMilliseconds()             //毫秒   
          };   
          if(/(y+)/.test(fmt))   
              fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));   
          for(var k in o)   
              if(new RegExp("("+ k +")").test(fmt))   
          fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
          return fmt;   
      }, 
      getListData(val){
          var list = []
          list.push(val)
          return list
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
