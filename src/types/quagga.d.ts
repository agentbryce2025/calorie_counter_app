declare module 'quagga' {
  interface QuaggaInitConfig {
    inputStream?: {
      name?: string;
      type?: string;
      target?: any;
      constraints?: {
        width?: number;
        height?: number;
        facing?: string;
        deviceId?: string;
        facingMode?: string;
      };
      area?: {
        top?: string;
        right?: string;
        left?: string;
        bottom?: string;
      };
      singleChannel?: boolean;
    };
    locator?: {
      patchSize?: string;
      halfSample?: boolean;
    };
    numOfWorkers?: number;
    frequency?: number;
    decoder?: {
      readers?: string[];
      debug?: {
        drawBoundingBox?: boolean;
        showFrequency?: boolean;
        drawScanline?: boolean;
        showPattern?: boolean;
      };
    };
    locate?: boolean;
  }

  interface QuaggaDecodedResult {
    codeResult: {
      code: string;
      format: string;
    };
  }

  function init(config: QuaggaInitConfig, callback?: (err: any) => void): void;
  function start(): void;
  function stop(): void;
  function onDetected(callback: (result: QuaggaDecodedResult) => void): void;
  function offDetected(callback: (result: QuaggaDecodedResult) => void): void;
  function onProcessed(callback: (result: any) => void): void;
  function offProcessed(callback: (result: any) => void): void;

  export default {
    init,
    start,
    stop,
    onDetected,
    offDetected,
    onProcessed,
    offProcessed
  };
}