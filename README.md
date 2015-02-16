#gyronorm.js
Accesses the gyroscope and accelerometer data from the web browser and combines them in one JS object.

It returns consistent values across different devices. It has options to return game-based or world-based alpha values (rotation around z-axis), and normalize the gravity-related values. You can find more about the differences across devices [here](http://dorukeker.com/know-thy-gyroscope-and-js-part-ii/)

##Installation
You can clone from this GitHub repository or use Bower.
	
	$ bower install gyronorm

This version of gyronorm.js is built on top of the [FullTilt](https://github.com/richtr/Full-Tilt) project which uses [JavaScript Promises](https://www.promisejs.org/). You do not need to install them seperately. Both the FullTilt library and the polyfill for JS Promises will come as dependencies of gyronorm.js

##How to add

For production, add the minified version of gyronorm.js

	<script src="<path_to_js_files>/gyronorm.min.js"></script>

If you want to use the un-minified version (for instance for development), then you need to add the FullTilt and the Promises polyfill.

	<script src="<path_to_js_files>/promise.min.js"></script>
	<script src="<path_to_js_files>/fulltilt.min.js"></script>
	<script src="<path_to_js_files>/gyronorm.js"></script>

##How to use

Initialize the `gn` object by calling the `gn.init()` function which returns a promise. Start the `gn` object when this promise resolves.

Access the values in the callback function of the `gn.start()`

	<script src="<path_to_js_files>/gyronorm.min.js"></script>
	
	<script type="text/javascript">
	    var gn = new GyroNorm();
	    gn.init().then(function(){
	    	gn.start(function(data){
		   		// Process:
				// data.do.alpha	( deviceorientation event alpha value )
				// data.do.beta		( deviceorientation event beta value )
				// data.do.gamma	( deviceorientation event gamma value )
				// data.do.absolute	( deviceorientation event absolute value )
				
				// data.dm.x		( devicemotion event acceleration x value )
				// data.dm.y		( devicemotion event acceleration y value )
				// data.dm.z		( devicemotion event acceleration z value )
				
				// data.dm.gx		( devicemotion event accelerationIncludingGravity x value )
				// data.dm.gy		( devicemotion event accelerationIncludingGravity y value )
				// data.dm.gz		( devicemotion event accelerationIncludingGravity z value )
					
				// data.dm.alpha	( devicemotion event rotationRate alpha value )
				// data.dm.beta		( devicemotion event rotationRate beta value )
				// data.dm.gamma	( devicemotion event rotationRate gamma value )
			});
		});
	</script    	

###Backward Compatibility
There are some breaking changes from 1.x to 2.x versions. You can find the details here.
	
###Options
You can pass arguments as an object to the to the constructor `init`. The values you pass overwrites the default values. Below is the list of available options and their default values.

	var args = {
		frequency:50,					// ( how often the object sends the values - milliseconds )
		gravityNormalized:true,			// ( if the garvity related values to be normalized )
		orientationBase:gn.EULER,		// ( Can be GyroNorm.GAME or GyroNorm.WORLD. GyroNorm.GAME returns orientation values with respect to the head direction of the device. GyroNorm.WORLD returns the orientation values with respect to the actual north direction of the world. )
		decimalCount:2,					// ( how many digits after the decimal point will there be in the return values )
		logger:null,					// ( function to be called to log messages from GyroNorm )
		screenAdjusted:false			// ( If set to true it will return screen adjusted values. )
	}
	
	var gn = new GyroNorm(args);

###Methods
####GyroNorm()
Instantiate a new gyronorm instance.

####init()
Returns a promise object that resolves when gyronorm is ready. (Attempt to add events to Window object is complete). If extra arguments are provided overwrites the default options (see above).

Make sure to call all other function after this promise resolves.

#####Syntax

	gn.init(args);

#####Parameters

args - object (optional) - Passes the values to overwrite the default option values. See above for usage. 

####start()

Starts returning values via the callback function. The callback function is called every many milliseconds defined by the <em>frequency</em> option. See above on how to set the <em>frequency</em>. The default frequency is 50ms.

#####Syntax

	gn.start(callback);

#####Parameters

callback - function(data) - Function that returns values via the <em>data</em> object. The available values via <em>data</em> are listed above. 

####isAvailable()

Tells the availability of device orientation or device motion values on the device+browser combination.

#####Syntax

	gn.isAvailable(valueType);
	
	// or
	
	gn.isAvailable();

#####Parameters

valueType - string - optional - If passed, the method returns `true` or `false`, depending on the availablity of the specified value. Possible values are `gn.DEVICE_ORIENTATION`,`gn.ACCELERATION`,`gn.ACCELERATION_INCLUDING_GRAVITY` or `gn.ROTATION_RATE`

When called without a parameter returns availibility for all values.

#####Example
	
	var gn = new GyroNorm();
	gn.init().then(ongnReady);
	var ongnReady = function(){
		var doAvailable = gn.isAvailable(gn.DEVICE_ORIENTATION);
		// Parameter can also be gn.DEVICE_ORIENTATION, gn.ACCELERATION, gn.ACCELERATION_INCLUDING_GRAVITY or gn.ROTATION_RATE
		// This example returns true if deviceorientation is available. Returns false if not.
		
		var gnAvailable = gn.isAvailable();
		/* Returns the following object
			{
				deviceOrientationAvailable : <true or false>,		
				accelerationAvailable : <true or false>,
				accelerationIncludingGravityAvailable : <true or false>,
				rotationRateAvailable : <true or false>,
				compassNeedsCalibrationAvailable : <true or false>
			}
		*/
	}

####normalizeGravity()

Changes the value of the <em>gravityNormalized</em> option. Even when GyroNorm is running.

#####Syntax

	gn.normalizeGravity(flag);

#####Parameters

flag - boolean - <em>true</em> sets the option <em>gravityNormalized</em> on, <em>false</em> set it to off.

#####Example
	
	var gn = new GyroNorm();
	gn.init().then(ongnReady);
	var ongnReady = function(){
		gn.start(function(){
			// Process return values here
		});
	}

	// At this point callback function returns normalized gravity-related values.

	gn.normalizeGravity(false);

	// At this point callback function returns native values gravity-related as provided by the device.		

####setHeadDirection()

Must be called after the `start()` method. This can only be used if gyronorm is tracking game-based and not-screen-adjusted values.

When called, the callback function starts returning the <em>do.alpha</em> value relative to the current head direction of the device.

It will return `true` if head direction is set successfully; `false` if not. 

#####Syntax

	gn.setHeadDirection();

#####Example

	var gn = new GyroNorm();
	gn.init().then(ongnReady);
	var ongnReady = function(){
		gn.start(function(){
			// Process return values here
		});
	}

	// At this point callback function returns do.alpha values relative to the initial position of the device

	gn.setHeadDirection();

	// At this point callback function starts to return do.alpha values relative to the position of the device when the above line is called

####stop()

Stops executing the callback function, that was started by the `start()` method. It does not remove the event listeners. If you want to remove the event listeners you should call `end()` method.

#####Syntax

	gn.stop();

####end()

Stops executing the callback function, that was started by the `start()` method. Also removes the event listeners.

#####Syntax

	gn.end();

####isRunning()

Returns boolean value showing if the `gn` object is running. It starts running when `gn.start()` is called and returns values to the callback function. It stops when `gn.stop()` or `gn.end()` is called.

#####Syntax

	gn.isRunning();
	// Returns true or false

###Error Handling

GyroNorm can return errors and log messages. You need to define a function to handle those message.

You can do this with the options when initializing the object.
	
	var args = {logger:function(data){
		// Do something with the data
	}}

	var gn = new GyroNorm();
	gn.init(args).then( ... );	

You can also set the log listener function at a later point using the `startLogging()` function.

	var gn = new GyroNorm();
	gn.init().then( ... );

	gn.startLogging(function(data){
		// Do something with the data
	});

At any point you can call the `stopLogging()` function to stop logging.

	var args = {logger:function(data){
		// Do something with the data
	}}

	var gn = new GyroNorm();
	gn.init(args).then( ... );

	gn.stopLogging();

In the case that a handler function for the log messages is not defined, those messages will be ignored silently.
The return value `data` is an object with two parameters

####data.code

A log code that you can check on.

#####Availabele codes

- 0: Errors thrown by the system and caugth by gyronorm.js
- 1: gyronorm is not initialized so the event listeners are not added yet. You get this if you try to call `gn.start()` before `gn.init()`

####data.message

The human-readable message.

##Compatibility

Below is a list of device/operating system/browser combinations. The demo.html file worked on them out of the box. I will update this list in the future. Please also share your findings so we can have a more complete list.

- iPhone 5 - iOS 8.0.2 - Safari
- iPhone 4 - iOS 6.x - Safari
- HTC One - Android 4.2.2 - Native Browser
- HTC One - Android 4.2.2 - Chrome 35.0.1916.141
- HTC One - Android 4.2.2 - Firefox 31.0
- Samsung Galaxy S5 - Android 4.4.2 - Native Browser
- Samsung Galaxy S5 - Android 4.4.2 - Chrome 35.0.1916.141

##Next Steps

Below is a list of things I plan to add in the future. Please note that it is not a definitive or prioritized list. I will add these features as I need them or as I have time.

- Option to track deviceorientation and devicemotion events seperately
- Providing alpha values even in the calibration mode
- Option to get snap shot of the values (currently it is only tracking)

##Contact

You can find me on Twitter [@dorukeker](https://twitter.com/dorukeker) or check my web site http://dorukeker.com
