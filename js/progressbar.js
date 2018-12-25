;
var Progressbar = function(data, tinydata) {
	this.boxheight = 120;
	this.boxwidth = 800;
	this.nodeleftpx = 40;
	this.nodetopnum = 40;
	this.fontsize = 14;
	this.slipheight = 10;
	this.nodeheight = 14;
	this.tinynodeheight = 12;
	if (data) {
		this.statearr = data["state"];
		this.course = data["course"];
	}
}
Progressbar.prototype.initData = function(data, tinydata) {
	this.statearr = data["state"];
	this.course = data["course"];
}
Progressbar.prototype.initTinyData = function(tinydata) {
	this.tinydata = tinydata;
}
Progressbar.prototype.initBox = function(data) {
	if (data["boxheight"]) {
		this.boxheight = data["boxheight"];
	}
	if (data["boxwidth"]) {
		this.boxwidth = data["boxwidth"];
	}
	if (data["nodeleftpx"]) {
		this.nodeleftpx = data["nodeleftpx"];
	}
	if (data["nodetopnum"]) {
		this.nodetopnum = data["nodetopnum"];
	}
	if (data["fontsize"]) {
		this.fontsize = data["fontsize"];
	}
	if (data["slipheight"]) {
		this.slipheight = data["slipheight"];
	}
	if (data["nodeheight"]) {
		this.nodeheight = data["nodeheight"];
	}
	if (data["tinynodeheight"]) {
		this.tinynodeheight = data["tinynodeheight"];
	}
}

Progressbar.prototype.createInLable = function(obj) {
	var $obj = $(obj);
	var html = this.makehtml();
	$obj.append(html);
	this.giveClass($obj);
}

Progressbar.prototype.makehtml = function() {
	var statearr = this.statearr;
	var boxheight = this.boxheight; //容器高度
	var boxwidth = this.boxwidth; //容器宽度
	var nodeleftpx = this.nodeleftpx; //第一个节点距容器左边距离
	var fontsize = this.fontsize; //字体大小
	var nodeheight = this.nodeheight; //节点直径
	var tinynodeheight = this.tinynodeheight; //小节点直径
	var tinydata = this.tinydata; //小阶段数据
	var tinyreadycount = 0; //小阶段已经写入到页面之中的数量
	var linepx = boxwidth - nodeleftpx * 2 - this.nodeheight; //进度条全长
	var statearrlen = this.statearr.length; //节点个数
	var html = "<div class = 'bar-box' style = 'width: " + boxwidth + " px;height: " + boxheight + "px;'>";
	if (tinydata) { //首先判断是否有小阶段进度。然后算出正常阶段进度条和小阶段进度条的各自长度
		var tinyarr = this.analysistiny();
		var longratio = tinyarr[0].longratio;
		var shortratio = tinyarr[0].shortratio;
		var tinynodecount = 0;
		var firsttinynodeleft = 0; //最左侧的小阶段节点距左侧距离
		for (var i = 1; i < tinyarr.length; i++) {
			tinynodecount += tinyarr[i].tinystatecount;
		}
		var X = parseInt((linepx) / (longratio * (statearrlen - 1) + shortratio * tinynodecount));
		var linewidthlong = X * longratio; //正常阶段的长度
		this.linewidthlong = linewidthlong;
		var linewidthshort = X * shortratio; //小阶段的长度
		this.linewidthshort = linewidthshort;
	} else {
		var linewidthlong = linepx / (statearrlen - 1);
		this.linewidthlong = linewidthlong;
	}
	html += "<span class='bar-slip bar-slip-gray' style='width:" + linepx + "px;left:" + (nodeleftpx + nodeheight / 2) +
		"px'></span>";
	for (var i = 0; i < statearrlen; i++) {
		var statename = statearr[i].state; //阶段名称
		var statedate = statearr[i].date; //阶段日期
		var nodeleft = (linewidthshort)?nodeleftpx + linewidthlong * i + tinyreadycount * linewidthshort : nodeleftpx + linewidthlong * i; //节点距左侧距离
		var lineleft =(linewidthshort)? nodeleftpx + nodeheight / 2 + linewidthlong * i + tinyreadycount * linewidthshort : nodeleftpx + nodeheight / 2 + linewidthlong * i; //线距左侧距离
		var valuelen = statename.length * fontsize; //文字域的宽度
		var datelen = statedate.length * fontsize / 2; //日期域的宽度
		var dateleft = nodeleft - (datelen - nodeheight) / 2; //日期距左侧距离
		var statenameleft = nodeleft - (valuelen - nodeheight) / 2; //文字距左侧距离
		if (i != (statearrlen - 1)) {
			html += "<span class='bar-slip bar-slip-unknown' style='width:" + linewidthlong + "px;left:" + lineleft +
				"px'></span>";
		}
		html += "<span class='bar-node bar-node-unknown' style = 'left: " + nodeleft + "px;' ></span>" +
			"<span class='bar-title' style='left:" + statenameleft + "px;'>" + statename + "</span>" +
			"<span class='bar-date' style='left:" + dateleft + "px;'>" + statedate + "</span>";
		if (tinydata) {
			for (var j = 1; j < tinyarr.length; j++) {
				if (tinyarr[j].indexnum == i) {
					var splitcount = 0;
					for (var t = 1; t < tinyarr.length; t++) {
						if (t == j) {
							break;
						}
						if (tinyarr[j].indexnum == tinyarr[t].indexnum) {
							splitcount += tinyarr[j].tinystatecount;
						}
					}
					var smallbacklinewidth = tinyarr[j].tinystatecount * linewidthshort;
					var smallbackleft = lineleft + linewidthlong + splitcount * linewidthshort;
					html += "<span class='bar-slip-background' style='width:" + smallbacklinewidth + "px;left:" + smallbackleft +
						"px'></span>" +
						"<span class='bar-slip-small bar-slip-gray-small' style='width:" + smallbacklinewidth + "px;left:" +
						smallbackleft + "px'></span>";
					var tinystatearr = tinyarr[j].tinystate;
					var t = 0;
					if (tinyarr[j].tinytitle != "") {
						var titleleft = smallbackleft + tinyarr[j].tinystatecount*linewidthshort*0.1;
						var titlewidth = parseInt(tinyarr[j].tinystatecount*linewidthshort*0.8)
						html += "<span class='bar-stage-title' style='left:" + titleleft + "px;width:" + titlewidth + "px'>" + tinyarr[j].tinytitle + "</span>";
					}
					for (var tinystate of tinystatearr) {
						var smallslipleft = smallbackleft + t * linewidthshort;
						var smallnodeleft = smallslipleft - tinynodeheight / 2;
						var nameleft = smallslipleft - 2*14;
						html += "<span class='bar-node-small bar-node-small-unknown' style = 'left: " + smallnodeleft + "px;'></span>" +
							"<span class='bar-slip-small bar-slip-small-unknown' style = 'width:" + linewidthshort + "px;left:" +
							smallslipleft + "px'></span>" +
							"<span class='bar-stage-name' style='left:" + nameleft + "px'>" + tinystate + "</span>";
						tinyreadycount++;
						t++;
					}
				}
			}

		}
	}

	return html += "</div>";
}

