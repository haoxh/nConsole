const os = require("os");
function getLocalIpv4() {
  let address = "";
  const networkInterfaces = os.networkInterfaces();
  Object.keys(networkInterfaces).forEach(item => {
    if (Array.isArray(networkInterfaces[item])) {
      let map = networkInterfaces[item];
      map && map.forEach(alias => {
        if (alias.family === "IPv4") {
          if (!/127.+/.test(alias.address) && !alias.internal) {
            address = alias.address;
          }
        }
      });
    }
  });
  if (!address) {
    throw new Error('not find your local IP address');
  }
  return address;
}
module.exports = getLocalIpv4();
