import store from '@/store'

/**
 * 检查当前用户是否有相应的角色权限访问当前的el
 * @param {*} el 当前route需要展示的el
 * @param {Array} binding 所有有权限访问当前route的角色
 */
function checkPermission(el, binding) {
  const { value } = binding
  const roles = store.getters && store.getters.roles

  if (value && value instanceof Array) {
    if (value.length > 0) {
      const permissionRoles = value

      const hasPermission = roles.some(role => { // 如果该数组有任何一个项目符合条件,就返回true
        return permissionRoles.includes(role)
      })

      if (!hasPermission) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    }
  } else {
    throw new Error(`To Programmer:need roles! Like v-permission="['admin','editor']"`)
  }
}

export default {
  inserted(el, binding) { // 定义了该指令在什么时候生效,字面意思上是插入和更新的时候,但是为什么我没有在官方文档中找到这两个的定义(ˉ▽ˉ；)...
    checkPermission(el, binding)
  },
  update(el, binding) {
    checkPermission(el, binding)
  }
}
