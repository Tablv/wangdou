<template>
  <section class="append-scheme-container">
    <Spin fix v-if="loading" style="left:8px;z-index:201">
      <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
      <div>正在载入数据</div>
    </Spin>
    <!-- 这里是判断已删除 -->
    <common-icon v-if="toRequest.isDel?true:false" class="yishixiao" type="_yishanchu" />
    <section class="page-header">
      <div class="page-header-name">多栏账方案设置</div>
      <div class="page-header-actions">
        <Button type="primary" @click="doSave('toRequest')" :disabled="toRequest.isDel?true:false">保存</Button>
        <!-- <Button @click="doShowEditModal('cancelBtn')" :disabled="toRequest.isDel?true:false">取消</Button> -->
        <Button @click="doCancel">取消</Button>
        <Button @click="doShowEditModal('create')" :disabled="toRequest.isDel?true:false">新增</Button>
        <Button @click="doShowEditModal('copy')" :disabled="toRequest.isDel?true:false">复制</Button>
        <!-- <Button @click="doShowEditModal('delete')" :disabled="VoucherField.isDel?true:false">删除</Button> -->
        <Button @click="doDeleteBtn" :disabled="toRequest.isDel?true:false">删除</Button>
        <Button @click="goSchemeList">列表</Button>
        <!-- 首条 -->
        <Button  @click="doShowEditModal('findFirst')" class="isfenye">
          <span class="dofenye">
            <common-icon  class="fenye" type="_shouye" />
          </span>
        </Button>
        <!-- 上一条 -->
        <Button icon="ios-arrow-back" @click="doShowEditModal('findPrevious')"></Button>
        <!-- 下一条 -->
        <Button icon="ios-arrow-forward" @click="doShowEditModal('findNext')"></Button>
        <!-- 末条 -->
        <Button class="isfenye" @click="doShowEditModal('findEnd')">
          <span class="dofenye">
            <common-icon  class="fenye" type="_moye" />
          </span>
        </Button>
      </div>
    </section>
    <section class="page-content">
      <Form ref="toRequest" :model="toRequest" :rules="ruleValidate" :label-width="110"  class="form_init formAdd"  >
        <Row>
          <Col span="8">
          <FormItem label="总账账簿" class="subject-scheme" prop="accountBookName" :show-message="false">
            <radio-select :config="account_config" :reset="account_config.refresh" v-model="toRequest.accountBookName" disabled @getData="doGetAccountData" placeholder="">
              <div slot="header" class="query-content">
                  <Row :gutter="8" class="no-error-modal">
                    <Col span="4">
                      <Select v-model="account_config.request_params.isEnable" disabled>
                        <Option :value="item.value" :label="item.label" v-for="item in modal_typeList" :key="item.value"></Option>
                      </Select>
                    </Col>
                    <Col span="4">
                      <Select v-model="account_config.request_params.subjectStandardName">
                        <Option value="0" label="全部会计准则"></Option>
                        <Option value="1" label="中国大陆企业"></Option>
                      </Select>
                    </Col>
                    <Col span="4">
                      <Select v-model="account_config.request_params.subjectCurrencyName">
                        <Option value="0" label="全部记账本位币"></Option>
                        <Option value="1" label="人民币"></Option>
                      </Select>
                    </Col>
                    <Col span="8">
                      <Row class-name="search-input-content">
                        <Col span="20" class="contralColor">
                          <Input v-model="account_config.request_params.codeOrName"
                          :maxlength="50" placeholder="账簿编码/名称" clearable enter-button
                          @on-search="account_config.refresh = !account_config.refresh"
                          @on-clear="account_config.refresh = !account_config.refresh"
                          @on-enter="account_config.refresh = !account_config.refresh"
                          ></Input>
                        </Col>
                        <Col span="2">
                          <Button icon="ios-search" class="search-icon-button" @click="account_config.refresh = !account_config.refresh"></Button>
                        </Col>
                      </Row>
                    </Col>
                    <Col span="2">
                      <Button class="reset-button" @click="doResetAccount">重置</Button>
                    </Col>
                  </Row>
                </div>
            </radio-select>
              <span class="istest">*</span>
            </FormItem>
          </Col>
          <Col span="8">
          <FormItem label="编码" prop="code">
            <Input class="color_change" v-model="toRequest.code" placeholder="保存时自动编码"  disabled />
          </FormItem>
          </Col>
          <Col span="8">
          <FormItem label="名称" prop="schemeName">
            <Input class="color_change" v-model="toRequest.schemeName" placeholder="保存时自动命名" @on-focus="doJudge" @on-change="doJudge('name')" :disabled="toRequest.isDel?true:false"/>
          </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="8">
          <FormItem label="查询类型" prop="schemeType">
            <Select v-model="toRequest.schemeType" @on-change="doChangeType" :disabled="toRequest.isDel?true:false">
              <Option v-for="item in findType" :value="item.value" :key="item.value">{{ item.label }}</Option>
           </Select>
          </FormItem>
          </Col>
          <Col span="8">
          <FormItem label="会计科目" class="subject-scheme" prop="accountSubjectName" :show-message="false">
            <radio-select :reset="subject_config.refresh" :disabled="toRequest.isDel?true:false" :config="subject_config" v-model="toRequest.accountSubjectName" @getData="doGetSubjectData" v-if="toRequest.accountBookId?true:false" @on-close="doResetSubject">
              <div slot="header" class="query-content">
                <Row :gutter="8" class="no-error-modal">
                  <Col span="4">
                    <Select v-model="subject_config.request_params.isEnable" @on-change="subject_config.refresh = !subject_config.refresh">
                      <Option value="all" label="全部"></Option>
                      <Option value="1" label="已生效"></Option>
                      <Option value="0" label="已失效"></Option>
                    </Select>
                  </Col>
                  <Col span="4">
                    <Select v-model="subject_config.request_params.accountElementItem" @on-change="subject_config.refresh = !subject_config.refresh">
                      <Option value="all" label="全部会计要素"></Option>
                      <Option :value="item.id" :label="item.name" v-for="item in accountElementItemList" :key="item.id"></Option>
                    </Select>
                  </Col>
                  <Col span="4">
                    <Select v-model="subject_config.request_params.subjectCategory" @on-change="subject_config.refresh = !subject_config.refresh">
                      <Option value="all" label="全部科目类别"></Option>
                      <Option :value="item.id" :label="item.name" v-for="item in subjectCategoryList" :key="item.id"></Option>
                    </Select>
                  </Col>
                  <Col span="4">
                    <Select v-model="subject_config.request_params.accountCategory" @on-change="subject_config.refresh = !subject_config.refresh">
                      <Option value="all" label="全部分类"></Option>
                      <Option :value="item.value" :label="item.label" v-for="item in accountCategoryList" :key="item.value"></Option>
                    </Select>
                  </Col>
                  <Col span="4">
                    <Select v-model="subject_config.request_params.auxiliaryName" @on-change="subject_config.refresh = !subject_config.refresh">
                      <Option value="all" label="全部辅助核算项"></Option>
                      <Option :value="item.id" :label="item.name" v-for="item in subjectAuxiliaryList" :key="item.id"></Option>
                    </Select>
                  </Col>
                  <Col span="10" class-name="search-input-margin">
                    <Row class-name="search-input-content">
                      <Col span="21" class="contralColor">
                        <Input v-model="subject_config.request_params.codeOrName"
                        :maxlength="50" placeholder="会计科目编码/名称" clearable enter-button
                        @on-search="subject_config.refresh = !subject_config.refresh"
                        @on-enter="subject_config.refresh = !subject_config.refresh"
                        @on-clear="subject_config.refresh = !subject_config.refresh"
                        ></Input>
                      </Col>
                      <Col span="3">
                        <Button icon="ios-search" class="search-icon-button" @click="subject_config.refresh = !subject_config.refresh"></Button>
                      </Col>
                    </Row>
                  </Col>
                  <Col span="2" class-name="search-input-margin">
                    <Button class="reset-button" @click="doResetSubject">重置</Button>
                  </Col>
                </Row>
              </div>
            </radio-select>
              <Select
                clearable
                v-model="SchemeField.createCompany"
                filterable
                remote
                :transfer="true"
                :remote-method="remoteMethod"
                :loading="select_loading"
                placeholder=""
                v-show="toRequest.accountBookId?false:true"
                >
                <Option v-for="(item, key) in select_list" :key="key" :value="item.name">{{ item.name }}</Option>
              </Select>
              <Icon class="search-icon search-style" type="md-more" size="18" v-show="toRequest.accountBookId?false:true" @click="doJudge"></Icon>
              <span class="istest">*</span>
            </FormItem>
          </Col>
          <Col span="8">
          <FormItem label="辅助核算项" v-if="toRequest.schemeType===1?true:false" prop="auxiliaryItemId" :show-message="false">
            <Select v-model="toRequest.auxiliaryItemId" @on-change="onChangeAssistAccount" label-in-value :disabled="toRequest.isDel?true:false">
              <Option v-for="item in assistAccountList" :value="item.id" :label="item.auxiliaryName" :key="item.id"></Option>
            </Select>
            <span class="istest">*</span>
          </FormItem>
          </Col>
        </Row>
      </Form>
    </section>
    <div class="bgc"></div>
    <section class="create_certificate_table">
    <section class="page-header">
      <div class="page-header-name" style="font-size:14px">详细信息</div>
      <div class="page-header-actions">
        <div class="table-span">
          <Span @click="doAddlist">增行</Span>
          <Span @click="doPushlist">插行</Span>
          <Span @click="doCopy">复制行</Span>
          <Span @click="dodelet">删行</Span>
        </div>
      </div>
    </section>
      <div class="page-content-table" ref="pageTable">
        <Table ref="currentRowTable"
        no-data-text=""
        highlight-row
        :height="tableHeight"
        :columns="columns"
        :data="tableColum"
        @on-row-click="handleSelectRow"
        @on-resize="onResizeTable"
        >
        <!-- 栏目方向 -->
        <template slot-scope="{ row, column, index }" slot="direction">
          <Select v-model="tableColum[index].direction" transfer @on-change="doChangeDirection" v-if="editCellKey === `${column.key}${index}`" :disabled="toRequest.isDel?true:false">
            <Option value= '0' label="借"></Option>
            <Option value= '1' label="贷"></Option>
          </Select>
           <span class="readonly" v-else @click="onClickTableCell(column.key, index)">{{ tableColum[index].direction === '1' ? '贷' : '借'}}</span>
        </template>
        <!-- 栏目编码 -->
        <template slot-scope="{ row, column, index }" slot="itemCode">
          <!-- 下级科目 -->
          <radio-select class="radio-select-code-style" :disabled="toRequest.isDel?true:false" :reset="code_config.refresh" :config="code_config" v-model="tableColum[index].itemCode" @getData="doGetCodeData" v-if="editCellKey === `${column.key}${index}` && toRequest.schemeType === 0" @on-close="doResetSubCode">
              <div slot="header" class="query-content">
                <Row :gutter="8">
                  <Col span="4">
                    <Select v-model="code_config.request_params.isEnable" @on-change="code_config.refresh = !code_config.refresh">
                      <Option value="all" label="全部"></Option>
                      <Option value="1" label="已生效"></Option>
                      <Option value="0" label="已失效"></Option>
                    </Select>
                  </Col>
                  <Col span="4">
                    <Select v-model="code_config.request_params.accountElementItem" @on-change="code_config.refresh = !code_config.refresh">
                      <Option value="all" label="全部会计要素"></Option>
                      <Option :value="item.id" :label="item.name" v-for="item in accountElementItemList" :key="item.id"></Option>
                    </Select>
                  </Col>
                  <Col span="4">
                    <Select v-model="code_config.request_params.subjectCategory" @on-change="code_config.refresh = !code_config.refresh">
                      <Option value="all" label="全部科目类别"></Option>
                      <Option :value="item.id" :label="item.name" v-for="item in subjectCategoryList" :key="item.id"></Option>
                    </Select>
                  </Col>
                  <Col span="4">
                    <Select v-model="code_config.request_params.accountCategory" @on-change="code_config.refresh = !code_config.refresh">
                      <Option value="all" label="全部分类"></Option>
                      <Option :value="item.value" :label="item.label" v-for="item in accountCategoryList" :key="item.value"></Option>
                    </Select>
                  </Col>
                  <Col span="4">
                    <Select v-model="code_config.request_params.auxiliaryName" @on-change="code_config.refresh = !code_config.refresh">
                      <Option value="all" label="全部辅助核算项"></Option>
                      <Option :value="item.id" :label="item.name" v-for="item in subjectAuxiliaryList" :key="item.id"></Option>
                    </Select>
                  </Col>
                  <Col span="10" class-name="search-input-margin">
                    <Row class-name="search-input-content">
                      <Col span="21">
                        <Input v-model="code_config.request_params.codeOrName"
                        :maxlength="50" placeholder="会计科目编码/名称" clearable enter-button
                        @on-search="code_config.refresh = !code_config.refresh"
                        @on-enter="code_config.refresh = !code_config.refresh"
                        @on-clear="code_config.refresh = !code_config.refresh"
                        ></Input>
                      </Col>
                      <Col span="3">
                        <Button icon="ios-search" class="search-icon-button" @click="code_config.refresh = !code_config.refresh"></Button>
                      </Col>
                    </Row>
                  </Col>
                  <Col span="2" class-name="search-input-margin">
                    <Button class="reset-button" @click="doResetSubCode">重置</Button>
                  </Col>
                </Row>
              </div>
            </radio-select>

          <!-- 辅助核算 -->
          <radio-select class="radio-select-code-style" :reset="auxiliary_config.refresh" :config="auxiliary_config" v-model="tableColum[index].itemCode" @getData="doGetAuxiliaryData" v-else-if="editCellKey === `${column.key}${index}` && toRequest.schemeType === 1" @on-close="doResetAuxiliary">
              <div slot="header" class="query-content">
                  <Row :gutter="8">
                    <Col span="4">
                      <Select v-model="auxiliary_config.request_params.isEnable" @on-change="auxiliary_config.refresh = !auxiliary_config.refresh">
                        <Option value="all" label="全部"></Option>
                        <Option value=1 label="已生效"></Option>
                        <Option value=0 label="已失效"></Option>
                      </Select>
                    </Col>
                    <Col span="8">
                      <Row class-name="search-input-content">
                        <Col span="20">
                          <Input v-model="auxiliary_config.request_params.codeOrName"
                          :maxlength="50" placeholder="辅助核算项目编码或名称" clearable enter-button
                          @on-search="auxiliary_config.refresh = !auxiliary_config.refresh"
                          @on-enter="auxiliary_config.refresh = !auxiliary_config.refresh"
                          @on-clear="auxiliary_config.refresh = !auxiliary_config.refresh"
                          ></Input>
                        </Col>
                        <Col span="3">
                          <Button icon="ios-search" class="search-icon-button" @click="auxiliary_config.refresh = !auxiliary_config.refresh"></Button>
                        </Col>
                      </Row>
                    </Col>
                    <Col span="2">
                      <Button class="reset-button" @click="doResetAuxiliary">重置</Button>
                    </Col>
                  </Row>
                </div>
            </radio-select>
          <span class="readonly" v-else @click="onClickTableCell(column.key, index)">{{ tableColum[index].itemCode }}</span>
        </template>
        <!-- 栏目名称 -->
        <template slot-scope="{ row }" slot="itemName">
          <span class="readonly">{{ row.itemName }}</span>
        </template>
        </Table>
        <nodata class="isnodata" :icon-size="60" notice-text="暂无数据" v-if="tableColum.length===0 ? true : false"></nodata>
      </div>
  </section>
  </section>
