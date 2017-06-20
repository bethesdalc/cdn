[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

# Kendo UI for Angular: Localization

A starter repository for Kendo UI Angular components, which provides the basic directory structure and dependencies.

> **WARNING**
>
> The current test setup is extremely brittle and (mostly) based on the [AngularClass starter](https://github.com/AngularClass/angular2-webpack-starter) repository. There are several very ugly things, we hope that these will be gradually cleared as the framework matures.

* [Overview](https://github.com/telerik/kendo-angular-l10n/edit/l10n-service/README.md#overview)
* [Basic Usage and Installation](https://github.com/telerik/kendo-angular-l10n/edit/l10n-service/README.md#basic-usage-and-installation)
* [Gulp Tasks](https://github.com/telerik/kendo-angular-l10n/edit/l10n-service/README.md#gulp-tasks)

## Overview

- The `src` directory contains the component source code. All files should have the `.ts` extensions so that the build scripts can pick them.
- The `src/main.ts` file should import and re-export all public entities of the package. It is used for the `build-cdn` task. It is also the main entry point for the NPM package (as specified by the `package.json`). The `build-npm-package` transpiles it to `dist/npm/js/main.js`.
- The `src/kendo-component.ts` file is the actual sample component implementation.
- The `src/util.ts` is an optional example of an additional file. If unnecessary, remove it.
- The `examples` directory hosts the demos for the component. As a bare minimum, the component should have a **Basic Usage** and a **CDN** example.  The **CDN** example should work as expected after the `build-cdn` task has been run.
- The `test` directory contains the component tests. They are transpiled just like the source code itself and run with Jasmine in Karma (PhantomJS).
- The `e2e` directory contains the end-to-end tests. They are transpiled and run with Jasmine in Karma (Google Chrome).
- The `docs` directory contains markdown files that document the specifics of the component.

## Basic Usage and Installation

1. Fork the repository to an appropriately named new one.
1. Change the package name/description in `package.json`. Change the reference to the theme package.
1. Change the library name in `gulpfile.js`.
1. Change the name of the `src/kendo-component.ts` file to something more meaningful.
1. Delete the current contents and put something nice in `README.md`.

## Gulp Tasks

> Remember to run `npm install` and `npm run typings` before using the Gulp tasks.

- `build-npm-package`&mdash;Builds the scripts and styles in `dist/npm` in a CommonJS format.
- `build-cdn`&mdash;Builds the scripts and styles in `dist/cdn` in a UMD format.
- `start`&mdash;Starts the webpack-dev-server. It is suitable for example previews, development, and testing. Accessible on [http://localhost:3000](http://localhost:3000).
- `docs`&mdash;Starts the documentation site for the current component. Accessible on [http://localhost:8082](http://localhost:8082)
- `test`&mdash;Runs the tests with Jasmine in Karma/PhantomJS.
- `watch-test`&mdash;Runs the tests in the watch mode.
- `e2e`&mdash;Runs the `e2e` tests with Jasmine in Karma/Google Chrome.
