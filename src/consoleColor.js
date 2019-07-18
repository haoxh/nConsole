module.exports = {
    'bold'          : ['\x1B[1m',  '\x1B[22m'].join('%s'),
    'italic'        : ['\x1B[3m',  '\x1B[23m'].join('%s'),
    'underline'     : ['\x1B[4m',  '\x1B[24m'].join('%s'),
    'inverse'       : ['\x1B[7m',  '\x1B[27m'].join('%s'),
    'strikethrough' : ['\x1B[9m',  '\x1B[29m'].join('%s'),
    'white'         : ['\x1B[37m', '\x1B[39m'].join('%s'),
    'grey'          : ['\x1B[90m', '\x1B[39m'].join('%s'),
    'black'         : ['\x1B[30m', '\x1B[39m'].join('%s'),
    'blue'          : ['\x1B[34m', '\x1B[39m'].join('%s'),
    'cyan'          : ['\x1B[36m', '\x1B[39m'].join('%s'),
    'green'         : ['\x1B[32m', '\x1B[39m'].join('%s'),
    'magenta'       : ['\x1B[35m', '\x1B[39m'].join('%s'),
    'red'           : ['\x1B[31m', '\x1B[39m'].join('%s'),
    'yellow'        : ['\x1B[33m', '\x1B[39m'].join('%s'),
    'whiteBG'       : ['\x1B[47m', '\x1B[49m'].join('%s'),
    'greyBG'        : ['\x1B[49;5;8m', '\x1B[49m'].join('%s'),
    'blackBG'       : ['\x1B[40m', '\x1B[49m'].join('%s'),
    'blueBG'        : ['\x1B[44m', '\x1B[49m'].join('%s'),
    'cyanBG'        : ['\x1B[46m', '\x1B[49m'].join('%s'),
    'greenBG'       : ['\x1B[42m', '\x1B[49m'].join('%s'),
    'magentaBG'     : ['\x1B[45m', '\x1B[49m'].join('%s'),
    'redBG'         : ['\x1B[41m', '\x1B[49m'].join('%s'),
    'yellowBG'      : ['\x1B[43m', '\x1B[49m'].join('%s')
  }