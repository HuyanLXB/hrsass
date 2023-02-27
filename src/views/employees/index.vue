<template>
  <div class="dashboard-container">
    <div class="app-container">
      <PageToll :show-before="true">
        <span slot="before">共{{ page.total }}条数据</span>
        <template slot="after">
          <el-button size="small" type="warning" @click="$router.push('/import?type=user')">导入员工</el-button>
          <el-button size="small" type="danger">导出员工</el-button>
          <el-button size="small" type="primary" @click="addEmployee">新增员工</el-button>
        </template>
      </PageToll>
      <el-card>
        <!-- 表格区域 -->
        <el-table :data="userInfo" border="">
          <el-table-column type="index" label="序号" sortable="" />
          <el-table-column prop="username" label="姓名" sortable="" />
          <el-table-column prop="staffPhoto" label="头像">
            <template slot-scope="{ row }">
              <img
                v-if="row.staffPhoto === ''"
                :src="row.staffPhoto === ''? img : row.staffPhoto"
                alt=""
                style="width:100% ;height:auto"
              >
              <img
                v-else
                v-imageError="img"
                :src="row.staffPhoto"
                style="width:100% ;height:auto"
              >
            </template>
          </el-table-column>
          <el-table-column prop="mobile" label="手机号" sortable="" />
          <el-table-column prop="workNumber" label="工号" sortable="" />
          <el-table-column prop="formOfEmployment" label="聘用形式" sortable="" :formatter="formatEmployment" />
          <el-table-column prop="departmentName" label="部门" sortable="" />
          <el-table-column prop="timeOfEntry" label="入职时间" sortable="">
            <template slot-scope="{ row }">
              {{ row.timeOfEntry|formatDate }}
            </template>
          </el-table-column>
          <el-table-column prop="enableState" label="账户状态" sortable="" />
          <el-table-column label="操作">
            <template slot-scope="{ row }">
              <el-button type="text" size="small">查看</el-button>
              <el-button type="text" size="small">转正</el-button>
              <el-button type="text" size="small">调岗</el-button>
              <el-button type="text" size="small">离职</el-button>
              <el-button type="text" size="small">角色</el-button>
              <el-button type="text" size="small" @click="delUser(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <!-- <el-row type="flex" justify="center" style="hight:60px" align="middle">
          <el-pagination
            layout="prev, pager, next"
            :page-size="page.pagesize"
            :total="page.total"
            :current-page="page.page"
            @current-change="pageChange"
          />
        </el-row> -->
        <el-row type="flex" justify="center" align="middle" style="height: 60px">
          <el-pagination
            layout="prev, pager, next"
            :page-size="page.size"
            :current-page="page.page"
            :total="page.total"
            @current-change="changePage"
          />
        </el-row>
      </el-card>
    </div>
    <!-- 弹窗 -->
    <AddEmployee
      v-if="dialogFormVisible"
      :dialog-form-visible="dialogFormVisible"
      @closeAddDept="dialogFormVisible = false"
    />
  </div>
</template>
<script>
import { getUserList, delEmployee } from '@/api/employees'
import EmployeeEnum from '@/api/constant/employees'
import AddEmployee from './components/add-employee.vue'
export default {
  name: 'Employees',
  components: {
    AddEmployee
  },
  data() {
    return {
      page: {
        page: 1,
        pagesize: 6,
        total: 0// 记录总数
      },
      userInfo: [
        {
          timeOfEntry: '',
          departmentName: '',
          formOfEmployment: 1,
          mobile: '',
          staffPhoto: '',
          username: '',
          workNumber: '',
          enableState: ''
        }
      ],
      img: require('@/assets/common/head.jpg'),
      dialogFormVisible: false
    }
  },
  created() {
    this.loadUserInfo()
  },
  methods: {
    changePage(value) {
      console.log('页数发生变化', value)
      // 设置请求的新页数
      this.page.page = value
      // 重新发起请求
      this.loadUserInfo()
    },
    async loadUserInfo() {
      try {
        const res = await getUserList(this.page)
        this.page.total = res.total
        this.userInfo = [...res.rows]
        console.log(res)
      } catch (error) {
        console.log(error)
      }
    },
    formatEmployment(cellValue) {
      // console.log(cellValue)
      // 去寻找1 2 对应的值
      const res = EmployeeEnum.hireType.find(item => item.id === Number(cellValue.enableState))

      return res ? res.value : '未知'
    },
    async delUser(id) {
      try {
        await this.$confirm('确定要删除该用户？')
        const res = await delEmployee(id)
        console.log(res)
        // 重新获取数据
        this.loadUserInfo()
        // 消息提醒
        this.$message.success('删除用户成功')
      } catch (error) {
        console.log(error)
      }
    },
    addEmployee() {
      this.dialogFormVisible = true
    }
  }
}
</script>

<style>

</style>
