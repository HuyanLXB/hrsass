<template>
  <el-dialog :visible="dialogFormVisible" title="新增员工" :before-close="handClose">
    <el-form ref="formData" label-width="120px" :model="addUserInfo" :rules="rules">
      <el-form-item label="姓名" prop="username">
        <el-input v-model="addUserInfo.username" style="width:80%" placeholder="请输入姓名" />
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input v-model="addUserInfo.mobile" style="width:80%" placeholder="请输入手机号" />
      </el-form-item>
      <el-form-item label="入职时间" prop="timeOfEntry">
        <el-date-picker v-model="addUserInfo.timeOfEntry" style="width:80%" placeholder="请选择入职时间" />
      </el-form-item>
      <el-form-item label="聘用形式" prop="formOfEmployment">
        <el-select v-model="addUserInfo.formOfEmployment" style="width:80%" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="工号" prop="workNumber">
        <el-input v-model="addUserInfo.workNumber" style="width:80%" placeholder="请输入工号" />
      </el-form-item>
      <el-form-item label="部门" prop="departmentName">
        <el-input
          v-model="addUserInfo.departmentName"
          style="width:80%"
          placeholder="请选择部门"
          @focus="getDepartments"
        />
        <div v-loading="loading">
          <el-tree
            v-if="isShowTree"
            :data="treeData"
            :props="defaultProps"
            @node-click="handleNodeClick"
          />
        </div>
      </el-form-item>
      <el-form-item label="转正时间" prop="correctionTime">
        <el-date-picker
          v-model="addUserInfo.correctionTime"
          type="date"
          placeholder="选择日期"
        />
      </el-form-item>
    </el-form>
    <el-row slot="footer" type="flex" justify="center">
      <!-- 列被分为24 -->
      <el-col :span="6">
        <el-button type="primary" size="small" @click="btnOk">确定</el-button>
        <el-button size="small" @click="$emit('closeAddDept')">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>
<script>
import { getDepartments } from '@/api/departments'
import { tranListToTreeData } from '@/utils/index'
import { addEmployee } from '@/api/employees'
export default {
  name: 'AddEmployee',
  props: {
    dialogFormVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      addUserInfo: {
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: ''
      },
      rules: {
        username: [{ required: true, message: '用户姓名不能为空', trigger: 'blur' }, {
          min: 1, max: 4, message: '用户姓名为1-4位'
        }],
        mobile: [{ required: true, message: '手机号不能为空', trigger: 'blur' }, {
          pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur'
        }],
        formOfEmployment: [{ required: true, message: '聘用形式不能为空', trigger: 'blur' }],
        workNumber: [{ required: true, message: '工号不能为空', trigger: 'blur' }],
        // 选择部门的校验触发方式为change
        departmentName: [{ required: true, message: '部门不能为空', trigger: 'change' }],
        timeOfEntry: [{ required: true, message: '入职时间', trigger: 'blur' }]
      },
      options: [
        {
          value: 1,
          label: '正式'
        },
        {
          value: 2,
          label: '非正式'
        }
      ],
      treeData: [], // 用来存放转化之后的树形结构
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      isShowTree: false, // 控制树形结构是否显示
      loading: false// 控制加载进度条的显示
    }
  },
  methods: {
    async btnOk() {
      try {
        //   首先要对整个表单进行一次整体校验
        await this.$refs.formData.validate()
        // 调用接口新增员工
        await addEmployee(this.addUserInfo)
        //  通知父组件重新获取数据 非常规的方法
        this.$parent.loadUserInfo()
        // 关闭弹窗
        this.$parent.dialogFormVisible = false
        // 消息提示
        this.$message.success('新增员工成功')
        console.log('OK')
      } catch (error) {
        console.log(error)
      }
    },
    handClose() {
      this.$emit('closeAddDept')
    },
    async getDepartments() {
      // 开启进度条
      this.loading = true
      const { depts } = await getDepartments()
      this.treeData = tranListToTreeData(depts, '')
      //   关闭进度条
      this.loading = false
      //   显示树形结构
      this.isShowTree = true
    },
    handleNodeClick(data) {
      console.log(data)
      //   点击树形结构的节点之后把节点数据回写到输入框中
      this.addUserInfo.departmentName = data.name
      //   关闭树形结构
      this.isShowTree = false
    }
  }
}
</script>

<style>

</style>
