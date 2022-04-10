import Cookies from 'js-cookie'

const state = {
  sidebar: {
    opened: Cookies.get('sidebarStatus') ? !!+Cookies.get('sidebarStatus') : true,
    withoutAnimation: false
  },
  device: 'desktop',
  size: Cookies.get('size') || 'medium',
  events: [],
  unConfirmedEventnum: 0
}

const mutations = {
  TOGGLE_SIDEBAR: state => {
    state.sidebar.opened = !state.sidebar.opened
    state.sidebar.withoutAnimation = false
    if (state.sidebar.opened) {
      Cookies.set('sidebarStatus', 1)
    } else {
      Cookies.set('sidebarStatus', 0)
    }
  },
  CLOSE_SIDEBAR: (state, withoutAnimation) => {
    Cookies.set('sidebarStatus', 0)
    state.sidebar.opened = false
    state.sidebar.withoutAnimation = withoutAnimation
  },
  TOGGLE_DEVICE: (state, device) => {
    state.device = device
  },
  SET_SIZE: (state, size) => {
    state.size = size
    Cookies.set('size', size)
  },
  ADD_EVENT: (state, event) => {
    state.events.push(event)
    state.unConfirmedEventnum++
  },
  DEL_EVENT: (state, taskID) => {
    state.events = state.events.filter(e => e.taskID !== taskID)
  },
  CHANGE_EVENT_STATE: (state, task) => {
    for (const e of state.events) {
      if (e.taskID === task.taskID) {
        e.taskState = task.taskState
        break
      }
    }
  },
  HAS_EVENT: (state, taskID) => {
    return state.event.some((item) => { item.taskID === taskID })
  },
  ADD_EVENT_NUM: (state) => {
    state.unConfirmedEventnum++
  },
  CLEAR_EVENT_NUM: (state) => {
    state.unConfirmedEventnum = 0
  }
}

const actions = {
  toggleSideBar({ commit }) {
    commit('TOGGLE_SIDEBAR')
  },
  closeSideBar({ commit }, { withoutAnimation }) {
    commit('CLOSE_SIDEBAR', withoutAnimation)
  },
  toggleDevice({ commit }, device) {
    commit('TOGGLE_DEVICE', device)
  },
  setSize({ commit }, size) {
    commit('SET_SIZE', size)
  },
  addEvent({ commit }, task) {
    commit('ADD_EVENT', task)
  },
  delEvent({ commit }, taskID) {
    commit('DEL_EVENT', taskID)
  },
  changeEventState({ commit }, task) {
    commit('CHANGE_EVENT_STATE', task)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
