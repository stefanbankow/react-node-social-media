import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:3001",
  //https://bankov-social-media-api-react.herokuapp.com
  //http://localhost:3001
});

export default instance;
