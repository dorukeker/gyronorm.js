var expect = chai.expect;
mocha.timeout(30000);
ES6Promise.polyfill();

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
        it('should be initialized with the default value', function() {
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
    var sandbox = null;

    before(function() {
      sandbox = sinon.sandbox.create();
      sandbox.stub(gn, '_getDeviceOrientationController').returns(Promise.resolve({}));
      sandbox.stub(gn, '_getDeviceMotionController').returns(Promise.resolve({}));
      sandbox.stub(gn, '_getGravityCoefficient').returns(1);
      initPromise = gn.init();
    });

    it('should set up a device orientation controller', function(done) {
      expect(gn._getDeviceOrientationController).to.have.been.calledOnce;

      expect(initPromise)
        .to.eventually.have.property('_do')
        .that.is.ok
        .and.notify(done);
    });

    it('should set up a device motion controller', function(done) {
      expect(gn._getDeviceMotionController).to.have.been.calledOnce;

      expect(initPromise)
        .to.eventually.have.property('_dm')
        .that.is.ok
        .and.notify(done);
    });

    it('should retrieve and store the gravityCoefficient value', function(done) {
      expect(gn._getGravityCoefficient).to.have.been.calledOnce;

      expect(initPromise)
        .to.eventually.have.property('_gravityCoefficient')
        .that.equals(1)
        .and.notify(done);
    });

    after(function() {
      sandbox.restore();
    });
  });

  describe('.isDeviceOrientationAvailable', function() {
    context('when the device orientation controller is falsy', function() {
      var gn = new GyroNorm();
      it('should return false', function() {
        expect(gn.isDeviceOrientationAvailable())
          .to.be.false
      });
    });

    context('when all device orientation parameters are supported', function() {
      var gn = new GyroNorm();

      before(function() {
        gn._do = {};
        gn._do.isAvailable = sinon.stub().returns(true);
      });

      it('should return true', function() {
        expect(gn.isDeviceOrientationAvailable())
          .to.be.true;

        expect(gn._do.isAvailable)
          .to.have.callCount(3);
      });
    });

    context('when the device orientation parameter `alpha` is not supported', function() {
      var gn = new GyroNorm();

      before(function() {
        gn._do = { ALPHA: 'alpha', BETA: 'beta', GAMMA: 'gamma' };
        gn._do.isAvailable = sinon.stub();
        gn._do.isAvailable.withArgs('alpha').returns(false);
        gn._do.isAvailable.withArgs('beta').returns(true);
        gn._do.isAvailable.withArgs('gamma').returns(true);
      });

      it('should return false', function() {
        expect(gn.isDeviceOrientationAvailable())
          .to.be.false;

        expect(gn._do.isAvailable)
        .to.have.callCount(1);
      });
    });

    context('when the device orientation parameter `beta` is not supported', function() {
      var gn = new GyroNorm();

      before(function() {
        gn._do = { ALPHA: 'alpha', BETA: 'beta', GAMMA: 'gamma' };
        gn._do.isAvailable = sinon.stub();
        gn._do.isAvailable.withArgs('alpha').returns(true);
        gn._do.isAvailable.withArgs('beta').returns(false);
        gn._do.isAvailable.withArgs('gamma').returns(true);
      });

      it('should return false', function() {
        expect(gn.isDeviceOrientationAvailable())
          .to.be.false;

        expect(gn._do.isAvailable)
        .to.have.callCount(2);
      });
    });

    context('when the device orientation parameter `gamma` is not supported', function() {
      var gn = new GyroNorm();

      before(function() {
        gn._do = { ALPHA: 'alpha', BETA: 'beta', GAMMA: 'gamma' };
        gn._do.isAvailable = sinon.stub();
        gn._do.isAvailable.withArgs('alpha').returns(true);
        gn._do.isAvailable.withArgs('beta').returns(true);
        gn._do.isAvailable.withArgs('gamma').returns(false);
      });

      it('should return false', function() {
        expect(gn.isDeviceOrientationAvailable())
          .to.be.false;

        expect(gn._do.isAvailable)
        .to.have.callCount(3);
      });
    });
  });

  describe('.isAccelerationAvailable', function() {
    context('when the device acceleration controller does not exist', function() {
      var gn = new GyroNorm();

      it('should return false', function() {
        expect(gn.isAccelerationAvailable())
          .to.be.false
      });
    });

    context('when all device acceleration parameters are supported', function() {
      var gn = new GyroNorm();

      before(function() {
        gn._dm = {};
        gn._dm.isAvailable = sinon.stub().returns(true);
      });

      it('should return true', function() {
        expect(gn.isAccelerationAvailable())
          .to.be.true;

        expect(gn._dm.isAvailable)
          .to.have.callCount(3);
      });
    });

    context('when the device acceleration parameter `X` is not supported', function() {
      var gn = new GyroNorm();

      before(function() {
        gn._dm = { ACCELERATION_X: 'accelerationX', ACCELERATION_Y: 'accelerationY', ACCELERATION_Z: 'accelerationZ' };
        gn._dm.isAvailable = sinon.stub();
        gn._dm.isAvailable.withArgs(gn._dm.ACCELERATION_X).returns(false);
        gn._dm.isAvailable.withArgs(gn._dm.ACCELERATION_Y).returns(true);
        gn._dm.isAvailable.withArgs(gn._dm.ACCELERATION_Z).returns(true);
      });

      it('should return false', function() {
        expect(gn.isAccelerationAvailable())
          .to.be.false;

        expect(gn._dm.isAvailable)
        .to.have.callCount(1);
      });
    });

    context('when the device acceleration parameter `Y` is not supported', function() {
      var gn = new GyroNorm();

      before(function() {
        gn._dm = { ACCELERATION_X: 'accelerationX', ACCELERATION_Y: 'accelerationY', ACCELERATION_Z: 'accelerationZ' };
        gn._dm.isAvailable = sinon.stub();
        gn._dm.isAvailable.withArgs(gn._dm.ACCELERATION_X).returns(true);
        gn._dm.isAvailable.withArgs(gn._dm.ACCELERATION_Y).returns(false);
        gn._dm.isAvailable.withArgs(gn._dm.ACCELERATION_Z).returns(true);
      });

      it('should return false', function() {
        expect(gn.isAccelerationAvailable())
          .to.be.false;

        expect(gn._dm.isAvailable)
        .to.have.callCount(2);
      });
    });

    context('when the device acceleration parameter `Z` is not supported', function() {
      var gn = new GyroNorm();

      before(function() {
        gn._dm = { ACCELERATION_X: 'accelerationX', ACCELERATION_Y: 'accelerationY', ACCELERATION_Z: 'accelerationZ' };
        gn._dm.isAvailable = sinon.stub();
        gn._dm.isAvailable.withArgs(gn._dm.ACCELERATION_X).returns(true);
        gn._dm.isAvailable.withArgs(gn._dm.ACCELERATION_Y).returns(true);
        gn._dm.isAvailable.withArgs(gn._dm.ACCELERATION_Z).returns(false);
      });

      it('should return false', function() {
        expect(gn.isAccelerationAvailable())
          .to.be.false;

        expect(gn._dm.isAvailable)
        .to.have.callCount(3);
      });
    });
  });

  describe('.isAccelerationIncludingGravityAvailable', function() {
    context('when the device orientation controller is falsy', function() {
      var gn = new GyroNorm();

      it('should return false', function() {
        expect(gn.isAccelerationIncludingGravityAvailable())
          .to.be.false
      });
    });

    context('when all device accelerationIncludingGravity parameters are supported', function() {
      var gn = new GyroNorm();

      before(function() {
        gn._dm = { ACCELERATION_INCLUDING_GRAVITY_X: 'accelerationIncludingGravityX',
          ACCELERATION_INCLUDING_GRAVITY_Y: 'accelerationIncludingGravityY', ACCELERATION_INCLUDING_GRAVITY_Z: 'accelerationIncludingGravityZ' };
        gn._dm.isAvailable = sinon.stub().returns(true);
      });

      it('should return true', function() {
        expect(gn.isAccelerationIncludingGravityAvailable())
          .to.be.true;

        expect(gn._dm.isAvailable)
          .to.have.callCount(3);
      });
    });

    context('when the device accelerationIncludingGravity parameter `X` is not supported', function() {
      var gn = new GyroNorm();

      before(function() {
        gn._dm = { ACCELERATION_INCLUDING_GRAVITY_X: 'accelerationIncludingGravityX',
          ACCELERATION_INCLUDING_GRAVITY_Y: 'accelerationIncludingGravityY', ACCELERATION_INCLUDING_GRAVITY_Z: 'accelerationIncludingGravityZ' };
        gn._dm.isAvailable = sinon.stub();
        gn._dm.isAvailable.withArgs(gn._dm.ACCELERATION_INCLUDING_GRAVITY_X).returns(false);
        gn._dm.isAvailable.withArgs(gn._dm.ACCELERATION_INCLUDING_GRAVITY_Y).returns(true);
        gn._dm.isAvailable.withArgs(gn._dm.ACCELERATION_INCLUDING_GRAVITY_Z).returns(true);
      });

      it('should return false', function() {
        expect(gn.isAccelerationIncludingGravityAvailable())
          .to.be.false;

        expect(gn._dm.isAvailable)
        .to.have.callCount(1);
      });
    });

    context('when the device accelerationIncludingGravity parameter `Y` is not supported', function() {
      var gn = new GyroNorm();

      before(function() {
        gn._dm = { ACCELERATION_INCLUDING_GRAVITY_X: 'accelerationIncludingGravityX',
          ACCELERATION_INCLUDING_GRAVITY_Y: 'accelerationIncludingGravityY', ACCELERATION_INCLUDING_GRAVITY_Z: 'accelerationIncludingGravityZ' };
        gn._dm.isAvailable = sinon.stub();
        gn._dm.isAvailable.withArgs(gn._dm.ACCELERATION_INCLUDING_GRAVITY_X).returns(true);
        gn._dm.isAvailable.withArgs(gn._dm.ACCELERATION_INCLUDING_GRAVITY_Y).returns(false);
        gn._dm.isAvailable.withArgs(gn._dm.ACCELERATION_INCLUDING_GRAVITY_Z).returns(true);
      });

      it('should return false', function() {
        expect(gn.isAccelerationIncludingGravityAvailable())
          .to.be.false;

        expect(gn._dm.isAvailable)
        .to.have.callCount(2);
      });
    });

    context('when the device accelerationIncludingGravity parameter `Z` is not supported', function() {
      var gn = new GyroNorm();

      before(function() {
        gn._dm = { ACCELERATION_INCLUDING_GRAVITY_X: 'accelerationIncludingGravityX',
          ACCELERATION_INCLUDING_GRAVITY_Y: 'accelerationIncludingGravityY', ACCELERATION_INCLUDING_GRAVITY_Z: 'accelerationIncludingGravityZ' };
        gn._dm.isAvailable = sinon.stub();
        gn._dm.isAvailable.withArgs(gn._dm.ACCELERATION_INCLUDING_GRAVITY_X).returns(true);
        gn._dm.isAvailable.withArgs(gn._dm.ACCELERATION_INCLUDING_GRAVITY_Y).returns(true);
        gn._dm.isAvailable.withArgs(gn._dm.ACCELERATION_INCLUDING_GRAVITY_Z).returns(false);
      });

      it('should return false', function() {
        expect(gn.isAccelerationIncludingGravityAvailable())
          .to.be.false;

        expect(gn._dm.isAvailable)
        .to.have.callCount(3);
      });
    });
  });
});
