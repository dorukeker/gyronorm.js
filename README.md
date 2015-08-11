#gyronorm.js
Accesses the gyroscope and accelerometer data from the web browser and combines them in one JS object.

It returns consistent values across different devices. It has options to return game-based or world-based alpha values (rotation around z-axis), and normalize the gravity-related values. You can find more about the differences across devices [here](http://dorukeker.com/know-thy-gyroscope-and-js-part-ii/)

##Installation
You can clone from this GitHub repository or use Bower.

```sh	
$ bower install gyronorm
```

This version of gyronorm.js is built on top of the [FullTilt](https://github.com/richtr/Full-Tilt) project which uses [JavaScript Promises](https://www.promisejs.org/). You do not need to install them seperately. Both the FullTilt library and the polyfill for JS Promises will come as dependencies of gyronorm.js

##How to add

For production, add the minified complete version of gyronorm.js which is under the `/dist` folder.

```html
<script src="<path_to_js_files>/gyronorm.complete.min.js"></script>
```

If you want to use the un-minified version (for instance for development), then you need to add the FullTilt and the Promises polyfill.

```html
<script src="<path_to_js_files>/promise.min.js"></script>
<script src="<path_to_js_files>/fulltilt.min.js"></script>
<script src="<path_to_js_files>/gyronorm.js"></script>
```

##How to use

Initialize the `gn` object by calling the `gn.init()` function which returns a promise. Start the `gn` object when this promise resolves.

Access the values in the callback function of the `gn.start()`

```html
<script src="<path_to_js_files>/gyronorm.complete.min.js"></script>

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
	}).catch(function(e){
	  // Catch if the DeviceOrientation or DeviceMotion is not supported by the browser or device
	});
</script>
```

###Backward compatibility
There are some breaking changes from 1.x to 2.x versions. You can find the details [here](https://github.com/dorukeker/gyronorm.js/wiki/Breaking-changes-from-1.x-to-2.x).
	
###Options
You can pass arguments as an object to the `init()` function. The values you pass overwrites the default values. Below is the list of available options and their default values.

```js
var args = {
	frequency:50,					// ( How often the object sends the values - milliseconds )
	gravityNormalized:true,			// ( If the garvity related values to be normalized )
	orientationBase:GyroNorm.GAME,		// ( Can be GyroNorm.GAME or GyroNorm.WORLD. gn.GAME returns orientation values with respect to the head direction of the device. gn.WORLD returns the orientation values with respect to the actual north direction of the world. )
	decimalCount:2,					// ( How many digits after the decimal point will there be in the return values )
	logger:null,					// ( Function to be called to log messages from gyronorm.js )
	screenAdjusted:false			// ( If set to true it will return screen adjusted values. )
};

var gn = new GyroNorm();

gn.init(args).then( ... );
```

###Older devices
In some of the older devices the polyfill for the JS Promises does not work properly. This might cause all or a part of your JavaScript code to break. Try adding the following line before you instantiate GyroNorm.

```js
var Promise = Promise || ES6Promise.Promise;
```

##API Documentation

[gyronorm.js API Documentation](https://github.com/dorukeker/gyronorm.js/wiki/API-Documentaion)

##Error handling

gyronorm.js can return errors and log messages. You need to define a function to handle those message.

You can do this with the options when initializing the object.

```js	
var args = {
	logger:function(data){
		// Do something with the data
	}
};

var gn = new GyroNorm();

gn.init(args).then( ... );
```

You can also set the log listener function at a later point using the `startLogging()` function.

```js
var gn = new GyroNorm();

gn.init().then( ... );

gn.startLogging(function(data){
	// Do something with the data
});
```

At any point you can call the `stopLogging()` function to stop logging.

```js
var args = {
	logger:function(data){
		// Do something with the data
	}
};

var gn = new GyroNorm();

gn.init(args).then( ... );

gn.stopLogging();
```

In the case that a handler function for the log messages is not defined, those messages will be ignored silently.
The return value `data` is an object with two parameters

###data.code

A log code that you can check on.

####Availabele codes

- 0: Errors thrown by the system and caugth by gyronorm.js
- 1: GyroNorm object is not initialized so the event listeners are not added yet. You get this if you try to call `gn.start()` before `gn.init()`

###data.message

The human-readable message.

##Compatibility

I have tested with most Android and iOS phones of the last 2-3 years and the `demo/index.html` worked out of the box. Let me know if you have issues with a specific device+browser and I will try to find out.

##Contact

You can find me on Twitter [@dorukeker](https://twitter.com/dorukeker) or check my web site http://dorukeker.com
