import axios from "axios";

export const APIFetcher = (url) => {
  return axios
    .get(url)
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      throw error.response.data;
    });
};

export const APIPusher = (url, data) => {
  return axios
    .post(url, data)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error.response.data;
    });
};

export const APIUpdater = (url, data) => {
  return axios
    .put(url, data)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error.response.data;
    });
};

export const APIRemover = (url) => {
  return axios
    .delete(url)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error.response.data;
    });
};
