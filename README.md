# Social Media Web App created with React and Node.js

This is a project I have been working on for the past couple of weeks in order to improve my skills in the technologies and libraries listed in the [Technology Stack](#technology-stack) section.

It has a dedicated REST API, created with Express.js, which is situated in the `backend` folder and a front-end, powered by React and Material-UI.

The features currently available are pretty basic, but I hope I have the time and energy to add some more advanced ones.

## Demo

I do not have a public production build set up and don't plan on making one anytime soon, so I decided to record a little video showcasing some of the features of the project.
 ### [Watch initial showcase here](https://www.youtube.com/watch?v=1NgSvF1UU8Q&feature=youtu.be&ab_channel=Bankov)
 ### [Watch Likes + Notification showcase here](https://youtu.be/WUhsjtGoAr4)



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
  - [mongoose](https://mongoosejs.com/)
  - [socket.io](https://socket.io/)
- [Redux](https://redux.js.org/)
  - [redux-thunk](https://github.com/reduxjs/redux-thunk)
- [MongoDB](https://www.mongodb.com/)
- [JWT](https://jwt.io/)

It's possible that I am missing some, but those are the major ones.

## Features


### Currently available
- Posts
  - CRUD functionality
  - Only get 10 posts initially and request more as the user keeps scrolling down.
    - This is kind of like `lazy loading` for posts, which makes the app far more efficient.

  - Drafts
    - Posts which are created with the `Public` checkbox ticked off are added to the drafts instead.
    - The drafts can be accessed at `/drafts`
    - The user can then choose to `publish`, `edit`, or `delete` a draft.
- Likes
  - Signed in users can `like/unlike` a post
  - Everyone can see all users who likes a post
- Comments
  - CRUD functionality
- Notifications
  - Displayed in `realtime` using `socket.io`
  - Lazy-loaded 10 at a time `(once notification dialog is open)`
  - Sends a notification everytime `another user` likes or comments on a post
  - Notifications are deleted once a user unlikes or deletes a comment
  - Showcased [here](https://youtu.be/WUhsjtGoAr4)
- User system
  - Authentication
    - Authentication based on JWT tokens stored inside cookies and in the Database
    - This is by no means neither very complicated, nor very secure system, but it suits my needs
  - Edit about info [`Age, Country, About you`]
  - Change password by providing old password
  - Profile pictures <code>(In progress, only available in [profile-pictures](https://github.com/stefanbankow/react-node-social-media/tree/profile-pictures) branch)</code>
    - Because the project is still in development, I am storing profile pictures as `Buffers` in every user's MongoDB document and returning them in most responses. `This is incredibly inefficient and should not be used in production`, because it makes response sizes enormous. Because of this, the profile picture functionality is only available in the [`profile-pictures`](https://github.com/stefanbankow/react-node-social-media/tree/profile-pictures) branch, which I do not plan on merging with `master` any time soon.
    - The current functionality is very basic. Users are able to open a dialog in a user's profile page, which lets them see their profile picture. If the profile page they are on is their own profile, they are able to upload a new file and replace their current profile picture`(Accepting PNG/JPG/JPEG up to 1 mb)`. This, is `very lmited (for now)`, because users aren't able to `resize/crop` the image they've chosen and the result they get are the center `500x500 pixels` of the image they've uploaded.
    - `For production`, the image uploaded would have to be stored in a storage bucket (Such as amazon s3) and only use MongoDB to store a reference to the image in the bucket, which would have very minimal API performance impact.

### To do
- Set up tests for both the front- and back-end



### Backlog
- Email verification
  
## License
[MIT](https://choosealicense.com/licenses/mit/)
