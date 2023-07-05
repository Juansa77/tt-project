import axios from "axios";
import { updateToken } from "../../utils/updateToken";

const APIHeaders={
    Accept: "application/json",
  "Content-Type": "multipart/form-data",
  "Access-Control-Allow-Origin": "*",
  Authorization: `Bearer ${updateToken()}`}
    



export const APIuser= axios.create({
    baseURL: "http://localhost:8095/api/v1",
    headers: APIHeaders,
    timeout:60000
})