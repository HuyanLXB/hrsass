<template>
  <div class="dashboard-container">
    <div class="app-container">
      <PageToll :show-before="true">
        <span slot="before">共20条数据</span>
        <template slot="after">
          <el-button size="small" type="warning">导入员工</el-button>
          <el-button size="small" type="danger">导出员工</el-button>
          <el-button size="small" type="primary">新增员工</el-button>
        </template>
      </PageToll>
      <el-card>
        <!-- 表格区域 -->
        <el-table>
          <el-table-column label="序号" sortable="" />
          <el-table-column label="姓名" sortable="" />
          <el-table-column label="工号" sortable="" />
          <el-table-column label="聘用形式" sortable="" />
          <el-table-column label="部门" sortable="" />
          <el-table-column label="入职时间" sortable="" />
          <el-table-column label="账户状态" sortable="" />
          <el-table-column label="操作">
            <el-button type="text" size="small">查看</el-button>
            <el-button type="text" size="small">转正</el-button>
            <el-button type="text" size="small">调岗</el-button>
            <el-button type="text" size="small">离职</el-button>
            <el-button type="text" size="small">角色</el-button>
            <el-button type="text" size="small">删除</el-button>
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
      </el-card>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Employees',
  data() {
    return {
      page: {
        page: 1,
        pagesize: 7,
        total: 0// 记录总数
      }
    }
  },
  methods: {
    pageChange() {
      console.log('页数发生变化')
    }
  }
}
</script>

<style>

</style>
