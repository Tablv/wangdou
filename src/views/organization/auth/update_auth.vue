<template>
  <div class="update-auth">
    <Spin fix v-if="loading" style="left:8px;z-index:201">
      <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
      <div>正在载入数据</div>
    </Spin>
    <Spin fix v-if="saveLoading" style="left: 8px;z-index: 201">
      <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
      <div>数据保存中</div>
    </Spin>
    <common-icon v-if="disabledConfig===true && isDel === 0" class="yishixiao" type="_yishixiao1" />
    <!-- 这里是判断已删除 -->
    <common-icon v-if="isDel === 1" class="yishixiao" type="_yishanchu" />
    <section class="company-container">
      <section class="page-header">
        <div class="page-header-name">查看岗位权限</div>
        <div class="page-header-actions">
          <Button type="primary" @click="doSave('authField','save')" v-if="!disabledConfig" :disabled="Boolean(isDel)">保存</Button>
          <Button @click="doCancel" v-if="!disabledConfig" :disabled="Boolean(isDel)">取消</Button>
          <Button @click="doGoCreatePage" :disabled="Boolean(isDel)">新增</Button>
          <Button @click="doCopy" :disabled="Boolean(isDel)">复制</Button>
          <Button @click="doDelete" v-if="!disabledConfig && !inputDisabledConfig" :disabled="Boolean(isDel)">删除</Button>
          <Button @click="doBackTable">列表</Button>
          <Button v-if="!disabledConfig" @click="doBacthDisable" :disabled="Boolean(isDel)">禁用</Button>
          <Button v-if="Boolean(disabledConfig)" @click="doBacthUnDisable" :disabled="Boolean(isDel)">反禁用</Button>
          <Button  @click="doFirstData" class="isfenye"><span class="dofenye"><common-icon  class="fenye" type="_shouye" /></span></Button>
          <Button icon="ios-arrow-back" @click="doPreData"></Button>
          <Button icon="ios-arrow-forward" @click="doNextData(false)"></Button>
          <Button class="isfenye" @click="doLastData"><span class="dofenye"><common-icon  class="fenye" type="_moye" /></span></Button>
        </div>
      </section>
      <section class="page-content">
        <Form
          ref="authField"
          :model="authField"
          :rules="ruleValidate"
          :label-width="130"
          class="form_init form"
        >
          <Row>
            <Col span="5" class="input_after">
              <FormItem label="编码" prop="code">
                <Input v-model="authField.code" :maxlength="10" :disabled= "inputDisabledConfig" @on-change="doChangeData"></Input>
                <Poptip content="content" placement="top" trigger="hover" class="my_poptip" @on-popper-show="helpHover" @on-popper-hide="loseHover">
                      <Icon class="icon_help" type="md-help-circle" size="20" :class="{icon_help_nofocus: !isActive,icon_help_focus: isActive}"/>
                      <div class="" slot="content" >请输入不超过10个字符的数字或英文字母，并且不能重复</div>
                </Poptip>
              </FormItem>
            </Col>
            <Col span="5" class="input_after">
              <FormItem label="名称" prop="name">
                <Input v-model="authField.name" :maxlength="20" :disabled= "inputDisabledConfig" @on-change="doChangeData"></Input>
              </FormItem>
            </Col>
          </Row>
          <Row >
            <Col span="5" >
              <FormItem label="修改人" >
                <Input v-model="authField.updatorName"  disabled></Input>
              </FormItem>
            </Col>
            <Col span="5" >
              <FormItem label="修改时间" >
                <Input v-model="authField.updateTime"  disabled></Input>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="10">
              <FormItem label="描述" class="area-input">
                <Input
                  class="input_width"
                  type="textarea"
                  v-model="authField.remark"
                  :autosize="{minRows: 4,maxRows: 4}"
                  :maxlength="100"
                  :disabled= "disabledConfig"
                  @on-change="doChangeData"
                ></Input>
                <span class="area-word">{{number}}/100</span>
              </FormItem>
            </Col>
          </Row>
        </Form>
      </section>
      <row>
        <Col span="2">
          <ul class="create-auth-tabList">
            <li
              class="tabList-li"
              v-for="(item,index) in allList"
              :key="index"
              @click="doAuthStyle(index,item)"
            >
              <p>{{item.name}}</p>
            </li>
          </ul>
        </Col>
        <Col span="22" class="auth-height">
          <div class="auth-mainTab">
            <div class="auth-mainTab-head" >
              <div class="auth-mainTab-head-row">
              二级菜单
              </div>
              <div class="auth-mainTab-head-row">
                <Checkbox :indeterminate="menuIndeterminate" :disabled="disabledConfig" :value="checkMenuAll" @click.prevent.native="doCheckMenuAll" >菜单名称</Checkbox>
              </div>
              <div class="auth-mainTab-head-row">
                权限组
              </div>
              <div class="auth-mainTab-head-row2" >
                <span>权限</span>
              </div>
            </div>
            <CheckboxGroup v-model="selectGroup" @on-change="doSelectGroupChange">
            <div class="auth-mainTab-content">
              <div v-for="(firstItem,index1) in treeList" :key="index1">
                <div v-for="(secondItem,index2) in firstItem.children" :key="index2" class="auth-mainTab-flex" >
                  <div class="auth-mainTab-content-line1" >
                    <p>
                      {{secondItem.name}}
                    </p>
                  </div>
                  <div class="auth-mainTab-content-line-parent1" >
                    <div v-for="(tirdItem,index3) in secondItem.children" :key="index3" >
                      <div  class="auth-mainTab-flex" >
                        <div class="auth-mainTab-content-line2" >
                          <p>
                            <Checkbox :disabled="disabledConfig" :label="tirdItem.id" :indeterminate="tirdItem.indeterminate===null || tirdItem.indeterminate ===0?false:true" @mouseup.native="doClickMenu(tirdItem, secondItem,'right')">{{tirdItem.name}}</Checkbox>
                          </p>
                        </div>
                        <div class="auth-mainTab-content-line-parent2" >
                          <div v-for="(fourItem,index4) in tirdItem.children" :key="index4" >
                            <div class="auth-mainTab-flex">
                              <div class="auth-mainTab-content-line3" >
                                <p>
                                  <Checkbox :disabled="disabledConfig" :label="fourItem.id" :indeterminate="fourItem.indeterminate===null||fourItem.indeterminate ===0?false:true" @mouseup.native="doClickAuthGroup(fourItem,tirdItem,'right')">{{fourItem.name}}</Checkbox>
                                </p>
                              </div>
                              <div class="auth-mainTab-content-line4">
                                <span v-for="(fiveItem,index5) in fourItem.children" :key="index5" class="auth-mainTab-content-auth" >
                                  <Checkbox :disabled="fiveItem.isDefaultSelect === 1?true:disabledConfig " :label="fiveItem.id" :indeterminate="fiveItem.indeterminate===null||fiveItem.indeterminate ===0?false:true " @mouseup.native="doClickFiveAuth(fiveItem, fourItem,'right')">{{fiveItem.name}}</Checkbox>
                                  <span v-if="fiveItem.children&&fiveItem.children.length>0&&fiveItem.typeIcon === true" @click="doHighSet(fiveItem)">
                                    <common-icon type="_set" class="setIcon-yellow" />
                                  </span>
                                  <span v-if="fiveItem.children&&fiveItem.children.length>0&&fiveItem.typeIcon === false">
                                    <common-icon type="_set" class="setIcon-gray" />
                                  </span>
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <Modal
              v-model="highSetShow1"
              :title="'高级设置-'+highSetTitle1"
              :mask-closable="false"
              class="create-auth-highModal">
              <div>
                <span v-for="(highItem1,highIndex1) in highSetData1.children"  :key="highIndex1" class="auth-highModal-content"  >
                  <Checkbox :disabled="highItem1.isDefaultSelect === 1?true:disabledConfig " :label="highItem1.id" :indeterminate="highItem1.indeterminate===null||highItem1.indeterminate ===0?false:true " @mouseup.native="doClickSixAuth(highItem1, highSetData1,'right')" >{{highItem1.name}}</Checkbox>
                  <span v-if="highItem1.children&&highItem1.children.length>0&&highItem1.typeIcon === true" @click="doHighSet(highItem1)">
                    <common-icon type="_set" class="setIcon-yellow" />
                  </span>
                  <span v-if="highItem1.children&&highItem1.children.length>0&&highItem1.typeIcon === false">
                    <common-icon type="_set" class="setIcon-gray"/>
                  </span>
                </span>
              </div>
            </Modal>
            <Modal
              v-model="highSetShow2"
              :title="'高级设置-'+highSetTitle2"
              :mask-closable="false"
              class="create-auth-highModal">
              <div>
                <span v-for="(highItem2,highIndex2) in highSetData2.children"  :key="highIndex2" class="auth-highModal-content" >
                  <Checkbox :disabled="highItem2.isDefaultSelect === 1?true:disabledConfig " :label="highItem2.id" :indeterminate="highItem2.indeterminate===null||highItem2.indeterminate ===0?false:true" @mouseup.native="doClickSevenAuth(highItem2, highSetData2,'right')" >{{highItem2.name}}</Checkbox>
                  <span v-if="highItem2.children&&highItem2.children.length>0&&highItem2.typeIcon === true" @click="doHighSet(highItem2)">
                    <common-icon type="_set" class="setIcon-yellow"/>
                  </span>
                  <span v-if="highItem2.children&&highItem2.children.length>0&&highItem2.typeIcon === false">
                    <common-icon type="_set" class="setIcon-gray"/>
                  </span>
                </span>
                <Button class="backPre"  @click="doUpLevel2()">返回上一级</Button>
              </div>
            </Modal>
            <Modal
              v-model="highSetShow3"
              :title="'高级设置-'+highSetTitle3"
              :mask-closable="false"
              class="create-auth-highModal">
              <div>
                <span v-for="(highItem3,highIndex3) in highSetData3.children"  :key="highIndex3" class="auth-highModal-content" >
                  <Checkbox :disabled="highItem3.isDefaultSelect === 1?true:disabledConfig " :label="highItem3.id" :indeterminate="highItem3.indeterminate===null||highItem3.indeterminate ===0?false:true" @mouseup.native="doClickEightAuth(highItem3, highSetData3,'right')">{{highItem3.name}}</Checkbox>
                  <span v-if="highItem3.children&&highItem3.children.length>0&&highItem3.typeIcon === true" @click="doHighSet(highItem3)">
                    <common-icon type="_set" class="setIcon-yellow"/>
                  </span>
                  <span v-if="highItem3.children&&highItem3.children.length>0&&highItem3.typeIcon === false">
                    <common-icon type="_set" class="setIcon-gray"/>
                  </span>
                </span>
                <Button class="backPre"  @click="doUpLevel3()">返回上一级</Button>
              </div>
            </Modal>
            <Modal
              v-model="highSetShow4"
              :title="'高级设置-'+highSetTitle4"
              :mask-closable="false"
              class="create-auth-highModal">
              <div>
                <span v-for="(highItem4,highIndex4) in highSetData4.children"  :key="highIndex4" class="auth-highModal-content" >
                  <Checkbox :disabled="highItem4.isDefaultSelect === 1?true:disabledConfig " :label="highItem4.id" :indeterminate="highItem4.indeterminate===null||highItem4.indeterminate ===0?false:true" @mouseup.native="doClickNineAuth(highItem4, highSetData4,'right')">{{highItem4.name}}</Checkbox>
                  <span v-if="highItem4.children&&highItem4.children.length>0&&highItem4.typeIcon === true" @click="doHighSet(highItem4)">
                    <common-icon type="_set" class="setIcon-yellow"/>
                  </span>
                  <span v-if="highItem4.children&&highItem4.children.length>0&&highItem4.typeIcon === false">
                    <common-icon type="_set" class="setIcon-gray"/>
                  </span>
                </span>
                <Button class="backPre"   @click="doUpLevel4()">返回上一级</Button>
              </div>
            </Modal>
            </CheckboxGroup>
          </div>
          <div>
          </div>
        </Col>
      </row>
      <Modal
        v-model="findShow"
        draggable
        scrollable
        title="选择岗位权限"
        width="700"
        :transfer="false"
        @on-cancel="findCancel"
        class="create-auth-modal"
      >
        <Row>
          <Col span="10">
            <Input  v-model="commParams.orMatch" placeholder="岗位权限编码/名称" @on-clear="doSearchAuth" clearable>
              <Button slot="append" icon="ios-search" @click="doSearchAuth"></Button>
            </Input>
          </Col>
        </Row>
        <div class="page-content-table create-auth-table" >
          <Table :columns="tableColumns" :data="tableData" @on-row-dblclick="doClickColumn">
            <template slot-scope="{ row }" slot="action">
              <span style="color:#00a597" @click="doSelect(row)">选择</span>
            </template>
          </Table>
        </div>
        <section class="page-footer">
          <div class="page-footer-lf">
            共 {{total}} 条数据
          </div>
          <div class="page-footer-rt">
            <Page
              id="pageId"
              class-name="pages"
              :total="total"
              :page-size="size"
              :page-size-opts="[10, 20, 30, 40]"
              show-elevator
              show-sizer
              @on-page-size-change="changePageSize"
              @on-change="handleChangePage"
            />
            <Button size="small" @click="goElevatorPage('pageId')">Go</Button>
          </div>
        </section>
        <div slot="footer"></div>
      </Modal>
    </section>
  </div>
