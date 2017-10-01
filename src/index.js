import './style.css';
import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

import Carcass from './components/Carcass.vue';
import Home from './components/Home.vue';
import Fifteen from './components/fifteen/Fifteen.vue';
import Snake from './components/snake/Snake.vue';

const router = new VueRouter({
  routes:
  [
    { path: '/', name: 'Home', component: Home },
    { path: '/fifteen', name: 'Fifteen', component: Fifteen },
    { path: '/snake', name: 'Snake', component: Snake },
  ]
});

function appComponent()
{
  var element = document.createElement('div');
  element.id = 'vue-app';

  return element;
}

document.body.appendChild(appComponent());

new Vue({
  el: '#vue-app',
  router,
  render: h => h(Carcass),
});