window.$ = function(path) {
	return document[path] || document.getElementById(path) || document.getElementsByTagName(path);
};
