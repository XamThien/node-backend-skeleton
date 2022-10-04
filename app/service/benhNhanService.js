const common = require("../common/commonFunction");
const benhNhanRepository = require("../repository/benhNhanRepository");
const logger = require("../utils/logger");
const constants = require("../common/constants");

function service() {
    this.layBenhNhan = layBenhNhan;
    

}

async function layBenhNhan(input){
    return await benhNhanRepository.layBenhNhan(input)
}



module.exports = new service
