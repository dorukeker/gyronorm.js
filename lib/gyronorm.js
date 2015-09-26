/**
* JavaScript project for accessing and normalizing the accelerometer and gyroscope data on mobile devices
*
* @author Doruk Eker <dorukeker@gmail.com>
* @copyright Doruk Eker <http://dorukeker.com>
* @version 2.0.4
* @license MIT License | http://opensource.org/licenses/MIT
*/

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(function() {
      return (root.GyroNorm = factory());
    });
  } else if (typeof module === 'object' && module.exports) {
    module.exports = (root.GyroNorm = factory());
  } else {
    root.GyroNorm = factory();
  }
}(this, function() {
  /* Constants */
  var GAME                            = 'game';
  var WORLD                           = 'world';
  var DEVICE_ORIENTATION              = 'deviceorientation';
  var ACCELERATION                    = 'acceleration';
  var ACCELERATION_INCLUDING_GRAVITY  = 'accelerationinludinggravity';
  var ROTATION_RATE                   = 'rotationrate';

  var DEFAULTS = {
    frequency: 50,
    gravityNormalized: true,
    orientationBase: GAME,
    decimalCount: 2,
    screenAdjusted: false,
    logger: null,
  };

  /*-------------------------------------------------------*/
  /* PUBLIC FUNCTIONS */

  /*
  * Constructs a new GyroNorm instance
  *
  * @param object options - values are as follows. If set in the init function they overwrite the default option values
  * @param int options.frequency
  * @param boolean options.gravityNormalized
  * @param boolean options.orientationBase
  * @param boolean options.decimalCount
  * @param function options.logger
  * @param function options.screenAdjusted
  */
  var GyroNorm = function(options) {
    // Assign options that are passed with the constructor function
    options                   = options                   || {};
    this._frequency           = options.frequency         || DEFAULTS.frequency;
    this._orientationBase     = options.orientationBase   || DEFAULTS.orientationBase;
    this._decimalCount        = options.decimalCount      || DEFAULTS.decimalCount;
    this._logger              = options.logger            || DEFAULTS.logger;
    this._gravityNormalized   = !isNone(options.gravityNormalized) ? options.gravityNormalized : DEFAULTS.gravityNormalized;
    this._screenAdjusted      = !isNone(options.screenAdjusted)    ? options.screenAdjusted    : DEFAULTS.screenAdjusted;

    this._interval            = null;       // Timer to return values
    this._isCalibrating       = false;      // Flag if calibrating
    this._calibrationValue    = 0;          // Alpha offset value
    this._gravityCoefficient  = 0;          // Coefficient to normalze gravity related values
    this._isRunning           = false;      // Boolean value if GyroNorm is tracking
    this._isReady             = false;      // Boolean value if GyroNorm is is initialized

    this._do                  = null;       // Object to store the device orientation values
    this._dm                  = null;       // Object to store the device motion values
  };

  /* Constants */
  GyroNorm.GAME                             = GAME;
  GyroNorm.WORLD                            = WORLD;
  GyroNorm.DEVICE_ORIENTATION               = DEVICE_ORIENTATION;
  GyroNorm.ACCELERATION                     = ACCELERATION;
  GyroNorm.ACCELERATION_INCLUDING_GRAVITY   = ACCELERATION_INCLUDING_GRAVITY;
  GyroNorm.ROTATION_RATE                    = ROTATION_RATE;

  /*
  * Initialize GyroNorm deviceOrientation and deviceMotion controllers
  */
  GyroNorm.prototype.init = function() {
    var _this = this;

    var deviceOrientationPromise = this._getDeviceOrientationController().then(function(controller) {
      _this._do = controller;
    });

    var deviceMotionPromise = this._getDeviceMotionController().then(function(controller) {
      _this._dm = controller;
      _this._gravityCoefficient = _this._getGravityCoefficient();
    });

    return Promise.all([deviceOrientationPromise, deviceMotionPromise]).then(function() {
      _this._isReady = true;

      return _this;
    });
  }

  /*
  *
  * Stops all the tracking and listening on the window objects
  *
  */
  GyroNorm.prototype.end = function() {
    try {
      this.stop();
      this._dm.stop();
      this._do.stop();
      this._isReady = false;
    } catch(err) {
      this._log(err);
    }
  }

  /*
  *
  * Starts tracking the values
  *
  * @param function callback - Callback function to read the values
  *
  */
  GyroNorm.prototype.start = function(callback) {
    if (!this._isReady) {
      this._log({ message: 'GyroNorm is not initialized yet. First call the "init()" function.', code: 1 });
      return;
    }

    this._interval = setInterval(function() {
      var snapshot = snapShot(this);
      callback(snapshot);
    }.bind(this), this._frequency);

    this._isRunning = true;
  }

  /*
  *
  * Stops tracking the values
  *
  */
  GyroNorm.prototype.stop = function() {
    if (this._interval) {
      clearInterval(this._interval);
      this._interval = null;
      this._isRunning = false;
    }
  }

  /*
  *
  * Toggles if to normalize gravity related values
  *
  * @param boolean flag
  *
  */
  GyroNorm.prototype.normalizeGravity = function(flag) {
    this._gravityNormalized = (flag) ? true : false;
  }


  /*
  *
  * Sets the current head direction as alpha = 0
  * Can only be used if device orientation is being tracked, values are not screen adjusted, value type is GyroNorm.EULER and orientation base is GyroNorm.GAME
  *
  * @return: If head direction is set successfully returns true, else false
  *
  */
  GyroNorm.prototype.setHeadDirection = function() {
    if (this._screenAdjusted || this._orientationBase === WORLD) {
      return false;
    }

    this._calibrationValue = this._do.getFixedFrameEuler().alpha;
    return true;
  }

  /*
  *
  * Sets the log function
  *
  */
  GyroNorm.prototype.startLogging = function(logger) {
    if (logger) {
      this._logger = logger;
    }
  }

  /*
  * Sets the log function to null which stops the logging
  *
  */
  GyroNorm.prototype.stopLogging = function() {
    this._logger = null;
  }

  GyroNorm.prototype.isDeviceOrientationAvailable = function() {
    var snapshot = this._getScreenAdjustedEuler();

    return isPresent(snapshot) && isPresent(snapshot.alpha) && isPresent(snapshot.beta) && isPresent(snapshot.gamma);
  };

  GyroNorm.prototype.isAccelerationAvailable = function() {
    var snapshot = this._getScreenAdjustedAcceleration();

    return isPresent(snapshot) && isPresent(snapshot.x) && isPresent(snapshot.y) && isPresent(snapshot.z);
  };

  GyroNorm.prototype.isAccelerationIncludingGravityAvailable = function() {
    var snapshot = this._getScreenAdjustedAccelerationIncludingGravity();

    return isPresent(snapshot) && isPresent(snapshot.x) && isPresent(snapshot.y) && isPresent(snapshot.z);
  };

  GyroNorm.prototype.isRotationRateAvailable = function() {
    var snapshot = this._getScreenAdjustedRotationRate();

    return isPresent(snapshot) && isPresent(snapshot.alpha) && isPresent(snapshot.beta) && isPresent(snapshot.gamma);
  };


  /*
  *
  * Returns if certain type of event is available on the device
  *
  * @param String eventType - possible values are "deviceorientation" , "devicemotion" , "compassneedscalibration"
  *
  * @return true if event is available false if not
  *
  */
  GyroNorm.prototype.isAvailable = function(eventType) {

    var rotRateSnapShot = this._dm.getScreenAdjustedRotationRate();

    switch (eventType) {
      case DEVICE_ORIENTATION:
        return this.isDeviceOrientationAvailable();

      case ACCELERATION:
        return this.isAccelerationAvailable();

      case ACCELERATION_INCLUDING_GRAVITY:
        return this.isAccelerationIncludingGravityAvailable();

      case ROTATION_RATE:
        return this.isRotationRateAvailable();

      default:
        return {
          deviceOrientationAvailable: this.isDeviceOrientationAvailable(),
          accelerationAvailable: this.isAccelerationAvailable(),
          accelerationIncludingGravityAvailable: this.isAccelerationIncludingGravityAvailable(),
          rotationRateAvailable: this.isRotationRateAvailable()
        }
    }
  };

  /*
  *
  * Takes a snapshot of the current deviceo orientation and device motion values
  *
  */
  function snapShot(gn) {
    var doSnapShot = {};

    if (gn._screenAdjusted) {
      doSnapShot = gn._do.getScreenAdjustedEuler();
    } else {
      doSnapShot = gn._do.getFixedFrameEuler();
    }

    var accSnapShot = gn._dm.getScreenAdjustedAcceleration();
    var accGraSnapShot = gn._dm.getScreenAdjustedAccelerationIncludingGravity();
    var rotRateSnapShot = gn._dm.getScreenAdjustedRotationRate();

    var alphaToSend = 0;

    if (gn._orientationBase === GAME) {
      alphaToSend = doSnapShot.alpha - gn._calibrationValue;
      alphaToSend = (alphaToSend < 0) ? (360 - Math.abs(alphaToSend)) : alphaToSend;
    } else {
      alphaToSend = doSnapShot.alpha;
    }

    var dc = gn._decimalCount;

    var snapShot = {
      do: {
        alpha: rnd(alphaToSend, dc),
        beta: rnd(doSnapShot.beta, dc),
        gamma: rnd(doSnapShot.gamma, dc),
        absolute: gn._do.isAbsolute()
      },
      dm: {
        x: rnd(accSnapShot.x, dc),
        y: rnd(accSnapShot.y, dc),
        z: rnd(accSnapShot.z, dc),
        gx: rnd(accGraSnapShot.x, dc),
        gy: rnd(accGraSnapShot.y, dc),
        gz: rnd(accGraSnapShot.z, dc),
        alpha: rnd(rotRateSnapShot.alpha, dc),
        beta: rnd(rotRateSnapShot.beta, dc),
        gamma: rnd(rotRateSnapShot.gamma, dc)
      }
    };

    // Normalize gravity
    if (gn._gravityNormalized) {
      snapShot.dm.gx *= gn._gravityCoefficient;
      snapShot.dm.gy *= gn._gravityCoefficient;
      snapShot.dm.gz *= gn._gravityCoefficient;
    }

    return snapShot;
  }

  /*
  *
  * Returns boolean value if the GyroNorm is running
  *
  */
  GyroNorm.prototype.isRunning = function() {
    return this._isRunning;
  }

  /*
  *
  * Starts listening to orientation event on the window object
  *
  */
  GyroNorm.prototype._log = function(err) {
    if (this._logger) {
      if (typeof(err) == 'string') {
        err = { message: err, code: 0 };
      }
      this._logger(err);
    }
  };

  /*
   * Sets up the deviceMotionController
   */
  GyroNorm.prototype._getDeviceMotionController = function() {
    return new FULLTILT.getDeviceMotion();
  };

  /*
   * Sets up the deviceOrientationController
   */
  GyroNorm.prototype._getDeviceOrientationController = function() {
    return new FULLTILT.getDeviceOrientation({ 'type': this._orientationBase });
  };

  /*
   * Retrieves and "calculates" the gravityCoefficient from the deviceMotionController.
   */
  GyroNorm.prototype._getGravityCoefficient = function() {
    if (isNone(this._dm)) {
      return 0;
    }
    return (this._dm.getScreenAdjustedAccelerationIncludingGravity().z > 0) ? -1 : 1;
  };

  GyroNorm.prototype._getScreenAdjustedEuler = function() {
    if (isNone(this._do)) {
      return null;
    }

    return this._do.getScreenAdjustedEuler();
  };

  GyroNorm.prototype._getScreenAdjustedAcceleration = function() {
    if (isNone(this._dm)) {
      return null;
    }

    return this._dm.getScreenAdjustedAcceleration();
  };

  GyroNorm.prototype._getScreenAdjustedAccelerationIncludingGravity = function() {
    if (isNone(this._dm)) {
      return null;
    }

    return this._dm._getScreenAdjustedAccelerationIncludingGravity();
  };

  GyroNorm.prototype._getScreenAdjustedRotationRate = function() {
    if (isNone(this._dm)) {
      return null;
    }

    return this._dm.getScreenAdjustedRotationRate();
  };

  /*
  *
  * Utility function to round with digits after the decimal point
  *
  * @param float number - the original number to round
  *
  */
  function rnd(number, decimalCount) {
    return Math.round(number * Math.pow(10, decimalCount)) / Math.pow(10, decimalCount);
  }

  /*
  *  Returns true if the passed value is null or undefined.
  *
  * @method isNone
  * @param {Object} val Value to test
  * @return {Boolean}
  */
  function isNone(val) {
    return val === null || val === undefined;
  }

  /*
   * Returns true if the passed value is not null or undefined.
   *
   * @method isPresent
   * @param {Object} val Value to test
   * @return {Boolean}
   */
  function isPresent(val) {
    return !isNone(val);
  }

  return GyroNorm;
}));
