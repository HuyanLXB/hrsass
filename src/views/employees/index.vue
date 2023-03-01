<template>
  <div class="dashboard-container">
    <div class="app-container">
      <PageToll :show-before="true">
        <span slot="before">共{{ page.total }}条数据</span>
        <template slot="after">
          <el-button size="small" type="warning" @click="$router.push('/import?type=user')">导入员工</el-button>
          <el-button size="small" type="danger" @click="exportData">导出员工</el-button>
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
                @click="showQrcode(row.staffPhoto)"
              >
              <img
                v-else
                v-imageError="img"
                :src="row.staffPhoto"
                style="width:100% ;height:auto"
                @click="showQrcode(row.staffPhoto)"
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
              <el-button type="text" size="small" @click="$router.push(`/employees/detail/${row.id}`)">查看</el-button>
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
    <!-- 头像二维码弹窗 -->
    <el-dialog :visible.sync="qrCodeVisible" title="头像二维码">
      <el-row type="flex" justify="center">
        <canvas ref="qrCode" />
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
import { getUserList, delEmployee } from '@/api/employees'
import EmployeeEnum from '@/api/constant/employees'
import AddEmployee from './components/add-employee.vue'
import QrCode from 'qrcode'
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
      dialogFormVisible: false,
      qrCodeVisible: false
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
    },
    exportData() {
      console.log('导出数据')
      // 因为后端的数据key是英文的所以需要一个汉英对应关系
      const headers = {
        '手机号': 'mobile',
        '姓名': 'username',
        '入职日期': 'timeOfEntry',
        '聘用形式': 'formOfEmployment',
        '转正日期': 'correctionTime',
        '工号': 'workNumber',
        '部门': 'departmentName'
      }
      // 懒加载插件进行Excel导出
      import('@/vendor/Export2Excel').then(async excel => {
        // 调用接口请求数据
        // 这样就能通过一次请求获取到全部的数据
        const { rows } = await getUserList({ page: 1, size: this.page.total })
        // console.log(rows)
        // 将数组对象转化为二维数组以便于导出
        const data = this.formatJson(rows, headers)
        // console.log(data)
        excel.export_json_to_excel({
          header: Object.keys(headers), // 表头 必填
          data, // 具体数据 必填
          filename: '员工数据', // 非必填
          autoWidth: true, // 非必填
          bookType: 'xlsx' // 非必填
        })
      })
    },
    formatJson(rows, headers) {
      // 该方法负责让一维数组对象变成二维数组
      // [{ username: '张三'},{},{}]  => [[’张三'],[],[]]
      const arr = []
      // 1.先遍历对象
      rows.forEach(item => {
        const userInfo = []
        // 2. 再遍历表头，使得后端获得的数据按照表头的顺序被放到数组中
        Object.keys(headers).forEach(key => {
          if (headers[key] === 'timeOfEntry' || headers[key] === 'correctionTime') {
            userInfo.push(this.formatDate(item[headers[key]]))
            // userInfo.push(item[headers[key]])
          } else if (headers[key] === 'formOfEmployment') {
            // 返回的是一个对象
            const isIn = EmployeeEnum.hireType.find(value => value.id === Number(item[headers[key]]))
            const hireType = isIn ? isIn.value : '未知'
            userInfo.push(hireType)
          } else {
            userInfo.push(item[headers[key]])
          }
        })
        arr.push(userInfo)
      })

      return arr
    },
    formatDate(date, fmt = 'yyyy-MM-dd') {
      if (!(date instanceof Array)) {
        date = new Date(date)
      }
      if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
      }
      const o = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds()
      }
      for (const k in o) {
        if (new RegExp(`(${k})`).test(fmt)) {
          const str = o[k] + ''
          fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : this.padLeftZero(str))
        }
      }
      return fmt
    },
    padLeftZero(str) {
      return ('00' + str).substr(str.length)
    },
    showQrcode(url) {
      if (url) {
        console.log(url)
        // 展示弹窗
        this.qrCodeVisible = true
        // 转换二维码
        // 因为数据更新是异步的，在弹窗刚渲染出来时去获取dom对象是获取不到的
        // QrCode.toCanvas(this.$refs.qrCode, url)
        // 该方法可以在页面渲染完之后再执行操作，此时是可以获取到dom对象的
        this.$nextTick(() => {
          QrCode.toCanvas(this.$refs.qrCode, url)
          // 如果转化的二维码后面信息 是一个地址的话 就会跳转到该地址 如果不是地址就会显示内容
        })
      } else {
        this.$message.warning('您还没有上传头像')
      }
    }
  }
}
</script>

<style>

</style>
