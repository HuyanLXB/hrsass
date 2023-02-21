<template>
  <el-card class="tree-card">
    <!-- 实现头部结构 -->
    <el-row type="flex" justify="space-between">
      <el-col>
        <span>重庆xxxxxx科技股份有限公司</span>
      </el-col>
      <el-col :span="4">
        <el-row type="flex" justify="end">
          <el-col>
            <span>负责人</span>
          </el-col>
          <el-col>
            <!-- 下拉菜单 -->
            <el-dropdown>
              <span>
                操作<i class="el-icon-arrow-down" />
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>添加子部门</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-col>
        </el-row>
      </el-col>
    </el-row>

    <!-- 实现静态的树形结构 -->
    <el-tree :data="departs" :props="defaultProps" :default-expand-all="true">
      <!-- 传入内容 插槽内容 会循环多次 有多少节点 就循环多少次 -->
      <!-- 作用域插槽 slot-scope="obj" 接收传递给插槽的数据   data 每个节点的数据对象-->
      <el-row slot-scope="{ data }" type="flex" justify="space-between" align="middle" style="height: 40px; width: 100%">
        <el-col>
          <span>{{ data.name }}</span>
        </el-col>
        <el-col :span="4">
          <el-row type="flex" justify="end">
            <el-col>
              <span>{{ data.manager }}</span>
            </el-col>
            <el-col>
              <!-- 下拉菜单 -->
              <el-dropdown>
                <span>
                  操作<i class="el-icon-arrow-down" />
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>添加子部门</el-dropdown-item>
                  <el-dropdown-item>编辑部门</el-dropdown-item>
                  <el-dropdown-item>删除部门</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </el-tree>

  </el-card>
</template>
<script>
export default {
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
      ]
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
