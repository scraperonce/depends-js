depends("../../lib/jquery-dummy", true); // directEvalMode. it simply evals with global scope!
exports.Table = function() {
	this.jquery = $;
};
