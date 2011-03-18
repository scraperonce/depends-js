var module = depends("src/module");
window.onload = function() {
	module.getDataTable().jquery("body").innerHTML = "It works!!!"; // it works!!
}

