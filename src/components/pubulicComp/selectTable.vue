<template>
  <div>
    <el-table
      ref="multipleTable"
      :data="list"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="remark" label="名称" width="300"></el-table-column>
    </el-table>
    <div style="margin-top: 20px">
      <!-- <el-button @click="toggleSelection([tableData[1], tableData[2]])">切换第二、第三行的选中状态</el-button>
      <el-button @click="toggleSelection()">取消选择</el-button> -->
    </div>
  </div>
</template>

<script>
export default {
  props: {
    list: {
      type: Array,
      default: () => ([]),
    },
    onChange: {
      type: Function,
      default: () => {},
    }
  },
  data() {
    return {
      tableData: [],
      multipleSelection: []
    };
  },
  watch: {
    list: (newVal, oldVal) => {
      console.log('12', newVal)
    },
  },
  methods: {
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
          obj.skuDetails = child;
          obj.children = child;
          return obj;
        })
      },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleSelectionChange(val) {
      this.onChange(val)
      this.multipleSelection = val;
    }
  }
};
</script>
<style scoped>
.el-scrollbar .el-scrollbar__view .el-select-dropdown__item {
  height: auto;
  max-height: 274px;
  padding: 0;
  overflow: hidden;
  overflow-y: auto;
  margin-right: -40px !important;
  margin-top: -10px !important;
}
.el-select-dropdown__item.selected {
  font-weight: normal;
}
ul li >>> .el-tree .el-tree-node__content {
  height: auto;
  padding: 0 20px;
}
.el-tree-node__label {
  font-weight: normal;
}
.el-tree >>> .is-current .el-tree-node__label {
  color: #409eff;
  font-weight: 700;
}
.el-tree >>> .is-current .el-tree-node__children .el-tree-node__label {
  color: #606266;
  font-weight: normal;
}
</style>