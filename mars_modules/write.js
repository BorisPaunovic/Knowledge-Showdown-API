// TODO refactor so it supports adding headers after first write (like in mars)
function write(key, data) {
    ////////////////////// new logic


    // this.buffer[key] = data;
    // console.log(this.buffer);
    // let writer = this.marsconn.getWrite();
    // console.log("WRITer", writer);

    /////////////////////// old logic
    if(key === undefined) {
        this.marsconn.getWrite().writeJSON('unset_key', data)
        return;
    }
    var writeObj = {}
    writeObj[key] = data;
    // actual writing should be done after evaluating whole api in case of:

    // NOTE : this currenly crashes the api since headers cannot be changed after first write
    /**
     * write('xd', 'test');
     * if (somethingThatCasuesAPIToFail) {
     *  response.status(422)
     *  write('err', 'test2');
     *  exit();
     * }
     */
    this.marsconn.getWrite().writeJSON(writeObj);
}

module.exports = write;
