const socket = require('./src/socket.js')
let port = process.argv.find(i =>{
  if(i.search(/^--port=/) > -1){
    return i.replace(/^--port=/g,'')
  }
})
socket(port)