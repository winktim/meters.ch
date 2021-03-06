# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.2.5] - 2021-03-20

### Fixed

- Fixed admin panel when there is a single client or a single user

## [1.2.4] - 2021-03-19

### Fixed

- Fixed alt text if browser is undefined

## [1.2.3] - 2021-03-16

### Fixed

- Set height instead of width to allow space for alt text on browser icon

## [1.2.2] - 2021-02-18

### Fixed

- Changing password sends the remember_me parameter

## [1.2.1] - 2021-01-30

### Changed

- Logging in sends the remember_me parameter
- Sessions now display their expire date and disappear when expired

### Fixed

- Fixed console error when force-logged out on the index page

## [1.1.1] - 2020-12-24

### Fixed

- Session last used time relative format showing a date in the future

## [1.1.0] - 2020-12-24

### Added

- Added the ability to view and delete sessions

### Changed

- Logging out now calls the logout route on the backend
- Infos page became Settings page
- Settings can now be hidden by section

## [1.0.0] - 2020-12-20

### Added

- Initial logged release
