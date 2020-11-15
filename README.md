# Social Media created with React and Node.js

This is a project I have been working on for the past couple of weeks in order to improve my skills in the technologies and libraries listed in the [Technology Stack](#technology-stack) section.

It has a dedicated REST API, created with Express.js, which is situated in the `backend` folder and a front-end, powered by React and Material-UI.

The features currently available are pretty basic, but I hope I have the time and energy to add some more advanced ones.

## Demo

I do not have a public production build set up and don't plan on making one anytime soon, so I decided to record a little video showcasing some of the features of the project.
 ### [Watch showcase here](https://www.youtube.com/watch?v=1NgSvF1UU8Q&feature=youtu.be&ab_channel=Bankov)



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

### Note
The way the post and comment systems are currently set up, the performance of the site degrades gradually as more and more posts/comments are added.
I plan on refactoring in order to send only a limited amount of posts/comments with each request and then request more based on user actions (scrolling to the end of current page)

### Currently available
- Posts
  - CRUD functionality
  - Drafts
    - Posts which are created with the `Public` checkbox ticked off are added to the drafts instead.
    - The drafts can be accessed at `/drafts`
    - The user can then choose to `publish`, `edit`, or `delete` a draft.
- Comments
  - CRUD functionality
- User system
  - Authentication
    - Authentication based on JWT tokens stored inside cookies and in the Database
    - This is by no means neither very complicated, nor very secure system, but it suits my needs
  - Edit about info (has more work to be done)
  - Change password by providing old password

### To do
- Set up test for both the front- and back-end
- Notifications
- Likes
- Profile pictures

### Backlog
- Email verification
  
## License
[MIT](https://choosealicense.com/licenses/mit/)