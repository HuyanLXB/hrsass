<template>
  <el-dialog title="分配角色" :visible="showDialog" @close="btnCancel">
    <el-checkbox-group v-model="roleId">
      <!-- label属性绑定的值就是往数组roleId里新增的值，如果没有插值表达式的话也是在页面上显示的值 -->
      <el-checkbox v-for="item in checkList" :key="item.id" :label="item.id">
        {{ item.name }}
      </el-checkbox>
    </el-checkbox-group>
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button
          size="small"
          @click="btnCancel"
        >取消</el-button>
        <el-button
          size="small"
          type="primary"
          @click="btnOk"
        >确定</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getRoleList } from '@/api/setting'
import { getUserInfoById } from '@/api/user'
import { assignRoles } from '@/api/employees'
export default {
  name: 'AssignRole',
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    userId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      checkList: [], // 角色列表
      roleId: [] // 角色id列表
    }
  },
  created() {
    this.loadRoleList()
    this.loadUserInfo()
  },
  methods: {
    btnCancel() {
      this.$emit('update:showDialog', false)
      //   数据还原
      this.roleId = []
    },
    async btnOk() {
      // 调用接口完成角色更新
      try {
        await assignRoles({
          id: this.userId,
          roleIds: this.roleId
        })
        this.$message.success('角色分配成功')
        // 关闭弹窗
        this.btnCancel()
      } catch (error) {
        this.$message.error('角色分配失败')
        console.log(error)
      }
    },
    async loadRoleList() {
      try {
        const { rows } = await getRoleList({ page: 1, pagesize: 100 })
        this.checkList = rows
        console.log(rows)
      } catch (error) {
        console.log(error)
      }
    },
    async loadUserInfo() {
      try {
        const { roleIds } = await getUserInfoById(this.userId)
        this.roleId = roleIds
      } catch (error) {
        console.log(error)
      }
    }
  }
}

</script>

<style>

</style>
