// 导出所需要要的整体布局
import layout from '@/layout'

// 设置本模块对应的路由规则并导出
export default {
  path: '/setting',
  name: 'settings',
  component: layout,
  children: [{
    path: '', // 二级路由不写路径表示是默认路由
    component: () => import('@/views/setting'),
    // 路由元信息 实际上就是存放数据的对象
    meta: {
      // meta属性的里面的属性 随意定义
      // 但是这里为什么要用title呢， 因为左侧导航会读取我们的路由里的meta里面的title作为显示菜单名称
      title: '公司设置',
      icon: 'setting'
    }
  }]
}
