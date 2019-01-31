(function(win, dom, undefined) {
	var PrintData = function(data) {
		this.Data = "";
		if (data instanceof Object) {
			this.Data = data;
		}
	};
	PrintData.prototype = {
		printout: function() {
			var sample = this.Data;
			function a(data) {
				var str = "";
				if (data instanceof Array) {
					str += "[";
					for (var element of data) {
						str += a(element) + ",";
					}
					str = str.substring(0, str.length - 1) + "]";
				} else if (data instanceof Object) {
					str += "{";
					for (var key in data) {
						str += "\"" + key + "\":\"" + a(data[key]) + "\",";
					}
					str = str.substring(0, str.length - 1) + "}";
				} else if (typeof data == "string") {
					str += data;
				}
				return str;
			}
			return a(sample);
		}
	}
	win.PrintData = PrintData;
}(window, document));
