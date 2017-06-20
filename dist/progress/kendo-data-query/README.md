[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

# Kendo UI for Angular 2: Data Query

A starter repository for the Kendo UI TypeScript library which provides the basic directory structure and dependencies.

* [Overview](https://github.com/telerik/kendo-data-query/edit/master/README.md#overview)
* [Basic Usage and Installation](https://github.com/telerik/kendo-data-query/edit/master/README.md#basic-usage-and-installation)
* [Gulp Tasks](https://github.com/telerik/kendo-data-query/edit/master/README.md#gulp-tasks)

## Overview

- The `src` directory contains the library source code. All files should have the `.ts` extensions so that the build scripts can pick them.
- The `src/main.ts` file should import and re-export all public entities of the package.
- The `src/my-class.ts` file is the actual sample class implementation.

- The `examples` directory hosts the demos for the component. As a bare minimum, the component should have a **Basic Usage** example.
- The `test` directory contains the component tests. They are transpiled just like the source code itself and run with Jasmine in Karma (PhantomJS).
- The `docs` directory contains markdown files that document the specifics of the component.

## Basic Usage and Installation

1. Fork the repository to an appropriately named new one.
2. Change the package name or description in `package.json`. Change the reference to the theme package.
3. Change the library name in `gulpfile.js`.
4. Change the `src/my-class.ts` file name to something more meaningful.
5. Delete the current contents and put something nice in `README.md`.

## Gulp Tasks

> Remember to run `npm install` and `npm run typings` before using the Gulp tasks.

- `build-npm-package`&mdash;Builds the scripts in `dist/npm` in the CommonJS format.
- `start`&mdash;Starts the webpack-dev-server. It is suitable for example previews, development, and testing. Accessible on [http://localhost:3000](http://localhost:3000).
- `docs`&mdash;Starts the documentation site for the current component. Accessible on [http://localhost:8082](http://localhost:8082).
- `test`&mdash;Runs the tests with Jasmine in Karma/PhantomJS.
- `watch-test`&mdash;Runs the tests in the watch mode.
