#gyronorm.js
Accesses the gyroscope and accelerometer data from the web browser and combines them in one JS object.

It has options to uniform the alpha value, and normalize the gravity related values. It returns consistent values across different devices. You can find more about these differences [here](http://dorukeker.com/know-thy-gyroscope-and-js-part-ii/)

##How to use
Add the JS file to your HTML

	<script src="js/gyronorm.js"></script>

Initialiize and start the <em>gn</em> object

Access the values in the callback function of the <em>gn.start()</em>

	<script src="/js/gyronorm.js"></script>
	
    	gn.init();
    	gn.start(function(data){
    		// Process:
			// data.do.alpha	( deviceorientation event alpha value )
			// data.do.beta		( deviceorientation event beta value )
			// data.do.gamma	( deviceorientation event gamma value )
		
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
	
###Options
You can pass arguments as an object to the <em>gn.init()</em> function. The values you pass overwrites the default values. Below is the list of available options and their default values.

	var args = {
		frequency:50,					// ( how often the object sends the values - milliseconds )
		gravityNormalized:true,			// ( if the garvity related values to be normalized )
		directionAbsolute:false,		// ( if the do.alpha value is absolute, if false the value is relative to the initial position of the device )
		decimalCount:2					// ( how many digits after the decimal point wil there be in the return values )
	}
	
	gn.init(args);

###Methods
####gn.init()
- Adds the event listeners to the window object
- If extra arguments are provided overwrites the default options (see above)

Call this method before everyting else

#####Syntax

	gn.init(args);

#####Parameters

args - Object. Passes the values to overwrite the default option values. See above for usage. 

		
####gn.start()

####gn.normalizeGravity()

####gn.giveAbsoluteOrientation()

####gn.setHeadDirection()

####gn.stop()

####gn.end()

###Error Handling

##Compatibility

##Road Map
