const state = {
  kindCodeList: [], // 人员性质
  kindCode2List: [], // 人员性质2
  hosAreaList: [], // 院区标志
  empClsList: [], // 人员分类
  monthNo:
    new Date().getFullYear() +
    '-' +
    (1 + new Date().getMonth()).toString().padStart(2, '0')
}

const mutations = {
  SET_MONTHNO: (state, monthNo) => {
    state.monthNo = monthNo
  },
  DEL_MONTHNO: (state) => {
    state.monthNo = ''
  },
  GET_KINDCODELIST: (state, kindCodeList) => {
    state.kindCodeList = kindCodeList
  },
  DEL_KINDCODELIST: (state) => {
    state.kindCodeList = []
  },
  GET_KINDCODE2LIST: (state, kindCode2List) => {
    state.kindCode2List = kindCode2List
  },
  DEL_KINDCODE2LIST: (state) => {
    state.kindCode2List = []
  },
  GET_HOSAREALIST: (state, hosAreaList) => {
    state.hosAreaList = hosAreaList
  },
  DEL_HOSAREALIST: (state) => {
    state.hosAreaList = []
  },
  GET_EMPCLSLIST: (state, empClsList) => {
    state.empClsList = empClsList
  },
  DEL_EMPCLSLIST: (state) => {
    state.empClsList = []
  }
}

const actions = {
  getMonthNo({ commit }, monthNo) {
    commit('SET_MONTHNO', monthNo)
  },
  delMonthNo({ commit }) {
    commit('DEL_MONTHNO')
  },
  getKindCodeList({ commit }, kindCodeList) {
    commit('GET_KINDCODELIST', kindCodeList)
  },
  delKindCodeList({ commit }) {
    commit('DEL_KINDCODELIST')
  },
  getKindCode2List({ commit }, kindCode2List) {
    commit('GET_KINDCODE2LIST', kindCode2List)
  },
  delKindCode2List({ commit }) {
    commit('DEL_KINDCODE2LIST')
  },
  getHosAreaList({ commit }, hosAreaList) {
    commit('GET_HOSAREALIST', hosAreaList)
  },
  delHosAreaList({ commit }) {
    commit('DEL_HOSAREALIST')
  },
  getEmpClsList({ commit }, empClsList) {
    commit('GET_EMPCLSLIST', empClsList)
  },
  delEmpClsList({ commit }) {
    commit('DEL_EMPCLSLIST')
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
