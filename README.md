# Social Media created with React and Node.js

This is a project I have been working on for the past couple of weeks in order to improve my skills in the technologies and libraries listed in the [Technology Stack](#technology-stack) section.

It has a dedicated REST API, created with Express.js, which is situated in the `backend` folder and a front-end, powered by React and Material-UI.

The features currently available are pretty basic, but I hope I have the time and energy to add some more advanced ones.



## Installation

### Prerequisites:
In order to be able to run the project successfully, you must have a MongoDB server installed and running on your machine. Here is a link with installation guides for Linux, Windows, and Mac: [MongoDB Server installation guide](https://docs.mongodb.com/manual/administration/install-community/)

### Steps


Clone the repository:
```
git clone https://github.com/stefanbankow/react-node-social-media.git
```

Run npm install in the root directory:
```
npm install
```

Go to the backend directory and there run npm install once again:
```
cd backend/
npm install
cd ..
```
This is really annoying and will probably be changed in the future, but due to the way the project is currently structured it's the simplest way to install both front-end and back-end dependencies.

Make sure your mongoDB server is running and then run:

```
npm run dev-no-env
```

### Optional:
The project is set up to use environment variables:
- MONGO_URL
- JWT_SECRET

In order to use your own values, create a file named `dev.env` in the folder `react-node-social-media/backend/config` and then run:
```
npm run dev
```


## Technology Stack

- [React](https://reactjs.org/)
  - [react-redux](https://react-redux.js.org/)
  - [react-router](https://reactrouter.com/)
  - [Material-UI](https://material-ui.com/)
- [Node.js](https://nodejs.org/en/)
  - [Express](https://expressjs.com/)
  - [Mongoose](https://mongoosejs.com/)
- [Redux](https://redux.js.org/)
  - [redux-thunk](https://github.com/reduxjs/redux-thunk)
- [MongoDB](https://www.mongodb.com/)
- [JWT](https://jwt.io/)

It's possible that I am missing some, but those are the major ones.

## Features
### Currently available
- Posts
  - CRUD functionality
- Comments
  - CRUD functionality
- User system
  - Sign in / Sign up
  - Edit about info (has more work to be done)
  - Change password with old password

### To do
- Notifications
- Likes
- Profile pictures

### Backlog
- Email verification
## License
[MIT](https://choosealicense.com/licenses/mit/)