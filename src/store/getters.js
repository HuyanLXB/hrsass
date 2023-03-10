const getters = {
  // 建立对模块元素的快捷访问
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  name: state => state.user.userInfo.username,
  userId: state => state.user.userInfo.userId,
  image: state => state.user.userInfo.staffPhoto,
  companyId: state => state.user.userInfo.companyId,
  department: state => state.user.userInfo.departmentName,
  routes: state => state.permission.rutes
}
export default getters
