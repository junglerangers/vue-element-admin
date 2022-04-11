<script>
// item本质上就是一个icon和一个title
export default {
  name: 'MenuItem',
  functional: true,
  props: {
    icon: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  },
  /**
   * 如果传进来的icon是el-icon的,就直接使用其原本的方式
   * 如果不是,就用自定义组件svg-item包裹一下
   */
  render(h, context) { // 渲染函数
    const { icon, title } = context.props
    const vnodes = []

    if (icon) {
      if (icon.includes('el-icon')) { // 如果是el中的icon图片
        vnodes.push(<i class={[icon, 'sub-el-icon']} />)
      } else { // 如果是传统的icon的图片
        vnodes.push(<svg-icon icon-class={icon}/>)
      }
    }

    if (title) {
      vnodes.push(<span slot='title'>{(title)}</span>)
    }
    return vnodes
  }
}
</script>

<style scoped>
.sub-el-icon {
  color: currentColor;
  width: 1em;
  height: 1em;
}
</style>
