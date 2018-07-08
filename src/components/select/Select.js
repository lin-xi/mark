import './select.less'

export default {
  name: 'pop-select',
  props: {
    mode: {
      type: String,
      default: 'select'
    },
    value: {
      type: [Number, String, Boolean]
    },
    position: {
      type: String,
      default: 'left'
    }
  },
  data () {
    return {
      showMenu: false,
      displayName: '',
      options: [],
      selectedText: '',
      selectValue: '',
      dirty: false
    }
  },
  methods: {
    doPop (e) {
      this.showMenu = !this.showMenu
      e.preventDefault()
      e.stopPropagation()
    },
    doHide () {
      this.showMenu = !this.showMenu
    },
    doSelect (item) {
      this.selectedText = item.text
      this.selectedValue = item.value
      this.$emit('input', this.selectedValue)
      this.$emit('change', item)
    },
    update (val) {
      this.options = []
      this.$slots.default.map(child => {
        let props = child.componentOptions ? child.componentOptions.propsData : undefined
        if (props) {
          this.options.push({
            value: props.value,
            text: props.text,
            children: child.componentOptions.children
          })
        }
      })
      this.options.map(item => {
        if (item.value === val) {
          this.selectedValue = item.vlaue
          this.selectedText = item.text
        }
      })
    }
  },
  render (h) {
    let posClass = this.position === 'right' ? 'pop-option right' : 'pop-option'
    return <div class='pop-select' onClick={this.doHide}>
      { this.$slots.text ? this.$slots.text : <div class='select-value' onClick={this.doPop}>{this.selectedText}</div> }
      {
        this.showMenu
          ? <ul class={posClass}>
            {this.options.map(item => {
              if (item.value === this.value) {
                return <li class='active' onClick={this.doSelect.bind(this, item)}>{item.children || item.text}</li>
              } else {
                return <li onClick={this.doSelect.bind(this, item)}>{item.children || item.text}</li>
              }
            })}
          </ul>
          : ''
      }
    </div>
  },
  watch: {
    value (newVal, oldVal) {
      // todo
      setTimeout(() => {
        this.update(newVal)
      }, 1000)
    }
  },
  mounted () {
    this.update(this.value)
  }
}
