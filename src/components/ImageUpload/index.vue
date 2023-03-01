<template>
  <div>
    图片上传组件
    <!-- 该组件的要求 -->
    <!--
    1. 可以显示传入的图片地址
    2. 可以删除传入的图片地址
    3. 可以上传图片到云服务器
    4. 上传到腾讯云之后，可以返回图片地址，显示
    5. 上传成功之后，可以回调成功函数 -->
    <el-upload
      list-type="picture-card"
      :limit="1"
      :on-preview="Preview"
      :on-remove="handleRemove"
      :on-change="fileChange"
      :file-list="fileList"
      :before-upload="checkFile"
      :http-request="upload"
      :class="{disabled:fileComputed}"
      action="#"
    >
      <i class="el-icon-plus" />
    </el-upload>
    <!-- 进度条 -->
    <el-progress v-if="showProgress" :percentage="percent" style="width: 180px" />
    <!-- 预览弹窗 -->
    <el-dialog title="图片" :visible.sync="showDialog">
      <img :src="imgUrl" style="width:100%" alt="">
    </el-dialog>
  </div>
</template>

<script>
import COS from 'cos-js-sdk-v5'
var cos = new COS({
  SecretId: 'AKIDAD2f5IZbP2UilfSJwLWRBrMgHhxQFsLe', // 身份识别 ID
  SecretKey: 'QfillcGi0BC1mLeiXR8aUAeuwpiRvDao' // 身份密钥
})
export default {
  name: 'ImgUpload',
  data() {
    return {
      fileList: [], // 图片地址设置为数组
      showDialog: false, // 控制显示弹层
      imgUrl: '',
      currentFileUid: '', // 记录当前上传的图片id
      percent: 0,
      showProgress: false
    }
  },
  computed: {
    // 设计一个计算属性来判断是否已经上传了一个图片
    fileComputed() {
      return this.fileList.length === 1
    }
  },
  methods: {
    Preview(file) {
      console.log(file)
      this.imgUrl = file.url
      //   展示预览弹窗
      this.showDialog = true
    },
    handleRemove(file, fileList) {
      console.log('file', file) // file 是被删除的那个图片
      console.log('fileList', fileList) // fileList 是删除图片之后的那个文件数组，但是并没有实际上改变组件里的文件数组
      this.fileList = fileList
    },
    // 在这个函数里面不能用push的方式新增数据，因为这个函数会执行多次 选择文件的时候执行一次 向后端提交的时候执行一次
    fileChange(file, fileList) {
      //   判断组件里的fileList是否已经有了该文件，如果有了的话就停止新增
      // 上传成功之后 还会进来 需要实现上传代码的逻辑 这里才会成功
      if (!this.fileList.some(item => item.uid === file.uid)) {
        this.fileList.push(file)
      }
      console.log('changefile', file) // file
      console.log('fileList', fileList)
      console.log('thisfileList', this.fileList)
      console.log(123)
    },
    checkFile(file) {
      // 该函数负责对上传上来的文件进行检查
      //  1.检查文件类型
      const types = ['image/jpeg', 'image/gif', 'image/bmp', 'image/png']
      if (types.indexOf(file.type) === -1) {
        // 消息提示
        this.$message.error("文件类型只能是'image/jpeg', 'image/gif', 'image/bmp', 'image/png'")
        return false
      }
      //   2.检查文件大小
      const maxSize = 5 * 1024 * 1024
      if (file.size > maxSize) {
        this.$message.error('文件大小不能超过5M')
        return false
      }
      console.log(file)
      //   检查通过继续上传
      //   记录确定上传的UID
      this.currentFileUid = file.uid
      // 开启进度条
      this.showProgress = true
      return true
    },
    // 自定义上传动作
    upload(params) {
      console.log(params.file)

      if (params.file) {
        cos.putObject({
          Bucket: 'huyan-1317047735', /* 填入您自己的存储桶，必须字段 */
          Region: 'ap-chongqing', /* 存储桶所在地域，例如ap-beijing，必须字段 */
          Key: params.file.name, /* 存储在桶里的对象键（例如1.jpg，a/b/test.txt），必须字段 */
          Body: params.file, /* 必须，上传文件对象，可以是input[type="file"]标签选择本地文件后得到的file对象 */
          StorageClass: 'STANDARD', // 上传模式 默认标准
          onProgress: (params) => { // 进度条
            this.percent = params.percent * 100
          }
        }, (err, data) => {
          // data返回数据会进入到这个函数
          console.log(err || data)
          if (!err && data.statusCode === 200) {
            // 表示上传成功
            // 因为我们在前面on-change事件的时候 已经把图片文件加入到fileList中了
            // 所以fileList里面可能会有多个文件，我们需要确认上传成功的是那个文件
            this.fileList = this.fileList.map(item => {
              if (item.uid === this.currentFileUid) {
                return { url: `http://${data.Location}`, upload: true }
              }
              return item
            })
          }
          // 保证进度条没有那么快消失
          setTimeout(() => {
            this.showProgress = false // 隐藏进度条
            this.percent = 0 // 进度归0
          }, 2000)
        })
      }
    }
  }

}
</script>

<style>
.disabled .el-upload--picture-card {
  display: none
}
</style>
