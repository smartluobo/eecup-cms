<template>
  <div class="channels_box">
    <el-row style="width: 100%;padding: 10px 10px 10px 20px;background-color: #ececec">
      <el-button type="primary" @click="toAddUser()" icon="el-icon-edit-outline">新增用户</el-button>
      <span style="margin-left:10px;">用户名称:</span>
      <el-input
        style="display:inline-block;width:200px;margin-left:10px;"
        placeholder="请输入内容"
        prefix-icon="el-icon-search"
        v-model="name"
      ></el-input>
      <span style="margin-left:10px;">登录名称:</span>
      <el-input
        style="display:inline-block;width:200px;margin-left:10px;"
        placeholder="请输入内容"
        prefix-icon="el-icon-search"
        v-model="loginName"
      ></el-input>
      <el-button @click="toSearch()" style="margin-left:20px;" icon="el-icon-search" circle></el-button>
    </el-row>
    <el-table :data="tableData" stripe style="width: 100%;padding: 20px">
      <el-table-column prop="loginName" label="登陆名称" width="180"></el-table-column>
      <el-table-column prop="name" label="真实姓名"></el-table-column>
      <el-table-column prop="mobile" label="手机"></el-table-column>
      <el-table-column prop="storeName" label="店铺">
        <!-- <template slot-scope="scope">
          <div v-for="(item, index) in ((scope.row.storeName && scope.row.storeName.split(',')) || [] )" :key="item">
            <el-tag v-if="index % 2 === 0">{{item}}</el-tag>
            <el-tag v-if="index % 2 !== 0" type="success" style="margin-left: 10px;">{{item}}</el-tag>
          </div>
        </template> -->
      </el-table-column>
      <el-table-column prop="phone" label="电话"></el-table-column>
      <el-table-column prop="createDate" label="注册时间"></el-table-column>
      <el-table-column prop="updateDate" label="更新时间"></el-table-column>
      <el-table-column label="操作" :width="200">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
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

    <el-dialog :title="type=='add'?'新增用户':'修改用户'" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="rules" ref="form">
        <el-form-item label="登录名" :label-width="formLabelWidth" prop="loginName">
          <el-input v-model="form.loginName" autocomplete="off" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="用户名称" :label-width="formLabelWidth" prop="name">
          <el-input v-model="form.name" autocomplete="off" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth" prop="password">
          <el-input type="password" v-model="form.password" autocomplete="off" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" :label-width="formLabelWidth" prop="confirmPassword">
          <el-input
            type="password"
            v-model="form.confirmPassword"
            autocomplete="off"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth">
          <el-input v-model="form.email" autocomplete="off" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth">
          <el-input v-model="form.phone" autocomplete="off" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="手机" :label-width="formLabelWidth" prop="mobile">
          <el-input v-model="form.mobile" autocomplete="off" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="备注" :label-width="formLabelWidth">
          <el-input v-model="form.remarks" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="用户角色" :label-width="formLabelWidth" prop="sysRoleIds">
          <el-select v-model="form.sysRoleIds" multiple placeholder="请选择" style="width:100%;">
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属分店" :label-width="formLabelWidth" prop="storeIds">
          <el-select v-model="form.storeIds" multiple placeholder="请选择" style="width:100%">
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
  name: "NewUserInfo",
  data() {
    var checkName = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入"));
      } else {
        callback();
      }
    };
    var checkArr = (rule, value, callback) => {
      if (!value || !value.length) {
        callback(new Error("请输入"));
      } else {
        callback();
      }
    };
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.form.confirmPassword !== "") {
          this.$refs.form.validateField("confirmPassword");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.form.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      totalnum: 0,
      currentpage: 1,
      pagesize: 10,
      name: "",
      loginName: "",
      tableData: [],
      dialogFormVisible: false,
      form: {
        loginName: "",
        realname: "",
        password: "",
        confirmPassword: "",
        email: "",
        phone: "",
        remarks: "",
        storeIds: [],
        sysRoleIds: [],
        id: ""
      },
      rules: {
        password: [{ validator: validatePass, required: true, trigger: "blur" }],
        confirmPassword: [{ validator: validatePass2, required: true, trigger: "blur" }],
        storeIds: [{ validator: checkName, required: true, trigger: "blur" }],
        mobile: [{ validator: checkName, required: true, trigger: "blur" }],
        name: [{ validator: checkName, required: true, trigger: "blur" }],
        loginName: [{ validator: checkName, required: true, trigger: "blur" }],
        sysRoleIds: [{ validator: checkArr, required: true, trigger: "blur" }],
      },
      formLabelWidth: "120px",
      options: [],
      shoplist: [],
      type: "add",
      roleList: [],
    };
  },
  created() {
    this.getShopListFS();
    this.getTableListFS();
  },
  watch: {
    'form.loginName': function(val) {
      const url = apis.checkUserName;
      const that = this;
      if (this.type === 'add' && val) {
        axios({
          method: 'get',
          url,
          params: {
            loginName: val,
          }
        }).then(res => {
          if (res && res.data.code === 100000 && !res.data.data) {
            that.$message({
              type: "info",
              message: "名称被占用"
            });
          }
        })
      }
    },
  },
  mounted() {},
  methods: {
    toSearch() {
      const options = {
        name: this.name,
        loginName: this.loginName,
      }
      this.getTableListFS(options);
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

    async getAllRoleList() {
      const url = apis.getAllRoleList;
      const res = await axios.get(url);
      console.log('res', res)
      if (res.data.code === 100000) {
        this.roleList = res.data.data.operateRoles;
      }
    },
    toAddUser() {
      this.getAllRoleList();
      this.type = "add";
      this.dialogFormVisible = true;
      this.form = {
        loginName: "",
        realname: "",
        password: "",
        confirmPassword: "",
        email: "",
        phone: "",
        remarks: "",
        storeIds: [],
        sysRoleIds: []
      };
    },

    async toSave() {
      const parm = {
        ...this.form
      };
      const sysRoleList =this.roleList.filter(item => this.form.sysRoleIds.indexOf(item.id) !== -1);
      parm.sysRoleList = sysRoleList || [];
      console.log('sysRoleList', sysRoleList)
      if (parm.storeIds) {
        parm.storeIds = parm.storeIds.join(',');
      }
      let url = "";
      if (this.type == "add") {
        url = apis.addNewUser;
        delete this.form.id;
      } else {
        url = apis.updateNewUser; // 更新
      }
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
    getStrMenuIds(list) {
      let str = "";
      for (let i = 0; i < list.length; i++) {
        if (i == 0) {
          str = list[i];
        } else {
          str = str + "," + list[i];
        }
      }
      return str;
    },
    getShopListFS() {
      let url = `${apis.getShopListFS}/-1`;
      axios
        .get(url)
        .then(res => {
          this.options = res.data.data;
          this.getTableListFS();
        })
        .catch(err => {
          console.log(err);
        });
    },
    getTableListFS(options={}) {
      let url = apis.fetchNewUserInfo;
      let pram = {
        pageSize: this.pagesize,
        pageNum: this.currentpage
      };
      axios(
          {
            methods: "get",
            url,
            params: {
              ...pram,
              ...options,
            }
          }
        )
        .then(res => {
          if (res.data.code === 100000) {
            this.tableData = res.data.data.data;
            this.totalnum = res.data.data.total;
          } else {
            this.$message(res.data.msg || '获取数据失败')
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    handleDelete(index, row) {
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.toDeleteUser(row);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    toDeleteUser(val) {
      let url = apis.deleteNewUser;
      axios(
        {
            methods: "get",
            url,
            params: {
              userId: val.id,
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
      this.getAllRoleList();
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
    getStrStoreIds() {
      let str = "";
      for (let i = 0; i < this.shoplist.length; i++) {
        if (i == 0) {
          str = this.shoplist[i];
        } else {
          str = str + "," + this.shoplist[i];
        }
      }
      return str;
    },
    getStoreIds(val) {
      let list = [];
      let storelist = val == null ? "" : val.split(",");
      for (let i = 0; i < storelist.length; i++) {
        let value = storelist[i];
        for (let j = 0; j < this.options.length; j++) {
          if (value == this.options[j].storeName) {
            list.push(this.options[j].id);
          }
        }
      }
      return list;
    }
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
