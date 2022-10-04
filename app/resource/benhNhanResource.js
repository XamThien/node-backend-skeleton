const constants = require("../common/constants.js");
const benhNhanService = require("../service/benhNhanService.js");
const common = require("../common/commonFunction");
const logger = require("../utils/logger");

function resource() {
    this.layBenhNhan = layBenhNhan;
}
async function layBenhNhan(req,res){
    try {
        common.check_data(req.body, ["BENH_VIEN_ID"], constants.ERROR_CODE_EMPTY)
        res.json(await benhNhanService.layBenhNhan(req.body))
    }catch(error){
        logger.error(`${arguments.callee.name} error : ${error.message}`)
        res.json({status: "KO", ...error})
    }
}

module.exports = new resource
