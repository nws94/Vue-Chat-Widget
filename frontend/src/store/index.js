import Vue from 'vue'
import Vuex from 'vuex'
import state from './states';
import getters from './getters';
import mutations from './mutations';
import actions from './actions'
import createPersistedState from 'vuex-persistedstate'
import SecureLS from "secure-ls";
var ls = new SecureLS({ isCompression: false });

Vue.use(Vuex)

export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions,
  // 새로 고침해도 state에 저장된 정보들이 안없어지게 localStorage에 저장(단, 다른 사람이 식별 할 수 없도록 16진수로 저장)
  plugins: [createPersistedState({
    storage: {
      getItem: key => ls.get(key),
      setItem: (key, value) => ls.set(key, value),
      removeItem: key => ls.remove(key)
    }
  })]
})
