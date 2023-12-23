const dns = require('dns-sync');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const fcm = require('fcm-node');

// TODO - attachments (https://nodemailer.com/message/attachments/)
let mail = (host, user, password, protocol = 'smtp', port) => {

  let transporter = nodemailer.createTransport({
    host: host,
    port: port,
    secure: port === 465 ? true : false,
    protocol: protocol,
    tls: protocol === 'smtp' ? {
      rejectUnauthorized: false
    } : undefined,
    auth: {
      user: user,
      pass: password
    }
  });

  let messageInfo = {
    from: '',
    to: [],
    subject: '',
    cc: [],
    bcc: [],
  }

  const subject = (subject) => {
    messageInfo.subject = subject;
  }

  const from = (from) => {
    messageInfo.from = from;
  }

  const to = (to) => {
    messageInfo.to.push(to);
  }

  const addTo = (to) => {
    messageInfo.to.push(to);
  }

  const delRecipient = (recipient) => {
    messageInfo.to = messageInfo.to.filter((val) => {
      return val != recipient;
    });
  }

  const addCc = (cc) => {
    messageInfo.cc.push(cc);
  }

  const addBcc = (bcc) => {
    messageInfo.bcc.push(bcc);
  }

 const message = (message) => {
    if (message.toLowerCase().includes('<!doctype html')) {
      messageInfo.html = message;
    } else {
      messageInfo.text = message;
    }
  }

  const sendMail = () => {
    return new Promise((resolve, reject) => {
      transporter.sendMail(messageInfo, (error, info) => {
        if (error) {
          reject(error);
        } else {
          resolve(info);
        }
      });
    });
  }

  const send = () => {
    sendMail().then(() => {
      console.log('Message sent!');
    });
  }


  return { transporter, messageInfo, subject, from, to, addTo, delRecipient, addCc, addBcc, message, send };
}

let FCM = (serverKey) => {
  let firecm = new fcm(serverKey);

  let fcmInfo = {
    to: '',
    notification: {
      title: '',
      body: '',
    }
  }

  const to = (device_id) => {
    fcmInfo.to = device_id;
  }

  const title = (title) => {
    fcmInfo.notification.title = title;
  }

  const body = (body) => {
    fcmInfo.notification.body = body;
  }

  const send = () => {
    firecm.send(fcmInfo, (err, response) => {
      if (err) {
        console.log(err);
      } else {
        console.log(response);
      }
    });
  }


  return { firecm, fcmInfo, to, title, body, send };
}

module.exports = {
  base64: {
    encode: (str, encoding = 'utf8') => Buffer.from(str, encoding).toString('base64'),
    decode: (str, decoding = 'utf8') => Buffer.from(str, 'base64').toString(decoding),
  },
  dns: {
    query: (hostname, type = 'A') => dns.resolve(hostname, type)
  },
  int: (str) => {
    return parseInt(str);
  },
  sanitize: (str, charToClear = `'"();`) => {
    return str.replace(new RegExp(`[${charToClear}]`, 'g'), '');
  },
  sha: (str) => {
    return crypto.createHash('sha256').update(String(str)).digest('binary');
  },
  str: (any) => {
    if ( any === null || any === undefined ) {
      return '';
    } else {
      return String(any);
    }
  },
  fs: {
    load: (pathIncomming) => {
      let newPath = path.join(__dirname, '../mars_fs', pathIncomming)
      // return fs.readFileSync(newPath, 'utf8');
      // user stat to get size
      return fs.stat(newPath, 'rs+', (err, f) => {
        if (err) {
          console.log(err);
        } else {
          console.log(f);
        }
      })
    },
    createFile: (pathIncomming, content) => {
      let newPath = path.join(__dirname, '../mars_fs', pathIncomming)
      fs.writeFileSync(newPath, content);
    },
    // testFunc: (directory = __dirname) => {
    //   console.log('process.cwd',process.cwd());
    //   console.log('__dirname',__dirname);
    //   console.log('directory',directory);
    //   console.log('path.dirname',path.dirname(__dirname));
    //   console.log(`File ${path} written!`);
    //   // console.log(path);
    //   console.log(fs.readdir(process.cwd(), (err, files) => {
    //     if (err) {
    //       console.log(err);
    //       } else {
    //         console.log(files);
    //       }
    //     }
    //   ));
    //   // fs.appendFileSync('.env', '\nTEST');
    //   // let newPath = path.join(__dirname, '../mars_fs', directory)
    //   // fs.readFileSync(newPath)
    //   console.log('lmao');
    //   return 'gigachad'
    // },
  },
  // change to actual .env file later
  config: (varName, varVal) => {
    let returnVal = '';
    let data;
    let found = false;
    data = fs.readFileSync(process.cwd() + '/testEnv.txt') 
    let env = data.toString();
    let envArr = env.split('\n');
    for (let i = 0; i < envArr.length; i++) {
      if (envArr[i].split('=')[0] === varName) {
        found = true;
        returnVal = envArr[i].split('=')[1];
        break;
      }
    }
    if (!found) {
      let newEnv = `\n${varName}=${varVal}`;
      returnVal = varVal;
      fs.appendFileSync(process.cwd() + '/testEnv.txt', newEnv);
    }
    console.log('returnVal', returnVal);
    return returnVal;
  },
  setEnv: (confName, ...values) => {
    let data = fs.readFileSync(process.cwd() + '/testEnv.txt').toString().split('\n');
    let alreadyExists = false;
    for (let i = 0; i < data.length; i++) {
      if (data[i].split('=')[0] === confName) {
        alreadyExists = true;
        let tempVar = JSON.parse(data[i].split('=')[1]);
        let tempKey = data[i].split('=')[0];
        tempVar.push(...values);
        data[i] = `${tempKey}=${JSON.stringify(tempVar)}`;
        break;
      }
    }
    if (alreadyExists) {
      // data.push(`${confName}=${JSON.stringify(values)}`);
      data.join('\n');
      fs.writeFileSync(process.cwd() + '/testEnv.txt', data);
    } else {
      if (values.length === 1) {
        values = values[0];
      }
      fs.appendFileSync(process.cwd() + '/testEnv.txt', `\n${confName}=${JSON.stringify(values)}`);
    }
  },
  mail,
  FCM
}