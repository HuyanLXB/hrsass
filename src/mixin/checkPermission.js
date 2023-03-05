import store from '@/store'
export default {
  methods: {
    checkPermission(key) {
      const { userInfo } = store.state.user
      return userInfo.roles.points.some(item => item === key)
    }
  }
}
