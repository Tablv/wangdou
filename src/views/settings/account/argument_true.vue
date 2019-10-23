<template>
  <section class="argument-container">
    <section class="page-header">
      <div class="page-header-name">参数选项</div>
      <div class="page-header-actions">
        <Button type="primary" @click="doSave">保存</Button>
        <Button @click="doInit">取消</Button>
      </div>
    </section>
    <section class="page-content">
      <vxe-table
      :border='false'
      :resizable="false"
      :data="tableData">
      <template v-for="item in columns">
        <vxe-table-column field="code" title="编码" v-if="item.key === 'code'" :key="item.key" width="120"></vxe-table-column>
        <vxe-table-column field="name" title="名称" v-else-if="item.key === 'name'" :key="item.key" width="250"></vxe-table-column>
        <vxe-table-column field="uniform" title="集团统一值" v-else-if="item.key === 'uniform'" :key="item.key" width="720">
          <template v-slot="{ row }">
            <div v-if="row.code==='GLC001'">
              <!-- {{row.uniform}} -->
              <Form :label-width="184" label-position="left">
              <div v-for="(itemData, index) in row.uniform" :key="index">
                <!-- <span>{{itemData.name}}</span> -->
                  <Row type="flex" justify="start">
                    <Col span="13">
                    <FormItem :label="itemData.name">
                      <radio-select class="radio-select-style" ref="lrAcc" :chooseTipShow="false" :reset="subject_config_one.refresh" :config="subject_config_one"  @getData="doGetlrAccSubjectData" @on-close="doReset">
                      <div slot="header" class="query-content">
                        <Row :gutter="8">
                          <Col span="4">
                            <Select v-model="subject_config_one.request_params.isEnable" disabled>
                              <Option value="1" label="已生效"></Option>
                            </Select>
                          </Col>
                          <!-- <Col span="4">
                            <Select v-model="subject_config_one.request_params.accountElementItem" @on-change="subject_config_one.refresh = !subject_config_one.refresh" disabled>
                              <Option value="all" label="全部会计要素"></Option>
                              <Option :value="item.id" :label="item.name" v-for="item in accountElementItemList" :key="item.id"></Option>
                            </Select>
                          </Col>
                          <Col span="4">
                            <Select v-model="subject_config_one.request_params.subjectCategory" @on-change="subject_config_one.refresh = !subject_config_one.refresh" disabled>
                              <Option value="all" label="全部科目类别"></Option>
                              <Option :value="item.id" :label="item.name" v-for="item in subjectCategoryList" :key="item.id"></Option>
                            </Select>
                          </Col>
                          <Col span="4">
                            <Select v-model="subject_config_one.request_params.accountCategory" @on-change="subject_config_one.refresh = !subject_config_one.refresh">
                              <Option value="all" label="全部分类"></Option>
                              <Option :value="item.value" :label="item.label" v-for="item in accountCategoryList" :key="item.value"></Option>
                            </Select>
                          </Col>
                          <Col span="4">
                            <Select v-model="subject_config_one.request_params.auxiliaryName" @on-change="subject_config_one.refresh = !subject_config_one.refresh">
                              <Option value="all" label="全部辅助核算项"></Option>
                              <Option :value="item.id" :label="item.name" v-for="item in subjectAuxiliaryList" :key="item.id"></Option>
                            </Select>
                          </Col> -->
                          <Col span="10" class-name="search-input-margin">
                            <Row class-name="search-input-content">
                              <Col span="21">
                                <Input v-model="subject_config_one.request_params.codeOrName" :maxlength="50" placeholder="会计科目编码/名称" clearable enter-button @on-clear="subject_config_one.refresh = !subject_config_one.refresh" @on-search="subject_config_one.refresh = !subject_config_one.refresh"></Input>
                              </Col>
                              <Col span="3">
                                <Button icon="ios-search" class="search-icon-button" @click="subject_config_one.refresh = !subject_config_one.refresh"></Button>
                              </Col>
                            </Row>
                          </Col>
                          <Col span="2" class-name="search-input-margin">
                            <Button class="reset-button" @click="doReset">重置</Button>
                          </Col>
                        </Row>
                      </div>
                    </radio-select>
                  </FormItem>
                    </Col>
                  </Row>

              </div>
              </Form>
            </div>
            <div v-else-if="row.code==='GLC002'">
              <Form>
                <Row type="flex" justify="start">
                  <Col >
                  <FormItem>
                    <RadioGroup v-model="row.uniform[0].value">
                      <Radio :label='0' value="0">损益科目合并结转</Radio>
                      <Radio :label='1' value="1">损益科目分开结转</Radio>
                    </RadioGroup>
                  </FormItem>
                  </Col>
                </Row>
              </Form>
            </div>
            <div v-else-if="row.code==='GLC004'">
              <Form>
                <FormItem>
                  <Select v-model="row.uniform[0].value" style="width:200px" transfer>
                    <Option v-for="item in credentialWordTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                  </Select>
                </FormItem>
              </Form>
            </div>
            <div v-else-if="row.code==='GLC005'">
              <Form>
                <FormItem>
                  <Select v-model="row.uniform[0].value" style="width:200px" transfer>
                    <Option v-for="item in futurePeriodNumList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                  </Select>
                </FormItem>
              </Form>
            </div>
            <div v-else-if="row.code==='GLC008' || row.code==='GLC011'">
              <Form v-for="(item,index) in row.uniform" :label-width="188" label-position="left" :key="index">
                <FormItem :label="item.name">
                  <RadioGroup v-model="item.value">
                    <Radio :label="0" value="1">是</Radio>
                    <Radio :label="1" value="2">否</Radio>
                  </RadioGroup>
                </FormItem>
              </Form>
            </div>
            <div v-else-if="row.code==='GLC012'">
              <Form>
                <FormItem>
                  <RadioGroup v-model="row.uniform[0].value" class="radioPage">
                    <Row type="flex" justify="start">
                      <Col span="8">
                        <Radio :label="0" value="0">发票版（14*24）</Radio>
                        <span class="table-span isyl" ref="getColor" > <a class="table-span" :href="require('../../../assets/images/print-model/发票版.png')" target="_blank">预览</a></span>
                      </Col>
                      <Col span="7">
                        <Radio :label="1" value="1">A4纸 一版</Radio>
                        <span class="table-span isyl"> <a class="table-span" :href="require('../../../assets/images/print-model/A4版_横向.png')" target="_blank">预览</a></span>
                      </Col>
                      <Col span="6">
                        <Radio :label="2" value="2">A4纸 二版</Radio>
                        <span class="table-span isyl"> <a class="table-span" :href="require('../../../assets/images/print-model/A4版_2版_横向.png')" target="_blank">预览</a></span>
                      </Col>
                    </Row>
                    <Row type="flex" justify="start">
                      <Col span="8">
                        <Radio :label="3" value="2">A4纸 三版</Radio>
                        <span class="table-span isyl"> <a class="table-span" :href="require('../../../assets/images/print-model/A4版_3版_横向.png')" target="_blank">预览</a></span>
                      </Col>
                      <Col span="7">
                        <Radio :label="4" value="4">A5纸</Radio>
                        <span class="table-span isyl">  <a class="table-span" :href="require('../../../assets/images/print-model/A5版_横向.png')" target="_blank">预览</a></span>
                      </Col>
                    </Row>
                  </RadioGroup>
                </FormItem>
              </Form>
            </div>
            <div v-else-if="row.code==='GLC013'">
              <Form>
                <FormItem>
                  <RadioGroup v-model="row.uniform[0].value">
                    <Radio :label="0" value="1">编码+本级名称</Radio>
                    <Radio :label="1" value="0">编码+全级名称</Radio>
                  </RadioGroup>
                </FormItem>
              </Form>
            </div>
            <div v-else>
              <Form>
                <FormItem>
                  <RadioGroup v-model="row.uniform[0].value">
                    <Radio :label="0" value="1" :disabled="row.uniform[0].modifyType===-1">是</Radio>
                    <Radio :label="1" value="2" :disabled="row.uniform[0].modifyType===-1">否</Radio>
                  </RadioGroup>
                </FormItem>
              </Form>

            </div>
          </template>
        </vxe-table-column>
        <vxe-table-column field="personalization" title="账簿个性化" v-else-if="item.key === 'personalization'" :key="item.key" width="120" align="center">
          <template v-slot="{ row }">
            <span @click="doPersonalization(row)" class="is-iconfont" v-if="row.uniform[0].isPersonal">
              <common-icon type="_set" :size="14"/>
            </span>
            <span @click="doPersonalization(row)" class="is-iconfont" v-else-if="row.code==='GLC001'">
              <common-icon type="_set" :size="14"/>
            </span>
          </template>
        </vxe-table-column>
        <vxe-table-column :field="item.key" :title="item.title" v-else :key="item.key"></vxe-table-column>
      </template>
      </vxe-table>
    </section>
    <Modal
      v-model="accountModel"
      width="720"
      :mask-closable="false"
      :transfer="false"
      draggable
      scrollable
      class="querCompany"
      >
      <p slot="header" style="color:#333;text-align:left">
        <span>账簿个性化-{{ titleName }}</span>
      </p>
      <section class="page-content">
        <Row type="flex" justify="end">
          <Col span="2">
            <span class="table-span">添加账簿</span>
          </Col>
          <Col span="2" style="width:29px">
            <span class="table-span">删除</span>
          </Col>
        </Row>
        <div class="page-content-table">
          <vxe-table
          :border='false'
          :resizable="false"
          max-height="310px"
          width="100%"
          :data="accountTableData">
          <template>
            <vxe-table-column type="selection" width='40' key="selection"></vxe-table-column>
            <vxe-table-column field="accountName" width='220' title="账簿名称" key="accountName"></vxe-table-column>
            <vxe-table-column field="accountValue" width='420' title="账簿值" key="accountValue">
              <template v-slot="{ row }">
                <div >
                  {{ row }}
                </div>
              </template>
            </vxe-table-column>
          </template>
          <template v-slot:empty>
            <nodata :icon-size="60" notice-text="暂无数据" ></nodata>
          </template>
          </vxe-table>
        </div>
      </section>
      <section slot="footer" >
        <div class="page-footer-rt" >
          <Button type="primary">确定</Button>
          <Button>取消</Button>
        </div>
      </section>
       <!-- <footer slot="footer">
        <div class="modal-footer-actions">
          <Button type="primary" >保存</Button>
          <Button >取消</Button>
        </div>
      </footer> -->
    </Modal>
  </section>