</template>

<script>
import { Validation } from '@/libs/util.js'
import CommonIcon from '_c/common-icon'
import { saasMixin } from '@/libs/mixins'
import { mapMutations } from 'vuex'
export default {
  name: 'update_auth',
  components: {
    CommonIcon
  },
  data () {
    return {
      loading: false,
      saveLoading: false,
      isDel: 0, // 是否已经删除
      allList: [],
      roleId: null,
      isActive: false,
      isMessage: false,
      isColor: null,
      successContent: '',
      alertShow: false,
      times: null,
      model: '', // 按钮切换
      findShow: false, // 查找弹框出现
      authShow: false, // 高级权限出现
      total: null, // 总数据
      current: null, // 当前页
      size: null, // 每页展示的个数
      pages: null, // 总页数
      isEnableConfig: null, // 是否是失效
      condition: {
        orMatch: '',
        isEnable: ''
      }, // 列表页带来的参数
      commParams: {
        orMatch: ''
      }, // 查找-查询条件
      authField: {
        code: '',
        remark: '',
        name: ''
      }, // 描述，编码，名称字段
      ruleValidate: {
        code: [
          { required: true }, { validator: Validation.authCodeRule, trigger: 'blur' }
        ],
        name: [
          { required: true }, { validator: Validation.nameRule }
        ]
      },
      tableData: [], // 查找-列表数据
      tableColumns: [
        {
          title: '编码',
          key: 'code'
        },
        {
          title: '名称',
          key: 'name'
        },
        {
          title: '操作',
          slot: 'action',
          width: 150,
          align: 'center'
        }
      ], // 查找-列表头
      tabId: null,
      secondIdsList: [], // 当前二级所有的id
      allSelectIds: [], // 总选择的id
      treeList: [],
      selectGroup: [],
      selectHighGroup: [], // 高级设置已选id
      highSetTitle: '',
      inputDisabledConfig: false, // input的必选字段的禁用
      disabledConfig: false, // 多选框变禁用
      backButton6: false,
      backButton7: false,
      backButton8: false,
      menuIndeterminate: false,
      checkMenuAll: false,
      secondIndeterminates: [],
      thirdIndeterminates: [],
      highSetShow1: false,
      highSetData1: {}, // 高级设置的内容
      highSetShow2: false,
      highSetData2: {},
      highSetShow3: false,
      highSetData3: {},
      highSetShow4: false,
      highSetData4: {},
      highIndeterminate1: false,
      checkHighAll1: false,
      highSetTitle1: '',
      highIndeterminate2: false,
      checkHighAll2: false,
      highSetTitle2: '',
      highIndeterminate3: false,
      checkHighAll3: false,
      highSetTitle3: '',
      highIndeterminate4: false,
      checkHighAll4: false,
      highSetTitle4: '',
      ind: null, // 当前tab的index
      selectItemArr: [],
      relationUsers: null, // 保存时查的关联用户
      relationUserConfig: '', // 是否是保存还是新增保存
      reminderModal: false, // 数据是否改变的框
      dataChangeFlag: '', // 数据变化是否是复制，新增还是取消
      changeStatus: false, // 数据是否变化的变量
      isClose: false, // 是否关闭本页
      doFirstType: false,
      doPreType: false,
      doLastType: false,
      doNextType: false,
      doBacthDisableType: false, // 数据改变后-禁用-标识是否关闭页面
      doBacthUnDisableType: false, // 数据改变后-反禁用-标识是否关闭页面
      doDeleteType: false // 数据改变后-删除-标识是否关闭页面
    }
  },
  mixins: [saasMixin],
  watch: {
    'selectGroup': {
      handler: function (data, oldData) {
        let that = this
        this.treeList.forEach((item, index) => {
          // 判断三级菜单
          if (item.indeterminate === 1) {
            this.menuIndeterminate = true
            this.checkMenuAll = false
          }
          if (item.indeterminate === null) {
            this.menuIndeterminate = false
            this.checkMenuAll = false
          }
          if (item.indeterminate === 0) {
            this.menuIndeterminate = false
            this.checkMenuAll = true
          }
          item.children.forEach((itemNew, indexNew) => {
            itemNew.children.forEach((item2, index2) => {
              item2.children.forEach((item3, index3) => {
                item3.children.forEach(function (item4, index4) {
                // typeIcon是控制设置出现与否
                  if (that.selectGroup.indexOf(item4.id) >= 0) {
                    item4.typeIcon = true
                  } else {
                    item4.typeIcon = false
                  }
                  if (item4.children) {
                    // let flag6 = 0
                    item4.children.forEach((item5, index5) => {
                      // typeIcon是控制设置出现与否
                      if (that.selectGroup.indexOf(item5.id) >= 0) {
                        item5.typeIcon = true
                      } else {
                        item5.typeIcon = false
                      }
                      if (item5.children) {
                        item5.children.forEach((item6, index6) => {
                          // typeIcon是控制设置出现与否
                          if (that.selectGroup.indexOf(item6.id) >= 0) {
                            item6.typeIcon = true
                          } else {
                            item6.typeIcon = false
                          }
                          if (item6.children) {
                            item6.children.forEach((item7, index7) => {
                              // typeIcon是控制设置出现与否
                              if (that.selectGroup.indexOf(item7.id) >= 0) {
                                item7.typeIcon = true
                              } else {
                                item7.typeIcon = false
                              }
                              if (item7.children) {
                                item7.children.forEach((item8, index8) => {
                                  // typeIcon是控制设置出现与否
                                  if (that.selectGroup.indexOf(item8.id) >= 0) {
                                    item8.typeIcon = true
                                  } else {
                                    item8.typeIcon = false
                                  }
                                  if (item8.children) {
                                    item8.children.forEach((item9, index9) => {
                                    // typeIcon是控制设置出现与否
                                      if (that.selectGroup.indexOf(item9.id) >= 0) {
                                        item9.typeIcon = true
                                      } else {
                                        item9.typeIcon = false
                                      }
                                    })
                                  }
                                })
                              }
                            })
                          }
                        })
                      }
                    })
                  }
                })
              })
            })
          })
        })
      },
      deep: true
    },
    changeStatus (val) {
      this.doIdentifying(this.$route, val)
    }
  },
  computed: {
    'number': function () {
      if (this.authField.remark) {
        return this.authField.remark.length
      } else {
        return 0
      }
    }
  },
  created () {
    this.roleId = this.$route.query.roleId
    this.condition = {
      orMatch: this.$route.query.orMatch,
      isEnable: this.$route.query.isEnable
    }
    this.doClearData()
  },
  activated () {
    this.docheckRefer(this.$route.query.roleId)
  },
  methods: {
    ...mapMutations([
      'closeTag'
    ]),
    // 初始化
    doClearData () {
      this.loading = true
      this.authField = {
        code: null,
        remark: null,
        name: null
      }
      this.allSelectIds = []
      this.selectGroup = []
      this.inputDisabledConfig = false
      this.disabledConfig = false
      this.getTreeAuth().then(data => {
        this.doLookDetails(this.roleId, data).then(res => {
          if (res === 'success') {
            this.changeStatus = false
            if (this.doFirstType) {
              this.doFirstType = false
              this.doFirstData()
            } else if (this.doPreType) {
              this.doPreType = false
              this.doPreData()
            } else if (this.doNextType) {
              this.doNextType = false
              this.doNextData(false)
            } else if (this.doLastType) {
              this.doLastType = false
              this.doLastData()
            } else if (this.doBacthDisableType) {
              this.doBacthDisableType = false
              this.doBacthDisable()
            } else if (this.doBacthUnDisableType) {
              this.doBacthUnDisableType = false
              this.doBacthUnDisable()
            } else if (this.doDeleteType) {
              this.doDeleteType = false
              this.doDelete()
            }
            this.doAuthStyle(0, this.allList[0])
            this.docheckRefer(this.roleId)
            if (this.isClose === true) {
              this.doContinueActions()
            }
          }
        })
      })
    },
    // 页面加载看是否被引用
    docheckRefer (data) {
      let reqdata = {
        roleId: data
      }
      this.$request.post('/financeback/sysRole/checkRefer', reqdata).then(response => {
        let { code } = response.data
        if (this.isEnableConfig === 0 && code === 10011) {
          // 已失效已被引用
          this.inputDisabledConfig = true
          this.disabledConfig = true
        }
        if (this.isEnableConfig === 0 && code === 200) {
          // 已失效效未被引用
          this.inputDisabledConfig = true
          this.disabledConfig = true
        }
        if (this.isEnableConfig === 1 && code === 10011) {
          // 已生效已被引用
          this.inputDisabledConfig = true
          this.disabledConfig = false
        }
        if (this.isEnableConfig === 1 && code === 200) {
          // 已生效未被引用
          this.inputDisabledConfig = false
          this.disabledConfig = false
        }
        if (this.isDel === 1) {
          // 已删除
          this.inputDisabledConfig = true
          this.disabledConfig = true
        }
      })
    },
    // 帮助信息提示
    helpHover () {
      this.isActive = true
    },
    loseHover () {
      this.isActive = false
    },
    alertClose () {
      this.alertShow = false
    },
    // 监控多行文本框的字数
    getWordNumber () {
      this.number = this.authField.remark.length
    },
    // 查找-弹出框取消
    findCancel () {
    },
    // 查找-通过字段查询
    doSearchAuth () {
      this.querySchemeList()
    },
    // 查找-打开
    doHeadFind () {
      this.findShow = true
      this.commParams.orMatch = ''
      this.querySchemeList()
    },
    // 列表-返回列表页
    doBackTable () {
      // this.roleId = null
      this.doLocationDetail('auth_index')
      // this.$router.push({ name: 'auth_index' })
    },
    // 查找-查询列表
    querySchemeList () {
      let reqdata = {
        page: {
          size: this.size,
          current: this.current
        }
      }
      reqdata.commParams = this.commParams
      this.$request.post('/financeback/sysRole/findPage', reqdata).then(response => {
        let { status, data } = response.data
        if (status === 'success') {
          this.total = data.total
          this.size = data.size
          this.current = data.current
          this.tableData = data.records
        }
      })
    },
    // 重置-重新请求roleId
    doReset () {
      this.doClearData()
    },
    // 监听数据变化
    doWatchData () {
      let reqdata = {
        roleId: this.roleId
      }
      return this.$request.post('/financeback/sysRole/findById', reqdata).then(response => {
        let { status, data } = response.data
        if (status === 'success') {
          let flag = 0
          this.allSelectIds = []
          let idsArr = [] // 通过当前roleId获取所有id
          this.allList.forEach(item => {
            this.doSetIndeterminate(item)
          })
          if (data.code) {
            if (data.code !== this.authField.code) {
              flag = 1
            }
          } else {
            if (this.authField.code) {
              flag = 1
            } else {
              flag = 0
            }
          }
          if (data.name) {
            if (data.name !== this.authField.name) {
              flag = 1
            }
          } else {
            if (this.authField.name) {
              flag = 1
            } else {
              flag = 0
            }
          }
          if (data.remark) {
            if (data.remark !== this.authField.remark) {
              flag = 1
            }
          } else {
            if (this.authField.remark) {
              flag = 1
            } else {
              flag = 0
            }
          }
          data.sysMenuList.forEach(item => {
            idsArr.push(item.menuId)
          })
          this.allSelectIds.forEach(item => {
            if (idsArr.indexOf(item.menuId) === -1) {
              flag = 1
            }
          })
          if (idsArr.length !== this.allSelectIds.length) {
            flag = 1
          }
          return flag
        }
      })
    },
    // 是，否，取消的方法
    doShowEditModal () {
      let that = this
      this.$Control({
        type: 'control',
        title: '消息提示',
        message: `当前数据已修改，需要保存吗？`,
        button: ['是', '否', '取消'],
        yes () {
          that.doDataChangeOk()
          that.$CloseCtl()
        },
        no () {
          that.doDataChangeNo()
          that.$CloseCtl()
        },
        cancel () {
          // that.doDataChangeCancel()
          that.$CloseCtl()
        }
      })
    },
    // 取消
    doCancel () {
      this.isClose = false
      if (this.changeStatus === true) {
        // this.reminderModal = true
        // this.doShowEditModal()
        let that = this
        this.$Control({
          type: 'confirm',
          title: '消息提示',
          message: `取消操作会重置当前表单，是否继续？`,
          button: ['确认', '取消'],
          yes () {
            that.doDataChangeNo()
            that.$CloseCtl()
          },
          cancel () {
            that.$CloseCtl()
          }
        })
      } else {
        this.doDataChangeNo()
      }
    },
    // input的on-change事件检测数据改变
    doChangeData () {
      this.changeStatus = true
      this.isClose = true
    },
    // 数据变化-modal框的是
    doDataChangeOk () {
      this.doSave('authField', 'save')
    },
    // 数据变化-modal框的否
    doDataChangeNo () {
      if (this.dataChangeFlag === 'copy') {
        this.$router.push({ name: 'create_auth', query: { roleId: this.roleId, isEnable: this.condition.isEnable, orMatch: this.condition.orMatch } })
      } else if (this.dataChangeFlag === 'create') {
        this.$router.push({ name: 'create_auth', query: { isEnable: this.condition.isEnable, orMatch: this.condition.orMatch } })
      } else {
        this.doClearData()
        this.reminderModal = false
        this.changeStatus = false
      }
    },
    // 复制-带roleId去新增页
    doCopy () {
      this.isClose = false
      if (this.changeStatus === true) {
        this.doShowEditModal()
        this.dataChangeFlag = 'copy'
      } else {
        this.$router.push({ name: 'create_auth', query: { roleId: this.roleId, isEnable: this.condition.isEnable, orMatch: this.condition.orMatch } })
      }
    },
    // 删除-跳下一个roleId
    doDelete () {
      this.isClose = false
      let that = this
      this.$Control({
        type: 'confirm',
        title: '消息提示',
        message: '注意：删除后将不可恢复！请确认是否要删除数据？',
        button: ['确认', '取消'],
        yes () {
          that.doModalDeleteOk()
          that.$CloseCtl()
        },
        cancel () {
          that.$CloseCtl()
        }
      })
    },
    // 删除modal里的确定
    doModalDeleteOk () {
      let reqdata = {}
      reqdata.roleIds = [this.roleId]
      if (this.inputDisabledConfig === true) {
        this.$Message.error('当前数据已使用，无法删除！')
        // this.deleteModalShow = false
      } else {
        this.$request.post('/financeback/sysRole/deleteEnterpriseBatch', reqdata).then(response => {
          let { status, data } = response.data
          if (status === 'success') {
            if (data.successList.length > 0) {
              this.$Message.success('删除成功! ')
              this.doNextData('delete')
            } else if (data.failList.length > 0) {
              this.$Message.error(data.failList[0].referenceDescription)
            }
          }
        })
      }
    },
    // 禁用-当页刷新
    doBacthDisable () {
      this.isClose = false
      if (this.changeStatus === true) {
        this.doClearData()
      }
      this.doModalDisableOk()
    },
    // 禁用modal里的确定
    doModalDisableOk () {
      let reqdata = {}
      reqdata.roleIds = [this.roleId]
      return this.$request.post('/financeback/sysRole/disableEnterpriseBatch', reqdata).then(response => {
        let { status, data } = response.data
        if (status === 'success') {
          if (data.successList.length > 0) {
            this.$Message.success('禁用成功! ')
            // this.disableModalShow = false
            return status
          } else if (data.failList.length > 0) {
            this.$Message.error(data.failList[0].referenceDescription)
          }
        }
      }).then((data) => {
        if (data === 'success') {
          this.doClearData()
        }
      })
    },
    // 反禁用-当页刷新
    doBacthUnDisable () {
      this.isClose = false
      if (this.changeStatus === true) {
        this.doClearData()
      }
      this.doModalUnDisableOk()
    },
    // 反禁用modal里的确定
    doModalUnDisableOk () {
      let reqdata = {}
      reqdata.roleIds = [this.roleId]
      return this.$request.post('/financeback/sysRole/enableEnterpriseBatch', reqdata).then(response => {
        let { status, data } = response.data
        if (status === 'success') {
          if (data.successList.length > 0) {
            this.$Message.success('反禁用成功! ')
            return status
          } else if (data.failList.length > 0) {
            this.$Message.error(data.failList[0].referenceDescription)
          }
        }
      }).then((data) => {
        if (data === 'success') {
          this.doClearData()
        }
      })
    },
    // 为上下首末而用的初始化
    doUpDownInit (dataId) {
      this.authField = {
        code: null,
        remark: null,
        name: null
      }
      this.allSelectIds = []
      this.selectGroup = []
      this.inputDisabledConfig = false
      this.disabledConfig = false
      this.getTreeAuth().then(data => {
        this.doLookDetails(dataId, data).then(res => {
          if (res === 'success') {
            this.docheckRefer(dataId)
            this.doAuthStyle(0, this.allList[0])
          }
        })
      })
    },
    // 上一条-查找上一条数据
    doPreData () {
      this.isClose = false
      if (this.changeStatus) {
        this.doShowEditModal()
        // this.reminderModal = true
        this.doPreType = true
      } else {
        let _num = this.doFindPage(2, this.$route.query.roleId)
        if (_num === '当前为首条') {
          return false
        } else {
          this.loading = true
          this.$router.push({ name: 'update_auth', query: { roleId: _num, isEnable: this.condition.isEnable, orMatch: this.condition.orMatch } })
          this.doUpDownInit(_num)
        }
      }
    },
    // 首条
    doFirstData () {
      this.isClose = false
      if (this.changeStatus) {
        this.doShowEditModal()
        this.doFirstType = true
      } else {
        let _num = this.doFindPage(1, this.$route.query.roleId)
        if (_num === '当前为首条') {
          return false
        } else {
          this.loading = true
          this.$router.push({ name: 'update_auth', query: { roleId: _num, isEnable: this.condition.isEnable, orMatch: this.condition.orMatch } })
          this.doUpDownInit(_num)
        }
      }
    },
    // 下一条-查询下一条数据
    doNextData (type) {
      this.isClose = false
      if (this.changeStatus) {
        this.doShowEditModal()
        this.doNextType = true
      } else {
        let _num = this.doFindPage(3, this.$route.query.roleId, type)
        if (_num === '当前为末条') {
          return false
        } else if (_num === '跳转') {
          setTimeout(() => {
            this.$Message.info('查看页面暂无数据，3秒后跳转到列表页')
          }, 1000)
          setTimeout(() => {
            this.closeTag({ route: this.$route })
          }, 3000)
        } else {
          this.loading = true
          this.$router.push({ name: 'update_auth', query: { roleId: _num, isEnable: this.condition.isEnable, orMatch: this.condition.orMatch } })
          this.doUpDownInit(_num)
        }
      }
    },
    // 末条
    doLastData () {
      this.isClose = false
      if (this.changeStatus) {
        this.doShowEditModal()
        this.doLastType = true
      } else {
        let _num = this.doFindPage(4, this.$route.query.roleId)
        if (_num === '当前为末条') {
          return false
        } else {
          this.loading = true
          this.$router.push({ name: 'update_auth', query: { roleId: _num, isEnable: this.condition.isEnable, orMatch: this.condition.orMatch } })
          this.doUpDownInit(_num)
        }
      }
    },
    // 新增-带参去新增页
    doGoCreatePage () {
      if (this.changeStatus === true) {
        this.doShowEditModal()
        // this.reminderModal = true
        this.dataChangeFlag = 'create'
      } else {
        this.$router.push({ name: 'create_auth', query: { isEnable: this.condition.isEnable, orMatch: this.condition.orMatch } })
      }
    },
    handleChangePage (pageNo) {
      this.current = pageNo
      this.querySchemeList()
    },
    // 改变每页数量
    changePageSize (e) {
      this.size = e
      this.querySchemeList()
    },
    // GO按钮跳转
    goElevatorPage (pageId) {
      let evtObj
      let thisPage = document.getElementById(pageId)
      let elevatorDiv = thisPage.getElementsByClassName('ivu-page-options-elevator')
      if (elevatorDiv && elevatorDiv.length > 0) {
        let pageInput = elevatorDiv[0].getElementsByTagName('input')[0]
        if (window.KeyEvent) { // firefox 浏览器下模拟事件
          evtObj = document.createEvent('KeyEvents')
          evtObj.initKeyEvent('keyup', true, true, window, true, false, false, false, 13, 0)
        } else { // chrome 浏览器下模拟事件
          evtObj = document.createEvent('UIEvents')
          evtObj.initUIEvent('keyup', true, true, window, 1)
          delete evtObj.keyCode
          if (typeof evtObj.keyCode === 'undefined') { // 为了模拟keycode
            Object.defineProperty(evtObj, 'keyCode', { value: 13 })
          } else {
            evtObj.key = String.fromCharCode(13)
          }
        }
        pageInput.dispatchEvent(evtObj)
      }
    },
    // 查找-列表行双击
    doClickColumn (data) {
      this.roleId = data.roleId
      this.doClearData()
      this.findShow = false
      this.$router.push({ name: 'update_auth', query: { roleId: this.roleId, isEnable: this.condition.isEnable, orMatch: this.condition.orMatch } })
    },
    // 查找-列表单击选择
    doSelect (row) {
      this.roleId = row.roleId
      this.doClearData()
      this.findShow = false
      this.$router.push({ name: 'update_auth', query: { roleId: this.roleId, isEnable: this.condition.isEnable, orMatch: this.condition.orMatch } })
    },
    // 创建前给总的树赋值indeterminate
    doSetAllList (item, IdsArr) {
      IdsArr.forEach(i => {
        if (i.menuId === item.id) {
          item.indeterminate = i.isHalf
        }
      })
      item.children.forEach(d => {
        this.doSetAllList(d, IdsArr)
      })
    },
    // 查看详情-通过roleId传参
    doLookDetails (roleId, allList) {
      let reqdata = {
        roleId: roleId
      }
      return this.$request.post('/financeback/sysRole/findById', reqdata).then(response => {
        let { status, data } = response.data
        if (status === 'success') {
          this.authField = {
            code: data.code,
            remark: data.remark,
            name: data.name,
            updatorName: data.updatorName,
            updateTime: this.$dayjs(data.updateTime).format('YYYY-MM-DD')
          }
          allList.forEach(tabItem => {
            this.doSetAllList(tabItem, data.sysMenuList)
          })
          this.isEnableConfig = data.isEnable
          this.isDel = data.isDel
        }
        return status
      })
    },
    // 保存-更新接口
    doCreateSaveConfig (idsArr) {
      this.saveLoading = true
      let reqdata = {
        roleId: this.roleId,
        name: this.authField.name,
        code: this.authField.code,
        remark: this.authField.remark
      }
      return this.$request.post('/financeback/sysRole/updateEnterprise', reqdata).then(response => {
        this.saveLoading = false
        let { status } = response.data
        if (status === 'success') {
          return status
        }
      }).then(response => {
        if (response === 'success') {
          let reqdata1 = {
            roleId: this.roleId,
            sysMenuList: idsArr
          }
          this.$request.post('/financeback/sysRole/assignEnterprise', reqdata1).then(response => {
            let { status } = response.data
            if (status === 'success') {
              this.doClearData()
              if (this.dataChangeFlag === 'copy') {
                this.$router.push({ name: 'create_auth', query: { roleId: this.roleId, isEnable: this.condition.isEnable, orMatch: this.condition.orMatch } })
              } else if (this.dataChangeFlag === 'create') {
                this.$router.push({ name: 'create_auth', query: { isEnable: this.condition.isEnable, orMatch: this.condition.orMatch } })
              } else {
                this.$Message.success('保存成功! ')
              }
            }
          })
        }
      })
    },
    // 通过id把indeterminate组成对象的递归
    doSetIndeterminate (item) {
      if (item.indeterminate === 0 || item.indeterminate === 1) {
        this.allSelectIds.push({
          menuId: item.id,
          isHalf: item.indeterminate
        })
      }
      item.children.forEach(i => {
        this.doSetIndeterminate(i)
      })
    },
    // 保存时查的关联用户
    doSearchUsers () {
      let reqdata = {
        page: {
          size: 0,
          current: 1
        },
        roleId: this.roleId
      }
      return this.$request.post('/financeback/sysUser/findRoleUserPage', reqdata).then(response => {
        let { status, data } = response.data
        if (status === 'success') {
          this.relationUsers = data.total
        }
        return status
      })
    },
    // 保存
    doSave (name, type) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.allSelectIds = []
          this.allList.forEach(item => {
            this.doSetIndeterminate(item)
          })
          if (this.allSelectIds.length <= 4) {
            this.$Message.error('岗位权限不能为空!')
          } else {
            this.doSearchUsers().then((data) => {
              if (data === 'success') {
                if (this.relationUsers > 0) {
                  let that = this
                  this.$Control({
                    type: 'confirm',
                    title: '消息提示',
                    message: '当前岗位权限保存更新将影响' + that.relationUsers + '位用户，请谨慎操作！',
                    button: ['确认', '取消'],
                    yes () {
                      that.doRelationUsersOk()
                      that.$CloseCtl()
                    },
                    cancel () {
                      that.$CloseCtl()
                    }
                  })
                } else {
                  this.doRelationUsersOk()
                }
                this.relationUserConfig = type
              }
            })
          }
        } else {
          this.$Message.error('必填项不能为空！')
        }
      })
    },
    // 保存关联用户的modal
    doRelationUsersOk () {
      this.doCreateSaveConfig(this.allSelectIds)
    },
    // 转换格式
    treeFormat (data) {
      let that = this
      const result = []
      data.forEach(function (item) {
        let {
          name,
          menuId: id,
          sysMenuList: children,
          isDefaultSelect,
          isHalf: indeterminate
        } = item
        if (children) {
          children = that.treeFormat(children)
        }
        result.push({
          name,
          id,
          children,
          isDefaultSelect,
          indeterminate
        })
      })
      return result
    },
    // 查树形图
    getTreeAuth () {
      let reqdata = {
        menuParentId: ''
      }
      return this.$request.post('/financeback/sysMenu/findTree', reqdata).then(response => {
        let { status, data } = response.data
        if (status === 'success') {
          this.allList = this.treeFormat(data)
          return this.allList
        }
      })
    },
    // group组change事件
    doSelectGroupChange (data) {
      this.changeStatus = true
      this.isClose = true
    },
    // 菜单全选的递归
    doSetAll (item, value) {
      item.indeterminate = value
      if (value === 0) {
        this.selectGroup.push(item.id)
      }
      item.children.forEach(i => {
        this.doSetAll(i, value)
      })
    },
    // 菜单名称头部全选
    doCheckMenuAll () {
      this.changeStatus = true
      if ((this.menuIndeterminate === false && this.checkMenuAll === true) || (this.menuIndeterminate === true && this.checkMenuAll === false)) {
        // 全选
        this.selectGroup = []
        this.doSetAll(this.treeList[0], null)
      } else {
        // 全不选
        this.doSetAll(this.treeList[0], 0)
      }
    },
    // 高级设置的弹出框出现
    doHighSet (data) {
      let that = this
      this.highSetTitle = data.name
      this.highSetShow = true
      this.treeList.forEach(function (item1, index1) {
        item1.children.forEach(function (item2, index2) {
          item2.children.forEach(function (item3, index3) {
            item3.children.forEach(function (item4, index4) {
              item4.children.forEach(function (item5, index5) {
                if (item5.children && item5.children.length > 0) {
                  if (item5.id === data.id) {
                    that.highSetShow1 = true
                    that.highSetShow2 = false
                    that.highSetShow3 = false
                    that.highSetShow4 = false
                    that.highSetTitle1 = data.name
                    that.highSetData1 = data
                  }
                  item5.children.forEach(function (item6, index6) {
                    if (item6.children && item6.children.length > 0) {
                      if (item6.id === data.id) {
                        that.highSetShow1 = false
                        that.highSetShow2 = true
                        that.highSetShow3 = false
                        that.highSetShow4 = false
                        that.highSetTitle2 = data.name
                        that.highSetData2 = data
                      }
                      item6.children.forEach(function (item7, index7) {
                        if (item7.children && item7.children.length > 0) {
                          if (item7.id === data.id) {
                            that.highSetShow1 = false
                            that.highSetShow2 = false
                            that.highSetShow3 = true
                            that.highSetShow4 = false
                            that.highSetTitle3 = data.name
                            that.highSetData3 = data
                          }
                          item7.children.forEach(function (item8, index8) {
                            if (item8.children && item8.children.length > 0) {
                              if (item8.id === data.id) {
                                that.highSetShow1 = false
                                that.highSetShow2 = false
                                that.highSetShow3 = false
                                that.highSetShow4 = true
                                that.highSetTitle4 = data.name
                                that.highSetData4 = data
                              }
                              item8.children.forEach(function (item9, index9) {
                              })
                            }
                          })
                        }
                      })
                    }
                  })
                }
              })
            })
          })
        })
      })
    },
    // 返回上一级
    doUpLevel2 () {
      this.highSetShow1 = true
      this.highSetShow2 = false
      this.highSetShow3 = false
      this.highSetShow4 = false
    },
    doUpLevel3 () {
      this.highSetShow1 = false
      this.highSetShow2 = true
      this.highSetShow3 = false
      this.highSetShow4 = false
    },
    doUpLevel4 () {
      this.highSetShow1 = false
      this.highSetShow2 = false
      this.highSetShow3 = true
      this.highSetShow4 = false
    },
    // 通过当前的对象获取之前的对象
    getSelectItem (data) {
      let selectItem = []
      this.treeList.forEach((item1) => {
        if (item1.id === data.id) {
          selectItem.push(item1)
          return
        }
        item1.children.forEach((item2) => {
          if (item2.id === data.id) {
            selectItem.push(item1)
            selectItem.push(item2)
            return
          }
          item2.children.forEach((item3) => {
            if (item3.id === data.id) {
              selectItem.push(item1)
              selectItem.push(item2)
              selectItem.push(item3)
              return
            }
            item3.children.forEach((item4) => {
              if (item4.id === data.id) {
                selectItem.push(item1)
                selectItem.push(item2)
                selectItem.push(item3)
                selectItem.push(item4)
                return
              }
              if (item4.children) {
                item4.children.forEach((item5) => {
                  if (item5.id === data.id) {
                    selectItem.push(item1)
                    selectItem.push(item2)
                    selectItem.push(item3)
                    selectItem.push(item4)
                    selectItem.push(item5)
                    return
                  }
                  if (item5.children) {
                    item5.children.forEach((item6) => {
                      if (item6.id === data.id) {
                        selectItem.push(item1)
                        selectItem.push(item2)
                        selectItem.push(item3)
                        selectItem.push(item4)
                        selectItem.push(item5)
                        selectItem.push(item6)
                        return
                      }
                      if (item6.children) {
                        item6.children.forEach((item7) => {
                          if (item7.id === data.id) {
                            selectItem.push(item1)
                            selectItem.push(item2)
                            selectItem.push(item3)
                            selectItem.push(item4)
                            selectItem.push(item5)
                            selectItem.push(item6)
                            selectItem.push(item7)
                            return
                          }
                          if (item7.children) {
                            item7.children.forEach((item8) => {
                              if (item8.id === data.id) {
                                selectItem.push(item1)
                                selectItem.push(item2)
                                selectItem.push(item3)
                                selectItem.push(item4)
                                selectItem.push(item5)
                                selectItem.push(item6)
                                selectItem.push(item7)
                                selectItem.push(item8)
                              }
                            })
                          }
                        })
                      }
                    })
                  }
                })
              }
            })
          })
        })
      })
      this.selectItemArr = selectItem
    },
    // 往左扫描的封装
    doleft (Item) {
      let that = this
      let authFlag1 = 0
      let authFlag2 = 0
      let authFlag3 = 0
      if (Item.children) {
        Item.children.forEach((item) => {
          if (item.indeterminate === 1) {
            // 半选
            authFlag1 = 1
          }
          if (item.indeterminate === null) {
            // 一个不选
            authFlag2 = 1
          }
          if (item.indeterminate === 0) {
            // 一个全选
            authFlag3 = 1
          }
        })
      }
      if (authFlag3 === 0 && authFlag2 === 1 && authFlag1 === 0) {
        // 全不选
        Item.indeterminate = null
        this.selectGroup = [...new Set(this.selectGroup)]
        if (that.selectGroup.indexOf(Item.id) >= 0) {
          that.selectGroup.splice(that.selectGroup.indexOf(Item.id), 1)
        }
      }
      if (authFlag3 === 1 && authFlag2 === 0 && authFlag1 === 0) {
        // 都是全选
        Item.indeterminate = 0
        this.selectGroup = [...new Set(this.selectGroup)]
        this.selectGroup.push(Item.id)
      }
      if (authFlag3 === 1 && authFlag2 === 1 && authFlag1 === 0) {
        // 有全选和全不选但没有半选
        Item.indeterminate = 1
        this.selectGroup = [...new Set(this.selectGroup)]
        this.selectGroup.push(Item.id)
      }
      if (authFlag3 === 1 && authFlag2 === 0 && authFlag1 === 1) {
        // 有全选和半选但没有全不选
        Item.indeterminate = 1
        this.selectGroup = [...new Set(this.selectGroup)]
        this.selectGroup.push(Item.id)
      }
      if (authFlag3 === 0 && authFlag2 === 1 && authFlag1 === 1) {
        // 有全不选和半选但没有全选
        Item.indeterminate = 1
        this.selectGroup = [...new Set(this.selectGroup)]
        this.selectGroup.push(Item.id)
      }
      if (authFlag3 === 0 && authFlag2 === 0 && authFlag1 === 1) {
        // 只有一个半选但没有全选和全不选
        Item.indeterminate = 1
        this.selectGroup = [...new Set(this.selectGroup)]
        this.selectGroup.push(Item.id)
      }
      if (authFlag3 === 1 && authFlag2 === 1 && authFlag1 === 1) {
        // 有半选全选和全不选
        Item.indeterminate = 1
        this.selectGroup = [...new Set(this.selectGroup)]
        this.selectGroup.push(Item.id)
      }
    },
    // 删除后面所有的id的递归
    doDeleteRightAll (item) {
      item.children.forEach(i => {
        i.indeterminate = null
        this.selectGroup.splice(this.selectGroup.indexOf(i.id), 1)
        this.doDeleteRightAll(i)
      })
    },
    // 全选后面所有的id的递归
    doSelectRightAll (item) {
      item.children.forEach(i => {
        i.indeterminate = 0
        this.selectGroup.push(i.id)
        this.doSelectRightAll(i)
      })
    },
    // 往右点击的全选/全删的封装
    doRight (Item) {
      let that = this
      if (that.selectGroup.indexOf(Item.id) >= 0) {
        Item.children.forEach((item1, index1) => {
          if (that.selectGroup.indexOf(item1.id) >= 0) {
            item1.indeterminate = null
            that.selectGroup.splice(that.selectGroup.indexOf(item1.id), 1)
          }
          if (item1.children && item1.children.length > 0) {
            item1.children.forEach((item2, index2) => {
              if (that.selectGroup.indexOf(item2.id) >= 0) {
                item2.indeterminate = null
                that.selectGroup.splice(that.selectGroup.indexOf(item2.id), 1)
              }
              if (item2.children && item2.children.length > 0) {
                item2.children.forEach((item3, index3) => {
                  if (that.selectGroup.indexOf(item3.id) >= 0) {
                    item3.indeterminate = null
                    that.selectGroup.splice(that.selectGroup.indexOf(item3.id), 1)
                  }
                  if (item3.children && item3.children.length > 0) {
                    item3.children.forEach((item4, index4) => {
                      if (that.selectGroup.indexOf(item4.id) >= 0) {
                        item4.indeterminate = null
                        that.selectGroup.splice(that.selectGroup.indexOf(item4.id), 1)
                      }
                      if (item4.children && item4.children.length > 0) {
                        item4.children.forEach((item5, index5) => {
                          if (that.selectGroup.indexOf(item5.id) >= 0) {
                            item5.indeterminate = null
                            that.selectGroup.splice(that.selectGroup.indexOf(item5.id), 1)
                          }
                          if (item5.children && item5.children.length > 0) {
                            item5.children.forEach((item6, index6) => {
                              if (that.selectGroup.indexOf(item6.id) >= 0) {
                                item6.indeterminate = null
                                that.selectGroup.splice(that.selectGroup.indexOf(item6.id), 1)
                              }
                            })
                          }
                        })
                      }
                    })
                  }
                })
              }
            })
          }
        })
      } else {
        Item.children.forEach((item1, index1) => {
          item1.indeterminate = 0
          that.selectGroup.push(item1.id)
          if (item1.children && item1.children.length > 0) {
            item1.children.forEach((item2, index2) => {
              item2.indeterminate = 0
              that.selectGroup.push(item2.id)
              if (item2.children && item2.children.length > 0) {
                item2.children.forEach((item3, index3) => {
                  item3.indeterminate = 0
                  that.selectGroup.push(item3.id)
                  if (item3.children && item3.children.length > 0) {
                    item3.children.forEach((item4, index4) => {
                      item4.indeterminate = 0
                      that.selectGroup.push(item4.id)
                      if (item4.children && item4.children.length > 0) {
                        item4.children.forEach((item5, index5) => {
                          item5.indeterminate = 0
                          that.selectGroup.push(item5.id)
                          if (item5.children && item5.children.length > 0) {
                            item5.children.forEach((item6, index6) => {
                              item6.indeterminate = 0
                              that.selectGroup.push(item6.id)
                            })
                          }
                        })
                      }
                    })
                  }
                })
              }
            })
          }
        })
      }
    },
    // 一级菜单点击
    doClickFirstMenu (firstItem, preItem, type) {
      if (type === 'left') {
        this.doleft(firstItem)
      }
    },
    // 二级菜单点击
    doClickSecondMenu (secondItem, firstItem, type) {
      if (type === 'left') {
        this.doleft(secondItem)
        this.getSelectItem(firstItem)
        this.doClickFirstMenu(this.selectItemArr[0], {}, 'left')
      }
    },
    // 三级菜单点击
    doClickMenu (tirdItem, secondItem, type) {
      let that = this
      if (type === 'left') {
        this.doleft(tirdItem)
        this.getSelectItem(secondItem)
        this.doClickSecondMenu(this.selectItemArr[1], this.selectItemArr[0], 'left')
      } else if (type === 'right') {
        if (that.selectGroup.indexOf(tirdItem.id) >= 0) {
          // 三级菜单全不选
          tirdItem.indeterminate = null
        } else {
          // 三级菜单全选
          tirdItem.indeterminate = 0
        }
        this.getSelectItem(secondItem)
        this.doClickSecondMenu(this.selectItemArr[1], this.selectItemArr[0], 'left')
        this.doRight(tirdItem)
      }
    },
    // 四级权限组点击
    doClickAuthGroup (fourItem, tirdItem, type) {
      let that = this
      if (type === 'left') {
        this.doleft(fourItem)
        this.getSelectItem(tirdItem)
        this.doClickMenu(this.selectItemArr[2], this.selectItemArr[1], 'left')
      } else if (type === 'right') {
        if (that.selectGroup.indexOf(fourItem.id) >= 0) {
          // 四级菜单全不选
          fourItem.indeterminate = null
        } else {
          // 四级菜单全选
          fourItem.indeterminate = 0
        }
        this.getSelectItem(tirdItem)
        this.doClickMenu(this.selectItemArr[2], this.selectItemArr[1], 'left')
        this.doRight(fourItem)
      }
    },
    // 五级权限点击
    doClickFiveAuth (fiveItem, fourItem, type) {
      let that = this
      if (type === 'left') {
        this.doleft(fiveItem)
        this.getSelectItem(fourItem)
        this.doClickAuthGroup(this.selectItemArr[3], this.selectItemArr[2], 'left')
      } else if (type === 'right') {
        if (fourItem.children) {
          fourItem.children.forEach((item) => {
            if (item.isDefaultSelect === 1) {
              this.selectGroup.push(item.id)
              item.indeterminate = 0
            }
          })
          this.selectGroup = [...new Set(this.selectGroup)]
        }
        if (that.selectGroup.indexOf(fiveItem.id) >= 0) {
          // 权限全不选
          fiveItem.indeterminate = null
        } else {
          // 权限全选
          fiveItem.indeterminate = 0
        }
        this.getSelectItem(fourItem)
        this.doClickAuthGroup(this.selectItemArr[3], this.selectItemArr[2], 'left')
        this.doRight(fiveItem)
      }
    },
    // 点击第一个弹出框
    doClickSixAuth (sixItem, fiveItem, type) {
      let that = this
      if (type === 'left') {
        this.doleft(sixItem)
        this.getSelectItem(fiveItem)
        this.doClickFiveAuth(this.selectItemArr[4], this.selectItemArr[3], 'left')
      } else if (type === 'right') {
        if (fiveItem.children) {
          fiveItem.children.forEach((item) => {
            if (item.isDefaultSelect === 1) {
              this.selectGroup.push(item.id)
              item.indeterminate = 0
            }
          })
          this.selectGroup = [...new Set(this.selectGroup)]
        }
        if (that.selectGroup.indexOf(sixItem.id) >= 0) {
          // 权限全不选
          sixItem.indeterminate = null
        } else {
          // 权限全选
          sixItem.indeterminate = 0
        }
        this.getSelectItem(fiveItem)
        this.doClickFiveAuth(this.selectItemArr[4], this.selectItemArr[3], 'left')
        this.doRight(sixItem)
      }
    },
    // 点击第二个弹出框
    doClickSevenAuth (sevenItem, sixItem, type) {
      let that = this
      if (type === 'left') {
        this.doleft(sevenItem)
        this.getSelectItem(sixItem)
        this.doClickSixAuth(this.selectItemArr[5], this.selectItemArr[4], 'left')
      } else if (type === 'right') {
        if (sixItem.children) {
          sixItem.children.forEach((item) => {
            if (item.isDefaultSelect === 1) {
              this.selectGroup.push(item.id)
              item.indeterminate = 0
            }
          })
          this.selectGroup = [...new Set(this.selectGroup)]
        }
        if (that.selectGroup.indexOf(sevenItem.id) >= 0) {
          // 权限全不选
          sevenItem.indeterminate = null
        } else {
          // 权限全选
          sevenItem.indeterminate = 0
        }
        this.getSelectItem(sixItem)
        this.doClickSixAuth(this.selectItemArr[5], this.selectItemArr[4], 'left')
        this.doRight(sevenItem)
      }
    },
    // 点击第三个弹出框
    doClickEightAuth (eightItem, sevenItem, type) {
      let that = this
      if (type === 'left') {
        this.doleft(eightItem)
        this.getSelectItem(sevenItem)
        this.doClickSevenAuth(this.selectItemArr[6], this.selectItemArr[5], 'left')
      } else if (type === 'right') {
        if (sevenItem.children) {
          sevenItem.children.forEach((item) => {
            if (item.isDefaultSelect === 1) {
              this.selectGroup.push(item.id)
              item.indeterminate = 0
            }
          })
          this.selectGroup = [...new Set(this.selectGroup)]
        }
        if (that.selectGroup.indexOf(eightItem.id) >= 0) {
          // 权限全不选
          eightItem.indeterminate = null
        } else {
          // 权限全选
          eightItem.indeterminate = 0
        }
        this.getSelectItem(sevenItem)
        this.doClickSevenAuth(this.selectItemArr[6], this.selectItemArr[5], 'left')
        this.doRight(eightItem)
      }
    },
    // 点击第四个弹出框
    doClickNineAuth (nineItem, eightItem, type) {
      let that = this
      if (type === 'left') {
        this.doleft(nineItem)
        this.getSelectItem(eightItem)
        this.doClickEightAuth(this.selectItemArr[7], this.selectItemArr[6], 'left')
      } else if (type === 'right') {
        if (eightItem.children) {
          eightItem.children.forEach((item) => {
            if (item.isDefaultSelect === 1) {
              this.selectGroup.push(item.id)
              item.indeterminate = 0
            }
          })
          this.selectGroup = [...new Set(this.selectGroup)]
        }
        if (that.selectGroup.indexOf(nineItem.id) >= 0) {
          // 权限全不选
          nineItem.indeterminate = null
        } else {
          // 权限全选
          nineItem.indeterminate = 0
        }
        this.getSelectItem(eightItem)
        this.doClickEightAuth(this.selectItemArr[7], this.selectItemArr[6], 'left')
        this.doRight(nineItem)
      }
    },
    // 得到当前的selectGroup的值的递归
    getSelectId (item) {
      this.selectGroup = [...new Set(this.selectGroup)]
      if (item.indeterminate === 0 || item.indeterminate === 1) {
        this.selectGroup.push(item.id)
      }
      item.children.forEach(i => {
        this.getSelectId(i)
      })
    },
    // 切换tab
    doAuthStyle (index, data) {
      this.treeList = [data]
      this.selectGroup = []
      setTimeout(() => {
        this.getSelectId(this.treeList[0])
      }, 0)
      let pList = document.querySelectorAll('.create-auth-tabList>li>p')
      pList.forEach(function (item) {
        item.classList.remove('activeAuth')
      })
      pList[index].classList.add('activeAuth')
      this.loading = false
    }
  }
}
</script>

