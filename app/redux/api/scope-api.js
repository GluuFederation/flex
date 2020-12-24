import defaultAxios from "axios";
export const baseUrl =
  "https://gluu.gasmyr.com/jans-config-api/api/v1" || "http://localhost:8080";

const axios = defaultAxios.create({
  baseURL: baseUrl,
  timeout: 50000,
  headers: { "Content-Type": "application/json" }
});

export const getApiToken = async () => {
  return localStorage.getItem("gluu.api.token", "token5555555");
};

// Get All scopes
export const getAllScopes = async () => {
  try {
    const todos = await axios.get("/scopes?limit=1000");
    return todos.data;
  } catch (err) {
    return console.error(err);
  }
};

// Get scope by inum
export const getScope = async inum => {
  try {
    const todo = await axios.get("/scopes/" + inum);
    return todo.data;
  } catch (err) {
    return console.error(err);
  }
};

// Delete existed scope
export const deleteScope = async inum => {
  try {
    await axios.delete("/scopes/" + inum);
    return inum;
  } catch (err) {
    return console.error(err);
  }
};
