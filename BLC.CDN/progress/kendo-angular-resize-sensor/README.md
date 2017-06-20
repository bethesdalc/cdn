[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

# Kendo UI for Angular: Resize Sensor

An internal utility component for detecting element size changes.

* [Overview](https://github.com/telerik/kendo-angular-resize-sensor#overview)
* [Gulp Tasks](https://github.com/telerik/kendo-angular-resize-sensor#gulp-tasks)
* [Credits](https://github.com/telerik/kendo-angular-resize-sensor#credits)

## Overview

- The `src` directory contains the component source code. All files should have the `.ts` extensions so that the build scripts can pick them.
- The `src/main.ts` file should import and re-export all public entities of the package. It is used for the `build-cdn` task. It is also the main entry point for the NPM package (as specified by the `package.json`). The `build-npm-package` transpiles it to `dist/npm/js/main.js`.
- The `src/kendo-component.ts` file is the actual sample component implementation.
- The `src/util.ts` is an optional example of an additional file. If unnecessary, remove it.
- The `examples` directory hosts the demos for the component. As a bare minimum, the component should have a **Basic Usage** and a **CDN** example.  The **CDN** example should work as expected after the `build-cdn` task has been run.
- The `test` directory contains the component tests. They are transpiled just like the source code itself and run with Jasmine in Karma (PhantomJS).
- The `e2e` directory contains the end-to-end tests. They are transpiled and run with Jasmine in Karma (Google Chrome).
- The `docs` directory contains markdown files that document the specifics of the component.

## Gulp Tasks

> Remember to run `npm install` and `npm run typings` before using the Gulp tasks.

- `build-npm-package`&mdash;Builds the scripts and styles in `dist/npm` in a CommonJS format.
- `build-cdn`&mdash;Builds the scripts and styles in `dist/cdn` in a UMD format.
- `start`&mdash;Starts the webpack-dev-server. It is suitable for example previews, development, and testing. Accessible on [http://localhost:3000](http://localhost:3000).
- `docs`&mdash;Starts the documentation site for the current component. Accessible on [http://localhost:8082](http://localhost:8082)
- `test`&mdash;Runs the tests with Jasmine in Karma/PhantomJS.
- `watch-test`&mdash;Runs the tests in the watch mode.
- `e2e`&mdash;Runs the `e2e` tests with Jasmine in Karma/Google Chrome.

## Credits

The implementation is inspired by the [css-element-queries](https://github.com/marcj/css-element-queries) project by Marc J. Schmidt.

> Copyright (c) 2013 Marc J. Schmidt
>
> Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
>
> The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
>
> THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
