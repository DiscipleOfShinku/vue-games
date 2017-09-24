import './style.css';
import Vue from 'vue';
import Fifteen from './components/fifteen/Fifteen.vue';

function component()
{
  var element = document.createElement('div');
  element.id = 'test';

  return element;
}

document.body.appendChild(component());

new Vue({
  el: '#test',
  render: h => h(Fifteen)
});