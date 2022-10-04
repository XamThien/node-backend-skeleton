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

define("Env_Var", "localhost");
define("mysql_host", "localhost");
define("mysql_user", "root");
define("database_name", "huytv04_16632957919");
define("mysql_password", "huyhuyhuy");
define("INTERNAL_CIS_BS_WS_URL","http://localhost:8181");



exports.exportObject = null;
