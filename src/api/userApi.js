import API from "../utils/api";




export const signupUser = async (formData) => {
  const { data } = await API.post("/users/signup", formData);
  return data;
};


export const loginUser = async (formData) => {
  const { data } = await API.post("/users/login", formData);
  return data;
};
