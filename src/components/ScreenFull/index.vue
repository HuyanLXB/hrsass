<template>
  <div>
    <svg-icon
      icon-class="fullscreen"
      style="color:#fff; width: 20px; height: 20px"
      @click="changeScreen"
    />
  </div>

</template>

<script>
import ScreenFull from 'screenfull'
export default {
  name: 'ScreenFull',
  methods: {
    changeScreen() {
      // 切换全屏
      if (!ScreenFull.isEnabled) {
        // 表示全屏不可用
        this.$message('全屏功能暂不可用')
        return
      }
      ScreenFull.toggle()
    }

  }
}
</script>

<style>

</style>
