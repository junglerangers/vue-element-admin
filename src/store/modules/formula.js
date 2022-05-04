
const state = {
  cachedFormula: null
}

const mutations = {
  GET_FORMULA: (state, formula) => {
    state.cachedFormula = formula
  },
  DEL_FORMULA: state => {
    state.cachedFormula = null
  }
}

const actions = {
  getFormula({ commit }, formula) {
    commit('GET_FORMULA', formula)
  },
  delFormula({ commit }) {
    commit('DEL_FORMULA')
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
