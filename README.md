Dear All, It has been almost 5 years since I first wrote this library. In the mean time JS evolved a lot; and parallel to this I grow apart from the JS world. Therefore I dont have the resources to go on maintaining this library and make sure it runs as expercted on latest devices. Gyronorm library will stay opensource in GitHub however I wont be merging any PR; and I wont look actively into any issues. I created an issue for alternatives here: https://github.com/dorukeker/gyronorm.js/issues/61 So if any one finds an up-to-date alternative please feel free to share it. Cheers!

# gyronorm.js
Accesses the gyroscope and accelerometer data from the web browser and combines them in one JS object.

It returns consistent values across different devices. It has options to return game-based or world-based alpha values (rotation around z-axis), and normalize the gravity-related values. You can find more about the differences across devices in the e-book.

[Gyronorm.js E-book](https://leanpub.com/gyronormjs/c/ZLF4ix0CUzLm)

It covers the the basics of gyroscope and accelerometer data in JavaScript, as well as details on the gyronorm.js library.

[Demo](https://dorukeker.github.io/gyronorm_samples/demo/)

Online basic demo. You can use this to quickly see the compatibility with your target device(s). Demo code is available in the repository. 

## Installation
You can clone from this GitHub repository, use Bower or NPM.

```sh
$ bower install gyronorm
```

or

```sh
$ npm install gyronorm
```

This version of gyronorm.js is built on top of the [FullTilt](https://github.com/richtr/Full-Tilt) project which uses [JavaScript Promises](https://www.promisejs.org/). You do not need to install both libraries. FullTilt is bundled with gyronorm.js

## How to add

### Manually

For production, add the minified complete version of gyronorm.js which is under the `/dist` folder.

```html
<script src="<path_to_js_files>/gyronorm.complete.min.js"></script>
```

If you want to use the unminified version (for instance for development), then you need to add FullTilt manually.

```html
<script src="<path_to_js_files>/fulltilt.min.js"></script>
<script src="<path_to_js_files>/gyronorm.js"></script>
```

### Module import

You can use GyroNorm with your favourite module bundler (Both AMD and CommonJS). Some examples follow.

#### AMD/CommonJS

```js
var GyroNorm = require('gyronorm');
```

#### ES6

```js
import GyroNorm from 'gyronorm';
```


## How to use

Initialize the `gn` object by calling the `gn.init()` function which returns a promise. Start the `gn` object when this promise resolves.

Access the values in the callback function of `gn.start()`

``` js
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
```

### Backward compatibility
There are some breaking changes from 1.x to 2.x versions. You can find the details [here](https://github.com/dorukeker/gyronorm.js/wiki/Breaking-changes-from-1.x-to-2.x).

### Options
You can pass options as an object to the `init()` function. The values you pass overwrite the default values. Bellow is the list of available options and their default values.

```js
var args = {
	frequency:50,					// ( How often the object sends the values - milliseconds )
	gravityNormalized:true,			// ( If the gravity related values to be normalized )
	orientationBase:GyroNorm.GAME,		// ( Can be GyroNorm.GAME or GyroNorm.WORLD. gn.GAME returns orientation values with respect to the head direction of the device. gn.WORLD returns the orientation values with respect to the actual north direction of the world. )
	decimalCount:2,					// ( How many digits after the decimal point will there be in the return values )
	logger:null,					// ( Function to be called to log messages from gyronorm.js )
	screenAdjusted:false			// ( If set to true it will return screen adjusted values. )
};

var gn = new GyroNorm();

gn.init(args).then( ... );
```

### Older devices
In some older devices/browsers JS Promises are not natively supported. In this cases you can use a polyfill as mentioned [here](https://www.promisejs.org).

## API Documentation

[gyronorm.js API Documentation](https://github.com/dorukeker/gyronorm.js/wiki/API-Documentaion)

## Error handling

gyronorm.js can return error and log messages. You need to define a function to handle those messages. If a handler function is not defined, those messages will be silently ignored.

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

You can also set the log listener function at a later stage using the `startLogging()` function.

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

The return value of the callback function (`data` in the above examples) is an object with two parameters

### data.code

A machine-readable code.

* 0: Errors thrown by the system and caught by gyronorm.js
* 1: You get this if you try to call `gn.start()` before `gn.init()`. It means GyroNorm object is started before proper event listeners are added.

### data.message

A human-readable text message.

## Compatibility

I have tested with most Android and iOS phones of the last 2-3 years and the `demo/index.html` worked out of the box. Let me know if you have issues with a specific device+browser and I will try to find out.

## Contact

You can find me on Twitter [@dorukeker](https://twitter.com/dorukeker) or check my web site http://dorukeker.com
