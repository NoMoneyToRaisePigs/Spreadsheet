import Vue from 'vue';

Vue.directive('on-resize', {
    inserted: function (el, binding, vnode) {
        el._resizeObserver.observe(el);
    },
    bind: function (el, binding, vnode) {
        el._resizeObserver = new ResizeObserver(entries => {
            //console.log('I found you oh, little change ...');
            binding.value();
        });
    },
    unbind: function () {
        el._resizeObserver.disconnect();
        el._resizeObserver = null;
    }
})