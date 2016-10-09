// ajax封装
function ajaxPackage(localUrl, type, data, dataType, isCache, callback,ecallback) {
	$.ajax({
		type: type,
		url: localUrl,
		data: data,
		dataType: dataType,
		cache: isCache,
		success: function(obj) {
			callback();
		},
		error: function(obj) {
			ecallback();
		},
	})
}