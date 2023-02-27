<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name: {{ name }}</div>
    <PageToll :show-before="true">
      <span slot="before">前面显示的内容</span>
      <el-button slot="after">新增人员</el-button>
      <el-button slot="after">新增人员</el-button>
    </PageToll>
    <UploadExcel />
  </div>

</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  components: {

  },
  computed: {
    ...mapGetters([
      'name'
    ])
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
