require('./util/portal.js');

import Vue from 'vue';
import sheet from './components/sheet/sheet.component.vue';
import FraMeta from './metaData.js';

require('./directives/resize.directive.js');

Vue.component('sheet', sheet);

//-----------------------------------------------------------------------------------------------------------------------------------------
var list = [];

for(let i = 0; i < 1000; i ++){
    list.push({id: i, rt: '01-AUG-19', vt:'02-AUG-19', rate: '1.234567', currency: 'USD', product:'FRA', tenor:'3M', status:'Open'});
}

window.myVue = new Vue({
  el: '#app',
  data:{
    testString: 'hello w',
    listSource: list
  }
});

//-----------------------------------------------------------------------------------------------------------------------------------------
var testEl = document.getElementById("main-container");
var dragEl = document.getElementById("drag");

dragElement(dragEl);

function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

  elmnt.onmousedown = dragMouseDown;

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();

    pos1 = e.clientX - pos3;
    pos2 = e.clientY - pos4;
    pos3 = e.clientX;
    pos4 = e.clientY;

    testEl.style.width = testEl.getBoundingClientRect().width + pos1 + 'px';
    testEl.style.height = testEl.getBoundingClientRect().height + pos2 + 'px';

  }

  function closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
}