</template>

<script>
import CommonIcon from '_c/common-icon'
import nodata from '_c/nodata'
import { saasMixin } from '@/libs/mixins'
import RadioSelect from '_c/radio-select'
import { mapMutations } from 'vuex'
import { Validation } from '@/libs/util'
export default {
  name: 'update_scheme',
  mixins: [saasMixin],
  data () {
    return {
      loading: false, // 加载loading
      SchemeField: {
        createCompany: '',
        input: '',
        subject: ''
      },
      // 接口请求数据
      toRequest: {
        accountBookId: null, // 账簿Id
        accountBookName: null, // 账簿名称
        code: '',
        schemeType: 0,
        isDel: 0,
        schemeName: '', // 方案名称
        accountSubjectId: '', // 会计科目Id
        accountSubjectName: '', // 会计科目名称
        auxiliaryItemId: null, // 辅助核算Id
        auxiliaryItemName: null // 辅助核算名称
      },
      toReq: {
        schemeId: '',
        schemeItems: []
      },
      changeContext: false, // 监测页面数据是否修改
      modal_typeList: [
        {
          value: 0,
          label: '全部'
        },
        {
          value: 1,
          label: '已生效'
        },
        {
          value: 2,
          label: '已失效'
        }
      ],
      // 总账账簿弹窗-请求接口参数
      account_config: {
        type: 'accountBookSetting',
        title: '选择核算账簿',
        width: '100%',
        refresh: false,
        request_params: {
          isEnable: 1,
          subjectStandardName: '1',
          subjectCurrencyName: '1',
          codeOrName: '',
          isEnterpriseAdmin: 1,
          menuCode: 'scheme_index'
        }
      },
      // 会计科目弹窗-请求接口参数
      subject_config: {
        type: 'subjectSetting',
        title: '选择会计科目',
        width: '100%',
        refresh: false,
        request_params: {
          isFinal: 0, // 只显示末级科目
          ifFindAuxiliary: 1, // 是否查询辅助核算项
          ifFindHasAuxiliaryOnly: 0,
          isEnable: 'all', // 已启用
          accountCategory: 'all', // 分类
          accountElementItem: 'all', // 会计要素
          subjectCategory: 'all', // 科目类别
          auxiliaryName: 'all', // 辅助核算名称
          subjectIds: [],
          codeOrName: '',
          menuCode: 'scheme_index'
        }
      },
      // 项目编码-科目多栏账目
      code_config: {
        type: 'subjectSetting',
        title: '选择会计科目',
        width: '100%',
        refresh: false,
        request_params: {
          isEnable: 'all', // 已启用
          accountCategory: 'all', // 分类
          accountElementItem: 'all', // 会计要素
          subjectCategory: 'all', // 科目类别
          auxiliaryName: 'all', // 辅助核算名称
          subjectIds: [],
          codeOrName: '',
          ifFindChildOnly: 1, // 是否只查询下级科目
          code: '',
          menuCode: 'scheme_index'
        }
      },
      // 栏目编码 - 辅助核算项
      auxiliary_config: {
        type: 'auxiliarySeting',
        title: '选择辅助核算项目',
        width: '100%',
        refresh: false,
        request_params: {
          codeOrName: '',
          code: '',
          companyIds: [],
          sourceTable: '',
          isEnable: 'all',
          menuCode: 'scheme_index'
        }
      },
      // 远程搜索 - 假
      select_loading: false,
      select_list: [],
      // 查询类型
      // changeType: 0, // 查询类型
      findType: [
        {
          value: 0,
          label: '科目多栏账目'
        },
        {
          value: 1,
          label: '辅助核算项多栏账'
        }
      ],
      // 辅助核算项
      assistAccountJudge: false, // 有辅助核算项判断必填
      // assistAccount: '', // 绑定数据
      assistAccountList: [], // 下拉列表中数据
      // 详细信息-表头
      columns: [
        {
          title: '序号',
          type: 'index',
          width: 60,
          tooltip: true,
          align: 'center',
          key: 'code',
          render: (row) => {
            return (
              console.log(row)
            )
          }
        },
        {
          title: '栏目方向',
          minWidth: 60,
          tooltip: true,
          align: 'left',
          slot: 'direction',
          key: 'direction',
          renderHeader: (h, { row, index, column }) => {
            return (
              <span class="table-require-stars">栏目方向</span>
            )
          }
        },
        {
          title: '栏目编码',
          // width: 60,
          tooltip: true,
          align: 'left',
          slot: 'itemCode',
          key: 'itemCode',
          renderHeader: (h, { row, index, column }) => {
            return (
              <span class="table-require-stars">栏目编码</span>
            )
          }
        },
        {
          title: '栏目名称',
          // width: 60,
          tooltip: true,
          align: 'left',
          slot: 'itemName',
          key: 'itemName'
        }
      ],
      schemeCodeList: [],
      // editIndex: '', // 列表选中
      balanceDirection: 0,
      currentRow: '',
      // 详细信息-数据
      tableColum: [
        {
          direction: '0',
          itemCode: '',
          itemName: '',
          itemId: ''
        }
      ],
      newtablelist:
        {
          direction: '0',
          itemCode: '',
          itemName: '',
          itemId: ''
        },
      // 当前点击的单元格
      editCellKey: '',
      // 当前聚焦的输入框的行数
      editIndex: -1,
      tableHeight: -1,
      subjectId: null, // 科目表id,用于判断是否清除其他字段数据
      // 校验规则
      validateRes: true,
      ruleValidate: {
        accountBookName: [
          { required: true, validator: Validation.accountBookName }
        ],
        accountSubjectName: [
          { required: true, validator: Validation.accountSubjectName }
        ],
        auxiliaryItemId: [
          { required: true, validator: Validation.auxiliaryItemId }
        ]
      },
      fieldCodes: ['accountBookName', 'accountSubjectName'],
      fieldNames: ['总账账簿错误', '会计科目错误']
    }
  },
  components: {
    nodata,
    CommonIcon,
    RadioSelect
  },
  mounted () {
    // table自适应高度
    let _extraHt = this.$refs.pageTable.offsetTop + 36 + 32 + 148
    this.tableHeight = window.innerHeight - _extraHt
    this.doInit()
  },
  watch: {
    changeContext (val) {
      console.log(val)
      this.doIdentifying(this.$route, val)
    }
  },
  methods: {
    ...mapMutations([
      'closeTag'
    ]),
    /**
     * 表单校验函数
     * 所有项都通过后执行回调
     */
    doValidateForm () {
      let _validateRes = true
      this.$refs['toRequest'].validateField('accountBookName', valid => {
        if (valid) {
          _validateRes = false
          return this.$Message.error(`${valid}`)
        }
        this.$refs['toRequest'].validateField('accountSubjectName', valid => {
          if (valid) {
            _validateRes = false
            return this.$Message.error(`${valid}`)
          }
          if (this.toRequest.schemeType === 1) {
            console.log(this.toRequest.auxiliaryItemId)
            this.$refs['toRequest'].validateField('auxiliaryItemId', valid => {
              console.log(valid)
              if (valid) {
                _validateRes = false
                return this.$Message.error(`${valid}`)
              }
            })
          }
        })
      })
      return _validateRes
    },
    // 初始化
    doInit (judgeData) {
      let req = null
      if (judgeData) {
        req = judgeData
      } else {
        req = this.$route.query.id
      }
      this.loading = true
      this.$request.post('/ledger/multiColumnScheme/findMultiColumnSchemeById', { id: req }).then(res => {
        // console.log(res)
        this.loading = false
        let { code, data } = res.data
        if (code === 200) {
          this.doGetSubjectScreenList()
          this.toRequest = data
          this.auxiliary_config.request_params.companyIds = [data.companyId]
          if (data.schemeType === 1) {
            this.subject_config.request_params.isFinal = 1
            this.subject_config.request_params.ifFindHasAuxiliaryOnly = 1
            let _list = { id: data.accountSubjectId }
            this.doGetAssistAccount(_list)
          } else {
            this.subject_config.request_params.isFinal = 0
            this.subject_config.request_params.ifFindHasAuxiliaryOnly = null
            this.$request.post('/financeback/accountSubject/findPage', { ids: [data.accountSubjectId], page: { current: 1, size: 999 } }).then(resole => {
              // console.log(resole)
              if (resole.data.code === 200) {
                this.doGetLowerSubject(resole.data.data.records[0])
              }
            })
          }
          this.tableColum = data.itemList
          this.tableColum.forEach((n, index, arr) => {
            arr[index].direction = n.direction + ''
          })
          if (judgeData) {
            this.$router.push({ name: 'update_scheme', query: { id: judgeData } })
          }
          this.changeContext = false
        }
      })
    },
    // 总账账簿 - 单选组件 - 重置
    doResetAccount () {
      this.account_config.request_params.codeOrName = ''
      this.account_config.refresh = !this.account_config.refresh
    },
    // 会计科目 - 单选组件 - 重置
    doResetSubject () {
      this.subject_config.request_params.isEnable = 'all' // 已启用
      this.subject_config.request_params.accountCategory = 'all' // 分类
      this.subject_config.request_params.accountElementItem = 'all' // 会计要素
      this.subject_config.request_params.subjectCategory = 'all' // 科目类别
      this.subject_config.request_params.auxiliaryName = 'all' // 辅助核算名称
      this.subject_config.request_params.codeOrName = ''
      this.subject_config.refresh = !this.subject_config.refresh
    },
    // 下级科目 - 重置 - 单选组件
    doResetSubCode () {
      this.code_config.request_params.isEnable = 'all' // 已启用
      this.code_config.request_params.accountCategory = 'all' // 分类
      this.code_config.request_params.accountElementItem = 'all' // 会计要素
      this.code_config.request_params.subjectCategory = 'all' // 科目类别
      this.code_config.request_params.auxiliaryName = 'all' // 辅助核算名称
      this.code_config.request_params.codeOrName = ''
      this.code_config.refresh = !this.code_config.refresh
    },
    // 辅助核算 - 重置 - 单选组件
    doResetAuxiliary () {
      this.auxiliary_config.request_params.isEnable = 'all'
      this.auxiliary_config.request_params.codeOrName = ''
      this.auxiliary_config.refresh = !this.auxiliary_config.refresh
    },
    // 做判断用于处理总账账簿是否选择
    doJudge (item) {
      if (item === 'name') {
        this.changeContext = true
      }
      if (!this.toRequest.accountBookId) {
        this.$Message.warning('先选择总账账簿')
      }
    },
    // 查询类型 - 切换
    doChangeType (val) {
      console.log(val)
      this.changeContext = true
      this.toRequest.accountSubjectId = null
      this.toRequest.accountSubjectName = null
      this.toRequest.schemeType = val
      this.tableColum = []
      // this.assistAccount = ''
      this.toRequest.auxiliaryItemName = null
      this.toRequest.auxiliaryItemId = null
      this.assistAccountList = []
      if (val === 0) {
        this.assistAccountJudge = false
        this.subject_config.request_params.isFinal = 0
        this.subject_config.request_params.ifFindHasAuxiliaryOnly = null
      } else {
        this.assistAccountJudge = true
        this.subject_config.request_params.isFinal = 1
        this.subject_config.request_params.ifFindHasAuxiliaryOnly = 1
      }
    },
    // 保存
    doSave (name, getData) {
      if (this.doValidateForm()) {
        let req = {}
        // 1.检查必填项（子表表格无数据时不校验项目编码和项目名称）
        let doJudgeAuxiliary = true
        let doJudgeTableColum = true // 用于判断子表有数据时-必填项是否为空
        let doJudgeTableRepeat = true // 用于判断子表数据是否有重复
        if (this.assistAccountJudge) { // 检查辅助核算项是否为空
          console.log(this.toRequest.auxiliaryItemId)
          if (this.toRequest.auxiliaryItemId) {
            doJudgeAuxiliary = true
          } else {
            doJudgeAuxiliary = false
            this.$Message.error('必填项不能为空！')
            return false
          }
        }
        if (this.tableColum.length === 0) {
          doJudgeTableColum = true
          req = { ...this.toRequest, itemList: this.schemeCodeList }
        } else {
          console.log(this.tableColum)
          this.tableColum.forEach((n, index, arr) => {
            Object.entries(n).forEach(m => {
              if (m[1] === '') {
                doJudgeTableColum = false
              } else {
                doJudgeTableColum = true
                // console.log(req, 'req')
              }
            })
          })
          if (!doJudgeTableColum) {
            this.$Message.error('必填项不能为空！')
            return false
          }
          let objReq = []
          this.tableColum.forEach((n, index, arr) => {
            objReq.push({
              direction: n.direction * 1,
              id: n.id,
              itemCode: n.itemCode,
              itemId: n.itemId,
              itemName: n.itemName,
              schemeId: n.schemeId
            })
            arr.map((x, _index) => {
              if (arr.length >= 2 && n.itemId === x.itemId && index !== _index) {
                console.log('有重复')
                doJudgeTableRepeat = false
              }
            })
          })
          req = { ...this.toRequest, itemList: objReq }
        }
        console.log(this.tableColum)
        if (this.toRequest.accountBookId && this.toRequest.accountSubjectName && doJudgeTableColum && doJudgeAuxiliary) {
          if (doJudgeTableRepeat) {
            if (this.toRequest.schemeName === '') {
              this.toRequest.schemeName = this.toRequest.schemeType === 0 ? this.toRequest.accountSubjectName + '科目多栏明细账' : this.toRequest.accountSubjectName + '核算项目多栏明细账'
              req.schemeName = this.toRequest.schemeType === 0 ? this.toRequest.accountSubjectName + '科目多栏明细账' : this.toRequest.accountSubjectName + '核算项目多栏明细账'
            }
            let _toReq = {}
            _toReq.id = req.id
            _toReq.schemeName = req.schemeName
            _toReq.accountSubjectId = req.accountSubjectId
            _toReq.accountSubjectName = req.accountSubjectName
            _toReq.auxiliaryItemId = req.auxiliaryItemId === -1 ? null : req.auxiliaryItemId
            _toReq.auxiliaryItemName = req.auxiliaryItemName === '' ? null : req.auxiliaryItemName
            _toReq.schemeType = req.schemeType
            _toReq.itemList = req.itemList
            this.$request.post('/ledger/multiColumnScheme/updateMultiColumnScheme', _toReq).then(res => {
              console.log(res)
              let { code, data } = res.data
              if (code === 200) {
                // this.$request.post('/ledger/multiColumnSchemeItem/addMultiColumnSchemeItemBatch', this.toReq).then(resolve => {
                //   console.log(resolve)
                //   let { code1 } = resolve.data
                //   if (code1 === 200) {
                this.$Message.success('保存成功！')
                switch (getData) {
                  case 'closeTab': // tab页签关闭
                    this.doContinueActions()
                    break
                  case 'create': // 保存成功 - 新增
                    this.$router.push({ name: 'create_scheme' })
                    break
                  case 'copy': // 保存成功 - 复制
                    let req = {} // 定义发送给新增界面的字段
                    let toGiveData = {
                      accountBookId: this.toRequest.accountBookId, // 账簿Id
                      accountBookName: this.toRequest.accountBookName, // 账簿名称
                      schemeType: this.toRequest.schemeType,
                      schemeName: '', // 方案名称
                      accountSubjectId: this.toRequest.accountSubjectId, // 会计科目Id
                      accountSubjectName: this.toRequest.accountSubjectName, // 会计科目名称
                      auxiliaryItemId: this.toRequest.auxiliaryItemId, // 辅助核算Id
                      auxiliaryItemName: this.toRequest.auxiliaryItemName // 辅助核算名称
                    }
                    let toGiveAuxiliary = {
                      sourceTable: this.auxiliary_config.request_params.sourceTable,
                      code: this.auxiliary_config.request_params.code,
                      companyId: this.toRequest.companyId
                    }
                    let toGiveList = this.tableColum
                    req.toGiveData = toGiveData
                    req.toGiveList = toGiveList
                    req.toGiveAuxiliary = toGiveAuxiliary
                    this.$router.push({ name: 'create_scheme', query: { data: req } })
                    break
                  case 'delete': // 保存成功 - 删除
                    this.doDeleteBtn()
                    break
                  case 'findFirst': // 保存成功 - 首条
                    let firstNum = this.doFindPage(1, this.$route.query.id)
                    if (firstNum === '当前为首条') {
                      return false
                    } else {
                      console.log('到首条', firstNum)
                      this.doInit(firstNum)
                    }
                    break
                  case 'findPrevious': // 保存成功 - 上一条
                    let previousNum = this.doFindPage(2, this.$route.query.id)
                    console.log(previousNum)
                    if (previousNum === '当前为首条') {
                      return false
                    } else {
                      this.doInit(previousNum)
                    }
                    break
                  case 'findNext': // 保存成功 -下一条
                    let nextNum = this.doFindPage(3, this.$route.query.id)
                    if (nextNum === '当前为末条') {
                      return false
                    } else if (nextNum === '跳转') {
                      setTimeout(() => {
                        this.$Message.info('查看页面暂无数据，3秒后跳转到列表页')
                      }, 1000)
                      setTimeout(() => {
                        // 关闭查看页面，跳转到新增页面 closeTag 方法在user.js中
                        this.closeTag({ route: this.$route })
                      }, 3000)
                    } else {
                      this.doInit(nextNum)
                    }
                    break
                  case 'findEnd': // 保存成功 -尾条
                    let endNum = this.doFindPage(4, this.$route.query.id)
                    if (endNum === '当前为末条') {
                      return false
                    } else {
                      this.doInit(endNum)
                    }
                    break
                  default:
                    this.doInit()
                    break
                }
                this.changeContext = false
                // }
                // })
                console.log(data)
              }
            })
          } else {
            this.$Message.error('栏目不允许重复！')
          }
        } else {
          this.$Message.error('必填项不能为空')
        }
      }
    },
    // 新增 - 复制 - 上下条
    doShowEditModal (data) {
      if (this.changeContext) {
        let that = this
        this.$Control({
          type: 'control',
          title: '消息提示',
          transfer: true,
          message: '当前数据已修改，需要保存吗？',
          button: ['是', '否', '取消'],
          yes () {
            switch (data) {
              case 'cancelBtn': // 取消逻辑
                that.doSave('toRequest', 'cancel')
                break
              case 'create': // 新增逻辑
                that.doSave('toRequest', 'create')
                break
              case 'copy': // 复制逻辑
                that.doSave('toRequest', 'copy')
                break
              case 'delete': // 删除逻辑
                that.doSave('toRequest', 'delete')
                break
              case 'findFirst': // 首条
                that.doSave('toRequest', 'findFirst')
                break
              case 'findPrevious': // 上一条
                that.doSave('toRequest', 'findPrevious')
                break
              case 'findNext': // 下一条
                that.doSave('toRequest', 'findNext')
                break
              case 'findEnd': // 尾条
                that.doSave('toRequest', 'findEnd')
                break
              default: // 改变Tab逻辑
                that.doSave('toRequest', 'closeTab')
                break
            }
            that.$CloseCtl()
          },
          no () {
            that.changeContext = false
            switch (data) {
              case 'cancelBtn': // 取消按钮
                that.doInit()
                break
              case 'create': // 新增
                that.$router.push({ name: 'create_scheme' })
                break
              case 'copy': // 复制
                let req = {} // 定义发送给新增界面的字段
                let toGiveData = {
                  accountBookId: that.toRequest.accountBookId, // 账簿Id
                  accountBookName: that.toRequest.accountBookName, // 账簿名称
                  schemeType: that.toRequest.schemeType,
                  schemeName: '', // 方案名称
                  accountSubjectId: that.toRequest.accountSubjectId, // 会计科目Id
                  accountSubjectName: that.toRequest.accountSubjectName, // 会计科目名称
                  auxiliaryItemId: that.toRequest.auxiliaryItemId, // 辅助核算Id
                  auxiliaryItemName: that.toRequest.auxiliaryItemName // 辅助核算名称
                }
                let toGiveAuxiliary = {
                  sourceTable: this.auxiliary_config.request_params.sourceTable,
                  code: this.auxiliary_config.request_params.code,
                  companyId: this.toRequest.companyId
                }
                let toGiveList = that.tableColum
                req.toGiveData = toGiveData
                req.toGiveList = toGiveList
                req.toGiveAuxiliary = toGiveAuxiliary
                that.$router.push({ name: 'create_scheme', query: { data: req } })
                break
              case 'delete': // 删除
                that.doInit()
                setTimeout(() => {
                  that.doDeleteBtn()
                }, 500)
                break
              case 'findFirst': // 首条
                let firstNum = that.doFindPage(1, that.$route.query.id)
                if (firstNum === '当前为首条') {
                  return false
                } else {
                  that.doInit(firstNum)
                }
                break
              case 'findPrevious': // 上一条
                let previousNum = that.doFindPage(2, that.$route.query.id)
                console.log(previousNum)
                if (previousNum === '当前为首条') {
                  return false
                } else {
                  that.doInit(previousNum)
                }
                break
              case 'findNext': // 下一条
                let nextNum = that.doFindPage(3, that.$route.query.id)
                if (nextNum === '当前为末条') {
                  return false
                } else if (nextNum === '跳转') {
                  setTimeout(() => {
                    that.$Message.info('查看页面暂无数据，3秒后跳转到列表页')
                  }, 1000)
                  setTimeout(() => {
                    // 关闭查看页面，跳转到新增页面 closeTag 方法在user.js中
                    that.closeTag({ route: that.$route })
                  }, 3000)
                } else {
                  that.doInit(nextNum)
                }
                break
              case 'findEnd': // 尾条
                let endNum = that.doFindPage(4, that.$route.query.id)
                if (endNum === '当前为末条') {
                  return false
                } else {
                  that.doInit(endNum)
                }
                break
              default:
                that.doContinueActions()
                break
            }
            that.$CloseCtl()
          },
          cancel () {
            that.$CloseCtl()
          }
        })
      } else {
        switch (data) {
          case 'create': // 新增逻辑
            this.$router.push({ name: 'create_scheme' })
            break
          case 'copy': // 复制逻辑
            let req = {} // 定义发送给新增界面的字段
            let toGiveData = {
              accountBookId: this.toRequest.accountBookId, // 账簿Id
              accountBookName: this.toRequest.accountBookName, // 账簿名称
              schemeType: this.toRequest.schemeType,
              schemeName: '', // 方案名称
              accountSubjectId: this.toRequest.accountSubjectId, // 会计科目Id
              accountSubjectName: this.toRequest.accountSubjectName, // 会计科目名称
              auxiliaryItemId: this.toRequest.auxiliaryItemId, // 辅助核算Id
              auxiliaryItemName: this.toRequest.auxiliaryItemName // 辅助核算名称
            }
            let toGiveAuxiliary = {
              sourceTable: this.auxiliary_config.request_params.sourceTable,
              code: this.auxiliary_config.request_params.code,
              companyId: this.toRequest.companyId
            }
            let toGiveList = this.tableColum
            req.toGiveData = toGiveData
            req.toGiveList = toGiveList
            req.toGiveAuxiliary = toGiveAuxiliary
            this.$Message.success('复制成功')
            console.log(req)
            this.$router.push({ name: 'create_scheme', query: { data: req } })
            break
          case 'delete': // 删除
            this.doDeleteBtn()
            break
          case 'findFirst': // 首条
            let firstNum = this.doFindPage(1, this.$route.query.id)
            if (firstNum === '当前为首条') {
              return false
            } else {
              this.doInit(firstNum)
            }
            break
          case 'findPrevious': // 上一条
            let previousNum = this.doFindPage(2, this.$route.query.id)
            console.log(previousNum)
            if (previousNum === '当前为首条') {
              return false
            } else {
              this.doInit(previousNum)
            }
            break
          case 'findNext': // 下一条
            let nextNum = this.doFindPage(3, this.$route.query.id)
            if (nextNum === '当前为末条') {
              return false
            } else if (nextNum === '跳转') {
              setTimeout(() => {
                this.$Message.info('查看页面暂无数据，3秒后跳转到列表页')
              }, 1000)
              setTimeout(() => {
                // 关闭查看页面，跳转到新增页面 closeTag 方法在user.js中
                this.closeTag({ route: this.$route })
              }, 3000)
            } else {
              this.doInit(nextNum)
            }
            break
          case 'findEnd': // 尾条
            let endNum = this.doFindPage(4, this.$route.query.id)
            if (endNum === '当前为末条') {
              return false
            } else {
              this.doInit(endNum)
            }
            break
          default:
            break
        }
      }
    },
    // 取消 - 按钮
    doCancel () {
      if (this.changeContext) {
        let that = this
        this.$Control({
          type: 'confirm',
          title: '消息提示',
          transfer: true,
          message: '注意：取消操作会重置当前表单，是否继续？',
          button: ['确认', '取消'],
          yes () {
            that.changeContext = false
            that.doInit()
            that.$CloseCtl()
          },
          cancel () {
            that.$CloseCtl()
          }
        })
      }
    },
    // 删除 - 按钮
    doDeleteBtn () {
      console.log('删除')
      let req = this.$route.query.id
      let that = this
      this.$Control({
        type: 'confirm',
        title: '消息提示',
        transfer: true,
        message: '注意：确认删除该数据？',
        button: ['确认', '取消'],
        yes () {
          that.$request.post('/ledger/multiColumnScheme/batchDeleteMultiColumnScheme', { idList: [req] }).then(res => {
            let { code, data, message } = res.data
            if (code === 200) {
              console.log(data)
              if (data.successList.length) {
                that.changeContext = false
                that.$Message.success('删除成功')
                let nextNum = that.doFindPage(3, that.$route.query.id, 'delete')
                console.log(nextNum)
                if (nextNum === '当前为末条') {
                  return false
                } else if (nextNum === '跳转') {
                  setTimeout(() => {
                    that.$Message.info('查看页面暂无数据，3秒后跳转到列表页')
                  }, 1000)
                  setTimeout(() => {
                    // 关闭查看页面，跳转到新增页面 closeTag 方法在user.js中
                    that.closeTag({ route: that.$route })
                  }, 3000)
                } else {
                  that.doInit(nextNum)
                }
              } else {
                that.$Message.error('删除失败，' + data.failList[0].referenceDescription)
                // that.doInit()
              }
            } else {
              that.$Message.error(message)
            }
          })
          that.$CloseCtl()
        },
        cancel () {
          that.$CloseCtl()
        }
      })
    },
    // 列表
    goSchemeList () {
      this.doLocationDetail('scheme_index')
    },
    // 总账账簿
    doGetAccountData (list, data) {
      this.changeContext = true
      console.log(list, data)
      if (data) {
        if (!this.subjectId) {
          if (data.subjectId === this.subjectId) {
            this.subject_config.request_params.subjectIds = [data.subjectId]
            this.doGetSubjectScreenList(data.subjectId)
            this.toRequest.accountBookId = list.id
            this.toRequest.accountBookName = list.name
          } else { // 科目表id不同时 清空字段
            this.subject_config.request_params.subjectIds = [data.subjectId]
            this.doGetSubjectScreenList(data.subjectId)
            this.toRequest.accountBookId = list.id
            this.toRequest.accountBookName = list.name
            this.subjectId = data.subjectId
            this.toRequest.accountSubjectId = null
            this.toRequest.accountSubjectName = null
            this.assistAccountList = []
            this.tableColum = []
          }
        } else {
          this.subject_config.request_params.subjectIds = [data.subjectId]
          this.doGetSubjectScreenList(data.subjectId)
          this.toRequest.accountBookId = list.id
          this.toRequest.accountBookName = list.name
        }
      } else {
        this.toRequest.accountBookId = null
        // this.toRequest.accountBookName = ''
        this.$Message.error('至少保留一个总账账簿，不可为空')
      }
    },
    // 获取会计科目数据
    doGetSubjectData (list, data) {
      this.doResetSubject()
      this.changeContext = true
      this.tableColum = []
      this.assistAccount = ''
      this.toRequest.auxiliaryItemName = null
      this.toRequest.auxiliaryItemId = null
      this.assistAccountList = []
      console.log(list, data)
      if (data) {
        if (this.toRequest.accountBookId) {
          this.toRequest.accountSubjectId = list.id
          this.toRequest.accountSubjectName = list.name
          console.log(this.toRequest.schemeType)
          if (this.toRequest.schemeType === 0) {
            this.doGetLowerSubject(data)
          } else {
            this.doGetAssistAccount(list)
          }
        } else {
          this.$Message.warning('先选择总账账簿')
        }
      } else {
        this.toRequest.accountSubjectId = list.id
        this.toRequest.accountSubjectName = list.name
      }
    },
    // 辅助核算项 - select选择
    onChangeAssistAccount (list) {
      console.log(list)
      console.log(this.toRequest.auxiliaryItemId, '辅助核算id')
      if (!list) return false
      this.changeContext = true
      this.tableColum = []
      if (list) {
        this.toRequest.auxiliaryItemId = list.value
        this.toRequest.auxiliaryItemName = list.label
        this.doFindAssistAcountList()
      } else {
        console.log('没有数据-list')
      }
    },
    // 获取下级科目 - 子表为空
    doGetLowerSubject (data) {
      // console.log(data)
      this.balanceDirection = data.balanceDirection
      this.code_config.request_params.subjectIds = [data.subjectId]
      this.code_config.request_params.code = data.code
      this.$request.post('/financeback/accountSubject/findPage', { subjectIds: [data.subjectId], ifFindChildOnly: 1, code: data.code, page: { current: 1, size: 9999 } }).then(res => {
        let { code, data } = res.data
        if (code === 200) {
          // console.log(data)
          let _list = []
          data.records.map(n => {
            _list.push({
              direction: n.balanceDirection,
              itemCode: n.code,
              itemId: n.id,
              itemName: n.name
            })
          })
          this.schemeCodeList = _list
        }
      })
    },
    // 获取辅助核算项
    doGetAssistAccount (list) {
      console.log(this.toRequest.auxiliaryItemId)
      let _getId = this.toRequest.auxiliaryItemId
      let req = {
        accountSubjectId: list.id,
        page: {
          current: 1,
          size: 999
        }
      }
      this.$request.post('/financeback/accountSubject/findAuxiliaryPage', req).then(res => {
        console.log(res)
        let { code, data } = res.data
        if (code === 200) {
          this.assistAccountList = data.records
          console.log(_getId, 'aaaaaaaaaaaaaa')
          console.log(this.toRequest.auxiliaryItemId)
          if (!_getId) return false
          let req = this.assistAccountList.filter(item => item.id === _getId)[0]
          console.log(req)
          let that = this
          this.$nextTick(() => {
            that.toRequest.auxiliaryItemId = req.id
            that.toRequest.auxiliaryItemName = req.auxiliaryName
          })
          this.auxiliary_config.request_params.code = req.auxiliaryCode
          this.auxiliary_config.request_params.sourceTable = req.auxiliarySourceTable
        }
      })
    },
    // 辅助核算项 - 子表为空
    doFindAssistAcountList () {
      let req = this.assistAccountList.filter(item => item.id === this.toRequest.auxiliaryItemId)[0]
      console.log(req)
      this.auxiliary_config.request_params.code = req.auxiliaryCode
      this.auxiliary_config.request_params.sourceTable = req.auxiliarySourceTable
      this.$request.post('/financeback/accountSubject/findSourceTableList', { sourceTable: req.auxiliarySourceTable, code: req.auxiliaryCode, isEnable: 1, companyIds: this.auxiliary_config.request_params.companyIds }).then(res => {
        let { code, data } = res.data
        if (code === 200) {
          console.log(data)
          let list = []
          data.records.forEach(n => {
            list.push({
              direction: this.balanceDirection,
              itemCode: n.code,
              itemId: n.id,
              itemName: n.name
            })
          })
          this.schemeCodeList = list
        }
      })
    },
    // 子表-下级科目
    doGetCodeData (list, item) {
      this.doResetSubCode()
      console.log(list, item)
      this.changeContext = true
      if (item) {
        let numArr = this.editCellKey.match(/\d+/g)[0] * 1 // 提取字符串中的数字
        this.$set(this.tableColum[numArr], 'itemName', list.name)
        this.$set(this.tableColum[numArr], 'itemCode', item.code)
        this.$set(this.tableColum[numArr], 'itemId', item.id)
      }
    },
    // 子表-辅助核算
    doGetAuxiliaryData (list, item) {
      this.doResetAuxiliary()
      console.log(list, item)
      this.changeContext = true
      if (item) {
        let numArr = this.editCellKey.match(/\d+/g)[0] * 1 // 提取字符串中的数字
        this.$set(this.tableColum[numArr], 'itemName', list.name)
        this.$set(this.tableColum[numArr], 'itemCode', item.code)
        this.$set(this.tableColum[numArr], 'itemId', item.id)
      }
    },
    // 子表 - 栏目方向
    doChangeDirection (val) {
      console.log(val, 111)
      this.changeContext = true
      let numArr = this.editCellKey.match(/\d+/g)[0] * 1 // 提取字符串中的数字
      this.tableColum[numArr].direction = val
    },
    // 增加行
    doAddlist () {
      if (this.toRequest.isDel) return
      if (this.toRequest.accountBookId) {
        this.changeContext = true
        if (this.tableColum.length > 999) {
          this.$Message.warning('超过最大行数，增行失败')
        } else {
          this.tableColum.push({
            direction: this.balanceDirection + '',
            itemCode: '',
            itemName: ''
          })
        }
        // this.tableColum.push(this.newtablelist)
      } else {
        this.$Message.warning('先选择总账账簿')
      }
    },
    // 插入行
    doPushlist () {
      if (this.toRequest.isDel) return
      // console.log(this.editIndex)
      if (this.toRequest.accountBookId) {
        this.changeContext = true
        if (this.editIndex > -1) {
          if (this.tableColum.length > 999) {
            this.$Message.warning('超过最大行数，插行失败')
          } else {
            let _objRow = {
              // direction: '借',
              direction: this.balanceDirection + '',
              itemCode: '',
              itemName: ''
            }
            this.tableColum.splice(this.editIndex + 1, 0, _objRow)
          }
        } else {
          this.$Message.warning('请先选中一行')
        }
      } else {
        this.$Message.warning('先选择总账账簿')
      }
    },
    // 复制行
    doCopy () {
      if (this.toRequest.isDel) return
      if (this.toRequest.accountBookId) {
        this.changeContext = true
        if (this.editIndex !== '') {
          this.tableColum.splice(this.editIndex + 1, 0, this.currentRow)
        }
      } else {
        this.$Message.warning('先选择总账账簿')
      }
    },
    // 删除行
    dodelet () {
      if (this.toRequest.isDel) return
      if (this.toRequest.accountBookId) {
        this.changeContext = true
        if (this.editIndex !== '') {
          this.tableColum.splice(this.editIndex, 1)
        }
      } else {
        this.$Message.warning('先选择总账账簿')
      }
    },
    // 选中一行，行数据，下标
    handleSelectRow (row, index) {
      // console.log(row, index)
      // console.log(index, '1')
      this.currentRow = row
      this.editIndex = index
    },
    // 点击表格单元格
    onClickTableCell (key, index) {
      this.editCellKey = `${key}${index}`
      console.log(this.editCellKey)
    },
    // 表格改变列宽
    onResizeTable (currentKey) {
      // this.doGetTableFooterLeft()
    },
    remoteMethod () {}
  }
}
</script>

