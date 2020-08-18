<template>
  <div class="channels_box">
    <el-row style="width: 100%;padding: 10px 10px 10px 20px;background-color: #ececec">
      <el-button type="primary" @click="toAdd()" icon="el-icon-edit-outline">新增用户</el-button>
      <span style="margin-left: 10px;margin-right: 5px">所属分店:</span>
      <el-select v-model="storeId" placeholder="请选择分店">
        <el-option v-for="(item,index) in options" :key="index" :label="item.storeName" :value="item.id"></el-option>
      </el-select>
      <el-button @click="toSearch()" style="margin-left:20px;" icon="el-icon-search" circle></el-button>
    </el-row>
    <el-table :data="tableData" stripe style="width: 100%;padding: 20px">
      <el-table-column prop="nickName" label="昵称" width="180"></el-table-column>
      <el-table-column prop="oppenId" label="oppenId"></el-table-column>
      <el-table-column prop="userPhone" label="电话号码"></el-table-column>
      <el-table-column label="操作" :width="200">
        <template slot-scope="scope">
          <!-- <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button> -->
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
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
      :total="totalnum"
    ></el-pagination>

    <el-dialog title="新增免支付用户" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="rules" ref="form">
        <el-form-item label="手机" :label-width="formLabelWidth" prop="userPhone">
          <el-input v-model="form.userPhone" autocomplete="off" placeholder="请输入">
            <el-button slot="append" @click="getApiUser">查询</el-button>
          </el-input>
        </el-form-item>
        <el-form-item label="所属分店" :label-width="formLabelWidth" prop="storeIds">
          <el-select v-model="form.storeId" placeholder="请选择" style="width:100%">
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
import apis from "../../env/apis.js";
import axios from "../../env/axios.js";
export default {
  name: "FreeUserInfo",
  data() {
    var checkName = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入"));
      } else {
        callback();
      }
    };
    return {
      totalnum: 0,
      currentpage: 1,
      pagesize: 10,
      tableData: [],
      dialogFormVisible: false,
      form: {
        userPhone: "",
        storeId: "",
        id: ""
      },
      rules: {
        mobile: [{ validator: checkName, required: true, trigger: "blur" }],
      },
      formLabelWidth: "120px",
      options: [],
      type: "add",
      roleList: [],
      storeId: '',
      apiUserList: [],
    };
  },
  created() {
    this.getShopListFS();
    this.getTableListFS();
  },
  watch: {
    // 'form.userPhone': function(val) {
    //   this.getApiUser(val)
    // },
  },
  mounted() {},
  methods: {
    toSearch() {
      const options = {
        storeId: this.storeId,
      }
      this.getTableListFS(options);
    },
    getApiUser() {
      const url = apis.getApiUser
      const parm = {
        pageNum: 1,
        pageSize: 1000,
        userPhone: this.form.userPhone,
      }
      axios
        .post(url, parm)
        .then(res => {
          if (res.data.code === 100000) {
            const apiUserList = res.data.data;
            this.apiUserList = apiUserList
            console.log(this.apiUserList, res.data.data)
          }
        })
    },
    handleSizeChange(val) {
      this.pagesize = val;
      this.getTableListFS();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currentpage = val;
      this.getTableListFS();
    },

    toAdd() {
      this.type = "add";
      this.dialogFormVisible = true;
      this.form = {
        storeId: ''
      };
    },

    async toSave() {
      console.log(this.apiUserList[0].id, 'id')
      const parm = {
        storeId: this.form.storeId,
        userId: this.apiUserList[0].id
      };
      const url = apis.saveFreeUser;
      axios
        .post(url, parm)
        .then(res => {
          if (res.data.code == 100000) {
            this.$message({
              type: "success",
              message: "添加成功"
            });
            this.dialogFormVisible = false;
            this.getTableListFS();
          } else {
            this.$message({
              type: "info",
              message: res.data.msg
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
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
    getTableListFS(options={}) {
      let url = apis.getFreeUserList;
      let pram = {
        pageSize: this.pagesize,
        pageNum: this.currentpage,
        storeId: this.storeId
      };
      axios
        .post(url, {...pram, ...options})
        .then(res => {
          if (res.data.code === 100000) {
            this.tableData = res.data.data;
            this.totalnum = res.data.total;
          } else {
            this.$message(res.data.msg || '获取数据失败')
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    handleDelete(index, row) {
      this.$confirm("此操作将删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.toDelete(row);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    toDelete(val) {
      let url = apis.deleteFreeUser;
      axios(
        {
            methods: "get",
            url,
            params: {
              id: val.id,
            }
        }
      )
        .then(res => {
          if (res.data.code == 100000) {
            this.$message({
              type: "success",
              message: "删除成功"
            });
            this.dialogFormVisible = false;
            this.getTableListFS();
          } else {
            this.$message({
              type: "info",
              message: res.data.msg
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    handleEdit(index, row) {
      const url = apis.getUserInfoById;
      axios(
        {
            methods: "get",
            url,
            params: {
              userId: row.id,
            }
        }
      ).then(res => {
        this.type = "update";
        this.dialogFormVisible = true;
        const params = {
          ...res.data.data,
          password: null,
        }
        if (params.storeIds) {
          const arr = params.storeIds.split(',')
          params.storeIds = arr.map(item => (Number(item)));
        }
        this.form = params;
      })
    },
  }
};
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