Progressbar.prototype.giveClass = function($lable) {
	var course = this.course;
	var statearr = this.statearr;
	var tinydata = this.tinydata;
	var tinymark,utinymark, mark;
	var linewidthlong = this.linewidthlong;
	var linewidthshort = this.linewidthshort;

	if (tinydata) {
		var tinyarr = this.analysistiny();
		var tinynum = 0;
		for (var i = 1; i < tinyarr.length; i++) {
			tinynum += tinyarr[i].tinystatecount;
			if (course == tinyarr[i].tinytitle) {
				tinymark = i;
				break;
			}
		}
		if (!tinymark) {
			utinymark = 0;
			for (var j = 0 ; j < statearr.length ; j++) {
				if (statearr[j].state == course) {
					for (var m = 1 ; m < tinyarr.length ; m++){
						if (tinyarr[m].indexnum < j) {
							utinymark += tinyarr[m].tinystatecount;
						}
					}
				}
			}
		}
	}
	
	for (var i = 0; i < statearr.length; i++) {
		if (course == statearr[i].state && i != statearr.length - 1) {
			mark = i;
			break;
		} else {
			mark = -1;
		}
	}
	$lable.find(".bar-node-unknown").each(function(index) {
		var $node = $(this);
		if (tinymark) {
			var atinydata = tinyarr[tinymark];
			if (index <= atinydata.indexnum) {
				$node.toggleClass("bar-node-unknown bar-node-blue");
			} else {
				$node.toggleClass("bar-node-unknown bar-node-gray");
			}
		} else {
			if ( mark == -1) {
				$node.toggleClass("bar-node-unknown bar-node-blue");
			} else if (index < mark) {
				$node.toggleClass("bar-node-unknown bar-node-blue");
			} else if (index == mark) {
				$node.toggleClass("bar-node-unknown bar-node-red");
			} else {
				$node.toggleClass("bar-node-unknown bar-node-gray");
			}
		}
	})
	$lable.find(".bar-slip-unknown").each(function(index) {
		var $slip = $(this);
		if (tinymark) {
			var atinydata = tinyarr[tinymark];
			if (index <= atinydata.indexnum) {
				$slip.toggleClass("bar-slip-unknown bar-slip-blue");
			} else {
				$slip.toggleClass("bar-slip-unknown bar-slip-gray");
			}
		} else {
			if ( mark == -1) {
				$slip.toggleClass("bar-slip-unknown bar-slip-blue");
			} else if (index < mark) {
				$slip.toggleClass("bar-slip-unknown bar-slip-blue");
			} else if (index == mark) {
				$slip.toggleClass("bar-slip-unknown bar-slip-red");
				$slip.css("width", linewidthlong / 2 + "px");
				var slipleft = parseFloat($slip.css("left"));
				var img = '<span class="bar-image bar-image-red" style="left: ' + (slipleft + linewidthlong / 2 - 12) +
					'px;"></span>';
				$lable.find(".bar-box").append(img);
			} else {
				$slip.toggleClass("bar-slip-unknown bar-slip-gray");
			}
		}
	})
	$lable.find(".bar-node-small-unknown").each(function(index) {
		var $node = $(this);
		if (tinymark) {
			var atinydata = tinyarr[tinymark];
			var atinycount = atinydata.tinystatecount;
			var findex = tinynum - atinycount;
			var lindex = tinynum;
			if (findex > index) {
				$node.toggleClass("bar-node-small-unknown bar-node-blue");
			} else if (findex <= index && index < lindex) {
				$node.toggleClass("bar-node-small-unknown bar-node-yellow");
			} else {
				$node.toggleClass("bar-node-small-unknown bar-node-gray");
			}
		} else {
			if (index < utinymark) {
				$node.toggleClass("bar-node-small-unknown bar-node-blue");
			} else {
				$node.toggleClass("bar-node-small-unknown bar-node-gray");
			}
		}
	})
	$lable.find(".bar-slip-small-unknown").each(function(index){
		var $slip = $(this);
		if (tinymark){
			var atinydata = tinyarr[tinymark];
			var atinycount = atinydata.tinystatecount;
			var findex = tinynum - atinycount;
			var lindex = tinynum;
			if (findex > index) {
				$slip.toggleClass("bar-slip-small-unknown bar-slip-blue");
			} else if (findex <= index && index < lindex) {
				$slip.toggleClass("bar-slip-small-unknown bar-slip-yellow");
				$slip.css("width", linewidthshort / 2 + "px");
			} else {
				$slip.toggleClass("bar-slip-small-unknown bar-slip-gray");
			}
		}else{
			if (index < utinymark) {
				$slip.toggleClass("bar-slip-small-unknown bar-slip-blue-small");
			} /* else {
				$slip.toggleClass("bar-slip-small-unknown bar-slip-gray");
			} */
		}
	}) 
}
/* 解析小进度条的各个指标（
	title：是小进度条的整体名称。
	state：小进度条节点的名称。
	index：如果是数字则是放在第几个正式节点之后从1开始，如果是节点名称。则放在对应节点后方。
	ratio：小进度条长度与大进度条长度的比例。例1:1.5）
	*/
