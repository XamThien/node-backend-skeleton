var express = require("express");
var router = express.Router();
var multer = require('multer')
var mul = multer();


const benhNhanResource = require("../app/resource/benhNhanResource.js");


////////////////////////////////////////////////////////////////////////////////////
router.post("/api/partner/public/benhNhan/layBenhNhan", benhNhanResource.layBenhNhan);

module.exports = router;
