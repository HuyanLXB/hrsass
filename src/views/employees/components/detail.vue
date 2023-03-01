<template>
  <el-card>
    <el-tabs>
      <el-tab-pane label="登录账户设置" label-width="120px" style="margin-left: 160px; margin-top:50px">
        <el-form ref="updateUserForm" :model="userBaseInfo" :rules="rule">
          <el-form-item label="姓名" prop="username">
            <el-input v-model="userBaseInfo.username" style="width:300px" />
          </el-form-item>
          <el-form-item label="密码" prop="password2">
            <el-input v-model="userBaseInfo.password2" type="password" style="width:300px" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="saveUserInfoById">更新 </el-button>
            <el-button @click="$router.back()">返回</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="个人详情">
        <!-- 打印页面的跳转页面 -->
        <el-row type="flex" justify="end">
          <el-tooltip content="打印个人基本信息">
            <router-link :to="`/employees/print/${userId}?type=personal`">
              <i class="el-icon-printer" />
            </router-link>
          </el-tooltip>
        </el-row>
        <!-- 动态组件技术 -->
        <component :is="componentsName[0]" />
      </el-tab-pane>
      <el-tab-pane label="岗位信息">
        <el-row type="flex" justify="end">
          <el-tooltip content="打印岗位信息">
            <router-link :to="`/employees/print/${userId}?type=job`">
              <i class="el-icon-printer" />
            </router-link>
          </el-tooltip>
        </el-row>
        <component :is="componentsName[1]" />
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script>
import { getUserInfoById, saveUserInfoById } from '@/api/user'
import UserInfo from '../components/user-info.vue'
import JobInfo from '../components/job-info.vue'
export default {
  name: 'Detail',
  components: {
    UserInfo,
    JobInfo
  },
  data() {
    return {
      userBaseInfo: {
        username: '',
        password2: ''
      },
      rule: {
        username: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
        password2: [{ required: true, message: '密码不能为空', trigger: 'blur' },
          { min: 6, max: 9, message: '密码长度6-9位', trigger: 'blur' }]
      },
      componentsName: ['UserInfo', 'JobInfo'],
      userId: this.$route.params.id

    }
  },
  created() {
    this.loadUserBaseInfo()
  },
  methods: {
    async loadUserBaseInfo() {
      try {
        const res = await getUserInfoById(this.$route.params.id)
        console.log(res)
        this.userBaseInfo = { ...res, password2: '' }
      } catch (error) {
        console.log('获取用户信息失败', error)
      }
    },
    async saveUserInfoById() {
      try {
        await this.$refs.updateUserForm.validate()
        const res2 = await saveUserInfoById({ ...this.userBaseInfo, password: this.userBaseInfo.password2 })
        console.log(res2)
        // 消息提醒
        this.$message.success('保存员工信息成功')
      } catch (error) {
        console.log('保存员工基本信息失败')
      }
    }
  }
}
</script>

<style>

</style>
