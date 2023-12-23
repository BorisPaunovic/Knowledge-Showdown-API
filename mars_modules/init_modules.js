const mars = require('./index.js')

function init_modules(req, res, marsconn, dbconn) {
    let write = mars.write.bind({marsconn});
    let param = mars.param.bind({marsconn});
    let response = new mars.Response(marsconn);
    let request = new mars.request(marsconn);
    let session = mars.session(req);

    let db = mars.db.bind({db: dbconn})();

    return {
      write,
      bcrypt: mars.bcrypt,
      param,
      config: mars.config,
      include: mars.include,
      session,
      response,
      request,
      exit: mars.exit,
      db,
      ...mars.builtin_functions,
      DateTime: mars.DateTime
    }
  }

module.exports = init_modules;