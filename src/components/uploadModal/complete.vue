<template>
<!-- 验证数据 -->
<div class="verifical">
  <div class="verifical-box">
    <div class="verifical-box-success">
      <span class="success-font">
        <!-- 导入成功，共导入{{number}}条 -->
        <template v-if="verStep === 1">数据正在校验中，请稍后<Icon type="ios-loading" size=30 class="demo-spin-icon-load"></Icon></template>
        <template v-else-if="verStep === 2">校验通过，数据导入中<Icon type="ios-loading" size=30 class="demo-spin-icon-load"></Icon></template>
        <template v-else-if="verStep === 3">
          {{message}}
          <div class="error-color textBtn" v-if="message !== '数据全部导入成功'"  @click="doResult">校验结果</div>
        </template>
        <template v-else>
         <!-- {{message}}，继续导入将会忽略错误数据，你也可以下载 -->校验发生错误，你可以下载
         <!--  校验发生错误， -->
          <div class="error-color textBtn" @click="doResult">校验结果</div>
          进行查看
        </template>
      </span>
    </div>
  </div>
  <div class="upload-footer">
    <button class="btn-next box-background" @click="doClickClose">完成</button>
  </div>
  <a id="a_id"></a>
</div>
</template>
<script>
import { session } from '@/libs/location'
import { saasMixin } from '@/libs/mixins'
export default {
  mixins: [saasMixin],
  props: {
    uploadData: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      baseUrl: JSON.parse(session.getItem('json')).interface_url,
      verStep: 0, // 验证的步骤
      uuid: '',
      message: '',
      number: 20 // 导入条数
    }
  },
  mounted () {
    this.doVerifical()
  },
  watch: {
    verStep (val) {
      if (val === 1 || val === 2) {
        this.doIdentifying(this.$route, true)
      } else {
        this.doIdentifying(this.$route, false)
      }
    }
  },
  methods: {
    // 当页面存在正在进行中的操作，会提示
    doShowEditModal () {
      let that = this
      this.$Control({
        type: 'confirm',
        title: '消息提示',
        message: '当前页面存在进行中的操作，关闭后仍会继续进行，是否继续等待？',
        button: ['确认', '取消'],
        yes () {
          that.$CloseCtl()
        },
        cancel () {
          that.doContinueActions()
          that.$CloseCtl()
        }
      })
    },
    // 下载校验结果
    doResult () {
      let req = {}
      this.$request.post('/financeback/file/downloadExcelResult?uuid=' + this.uuid, req, 'blob').then(res => {
        const aLink = document.getElementById('a_id')
        let blob = new Blob([res.data], { type: 'application/vnd.ms-excel' })
        aLink.href = URL.createObjectURL(blob)
        aLink.download = 'excel_result' + '.txt' // 设置下载文件名称
        aLink.click()
        document.body.appendChild(aLink)
      })
    },
    // 上传校验
    doVerifical () {
      this.verStep = 1
      this.$request.post('/financeback/file/checkExcel', this.uploadData).then(response => {
        const { data, code } = response.data
        let that = this
        if (code === 200) {
          this.uuid = data.uuid
          if (data.isOk) {
            // 校验成功
            setTimeout(function () {
              that.verStep = 2
              that.doUpload()
            }, 1000)
          } else {
            that.message = data.message
            // 校验失败
            setTimeout(function () {
              that.verStep = 4
            }, 2000)
          }
        }
      })
    },
    // 校验完成，上传
    doUpload () {
      this.$request.post('/financeback/file/importExcel', { uuid: this.uuid }).then(response => {
        const { data, code } = response.data
        if (code === 200) {
          this.message = data.message ? data.message : '数据全部导入成功'
          this.uuid = data.uuid
          this.verStep = 3
        }
      })
    },
    // 点击完成
    doClickClose () {
      this.$emit('close', false)
      this.$emit('step', {
        step: 1
      })
    }
  }

}
</script>
<style lang="less" scoped>
#a_id {
  display: none;
}
.error-color {
  cursor: pointer;
}
.verifical {
  width: 100%;
  height: 100%;
}
.demo-spin-icon-load{
  animation: ani-demo-spin 1s linear infinite;
}

.verifical-box {
  width: 100%;
  overflow: hidden;
  .verifical-box-success {
    width: 100%;
    text-align: center;
    margin-top: 150px;
    .success-icon {
      color: #54d11e;
      width: 14px;
      height: 14px;
    }
    .success-font {
      font-size: 14px;
      color: #333333;
    }
  }
}

.upload-footer {
  width: 100%;
  height: 50px;
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
    margin-top: 9px;
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
    margin-top: 9px;
    margin-right: 8px;
    cursor: pointer;
  }
  .btn-close {
    outline: none;
    background: none;
    border: none;
    width: 68px;
    height: 32px;
    background: #fafafa;
    font-size: 12px;
    color: #696969;
    margin-top: 9px;
    margin-right: 8px;
    border: 1px solid #e5e5e5;
    cursor: pointer;
  }
}
</style>
