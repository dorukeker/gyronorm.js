var expect = chai.expect;
mocha.timeout(10000);

describe('GyroNorm', function() {

  describe('constructor', function() {
    it('should be a function', function () {
      expect(GyroNorm).to.be.a('function');
    });
  });

  describe('.init', function() {
    var gn = new GyroNorm();
    var initPromise = gn.init();

    it('should set up a device orientation controller', function(done) {
      expect(initPromise)
        .to.eventually.be.fulfilled
        .and.have.property('_do')
        .to.not.equal(null)
        .and.notify(done);
    });

    it('should set up a device motion controller', function(done) {
      expect(initPromise)
        .to.eventually.be.fulfilled
        .and.have.property('_dm')
        .to.not.equal(null)
        .and.notify(done);
    });
  });
});
