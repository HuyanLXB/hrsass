<template>
  <el-card class="tree-card">
    <!-- 实现头部结构 -->
    <tree-tools :tree-node="company" />

    <!-- 实现静态的树形结构 -->
    <el-tree :data="departs" :props="defaultProps" :default-expand-all="true">
      <!-- 传入内容 插槽内容 会循环多次 有多少节点 就循环多少次 -->
      <!-- 作用域插槽 slot-scope="obj" 接收传递给插槽的数据   data 每个节点的数据对象-->
      <tree-tools slot-scope="{ data }" :tree-node="data" />
    </el-tree>

  </el-card>
</template>
<script>
import TreeTools from './components/tree-tools.vue'
export default {
  components: {
    TreeTools
  },
  data() {
    return {
      defaultProps: {
        children: 'children', // 通过children属性来寻找节点的字节点
        label: 'name'// 通过name属性来显示节点的名称
      },
      departs: [
        { name: '总裁办', manager: '曹操', children: [{ name: '董事会', manager: '曹丕' }] },
        { name: '行政部', manager: '刘备' },
        { name: '人事部', manager: '孙权' }
      ],
      company: { name: '重庆xxxxxx科技股份有限公司', manager: '负责人' }
    }
  }
}

</script>

<style scoped>
.tree-card {
  padding: 30px  140px;
  font-size:14px;
}
</style>
