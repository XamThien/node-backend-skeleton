
const constants = require("../common/constants");
const constants_env = require("../../config/const_env");

function Util() {
    this.locdau = locdau;
    this.remove_character =  remove_character;
    this.parseStandardDate = parseStandardDate;
    this.JSONparse = JSONparse;
    this.distance = distance;
    this.common_get = common_get;
    this.common_post = common_post;
    this.validateValue = validateValue;
    this.mergeDate = mergeDate;
    this.layGioiTinh = layGioiTinh;
    this.convertDateStringToDate = convertDateStringToDate;
    this.reverseString = reverseString;
    this.formatDTBN = formatDTBN;
    this.formatKQKB = formatKQKB;
    this.formatXT = formatXT;
    this.tinhTiTrong = tinhTiTrong;
    this.docTienBangChu = DocTienBangChu;
    this.getNewIndexID = getNewIndexID;
    this.getDiaChi = getDiaChi;
}
module.exports = new Util;





    /**
     * TODO: lọc dấu
     */
    function locdau (str) {
        str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
        str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
        str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
        str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
        str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
        str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
        str = str.replace(/đ/g, "d");
        return str;
    };

    /**
     * TODO: lọc kí tự
     */
   function remove_character (str) {
        str = str.replace(/[&\/\\#,+()$~%.'!@^"_:*?<>{}]/g, "");
        return str;
    };

    /**
     * TODO: xử lí dữ liệu http đẩy lên null nhưng nhận ''
     */
    function validateValue(value, default_value = ''){
        if(value === 0){
            return  0;
        }
        if(!value || value === ''){
            return default_value;
        }
        return value;
    };

    /**
     * TODO: lấy ngày tính từ 7:00,
     * Xử lý cho ngày của lịch hẹn, lịch làm việc
     * @param {*} date
     */
    function parseStandardDate(date){
        if(!date){
            date = new Date().getTime();
        }
        let result = date;
        date = new Date(date)
        let day = date.getDate();
        day = day > 9 ? day : "0"+day;
        let month = Number(date.getMonth()) + 1;
        month = month > 9 ? month : "0"+month;
        let year = date.getFullYear();

        var strr_date = year+"-" + month+"-"+day; // tính từ 7h
        result = new Date(strr_date).getTime();
        // console.log(result)
        return result;
    }

    /**
     * TODO: parse json
     */
    function JSONparse(data, defaultData=[]){
        let result = defaultData;
        data = data.replace(/\n/g, "\\n")
        .replace(/\r/g, "\\r")
        .replace(/\t/g, "\\t")
        .replace(/\f/g, "\\f");
        try {
            result = JSON.parse(data);
        } catch (error) {
            console.log(data);
        }
        return result;
    }

    /**
     * TODO: tính khoảng cách giữa 2 tọa độ
     * @param {*} point1 "lat":21.0313,"long":105.8516}
     * @param {*} point2 {"lat":20.973407,"long":105.7772718}
     */
    function distance(point1, point2){
        if(!point1 || !point2){
            return 0;
        }

        if(point1 && !point1.lat || point1 && !point1.long) {
            return 0;
        }

        if(point2 && !point2.lat || point2 && !point2.long) {
            return 0;
        }

        try {
            var R = 3958.8; // Radius of the Earth in miles
            var rlat1 = point1.lat * (Math.PI/180); // Convert degrees to radians
            var rlat2 = point2.lat * (Math.PI/180); // Convert degrees to radians
            var difflat = rlat2 - rlat1; // Radian difference (latitudes)
            var difflon = (point2.long - point1.long) * (Math.PI/180); // Radian difference (longitudes)
            var d = 2 * R * Math.asin(Math.sqrt(Math.sin(difflat/2)*Math.sin(difflat/2)+Math.cos(rlat1)*Math.cos(rlat2)*Math.sin(difflon/2)*Math.sin(difflon/2)));
            d = d * 1.5;
            d = parseFloat(d.toFixed(2));
            console.log("distance ..."+d + "km") ;
            return d;
        } catch (error) {
            console.log("function distance error: "+error.message)
            return 0;
        }
      }

      /**
     * TODO: tính khoảng cách giữa 2 tọa độ
     * @param {*} point1 "lat":21.0313,"long":105.8516}
     * @param {*} point2 {"lat":20.973407,"long":105.7772718}
     */
    function layGioiTinh(key){
        switch (key) {
            case "nam":
                return "Nam"
            case "nu":
                return "Nữ"
            case "khac":
                return "Khác"
            default:
                return "";
        }
      }

      /**
     * TODO: Format lại Đối tượng bệnh nhân
     */
    function formatDTBN(key) {
      switch (key) {
        case "BHYT":
          return "BHYT";
        case "VIEN_PHI":
          return "Viện phí";
        case "YEU_CAU":
          return "Yêu cầu";
        case "MIEN_GIAM":
          return "Miễn giảm";
        case "NUOC_NGOAI":
          return "Nước ngoài";
        case "KT_TU_NGUYEN":
          return "KT_TU_NGUYEN";
        case "KT_BHYT":
          return "KT_BHYT";
        default:
          return "";
      }
    }

    /**
   * TODO: Format lại kết quả khám chữa bệnh
   */
    function formatKQKB(key) {
      switch (key) {
        case "KHOI_BENH":
          return "Khỏi bệnh";
        case "DO":
          return "Đỡ";
        case "KHONG_THAY_DOI":
          return "Không thay đổi";
        case "NANG":
          return "Nặng";
        case "TU_VONG":
          return "Tử vong";
        default:
          return "";
      }
    }

    /**
   * TODO: Format lại xử
   */

    function formatXT(key) {
      switch (key) {
        case "RA_VIEN":
          return "Ra viện";
        case "CHUYEN_VIEN":
          return "Chuyển viện";
        case "TRON_VIEN":
          return "Trốn viện";
        case "XIN_RA_VIEN":
          return "Xin ra viện";
        default:
          return "";
      }
    }



       /**
     * TODO: convert ngày từ dạng YYYYMMDD sang dd/mm/yyyy
     * @param {*} point1 "lat":21.0313,"long":105.8516}
     * @param {*} point2 {"lat":20.973407,"long":105.7772718}
     */
    function convertDateStringToDate(dateString){
        if (dateString && dateString !== "") {
            let year = dateString.slice(0, 4);
            let moth = dateString.slice(4, 6);
            let date = dateString.slice(6, 8);
            return date + "/" +  moth + "/" + year;
          }
          return "";
      }

    /**
     * TODO: Hàm chuyển các giá trị thời gian của ngày cũ sang ngày mới
     * @param {*} fixDate : Ngày cần đổi sang
     * @param {*} oldDate : Ngày cũ, nhưng các thời gian cần sử dụng
     */
    function mergeDate(fixDate, oldDate){
        let is_past_date = 0;

        let ob_date = new Date(Number(fixDate));
        // console.log("ob_date...." +ob_date);
        let d = ob_date.getDate();
        let m = ob_date.getMonth();
        let y = ob_date.getFullYear();

        let dd = new Date(Number(oldDate));
        // console.log("dd...." +dd);
        let tz = new Date().getTimezoneOffset() / (-60);
        // console.log("tz...." +tz);
        let vn_tz = 7;
        ob_date = new Date(Number(oldDate) + (vn_tz-tz) * 60 * 60 * 1000 );
        // console.log("new ob_date...." +ob_date);
        if(ob_date.getHours()<vn_tz){
            // console.log("ob_date.getHours()="+ob_date.getHours())
            is_past_date  = 1;
        }

        dd.setFullYear(y);
        dd.setMonth(m);
        dd.setDate(d);


        // console.log("after dd...." + dd );

            let result = dd.getTime() - is_past_date * 24 * 60 * 60 * 1000;
            // console.log("result...." + new Date(result));

        return result;

    }

     /**
     * đảo ngược string
     * @param {*} string "lat":21.0313,"long":105.8516}
     */
      function reverseString(string = ''){
        let output = output.split('');
        output = output.reverse();
        output = output.join('')

        return output
      }

    /**
     * Tính tỉ trọng
     * @param inputValue number 22
     * @param totalValue number 123123
     */
      function tinhTiTrong(inputValue, totalValue){
        if(!inputValue && !totalValue){
            return 0
        }
        return Math.round(inputValue/totalValue * 10000)/100
      }

  //////////////////////////////////////////////////////////

var ChuSo=new Array(" không "," một "," hai "," ba "," bốn "," năm "," sáu "," bảy "," tám "," chín ");
var Tien=new Array( "", " nghìn", " triệu", " tỷ", " nghìn tỷ", " triệu tỷ");

//1. Hàm đọc số có ba chữ số;
 function DocSo3ChuSo(baso)
{
    var tram;
    var chuc;
    var donvi;
    var KetQua="";
    tram=parseInt(baso/100);
    chuc=parseInt((baso%100)/10);
    donvi=baso%10;
    if(tram==0 && chuc==0 && donvi==0) return "";
    if(tram!=0)
    {
        KetQua += ChuSo[tram] + " trăm ";
        if ((chuc == 0) && (donvi != 0)) KetQua += " linh ";
    }
    if ((chuc != 0) && (chuc != 1))
    {
            KetQua += ChuSo[chuc] + " mươi";
            if ((chuc == 0) && (donvi != 0)) KetQua = KetQua + " linh ";
    }
    if (chuc == 1) KetQua += " mười ";
    switch (donvi)
    {
        case 1:
            if ((chuc != 0) && (chuc != 1))
            {
                KetQua += " mốt ";
            }
            else
            {
                KetQua += ChuSo[donvi];
            }
            break;
        case 5:
            if (chuc == 0)
            {
                KetQua += ChuSo[donvi];
            }
            else
            {
                KetQua += " lăm ";
            }
            break;
        default:
            if (donvi != 0)
            {
                KetQua += ChuSo[donvi];
            }
            break;
        }
    return KetQua;
}

//2. Hàm đọc số thành chữ (Sử dụng hàm đọc số có ba chữ số)

 function DocTienBangChu(SoTien){
    SoTien = Number(SoTien);
    var lan=0;
    var i=0;
    var so=0;
    var KetQua="";
    var tmp="";
    var ViTri = new Array();
    if(SoTien<0) return "Số tiền âm";
    if(SoTien==0) return "Không đồng";
    if(SoTien>0)
    {
        so=SoTien;
    }
    else
    {
        so = -SoTien;
    }
    if (SoTien > 8999999999999999)
    {
        //SoTien = 0;
        return "Số quá lớn!";
    }
    ViTri[5] = Math.floor(so / 1000000000000000);
    if(isNaN(ViTri[5]))
        ViTri[5] = "0";
    so = so - parseFloat(ViTri[5].toString()) * 1000000000000000;
    ViTri[4] = Math.floor(so / 1000000000000);
     if(isNaN(ViTri[4]))
        ViTri[4] = "0";
    so = so - parseFloat(ViTri[4].toString()) * 1000000000000;
    ViTri[3] = Math.floor(so / 1000000000);
     if(isNaN(ViTri[3]))
        ViTri[3] = "0";
    so = so - parseFloat(ViTri[3].toString()) * 1000000000;
    ViTri[2] = parseInt(so / 1000000);
     if(isNaN(ViTri[2]))
        ViTri[2] = "0";
    ViTri[1] = parseInt((so % 1000000) / 1000);
     if(isNaN(ViTri[1]))
        ViTri[1] = "0";
    ViTri[0] = parseInt(so % 1000);
  if(isNaN(ViTri[0]))
        ViTri[0] = "0";
    if (ViTri[5] > 0)
    {
        lan = 5;
    }
    else if (ViTri[4] > 0)
    {
        lan = 4;
    }
    else if (ViTri[3] > 0)
    {
        lan = 3;
    }
    else if (ViTri[2] > 0)
    {
        lan = 2;
    }
    else if (ViTri[1] > 0)
    {
        lan = 1;
    }
else
    {
        lan = 0;
    }
    for (i = lan; i >= 0; i--)
    {
       tmp = DocSo3ChuSo(ViTri[i]);
       KetQua += tmp;
       if (ViTri[i] > 0) KetQua += Tien[i];
       if ((i > 0) && (tmp.length > 0)) KetQua += ',';//&& (!string.IsNullOrEmpty(tmp))
    }
   if (KetQua.substring(KetQua.length - 1) == ',')
   {
        KetQua = KetQua.substring(0, KetQua.length - 1);
   }
   KetQua = KetQua.substring(1,2).toUpperCase()+ KetQua.substring(2);
   KetQua = KetQua.replace(/, /g, ' ')
   KetQua = KetQua.replace(/ /g, ' ')
   return KetQua;
}

/**
* @name getNewIndexID
* @description Hàm hỗ trợ của genSequenseID, Gen ID cho những phần tử sau trong mảng
 * @param {String!} indexID Giá trị gen ra được từ hàm genSequenseID
 * @param {String!} prefix Prefix dùng để gen
 * @param {Number} size kích cỡ phần được gen ra
 */

function getNewIndexID(indexID, prefix, size){
    let rawInput = JSON.parse(JSON.stringify(indexID))
    let newID = Number(rawInput.slice(prefix.length)) + 1

    if(newID.toString().length < size){
        size = size - newID.toString().length;
        let gen0 = Math.pow(10,size).toString().slice(1)
        return `${prefix}${gen0}${newID}`
    }else{
        return `${prefix}${newID}`
    }
}

function getDiaChi(address){
    if(!address) return address

    address = address.split(",")

    _.remove(address, c => {
        return c === ""
    })
    return address.join(", ")
}

  //////////////////////////////////////////////////////////