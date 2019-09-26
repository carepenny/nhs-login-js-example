# A Javascript implementation of NHS Login (JS front to back 👌)
This repo contains a sample application demonstrating how to connect to NHS login using Node JS.
It contains a simple web frontend using Vue.js for interactivity that connects to an Express.js
backend API. The repo has been set up for easy local development and testing, and deployment to Firebase.
It is not intended to be a production-ready app, simply a demonstration of how to interact with NHS Login.

## Prerequisites:

 - Node.js installed locally with yarn (if you want to use npm you'll need to change the package.json scripts or do installs/dev manually)
 - Access to NHS login sandpit. See: [nhsconnect/nhslogin](https://github.com/nhsconnect/nhslogin#how-do-i-integrate-to-the-sandpit)
 - A firebase account and a new firebase project created and firebase-tools set up locally (for deployment to firebase only)
 See: [firebase hosting](https://firebase.google.com/docs/hosting/quickstart)
 and [firebase functions](https://firebase.google.com/docs/functions/get-started)

## Get Started:

### Make sure you already have access to the NHS login sandpit See: [nhsconnect/nhslogin](https://github.com/nhsconnect/nhslogin#how-do-i-integrate-to-the-sandpit)
When gaining access to the NHS login sandpit, you will create a public/private key pair. The public key is sent
to the NHS and the private key is used by the API service in this repo to sign JWT bearer tokens.

- Copy your private_key.pem file contents to `/api/private_key.pem`.

When gaining access to the sandpit, you will receive a `Client Id` back from the NHS.

- Enter your Client ID in `/api/config.js`
- Enter your Client ID in `/front-end/src/config.js`

From the root of this repo run:

```
yarn setup
```

This will install all dependencies needed in both the api and

To run the app in dev run:

```
yarn dev
```

This will spin up the api service watched by `nodemon` for changes, as well as a server hosting the frontend
of the app with `browser-sync`

## Deploy (with Firebase 🔥):
The repo is set up for easy deployment with Firebase, though it's just a simple html static site on the
front end that can be hosted anywhere and an Express API for the backend which can be hosted anywhere
that supports running a node app (Heroku, AWS etc.).

To deploy to firebase, make sure you have firebase tools installed globally

```
npm i -g firebase-tools
```

Login with firebase locally

```
firebase login
```

Create a new project from the firebase console and enable billing (billing needs to be enabled for
firebase functions to reach out to NHS sandpit. The free tier in firebase's Blaze plan is very generous, so
you will likely not be charged for a small test project. But be safe and set a billing budget on your account.)

 - Add your firebase `project_id` to `.firebaserc`
 - Run `yarn deploy`
 - Enjoy.
