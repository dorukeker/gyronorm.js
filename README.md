#gyronorm.js
Accesses the gyroscope and accelerometer data from the web browser and combines them in one JS object.

It returns consistent values across different devices. It has options to uniform the alpha value (rotation around z-axis), and normalize the gravity-related values. You can find more about the differences across devices [here](http://dorukeker.com/know-thy-gyroscope-and-js-part-ii/)

##Installation
You can clone from this GitHub repository or use Bower.
	
	$ bower install gyronorm

##How to use
Add the JS file to your HTML

	<script src="js/gyronorm.js"></script>

Initialize and start the <em>gn</em> object. Good practice is to start the object in the `ready` callback function, which you pass when initializing. 

Access the values in the callback function of the `gn.start()`

	<script src="/js/gyronorm.js"></script>
	
    	var args = {read:ongnReady};
    	var gn = new GyroNorm(args);
    	
	var ongnReady = function(){
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
	}
		
###Backward Compatibility
In the previous version you were able to initialize and start the <em>gn</em> object directly, without the `ready` function

	var gn = new GyroNorm();
	gn.start(function(data){ ... });
		
This method still works. However the return values from the `gn.isAvailable()` function will not be reliable. I recommend to use the `ready` callback function as described above.
	
###Options
You can pass arguments as an object to the to the constructor method. The values you pass overwrites the default values. Below is the list of available options and their default values.

	var args = {
		frequency:50,					// ( how often the object sends the values - milliseconds )
		gravityNormalized:true,			// ( if the garvity related values to be normalized )
		directionAbsolute:false,		// ( if the do.alpha value is absolute, if false the value is relative to the initial position of the device )
		decimalCount:2					// ( how many digits after the decimal point wil there be in the return values )
		logger:null						// ( function to be called to log messages from GyroNorm )
		ready:null						// ( callback function to be called when the availability of the events and values are known ) 
	}
	
	var gn = new GyroNorm(args);

###Methods
####GyroNorm()
Instantiate gyronorm instance. Adds event listeners to the window object. If extra arguments are provided overwrites the default options (see above).

#####Syntax

	var gn = new GyroNorm(args);

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

valueType - string - optional - If passed, the method returns `true` or `false`, depending on the availablity of the specified value. Possible values are `deviceorientation`,`acceleration`,`accelerationinludinggravity`,`rotationrate` or `compassneedscalibration`

When called without a parameter returns availibility for values.

#####Example
	
	var args = {ready:ongnReady};
	var gn = new GyroNorm(args);
	var ongnReady = function(){
		var doAvailable = gn.isAvailable("deviceorientation");
		// Parameter can also be "acceleration","accelerationinludinggravity","rotationrate" or "compassneedscalibration"
		// This example returns true if deviceorientation is available. Returns false if not.
		
		var gnAvailable = gn.isAvailable();
		/* Returns the following object
			{
				deviceOrientationAvailable : true/false,		
				accelerationAvailable : true/false,
				accelerationIncludingGravityAvailable : true/false,
				rotationRateAvailable : true/false,
				compassNeedsCalibrationAvailable : true/false
			}
		*/
	}

####normalizeGravity()

Changes the value of the <em>gravityNormalized</em> option. It can be called any time.

#####Syntax

	gn.normalizeGravity(flag);

#####Parameters

flag - boolean - <em>true</em> sets the option <em>gravityNormalized</em> on, <em>false</em> set it to off.

#####Example
	
	var args = {ready:ongnReady};
	var gn = new GyroNorm(args);
	var ongnReady = function(){
		gn.start(function(){
			// Process return values here
		});
	}

	// At this point callback function returns normalized gravity-related values.

	gn.normalizeGravity(false);

	// At this point callback function returns native values gravity-related as provided by the device.		

####giveAbsoluteDirection()

Changes the value of the <em>directionAbsolute</em> option. It can be called any time.

#####Syntax

	gn.giveAbsoluteDirection(flag);

#####Parameters

flag - boolean - <em>true</em> sets the option <em>directionAbsolute</em> on, <em>false</em> set it to off.

#####Example

	var args = {ready:ongnReady};
	var gn = new GyroNorm(args);
	var ongnReady = function(){
		gn.start(function(){
			// Process return values here
		});
	}

	// At this point callback function returns do.alpha values relative to the initial position of the device

	gn.giveAbsoluteDirection(true);

	// At this point callback function returns do.alpha values as provided by the device.	

####setHeadDirection()

Must be called after the `start()` method. When called, the callback function starts returning the <em>do.alpha</em> value relative to the current head direction of the device.

Once this method is called <em>directionAbsolute</em> option is also set to <em>false</em>

#####Syntax

	gn.setHeadDirection();

#####Example

	var args = {ready:ongnReady};
	var gn = new GyroNorm(args);
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

###Error Handling

GyroNorm can return errors and log messages. You need to define a function to handle those message.

You can do this with the options when initializing the object.
	
	var args = {logger:function(data){
		// Do something with the data
	}}

	var gn = new GyroNorm(args);
	
You can also set the log listener function at a later point using the `startLogging()` function.

	var gn = new GyroNorm();

	gn.startLogging(function(data){
		// Do something with the data
	});

At any point you can call the `stopLogging()` function to stop logging.

	var args = {logger:function(data){
		// Do something with the data
	}}

	var gn = new GyroNorm(args);

	gn.stopLogging();

In the case that a handler function for the log messages is not defined, those messages will be ignored silently.
The return value `data` is an object with two parameters

####data.code

A log code that you can check on.

#####Availabele codes

- 0: Errors thrown by the system and caugth by gyronorm.js
- 1: gyronorm is not initialized so the event listeners are not added yet. You get this if you try to call `gn.start()` before `gn.init()`
- 2: The deviceOrientation event of the window seems to be available but not returning the expected values.
- 3: Device compass is not calibrated

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
- Boolean value to check if GyroNorm is tracking or not

##Contact

You can find me on Twitter [@dorukeker](https://twitter.com/dorukeker) or check my web site http://dorukeker.com
