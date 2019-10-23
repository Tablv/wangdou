export default {
  install(Vue, options) {
    /**@desc 重置表单
     * @params form 表示将要重置表单 target 表示以源数据重置表单。
     * */
    Vue.prototype.$resetForm = function (form, target = '') {
      if (!form) {
        return false
      }
      if (!target) {
        for (let key in form) {
          if (typeof form[key] === 'string' || typeof form[key] === 'number') {
            form[key] = ''
          }
          if (form[key] instanceof Array) {
            form[key] = [];
          }
          if (form[key] instanceof Object) {
            this.$resetForm(form[key]);
          }
        }
      } else {
        for (let _key in form) {
          form[_key] = target[_key] ? target[_key] : ''
        }
      }
    }
    Vue.prototype.$download = function (data, name = 'excel', id = 'down_a', postfix = 'xls') {
      const aLink = document.getElementById(id)
      let blob = new Blob([data], { type: 'application/vnd.ms-excel' })
      aLink.href = URL.createObjectURL(blob)
      aLink.download = `${name}.${postfix}` // 设置下载文件名称
      aLink.click()
      document.body.appendChild(aLink)
    }

    Vue.prototype.$sortArr = function (arr1, arr2, sort) {
      let _arr = []
      arr2.map(item => {
        arr1.map((tmp, idx) => {
          if (item[sort] === tmp[sort]) {
            _arr.push(arr1[idx])
          }
        })
      })
      return _arr
    }

    Vue.prototype.$Control = function (data) {
      this.$store.commit('setIsShowEditModal', false)
      this.$store.dispatch('toggleConfirm', data)
    }

    Vue.prototype.$CloseCtl = function () {
      this.$store.dispatch('CloseConfirm')
    }
  }
}
