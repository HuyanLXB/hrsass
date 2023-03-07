<template>
  <el-dropdown trigger="click" @command="changeLanguage">
    <!-- 必须要加一个div使其变成块级元素 -->
    <div>
      <svg-icon style="color:#fff;font-size:20px" icon-class="language" />
    </div>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item command="zh" :disabled="$i18n.locale==='zh'">中文</el-dropdown-item>
      <el-dropdown-item command="en" :disabled="$i18n.locale==='en'">EN</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import Cookie from 'js-cookie'
export default {
  name: 'LangChange',
  methods: {
    changeLanguage(lang) {
      console.log(lang)
      //   语言修改持久化
      Cookie.set('language', lang)
      //   通过$i18n获取到i18n实例 进行语言修改
      this.$i18n.locale = lang
      //   消息提醒
      this.$message.success('语言切换成功')
    }
  }
}
</script>

<style>

</style>
