# Contributing to Campkit

1. Fork this repository to your own GitHub account and then clone it to your local device.
1. Install the dependencies: `yarn install`
1. Run `yarn link` in each package to link the local repo to NPM
1. Run `yarn start` in each package to build and watch for code changes
1. Run `yarn test` in each package to start Jest
1. Then npm link this repo inside any other project on your local dev with `yarn link @campkit/{package-name}`
1. Then you can use your local version of Campkit within your project
