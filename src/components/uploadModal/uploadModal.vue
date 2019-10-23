<template>
  <div class="authUserModal">
    <Modal
    class-name="auth-modal"
    v-model="uploadValue"
    :closable="false"
    :transfer="false"
    :mask-closable="false"
    >
      <div class="upload-subject">
        <div class="upload-subject-header">导入</div>
        <div class="upload-subject-title">
          <div class="title-box">
            <div :class="step === 1 ? 'upload-subject-title-item-active textBorder' : 'upload-subject-title-item'">
              <span class="item-no box-background">1</span>
<!--              <common-icon type="_upload" class="item-icon-upload"></common-icon>-->
              <span class="item-font">上传文件</span>
            </div>
            <div :class="step === 2 ? 'upload-subject-title-item-active textBorder' : 'upload-subject-title-item'">
              <span class="item-no box-background">2</span>
<!--              <common-icon type="_complete" class="item-icon-complete"></common-icon>-->
              <span class="item-font">导入数据</span>
            </div>
          </div>
        </div>
        <div class="upload-subject-box">
          <upload @close="doUploadClose" @step="doIntoStep" :template-type="templateType" v-if="step===1"></upload>
          <complete @close="doUploadClose" @step="doIntoStep" v-if="step===2" :upload-data="uploadData"></complete>
        </div>
      </div>
    </Modal>
  </div>
</template>
<script>
// import CommonIcon from '_c/common-icon'
import upload from './upload.vue' // 导入开始
import complete from './complete.vue' // 导入完成
export default {
  components: {
    // CommonIcon,
    upload,
    complete
  },
  data () {
    return {
      uploadData: {},
      step: 1, // 导入到第几步
      subjectId: null,
      cashFlowId: null,
      isEnterpriseAdmin: null // 角色
    }
  },
  props: {
    isupload: {
      defalut: null,
      type: Boolean
    },
    templateType: {
      type: String,
      default: '',
      required: true
    }
  },
  computed: {
    uploadValue () {
      return this.isupload
    }
  },
  methods: {
    // 监听开始导入取消按钮
    doUploadClose (msg) {
      this.$emit('modalClose', false)
    },
    // 监听点击下一步
    doIntoStep (reqdata) {
      this.step = parseInt(reqdata.step)
      if (this.step === 2) {
        this.uploadData = {
          templateType: reqdata.templateType,
          fileName: reqdata.fileName,
          customParams: {
            subjectId: this.subjectId,
            cashFlowId: this.cashFlowId,
            isEnterpriseAdmin: this.isEnterpriseAdmin
          }
        }
      } else if (this.step === 3) {
        this.uploadData = {
          uuid: reqdata.uuid
        }
      }
    }
  }
}
</script>
<style lang="less">
@import './upload.less';

</style>
