<template>
  <div class="create_check">
    <section class="page-header">
      <div class="page-header-name">新增自定义核算项目</div>
      <div class="page-header-actions">
        <Button type="primary" @click="toPreserve">保存</Button>
        <Button @click="toPreAdds">保存并新增</Button>
        <Button @click="toCancel">取消</Button>
        <Button @click="toIndex">列表</Button>
      </div>
    </section>
    <section class="page-content">
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
      <Row>
        <Col span="12">
           <FormItem label="编码" prop="code" class="page-content-form-codeinput">
             <!-- <Input type="text" placeholder="自动编码" v-model="formValidate.code" disabled></Input> -->
             <Input type="text" placeholder="系统编码" disabled></Input>
          </FormItem>
        </Col>
        <Col span="12">
           <FormItem label="名称" prop="name" :label-width="97">
             <Input type="text" v-model="formValidate.name" @on-change="toListenChange" :maxlength=20 ></Input>
             <span v-if="isNameError" class="page-content-name-error">重复</span>
          </FormItem>
        </Col>
        <Col span="24">
          <FormItem label="描述">
            <Input type="textarea" v-model="formValidate.remark" @on-change="toListenChange" :autosize="{minRows: 2,maxRows: 5}" :maxlength=200></Input>
          </FormItem>
        </Col>
      </Row>
      </Form>
    </section>
  </div>
</template>

<script>
import { Validation } from '@/libs/util'
import { saasMixin } from '@/libs/mixins'
import { mapMutations } from 'vuex'
export default {
  name: 'create_check',
  mixins: [saasMixin],
  data () {
    return {
      rowId: this.$route.query.id,
      isNameError: false,
      isChanged: false,
      formValidate: {},
      ruleValidate: {
        name: [{ required: true, validator: Validation.checkNameRule, trigger: 'blur' }]
      }
    }
  },
  mounted () {
    if (this.$route.query.id) {
      this.doCopyInit()
    }
  },
  methods: {
    ...mapMutations([
      'addIdToList'
    ]),
    /**
     * 复制方法初始化
     */
    doCopyInit () {
      this.$request.post('/financeback/accountingItem/findAccountingItemById', { id: this.$route.query.id }).then(({ status, data }) => {
        if (status === 200 && data.code === 200) {
          // 带入除编码和名称以外的信息
          data.data.code = ''
          data.data.name = ''
          this.formValidate = data.data
          // this.formValidateBck = JSON.stringify(this.formValidate)
        }
      })
    },
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
     * 保存按钮
     * 通过校验后，发送插入请求
     * 请求成功后，跳转查看页面
     */
    toPreserve () {
      this.doInsert(res => this.$router.push({ name: 'update_check', query: { id: res.data.data } }))
    },
    /**
     * 保存并新增按钮
     */
    toPreAdds () {
      this.doInsert(() => {
        this.formValidate = {}
        this.isChanged = false
      })
    },
    /**
     * 插入动作
     */
    doInsert (callback) {
      this.isNameError = false
      if (this.toCheckRule()) {
        let params = {
          name: this.formValidate.name, // 名称
          code: this.formValidate.code, // 编码
          // 当前版本默认为“集团”，不可修改
          codeType: 0, // 编码类型 0：系统、1：自定义
          // 值集取自基础资料控制策略； 默认为共享型，不可修改；
          dataType: 1, // 资料类型 1：共享型， 2：分配型 3：私有型
          remark: this.formValidate.remark // 描述
        }
        this.$request.post('/financeback/accountingItem/addAccountingItem', params).then(res => {
          if (res.data.code === 200) {
            this.$Message.success('保存成功')
            this.addIdToList({ id: res.data.data, name: 'check' })
            callback(res)
          }
          if (res.data.code === 10009) {
            this.isNameError = true
          }
        })
      }
    },
    /**
     * 取消按钮
     * 检查当前页有没有修改
     * 有：提示是否需要保存
     * 否：打开新增页
     */
    // 版本修改，取消按钮不提示保存，完全变成重置效果
    toCancel () {
      if (this.isChanged) {
        let that = this
        this.$Control({
          type: 'confirm',
          title: '确认取消',
          message: '取消操作会重置当前表单，是否继续',
          button: ['确认', '取消'],
          yes () {
            that.$CloseCtl() // 关闭弹窗
            that.formValidate = {}
            that.isChanged = false
            that.isNameError = false
          },
          cancel () {
            that.$CloseCtl()
            that.$Message.info('已取消')
          }
        })
      }
    },
    toIndex () {
      this.doLocationDetail('check_index')
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
          that.doInsert(that.doContinueActions)
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
    }
  },
  watch: {
    isChanged (val) {
      this.doIdentifying(this.$route, val)
    }
  }
}
</script>
<style lang="less">
.create_check {
  .ivu-form-item-error-tip {
    display: none;
  }
  .page-content {
    width: 857px;
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
