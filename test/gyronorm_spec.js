var expect = chai.expect;
mocha.timeout(10000);

describe('GyroNorm', function() {

  describe('constructor', function() {
    it('should be a function', function () {
      expect(GyroNorm).to.be.a('function');
    });
  });

  describe('.init', function() {
    it('returns a promise', function(done) {
      var gn = new GyroNorm();
      var initPromise = gn.init();
      expect(initPromise)
        .to.eventually.be.fulfilled
        .and.notify(done);
    });
  });
});
