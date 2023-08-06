const getURLQueryStringFromObj = (obj) => {
  let params = [];
  for (const [key, value] of Object.entries(obj)) {
    params.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
  }
  return params.join("&");
};

module.exports = {
  getURLQueryStringFromObj,
};
