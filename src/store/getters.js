const getters = {
  sidebar: (state) => state.app.sidebar,
  size: (state) => state.app.size,
  device: (state) => state.app.device,
  visitedViews: (state) => state.tagsView.visitedViews,
  cachedViews: (state) => state.tagsView.cachedViews,
  token: (state) => state.user.token,
  avatar: (state) => state.user.avatar,
  name: (state) => state.user.name,
  introduction: (state) => state.user.introduction,
  roles: (state) => state.user.roles,
  permission_routes: (state) => state.permission.routes,
  errorLogs: (state) => state.errorLog.logs,
  events: (state) => state.app.events,
  formula: (state) => state.formula.cachedFormula,
  salary: (state) => state.salary.cachedSalary,
  // kind_code_list: (state) => state.universal.kindCodeList,
  // kind_code2_list: (state) => state.universal.kindCode2List,
  // hos_area_list: (state) => state.universal.hosAreaList,
  // emp_cls_list: (state) => state.universal.empClsList,
  monthNo: (state) => state.universal.monthNo
}
export default getters