<style lang="less">
@import "../../../assets/css/base.less";
@import "../../../assets/css/forminit.less";
@import "../business/title.less";
.update-auth {
  .auth-height{
    height: 580px;
    overflow-y: auto;
  }
  .ivu-col-span-22{
    padding-left: 3px;
  }
  .page-content{
    padding:16px 16px;
  }
  .company_alert{
      position: absolute;
      z-index: 100;
      width: 100%;
      font-size: 14px;
      .icon_warn{
        font-size: 16px !important;
      }
    }
  .success_color{
    color: #00A497;
    background-color: #E5F9F7;
  }
  .error_color{
    color: #F92424;
    background-color: #FFECEB;
  }
  .create-auth-tabList {
    height: 580px;
    background:rgba(245,246,246,1);
    width: 83%;
    margin-left: 10%;
    box-sizing: border-box;
    padding-top: 19px;
    .tabList-li {
      height: 34px;
      cursor: pointer;
      p {
        box-sizing: border-box;
        height: 14px;
        line-height: 14px;
        padding-left: 17px;
      }
    }
  }
  .ivu-form .ivu-form-item-label {
    padding: 10px 8px 10px 0;
  }
  .form_init .ivu-form-item .ivu-form-item-content .input_width .ivu-input{
    max-width:100%;
  }
  .auth-mainTab{
    .setIcon-yellow{
      color:#FFA552;
      font-size: 14px !important;
    }
    .setIcon-gray{
      color:#ccc;
      font-size: 14px !important;
    }
    .auth-mainTab-head{
      display: flex;
      height:36px;
      width: 99%;
      align-items: center;
      background:rgba(245,246,246,1);
      border-bottom: 1px solid rgba(221,221,221,1);
      border-left: 1px solid rgba(221,221,221,1);
      border-top: 1px solid rgba(221,221,221,1);
      .auth-mainTab-head-row{
        width: 13%;
        border-right: 1px solid rgba(221,221,221,1);
        height:36px;
        display: flex;
        align-items: center;
        padding-left: 15px;
      }
      .auth-mainTab-head-row2{
        width: 61%;
        border-right: 1px solid rgba(221,221,221,1);
        height:36px;
        display: flex;
        align-items: center;
        padding-left: 15px;
      }
    }
    .auth-mainTab-content{
      .auth-mainTab-flex{
        display: flex;
      }
      .auth-mainTab-content-line1{
        display: flex;
        width: 12.9%;
        align-items: center;
        border-right: 1px solid rgba(221,221,221,1);
        border-left: 1px solid rgba(221,221,221,1);
        border-bottom: 1px solid rgba(221,221,221,1);
        padding-left: 15px;
      }
      .auth-mainTab-content-line-parent1{
        width: 86.1%;
      }
      .auth-mainTab-content-line2{
        display: flex;
        width:14.95%;
        align-items: center;
        border-right: 1px solid rgba(221,221,221,1);
        border-bottom: 1px solid rgba(221,221,221,1);
        padding-left: 15px;
      }
      .auth-mainTab-content-line-parent2{
        width:85.05%;
        border-right: 1px solid rgba(221,221,221,1);
      }
      .auth-mainTab-content-line3{
        display: flex;
        width:17.6%;
        align-items: center;
        border-right: 1px solid rgba(221,221,221,1);
        border-bottom: 1px solid rgba(221,221,221,1);
        padding-left: 15px;
      }
      .auth-mainTab-content-line4{
        width: 82.4%;
        border-bottom: 1px solid rgba(221,221,221,1);
        .auth-mainTab-content-auth{
          display: inline-block !important;
          width: 105px;
          height: 30px;
          padding-top: 6px;
          padding-left: 15px;
          display: flex;
          align-self: center;
        }
      }
      .ivu-checkbox{
        margin-right: 4px;
      }
      .ivu-checkbox-wrapper{
        margin-right: 4px;
      }
    }
  }
  .page-content{
      // margin-top: 30px !important;
      .area-input{
        .area-word{
          position: absolute;
          right: 15px;
          bottom: 0;
        }
      }
      .ivu-form{
        .ivu-form-item-error-tip{
          display: none;
        }
        .my_poptip{
          position: absolute;
          right: -15px;
          z-index: 200;
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
          .icon_help{
            font-size: 16px;
          }
          .icon_help_nofocus{
            color: #d7d7d7;
          }
          .icon_help_focus{
            color: @warning ;
          }
        }
      }
      .retrieval_inf{
        position: absolute;
        right: -90px;
        cursor: pointer;
      }
    }
  .demo-spin-icon-load{
    animation: ani-demo-spin 1s linear infinite;
  }
}
</style>
