<template>
  <div class="updata_check">
    <common-icon v-if='formValidate.isEnable === 0' class="yishixiao" type="_yishixiao1"></common-icon>
    <common-icon v-if='formValidate.isDel === 1' class="yishixiao" type="_yishanchu"></common-icon>
    <section class="page-header">
      <div class="page-header-name">查看自定义核算项目</div>
      <div class="page-header-actions">
        <Button type="primary" @click="toPreserve">保存</Button>
        <!-- <Button @click="toPreAdds">保存并新增</Button> -->
        <Button @click="toCancel">取消</Button>
        <Button @click="toAdds">新增</Button>
        <Button @click="toCopy">复制</Button>
        <Button @click="toDelete">删除</Button>
        <Button @click="toIndex">列表</Button>
        <Button @click="toProhibit" v-if="formValidate.isEnable === 1">禁用</Button>
        <Button @click="toUnProhibit" v-if="formValidate.isEnable === 0">反禁用</Button>
        <Button @click="tofindFirst" class="isfenye">
          <span class="dofenye">
            <common-icon class="fenye" type="_shouye"></common-icon>
          </span>
        </Button>
        <Button @click="tofindPrevious" icon="ios-arrow-back"></Button>
        <Button @click="tofindNext" icon="ios-arrow-forward"></Button>
        <Button @click="tofindEnd" class="isfenye">
          <span class="dofenye">
            <common-icon class="fenye" type="_moye"></common-icon>
          </span>
        </Button>
      </div>
    </section>
    <section class="page-content">
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
      <Row>
        <Col span="12">
           <FormItem label="编码" prop="code" class="page-content-form-codeinput">
              <Input type="text" v-model="formValidate.code" disabled></Input>
          </FormItem>
        </Col>
        <Col span="12">
           <FormItem label="名称" prop="name" :label-width="97">
              <Input type="text" v-model="formValidate.name" @on-change="toListenChange" :disabled="formValidate.isEnable === 0 || isRelation"></Input>
              <span v-if="isNameError" class="page-content-name-error">重复</span>
          </FormItem>
        </Col>
        <Col span="24">
          <FormItem label="描述">
            <Input type="textarea" v-model="formValidate.remark"  @on-change="toListenChange" :autosize="{minRows: 2,maxRows: 5}" :disabled="formValidate.isEnable === 0 || isRelation"></Input>
          </FormItem>
        </Col>
      </Row>
      </Form>
    </section>
  </div>
</template>

