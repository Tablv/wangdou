<template>
    <section class="argument-container">
      <Spin fix v-if="loading2" style="left: 8px;z-index: 10">
        <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
        <div>正在载入数据</div>
      </Spin>
    <section class="page-header">
      <div class="page-header-name">参数选项</div>
      <div class="page-header-actions">
        <Button type="primary" @click="doSave">保存</Button>
        <Button @click="doCancel">取消</Button>
        <!-- <Button @click="doText">测试</Button> -->
      </div>
    </section>
    <section class="page-content">
       <Form :model="formItem" :label-width="154" class="form-item">
         <Row>
           <div class="title-bar">
             <div class="vertical-bar box-background"></div>
             <div class="title-content">损益结转配置</div>
          </div>
         </Row>
        <Row>
          <Col span="7" >
            <FormItem label="本年利润科目" prop="company">
              <radio-select class="radio-select-style" ref="lrAcc" :reset="subject_config_one.refresh" :config="subject_config_one" v-model="subject.lrAccSubjectName" @getData="doGetlrAccSubjectData" @on-close="doReset">
              <div slot="header" class="query-content">
                <Row :gutter="8">
                  <Col span="4">
                    <Select v-model="subject_config_one.request_params.isEnable" disabled>
                      <Option value="1" label="已生效"></Option>
                    </Select>
                  </Col>
                  <Col span="4">
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
                  </Col>
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
          <Col span="7" >
            <FormItem label="利润分配科目" prop="company">
              <radio-select class="radio-select-style" ref="fpAcc" :reset="subject_config_two.refresh" :config="subject_config_two" v-model="subject.fpAccSubjectName" @getData="doGetfpAccSubjectData" @on-close="doReset2">
              <div slot="header" class="query-content">
                <Row :gutter="8">
                  <Col span="4">
                    <Select v-model="subject_config_two.request_params.isEnable" disabled>
                      <Option value="1" label="已生效"></Option>
                    </Select>
                  </Col>
                  <Col span="4">
                    <Select v-model="subject_config_two.request_params.accountElementItem" @on-change="subject_config_two.refresh = !subject_config_two.refresh" disabled>
                      <Option value="all" label="全部会计要素"></Option>
                      <Option :value="item.id" :label="item.name" v-for="item in accountElementItemList" :key="item.id"></Option>
                    </Select>
                  </Col>
                  <Col span="4">
                    <Select v-model="subject_config_two.request_params.subjectCategory" @on-change="subject_config_two.refresh = !subject_config_two.refresh" disabled>
                      <Option value="all" label="全部科目类别"></Option>
                      <Option :value="item.id" :label="item.name" v-for="item in subjectCategoryList" :key="item.id"></Option>
                    </Select>
                  </Col>
                  <Col span="4">
                    <Select v-model="subject_config_two.request_params.accountCategory" @on-change="subject_config_two.refresh = !subject_config_two.refresh">
                      <Option value="all" label="全部分类"></Option>
                      <Option :value="item.value" :label="item.label" v-for="item in accountCategoryList" :key="item.value"></Option>
                    </Select>
                  </Col>
                  <Col span="4">
                    <Select v-model="subject_config_two.request_params.auxiliaryName" @on-change="subject_config_two.refresh = !subject_config_two.refresh">
                      <Option value="all" label="全部辅助核算项"></Option>
                      <Option :value="item.id" :label="item.name" v-for="item in subjectAuxiliaryList" :key="item.id"></Option>
                    </Select>
                  </Col>
                  <Col span="10" class-name="search-input-margin">
                    <Row class-name="search-input-content">
                      <Col span="21">
                        <Input v-model="subject_config_two.request_params.codeOrName" :maxlength="50" placeholder="会计科目编码/名称" clearable enter-button @on-clear="subject_config_two.refresh = !subject_config_two.refresh" @on-search="subject_config_two.refresh = !subject_config_two.refresh"></Input>
                      </Col>
                      <Col span="3">
                        <Button icon="ios-search" class="search-icon-button" @click="subject_config_two.refresh = !subject_config_two.refresh"></Button>
                      </Col>
                    </Row>
                  </Col>
                  <Col span="2" class-name="search-input-margin">
                    <Button class="reset-button" @click="doReset2">重置</Button>
                  </Col>
                </Row>
              </div>
            </radio-select>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="7" >
            <FormItem label="以前年度损益调整科目" prop="company">
              <radio-select class="radio-select-style" ref="syAcc" :reset="subject_config_three.refresh" :config="subject_config_three" v-model="subject.syAccSubjectName" @getData="dosyAccSubjectData" @on-close="doReset3">
              <div slot="header" class="query-content">
                <Row :gutter="8">
                  <Col span="4">
                    <Select v-model="subject_config_three.request_params.isEnable" disabled>
                      <Option value="1" label="已生效"></Option>
                    </Select>
                  </Col>
                  <Col span="4">
                    <Select v-model="subject_config_three.request_params.accountElementItem" @on-change="subject_config_three.refresh = !subject_config_three.refresh" disabled>
                      <Option value="all" label="全部会计要素"></Option>
                      <Option :value="item.id" :label="item.name" v-for="item in accountElementItemList" :key="item.id"></Option>
                    </Select>
                  </Col>
                  <Col span="4">
                    <Select v-model="subject_config_three.request_params.subjectCategory" @on-change="subject_config_three.refresh = !subject_config_three.refresh" disabled>
                      <Option value="all" label="全部科目类别"></Option>
                      <Option :value="item.id" :label="item.name" v-for="item in subjectCategoryList" :key="item.id"></Option>
                    </Select>
                  </Col>
                  <Col span="4">
                    <Select v-model="subject_config_three.request_params.accountCategory" @on-change="subject_config_three.refresh = !subject_config_three.refresh">
                      <Option value="all" label="全部分类"></Option>
                      <Option :value="item.value" :label="item.label" v-for="item in accountCategoryList" :key="item.value"></Option>
                    </Select>
                  </Col>
                  <Col span="4">
                    <Select v-model="subject_config_three.request_params.auxiliaryName" @on-change="subject_config_three.refresh = !subject_config_three.refresh">
                      <Option value="all" label="全部辅助核算项"></Option>
                      <Option :value="item.id" :label="item.name" v-for="item in subjectAuxiliaryList" :key="item.id"></Option>
                    </Select>
                  </Col>
                  <Col span="10" class-name="search-input-margin">
                    <Row class-name="search-input-content">
                      <Col span="21">
                        <Input v-model="subject_config_three.request_params.codeOrName" :maxlength="50" placeholder="会计科目编码/名称" clearable enter-button @on-clear="subject_config_three.refresh = !subject_config_three.refresh" @on-search="subject_config_three.refresh = !subject_config_three.refresh"></Input>
                      </Col>
                      <Col span="3">
                        <Button icon="ios-search" class="search-icon-button" @click="subject_config_three.refresh = !subject_config_three.refresh"></Button>
                      </Col>
                    </Row>
                  </Col>
                  <Col span="2" class-name="search-input-margin">
                    <Button class="reset-button" @click="doReset3">重置</Button>
                  </Col>
                </Row>
              </div>
            </radio-select>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="18" >
            <FormItem label="凭证分单方式">
              <RadioGroup v-model="formItem.credentialType">
                <Col span="12" >
                  <Radio label='0'>损益科目合并结转</Radio>
                </Col>
                <Col span="12" >
                  <Radio label='1'>按损/益科目分开结转</Radio>
                </Col>
              </RadioGroup>
            </FormItem>
          </Col>
        </Row>
        <Row>
           <div class="title-bar">
             <div class="vertical-bar box-background"></div>
             <div class="title-content">凭证字选择</div>
          </div>
        </Row>
        <Row>
          <Col span="7" >
            <FormItem label="凭证字类型">
              <Select v-model="formItem.credentialWordType" style="width:120px">
                <Option v-for="item in credentialWordTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row>
           <div class="title-bar">
             <div class="vertical-bar box-background"></div>
             <div class="title-content">凭证参数</div>
          </div>
        </Row>
        <Row>
          <Col span="7" >
            <FormItem label="未来期间数">
              <Select v-model="formItem.futurePeriodNum" style="width:120px">
                <Option v-for="item in futurePeriodNumList" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row class="row-item">
          <Col span="13" >
            <FormItem label=" ">
              <!-- <CheckboxGroup v-model="formItem.checkbox"> -->
                <Col span="4" >
                <!-- <div style="position:relative">
                  <Checkbox v-model="formItem.isAddOrderTime" >凭证序时控制</Checkbox>
                <Poptip content="content" placement="top" trigger="hover" class="me_poptip first_poptip" @on-popper-show="helpHover(1)" @on-popper-hide="loseHover(1)">
                  <Icon class="icon_help" type="md-help-circle" size="16" :class="{icon_help_nofocus: !popTip.isActiveOne,icon_help_focus: popTip.isActiveOne}"/>
                  <div class="" slot="content" >要求按时间顺序进行制单，启用后已发生日期之前时间不允许再制单</div>
                </Poptip>
                </div> -->
                </Col>
                <Col span="5" >
                <Checkbox v-model="formItem.isAddApproveSame">凭证制单人和审核人是同一人&nbsp;&nbsp;&nbsp;&nbsp;</Checkbox>
                </Col>
                <Col span="4" >
                <Checkbox v-model="formItem.isApproveNotSame">审核和反审核不是同一人</Checkbox>
                </Col>
                <Col span="12" >
                <Checkbox v-model="formItem.isCashierReview" @on-change="doChangeCashier">是否需要出纳复核</Checkbox>
                </Col>
                <Col span="4" >
                <Checkbox v-model="formItem.isReviewBeforeApprove" :disabled="formItem.isCashierReview ? false : true">出纳复核是否在审核之前</Checkbox>
                </Col>
                <Col span="5" >
                <Checkbox v-model="formItem.isReviewNotSame" :disabled="formItem.isCashierReview ? false : true">出纳复核和反复核不是同一人&nbsp;&nbsp;&nbsp;&nbsp;</Checkbox>
                </Col>
                <Col span="4" >
                <Checkbox v-model="formItem.isCanUpdateOther">允许修改他人凭证</Checkbox>
                <Poptip content="content" placement="top" trigger="hover" class="me_poptip second_poptip" @on-popper-show="helpHover(2)" @on-popper-hide="loseHover(2)">
                  <Icon class="icon_help" type="md-help-circle" size="16" :class="{icon_help_nofocus: !popTip.isActiveTwo,icon_help_focus: popTip.isActiveTwo}"/>
                  <div class="" slot="content" >启用后可以修改其他人制单凭证，不启用则只能修改自己的凭证不可修改别人的凭证</div>
                </Poptip>
                </Col>
              <!-- </CheckboxGroup> -->
            </FormItem>
          </Col>
        </Row>
        <Row>
           <div class="title-bar">
             <div class="vertical-bar box-background"></div>
             <div class="title-content">程序控制</div>
          </div>
        </Row>
        <Row class="row-item">
          <Col span="18" >
            <FormItem label=" ">
              <!-- <CheckboxGroup > -->
                <Col span="13" >
                <Checkbox v-model="formItem.isOpenAccounts">允许反结账</Checkbox>
                <Poptip content="content" placement="top" trigger="hover" class="me_poptip three_poptip" @on-popper-show="helpHover(3)" @on-popper-hide="loseHover(3)">
                  <Icon class="icon_help" type="md-help-circle" size="16" :class="{icon_help_nofocus: !popTip.isActiveThree,icon_help_focus: popTip.isActiveThree}"/>
                  <div class="" slot="content" >结账后需要反结账则需要启用此次参数，没启用则不允许反结账</div>
                </Poptip>
                </Col>
                <!-- <Col span="13" >
                <Checkbox v-model="formItem.isOpenAccountsYear">允许跨财务年度的反结账</Checkbox>
                <Poptip content="content" placement="top" trigger="hover" class="me_poptip four_poptip" @on-popper-show="helpHover(4)" @on-popper-hide="loseHover(4)">
                  <Icon class="icon_help" type="md-help-circle" size="16" :class="{icon_help_nofocus: !popTip.isActiveFour,icon_help_focus: popTip.isActiveFour}"/>
                  <div class="" slot="content" >年度最后一期结账后，如果需要反结账则需要启用此参数，没启用则不允许跨财务年度的反结账</div>
                </Poptip>
                </Col> -->
              <!-- </CheckboxGroup> -->
            </FormItem>
          </Col>
        </Row>
        <Row>
           <div class="title-bar">
             <div class="vertical-bar box-background"></div>
             <div class="title-content">现金流量</div>
          </div>
        </Row>
        <Row class="row-item">
          <Col span="18" >
            <FormItem label=" ">
              <!-- <CheckboxGroup > -->
                <Col span="13" >
                <Checkbox v-model="formItem.isCheckCashFlow" :disabled="formItem.isUpdateCash?false:true">结账时检查现金流量分析</Checkbox>
                <Poptip content="content" placement="top" trigger="hover" class="me_poptip five_poptip" @on-popper-show="helpHover(5)" @on-popper-hide="loseHover(5)">
                  <Icon class="icon_help" type="md-help-circle" size="16" :class="{icon_help_nofocus: !popTip.isActiveFive,icon_help_focus: popTip.isActiveFive}"/>
                  <div class="" slot="content" >启用此参数后要求当月现金银行类凭证必须完成现金流量分析，不启用则不控制</div>
                </Poptip>
                </Col>
                <Col span="13" >
                <Checkbox v-model="formItem.isMustSetCashFlow">凭证保存必须指定现金流量项目</Checkbox>
                <Poptip content="content" placement="top" trigger="hover" class="me_poptip six_poptip" @on-popper-show="helpHover(6)" @on-popper-hide="loseHover(6)">
                  <Icon class="icon_help" type="md-help-circle" size="16" :class="{icon_help_nofocus: !popTip.isActiveSix,icon_help_focus: popTip.isActiveSix}"/>
                  <div class="" slot="content" >凭证保存时校验现金流量分析，分析结果平衡保存凭证，分析结果不平衡不保存</div>
                </Poptip>
                </Col>
                <Col span="15" >
                <Checkbox v-model="formItem.isUpdateCash" @on-change="doChangeIsUpdataCash">结账后允许修改现金流量</Checkbox>
                <Poptip content="content" placement="top" trigger="hover" class="me_poptip seven_poptip" @on-popper-show="helpHover(7)" @on-popper-hide="loseHover(7)">
                  <Icon class="icon_help" type="md-help-circle" size="16" :class="{icon_help_nofocus: !popTip.isActiveSeven,icon_help_focus: popTip.isActiveSeven}"/>
                  <div class="" slot="content" >启用后结账后允许修改现金流量项目，否则不允许修改</div>
                </Poptip>
                </Col>
              <!-- </CheckboxGroup> -->
            </FormItem>
          </Col>
        </Row>
        <Row>
           <div class="title-bar">
             <div class="vertical-bar box-background"></div>
             <div class="title-content">打印选项</div>
          </div>
        </Row>
        <Row class="row-item print-item">
          <Col span="21" >
            <FormItem label="打印模板">
              <RadioGroup v-model="formItem.printModel">
                <Col span="3" >
                  <Radio label="FP">发票版 </Radio>
                  <span class="table-span isyl" ref="getColor" @click="isyl"> <a class="table-span" :href="require('../../../assets/images/print-model/发票版.png')" target="_blank">预览</a></span>
                </Col>
                <Col span="3" >
                  <Radio label="A41">A4纸一版 </Radio>
                  <!-- ../../../assets/images/print-model/A4版_横向.png -->
                  <span class="table-span isyl"> <a class="table-span" :href="require('../../../assets/images/print-model/A4版_横向.png')" target="_blank">预览</a></span>
                </Col>
                <Col span="3" >
                  <Radio label="A42">A4纸二版 </Radio>
                  <span class="table-span isyl"> <a class="table-span" :href="require('../../../assets/images/print-model/A4版_2版_横向.png')" target="_blank">预览</a></span>
                </Col>
                <Col span="3" >
                  <Radio label="A43">A4纸三版 </Radio>
                  <span class="table-span isyl"> <a class="table-span" :href="require('../../../assets/images/print-model/A4版_3版_横向.png')" target="_blank">预览</a></span>
                </Col>
                <Col span="3" >
                  <Radio label="A5">A5纸版 </Radio>
                  <span class="table-span isyl">  <a class="table-span" :href="require('../../../assets/images/print-model/A5版_横向.png')" target="_blank">预览</a></span>
                </Col>
              </RadioGroup>
            </FormItem>
          </Col>
        </Row>
        <Row class="last-row-item">
          <Col span="19" >
            <FormItem label="打印凭证的科目格式">
              <RadioGroup v-model="formItem.printSubjectType">
                <Col span="12" >
                <Radio label="0">编码 + 本级名称</Radio>
                </Col>
                <Col span="12" >
                <Radio label="1">编码 + 全级名称</Radio>
                </Col>
              </RadioGroup>
            </FormItem>
          </Col>
        </Row>
    </Form>
    </section>
  </section>