</template>

<script>
// import { saasMixin } from '@/libs/mixins'
import nodata from '_c/nodata'
import RadioSelect from '_c/radio-select'
import CommonIcon from '_c/common-icon'
export default {
  name: 'argument_index',
  data () {
    return {
      titleName: '损益结转科目设置',
      accountModel: false,
      formItem: {
        credentialWordType: 0,
        futurePeriodNum: 1
      },
      subject_config_one: { // 会计科目弹窗
        type: 'subjectSetting',
        title: '选择会计科目',
        width: '100%',
        refresh: false,
        request_params: {
          isFinal: 1, // 只显示末级科目
          isEnable: '1', // 已启用
          code: '4103', // 科目编码
          isEnterpriseAdmin: 1, // 是否租户管理员
          accountCategory: 'all', // 分类
          accountElementItem: 'all', // 会计要素
          subjectCategory: 'all', // 科目类别
          auxiliaryName: 'all', // 辅助核算名称
          codeOrName: '', // 编码或名称
          menuCode: 'argument_index'
        }
      },
      credentialWordTypeList: [ // 凭证字类型
        {
          value: 0,
          label: '记'
        },
        {
          value: 1,
          label: '收付转'
        }
      ],
      futurePeriodNumList: [ // 未来期间数
        {
          value: 1,
          label: '1'
        },
        {
          value: 2,
          label: '2'
        }
      ],
      columns: [ // 表头字段
        {
          title: '编码',
          key: 'code'
        },
        {
          title: '名称',
          key: 'name'
        },
        {
          title: '描述',
          key: 'description'
        },
        {
          title: '集团统一值',
          key: 'uniform',
          render: (h, { row }) => {
            return (
              console.log(row)
              // <span v-html='row.uniform'></span>
            )
          }
        },
        {
          title: '账簿个性化',
          key: 'personalization'
        }
      ],
      tableData: [ // 表格数据
        {
          code: 'GLC001',
          name: '损益结转科目设置',
          description: '设置损益结转科目',
          uniform: 'male',
          personalization: '图标'
        }
      ],
      accountTableData: [
        // {
        //   accountName: 'aaaaaaaa',
        //   accountValue: 'bbbb'
        // }
      ]
    }
  },
  components: {
    nodata,
    CommonIcon,
    RadioSelect
  },
  // mixins: [sassMixin],
  created () {},
  mounted () {
    this.doInit()
  },
  watch: {},
  methods: {
    // 初始化
    doInit () {
      this.$request.post('/ledger/parameterSet/findParameterSet').then(res => {
        let { code, data } = res.data
        if (code === 200) {
          console.log(data)
          let keys = Object.keys(data)
          this.tableData = keys.map(item => {
            console.log(data[item])
            // let uniform = data[item].filter((i, index, arr) => index !== 0)
            let uniform = data[item]
            console.log(uniform)
            return {
              code: data[item][0].groupCode,
              name: data[item][0].groupName,
              description: data[item][0].groupDesc,
              uniform: uniform,
              personalization: '图标'
            }
            // data[item].forEach(d => {
            //   console.log(d)
            // })
          })
          // console.log(Object.keys(data))
          // let tableColumn = data.Keys()
        }
      })
    },
    // 保存
    doSave () {},
    // 取消
    doCancel () {},
    // 重置
    doGetlrAccSubjectData () {},
    doReset () {},
    // 个性化设置
    doPersonalization (row) {
      this.accountModel = true
      this.titleName = row.name
      this.$request.post('/ledger/parameterSet/findParameterSetByGroupCode', { groupCode: row.code }).then(res => {
        let { code, data } = res.data
        if (code === 200) {
          console.log(data)
        }
      })
      console.log(row, 'aaaaaaa')
    }
  }
}
</script>

