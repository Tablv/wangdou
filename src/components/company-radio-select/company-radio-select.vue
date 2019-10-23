<template>
    <div class="company-radio-select">
      <div class="input-container">
        <Input v-model="form.companyName"
               @on-change="handleInputSearch"
               placeholder="请选择"
               :disabled="disabled"
               @on-focus="visible = true" @on-blur="handleBlur"></Input>
        <div @click="handleClear" v-if=" !disabled && clearable && form.companyName" class="close-btn">
          <CommonIcon
            type="ios-close-circle"
            :size="14"
            color="#808695"
            class="search-close"
          ></CommonIcon>
        </div>
        <Icon class="search-icon" v-if="!disabled" type="md-more" size="20" @click="select_company_visible = true"></Icon>
      </div>
      <ul class="search-container1" :class="{ 'hide-search': !visible }" v-if="company_list.length">
        <li v-for="item in company_list" :key="item.id" @click="handleChooseLi(item)">{{ item.name }}</li>
      </ul>
      <p v-if="!company_list.length && visible" class="no-data">暂无数据</p>
      <CompanySelect v-model="select_company_visible" @select="handleSelectCompany"></CompanySelect>
    </div>
</template>

<script>
import CommonIcon from '_c/common-icon'
import CompanySelect from '_c/companySelectModal'
export default {
  name: 'company-radio-select',
  components: { CommonIcon, CompanySelect },
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    clearable: {
      type: Boolean,
      default: true
    },
    value: {
      type: String
    }
  },
  watch: {
    value: {
      handler: function (val) {
        this.form.companyName = val
        this.handleGetCompany()
      },
      deep: true,
      immediate: true
    }
  },
  data () {
    return {
      select_company_visible: false, // 单选公司
      visible: false, // 显示隐藏下拉菜单
      params: {
        isEnterpriseAdmin: 1,
        codeOrName: '',
        page: {
          size: 999,
          current: 1
        }
      },
      form: {
        companyName: '',
        companyId: ''
      },
      company_list: []
    }
  },
  mounted () {
    this.handleGetCompany()
  },
  methods: {
    handleBlur () {
      let result = this.company_list.filter(item => item.name === this.form.companyName)
      if (result.length) {
        this.form.companyId = result[0].id
        this.$emit('getCompany', this.form, result[0])
      } else {
        this.form.companyName = ''
        this.$emit('getCompany', this.form, result[0])
      }
      setTimeout(() => {
        this.visible = false
      }, 200)
    },
    // 获取公司列表
    handleGetCompany () {
      this.$request.post('/financeback/company/findCompanyPage', {
        ...this.params,
        codeOrName: this.form.companyName
      }).then(res => {
        if (res.data.code === 200) {
          this.company_list = res.data.data.records
        } else {
          this.company_list = []
        }
      })
    },
    handleSelectCompany (item) {
      if (item) {
        this.company_list = []
        this.company_list.push(item)
        this.form.companyName = item.name
        this.form.companyId = item.id
        this.$emit('getCompany', this.form, item)
      }
      this.select_company_visible = false
    },
    // 清除
    handleClear () {
      this.form.companyName = ''
      this.form.companyId = ''
      this.$emit('getCompany', this.form)
      this.handleGetCompany()
      this.visible = false
    },
    handleChooseLi (item) {
      this.form.companyName = item.name
      this.form.companyId = item.id
      this.$emit('getCompany', this.form, item)
      this.visible = false
    },
    handleInputSearch () {
      this.handleGetCompany()
    }
  }
}
</script>

<style lang="less" scoped>
  .company-radio-select {
    .input-container {
      width: 100%;
      display: inline-block;
      position: relative;
      .close-btn {
        display: none;
      }
      &:hover {
        .close-btn {
          display: block;
        }
      }
    }
    .error-border {
      border: 1px solid #ed4014;
    }
    .search-container1 {
      width: calc(100% - 1px);
      max-height: 250px;
      background-color: white;
      box-shadow: 0 1px 6px rgba(0, 0, 0, 0.2);
      box-sizing: border-box;
      overflow-y: auto;
      position: absolute;
      top: 40px;
      transform-origin: center top;
      transition: all ease .5s;
      z-index: 99;
      li {
        padding: 5px 8px;
        min-height: 30px;
        line-height: 30px;
        cursor: pointer;

        &:hover {
          background-color: #F2F2F2;
        }
      }
    }
    .no-data {
      position: absolute;
      top: 40px;
      left: 0;
      z-index: 99;
      width: 299px;
      text-align: center;
      padding: 5px 8px;
      min-height: 30px;
      line-height: 30px;
      background-color: white;
      box-shadow: 0 1px 6px rgba(0, 0, 0, 0.2);
    }
    .hide-search {
      display: none;
    }
    .search-close {
      position: absolute;
      top: 10px;
      right: 30px;
      cursor: pointer;
    }
    .search-icon {
      position: absolute;
      top: 7px;
      right: -1px;
      cursor: pointer;
    }
  }
</style>
