import axios from "./axios";

export const getFarmCount = async () => {
  const res = await axios.get("/farm/count/");
  return res.data;
};