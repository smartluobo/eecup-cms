import Vue from 'vue';
import VueRouter from 'vue-router';

import index from './../pages/index';
import login from './../pages/login'

Vue.use(VueRouter);

export default new VueRouter({
  routes: [
    {
      name : 'login',
      path : '/login',
      component : login
    },
    {
      name: 'index',
      path: '/',
      component: index,
      meta : {
        components : [ ],
      },
    },
    {
      name : 'bar',
      path: '/bar',
      component : index,
      meta : {
        components : [ 'com_bar' ],
      }
    }
  ]
});
