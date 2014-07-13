#gyronorm.js
Accesses the gyroscope and accelerometer data from the web browser and combines them in one JS object.

It has options uniform the alpha value, and normalize the gravity related values across different devices. You can find more about these differences [here](http://dorukeker.com/know-thy-gyroscope-and-js-part-ii/)

##How to use
- Add the JS file in the head part of your HTML
- Initiize the gn object
- Start the gn object

	<script src="/js/gyronorm.js"></script>
	<script>
    		gn.init();
    		gn.track(function(data){
    			// Process:
			// data.do.alpha
			// data.do.beta
			// data.do.gamma
		
			// data.dm.x
			// data.dm.y
			// data.dm.z
		
			// data.dm.gx
			// data.dm.gy
			// data.dm.gz
			
			// data.dm.alpha
			// data.dm.beta
			// data.dm.gamma
		});
	</script>


###Options

###Methods

###Error Handling

##Compatibility

##Road Map