Progressbar.prototype.analysistiny = function() {
	var time = 0;
	var statearr = this.statearr;
	var returnarr = new Array();

	function analysisobj(objdata) {
		var returnobj = {};
		if (!objdata["state"] && objdata["place"]) {
			return false;
		}
		var index = objdata["index"];
		var indexnum = 0;
		if (Number(index)) {
			indexnum = Number(index);
		} else {
			for (var state of statearr) {
				if (state["state"] == index) {
					break;
				}
				indexnum++;
			}
		}
		if (objdata["title"]) {
			var title = objdata["title"];
		} else {
			var title = "";
		}
		if (objdata["ratio"]) {
			var ratio = objdata["ratio"];
		} else {
			var ratio = "1:1.5";
		}
		if (typeof objdata["state"] == "string") {
			var tinystatearr = objdata["state"].split(",");
		} else if (objdata["state"] instanceof Array) {
			var tinystatearr = objdata["state"];
		}
		var exp = /\d+(\.\d+)?/g
		var ratioarr = ratio.match(exp);
		var ratioobj = {};
		if (ratioarr.length == 2 && time == 0) {
			if (ratioarr[0] >= ratioarr[1]) {
				ratioobj.longratio = ratioarr[0];
				ratioobj.shortratio = ratioarr[1];
			} else {
				ratioobj.longratio = ratioarr[1];
				ratioobj.shortratio = ratioarr[0];
			}
			returnarr.push(ratioobj);
		} else if (time == 0) {
			ratioobj.longratio = 1.5;
			ratioobj.shortratio = 1;
			returnarr.push(ratioobj);
		}
		returnobj.tinytitle = title;
		returnobj.tinystate = tinystatearr;
		returnobj.tinystatecount = tinystatearr.length;
		returnobj.indexnum = indexnum;
		returnarr.push(returnobj);
	}
	if (this.tinydata instanceof Array) {
		for (var objdata of this.tinydata) {
			analysisobj(objdata);
			time++;
		}
	} else if (this.tinydata instanceof Object) {
		analysisobj(this.tinydata);
	}
	return returnarr;
}
