<template>
  <div v-loading="loading" class="dashboard-container">
    <el-card class="tree-card">
      <!-- 实现头部结构 -->
      <tree-tools
        :tree-node="company"
        :is-root="true"
        @addDepartments="addDepartments"
      />

      <!-- 实现静态的树形结构 -->
      <el-tree :data="departs" :props="defaultProps" :default-expand-all="true">
        <!-- 传入内容 插槽内容 会循环多次 有多少节点 就循环多少次 -->
        <!-- 作用域插槽 slot-scope="obj" 接收传递给插槽的数据   data 每个节点的数据对象-->
        <tree-tools
          slot-scope="{ data }"
          :tree-node="data"
          @delDepartments="loadDepartments"
          @addDepartments="addDepartments"
          @editDepartments="editDepartments"
        />
      </el-tree>
      <!-- 新增和编辑部门时的弹出框 -->
      <add-dept
        v-if="dialogFormVisible"
        ref="addDept"
        :dialog-form-visible="dialogFormVisible"
        :current-node="currentNode"
        :status-code="statusCode"
        @closeAddDept="dialogFormVisible=false"
        @addDepartments="loadDepartments"
      />
    </el-card>
  </div>
</template>
<script>
import TreeTools from './components/tree-tools.vue'
import AddDept from './components/add-dept.vue'
import { getDepartments } from '@/api/departments'
import { tranListToTreeData } from '@/utils/index'
export default {
  components: {
    TreeTools,
    AddDept
  },
  data() {
    return {
      defaultProps: {
        children: 'children', // 通过children属性来寻找节点的字节点
        label: 'name'// 通过name属性来显示节点的名称
      },
      departs: [],
      company: { name: '重庆xxxxxx科技股份有限公司', manager: '负责人', id: '' },
      dialogFormVisible: false,
      currentNode: {},
      statusCode: 'add', // 判断弹出层是编辑状态还是新增状态
      loading: false // 控制进度条的开启与关闭
    }
  },
  created() {
    this.loadDepartments()
  },
  methods: {
    async loadDepartments() {
      this.loading = true
      const { depts } = await getDepartments()
      // 此时获得的公司列表是数组数据，子部门与父部门是平级的此时需要将其转换为树形结构
      const tree = tranListToTreeData(depts, '')
      this.departs = tree
      console.log(depts)
      console.log('转换之后的树形结构', tree)
      this.loading = false
    },
    addDepartments(currentNode) {
      this.dialogFormVisible = true
      this.currentNode = currentNode
      this.statusCode = 'add'
    },
    editDepartments(currentNode) {
      this.dialogFormVisible = true
      this.currentNode = currentNode
      this.statusCode = 'edit'
    }
  }
}

</script>

<style scoped>
.tree-card {
  padding: 30px  140px;
  font-size:14px;
}
.dashboard-container{
  margin: 30px;
}
</style>
