/**
 * depends.js
 * v 1.0
 */

window.depends = (function() {
	
	var XMLHttp = XMLHttpRequest;

	var modules = {};
	var url = {
		host: location.protocol + "//" + location.host,
		dir: dirname(location.pathname)
	};
	
	function depends(src, directEvalMode) {
		if (!src) throw Error("require fail: missing source path.");
		var path = resolve(src);
		if (modules[path]) return modules[path];
		
		var http = get(path + ".js");
		var origin = url.dir;
		url.dir = normalize(url.dir, src+"/..");
		
		try {
			if (directEvalMode) 
				with (window) { modules[path] = eval(http.responseText); }
			else
				modules[path] = evaluate(http.responseText);
		} catch(e) {
			throw window[e.name](e.message + " <- at:'"+src+".js'");
		}
		url.dir = origin;
		return modules[path] || null;
	}
	
	function normalize() {
		var path = Array.prototype.join.call(arguments, "/");
		var isRoot = /^\//.test(path);
		
		var protocol = path.split("://");
		var args = path.split("/"), paths = [];
		
		if (protocol.length >= 2)
			args.splice(0, 1, protocol[0] + ":/");
		
		for (var i=0, len=args.length; i<len; i++) {
			if (args[i] === "..") paths.pop();
			else if (args[i] !== "" && args[i] !== ".") paths.push(args[i]);
		}
		return (isRoot ? "/" : "") + paths.join("/");
	}
	
	function resolve(path) {
		if (/^\//.test(path)) return path;
		Array.prototype.unshift.call(arguments, url.host + url.dir);
		return normalize.apply(this, arguments);
	}
	
	function dirname(path) {
		if (/\/$/.test(path)) return normalize(path);
		var paths = normalize(path).split("/");
		var file = paths.pop();
		if (/.*\..*/.test(file)) return paths.join("/");
		return normalize(paths.join("/"), file);
	}
	
	function evaluate(code) {
		var exports = {};
		eval(code);
		return exports;
	}
	
	function get(src) {
		var xmlhttp = new XMLHttp();
		xmlhttp.open("get", src, false);
		xmlhttp.send(null);
		if (xmlhttp.status == 200) {
			return xmlhttp;
		} else {
			throw Error("connection failure: '"+src+"'");
		}
	}
	
	function reformUrl(src) {
		return path + src + ".js";
	}
	
	depends.url = url;
	depends.module = modules;
	depends.get = get;
	
	return depends;
})();
