import axios from "axios";

export default axios.create({
  baseURL: "http://localhost:3000",
  // withCredentials: false,
  // headers: {
  //   "Access-Control-Allow-Origin": "*",
  //   "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
  // },
});
// export default axios.create({
//   baseURL: "https://real-register-backend-dp.production.rehanshakir.com",
// });
