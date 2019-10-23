<template>
  <div class="drop-down-multi-select">
<!--    <Poptip trigger="hover" placement="right-start">-->
      <Select
        @on-change="showTitleText"
        @on-query-change="clearEnableList"
        v-model="comSelectedList"
        multiple filterable remote
        :remote-method="findEnableComList"
        :max-tag-count="0"
        :max-tag-placeholder="maxTagPlaceholder"
        placeholder="公司编码或名称">
        <Option v-for="(item, index) in comEnableList" :value="item.value" :key="index">{{ item.label }}</Option>
      </Select>
      <Icon class="select-icon" type="md-more" size="20" @click="doShowModal('company')"></Icon>
<!--      <div slot="content" style="max-height: 200px">-->
<!--        <p v-for="item in comSelectedList" :value="item" :key="item">{{item}}</p>-->
<!--      </div>-->
<!--    </Poptip>-->
    <company-user-modal @modalClose="doShowModal('company')" @selectCompany="doGetDataList" :assignModal="companyShow" :comSelectedList="comSelectedList" titleName="选择公司"></company-user-modal>
  </div>
</template>

<script>
import companyUserModal from '@/components/companyUserModal'
export default {
  components: {
    companyUserModal
  },
  data () {
    return {
      queryStr: '',
      companyShow: false,
      comSelectedList: [],
      comEnableList: []
    }
  },
  methods: {
    findEnableComList (query) {
      // console.log('方法')
      this.queryStr = query
      let _reqParam = {
        codeOrName: query,
        page: {
          size: 1000,
          current: 1
        }
      }
      this.$request.post('/financeback/company/findCompanyPage', _reqParam).then(res => {
        let { status, data } = res.data
        if (status === 'success') {
          let _list = data.records
          this.comEnableList = _list.map(item => {
            return {
              label: item.name,
              value: item.id
            }
          })
        }
      })
    },
    clearEnableList (query) {
      // console.log('事件')
      // console.log(query)
      // console.log(this.comSelectedList.length)
      if (!query && this.comSelectedList.length === 0) {
        this.comEnableList = []
      }
      if (query && this.queryStr === query) {
        this.findEnableComList(query)
      }
    },
    showTitleText (list) {
      // console.log(JSON.stringify(list))
      if (list.length === 0) {
        this.comEnableList = []
      }
      this.$emit('getComIdList', this.comSelectedList)
    },
    maxTagPlaceholder (num) {
      return `已选择${num}家公司`
    },
    doShowModal (type) {
      this[`${type}Show`] = !this[`${type}Show`]
    },
    doGetDataList (list) {
      if (list.length !== 0) {
        let _list = []
        this.comEnableList = list.map(item => {
          return {
            label: item.name,
            value: item.id
          }
        })
        this.comEnableList.forEach(item2 => {
          _list.push(item2.value)
        })
        this.comSelectedList = _list
        this.$emit('getComIdList', this.comSelectedList)
      }
    }
  }
}

</script>

<style lang="less" scoped>
  .drop-down-multi-select {
    .select-icon {
      position: absolute;
      top: 16px;
      right: 10px;
    }
  }
</style>
