import CommonIcon from '_c/common-icon'
import { showTitle } from '@/libs/util'
export default {
  components: {
    CommonIcon
  },
  data () {
    return {
      currentRouteObj: ''
    }
  },
  watch: {
    '$route' (val) {
      this.currentRouteObj = val
    }
  },
  methods: {
    showTitle (item) {
      return showTitle(item, this)
    },
    isCurrentMenu (item) {
      let _hasMenu = false
      item.forEach(n => {
        if (n.name === this.currentRouteObj.name) {
          _hasMenu = true
        } else {
          if (n.children && n.children.find(m => m.name === this.currentRouteObj.name)) {
            _hasMenu = true
          }
        }
      })
      return _hasMenu || false
    },
    showChildren (item) {
      return item.children && (item.children.length > 0 || (item.meta && item.meta.showAlways))
    },
    getNameOrHref (item, children0) {
      return item.href ? `isTurnByHref_${item.href}` : (children0 ? item.children[0].name : item.name)
    }
  }
}
