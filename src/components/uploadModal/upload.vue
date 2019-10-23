<template>
<!-- 开始导入 -->
<div class="upload">
  <div class="upload-title">
    如果您是初次使用，建议您<span @click="doDownTemplate">下载模板</span>进行查看
  </div>

  <div class="upload-input">
    <span class="upload-input-title">数据文件</span>
    <input type="text" v-model="uploadName" readonly class="upload-input-input"/>
    <Upload
      accept='.xls,.xlsx'
      :format="['xls','xlsx',]"
      :show-upload-list="false"
      :on-success="doUploadSuccess"
      :before-upload="doBeforUpload"
      :on-format-error="handleFormatError"
      :on-error="doErrorUpload"
      :headers="uploadToken"
      :max-size="5120"
      :action="`${baseUrl}/financeback/file/uploadExcel`">
      <Button class="upload-btn">
        <common-icon type="md-attach" class="upload-icon"></common-icon>
      </Button>
    </Upload>
    <Progress v-show="is_show" :percent="percentUp" :stroke-width="3" status="active" :class="start? 'upload-progress' : 'upload-progress-no'" />
    <div class="upload-message-font" v-show="result === 'success'">上传成功!</div>
    <div class="upload-error-font" v-show="result === 'error'">上传失败</div>
  </div>
  <div class="upload-footer">
    <button class="btn-no" v-show="!nextStep">下一步</button>
    <button class="btn-next box-background" v-show="nextStep" @click="doClickStep">下一步</button>
    <button class="btn-close" @click="doClickClose">取消</button>
  </div>
  <a id="down_a"></a>
</div>
</template>
<script>
import CommonIcon from '_c/common-icon'
import { session } from '@/libs/location'
export default {
  components: {
    CommonIcon
  },
  props: {
    templateType: {
      type: String,
      default: '',
      required: true
    }
  },
  data () {
    return {
      uploadData: {
        templateType: '',
        fileName: '' // 上传文件名称
      },
      uploadName: '', // 上传文件名称
      baseUrl: JSON.parse(session.getItem('json')).interface_url,
      percentUp: 0, // 上传进度
      is_show: true, // 进度条显示
      start: false, // 是否开始上传
      result: null, // 上传结果
      nextStep: false
    }
  },
  watch: {
    templateType (val) {
      this.uploadData.templateType = val
    }
  },
  created () {
    this.uploadData.templateType = this.templateType
  },
  computed: {
    uploadToken () {
      return this.$store.getters.uploadToken
    }
  },
  methods: {
    doDownTemplate () {
      let req = {}
      this.$request.post('/financeback/file/downloadExcelTemplate?templateType=' + this.uploadData.templateType, req, 'blob').then(res => {
        let postfix = res.headers ? res.headers['content-disposition'] ? res.headers['content-disposition'].split('.')[1] : 'xls' : 'xls'
        this.$download(res.data, this.uploadData.templateType, 'down_a', postfix)
      })
    },
    // 校验上传格式
    handleFormatError (file) {
      this.is_show = false
      this.$Message.warning(`上传文件格式不正确，请上传excel格式文件！`)
    },
    // 点击下一步
    doClickStep () {
      this.uploadData.step = 2
      // console.log(this.uploadData, 'uploaddata')
      this.$emit('step', this.uploadData)
    },
    // 上传成功时的钩子函数
    doUploadSuccess (response, file) {
      this.uploadName = file.name
      this.uploadData.fileName = response.data
      this.percentUp = 100
      this.nextStep = true
      let that = this
      setTimeout(function () {
        that.start = false
        that.percentUp = 0
        that.result = 'success'
      }, 1000)
    },
    // 上传失败
    doErrorUpload (wrong, file) {
      this.start = false
      this.percentUp = 0
      this.result = 'error'
      this.nextStep = false
    },
    // 上传之前
    doBeforUpload (file) {
      this.nextStep = false
      this.is_show = true
      this.uploadName = ''
      this.result = null
      this.start = true
      this.percentUp = 0
      var that = this
      var timer = setInterval(function () {
        if (that.percentUp >= 90) {
          clearInterval(timer)
        } else {
          that.percentUp = that.percentUp + 10
        }
      }, 200)
    },
    // 点击取消
    doClickClose () {
      this.$emit('close', false)
    }
  }
}
</script>
<style lang="less" scoped>
.upload {
  position: relative;
  width: 100%;
  height: 100%;
  #down_a {
    display: none;
  }
}
.upload-title {
  font-size: 14px;
  color: #333333;
  line-height: 94px;
  text-indent: 32px;
  span {
    color: #0ca99c;
    cursor: pointer;
  }
}
.upload-input {
  width: 675px;
  height: 35px;
  margin: 0 auto;
  margin-top: 65px;
  // border: 1px solid red;
  position: relative;
  .upload-input-title {
    width: 70;
    height: 35px;
    line-height: 35px;
    font-size: 14px;
    color: #4c4c4c;
    // margin-right: 16px;

  }
  .upload-input-input {
    position: absolute;
    top: 0;
    right: 0;
    outline: none;
    background: none;
    border: none;
    width: 605px;
    height: 34px;
    border: 1px solid #dddddd;
    text-indent: 16px;
    font-size: 14px;
    color: #333333;
  }
  .upload-btn {
    outline: none;
    border: none;
    background: none;
    width: 20px;
    height: 24px;
    background: #595959;
    position: absolute;
    top: 4.5px;
    right: 6px;
    padding: 0;
    cursor: pointer;
    span {
      vertical-align: none !important;
    }
    .upload-icon {
      color: #ffffff;
      width: 15px;
      height: 12px;
      line-height: 0.5 !important;
    }
  }
  .upload-progress {
    margin-left: 70px;
    width: 660px;
    display: block;
  }
  .upload-progress-no {
    margin-left: 70px;
    width: 660px;
    display: none;
  }
  .upload-message-font {
    margin-left: 70px;
    font-size: 14px;
    color: #00A497;
  }
  .upload-error-font {
    margin-left: 70px;
    font-size: 14px;
    color: #ed4014;
  }
}
.upload-footer {
  width: 100%;
  height: 50px;
  line-height: 49px;
  position: absolute;
  bottom: 0px;
  border-top: 1px solid #dddddd;
  text-align: right;
  .btn-no {
    outline: none;
    background: none;
    border: none;
    width: 68px;
    height: 32px;
    background: #f2f2f2;
    font-size: 12px;
    color: #c6c6c6;
    // margin-top: 9px;
    line-height: 32px;
    margin-right: 8px;
    cursor: pointer;
  }
  .btn-next {
    outline: none;
    // background: none;
    border: none;
    width: 68px;
    height: 32px;
    // background: #00a497;
    font-size: 12px;
    color: #ffffff;
    // margin-top: 9px;
    line-height: 32px;
    margin-right: 8px;
    cursor: pointer;
  }
  .btn-close {
    outline: none;
    background: none;
    border: none;
    width: 56px;
    height: 32px;
    background: #fafafa;
    font-size: 12px;
    color: #696969;
    // margin-top: 9px;
    line-height: 32px;
    margin-right: 8px;
    border: 1px solid #e5e5e5;
    cursor: pointer;
  }
}

</style>
