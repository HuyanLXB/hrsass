<template>
  <div class="permission-container">
    <div class="app-container">
      <PageToll>
        <el-button
          slot="after"
          size="small"
          type="primary"
          @click="changePerm(1)"
        >添加权限</el-button>
      </PageToll>
      <!-- 权限的表单部分 -->
      <el-table
        :data="permData"
        row-key="id"
        border=""
      >
        <el-table-column label="名称" prop="name" />
        <el-table-column label="标识" prop="code" />
        <el-table-column label="描述" prop="description" />
        <el-table-column label="操作">
          <template slot-scope="{ row }">
            <!-- 保证只有第一层权限才能添加子权限 -->
            <el-button
              v-if="row.type === 1"
              type="text"
              @click="changePerm(2,row.id)"
            >添加</el-button>
            <el-button
              type="text"
              @click="changePerm(3,row.id)"
            >编辑</el-button>
            <el-button type="text" @click="delPermission(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 编辑权限和新增权限的弹窗 -->
      <el-dialog :title="showText" :visible.sync="changePermShow" @close="btnCancel">
        <el-form ref="formPerm" label-width="120px" :model="permFormData" :rules="rules">
          <el-form-item
            label="权限名称"
            style="width:90%"
            prop="name"
          >
            <el-input v-model="permFormData.name" />
          </el-form-item>
          <el-form-item
            label="权限标识"
            style="width:90%"
            prop="code"
          >
            <el-input v-model="permFormData.code" />
          </el-form-item>
          <el-form-item
            label="权限描述"
            style="width:90%"
          >
            <el-input v-model="permFormData.description" />
          </el-form-item>
          <el-form-item label="开启" style="width:90%">
            <el-switch
              v-model="permFormData.enVisible"
              active-value="1"
              inactive-value="0"
            />
          </el-form-item>
        </el-form>
        <!-- 底部按钮区域 -->
        <el-row type="flex" justify="center">
          <el-col :span="6">
            <el-button size="small" @click="btnCancel">取消</el-button>
            <el-button type="primary" size="small" @click="btnOk">确认</el-button>
          </el-col>
        </el-row>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { getPermissionList, delPermission, addPermission, getPermissionDetail, updatePermission } from '@/api/permission'
import { tranListToTreeData } from '@/utils'
export default {
  name: 'Permission',
  data() {
    return {
      permData: [], // 获取到的权限列表的数据
      changePermShow: false,
      permFormData: {
        enVisible: '',
        name: '',
        code: '',
        description: '',
        type: '',
        pid: ''
      }, // 这是具体某一个权限节点的信息
      rules: {
        name: [{ required: true, message: '权限名称不能为空', trigger: 'blur' }],
        code: [{ required: true, message: '权限标识不能为空', trigger: 'blur' }]
      },
      showText: '',
      statueCode: 0,
      currentPermID: ''
    }
  },
  created() {
    this.loadPermissionList()
  },
  methods: {
    async loadPermissionList() {
      try {
        this.permData = tranListToTreeData(await getPermissionList(), '0')
        console.log(this.permData)
      } catch (error) {
        console.log('获取权限信息失败')
      }
    },
    async changePerm(staueCode, permId) {
      // staueCode = 1 表示是从最上方的新增按钮进入的 是新增第一层的权限点
      // staueCode = 2 表示新增的是第二层的权限点
      // staueCode = 3 表示是新增权限
      if (staueCode === 1) {
        this.showText = '新增权限点'
      } else if (staueCode === 2) {
        this.showText = '新增权限点'
      } else {
        this.showText = '编辑权限点'
        // 1.根据id获取权限详情，实现数据回写
        this.permFormData = await getPermissionDetail(this.currentPermID)
      }
      // 展现弹窗
      this.changePermShow = true
      this.statueCode = staueCode
      this.currentPermID = permId
    },
    btnCancel() {
      // 关闭弹窗
      this.changePermShow = false
      // 还原数据
      this.permFormData = {
        enVisible: '',
        name: '',
        code: '',
        description: '',
        type: '',
        pid: ''
      }
      // 重置校验
      this.$refs.formPerm.resetFields()
    },
    async delPermission(id) {
      try {
        await this.$confirm('确定要删除该权限？')
        // 调用接口删除权限
        await delPermission(id)
        // 重新拉取数据
        this.loadPermissionList()
        // 消息提示
        this.$message.success('删除权限成功')
      } catch (error) {
        console.log(error)
      }
    },
    btnOk() {
      this.$refs.formPerm.validate(async isOk => {
        if (isOk) {
        //  校验通过判断是新增还是编辑
          if (this.staueCode === 1 || this.staueCode === 2) {
          // 是新增
            // 校验通过调用接口新增权限点
            await addPermission(this.permFormData)
            // 重新拉取数据
            this.loadPermissionList()
            // 关闭弹窗
            this.changePermShow = false
            // 消息提醒
            this.$message.success('新增权限点成功')
          } else {
          // 是编辑

            try {
              // 2.调用接口完成数据更新
              await updatePermission(this.permFormData)
            } catch (error) {
              console.log(error)
            }
          }
        }
      })
    }
  }

}
</script>

<style>

</style>
