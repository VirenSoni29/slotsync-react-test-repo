let accessToken = null;
let listeners = [];

const setAccessToken = (token) => {
   accessToken = token;
   listeners.forEach((listener) => listener(token));
};

const getAccessToken = () => {
   return accessToken;
};

const clearAccessToken = () => {
   accessToken = null;
   listeners.forEach((listener) => listener(null));
};

const subscribeAccessToken = (listener) => {
   listeners.push(listener);
   return () => {
      listeners = listeners.filter((l) => l !== listener);
   };
};

export {
   setAccessToken,
   getAccessToken,
   clearAccessToken,
   subscribeAccessToken
};