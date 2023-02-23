<template>
  <el-dialog :title="showTitle" :visible="dialogFormVisible" @close="$emit('closeAddDept')">
    <el-form ref="deptFrom" label-width="120px" :model="formData" :rules="rules">
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="formData.name" style="width:80%" />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input v-model="formData.code" style="width:80%" />
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <el-select
          v-model="formData.manager"
          placeholder="请选择"
          style="width:80%"
          @focus="getUserList"
        >
          <el-option
            v-for="(item,index) in peoples"
            :key="index"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input
          v-model="formData.introduce"
          style="width:80%"
          type="textarea"
          :rows="3"
          placeholder="请输入内容"
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
import { getDepartments, addDepartments, getDepartDetail, updateDepartments } from '@/api/departments'
// import { getUserList } from '@/api/employees' 后端接口有问题无法获取员工数据

export default {

  name: 'AddDept',
  props: {
    dialogFormVisible: {
      type: Boolean,
      default: false
    },
    currentNode: {
      type: Object,
      required: true
    },
    statusCode: {
      type: String,
      required: true
    }
  },
  data() {
    const checkRepeatName = async(rule, value, callback) => {
      // 检查同级的部门里面有没有重复的部门
      // 1.获取后端最新的数据
      const { depts } = await getDepartments()
      console.log(depts)
      if (this.statusCode === 'edit') {
        // 编辑状态
        // 同级部门中除了自己以外不能有相同的名称
        // pid是等级id，同一级的数据其pid是相同的。id是个体id每个数据的id都是不一样的
        const isRepeat = depts.filter(item => item.pid === this.currentNode.pid && item.id !== this.currentNode.id).some(item => item.name === value)
        console.log(depts.filter(item => item.pid === this.currentNode.pid && item.id !== this.currentNode.id))
        isRepeat ? callback(new Error('同级部门中已存在相同名称')) : callback()
      } else {
        // 新增状态
        // 2.进行部门名称的查重
      // 2.1 找到新增子部门的同级部门
      // 2.2 判断新增部门名称是否有重复
        const isRepeat = depts.filter(item => item.pid === this.currentNode.id).some(item => item.name === value)

        isRepeat ? callback(new Error('同级部门中已存在相同名称')) : callback()
      }
    }
    const checkRepeatCode = async(rule, value, callback) => {
      // 整个组织模块中部门编码都不许重复
      // 1. 获取后端最新的数据
      const { depts } = await getDepartments()
      if (this.statusCode === 'edit') {
        // 编辑状态
        // 把正在进行编辑的部门排除去之后进行查重
        const isRepeat = depts.some(item => item.id !== this.currentNode.id && item.code === value && value)
        isRepeat ? callback(new Error('部门编码重复')) : callback()
      } else {
        // 新增状态
        // 2. 进行部门编码查重
        const isRepeat = depts.some(item => item.code === value)
        isRepeat ? callback(new Error('部门编码重复')) : callback()
      }
    }
    return {
      formData: {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门负责人
        introduce: '' // 部门介绍
      },
      rules: {
        name: [
          { required: true, message: '部门名称不能为空', trigger: 'blur' },
          { max: 50, min: 1, message: '部门名称在1-50个字符', trigger: 'blur' },
          { validator: checkRepeatName, trigger: 'blur' }],
        code: [
          { required: true, message: '部门编码不能为空', trigger: 'blur' },
          { max: 50, min: 1, message: '部门编码在1-50个字符', trigger: 'blur' },
          { validator: checkRepeatCode, trigger: 'blur' }
        ],
        manager: [
          { required: true, message: '部门负责人不能为空', trigger: 'blur' }
        ],
        introuduce: [
          { required: true, message: '部门介绍不能为空', trigger: 'blur' },
          { max: 300, min: 1, message: '部门编码在1-300个字符', trigger: 'blur' }
        ]
      },
      peoples: []
    }
  },
  computed: {
    showTitle() {
      return this.statusCode === 'edit' ? '编辑部门' : '新增子部门'
    }
  },
  created() {
    if (this.statusCode === 'edit') {
      this.getDepartDetail(this.currentNode.id)
    }
  },
  methods: {
    async getUserList() {
      console.log('获取管理人员列表')
      // const data = await getUserList()
      const { depts } = await getDepartments()
      // 把各部门的负责人都提取出来
      depts.forEach(item => {
        if (item.manager !== null) {
          this.peoples.push(item.manager)
        }
      })
      // 去掉重复的数据
      // this.peoples.forEach((item, index, array) => {
      //   if (this.peoples.some(value => value.manager === item.manager)) {
      //     this.peoples.splice(index, 1)
      //     console.log(item.manager)
      //   }
      // })

      // 去掉重复的数据
      this.peoples = this.peoples.filter((item, index, array) => {
        return array.indexOf(item) === index
      })
      console.log(this.peoples)
    },
    btnOk() {
      this.$refs.deptFrom.validate(async isOk => {
        if (isOk) {
          if (this.statusCode === 'edit') {
            // 编辑状态
            console.log('编辑状态校验通过')
            const res = await updateDepartments(this.formData)
            console.log(res)
          } else {
            // 新增状态
            // 表单校验通过后执行这里
            console.log('校验通过')
            // 调用后端接口进行新增部门的提交
            const formData = { ...this.formData, pid: this.currentNode.id }
            await addDepartments(formData)
          }
          // 新增部门成功通知父组件获取最新的部门列表数据
          this.$emit('addDepartments')
          // 关闭弹窗
          this.$emit('closeAddDept')
          // 成功通知
          this.$message.success('更新部门成功')
        }
      })
    },
    async getDepartDetail(id) {
      const res = await getDepartDetail(id)
      console.log(res)
      this.formData = res
    }
  }
}
</script>

<style>

</style>
