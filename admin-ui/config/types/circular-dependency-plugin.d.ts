declare module 'circular-dependency-plugin' {
  import { Plugin } from 'webpack';

  interface CircularDependencyPluginOptions {
    exclude?: RegExp;
    failOnError?: boolean;
    allowAsyncCycles?: boolean;
    cwd?: string;
    onDetected?: (params: {
      module: any;
      paths: string[];
      compilation: any;
    }) => void;
  }

  class CircularDependencyPlugin extends Plugin {
    constructor(options?: CircularDependencyPluginOptions);
  }

  export default CircularDependencyPlugin;
} 