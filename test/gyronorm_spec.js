var expect = chai.expect;
mocha.timeout(30000);

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

    context('when options have been provided', function() {
      var options = {
        frequency: 100,
        gravityNormalized: false,
        orientationBase: GyroNorm.WORLD,
        decimalCount: 4,
        screenAdjusted: true,
        logger: function() {},
      };
      var gn = new GyroNorm(options);

      describe('_frequency', function() {
        it('should be equal to the provided options.frequency value', function() {
          expect(gn)
            .to.have.property('_frequency')
            .that.equals(options.frequency);
        });
      });

      describe('_gravityNormalized', function() {
        it('should be equal to the provided options.gravityNormalized value', function() {
          expect(gn)
            .to.have.property('_gravityNormalized')
            .that.equals(options.gravityNormalized);
        });
      });

      describe('_orientationBase', function() {
        it('should be equal to the provided options.orientationBase value', function() {
          expect(gn)
            .to.have.property('_orientationBase')
            .that.equals(options.orientationBase);
        });
      });

      describe('_decimalCount', function() {
        it('should be equal to the provided options.decimalCount value', function() {
          expect(gn)
            .to.have.property('_decimalCount')
            .that.equals(options.decimalCount);
        });
      });

      describe('_screenAdjusted', function() {
        it('should be equal to the provided options.screenAdjusted value', function() {
          expect(gn)
            .to.have.property('_screenAdjusted')
            .that.equals(options.screenAdjusted);
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
