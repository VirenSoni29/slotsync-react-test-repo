let accessToken = null

const setAccessToken = (token) => {
   accessToken = token
}

const getAccessToken = () => {
   return accessToken
}

const clearAccessToken = () => {
   accessToken = null
}

export {
   setAccessToken,
   getAccessToken,
   clearAccessToken
}