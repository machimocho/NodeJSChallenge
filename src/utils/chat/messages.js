const axios = require('axios')

const API = "http://localhost:9999";

const generateMessage = (username, text) => {
    return {
        username,
        text,
        createdAt: new Date().getTime()
    }
}

const sendToDB = (message, room, token) =>{
    const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      try {
        axios.post(`${API}/api/v1/mensajes/${room}`, {message}, config);
      } catch(e) {
        console.log(e)
      }
}

module.exports = {
    generateMessage,
    sendToDB
}