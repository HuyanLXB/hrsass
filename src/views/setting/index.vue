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
              >新增角色</el-button>
            </el-row>
            <!-- 展示数据的表格 -->
            <el-table :data="list">
              <el-table-column type="index" label="序号" width="120" />
              <el-table-column prop="name" label="角色名称" width="240" />
              <el-table-column prop="description" label="描述" />
              <el-table-column label="操作">
                <el-button size="small" type="success">分配权限</el-button>
                <el-button size="small" type="primary">编辑</el-button>
                <el-button size="small" type="danger">删除</el-button>
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
    </div>
  </div>
</template>
<script>
import { getRoleList, getCompanyInfo } from '@/api/setting'
import { mapGetters } from 'vuex'
export default {
  name: 'Setting',
  data() {
    return {
      list: [], // 用来承接获取到的角色信息
      page: {
        page: 1,
        pagesize: 5,
        total: 0// 记录总数
      },
      CompanyInfo: {
        name: '',
        companyAddress: '',
        mailbox: '',
        remarks: ''
      } // 记录公司信息

    }
  },
  computed: {
    ...mapGetters(['companyId'])
  },
  created() {
    this.getRoleList()
    this.getCompanyInfo()
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
