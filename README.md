# Ninja Devices TestCafe POC

This repository contains a TestCafe POC (proof of concept) project created for Ninja selection process. The goal of the project is to validate some operations in a web page by combining UI and API methods using TestCafe.

## Introduction

This project aims to showcase how TestCafe can be used to validate operations in a web page that interacts with an API. The project uses a combination of UI and API methods to perform various actions on a web page, such as adding and deleting devices. The TestCafe framework provides an easy and efficient way to write automated tests that verify the expected behavior of the web page.

## Getting Started

Before running the tests, make sure to start the Client App  and API servers located in separate repositories at the following links:
- [Client App Repository](https://github.com/Yastrenky/devices-clientapp)
- [Server API Repository](https://github.com/NinjaRMM/devicesTask_serverApp)


## Prerequisites

To run this project, you will need:

- [Node.js](https://nodejs.org/en/) (version 14 or higher) installed on your system
- A modern web browser such as Chrome or Firefox

## Installation

1. Clone this repository to your local machine using `git clone`.
2. Navigate to the project directory.
3. Install testcafe by running `npm install testcafe`.

## Usage

To run the tests, run the following command in the project directory:

```sh
testcafe chrome tests/tests.js

```
## Project Structure

The project structure is organized as follows:

```sh

├── helpers/
│   └── Api.js
├── page-objects/
│   ├── AddPage.js
│   └── DevicesPage.js
├── tests/
│   ├── tests.js
├── constants.js

```

### `helpers/`

This folder contains the `Api.js` file, which is responsible for handling API interactions for the project. The `Api.js` file likely contains methods for adding, editing, and deleting objects that are used in the tests.

### `page-objects/`

This folder contains the `AddPage.js` and `DevicesPage.js` files, which represent the page objects for the "Add" and "Devices" pages of the project, respectively. Each page object file likely contains methods for interacting with the page and validating its state.

### `tests/`

This folder contains the `tests.js` file, which contains the actual tests for the project. The `tests.js` file likely imports the necessary page object classes and the API helper class to interact with the pages and perform API calls as needed.

### `constants.js`

This file likely contains any constants or configurations needed for the project, such as API endpoint URLs, test data, or other values that are used throughout the project.

### Contact Information

If you have any questions, comments, or feedback about this project, feel free to reach out to me:

- **Name:** Eduardo Guardado (Ed)
- **Email:** eduardofigarola226@gmail.com <br> <img alt="Email" src="https://img.shields.io/badge/-Email-lightgrey?style=flat-square&logo=gmail&logoColor=white">
- **LinkedIn:** https://www.linkedin.com/in/eduardo-guardado-9555349a/ <br> <img alt="LinkedIn" src="https://img.shields.io/badge/-LinkedIn-lightgrey?style=flat-square&logo=linkedin&logoColor=white">
