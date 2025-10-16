import API from "../utils/api";


export const uploadRecording = async (payload) => {
  const { data } = await API.post("/recordings/upload", payload);
  return data;
};
