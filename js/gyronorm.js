/**
* JavaScript project for accessing and normalizing the accelerometer and gyroscope data on mobile devices
*
* @author Doruk Eker <dorukeker@gmail.com>
* @copyright 2014 Doruk Eker <http://dorukeker.com>
* @version 0.0.10
* @license MIT License | http://opensource.org/licenses/MIT 
*/

(function (root, factory) {
  if(typeof define === "function" && define.amd) {
    define(function(){
      return (root.GyroNorm = factory());
    });
  } else if(typeof module === "object" && module.exports) {
    module.exports = (root.GyroNorm = factory());
  } else {
    root.GyroNorm = factory();
  }
}(this, function() {
  	/*-------------------------------------------------------*/
	/* PRIVATE VARIABLES */

	var _interval = null;							// Timer to return values
	var _isCalibrating = false;						// Flag if calibrating
	var _calibrationValues = new Array();			// Array to store values when calculating alpha offset 
	var _calibrationValue = 0;						// Alpha offset value
	var _gravityCoefficient = 0;					// Coefficient to normalze gravity related values
	var _logger = null;								// Function to callback on error. There is no default value. It can only be set by the user on gn.init()
	var _deviceOrientationAvailable = true;			// Boolean flag if deviceorientation event is available on the device/browser
	var _deviceMotionAvailable = true;				// Boolean flag if devicemotion event is available on the device/browser
	var _compassNeedsCalibrationAvailable = true;	// Boolean flag if devicemotion event is available on the device/browser

	/* OPTIONS */
	var _frequency 				= 50;		// Frequency for the return data in milliseconds
	var _gravityNormalized		= true;		// Flag if to normalize gravity values
	var _directionAbsolute		= false;	// Flag if to return absolute or relative alpha values
	var _decimalCount			= 2;		// Number of digits after the decimals point for the return values

	var _values = {
		do:{
			alpha:0,
			beta:0,
			gamma:0,
			absolute:false
		},
		dm:{
			x:0,
			y:0,
			z:0,
			gx:0,
			gy:0,
			gz:0,
			alpha:0,
			beta:0,
			gamma:0
		}
	}

	/*-------------------------------------------------------*/
	/* PUBLIC FUNCTIONS */

	/*
	*
	* Constructor function
	* 
	* @param object options - values are as follows. If set in the init function they overwrite the default option values 
	* @param int options.frequency
	* @param boolean options.gravityNormalized
	* @param boolean options.directionAbsolute
	* @param boolean options.decimalCount
	* @param function options.logger
	*
	*/

	var GyroNorm = function(options){
		// Assign options that are passed with the constructor function
		if(options && options.frequency) _frequency = options.frequency;
		if(options && options.gravityNormalized) _gravityNormalized = options.gravityNormalized;
		if(options && options.directionAbsolute) _directionAbsolute = options.directionAbsolute;
		if(options && options.decimalCount) _decimalCount = options.decimalCount;
		if(options && options.logger) _logger = options.logger;

		try{
			calibrate();
			setupListeners();
		} catch(err){
			log(err);
		}
	}

	/*
	*
	* Stops all the tracking and listening on the window objects
	*
	*/
	GyroNorm.prototype.end = function(){
		try{
			this.stop();
			window.removeEventListener('deviceorientation',onDeviceOrientationHandler);
			window.removeEventListener('devicemotion',onDeviceMotionHandler);
			window.removeEventListener('compassneedscalibration',onCompassNeedsCalibrationHandler);
		} catch(err){
			log(err);
		}
	}

	/*
	*
	* Starts tracking the values
	* 
	* @param function callback - Callback function to read the values
	*
	*/
	GyroNorm.prototype.start = function(callback){
		calibrate();
		_interval = setInterval(function(){
			callback(snapShot());	
		},_frequency);
	}

	/*
	*
	* Stops tracking the values
	*
	*/
	GyroNorm.prototype.stop = function(){
		if(_interval){
			clearInterval(_interval);
		}
	}

	/*
	*
	* Toggles if to normalize gravity related values
	* 
	* @param boolean flag
	*
	*/
	GyroNorm.prototype.normalizeGravity = function(flag){
		_gravityNormalized = (flag)?true:false;
	}


	/*
	*
	* Toggles if to give absolute orientation values
	* 
	* @param boolean flag
	*
	*/
	GyroNorm.prototype.giveAbsoluteDirection = function(flag){
		_directionAbsolute = (flag)?true:false;
	}

	/*
	*
	* Sets the current alpha value as "0"
	*
	*/
	GyroNorm.prototype.setHeadDirection = function(){
		_directionAbsolute = false;
		calibrate();
	}

	/*
	*
	* Sets the log function
	*
	*/
	GyroNorm.prototype.startLogging = function(logger){
		if(logger){
			_logger = logger;
		}
	}

	/*
	*
	* Sets the log function to null which stops the logging
	*
	*/
	GyroNorm.prototype.stopLogging = function(){
		_logger = null;
	}

	/*
	*
	* Returns if certain type of event is available on the device
	* 
	* @param string _eventType - possible values are "deviceorientation" , "devicemotion" , "compassneedscalibration"
	* 
	* @return true if event is available false if not
	*
	*/
	GyroNorm.prototype.isAvailable = function(_eventType){
		switch(_eventType){
			case 'deviceorientation':
			return _deviceOrientationAvailable;
			break;

			case 'devicemotion':
			return _deviceMotionAvailable;
			break;

			case 'compassneedscalibration':
			return _compassNeedsCalibrationAvailable;
			break;
		}
	}

	/*-------------------------------------------------------*/
	/* PRIVATE FUNCTIONS */

	/*
	*
	* Starts listening to the eventa on the window object
	*
	*/
	function setupListeners(){

		if(window.ondeviceorientation === undefined){
			_deviceOrientationAvailable = false;
		} else {
			window.ondeviceorientation = onDeviceOrientationHandler;	
		}

		if(window.ondevicemotion === undefined){
			_deviceMotionAvailable = false;
		} else {
			window.ondevicemotion = onDeviceMotionHandler;	
		}

		if(window.oncompassneedscalibration === undefined){
			_compassNeedsCalibrationAvailable = false;
		} else {
			window.oncompassneedscalibration = onCompassNeedsCalibrationHandler;	
		}		
	}

	/*
	*
	* Gets called only in calibration mode. Gets the mean value of the alpha deviations. And stores it as calibration.
	*
	*/
	function updateCalibration(){
		if(_calibrationValues.length > 19){
			_calibrationValues.splice(0,5);
			var total = 0;
			for(var i = 0 ; i < _calibrationValues.length ; i++){
				total += _calibrationValues[i];
			}
			_calibrationValue = parseInt(total / 15);
			_isCalibrating = false;
		}
	}

	/*
	*
	* Handler for device orientation event
	*
	*/
	function onDeviceOrientationHandler(event){
		// Check if values are returned correctly
		if(!event.alpha && !event.beta && !event.gamma){
			_deviceOrientationAvailable = false;
			log({message:'Device orientation event values are not returned as expected.' , code:2 });
			window.removeEventListener('deviceorientation',onDeviceOrientationHandler);
		}

		// For the first 20 values add the alpha to calibration list
		if(_isCalibrating){
			_calibrationValues.push(event.alpha);
			updateCalibration();
			return;
		}

		// Assign event values to the object values
		_values.do.alpha = event.alpha;
		_values.do.beta = event.beta;
		_values.do.gamma = event.gamma;
		_values.do.absolute = event.absolute;
	}

	/*
	*
	* Handler for device motion event
	*
	*/
	function onDeviceMotionHandler(event){

		// Assign gravity coefficient. Assumes that the user is holding the phot up right facing the screen.
		// If you cannot make this assumption because of the usecase, disable the normalization via changing the option 'gravityNormalized' value to false
		if(_gravityCoefficient == 0){
			_gravityCoefficient = (event.accelerationIncludingGravity.z < 0)?1:-1;
			return;
		}

		// Assign event values to the object values
		_values.dm.x = event.acceleration.x;
		_values.dm.y = event.acceleration.y;
		_values.dm.z = event.acceleration.z;

		_values.dm.gx = event.accelerationIncludingGravity.x;
		_values.dm.gy = event.accelerationIncludingGravity.y;
		_values.dm.gz = event.accelerationIncludingGravity.z;	

		_values.dm.alpha = event.rotationRate.alpha;
		_values.dm.beta = event.rotationRate.beta;
		_values.dm.gamma = event.rotationRate.gamma;
	}

	/*
	*
	* Handler for device motion event
	*
	*/
	function onCompassNeedsCalibrationHandler(event){

		log({message:'Compass is not calibrated.' , code:3});

	}

	/*
	*
	* Utility function to round with digits after the decimal point
	*
	* @param float number - the original number to round
	*
	*/
	function rnd(number){
		return Math.round(number * Math.pow(10 , _decimalCount)) / Math.pow(10 , _decimalCount);
	}

	/*
	*
	* Starts calibration
	*
	*/
	function calibrate(){
		_isCalibrating = true;
		_calibrationValues = new Array();
	}


	/*
	*
	* Takes a snapshot of the values
	*
	*/
	function snapShot(){

		// Send absolute or relative alpha. Default is relative.
		var alphaToSend = 0;
		if(!_directionAbsolute){
			alphaToSend = _values.do.alpha - _calibrationValue;
			alphaToSend = (alphaToSend < 0)?(360 - Math.abs(alphaToSend)):alphaToSend;
		} else {
			alphaToSend = _values.do.alpha;
		}

		var snapShot = {
			do:{
				alpha:rnd(alphaToSend),
				beta:rnd(_values.do.beta),
				gamma:rnd(_values.do.gamma),
				absolute:_values.do.absolute
			},
			dm:{
				x:rnd(_values.dm.x),
				y:rnd(_values.dm.y),
				z:rnd(_values.dm.z),
				gx:rnd(_values.dm.gx),
				gy:rnd(_values.dm.gy),
				gz:rnd(_values.dm.gz),
				alpha:rnd(_values.dm.alpha),
				beta:rnd(_values.dm.beta),
				gamma:rnd(_values.dm.gamma)
			}
		};

		// Normalize gravity
		if(_gravityNormalized){
			snapShot.dm.gx *= _gravityCoefficient;
			snapShot.dm.gy *= _gravityCoefficient;
			snapShot.dm.gz *= _gravityCoefficient;
		}	

		return snapShot;
	}


	/*
	*
	* Starts listening to orientation event on the window object
	*
	*/
	function log(err){
		if(_logger){
			if(typeof(err) == 'string'){
				err = {message:err , code:0}
			}
			_logger(err);
		}
	}


	return GyroNorm;
}));