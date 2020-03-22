import Vue from 'vue';
import Vuex from 'vuex';
import vuexDeclaration from 'vuex-declaration'

Vue.use(Vuex);
Vue.use(vuexDeclaration);

export default new Vuex.Store({
  /**
   * 此处无需增加任何状态，所有的状态在组件里分布式按需声明
   */
  state: {},
  mutations: {},
});
