<template>
  <div class="channels_box">
    <el-row style="width: 100%;padding: 10px 10px 10px 20px;background-color: #ececec">
      <el-button type="primary" @click="toAddUser()" icon="el-icon-edit-outline">新增角色</el-button>
      <span style="margin-left:10px;">角色名称:</span>
      <el-input
        style="display:inline-block;width:200px;margin-left:10px;"
        placeholder="请输入内容"
        prefix-icon="el-icon-search"
        v-model="roleName"
      ></el-input>
      <el-button @click="toSearch()" style="margin-left:20px;" icon="el-icon-search" circle></el-button>
    </el-row>
    <el-table :data="tableData" stripe style="width: 100%;padding: 20px">
      <el-table-column prop="name" label="角色名称" width="180"></el-table-column>
      <!-- <el-table-column prop="roleType" label="角色类型"></el-table-column> -->
      <el-table-column prop="remarks" label="说明"></el-table-column>
      <el-table-column prop="createDate" label="创建时间"></el-table-column>
      <el-table-column prop="updateDate" label="更新时间"></el-table-column>
      <el-table-column prop="updateBy" label="操作人"></el-table-column>
      <el-table-column label="操作">
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
      :total="totalnum">
    </el-pagination>
    <el-dialog :title="type=='add'?'新增角色':'修改角色'" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="rules" ref="form">
        <el-form-item label="角色名称" :label-width="formLabelWidth" prop="name">
          <el-input v-model="form.name" autocomplete="off" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="角色说明" :label-width="formLabelWidth">
          <el-input v-model="form.remarks" autocomplete="off" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="角色类型" :label-width="formLabelWidth">
          <el-select v-model="form.roleType" placeholder="请选择">
            <el-option label="测试" value=0 ></el-option>
            <el-option label="运营" value=1 ></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="数据权限" :label-width="formLabelWidth" v-if="dataScopeList && dataScopeList.length">
          <el-select v-model="form.dataScope" label="数据权限1" multiple placeholder="请选择" style="width: 100%;">
            <el-option
              v-for="item in dataScopeList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item> -->

        <el-form-item label="权限分配" :label-width="formLabelWidth" prop="menuList">
          <el-tree
            ref="tree"
            :data="menuListNew"
            show-checkbox
            node-key="id"
            :default-expanded-keys="[1]"
            :default-checked-keys="form.menuList"
            :props="defaultProps"
          ></el-tree>
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
  name: "Role",
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
      roleName: "",
      tableData: [],
      dialogFormVisible: false,
      defaultProps: {
        children: "children",
        label: "label"
      },
      form: {
        name: "",
        dataScope: "",
        roleType: "",
        remarks: "",
        associatedRoleList: [],
        menuList: [],
        id: ""
      },
      rules: {
        name: [{ validator: checkName, required: true, trigger: "blur" }],
        menuList: [{ validator: checkName, required: true, trigger: "blur" }],
      },
      formLabelWidth: "120px",
      options: [],
      type: "add",
      menuListNew: [],
      dataScopeList: [],
    };
  },
  created() {
    this.getTableListFS();
  },
  mounted() {},
  methods: {
    toSearch() {
      const options = {
        roleName: this.roleName,
      }
      this.getTableListFS(options);
    },
    handleSizeChange(val) {
      this.pagesize = val;
      this.getTableListFS();
    },
    handleCurrentChange(val) {
      this.currentpage = val;
      this.getTableListFS();
    },

    async getMoreInfo() {
      const infoMoreUrl = apis.getRoleShowInfo;
      const infoMore = await axios({
        methods: "get",
        url: infoMoreUrl,
      });
      if (infoMore.data.code === 100000) {
        this.dataScopeList = infoMore.data.data.dataAuthor[1];
        this.initTree(infoMore.data.data.sysMenuTree);
      }
    },

    toAddUser() {
      this.type = "add";
      this.dialogFormVisible = true;
      this.getMoreInfo();
      this.form = {
        name: "",
        dataScope: "",
        roleType: "",
        remarks: "",
        associatedRoleList: [],
        menuList: [],
      };
      this.shoplist = [];
    },

    toSave() {
      const parm = {
        ...this.form,
        menuList: this.$refs.tree.getCheckedKeys(),
      };
      let url = "";
      if (this.type == "add") {
        url = apis.addRole;
        delete this.form.id;
      } else {
        url = apis.saveRole; // 更新
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
    getTableListFS(options={}) {
      let url = apis.fetchRoleList;
      let pram = {
        pageSize: this.pagesize,
        pageNum: this.currentpage
      };
      axios({
        methods: "get",
        url,
        params: {
          ...pram,
          ...options,
        }
      })
        .then(res => {
          if (res.data.code === 100000) {
            this.tableData = res.data.data.data;
            this.totalnum = res.data.data.total;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    handleDelete(index, row) {
      this.$confirm("此操作将永久删除该角色, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.toDeleteRole(row);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    toDeleteRole(val) {
      let url = apis.delRole;
      axios({
        methods: "get",
        url,
        params: {
          roleId: val.id
        }
      })
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

    initTree(data) {
      const menuDataById = {};
      const menuDataByPath = {};
      const self = this;
      const getSourceData = (arr = []) => {
        const sourceData = [];
        arr.forEach(item => {
          const {
            href,
            isShow,
            icon = "setting",
            name,
            id,
            subMenuList = []
          } = item;
          const menuItem = {
            id,
            path: href || `${id}`,
            icon: icon ? icon : false,
            name,
            label: name,
            isShow
          };
          if (subMenuList.length) {
            // eslint-disable-next-line no-param-reassign
            menuItem.children = getSourceData(subMenuList);
            menuItem.routes = menuItem.children;
          }
          menuDataById[id] = menuItem;
          menuDataByPath[menuItem.path] = menuItem;
          sourceData.push(menuItem);
        });
        return sourceData;
      };
      const menuDataFromServers = getSourceData([data]);
      self.menuListNew = menuDataFromServers;
    },

    async handleEdit(index, row) {
      const url = apis.getRoleInfoById;
      const info = await axios({
        methods: "get",
        url,
        params: {
          roleId: row.id
        }
      });
      if (info.data.code === 100000) {
        this.type = "update";
        this.dialogFormVisible = true;
        this.form = info.data.data;
        this.form.roleType = this.form.roleType + ''
      }
       this.getMoreInfo();
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
