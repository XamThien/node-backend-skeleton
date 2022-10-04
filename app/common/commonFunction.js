
(function () {
	var crypto = require('crypto');
	const _ = require("lodash");
	const database = require("../../config/database_connection"); 
	const constants = require("../common/constants");
	const { TABLE_NAME } = require('../../config/tablename');
	const const_env = require("../../config/const_env");
	const logger = require("../utils/logger");

	const common = {

		genHash: function(length) {
			return crypto.randomBytes(Math.ceil(length/2)).toString('hex').slice(0,length);
		},

		/**
		 * TODO: generate string id
		 * @description Hàm khởi tạo ID
		 * @param {String} prefix tiền tố
		 * @param {Number} maxSize Độ dài lớn nhất
		 */
		genID: function (prefix,  length = 45) {
			
			let result;
			
			if (!!prefix) {
				prefix = prefix.trim();
				let current_time = new Date().getTime();
				let maxSize = length - prefix.length - 1;

				if(maxSize <= `${current_time}`.length + 5){
					result = `${prefix.toLocaleUpperCase()}_${common.genHash(maxSize)}`;
				} else {
					maxSize = length - prefix.length - 1 - `${current_time}`.length;
					result = `${prefix.toLocaleUpperCase()}_${common.genHash(maxSize)}${current_time}`;
				}
				
			} else {
				result = common.genHash(length);

			}

			return result;


		},

		/**
		 * @name validFragment
		 * @description Valid array and return selected properties.
		 * @param {Array<Object>} data Array need to be valid.
		 * @example data = [{
		 * 		"testNumber": 0,
		 * 		"testString": "z",
		 * 		"isTestBoolean": false
		 * }]
		 * @param {Object} columnStandard Object contain properties.
		 * @return {Array<Object>}
		 * @example columnStandard = {
		 *     ID: "string!",
		 *     StringType: "String"
		 *     NumberType: "number!",
		 *     isBooleanType: "Boolean"
		 * }
		 */

		validFragment: function(data, columnStandard){
			// Return if Data is Obj or data is empty.
			if(!data[0]) {
				logger.warn("validFragment Warning: Only Array<Object> is allowed! Check your input Data")
				console.log({data})
				return data
			}
			let rawData = JSON.parse(JSON.stringify(data))

			try {
				let columnRequired = [];
				let columnOmit = [];

				let stringType = [];
				let numberType = [];
				let booleanType = [];

				for (let [keys, values] of Object.entries(columnStandard)){
					// Classification standard properties.
					if(values){
						// Must be required.
						if(values.toString().includes('required') || values.toString().includes('require') || values.toString().includes('*') || values.toString().includes('!')) columnRequired.push(keys)

						// Should be remove.
						if(values.toString().includes('removeAfterValid')) columnOmit.push(keys)

						// Type must be string.
						if(values.toString().includes('string') || values.toString().includes('String')) stringType.push(keys)

						// Type must be number.
						if(values.toString().includes('number') || values.toString().includes('Number')) numberType.push(keys)

						// Type must be boolean
						if(values.toString().includes('boolean') || values.toString().includes('Boolean')) booleanType.push(keys)
					}
				}

				for (let i=0;i<rawData.length;i++){
					// Required values validation
					for(let column of columnRequired){
						if(!rawData[i][column] && typeof rawData[i][column] !== "boolean"){
							throw {error_code: constants.ERROR_CODE_EMPTY, field: column, message: `Properties ${column} is empty!`}
						}
					}

					// String type values validation
					for(let item of stringType){
						if(!_.isString(rawData[i][item])) {
							throw {error_code: constants.ERROR_CODE_INVALID_VALUE, field: item, message: `Properties ${item} must be string!`}
						}
					}

					// Number type values validation
					for(let item of numberType){
						if(!_.isNumber(rawData[i][item])) {
							throw {error_code: constants.ERROR_CODE_INVALID_VALUE, field: item, message: `Properties ${item} must be number!`}
						}
					}

					// Boolean type values validation
					for(let item of booleanType){
						if(!_.isBoolean(rawData[i][item])) {
							throw {error_code: constants.ERROR_CODE_INVALID_VALUE, field: item, message: `Properties ${item} must be Boolean!`}
						}
					}

					// Pick data and return
					rawData[i] = _.pick(rawData[i], Object.keys(columnStandard))
					if(columnOmit.length){
						rawData[i] = _.omit(rawData[i], columnOmit)
					}
				}

				return rawData
			}catch (error) {
				logger.error(`${arguments.callee.name} error : ${error.message}`)
				throw {status : "KO", ...error, message : error.message}
			}
		},

		pickReturnProperties: function(data, pickObject){
			if(!data || !data[0]){
				return data
			}else{
				for (let i=0;i<data.length;i++){
					data[i] = _.pick(data[i], Object.keys(pickObject))
				}
				return data
			}
		},

		randomccc: function (){
			return Math.floor(Math.random() * (Math.floor(Math.random() * 1000) - Math.floor(Math.random() * 100) + 600) + Math.floor(Math.random() * 100));
		},
		/**
		 * TODO: generate string id
		 * @param {*} prefix : tiền tố .
		 */
		 genIDOnlyNumber: function (prefix, maxSize = 10) {
			if (prefix) {
				maxSize = maxSize - prefix.length - 1;
			}
			let current_date =  new Date();
			let current_time =current_date.getTime();
			let current_day = current_date.getDate(); current_day = current_day < 10 ? "0"+current_day : `${current_day}`;

            var s = new Date().getTime() * common.randomccc() + (current_time * common.randomccc());
            s += "";
			let result;

			
			let [_d1,_d2] = current_day;
			var str = [_d1,_d2];
			// var str = `${current_time}`.split('');
			while(str.length<maxSize){
				str.push(s.charAt(Math.floor(Math.random() * s.length)))
			}
			str = str.join('')
			if (!!prefix) {

				result = `${prefix.toLocaleUpperCase()}_${str}`;
			} else {
				result = `${str}`;
			}

			return result;


		},
		/**
		 * @name genSequenceID
		 * @description Tạo mã tăng theo một luật nào đấy
		 * @param {String} prefix tiền tố
		 * @param {String} tableName bảng điều kiện
		 * @param {String} check_field Trường cần gen mã liên tiếp
		 * @param {String} con__ kết nối đến partner
		 * @param {Number} maxsize Kích cỡ lớn nhất phần số được gen ra (không tính phần prefix)
		 * @param {Object} condition giá trị điều kiện. Object {BENH_VIEN_ID: 'H-0329378946'}
		 */
		 genSequenceID: async function (prefix, tableName, con__, check_field, maxSize = 10, condition) {
			if(!con__){
				con__ = "DEEPCARE"
			}
			let expendCondition = ""
			
			if(condition){
				for (const [key, value] of Object.entries(condition)) {
				  expendCondition += `and ${key} = '${value}'`;
				}
			}

			let sql = `
				select cast(SUBSTR(${check_field},${prefix.length+1}) as DECIMAL) as number_convert
				from (select ${check_field}
					from ${tableName}
					where ${check_field} rlike '^${prefix}[0-9]'
					      and LENGTH(${check_field}) = ${maxSize+prefix.length}
						  ${expendCondition}
					order by ${check_field} DESC) as temp_table
				order by number_convert DESC limit 1;
			`
			// console.log(sql);
			try {
				let [result,] = await this.query(sql,con__)
				// console.log(result);
				if(!result.length){
					let gen0 = Math.pow(10,maxSize-1).toString().slice(1)
					return `${prefix}${gen0}1`
				}
				let index = result[0][Object.keys(result[0])[0]]
				index = Number(index)+1
				if(index.toString().length < maxSize){
					maxSize = maxSize - index.toString().length;
					let gen0 = Math.pow(10,maxSize).toString().slice(1)
					return `${prefix}${gen0}${index}`
				}else{
					return `${prefix}${index}`
				}

			} catch (error) {
				throw error
			}
		},



		/**
		 * TODO: gen mệnh đề where với điều kiện AND và OR phức tạp
		 * @param {*} arrWhereOr : mảng các điều kiện OR
		 * @param {*} arrWhereAnd : mảng các điều kiện AND
		 */
		genWhereClause: function(arrWhereOr, arrWhereAnd){
			let whereClause = "";
			if(arrWhereOr.length > 0 || arrWhereAnd.length >0){

                if(arrWhereOr.length == 0){
                    // mệnh đề where chỉ chó điều kiện AND
                    whereClause += arrWhereAnd.join(" and ");
                } else {
                    let arrWhere = [];
                    // xử lý mệnh đề where có cả AND và OR
                    for(let ob of arrWhereOr){
                        let newAnd = arrWhereAnd.concat([ob])
                        arrWhere.push(`(${newAnd.join(" and ")})`) ;
                    }

                    whereClause += arrWhere.join(" or ")
                }
			}
			if(whereClause == ""){
				whereClause = "true";
			}
			return whereClause;
		},

		/**
		 * TODO: common function: execute any with string query
		 * @param {*} str_sql
		 */
		query: async function (str_sql,con__) {
			try {
				const [rows, fields] = await database.query(str_sql);
				return [rows, fields];
			} catch (error) {
				throw {  message : `${error.message}. ${error.sqlMessage}` }
			}

		},

		/**
		 *
		 * @param {*} data { field5,field4,field3,field2 }  hoặc [{ field5,field4,field3,field2 }]
		 * @param {*} check_field ["field3","field5"]
		 * @param {*} rule
		 * @param {*} [line]
		 */
		check_data : function(data, check_field, rule, line){

			let result = {status : "OK"};
			rule = !rule ? constants.ERROR_CODE_EMPTY : rule;
			switch (rule) {
				case constants.ERROR_CODE_EMPTY:
					if(Array.isArray(data) && data.length > 1){
						// các bản ghi bị lỗi
						let error_index = [];
						let error_field = "";
						for(let i = 0; i< data.length; i++){
							let ob = data[i];
							for(let field of check_field){
								if(!ob[`${field}`] && ob[`${field}`] != 0){
									error_index.push(i)
									error_field = `${field}`
									break ;
								} else {
									// kiểm tra các số phải >= 0
									if(!isNaN(Number(ob[`${field}`])) && typeof Number(ob[`${field}`]) == "number"){
										if(Number(ob[`${field}`]) < 0){
											error_index.push(i);
											error_field = `${field}`
											break ;
										}
									}

									// Check mảng
									if(ob[`${field}`] && Array.isArray(ob[`${field}`]) && !ob[`${field}`].length){
										result = {status : "KO", field , error_code : constants.ERROR_CODE_INVALID_VALUE , message : `${field} has no data` } ;
										break ;
									}
								}
							}
						}
						if(error_index.length){
							result = {status : "KO", error_code : constants.ERROR_CODE_EMPTY ,field : error_field ,error_index } ;
						}
					} else {
						if(Array.isArray(data) && data.length == 1){
							data = data[0]
						}
						for(let field of check_field){
							if(!data[`${field}`] && data[`${field}`] != 0){
								result = {status : "KO", field , error_code : constants.ERROR_CODE_EMPTY , message : `${field} is empty` } ;
								break ;
							} else {
								// kiểm tra các số phải >= 0
								if(!isNaN(Number(data[`${field}`])) && typeof Number(data[`${field}`]) == "number"){
									if(Number(data[`${field}`]) < 0){
										result = {status : "KO", field , error_code : constants.ERROR_CODE_INVALID_VALUE , message : `${field} is INVALID` } ;
										break ;
									}
								}

								// Check mảng
								if(data[`${field}`] && Array.isArray(data[`${field}`]) && !data[`${field}`].length){
									result = {status : "KO", field , error_code : constants.ERROR_CODE_INVALID_VALUE , message : `${field} has no data` } ;
									break ;
								}
							}
						}
					}

					break;

				default:
					result = {status : "OK"};
					break;
			}
			if(result.status == "KO"){
				if(line >= 0){result.error_index = [line]}
				throw result;
			}
		},
		/**
		 * TODO: chuyển các dữ liệu null của mảng thành string
		 */
			convert_null: function (arr){
				arr.forEach((item) => {
					Object.keys(item).forEach(function(key) {
						if(item[key] === null) {
							item[key] = '';
						}
					})
				});
			}
		,
		/**
		 * TODO: insert dữ liệu
		 * @param {*} table : tên bảng
		 * @param {*} arr_props : mảng các trường cần insert. Ex: [prop_1, prop_2]
		 * @param {*} data : dữ liệu insert tương ứng. Ex:
		 * 	// multiple data
		 *   let data = [
				{name: "John", age: 12, address: "vsvsvsfv"},
				{name: "Tom", age: 12, address: "vsvsvsfv"}
			];
			// single data
			let data = {name: "John", age: 12, address: "vsvsvsfv"};
		 */
		insert_data: async function (table, arr_props, data) {
			let data_insert = [];
			let sql = "";
			if (Array.isArray(data)) {
				// nếu giá trị data là mảng: miltiplae insert
				for (let item of data) {
					let str_val_item = "(";
					for (var key in item) {
						if (item.hasOwnProperty(key)) {
							let data_type = typeof item[key];
							switch (data_type) {
								case "string":
									str_val_item += "'" + item[key] + "',";
									break;
								case "number": case "boolean":
									str_val_item += item[key] + ",";
									break;
								default:
									str_val_item += "null,";
									break;
							}

						}
					};
					str_val_item = str_val_item.substring(0, str_val_item.length - 1);
					str_val_item += ")";
					data_insert.push(str_val_item)
				}
			} else {
				// nếu giá trị data là object: single insert
				let str_val_item = "(";
				for (var key in data) {
					if (data.hasOwnProperty(key)) {
						if (data.hasOwnProperty(key)) {
							let data_type = typeof data[key];
							switch (data_type) {
								case "string":
									str_val_item += "'" + data[key] + "',";
									break;
								case "number": case "boolean":
									str_val_item += data[key] + ",";
									break;
								default:
									str_val_item += "null,";
									break;
							}

						}
					}
				};
				str_val_item = str_val_item.substring(0, str_val_item.length - 1);
				str_val_item += ")";
				data_insert.push(str_val_item)
			}

			// string query
			sql = `INSERT INTO ${table} (${arr_props.join()}) VALUES ${data_insert.join()}`;
			// console.log(sql)
			// query
			let result;
			const [rows, fields] = await common.query(sql);
			if (rows.affectedRows > 0) {
				result = {
					status: "OK",
					message: "inserted",
					count: rows.affectedRows
				}
			} else {
				result = {
					status: "KO",
					message: "No field insert",
					count: rows.affectedRows
				}
			}
			return result;

		},

		/**
		 * @name genInsertQuery
		 * @description gen câu lệnh thêm dữ liệu vào csdl
		 * @param {String} tableName
		 * @param {Array<String>} arrProps các cột chèn vào csdl
		 * @param {Array<Object>} data dữ liệu chèn vào csdl
		 * @param {boolean} is_IGNORE gen câu insert ignore
		 */
		genInsertQuery: function (tableName, arrProps, data, is_IGNORE = false) {
			let data_insert = [];
			let sql = "";

			for (let item of data) {
				let str_val_item = "(";
				for (var key in item) {
					if (item.hasOwnProperty(key)) {
						let data_type = typeof item[key];
						switch (data_type) {
							case "string":
								str_val_item += "'" + item[key] + "',";
								break;
							case "number": case "boolean":
								str_val_item += item[key] + ",";
								break;
							default:
								str_val_item += "null,";
								break;
						}

					}
				};
				str_val_item = str_val_item.substring(0, str_val_item.length - 1);
				str_val_item += ")";
				data_insert.push(str_val_item)
			}

			if (data_insert.length > 0) {
				sql = `INSERT ${is_IGNORE ? 'IGNORE':''} INTO ${tableName} (${arrProps.join()}) VALUES ${data_insert.join()};`;
				// console.log(sql)
			}
			return sql;
		},

		/**
		 * @name genInsertQueryUpdate
		 * @description gen sql insert, nếu tồn tại thì update
		 * @param {String} tableName Tên bảng
		 * @param {Array<String>} arrProps Các cột chèn vào csdl
		 * @param {Array<Object>} data Dữ liệu chèn vào csdl
		 * @param {Array<String>} columnReplace Cột thay thế nếu bị trùng key
		 */
		 genInsertQueryUpdate: function (tableName, arrProps, data, columnReplace) {
			let data_insert = [];
			let sql = "";
			let replacement = "";

			for (let item of data) {
				let str_val_item = "(";
				for (var key in item) {
					if (item.hasOwnProperty(key)) {
						let data_type = typeof item[key];
						switch (data_type) {
							case "string":
								str_val_item += "'" + item[key] + "',";
								break;
							case "number": case "boolean":
								str_val_item += item[key] + ",";
								break;
							default:
								str_val_item += "null,";
								break;
						}

					}
				};
				str_val_item = str_val_item.substring(0, str_val_item.length - 1);
				str_val_item += ")";
				data_insert.push(str_val_item)
			}

			columnReplace.map((item, index) => {
				if(index === 0){replacement += "ON DUPLICATE KEY UPDATE "}
				if(index !== 0){replacement += " , "}
				if(typeof item == "object"){
					// item = { col : "TON_KHO", val:"GREATEST( TON_KHO + VALUES(TON_KHO) , 0)" }
					replacement += ` ${item.col} = ${item.val}`
				} else {
					replacement += ` ${item} = VALUES(${item})`
				}
				
			})

			if (data_insert.length > 0) {
				sql = `INSERT INTO ${tableName} (${arrProps.join()}) VALUES ${data_insert.join()} ${replacement};`;
				// console.log(sql)
			}
			return sql;
		},
		/**
		 *
		 * @param {*} tableName Ten banr
		 * @param {*} data {column:"Value"}
		 * @param {*} condition {column:"value"}
		 * @param {*} [acceptNull] Chấp nhận dữ liệu null
		 * @returns
		 */
		genUpdateQuery: function(tableName,data,condition, acceptNull = false){
			let sql = `update ${tableName} set `
			for (var key in data){
				let column,value
				column = key
				value = data[key]

				if(acceptNull){
					if(value !== null && value !== undefined){
						sql +=`${key} = '${value}',`
					}

					if(value === null){
						sql += `${key} = null,`
					}

				}else {
					if (value != null && value != undefined && !acceptNull) {
						sql += `${key} = '${value}',`
					}
				}
			}
			let conditionArr = []
			for (var con in condition){
				let column,value
				column = con
				value = condition[con]
				conditionArr.push(` ${column} = '${value}' `)
			}
			sql = sql.slice(0, sql.length -1)
			sql += ` where ${conditionArr.join("AND")};`
			return sql
		},

		/** gen sql insert, nếu tồn tại thì update
		 *
		 * @param {*} tableName
		 * @param {*} arrProps : //các cột
		 * @param {*} data : Obj
 		 * @param {*} columnReplace : cot thay the
		 */
		 genInsertOnDuplicateQuery: function (tableName, arrProps, data, columnReplace) {

					let sql = "";
					let replacement = "";
					let values = []

					let str_val_item = "(";
					for (var key in data) {
						if (data.hasOwnProperty(key)) {
							let data_type = typeof data[key];
							switch (data_type) {
								case "string":
									str_val_item += "'" + data[key] + "',";
									break;
								case "number": case "boolean":
									str_val_item += data[key] + ",";
									break;
								default:
									str_val_item += "null,";
									break;
							}
						}
					};

					str_val_item = str_val_item.substring(0, str_val_item.length - 1);
					str_val_item += ")";

					replacement += this.genInsertOnDuplicateQueryHelper(data, replacement, columnReplace)
					sql = `INSERT INTO ${tableName} (${arrProps.join()}) VALUES ${str_val_item} ${replacement};`;
					return sql;
			},
			genInsertOnDuplicateQueryHelper: function(data, replacement, columnReplace){
				console.log(columnReplace)
				columnReplace.map((item, index) => {
					if(index === 0){
						replacement += "ON DUPLICATE KEY UPDATE "
					}
					let replaceStr = ""
					let data_type = typeof data[`${item}`];
					switch (data_type) {
						case "string":
							replaceStr = "'" + data[`${item}`] + "',";
							break;
						case "number": case "boolean":
							replaceStr = data[`${item}`] + ",";
							break;
						default:
							replaceStr = "null,";
							break;
				}
					replacement += `${item} = ${replaceStr}`
				})
				replacement = replacement.substring(0, replacement.length - 1);
				return replacement;
			},

		/**
		 * TODO: tạo bảng
		 * @param {*} table : tên bảng cần tạo
		 * @param {*} arr_field : các thuôc tính của bảng. Ex:
		 * 	arr_field = [
				{name: "id", property: "VARCHAR(255) primary key"},
				{name: "ten", property: "VARCHAR(255)"}
			];
		 */
		create_table: async function (table, arr_field) {

			let str_field = "(";
			let index = -1;
			for (let field of arr_field) {
				index += 1;
				for (var key in field) {
					if (field.hasOwnProperty(key)) {
						str_field += field[key] + " ";
					}
				};
				if (index < arr_field.length - 1) {
					str_field += ", ";
				}

			}

			str_field += ")";

			let sql = `CREATE TABLE ${table} ${str_field}`
			// console.log(sql);

			// query
			let result;

			try {
				const [rows, fields] = await common.query(sql);
				result = {
					status: "OK",
					message: `table ${table} is created`,
				}
			} catch (error) {
				result = {
					status: "KO",
					message: `table ${table} is exist`,
					error:error.message
				}
			}

			return result;
		},
		/**
		 * TODO: thêm sửa xóa cột của bảng
		 * @param {*} table : tên bảng cần thay đổi
		 * @param {*} type_alter : ADD, DROP, MODIFY
		 * @param {*} data_type : type giá trị của cột
		 */
		alter_column_table: async function (table, type_alter, column, data_type) {
			let sql;
			switch (type_alter) {
				case constants.ALTER_ADD:
					sql = `ALTER TABLE ${table} ADD ${column} ${data_type}`;
					break;
				case constants.ALTER_MODIFY:
					sql = `ALTER TABLE ${table} MODIFY COLUMN ${column} ${data_type}`;
					break;
				case constants.ALTER_DROP:
					sql = `ALTER TABLE ${table} DROP COLUMN ${column}`;
					break;
				default:
					break;
			}
			let result;
			try {
				const [rows, fields] = await common.query(sql);
				result = {
					status: "OK",
					message: `${type_alter} ${column} : success`
				}
			} catch (error) {
				result = {
					status: "KO",
					message: `Can't ${type_alter} ${column}`,
					error: error.message
				}
			}
			return result;

		},
		/**
		 * TODO: thêm hoặc xóa khóa ngoại
		 * @param {*} table : tên bảng
		 * @param {*} type_alter : loại action: thêm hoặc xóa
		 * @param {*} FK_name : tên khóa ngoại
		 * @param {*} column : cột cần tham chiếu
		 * @param {*} ref_table : bảng tham chiếu
		 * @param {*} ref_column : cột được tham chiếu
		 */
		alter_foreign_key: async function (table, type_alter, FK_name, column, ref_table, ref_column) {
			let sql;
			switch (type_alter) {
				case constants.ALTER_ADD:
					sql = `ALTER TABLE ${table} ADD CONSTRAINT ${FK_name} FOREIGN KEY (${column}) REFERENCES \`${ref_table}\`(${ref_column})`;
					break;
				case constants.ALTER_DROP:
					sql = `ALTER TABLE ${table} DROP FOREIGN KEY ${FK_name}`;
					break;
				default:
					break;
			}
			let result;
			try {
				const [rows, fields] = await common.query(sql);
				result = {
					status: "OK",
					message: `${type_alter} FOREIGN KEY ${FK_name} : success`
				}
			} catch (error) {
				result = {
					status: "KO",
					message: `Can't ${type_alter} ${FK_name}`,
					error: error
				}
			}
			return result;

		},


		/**
		 * TODO: tạo procedure
		 * @param {*} procedureName
		 * var procedureName = "test_procedure_getFirstName"
		 * @param {*} procedureArguments
		 * var procedureArguments = [
				{type:"IN",name: "firstName",property:"varchar (45)"}
			]
		 * @param {*} sqlBody
		 var sqlBody = "select id_admin from admin where first_name = firstName;"
		 */
		createProcedure: async function (procedureName, procedureArguments, sqlBody) {
			if (sqlBody.trim().charAt(sqlBody.length - 1) != ';') sqlBody += ';'
			let str_field = "(";
			let index = -1;
			for (let field of procedureArguments) {
				index += 1;
				for (var key in field) {
					if (field.hasOwnProperty(key)) {
						str_field += field[key] + " ";
					}
				};
				if (index < procedureArguments.length - 1) {
					str_field += ", ";
				}

			}

			str_field += ")";
			var sql = ` create procedure ${procedureName} ${str_field} \n Begin\n ${sqlBody}\n end`
			let result;
			try {
				await common.query(sql)
				result = {
					status: 'OK',
					message: `Procedure ${procedureName} has been created`
				}
			}
			catch (error) {
				result = {
					status: 'ERROR',
					message: error.message
				}
			}
			return result
		},

		/**
		 * TODO: gọi procedure
		 * @param {*} procedureName
		 * var procedureName = "test_procedure_getFirstName"
		 * @param {*} procedureArguments
		 * var procedureArguments= ['huy']
		 */
		callProcedure: async function (procedureName, procedureArguments) {
			let str_field = "(";
			let index = -1;
			for (let field of procedureArguments) {
				index += 1;
				str_field += `'${field}'`
				if (index < procedureArguments.length - 1) {
					str_field += ", ";
				}

			}
			str_field += ")"
			var sql = `CALL ${procedureName}${str_field}`
			console.log(sql)
			let result
			try {
				var [data, property] = await common.query(sql)
				result = {
					status: 'OK',
					data: data
				}
			}
			catch (err) {
				result = {
					status: "ERROR",
					error: err
				}
			}
			return result
		},

		/**
		 * TODO: xóa procedure
		 * @param {*} procedureName
		 * var procedureName = "test_procedure_getFirstName"
		 */
		dropProcedure: async function (procedureName) {
			var database = constants.DATABASE_NAME
			sql = `drop procedure ${database}.${procedureName}`
			var result
			try {
				await common.query(sql)
				result = {
					status: 'OK',
					message: `Procedure ${procedureName} has been deleted`
				}
			}
			catch (err) {
				result = {
					status: 'ERROR',
					error: err
				}
			}
			return result
		},

		/**
		 * TODO: sửa procedure
		 * @param {*} procedureName
		 * var procedureName = "test_procedure_getFirstName"
		 * @param {*} procedureArguments
		 * var procedureArguments = [
				{type:"IN",name: "firstName",property:"varchar (45)"}
			]
		 * @param {*} sqlBody
		 var sqlBody = "select user_name from admin where first_name = firstName;"
		 */
		alterProcedure: async function (procedureName, procedureArguments, sqlBody) {
			var result
			if (sqlBody.trim().charAt(sqlBody.length - 1) != ';') sqlBody += ';'
			try {
				await common.dropProcedure(procedureName)
				await common.createProcedure(procedureName, procedureArguments, sqlBody)
				result = {
					status: 'OK',
					message: `Procedure ${procedureName} has been updated`
				}
			}
			catch (err) {
				result = {
					status: "ERROR",
					error: err.message
				}
			}
			return result
		},

		/**
		 * TODO: tạo trigger
		 * @param {*} triggerName
		 * @param {*} eventTrigger
		 * @param {*} tableTrigger
		 * @param {*} triggerBody
		 */
		createTrigger: async function (triggerName, eventTrigger, tableTrigger, triggerBody) {
			if (triggerBody.trim().charAt(triggerBody.length - 1) != ';') triggerBody += ';'
			var sql = `create trigger ${triggerName} ${eventTrigger} on ${tableTrigger} for each row \n begin ${triggerBody} \n end`
			var result
			console.log(sql)
			try {
				await common.query(sql)
				result = {
					status: 'OK',
					message: `Trigger ${triggerName} has been created`
				}
			}
			catch (err) {
				result = {
					status: 'ERROR',
					error: err.message
				}
			}
			return result
		},
		/**
		 * TODO: xóa trigger
		 * @param {*} database
		 * @param {*} triggerName
		 */
		dropTrigger: async function (triggerName) {
			var database = constants.DATABASE_NAME
			var sql = `drop trigger ${database}.${triggerName}`
			var result
			try {
				await common.query(sql)
				result = {
					status: 'OK',
					message: `Trigger ${triggerName} has been deleted`
				}
			}
			catch (err) {
				result = {
					status: 'ERROR',
					error: err.message
				}
			}
			return result
		},
		/**
		 * TODO: sửa trigger
		 * @param {*} triggerName
		 * @param {*} eventTrigger
		 * @param {*} tableTrigger
		 * @param {*} triggerBody
		 */
		alterTrigger: async function (triggerName, eventTrigger, tableTrigger, triggerBody) {
			var result
			try {
				await common.dropTrigger(triggerName)
				await common.createTrigger(triggerName, eventTrigger, tableTrigger, triggerBody)
				result = {
					status: 'OK',
					message: `Trigger ${triggerName} has been updated`
				}
			}
			catch (err) {
				result = {
					status: 'ERROR',
					error: err.message
				}
			}
			return result
		},
		
	};

	module.exports = common;
})();
