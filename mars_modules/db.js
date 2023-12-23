const Utils = require('./mars/Utils');
const prepareSQL = require('./mars/MARSQueryPreparator')



function database () {
  let sqlHasFailed = false
  return {
    query: (sql, ...data) => {
      // console.log('sql data', sql, data);
      
      if(Utils.isObject(data)) {
        console.log("OBJECT AS SECOND PARAMETER");
      }

      if (data.length) {
        let formattedSQL = new prepareSQL(sql, data)
        sql = formattedSQL.toString()
      }
      console.log(sql);
      try {
        if (sqlHasFailed) {
          return
        }
        this.db.query('SET autocommit=0') // lmao
        let res = this.db.query(sql);
        res.rows = res.length; 
        return res;
      } catch (error) {
        sqlHasFailed = true;
        console.log(error);
        this.db.query("ROLLBACK;");
      }
      // Make result object compliant with MARS
    },
    commit: () => {
      this.db.query('COMMIT;');
    },
    rollback: () => {
      this.db.query('ROLLBACK;');
    },
    // TODO: add methods for query building
  }
}

module.exports = database