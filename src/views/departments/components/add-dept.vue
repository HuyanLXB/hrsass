<template>
  <el-dialog title="新增部门" :visible="dialogFormVisible" @close="$emit('closeAddDept')">
    <el-form label-width="120px">
      <el-form-item label="部门名称">
        <el-input style="width:80%" />
      </el-form-item>
      <el-form-item label="部门编码">
        <el-input style="width:80%" />
      </el-form-item>
      <el-form-item label="部门负责人">
        <el-select placeholder="请选择" style="width:80%" />
      </el-form-item>
      <el-form-item label="部门介绍">
        <el-input
          style="width:80%"
          type="textarea"
          :rows="3"
          placeholder="请输入内容"
        />
      </el-form-item>
    </el-form>
    <el-row slot="footer" type="flex" justify="center">
      <!-- 列被分为24 -->
      <el-col :span="6">
        <el-button type="primary" size="small">确定</el-button>
        <el-button size="small" @click="$emit('closeAddDept')">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
export default {
  name: 'AddDept',
  props: {
    dialogFormVisible: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style>

</style>
