// 引入文件
var bencode = require("./bencode.js").bencode,
url = require('url');
// 种子列表结构体
peers = [];



require("http").createServer(function (req, res) {
	var _GET = url.parse(req.url,true);
	var GET = _GET.query;
	res.response = function (body) {
		body = bencode(body);
		res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8", "Content-Length": body.length});
		res.end(body);
	};
	if(_GET.pathname == '/announce'){
		var info_hash = GET.info_hash;
		var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
		if(peers[info_hash] == undefined)peers[info_hash] = [];
		peers[info_hash][GET.peer_id] = {'ip' : ip, 'port' : parseInt(GET.port)};
		// announce 结构体
		var announce = 
		{
			'interval' : 10,/*
			'min interval' : 5,
			'complete' : 1,
			'incomplete' : 100,*/
			'peers' : peers[info_hash]
		};
		res.response(announce);
	}
	res.end();
}).listen(80);
