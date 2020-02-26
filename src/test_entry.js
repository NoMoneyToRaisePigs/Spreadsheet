function importAll(r, specFiles) {
    if (specFiles) {
        r.keys().forEach(r);
    } else {
        r.keys().filter(k => !/\.spec/.test(k)).forEach(r);
    }
} 

require('./main.js');

describe('Test',function(){
    beforeEach(function(){
        console.log('Test beforeEach');
    });

    it('a test it', function(){
        let result = 1 + 1;
        expect(result).toBe(2);
    });
});

importAll(require.context('./components', true, /\.spec.js$/), true);
