[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

# Kendo UI for Angular 2: Date Math

A starter repository for the Kendo UI Date Math package for JavaScript date manipulations.

## Structure

- The `src` directory contains the library source code. All files should have the `.ts` extensions so that the build scripts may pick them.
- The `src/main.ts` file should import and re-export all public entities of the package.
- The `src/{date function}.ts` file is the concrete date manipulation function.

- The `test` directory contains the component tests. They are transpiled just like the source code itself and run with Jasmine in Karma (PhantomJS).
- The `docs` directory contains markdown files that document the specifics of the component.

## Gulp Tasks

> Remember to run `npm install` and `npm run typings` before using the Gulp tasks.

- `build-npm-package`&mdash;Builds the scripts in `dist/npm` in the CommonJS format.
- `start`&mdash;Starts the webpack-dev-server. It is suitable for example previews, development, and testing. Accessible on [http://localhost:3000](http://localhost:3000).
- `docs`&mdash;Starts the documentation site for the current component. Accessible on [http://localhost:8082](http://localhost:8082).
- `test`&mdash;Runs the tests with Jasmine in Karma/PhantomJS.
- `watch-test`&mdash;Runs the tests in the watch mode.

## Contribution

1. Clone the repository.
1. Create a feature branch.
1. Add the new stuff.
1. Write tests.
1. Write documentation.
1. Create a pull request.
