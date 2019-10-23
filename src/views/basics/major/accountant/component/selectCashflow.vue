<template>
  <div>
    <radio-select :config="cashflow_config" v-model="cashflowValue"
    @getData="doGetCashFlow"
    class="select-cashflow"
    :reset="cashflow_config.refresh"
    @on-close="doReset"
    :disabled="disabled">
      <div slot="header">
        <Row :gutter="10" class="no-error-modal">
          <Col span="4">
            <Select v-model="cashFlowState.value" @on-change="doStateChange" disabled>
              <Option value="all" label="全部数据状态" >全部数据状态</Option>
              <Option v-for="item in cashFlowState.options" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </Col>
          <Col span="4">
            <Select v-model="cashFlowTpye.value" @on-change="doTypeChange">
              <Option value="all" label="全部分组" >全部分组</Option>
              <Option v-for="item in cashFlowTpye.options" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </Col>
          <Col span="4">
            <Select v-model="cashFlowDirection.value" @on-change="doDirectionChange" disabled>
              <Option value="all" label="全部方向" >全部方向</Option>
              <Option v-for="item in cashFlowDirection.options" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </Col>
          <Col span="8">
            <Input class="search-button" v-model="cashFlowCodeOrName" @on-change="doCodeOrNameChange" @on-enter="doCodeOrNameEnter" placeholder="现金流量项目编码/名称" clearable>
              <Button slot="append" icon="ios-search" @click="doCodeOrNameEnter"></Button>
            </Input>
          </Col>
          <Col span="1">
            <Button @click="doReset">重置</Button>
          </Col>
        </Row>
      </div>
    </radio-select>
  </div>
</template>
<script>
import RadioSelect from '_c/radio-select'
export default {
  name: 'SelectCashflowModal',
  components: {
    RadioSelect
  },
  props: {
    defaultValue: {
      type: String
    },
    cashFlowId: {
      type: Number
    },
    disabled: {
      type: Boolean,
      default: false
    },
    state: {
      type: String,
      default: 'all'
    },
    direction: {
      type: String,
      default: 'all'
    },
    group: {
      type: String,
      default: 'all'
    },
    requestGroup: {
      type: Boolean,
      default: true
    },
    groupData: {
      type: Array,
      default: () => []
    }
  },
  watch: {
    defaultValue (val) {
      this.$set(this, 'cashflowValue', val)
      console.log(val)
    }
  },
  data () {
    return {
      // 转一下，防止返回中文
      cashflowValue: this.defaultValue,
      // 查询条件-编码或名称
      cashFlowCodeOrName: '',
      cashFlowState: { // 查询条件-数据状态类型
        value: this.state,
        options: [
          {
            value: '1',
            label: '已生效'
          },
          {
            value: '0',
            label: '已失效'
          }
        ]
      },
      cashFlowTpye: { // 查询条件-流量分组类型
        value: this.group,
        options: []
      },
      cashFlowDirection: { // 查询条件-流量方向
        value: this.direction,
        options: [
          {
            value: '1',
            label: '现金流入'
          },
          {
            value: '0',
            label: '现金流出'
          }
        ]
      },
      cashflow_config: { // 单选组件配置
        type: 'cashflow',
        title: '选择现金流量项目',
        refresh: false,
        width: '100%',
        request_params: {
          cashFlowId: null,
          isEnable: 1,
          isFinal: 1,
          cashFlowGroup: null,
          cashFlowDirection: this.direction,
          codeOrName: ''
        }
      }
    }
  },
  methods: {
    /**
     * 状态发生变化时触发
     */
    doStateChange (val) {
      this.cashflow_config.request_params.isEnable = val === 'all' ? null : val
      this.cashflow_config.refresh = !this.cashflow_config.refresh
    },
    /**
     * 类型发生变化时触发
     */
    doTypeChange (val) {
      this.cashflow_config.request_params.cashFlowGroup = val === 'all' ? null : val
      this.cashflow_config.refresh = !this.cashflow_config.refresh
    },
    /**
     * 方向发生变化时触发
     */
    doDirectionChange (val) {
      this.cashflow_config.request_params.cashFlowDirection = val === 'all' ? null : val
      this.cashflow_config.refresh = !this.cashflow_config.refresh
    },
    /**
     * 清空时触发
     */
    doCodeOrNameChange (val) {
      if (this.cashFlowCodeOrName) { return }
      this.doCodeOrNameEnter()
    },
    /**
     * enter触发
     */
    doCodeOrNameEnter () {
      this.cashflow_config.request_params.codeOrName = this.cashFlowCodeOrName
      this.cashflow_config.refresh = !this.cashflow_config.refresh
    },
    /**
     * 重置
     */
    doReset () {
      this.cashflow_config.request_params = { // 单选组件配置
        cashFlowId: null,
        codeOrName: '',
        isEnable: 1,
        isFinal: 1,
        cashFlowGroup: null,
        cashFlowDirection: this.direction
      }
      this.cashFlowCodeOrName = ''
      this.cashFlowDirection.value = 'all'
      this.cashFlowTpye.value = 'all'
      this.cashflow_config.refresh = !this.cashflow_config.refresh
    },
    /**
     * radio监听函数
     */
    doGetCashFlow (val, item) {
      this.$emit('getCashFlow', item)
    },
    /**
     * 请求分组信息
     */
    doGetGroup () {
      this.$request.post('/financeback/cashFlowItem/findGroup', { cashFlowId: this.cashFlowId }).then(({ status, data }) => {
        if (status === 200 && data.code === 200) {
          data.data.filter(item => item.cashFlowGroupName).forEach(item => {
            this.cashFlowTpye.options.push({
              value: item.cashFlowGroup,
              label: item.cashFlowGroupName
            })
          })
          this.$emit('getGroup', this.cashFlowTpye.options)
        }
      })
    }
  },
  mounted () {
    this.requestGroup ? this.doGetGroup() : this.$set(this.cashFlowTpye, 'options', this.groupData)
  }
}
</script>
