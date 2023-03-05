<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <el-tab-pane label="角色管理">
            <!-- 新增角色按钮 -->
            <el-row style="height:60px">
              <el-button
                type="primary"
                size="small"
                icon="el-icon-plus"
                @click="addRole('add')"
              >新增角色</el-button>
            </el-row>
            <!-- 展示数据的表格 -->
            <el-table :data="list">
              <el-table-column type="index" label="序号" width="120" />
              <el-table-column prop="name" label="角色名称" width="240" />
              <el-table-column prop="description" label="描述" />
              <el-table-column label="操作">
                <!-- 作用域插槽 row 能获取到点击那一行的数据对象 -->
                <template slot-scope="{ row }">
                  <el-button
                    size="small"
                    type="success"
                    @click="assignPerm(row.id)"
                  >分配权限</el-button>
                  <el-button
                    size="small"
                    type="primary"
                    @click="editRole(row,'edit')"
                  >编辑</el-button>
                  <el-button
                    size="small"
                    type="danger"
                    @click="deletRole(row)"
                  >删除</el-button>
                </template>
              </el-table-column>

            </el-table>
            <!-- 分页组件 -->
            <el-row type="flex" justify="center" style="hight:60px" align="middle">
              <el-pagination
                layout="prev, pager, next"
                :total="page.total"
                :page-size="page.pagesize"
                :current-page="page.page"
                @current-change="pageChange"
              />
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="公司信息">
            <el-alert
              title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
              type="info"
              show-icon
              :closable="false"
            />
            <!-- 显示数据的表格 -->
            <el-form label-width="120px" style="margin-top: 50px;">
              <el-form-item label="公司名称">
                <el-input v-model="CompanyInfo.name" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input v-model="CompanyInfo.companyAddress" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input v-model="CompanyInfo.mailbox" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="备注">
                <el-input v-model="CompanyInfo.remarks" disabled type="textarea" :rows="3" style="width:400px" />
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-card>

      <!-- 新增和编辑时的弹层 -->
      <el-dialog
        v-if="dialogFormVisible"
        :title="statueCode === 'edit' ? '编辑角色' : '新增角色'"
        :visible.sync="dialogFormVisible"
        :before-close="handleClose"
      >
        <el-form ref="editForm" :model="formData" :rules="rule" label-width="120px">
          <el-form-item label="角色名称" prop="name">
            <el-input v-model="formData.name" />
          </el-form-item>
          <el-form-item label="角色描述">
            <el-input v-model="formData.description" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="handleClose">取 消</el-button>
          <el-button type="primary" @click="btnOK">确 定</el-button>
        </div>
      </el-dialog>

      <!-- 给角色分配权限时的弹窗 -->
      <el-dialog
        :visible.sync="showPermDialog"
        title="分配权限"
        @close="btnAssignCancel"
      >
        <el-tree
          ref="treeData"
          :data="permData"
          show-checkbox
          node-key="id"
          :default-expand-all="true"
          :check-on-click-node="true"
          :check-strictly="true"
          :props="defaultProps"
          :default-checked-keys="permIds"
          @node-click="handleNodeClick"
        />
        <!-- 底部确认标签 -->
        <el-row type="flex" justify="center">
          <el-col :span="6">
            <el-button size="small" @click="btnAssignCancel">取消</el-button>
            <el-button type="primary" size="small" @click="btnAssignOk">确认</el-button>
          </el-col>
        </el-row>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { getRoleList, getCompanyInfo, deleteRole, updateRole, getRoleInfo, addRole, assignPerm } from '@/api/setting'
