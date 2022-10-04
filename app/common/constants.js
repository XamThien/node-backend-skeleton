global.define = function(name, value, exportsObject) {
	if (!exportsObject) {
		if (exports.exportsObject) exportsObject = exports.exportsObject;
		else exportsObject = exports;
	}

	Object.defineProperty(exportsObject, name, {
		value: value,
		enumerable: true,
		writable: false
	});
};


define("SERVER_PORT", 8182);

define("ERROR_404", "File not found");
define("USERNAME", "hoan.dinh");
define("EMAIL", "hoan.dinh@deepcare.io");

// alter method
define("ALTER_ADD", "ADD");
define("ALTER_MODIFY", "MODIFY");
define("ALTER_DROP", "DROP");

// type history modify
define("HISTOSY_INSERT", "INSERT");
define("HISTOSY_DELETE", "DELETE");
define("HISTOSY_CLOSE", "CLOSE");


define("ERROR_CODE_EXIST" , "001"); // lỗi đã tồn tại
define("ERROR_CODE_EMPTY" , "002"); // lỗi không nhập giá trị
define("ERROR_CODE_INVALID_VALUE" , "003"); // lỗi giá trị không hợp lệ
define("ERROR_CODE_NOT_MATCH" , "004"); // lỗi không trùng khớp
define("ERROR_CODE_EXPIRE_OTP" , "005"); // lỗi otp quá hạn
define("ERROR_CODE_NO_MORE_OTP" , "006"); // lỗi gửi otp quá số lượng 1 ngày
define("ERROR_CODE_CONSTRAINT_KEY" , "007"); // lỗi khi xóa danh mục cha nhưng vẫn chưa xóa hết con
define("ERROR_CODE_MODIFY_LICH_LAM_VIEC" , "008"); // lỗi cập nhật lịch làm việc
define("ERROR_PAID_SERIVCE" , "paid_service"); // lỗi dịch vụ đã thanh toán // bỏ
define("ERROR_CODE_PAID_SERIVCE" , "009"); // lỗi dịch vụ đã thanh toán
define("ERROR_CODE_NOT_EXIST" , "010"); // lỗi không tồn tại
define("ERROR_CODE_THUOC_TRONG_LO_THUOC_DA_NHAP_KHO" , "011"); // lỗi đã đã nhập thuốc trong lô
define("ERROR_CODE_DUPPLICATE_INPUT", "012") // Lỗi dữ liệu đầu vào bị trùng
define("ERROR_CODE_DATA_TOO_LARGE", "014") // Dữ liệu quá lớn khi import
define("ERROR_CODE_CANT_LOCK_ROOM", "015") //Lỗi không khóa được phòng do đang có lịch khám và không có phòng để thay đổi - HIS-1252
define("ERROR_CODE_CONSTRAINT_PHIEU_NHAP_XUAT", "016") //Lỗi không xóa được phiếu do có thuốc trong đơn đã được kê

exports.exportObject = null;