</template>

<script>
// import CommonIcon from '_c/common-icon'
// import { local } from '@/libs/location'
import RadioSelect from '_c/radio-select'
import { saasMixin } from '@/libs/mixins'
export default {
  name: 'argument_index',
  data () {
    return {
      loading2: false,
      subject: {
        lrAccSubjectName: '',
        fpAccSubjectName: '',
        syAccSubjectName: ''
      },
      formItem: { // 表单字段
        id: null, // 主键
        lrAccSubjectId: null, // 本年利润科目ID
        fpAccSubjectId: null, // 利润分配科目
        syAccSubjectId: null, // 以前年度损益调整科目
        credentialType: '0', // 凭证分单方式
        credentialWordType: 0, // 凭证字类型
        futurePeriodNum: 1, // 未来期间数
        // isAddOrderTime: false, // 凭证序时控制
        isAddApproveSame: true, // 凭证制单人和审核人是同一人
        isApproveNotSame: false, // 审核和反审核不是同一人
        isCashierReview: false, // 是否需要出纳复核
        isReviewBeforeApprove: false, // 出纳复核是否在审核之前
        isReviewNotSame: false, // 出纳复核和反复核不是同一人
        isCanUpdateOther: true, // 允许修改他人凭证
        isOpenAccounts: true, // 允许反结账
        // isOpenAccountsYear: false, // 允许跨财务年度的反结账
        isCheckCashFlow: false, // 结账时检查现金流量分析
        isMustSetCashFlow: false, // 凭证保存必须指定现金流量项目
        isUpdateCash: true, // 结账后允许修改现金流量
        printModel: 'A42', // 打印模板
        printSubjectType: '0' // 打印凭证的科目格式
      },
      changeContext: false, // 用于判断数据改变，触发弹窗
      // 会计科目引入资料单选
      subject_config_one: {
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
      // 会计科目引入资料单选 - 本年利润科目
      // subject_config_one: {
      //   type: 'subjectSetting',
      //   title: '选择会计科目',
      //   width: '300px',
      //   refresh: false,
      //   request_params: {
      //     code: '4103',
      //     typeAttribute: null,
      //     isFinal: 1,
      //     isEnable: 1
      //     // menuCode: 'argument_index'
      //   }
      // },
      subject_config_two: {
        type: 'subjectSetting',
        title: '选择会计科目',
        width: '100%',
        refresh: false,
        request_params: {
          isFinal: 1, // 只显示末级科目
          isEnable: '1', // 已启用
          code: '4104', // 科目编码
          isEnterpriseAdmin: 1, // 是否租户管理员
          accountCategory: 'all', // 分类
          accountElementItem: 'all', // 会计要素
          subjectCategory: 'all', // 科目类别
          auxiliaryName: 'all', // 辅助核算名称
          codeOrName: '', // 编码或名称
          menuCode: 'argument_index'
        }
      },
      // 会计科目引入资料单选 - 利润分配科目
      // subject_config_two: {
      //   type: 'subjectSetting',
      //   title: '选择会计科目',
      //   width: '300px',
      //   refresh: false,
      //   request_params: {
      //     code: '4104',
      //     typeAttribute: null,
      //     isEnable: 1,
      //     isFinal: 1
      //     // menuCode: 'argument_index'
      //   }
      // },
      subject_config_three: {
        type: 'subjectSetting',
        title: '选择会计科目',
        width: '100%',
        refresh: false,
        request_params: {
          // isFinal: 0, // 只显示末级科目
          isEnable: '1', // 已启用
          code: '6901', // 科目编码
          isEnterpriseAdmin: 1, // 是否租户管理员
          accountCategory: 'all', // 分类
          accountElementItem: 'all', // 会计要素
          subjectCategory: 'all', // 科目类别
          auxiliaryName: 'all', // 辅助核算名称
          codeOrName: '', // 编码或名称
          menuCode: 'argument_index'
        }
      },
      // 会计科目引入资料单选 - 以前年度损益调整科目
      // subject_config_three: {
      //   type: 'subjectSetting',
      //   title: '选择会计科目',
      //   width: '300px',
      //   refresh: false,
      //   request_params: {
      //     code: '6901',
      //     typeAttribute: null,
      //     isEnable: 1
      //     // menuCode: 'argument_index'
      //   }
      // },
      select_loading: false,
      select_list: [],
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
      formList: [], // 全部类别属性
      popTip: { // 控制气泡的文字显隐
        isActiveOne: false,
        isActiveTwo: false,
        isActiveThree: false,
        isActiveFour: false,
        isActiveFive: false,
        isActiveSix: false,
        isActiveSeven: false
      }
    }
  },
  components: {
    // CommonIcon
    RadioSelect
  },
  mixins: [saasMixin],
  mounted () {
    this.doGetSubjectScreenList()
    this.doInit()
  },
  watch: {
    changeContext (val) {
      console.log(val)
      this.doIdentifying(this.$route, val)
    },
    subject: {
      handler (newValue, oldValue) {
        console.log(newValue, oldValue)
        this.subject.lrAccSubjectName = newValue.lrAccSubjectName
      },
      deep: true
    },
    formItem: {
      handler (newValue, oldValue) {
        this.changeContext = true
        console.log(newValue)
      },
      deep: true
    }
  },
  methods: {
    doText () {
      console.log('aaaaa')
      this.$Message.info({
        content: '我是提示信息',
        duration: 3
      })
      // setTimeout(() => {
      //   this.$Message.info('aaaaaaaaaa')
      // }, 3000)
    },
    // 保存
    doSave (getData) {
      console.log(this.formItem)
      let req = { // 表单字段
        id: this.formItem.id, // 主键
        lrAccSubjectId: this.formItem.lrAccSubjectId, // 本年利润科目ID
        fpAccSubjectId: this.formItem.fpAccSubjectId, // 利润分配科目
        syAccSubjectId: this.formItem.syAccSubjectId, // 以前年度损益调整科目
        credentialType: parseInt(this.formItem.credentialType) ? 1 : 0, // 凭证分单方式
        credentialWordType: this.formItem.credentialWordType, // 凭证字类型
        futurePeriodNum: this.formItem.futurePeriodNum, // 未来期间数
        // isAddOrderTime: this.formItem.isAddOrderTime ? 1 : 0, // 凭证序时控制
        isAddApproveSame: this.formItem.isAddApproveSame ? 1 : 0, // 凭证制单人和审核人是同一人
        isApproveNotSame: this.formItem.isApproveNotSame ? 1 : 0, // 审核和反审核不是同一人
        isCashierReview: this.formItem.isCashierReview ? 1 : 0, // 是否需要出纳复核
        isReviewBeforeApprove: this.formItem.isReviewBeforeApprove ? 1 : 0, // 出纳复核是否在审核之前
        isReviewNotSame: this.formItem.isReviewNotSame ? 1 : 0, // 出纳复核和反复核不是同一人
        isCanUpdateOther: this.formItem.isCanUpdateOther ? 1 : 0, // 允许修改他人凭证
        isOpenAccounts: this.formItem.isOpenAccounts ? 1 : 0, // 允许反结账
        // isOpenAccountsYear: this.formItem.isOpenAccountsYear ? 1 : 0, // 允许跨财务年度的反结账
        isCheckCashFlow: this.formItem.isCheckCashFlow ? 1 : 0, // 结账时检查现金流量分析
        isMustSetCashFlow: this.formItem.isMustSetCashFlow ? 1 : 0, // 凭证保存必须指定现金流量项目
        isUpdateCash: this.formItem.isUpdateCash ? 1 : 0, // 结账后允许修改现金流量
        printModel: this.formItem.printModel, // 打印模板
        printSubjectType: parseInt(this.formItem.printSubjectType) ? 1 : 0 // 打印凭证的科目格式
      }
      console.log(req)
      this.$request.post('/ledger/parameterSet/updateParameterSet', req).then(res => {
        console.log(res)
        let { code } = res.data
        if (code === 200) {
          this.changeContext = false
          this.$Message.success('保存成功！')
          if (getData === 'closeTab') {
            this.doContinueActions()
          }
        }
      })
    },
    // 取消
    doInit () {
      // this.doTypeAttributeSelect()
      this.loading2 = true
      this.$request.post('/ledger/parameterSet/findParameterSet').then(res => {
        let { code, data } = res.data
        if (code === 200) {
          console.log(data)
          this.formItem.id = data.id
          this.formItem.lrAccSubjectId = data.lrAccSubjectId // 本年利润科目ID
          this.formItem.fpAccSubjectId = data.fpAccSubjectId // 利润分配科目
          this.formItem.syAccSubjectId = data.syAccSubjectId // 以前年度损益调整科目
          this.formItem.credentialType = data.credentialType + '' // 凭证分单方式
          this.formItem.credentialWordType = data.credentialWordType // 凭证字类型
          this.formItem.futurePeriodNum = data.futurePeriodNum // 未来期间数
          // this.formItem.isAddOrderTime = this.doChangeData(data.isAddOrderTime) // 凭证序时控制
          this.formItem.isAddApproveSame = this.doChangeData(data.isAddApproveSame) // 凭证制单人和审核人是同一人
          this.formItem.isApproveNotSame = this.doChangeData(data.isApproveNotSame) // 审核和反审核不是同一人
          this.formItem.isCashierReview = this.doChangeData(data.isCashierReview) // 是否需要出纳复核
          this.formItem.isReviewBeforeApprove = this.doChangeData(data.isReviewBeforeApprove) // 出纳复核是否在审核之前
          this.formItem.isReviewNotSame = this.doChangeData(data.isReviewNotSame) // 出纳复核和反复核不是同一人
          this.formItem.isCanUpdateOther = this.doChangeData(data.isCanUpdateOther) // 允许修改他人凭证
          this.formItem.isOpenAccounts = this.doChangeData(data.isOpenAccounts) // 允许反结账
          // this.formItem.isOpenAccountsYear = this.doChangeData(data.isOpenAccountsYear) // 允许跨财务年度的反结账
          this.formItem.isCheckCashFlow = this.doChangeData(data.isCheckCashFlow) // 结账时检查现金流量分析
          this.formItem.isMustSetCashFlow = this.doChangeData(data.isMustSetCashFlow) // 凭证保存必须指定现金流量项目
          this.formItem.isUpdateCash = this.doChangeData(data.isUpdateCash) // 结账后允许修改现金流量
          this.formItem.printModel = data.printModel // 打印模板
          this.formItem.printSubjectType = data.printSubjectType + '' // 打印凭证的科目格式
          console.log(this.formItem)
          let req = {
            ids: [data.lrAccSubjectId, data.fpAccSubjectId, data.syAccSubjectId],
            page: {
              current: 1,
              size: 10
            }
          }
          this.$request.post('/financeback/accountSubject/findPage', req).then(resolve => {
            this.loading2 = false
            let { code, data } = resolve.data
            if (code === 200) {
              console.log(data)
              this.subject.lrAccSubjectName = data.records.filter(n => n.id === this.formItem.lrAccSubjectId)[0].code + ' ' + data.records.filter(n => n.id === this.formItem.lrAccSubjectId)[0].name
              this.subject_config_one.request_params.accountElementItem = data.records.filter(n => n.id === this.formItem.lrAccSubjectId)[0].accountElementItem
              this.subject_config_one.request_params.subjectCategory = data.records.filter(n => n.id === this.formItem.lrAccSubjectId)[0].subjectCategory
              this.subject.fpAccSubjectName = data.records.filter(n => n.id === this.formItem.fpAccSubjectId)[0].code + ' ' + data.records.filter(n => n.id === this.formItem.fpAccSubjectId)[0].name
              this.subject_config_two.request_params.accountElementItem = data.records.filter(n => n.id === this.formItem.fpAccSubjectId)[0].accountElementItem
              this.subject_config_two.request_params.subjectCategory = data.records.filter(n => n.id === this.formItem.fpAccSubjectId)[0].subjectCategory
              this.subject.syAccSubjectName = data.records.filter(n => n.id === this.formItem.syAccSubjectId)[0].code + ' ' + data.records.filter(n => n.id === this.formItem.syAccSubjectId)[0].name
              this.subject_config_three.request_params.accountElementItem = data.records.filter(n => n.id === this.formItem.syAccSubjectId)[0].accountElementItem
              this.subject_config_three.request_params.subjectCategory = data.records.filter(n => n.id === this.formItem.syAccSubjectId)[0].subjectCategory
            }
          })
          setTimeout(() => {
            this.changeContext = false
          }, 500)
        }
      })
    },
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
            that.doInit()
            that.changeContext = false
            that.$CloseCtl()
          },
          cancel () {
            that.$CloseCtl()
          }
        })
      }
    },
    // 转换数据类型
    doChangeData (data) {
      if (data) {
        return true
      } else {
        return false
      }
    },
    // 切换结账后允许修改现金流量
    doChangeIsUpdataCash (val) {
      console.log(val)
      if (!val) {
        this.formItem.isCheckCashFlow = true
      }
    },
    // 是否需要出纳复核 - 改变事件
    doChangeCashier (val) {
      // console.log(val)
      if (!val) {
        this.formItem.isReviewBeforeApprove = false
        this.formItem.isReviewNotSame = false
      }
    },
    // 是否取消 的弹窗
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
            if (data === 'cancelBtn') {
              that.doSave()
            } else {
              that.doSave('closeTab')
            }
            that.$CloseCtl()
          },
          no () {
            that.changeContext = false
            if (data === 'cancelBtn') {
              console.log('取消')
              that.doInit()
            } else {
              that.doContinueActions()
            }
            that.$CloseCtl()
          },
          cancel () {
            that.$CloseCtl()
          }
        })
      }
    },
    // 获取本年利润科目
    doGetlrAccSubjectData (list, item) {
      this.formItem.lrAccSubjectId = list.id
      this.subject.lrAccSubjectName = item.code + list.name
      console.log(this.subject.lrAccSubjectName, '获取name')
      console.log(list, '本年利润科目')
      let that = this
      that.$nextTick(() => {
        that.$refs.lrAcc.$children[0].$refs.input.value = item.code + ' ' + item.name
      })
    },
    // 利润分配科目
    doGetfpAccSubjectData (list, item) {
      this.formItem.fpAccSubjectId = list.id
      this.subject.fpAccSubjectName = item.code + list.name
      console.log(list, '利润分配科目')
      console.log(this.subject.fpAccSubjectName)
      let that = this
      that.$nextTick(() => {
        that.$refs.fpAcc.$children[0].$refs.input.value = item.code + ' ' + item.name
      })
    },
    // 以前年度损益调整科目
    dosyAccSubjectData (list, item) {
      this.formItem.syAccSubjectId = list.id
      this.subject.syAccSubjectName = item.code + list.name
      console.log(list, '以前年度损益调整科目')
      let that = this
      that.$nextTick(() => {
        that.$refs.syAcc.$children[0].$refs.input.value = item.code + ' ' + item.name
      })
    },
    // 获取全部类别属性下拉框
    doTypeAttributeSelect () {
      this.$request.post('/financeback/accountSubject/findTypeAttributeSelection').then(res => {
        if (res.data.code === 200) {
          this.formList = res.data.data
          console.log(this.formItem)
        } else {
          this.formList = []
        }
      })
    },
    // 单选弹窗 - 重置
    doReset () {
      this.subject_config_one.request_params.accountCategory = 'all' // 分类
      // this.subject_config_one.request_params.accountElementItem = 'all' // 会计要素
      // this.subject_config_one.request_params.subjectCategory = 'all' // 科目类别
      this.subject_config_one.request_params.auxiliaryName = 'all' // 辅助核算名称
      this.subject_config_one.request_params.codeOrName = ''
      this.subject_config_one.refresh = !this.subject_config_one.refresh
    },
    doReset2 () {
      this.subject_config_two.request_params.accountCategory = 'all' // 分类
      // this.subject_config_two.request_params.accountElementItem = 'all' // 会计要素
      // this.subject_config_two.request_params.subjectCategory = 'all' // 科目类别
      this.subject_config_two.request_params.auxiliaryName = 'all' // 辅助核算名称
      this.subject_config_two.request_params.codeOrName = ''
      this.subject_config_two.refresh = !this.subject_config_two.refresh
    },
    doReset3 () {
      this.subject_config_three.request_params.accountCategory = 'all' // 分类
      // this.subject_config_three.request_params.accountElementItem = 'all' // 会计要素
      // this.subject_config_three.request_params.subjectCategory = 'all' // 科目类别
      this.subject_config_three.request_params.auxiliaryName = 'all' // 辅助核算名称
      this.subject_config_three.request_params.codeOrName = ''
      this.subject_config_three.refresh = !this.subject_config_three.refresh
    },
    isyl () {
      console.log(this.$refs.getColor.classList)
    },
    // 重置
    resetrefresh () {

    },
    doChangeForm (data) {

    },
    // 帮助信息提示
    helpHover (num) {
      switch (num) {
        case 1:
          this.popTip.isActiveOne = true
          break
        case 2:
          this.popTip.isActiveTwo = true
          break
        case 3:
          this.popTip.isActiveThree = true
          break
        case 4:
          this.popTip.isActiveFour = true
          break
        case 5:
          this.popTip.isActiveFive = true
          break
        case 6:
          this.popTip.isActiveSix = true
          break
        case 7:
          this.popTip.isActiveSeven = true
          break
        default:
          break
      }
    },
    loseHover (num) {
      switch (num) {
        case 1:
          this.popTip.isActiveOne = false
          break
        case 2:
          this.popTip.isActiveTwo = false
          break
        case 3:
          this.popTip.isActiveThree = false
          break
        case 4:
          this.popTip.isActiveFour = false
          break
        case 5:
          this.popTip.isActiveFive = false
          break
        case 6:
          this.popTip.isActiveSix = false
          break
        case 7:
          this.popTip.isActiveSeven = false
          break
        default:
          break
      }
    }
  }
}

