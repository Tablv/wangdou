// import Vue from 'vue'
// import iView from 'iview'
export default {
  state: {
    listArrId: {},
    yearList: [],
    acountBook: {},
    confirm: {
      visible: false,
      title: '提示信息',
      transfer: false,
      message: '当前页面数据已发生变化，是否保存再继续？',
      type: 'control', // control / confirm
      button: ['是', '否', '取消'],
      yes: function () { },
      no: function () { },
      cancel: function () { },
      close: function () { }
    }
  },
  mutations: {
    getListIds (state, data) {
      state.listArrId[data.name] = data.ids
    },
    getAccount (state, data) {
      state.acountBook = data
    },
    deleteListid (state, id) {
      state.listArrId = id
    },
    addIdToList (state, data) {
      if (state.listArrId[data.name]) {
        state.listArrId[data.name] = [...state.listArrId[data.name], data.id]
      } else {
        state.listArrId[data.name] = [data.id]
      }
    },
    getYearList (state, data) {
      state.yearList = data
    },
    toggleConfirm (state, data) {
      state.confirm.visible = data.visible || true
      state.confirm.title = data.title || '提示信息'
      state.confirm.message = data.message || '提示文本'
      state.confirm.yes = data.yes || function () { }
      state.confirm.no = data.no || function () { }
      state.confirm.cancel = data.cancel || function () { }
      state.confirm.close = data.close || function () { }
      state.confirm.type = data.type || 'control'
      state.confirm.transfer = data.transfer || false
      if (data.button) {
        state.confirm.button = data.button
      } else if (data.type) {
        state.button = data.type === 'control' ? ['是', '否', '取消'] : ['取消', '确认']
      } else {
        state.button = ['是', '否', '取消']
      }
    },
    CloseConfirm (state) {
      state.confirm.visible = false
    }
  },
  actions: {
    addIdToList (context, payload) {
      context.commit('addIdToList', payload)
    },
    toggleConfirm (context, payload) {
      context.commit('toggleConfirm', payload)
    },
    CloseConfirm (context) {
      context.commit('CloseConfirm')
    }
  }
}