<script>
import { saasMixin } from '@/libs/mixins'
import { Validation } from '@/libs/util'
import { mapMutations } from 'vuex'
import CommonIcon from '_c/common-icon'
export default {
  name: 'update_check',
  components: {
    CommonIcon
  },
  mixins: [saasMixin],
  data () {
    return {
      isRelation: false,
      isNameError: false,
      isChanged: false,
      rowId: this.$route.query.id,
      formValidate: {},
      formValidateBck: '',
      ruleValidate: {
        name: [{ required: true, validator: Validation.checkNameRule, trigger: 'blur' }]
      }
    }
  },
  methods: {
    ...mapMutations([
      'closeTag'
    ]),
    /**
     * 监听编辑变化
     */
    toListenChange () {
      this.isChanged = true
    },
    /**
     * 检验函数
     * 编码通过后----名称----执行回调
     */
    toCheckRule (callback) {
      let rulePass = true
      this.$refs['formValidate'].validateField('name', valid => {
        if (valid) {
          rulePass = false
          return this.$Message.error(`名称错误:${valid}`)
        }
      })
      return rulePass
    },
    /**
     * 初始化数据
     */
    doInit () {
      this.$request.post('/financeback/accountingItem/findAccountingItemById', this.selectParams).then(({ status, data }) => {
        if (status === 200 && data.code === 200) {
          this.formValidate = data.data
          this.formValidateBck = JSON.stringify(this.formValidate)
        }
      })
      this.doCheckRelation()
    },
    /**
     * 检查是否存在引用关系
     */
    doCheckRelation () {
      this.$request.post('/financeback/accountingItemValue/findItemValueIsReference', { ids: [this.$route.query.id] }).then(({ data }) => {
        if (data.code === 200) {
          this.isRelation = data.data === 1
        }
      })
    },
    /**
     * 关闭页签的提示框
     */
    doShowEditModal () {
      let that = this
      this.$Control({
        type: 'control',
        title: '提示信息',
        message: '当前页面数据已发生变化，是否保存再继续？',
        button: ['是', '否', '取消'],
        yes () {
          that.$CloseCtl() // 关闭弹窗
          that.doUpdate(that.doContinueActions)
        },
        no () {
          that.$CloseCtl()
          that.doContinueActions()
        },
        cancel () {
          that.$CloseCtl()
          that.$Message.info('已取消')
        }
      })
    },
    /**
     * 保存按钮
     * 1 判断数据有没有变化
     * 2 检测必填项，校验逻辑
     */
    toPreserve () {
      this.doUpdate(this.doInit)
    },
    /**
     * 更新请求
     */
    doUpdate (callback) {
      if (this.isChanged) {
        if (this.toCheckRule()) {
          this.$request.post('/financeback/accountingItem/updateAccountingItem', this.formValidate).then(({ data }) => {
            if (data.code === 200 && data.status === 'success') {
              this.isChanged = false
              this.$Message.success('保存成功！')
              if (callback) { callback() }
            }
          })
        }
      } else {
        this.$Message.success('保存成功！')
      }
    },
    /**
     * 保存并新增按钮
     * 点击后执行保存规则，并在保存成功后打开新增页面；
     */
    toPreAdds () {
      if (this.isChanged) {
        this.doUpdate(() => {
          this.$router.push({ name: 'create_check' })
        })
      } else {
        this.$router.push({ name: 'create_check' })
      }
    },
    /**
     * 清空动作
     */
    toClear () {
      this.formValidate = JSON.parse(this.formValidateBck)
    },
    /**
     * 取消按钮
     * 1 检查数据有没有变化
     * 2 true 提示 false 清空
     */
    toCancel () {
      if (this.isChanged) {
        let that = this
        this.$Control({
          type: 'confirm',
          title: '提示信息',
          message: '取消操作会重置当前表单，是否继续？',
          button: ['确认', '取消'],
          yes () {
            that.$CloseCtl() // 关闭弹窗
            that.isChanged = false
            that.toClear()
          },
          cancel () {
            that.$CloseCtl()
            that.$Message.info('已取消')
          }
        })
      }
    },
    /**
     * 新增按钮
     * 1 判断数据是否发生变化
     */
    toAdds () {
      this.doLocationDetail('create_check')
    },
    /**
     * 复制按钮
     */
    toCopy () {
      this.isChanged ? this.toShowTips(() => { this.$router.push({ name: 'create_check', query: { id: this.rowId } }) }) : this.doLocationDetail('create_check', { id: this.rowId })
    },
    /**
     * 删除按钮
     * 1 判断数据有没有发生变化
     * 2 判断当前数据有没有值列表
     * 3 弹出删除弹窗
     */
    toDelete () {
      this.toShowDeleteModal()
      // this.toCheckRelaValue()
    },
    /**
     * 删除提示框
     */
    toShowDeleteModal () {
      let that = this
      this.$Control({
        type: 'confirm',
        title: '确认删除',
        message: '注意：删除后将不可恢复！请确认是否要删除数据？',
        button: ['确认', '取消'],
        yes () {
          that.$CloseCtl() // 关闭弹窗
          that.doDelete()
        },
        cancel () {
          that.$CloseCtl()
          that.$Message.info('已取消')
        }
      })
    },
    /**
     * 检测当前项目有没有值列表
     */
    async toCheckRelaValue () {
      let params = { ids: [this.rowId] }
      let isRelaValue = await this.$request.post('/financeback/accountingItem/findItemRelaValueById', params).then(({ data }) => {
        if (data.code === 200) {
          return data.data.length !== 0
        }
      })
      if (isRelaValue) {
        let that = this
        this.$Control({
          type: 'confirm',
          title: '提示信息',
          message: '注意：删除将会连带值列表中的值一起删除!',
          button: ['确认', '取消'],
          yes () {
            that.$CloseCtl() // 关闭弹窗
            that.toShowDeleteModal()
          },
          cancel () {
            that.$CloseCtl()
            that.$Message.info('已取消')
          }
        })
      } else {
        this.toShowDeleteModal()
      }
    },
    /**
     * 删除请求
     */
    doDelete () {
      let params = { ids: [this.$route.query.id], versions: [this.$route.query.version] }
      this.$request.post('/financeback/accountingItem/deleteAccountingItemByIds', params).then(({ data }) => {
        if (data.code === 200) {
          if (data.data.failList.length) {
            this.$Message.error('删除失败:' + data.data.failList[0].referenceDescription)
          }
          if (data.data.successList.length) {
            this.$Message.success('删除成功')
            this.findNext('delete')
          }
        }
      })
    },
    /**
     * 列表按钮
     * 1 判断数据有没有发生变化
     * 2 跳转列表页
     */
    toIndex () {
      this.doLocationDetail('check_index')
    },
    /**
     * 禁用提示框
     */
    toShowProhibitModal () {
      let that = this
      this.$Control({
        type: 'confirm',
        title: '提示信息',
        message: '注意：禁用后将不能在新增数据中使用！请确认是否要禁用数据',
        button: ['确认', '取消'],
        yes () {
          that.$CloseCtl() // 关闭弹窗
          that.doProhibit()
        },
        cancel () {
          that.$CloseCtl()
          that.$Message.info('已取消')
        }
      })
    },
    /**
     * 禁用按钮
     */
    toProhibit () {
      this.doProhibit()
    },
    /**
     * 禁用请求
     */
    doProhibit () {
      let params = { ids: [this.$route.query.id], isEnable: 0, versions: [this.$route.query.version] }
      this.$request.post('/financeback/accountingItem/disableAccountingItemBatch', params).then(({ data }) => {
        if (data.code === 200) {
          if (data.data.successList.length) {
            this.$Message.success('禁用成功')
            this.doInit()
          }
          if (data.data.failList.length) {
            this.$Message.error('禁用失败:' + data.data.failList[0].referenceDescription)
          }
        }
      })
    },
    /**
     * 反禁用提示框
     */
    toShowUnProhibitModal () {
      let that = this
      this.$Control({
        type: 'confirm',
        title: '提示信息',
        message: '请确认是否要反禁用数据？',
        button: ['确认', '取消'],
        yes () {
          that.$CloseCtl() // 关闭弹窗
          that.doUnProhibit()
        },
        cancel () {
          that.$CloseCtl()
          that.$Message.info('已取消')
        }
      })
    },
    /**
     * 反禁用按钮
     */
    toUnProhibit () {
      this.doUnProhibit()
    },
    /**
     * 反禁用请求
     */
    doUnProhibit () {
      let params = { ids: [this.$route.query.id], isEnable: 1, versions: [this.$route.query.version] }
      this.$request.post('/financeback/accountingItem/enableAccountingItemBatch', params).then(({ data }) => {
        if (data.code === 200) {
          if (data.data.successList.length) {
            this.$Message.success('反禁用成功')
            this.doInit()
          }
          if (data.data.failList.length) {
            this.$Message.error('反禁用失败:' + data.data.failList[0].referenceDescription)
          }
        }
      })
    },
    /**
     * 展示提示信息
     */
    toShowTips (callback) {
      let that = this
      this.$Control({
        type: 'control',
        title: '提示信息',
        message: '当前数据已修改，需要保存吗？',
        button: ['是', '否', '取消'],
        yes () {
          that.$CloseCtl() // 关闭弹窗
          that.doUpdate(callback)
        },
        no () {
          that.$CloseCtl()
          callback()
        },
        cancel () {
          that.$CloseCtl()
          that.$Message.info('已取消')
        }
      })
    },
    /**
     * 首条按钮
     * 判断数据是否发生变化
     * 发生变化：执行统一提示
     * 没有变化：调用首条方法
     */
    tofindFirst () {
      this.isChanged ? this.toShowTips(this.findFirst) : this.findFirst()
    },
    /**
     * 首条方法
     */
    findFirst () {
      let _num = this.doFindPage(1, this.rowId)
      if (_num === '当前为首条') {
        return false
      } else {
        this.rowId = _num
        this.$router.push({ name: 'update_check', query: { id: _num } })
      }
    },
    /**
     * 上一条按钮
     * 判断数据是否发生变化
     * 发生变化：执行统一提示
     * 没有变化：调用上一条方法
     */
    tofindPrevious () {
      this.isChanged ? this.toShowTips(this.findPrevious) : this.findPrevious()
    },
    /**
     * 上一条方法
     */
    findPrevious () {
      let _num = this.doFindPage(2, this.rowId)
      if (_num === '当前为首条') {
        return false
      } else {
        this.rowId = _num
        this.$router.push({ name: 'update_check', query: { id: _num } })
      }
    },
    /**
     * 下一条按钮
     * 判断数据是否发生变化
     * 发生变化：执行统一提示
     * 没有变化：调用下一条方法
     */
    tofindNext () {
      this.isChanged ? this.toShowTips(this.findNext) : this.findNext()
    },
    /**
     * 下一条方法
     */
    findNext (type) {
      let _num = this.doFindPage(3, this.rowId, type)
      if (_num === '当前为末条') {
        return false
      } else if (_num === '跳转') {
        this.$Message.info('查看页面暂无数据，3秒后跳转到列表页')
        setTimeout(() => {
          // this.$router.push({ name: 'cashflow_index' })
          this.closeTag(this.$route)
        }, 3000)
      } else {
        this.rowId = _num
        this.$router.push({ name: 'update_check', query: { id: _num } })
      }
    },
    /**
     * 尾条按钮
     * 判断数据是否发生变化
     * 发生变化：执行统一提示
     * 没有变化：调用尾条方法
     */
    tofindEnd () {
      this.isChanged ? this.toShowTips(this.findEnd) : this.findEnd()
    },
    /**
     * 尾条方法
     */
    findEnd () {
      // this.rowId = this.doFindPage(1, this.rowId)
      let _num = this.doFindPage(4, this.rowId)
      if (_num === '当前为末条') {
        return false
      } else {
        this.rowId = _num
        this.$router.push({ name: 'update_check', query: { id: _num } })
      }
    }
  },
  computed: {
    selectParams () {
      return {
        id: this.rowId
      }
    }
  },
  mounted () {
    this.doInit()
  },
  watch: {
    isChanged (val) {
      this.doIdentifying(this.$route, val)
    },
    selectParams () {
      this.doInit()
    }
  }
}
</script>
<style lang="less">
.updata_check {
  .page-content {
    width: 857px;
    .ivu-form-item-error-tip {
      display: none;
    }
    .ivu-row {
      .ivu-col {
        .ivu-form-item {
          margin-bottom: 8px;
          .ivu-form-item-label {
            padding: 10px 8px 10px 0;
          }
        }
        .ivu-form-item-required {
          .ivu-form-item-label {
            &:before {
              position: absolute;
              right: -18px;
            }
          }
          .page-content-name-error {
            position: absolute;
            color: red;
            right: -44px;
          }
        }
        .page-content-form-codeinput {
          margin-right: 17px;
        }
      }
    }
  }
}
</style>
