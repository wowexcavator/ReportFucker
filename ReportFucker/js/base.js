// ajax封装
window.loginstep = true;

function ajaxPackage(localUrl, type, data, dataType, isCache, callback, ecallback) {
	$.ajax({
		type: type,
		url: localUrl,
		data: data,
		dataType: dataType,
		cache: isCache,
		success: function(obj) {
			if(obj.login != null) {
				window.DB.setKey('');
				if(window.loginstep) {
					window.loginstep=false;
					var win = nw.Window.get();
					win.hide();
					window.DB.saveStorage([]);
					window.DB.setKey('');
					window.DB.saveTaskList([]);
					window.open('index.html');
					win.close();
				}

			} else {
				callback(obj);
			}

		},
		error: function(obj) {
			ecallback(obj);
		},
	})
}