<style lang="less">
@import "../../../assets/css/base.less";
@import '../../../assets/css/redefine.less';
.argument-container {
  .page-content {
    .ivu-form-item {
      margin-top: 0px;
      margin-bottom: 0px;
      vertical-align: top;
      zoom: 1;
    }
    .ivu-radio-wrapper {
      margin-right: 40px;
    }
    .radioPage {
      width: 79%;
    }
    .is-iconfont {
      // color: #fff;
      cursor: pointer;
      // background:rgba(89,89,89,1);
    }
  }
  // 模态框的样式
  .querCompany {
    .ivu-modal-content {
      height: 502px !important;
    }
    .ivu-modal-body {
      padding: 0px;
      height: 388px;
    }
    .ivu-modal-footer {
      // border-top: 0;
      // padding: 0;
      text-align: right;
      bottom: -10px;
    }
    .tableHeight {
      height: 36px;
    }
    .company-input {
      display: inline-block;
    }
    .ivu-input-search {
      padding: 0 8px !important;
      color: #999999 !important;
      background: #FAFAFA !important;
      border-color: #e5e5e5 !important;
    }
    .ivu-input-search:before {
      background: none
    }
    .ivu-input-search-icon {
      background-color: #fafafa;
      border: 1px solid #e5e5e5;
    }
    .span-space {
      .span-space(8px, 0)
    }
    .doReset {
      margin-left: 12px
    }
  }
  .isyl {
    // position: relative;
    position: absolute;
    // top:2px;
    right:25px;
  }
}
</style>
