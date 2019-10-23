  <template>
  <div class="drop-down-multi-select">
    <Select
      v-model="comSelectedList"
      @on-change="showTitleText"
      @on-query-change="realTimeQuery"
      multiple filterable remote
      :remote-method="findEnableComList"
      :max-tag-count="0"
      :max-tag-placeholder="maxTagPlaceholder"
      :title="titleTextList"
      placeholder="公司编码或名称">
      <Option v-for="(item, index) in comEnableList" :value="item.value" :key="index">{{ item.label }}</Option>
    </Select>
    <Icon class="select-icon" type="md-more" size="20" @click="doShowModal('company')"></Icon>
    <multi-select-modal
      @modalClose="doShowModal"
      @selectCompany="doGetDataList"
      :assignModal="companyShow"
      :comSelectedList="comSelectedList"
      :allCompany="allDataList"
      titleName="选择公司"
    ></multi-select-modal>
  </div>
</template>

<script>
import multiSelectModal from '@/components/multi-select-modal'
export default {
  name: 'dropDownMultiSelect',
  components: {
    multiSelectModal
  },
  props: {
    clear: {
      type: Boolean,
      default: false
    },
    codeList: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      queryStr: '',
      codeListCopy: '',
      companyShow: false,
      comSelectedList: [],
      comEnableList: [],
      idList: [],
      allDataList: [],
      titleTextList: []
    }
  },
  methods: {
    findEnableComList (query) {
      this.queryStr = query
      let _reqParam = {
        codeOrName: query,
        page: {
          size: 1000000,
          current: 1
        }
      }
      this.$request.post('/financeback/company/findCompanyPage', _reqParam).then(res => {
        let { status, data } = res.data
        if (status === 'success') {
          this.comEnableList = data.records.map(item => {
            return {
              label: item.name,
              value: item.code
            }
          })
        }
      })
      this.getAllDataList()
    },
    realTimeQuery (query) {
      if (!query && this.comSelectedList.length === 0) {
        this.comEnableList = []
      }
      if (query && this.queryStr === query) {
        this.findEnableComList(query)
      }
    },
    showTitleText (list) {
      this.idList = []
      this.titleTextList = []
      if (list.length === 0) {
        this.comEnableList = []
        this.codeListCopy = ''
      } else {
        this.allDataList.forEach(item => {
          if (this.comSelectedList.indexOf(item.code) > -1) {
            this.idList.push(item.id)
            this.titleTextList.push(item.name)
          }
        })
      }
      this.$emit('getComIdList', this.idList)
    },
    maxTagPlaceholder (num) {
      return `已选择${num}条数据`
    },
    doShowModal (type) {
      this.getAllDataList().then(res => {
        this[`${type}Show`] = !this[`${type}Show`]
      })
    },
    doGetDataList (listSel, listAll) {
      this.comEnableList = listSel.map(item => {
        return {
          label: item.name,
          value: item.code
        }
      })
      this.comSelectedList = listSel.map(item => item.code)
      this.allDataList = listAll
    },
    getAllDataList () {
      let _reqParam = {
        codeOrName: '',
        page: {
          size: 1000000,
          current: 1
        }
      }
      return this.$request.post('/financeback/company/findCompanyPage', _reqParam).then(res => {
        let { status, data } = res.data
        if (status === 'success') {
          this.allDataList = data.records
          return this.allDataList
        }
      })
    }
  },
  watch: {
    clear (val) {
      if (!val) {
        this.comEnableList = []
        this.comSelectedList = []
      }
    }
  },
  created () {
    this.getAllDataList().then((res) => {
      if (res.length && this.codeList) {
        this.codeListCopy = this.codeList
        this.allDataList.forEach(item => {
          if (item.code === this.codeListCopy) {
            this.comEnableList = [{
              label: item.name,
              value: item.code
            }]
            this.comSelectedList = [item.code]
            this.idList = [item.id]
          }
        })
        this.$emit('getComIdList', this.idList)
      }
    })
  }
}
</script>

<style lang="less" scoped>
  .drop-down-multi-select {
    position: relative;
    .select-icon {
      position: absolute;
      top: 6px;
      right: 2px;
      cursor: pointer;
    }
  }
</style>
