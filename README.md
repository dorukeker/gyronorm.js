#gyronorm.js
Accesses the gyroscope and accelerometer data from the web browser and combines them in one JS object.

It has options uniform the alpha value, and normalize the gravity related values across different devices. You can find more about these differences [here](http://dorukeker.com/know-thy-gyroscope-and-js-part-ii/)

##How to use
Add the JS file in the head part of your HTML

	<script src="js/gyronorm.js"></script>

Initiize the gn object

Start the gn object. Access the values in the callback function of the gn.start() function.

	<script src="/js/gyronorm.js"></script>
	
    	gn.init();
    	gn.track(function(data){
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
You can pass an object of arguments to the gn.init() function. The values of that object overwrites the default values.

	var args = {
		frequency:50	
	}

###Methods

###Error Handling

##Compatibility

##Road Map
