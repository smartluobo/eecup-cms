<template>
  <div class="channels_box">
    <el-row style="width: 100%;padding: 10px 10px 10px 20px;background-color: #ececec">
      <el-button type="primary" @click="toAddUser()" icon="el-icon-edit-outline">新增菜单</el-button>
    </el-row>
    <el-table :data="tableData" style="width: 100%;padding: 20px" 
    :tree-props="{children: 'children', hasChildren: 'hasChildren'}" row-key="id">
      <el-table-column prop="name" label="名称" width="180">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="href" label="链接">
        <template slot-scope="scope">
          <span>{{scope.row.href}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="isShow" label="是否可见">
        <template slot-scope="scope">
          <span>{{scope.row.isShow === 1 ? '可见' : '隐藏'}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="permission" label="权限标识"></el-table-column>
      <el-table-column label="操作" :width="340">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          <el-button size="mini" @click="addMore(scope.$index, scope.row)">添加下级菜单</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="type=='add'?'新增菜单':'update'?'修改菜单':'添加下级'" :visible.sync="dialogFormVisible">
      
      <el-form :model="form" :rules="rules" ref="form">
        <el-form-item label="上级菜单" :label-width="formLabelWidth" required>
          <select-tree
            :options="menuListNew"
            @getValue="getParent"
            v-if="dialogFormVisible"
            :value="form.parentId || 0"
          ></select-tree>
        </el-form-item>
        <el-form-item label="菜单名称" :label-width="formLabelWidth" prop="name">
          <el-input v-model="form.name" autocomplete="off" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="链接" :label-width="formLabelWidth">
          <el-input v-model="form.href" autocomplete="off" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="是否可见" :label-width="formLabelWidth" prop="isShow">
          <el-radio-group v-model="form.isShow" size="medium">
            <el-radio :label="1">可见</el-radio>
            <el-radio :label="0">隐藏</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="权限标识" :label-width="formLabelWidth">
          <el-input v-model="form.permission" autocomplete="off" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="ICON" :label-width="formLabelWidth">
          <el-input v-model="form.icon" autocomplete="off" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="排序" :label-width="formLabelWidth">
          <el-input type="number" v-model="form.sort" autocomplete="off" placeholder="请输入"></el-input>
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
import selectTree from '../pubulicComp/selectTree';
export default {
  name: "Menu",
  data() {
    var checkName = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入"));
      } else {
        callback();
      }
    };
    return {
      name: "",
      loginName: "",
      tableData: [],
      dialogFormVisible: false,
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      form: {
        name: "",
        dataScope: "",
        roleType: "",
        remarks: "",
        parentId: "",
        parentIds: "",
        associatedRoleList: [],
        menuList: [6],
        id: "",
      },
      rules: {
        name: [{ validator: checkName, required: true, trigger: "blur" }],
        isShow: [{ validator: checkName, required: true, trigger: "blur" }],
      },
      formLabelWidth: "120px",
      options: [],
      type: "add",
      menuListNew: [],
    };
  },
  components: {
    selectTree,
  },
  computed: {
    
  },
  created() {
    this.getTableListFS();
  },
  mounted() {},
  watch: {
    dialogFormVisible: function(newVal, oldVal) {
      if (!newVal && oldVal && this.type === 'add') {
        this.initEmptyForm()
      }
    }
  },
  methods: {
    toSearch() {},
    getParent(e) {
      this.form = { ...this.form, parentId: e.parentId }
    },
    initList(data) {
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
            permission,
            subMenuList = []
          } = item;
          const menuItem = {
            id,
            path: href || `${id}`,
            href,
            icon: icon ? icon : false,
            name,
            label: name,
            isShow,
            permission,
          };
          if (subMenuList.length) {
            // eslint-disable-next-line no-param-reassign
            menuItem.children = getSourceData(subMenuList);
            // menuItem.routes = menuItem.children;
          }
          menuDataById[id] = menuItem;
          menuDataByPath[menuItem.path] = menuItem;
          sourceData.push(menuItem);
        });
        return sourceData;
      };
      const menuDataFromServers = getSourceData([data]);
      self.menuListNew = menuDataFromServers;
      self.tableData = menuDataFromServers[0].children;
    },
    async toSave() {
      const idUrl = apis.getMenuInfoById;
      const res = await axios({
        methods: "get",
        url: idUrl,
        params: {
          menuId: this.form.parentId,
        }
      })
      if (res.data.code !== 100000 || !res.data.data) {
        this.$message('请求菜单信息失败')
        return
      }
      const parent = res.data.data;
      const parm = {
        ...this.form,
        parentIds: parent.parentIds,
        parent,
      };
      let url = "";
      if (this.type == "add" || this.type == 'addMore') {
        url = apis.addMenu;
        delete parm.id;
      } else {
        url = apis.updateMenu; // 更新
      }
      axios
        .post(url, parm)
        .then(res => {
          if (res.data.code === 100000) {
            this.$message({
              type: "success",
              message: this.type == "add" || this.type == "addMore" ? '添加成功' : '编辑成功'
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
    getTableListFS() {
      let url = apis.fetchMenuList;
      axios
        .get(url)
        .then(res => {
          this.initList(res.data.data)
        })
        .catch(err => {
          console.log(err);
        });
    },
    handleDelete(index, row) {
      this.$confirm("此操作将永久删除该菜单, 是否继续?", "提示", {
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
      let url = apis.deleteMenu;
      axios(
        {
            methods: "get",
            url,
            params: {
              menuId: val.id,
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
    initEmptyForm() {
      this.form = {
        id: null,
        parentId: "",
        parentIds: "",
        name: "",
        sort: "",
        isShow: "",
        permission: "",
        href: "",
        remarks: "",
      };
    },
    toAddUser() {
      this.type = "add";
      this.dialogFormVisible = true;
      this.initEmptyForm()
      this.form.isShow = 1;
    },
    handleEdit(index, row) {
      const url = apis.getMenuInfoById;
      axios(
        {
            methods: "get",
            url,
            params: {
              menuId: row.id,
            }
        }
      ).then(res => {
        if (res.data.code === 100000) {
          this.type = "update";
          this.dialogFormVisible = true;
          this.form = res.data.data;
        } else {
          this.$message('请求菜单信息失败');
        }
      })
    },
    addMore(index, row) {
      this.type = "addMore";
      this.dialogFormVisible = true;
      const record = JSON.parse(JSON.stringify(row));
      this.form = record;
      this.form.parentId = this.form.id;
      this.form.name = "";
      this.form.href = "";
      delete this.form.id;
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