import { mapGetters } from 'vuex'
import { getPermissionList } from '@/api/permission'
import { tranListToTreeData } from '@/utils'
export default {
  name: 'Setting',
  data() {
    return {
      list: [], // 用来承接获取到的角色信息
      page: {
        page: 1,
        pagesize: 7,
        total: 0// 记录总数
      },
      CompanyInfo: {
        name: '',
        companyAddress: '',
        mailbox: '',
        remarks: ''
      }, // 记录公司信息
      dialogFormVisible: false,
      formData: {
        name: '',
        description: ''
      },
      rule: {
        name: [{ required: true, message: '名称不能为空', trigger: 'blur' }]
      },
      statueCode: 'add',
      showPermDialog: false,
      permData: [], // 分配权限时树形结构遍历的数据
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      permIds: [], // 存放权限id
      currentId: '' // 记录当前点击的id

    }
  },
  computed: {
    ...mapGetters(['companyId'])
  },
  created() {
    this.getRoleList()
    this.getCompanyInfo()
    this.getPermissionList()
  },
  methods: {
    async getRoleList() {
      const res = await getRoleList(this.page)
      this.list = res.rows
      this.page.total = res.total
    },
    pageChange(currentPage) {
      console.log(currentPage)
      // 当页数发生改变时 重新请求新一页的数据
      this.page.page = currentPage // 更新请求的页数
      this.getRoleList(this.page)
    },
    async getCompanyInfo() {
      const res = await getCompanyInfo(this.companyId)
      this.CompanyInfo = { ...res, name: '重庆xxxxxxx有限公司', remarks: '重庆xxxx有限公司官网-好口碑网络服务,一样的产品,不一样的品质' }
      console.log(res)
    },
    async deletRole(row) {
      try {
        await this.$confirm('确定要删除该角色吗？')
        // 只有当点击确定时才会执行下面的代码
        await deleteRole(row.id)
        // 删除成功之后重新加载数据
        this.getRoleList()
        // 消息提示
        this.$message.success('删除成功')
        console.log(row)
      } catch (error) {
        console.log(error)
      }
    },
    async editRole(row, statueCode) {
      this.dialogFormVisible = true
      this.statueCode = statueCode
      try {
        // 调用接口获取角色信息
        const res = await getRoleInfo(row.id)
        // 实现数据回写
        this.formData = res
      } catch (error) {
        console.log(error)
      }
    },
    async btnOK() {
      if (this.formData.id) {
        // id存在表明是编辑状态
        try {
        // 点击确定时要先进行表单校验
          await this.$refs.editForm.validate()
          // 校验通过了才会执行下面的代码
          try {
            // 调用接口更改角色信息
            const res2 = await updateRole(this.formData)
            console.log(res2)
            // 重新获取数据
            this.getRoleList()
            // 消息提示
            this.$message.success('操作成功')
          } catch (error) {
            console.log(error)
          }
          // 关闭弹窗
          this.dialogFormVisible = false
        } catch (error) {
          console.log(error)
        }
      } else {
        // id不存在是新增状态
        console.log('新增')
        try {
          // 调用接口
          await addRole(this.formData)
          // 重新获取数据
          this.getRoleList()
          // 消息提醒
          this.$message.success('新增成功')
          // 关闭弹窗
          this.handleClose()
        } catch (error) {
          console.log(error)
        }
      }
    },
    handleClose() {
      console.log('清空数据')
      // 清空数据
      this.formData = {
        name: '',
        description: ''
      }
      // 关闭弹窗
      this.dialogFormVisible = false
    },
    addRole(statueCode) {
      this.dialogFormVisible = true
      this.statueCode = statueCode
    },
    async assignPerm(id) {
      // 展开分配权限的弹窗
      this.showPermDialog = true
      this.currentId = id
      // 调用接口获取角色信息
      const { permIds } = await getRoleInfo(id)
      // 记录当前角色所拥有的权限id
      this.permIds = permIds
    },
    btnAssignCancel() {
      // 关闭弹窗
      this.showPermDialog = false
      // 情空权限id
      this.permIds = []
    },
    async btnAssignOk() {
      console.log('ok')
      try {
        // 调用接口完成权限分配
        await assignPerm({ id: this.currentId, permIds: this.permIds })
        // 关闭弹窗
        this.btnAssignCancel()
        // 消息提醒
        this.$message.success('权限分配完成')
      } catch (error) {
        console.log(error)
      }
    },
    async getPermissionList() {
      try {
        this.permData = tranListToTreeData(await getPermissionList(), '0')
      } catch (error) {
        console.log(error)
      }
    },
    handleNodeClick() {
      // 把被选中的权限id放入对应的数组中，
      this.permIds = this.$refs.treeData.getCheckedKeys()
    }
  }

}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
