import axios from './axios';

/**
 * Parses the JSON returned by a network request
 *
 * @param  {object} response A response from a network request
 *
 * @return {object}          The parsed JSON from the request
 */
// function parseJSON(response) {
//   if (response.status === 204 || response.status === 205) {
//     return null;
//   }
//   return response.json();
// }

/**
 * Checks if a network request came back fine, and throws an error if not
 *
 * @param  {object} response   A response from a network request
 *
 * @return {object|undefined} Returns either the response, or throws an error
 */
// eslint-disable-next-line consistent-return
// async function checkStatus(response) {
//   if (response.status >= 200 && response.status < 300) {
//     return response;
//   }
//   if (response && response.status === 401) {
//     console.log(response.headers);
//     console.log(response.body);
//   }

// const error = new Error(response.statusText);
// error.response = response;
// throw error;

//   await response.json().then(res => {
//     const error = new Error(res.message || '');
//     // error.response = ;
//     throw error;
//   });
// }

/**
 * Requests a URL, returning a promise
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 *
 * @return {object}           The response data
 */
export default function request(url, options) {
  const newHeaders = Object.assign(
    {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    options.headers,
  );
  // eslint-disable-next-line no-param-reassign
  options.headers = newHeaders;
  // eslint-disable-next-line no-param-reassign
  options.url = url;
  // eslint-disable-next-line no-param-reassign
  options.data = options.body;
  // eslint-disable-next-line no-param-reassign
  delete options.body;
  return axios(options)
    .then(res => res.data)
    .catch(err => Promise.reject(err));
  // return fetch(url, options)
  //   .then(checkStatus)
  //   .then(parseJSON);
}
