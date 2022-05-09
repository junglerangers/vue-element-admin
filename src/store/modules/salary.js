const state = {
  cachedSalary: null
}

const mutations = {
  GET_SALARY: (state, salary) => {
    state.cachedSalary = salary
  },
  DEL_SALARY: (state) => {
    state.cachedSalary = null
  }
}

const actions = {
  getSalary({ commit }, salary) {
    commit('GET_SALARY', salary)
  },
  delSalary({ commit }) {
    commit('DEL_SALARY')
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
