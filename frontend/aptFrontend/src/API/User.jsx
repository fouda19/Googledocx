import axios from "axios";

// const baseUrl = process.env.VITE_BASE_URL;
const baseUrl = "http://localhost:4000/";

//const baseUrl = String(process.env.VITE_BASE_URL);
// console.log('baseUrl ', baseUrl);


const fetchRequest = async (endPoint) => {
  return await axios.get(baseUrl + endPoint, {
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token"),
    },
    withCredentials: false,
  });
};

const patchRequest = async (newSettings, endPoint) => {
  try {
    const response = await axios.patch(baseUrl + endPoint, newSettings, {
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token"),
      },
      withCredentials: false,
    });
    console.log(response);

    return response;
  } catch (error) {
    const errorMessage =
      typeof error.response === "object"
        ? JSON.stringify(error.response)
        : error.response;

    throw new Error(errorMessage);
  }
};

const postRequest = async (endPoint, data) => {
  try {
    const response = await axios.post(baseUrl + endPoint, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token"),
      },
      withCredentials: false,
    });

    return response;
  } catch (error) {
    // console.log(error.response);
    const errorMessage =
      typeof error.response === "object"
        ? JSON.stringify(error.response)
        : error.response;

    throw new Error(errorMessage);
  }
};

export { fetchRequest, patchRequest, postRequest };
