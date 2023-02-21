<template>
  <el-row type="flex" justify="space-between" align="middle" style="height: 40px; width: 100%">
    <el-col>
      <span>{{ treeNode.name }}</span>
    </el-col>
    <el-col :span="4">
      <el-row type="flex" justify="end">
        <el-col>
          <span>{{ treeNode.manager }}</span>
        </el-col>
        <el-col>
          <!-- 下拉菜单 -->
          <el-dropdown @command="operateDepts">
            <span>
              操作<i class="el-icon-arrow-down" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="add">添加子部门</el-dropdown-item>
              <el-dropdown-item v-if="!isRoot" command="edit">编辑部门</el-dropdown-item>
              <el-dropdown-item v-if="!isRoot" command="del">删除部门</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
import { delDepartments } from '@/api/departments'
export default {
  name: 'TreeTools',
  props: {
    treeNode: {
      required: true,
      type: Object
    },
    isRoot: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    operateDepts(command) {
      if (command === 'add') {
        // 添加子部门部门
      } else if (command === 'edit') {
        // 编辑部门
      } else {
        // 删除部门
        this.$confirm('确定要删除该部门吗').then(async() => {
          // 调用接口删除后端里面的数据
          await delDepartments(this.treeNode.id)
          //   删除数据成功
          this.$message.success('删除部门成功')
          //   通知父节点重新拉取部门列表数据
          this.$emit('delDepartments')
        })
      }
    }
  }
}
</script>

<style>

</style>