<style lang="less" scoped>
 .append-scheme-container {
   .formAdd {
     .search-input-margin {
      margin-top: 8px;
    }
   }
   .search-style {
    position: absolute;
    top: 8px;
    right:87px;
  }
  .ivu-form-item{
    margin-bottom: 8px;

  }
  .ivu-col-span-8 {
    display: block;
    width: 33.33333333%;
    padding-right: 75px;
  }
  .bgc {
    height: 8px;
    width: 100%;
    background-color:#F0F0F0;
  }
  .create_certificate_table{
    .page-header {
      height: 34px;
    }
    .page-header-actions span {
      margin-right: 20px;
    }
  }
  // 必填项
  .istest{
    position: absolute;
    top: 0;
    right: 40px;
    display: inline-block;
    width: 30px;
    margin-left: 9px;
    line-height: 35px;
    font-family: SimSun;
    font-size: 12px;
    color: #ed4014;
  }
 }
</style>

<style lang="less">
@import "../../../assets/css/base.less";
@import '../../../assets/css/redefine.less';
 .append-scheme-container {
   textarea {
    resize: none!important;
  }
  .page-footer-rt {
    flex: 7!important;
  }
  .subject-scheme {
    .ivu-table {
      height: 37px;
    }
  }
  .ivu-table {
    // height:37px;
    overflow: visible;
  }
  .ivu-form-item {
    .ivu-form-item-label {
      padding: 10px 29px 10px 0;
    }
    .ivu-form-item-content {
      padding-right: 83px;
    }
  }
  .ivu-icon-ios-arrow-down:before {
    color:#999;
  }
  .create_certificate_table{
    .ivu-table-column-left:nth-child(4n + 1) {
      background: #F0F0F0
    }
    .page-content-table {
      margin-top: 20px;
      padding:0px 20px 0px 20px;
    }
    .ivu-table:before {
      content: '';
      width: 100%;
      height: 0px;
      position: absolute;
      left: 0;
      bottom: 0;
      background-color: #e5e5e5;
      z-index: 1;
    }
  }
  .color_change {
    color: rgba(33,33,33,0.85)
  }
  .page-content-table {
    // .ivu-table-cell {
    //   padding: 0
    // }
    position: relative;
    .isnodata {
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      margin: auto;
      position: absolute;
    }
    .search-input-margin {
      margin-top: 8px;
    }
    tr:last-of-type {
      position: relative;
    }
  }
  th .ivu-table-cell {
    padding: 0 8px;
  }
  td .ivu-table-cell {
    padding: 0 0px 0 8px;
  }
  .readonly {
    display: block;
    width: 100%;
    height: 32px;
    line-height: 32px;
    // padding: 0 8px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    .iconfont {
      vertical-align: middle;
    }
  }
  .radio-select-code-style {
    .ivu-table td {
      background-color: #FFF!important;
    }
    .ivu-table {
      height: 36px;
    }
  }
  .ivu-btn-icon-only {
    padding: 3px 10px;
    margin-left: 0px;
  }
  // .contralColor {
  //   input {
  //     border-color: rgb(229,229,229)!important;
  //   }
  //   .ivu-input-icon {
  //     color:#808695!important;
  //   }
  // }
 }
</style>
