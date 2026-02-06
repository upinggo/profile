## [1.1.3](https://github.com/upinggo/profile/compare/v1.1.2...v1.1.3) (2026-02-06)


### Bug Fixes

* add Vercel environment check to envFetch for correct fetch handling ([634f18c](https://github.com/upinggo/profile/commit/634f18ce51cfc40866916fad7fa43497868485b7))

## [1.1.2](https://github.com/upinggo/profile/compare/v1.1.1...v1.1.2) (2026-02-06)


### Bug Fixes

* correct asset path construction in envFetch for GitHub Pages deployment ([25a5153](https://github.com/upinggo/profile/commit/25a5153cc0f76ac55531a7068384c7845c2e93fd))

## [1.1.1](https://github.com/upinggo/profile/compare/v1.1.0...v1.1.1) (2026-02-06)


### Bug Fixes

* update GitHub Pages asset URL construction for subdirectory deployment ([9ae33c8](https://github.com/upinggo/profile/commit/9ae33c85327115d81b08e857774250ffaa7b8afc))

# [1.1.0](https://github.com/upinggo/profile/compare/v1.0.0...v1.1.0) (2026-02-06)


### Features

* add finance dashboard page and integrate API for real-time data ([07b70d0](https://github.com/upinggo/profile/commit/07b70d0b8d8295a3d4ad8486fe7e698e08a6e0e8))
* enhance GitHub Pages deployment and improve asset URL handling ([fce719a](https://github.com/upinggo/profile/commit/fce719a47171c88adcb9192452396f1d13a00cad))

# 1.0.0 (2026-02-05)


### Bug Fixes

* correct base path handling for subdirectory deployments in envFetch ([f9e0d97](https://github.com/upinggo/profile/commit/f9e0d977bc7c6adc14490f1db800a3eea71e3418))
* remove local semantic release script from package.json and update test commands ([4dbca36](https://github.com/upinggo/profile/commit/4dbca3602e469c23e791763ab44cd95490e130f2))
* update GitHub Actions workflow to use correct GITHUB_TOKEN secret ([841b215](https://github.com/upinggo/profile/commit/841b215bca43ce52fdec90b846087f331f05aa38))
* update release job configuration to include environment and permissions ([2708ff6](https://github.com/upinggo/profile/commit/2708ff605733510b3315e20dad244b9e4e9d8dd0))


### Features

* Add blog page with markdown rendering and styling ([f49680b](https://github.com/upinggo/profile/commit/f49680b3354a9a73dad3f68bc4033a7af4124324))
* add GitHub Actions workflow for deploying Next.js site to GitHub Pages ([7424c85](https://github.com/upinggo/profile/commit/7424c85b231591a75864b14cbcd6834b109965df))
* add JavaScript page and update navigation structure for technology stack ([fde81f8](https://github.com/upinggo/profile/commit/fde81f8cab0f89a2becefbfdf9e4438ba1341ec3))
* add page component to display current working directory and update ProfileContainer with avatar click handling ([2a5bcd7](https://github.com/upinggo/profile/commit/2a5bcd730b4f5b5e4b6f0dc99fd26128ab6bf602))
* add technology stack page and navigation, refactor related components and styles ([a52d74b](https://github.com/upinggo/profile/commit/a52d74b1c02d1a9cc674642a8e917c8c8d5ca5a1))
* enhance blog markdown fetching logic and improve layout styling ([39930ab](https://github.com/upinggo/profile/commit/39930ab3a9d9c03cf1bc8ec600e5fe02be520b22))
* enhance TechnologyStackContainer with category cards and dropdown for child items ([103f48d](https://github.com/upinggo/profile/commit/103f48dbddaed0fb64506412708dfd4f5d47079c))
* implement ChildItemCard component for improved child item display in TechnologyStackContainer ([2ce61b1](https://github.com/upinggo/profile/commit/2ce61b12c397df693e6aa06a7fab3bbe96580e36))
* implement Navigation component for avatar click handling in ProfileContainer ([78551de](https://github.com/upinggo/profile/commit/78551de9b9b82cacf841f5d921913ee2ed2d9f52))
* implement route data handling and add API request functions for profile management ([09745d7](https://github.com/upinggo/profile/commit/09745d737e121356a2b29d87dca91ed6f4c28bd2))
* initialize profile app with Next.js and TypeScript ([f2223dc](https://github.com/upinggo/profile/commit/f2223dc0085a371db984cdc4df7640024a350c89))
* integrate semantic release for automated versioning and changelog generation ([868d05e](https://github.com/upinggo/profile/commit/868d05eedfcbde92ee4da86a4f61c8eb076ecab7))
* move profile data to separate module and update imports ([c0d3edf](https://github.com/upinggo/profile/commit/c0d3edf9af7c085458309504c44dbef6d8ef0add))
* refactor profile data handling and add development environment check ([7b162f8](https://github.com/upinggo/profile/commit/7b162f8d14d2382233210c298a658924cee6cf9c))
* refactor profile data handling and implement technology stack page ([6de3be1](https://github.com/upinggo/profile/commit/6de3be118a5e0da083e8268fb86cfd9d4bc83c3e))
* Refactor ProfileContainer and TechnologyStackContainer components for improved API handling and error management ([37a9966](https://github.com/upinggo/profile/commit/37a9966d8e5b08daeb7ee8d5b91c1f9a3aa57040))
* remove GitHub Actions workflow for deploying Next.js site to GitHub Pages ([7e3dded](https://github.com/upinggo/profile/commit/7e3dded2cb6570f04a659716d0b193aece7d135e))
* reorder home button text for improved visual hierarchy ([ba503a7](https://github.com/upinggo/profile/commit/ba503a77018bc4f50c1d63dac033917dc08704d0))
* restructure components and update imports for profile management ([6607b8d](https://github.com/upinggo/profile/commit/6607b8d0750c4a38c8d7ff9d70f28e9e7cabd4c5))
* restructure profile data handling and update component imports ([8ec9bb8](https://github.com/upinggo/profile/commit/8ec9bb84b9469308927849a66b8e5447c90b6f1a))
* standardize role title from 'AI Developer' to 'Developer' in profile data ([3372e74](https://github.com/upinggo/profile/commit/3372e74103ec9459b805a4ca9e02874119f3b926))
* update ESLint and eslint-config-next versions; add LeetCode navigation links ([3f374cf](https://github.com/upinggo/profile/commit/3f374cf13474db95fc7ecc3b5e05be4d2f89b0a4))
* update ESLint configuration and add prettier support; enhance styles for navigation buttons in TechnologyStackContainer ([b6cf8dd](https://github.com/upinggo/profile/commit/b6cf8dd28ecdc108044a5321c91c76ad9b888c89))
* update navigation buttons for improved clarity and functionality ([2235834](https://github.com/upinggo/profile/commit/223583403b1f48e22ff6ba32e87d26ab19694122))
* update navigation links and add blog page ([e0ae87d](https://github.com/upinggo/profile/commit/e0ae87d78c72b5e0df0aa9c730d23ae99fd4bf42))
* wrap blog content in Navigation component for improved structure ([b45624f](https://github.com/upinggo/profile/commit/b45624fec4ade6a71a6acde6f7885ab874225cce))

# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Semantic Release automation
- Conventional Commits support
- Automated CHANGELOG generation
- GitHub Actions release workflow
- Contributing guidelines

### Changed
- Updated GitHub Actions workflows to work with semantic release
- Enhanced package.json with release configuration
