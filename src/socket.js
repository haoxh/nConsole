
let fetchState = null
function socket(port = 3114) {
  console.log(port)
  const io = require('socket.io')(port);
  const ipv4 = require('./localIpv4.js')
  const styles = require('./consoleColor.js')
  let f = true
  io.origins('*:*')
  var imessage = io
    .of('/nconsole_message')
    .on('connection', function (socket) {
      if(f){
        f = false
        console.info(styles.bold,`nConsole connection address http://${ipv4}:${port}`)
      }
      
      socket.on('socketEmitMessage', function (form, message) {
        console.log('\n', JSON.stringify(form), JSON.stringify(message))
        if (form.code === 'fetchState') {
          if (form.message === 'fetchOpen') {
            fetchState = true
          } else {
            fetchState = null
          }
          imessage.emit('fetchState', form.message)
          return
        }
        form.message = form.message.map && form.message.map(i => {
          if (Array.isArray(i)) {
            return i[0]
          }
          return i
        })
        imessage.emit('consoleMessage', form)
      })

      socket.on('userAgent', function (form) {
        console.log(`\n链接时间${new Date().toLocaleTimeString()}: ${form}`)
        if (fetchState) {
          imessage.emit('fetchState', 'fetchOpen')
        } else {
          imessage.emit('fetchState', 'fetchClose')
        }
      })

      socket.on('disconnect', function () {
        io.emit('user disconnected');
      });
    });
}
let port = process.argv.find(i =>{
  if(i.search(/^--port=/) > -1){
    return i.replace(/^--port=/g,'')
  }
})
console.log(port)
socket(port)

