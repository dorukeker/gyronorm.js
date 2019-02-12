declare module 'gyronrom' {
  export interface MotionAndOrientationPayload {
    do: {
      alpha: number
      beta: number
      gamma: number
      absolute: number
    }


    dm: {
      x: number
      y: number
      z: number

      gx: number
      gy: number
      gz: number

      alpha: number
      beta: number
      gamma: number
    }
  }

  export interface Options {
    /**
     * How often GyroNorm returns data (in milliseconds)
     */
    frequency: number

    /**
     * If the gravity related values to be normalized
     */
    gravityNormalized: boolean

    /**
     * // ( Can be GyroNorm.GAME or GyroNorm.WORLD. gn.GAME returns orientation values with respect to the head direction of the device. gn.WORLD returns the orientation values with respect to the actual north direction of the world. )
     */
    orientationBase: orientationBase,

    /**
     * How many digits after the decimal point will there be in the return values
     */
    decimalCount: number

    /**
     * Function to be called to log messages from gyronorm.js
     */
    logger: LogListener

    /**
     * If set to true it will return screen adjusted values
     */
    screenAdjusted: boolean
  }

  export interface LoggerData {
    code: number
    message: string
  }

  type orientationBase  = string
  type LogListener = (data: any) => void

  export default class GyroNorm {
    static GAME: orientationBase
    static WORLD: orientationBase

    static DEVICE_ORIENTATION: string
    static ACCELERATION: string
    static ACCELERATION_INCLUDING_GRAVITY: string
    static ROTATION_RATE: string

    init(options: Options): Promise<void>

    start(callback: (data: MotionAndOrientationPayload) => void): void

    startLogging(listener: LogListener)
    stopLogging(): void
  }
}
