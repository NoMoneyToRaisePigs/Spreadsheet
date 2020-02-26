Vue.filter('dp', function (value) {
    return (Math.round(Number(value) * 100) / 100).toFixed(2);
});