</script>

<style lang="less" scoped>
@import "../../../assets/css/base.less";
@import '../../../assets/css/redefine.less';
.argument-container {
  .page-content {
    .form-item {
      .isyl {
        position: relative;
        top:2px;
      }
      .ivu-table {
        overflow: visible;
        height:37px;
      }
      .ivu-col-span-3 {
        display: block;
        width: 16.5%;
      }
      .ivu-col-span-4 {
        display: block;
        width: 21%;
      }
      .ivu-col-span-5 {
        display: block;
        width: 24%;
      }
      .ivu-col-span-6 {
        display: block;
        width: 26.05%;
      }
      .ivu-col-span-7 {
        display: block;
        width: 455px;
      }
      .search-style {
        position: absolute;
        top: 8px;
        right:2px;
      }
      .ivu-form-item{
        margin-bottom: 8px;
      }
      .row-item {
        .ivu-form-item {
          width: 980px;
        }
      }
      .print-item {
        .ivu-radio-group {
          width:800px
        }
      }
      .last-row-item {
        .ivu-radio-default {
          width:262px
        }
      }
      .title-bar {
        margin-bottom: 30px;
        .vertical-bar {
          float: left;
          margin-right: 10px;
          width:2px;
          height:18px;
          // background:rgba(0,164,151,1);
        }
        .title-content {
          float: left;
          height:19px;
          font-size:12px;
          font-family:PingFang-SC-Bold;
          font-weight:bold;
          color:rgba(51,51,51,1);
          line-height:19px;
          opacity:0.85;
        }
      }
      .icon_help{
        position: absolute;
        top: 8px;
        right: -24px;
        font-size: 16px;
        cursor:pointer;
      }
      .icon_help_nofocus{
        color: #d7d7d7;
      }
      .icon_help_focus{
        color: @warning ;
      }
      .me_poptip{
        width:0% !important;
        position: absolute;
        top: -20px;
        // right: 100px;
        z-index: 5;
        width: 0;
        .top,.bottom{
          text-align: center;
        }
        .center{
          width: 300px;
          margin: 10px auto;
          overflow: hidden;
        }
        .center-left{
          float: left;
        }
        .center-right{
          float: right;
        }
      }
      .first_poptip {
        position: absolute;
        right: 85px;
      }
      .second_poptip{
        position: absolute;
        right: 60px;
      }
      .three_poptip{
        position: absolute;
        left: 77px;
      }
      .four_poptip{
        position: absolute;
        left: 149px;
      }
      .five_poptip{
        position: absolute;
        left: 149px;
      }
      .six_poptip{
        position: absolute;
        left: 186px;
      }
      .seven_poptip{
        position: absolute;
        left: 151px;
      }
      a{
        text-decoration:none;
      }
    }
  }
}
</style>
<style lang="less">
.argument-container {
  .page-content {
    .form-item {
      .radio-select-style {
        .page-footer-rt {
          flex: 7
        }
        .ivu-col-span-3 {
          display: block;
          width: 12.5%;
        }
        .ivu-col-span-4 {
          display: block;
          width: 16.66666667%;
        }
        th .ivu-table-cell {
          padding: 0 8px;
        }
        td .ivu-table-cell {
          padding: 0 0px 0 8px;
        }
      }
      .ivu-table {
        height:37px;
        overflow: visible;
      }
      .ivu-btn-icon-only {
        padding: 3px 10px;
        margin-left: 0px;
      }
    }
  }
}
</style>
