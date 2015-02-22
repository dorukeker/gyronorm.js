var expect = chai.expect;
mocha.timeout(10000);

describe('GyroNorm', function() {

  describe('constructor', function() {
    it('should be a function', function() {
      expect(GyroNorm).to.be.a('function');
    });

    context('when no options are provided', function() {
      var gn = new GyroNorm();

      describe('_frequency', function() {
        it('should be initialized with the default value', function() {
          expect(gn)
            .to.have.property('_frequency')
            .that.equals(50);
        });
      });

      describe('_gravityNormalized', function() {
        it('should be initialized with the default value', function() {
          expect(gn)
            .to.have.property('_gravityNormalized')
            .that.equals(true);
        });
      });

      describe('_orientationBase', function() {
        it('should be initialized with the default value', function() {
          expect(gn)
            .to.have.property('_orientationBase')
            .that.equals(GyroNorm.GAME);
        });
      });

      describe('_decimalCount', function() {
        it('should be initialized with the default value', function() {
          expect(gn)
            .to.have.property('_decimalCount')
            .that.equals(2);
        });
      });

      describe('_screenAdjusted', function() {
        it('should be initialized with the default value', function() {
          expect(gn)
            .to.have.property('_screenAdjusted')
            .that.equals(false);
        });
      });

      describe('_logger', function() {
        it('should be initialied with the default value', function() {
          expect(gn)
            .to.have.property('_logger')
            .that.equals(null);
        });
      });
    });
  });

  describe('.init', function() {
    var gn = new GyroNorm();
    var initPromise = null;

    before(function(done) {
      initPromise = gn.init();
      initPromise.then(function(gn) {
        return done();
      });
    });

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
