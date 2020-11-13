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

Make sure your mongoDB server is running and then run:

```
npm run dev-no-env
```

If for some reason the project isn't working, you can try running these commands. 
```
cd backend/
npm install
cd ..
```


### Optional:
The project is set up to use environment variables:
- MONGO_URL
- JWT_SECRET

In order to use your own values, create a file named `dev.env` in the folder `react-node-social-media/backend/config`, give them values and then run:
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
- Set up test for both the front- and back-end
- Notifications
- Likes
- Profile pictures

### Backlog
- Email verification
## License
[MIT](https://choosealicense.com/licenses/mit/)