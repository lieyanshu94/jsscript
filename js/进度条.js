$(function() {
	var p = new Progressbar();
	var $div = $("#testlabel");
	var jsonstr = '{"state":[{"state":"立项","date":"2018-11-14"},{"state":"深化设计","date":"2018-11-14"},{"state":"施工准备","date":"2018-11-14"},{"state":"调试","date":"2018-11-14"},{"state":"试运行","date":"2018-11-14"},{"state":"竣工","date":"2018-11-14"}],"course":"施工进度"}';
	/* 解析小进度条的各个指标
		state：小进度条节点的名称。（必须）
		index：如果是数字则是放在第几个正式节点之后从1开始，如果是节点名称。则放在对应节点后方。（必须）
		ratio：小进度条长度与大进度条长度的比例。例1:1.5（可选默认比例是1:1.5）
		title：是小进度条的整体名称。（可为空）
		*/
	var tinyjson = {};
	tinyjson.state = "材料进场,隐蔽工程,设备安装";
	tinyjson.index = "深化设计";
	tinyjson.ratio = "1:1.5";
	tinyjson.title = "施工进度";
	var arr = [];
	arr.push(tinyjson);
	p.initData(JSON.parse(jsonstr));
	p.initTinyData(arr);
	var boxjson = {};
	boxjson.boxwidth = 760;
	p.initBox(boxjson);
	p.createInLable($div);
})