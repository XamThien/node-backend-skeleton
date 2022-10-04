const { TABLE_NAME } = require("../../config/tablename");
const constants = require("../common/constants.js");
const common = require("../common/commonFunction")
const _ = require("lodash");
const logger = require("../utils/logger")


function repository() {
    this.layBenhNhan = layBenhNhan;
   
}

/**
 * TODO: Lấy Ds bệnh nhân
 * @param {*} input 
 * @param {*} con__ 
 */
async function layBenhNhan(input){
    let {
        BENH_VIEN_ID = '',
        limit = 15,
        page = 1,
        search_string = ''
    } = input

    let offset = (page - 1) * limit;
    let expandCondition = ""

    if(search_string.trim()){
        search_string = search_string.trim().toLowerCase();
        if(typeof search_string === "string" && search_string.length >= 4){
            expandCondition += ` and lower(concat(' ', bn.TEN, ' ')) like '% ${search_string} %' `
        }else{
            expandCondition += ` and lower(bn.TEN) like '% ${search_string} %' `
        }

    }

    let sql = `
        select SQL_CALC_FOUND_ROWS bn.*
        from ${TABLE_NAME.BENH_NHAN} as bn 
       
        where true
        ${expandCondition}
        limit ${limit}
        offset ${offset};
        select FOUND_ROWS() as 'total';
        `
    console.log(sql)

    try {
        let [result,] = await common.query(sql)

        let [data, count] = result;
        let total = count[0].total
        let totalPage = Math.ceil(total / limit)

        return { status: "OK", result : data,
            total,
            count_page: totalPage, current_page: page, next_page: totalPage <= page ? null : page+1,
        }
    }catch (error) {
        logger.error(`${arguments.callee.name} error : ${error.message}`)
        return {status : "KO", ...error, message: error.message}
    }
}


module.exports = new repository
