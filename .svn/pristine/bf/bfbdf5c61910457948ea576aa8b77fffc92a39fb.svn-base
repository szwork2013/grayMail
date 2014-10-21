(function (M139) {

	/**
	 * 统一模拟测试接口
	 *
	 */
	M139.core.namespace("M139.API.Mock", {

		/**
		 * 清除装定的测试数据
		 * @param {Object} options 参数表
		 * @param {String} options.api 接口名
		 */
		clear : function (options) {
			if (options) {
				if (window.mockMap[options.api]) {
					window.mockMap[options.api] = null;
					delete window.mockMap[options.api];
				}
			} else {
				window.mockMap = {};
			}
		},

		/**
		 * 装定测试的数据
		 * @param {Object} options 参数表
		 * @param {String} options.api 接口标识
		 * @param {String} options.contentType 内容类型
		 * @param {Object} options.response 响应内容
		 * @param {Number} options.httpStatus 响应的HttpStatusCode
		 * @param {Number} options.timeout 模拟超时(ms)
		 */
		add : function (options) {
			var _api = $.trim(options.api) || "none";
			var _url = options.url || false;
			var _contentType = options.contentType || "application/javascript";
			var _response = _.isUndefined(options.response) ? {}

			 : options.response;
			var _proxy = _.isEmpty(options.proxy) ? false : options.proxy;
			var _httpStatus = _.isUndefined(options.httpStatus) ? "200" : options.httpStatus;
			var _timeout = _.isUndefined(options.timeout) ? false : options.timeout;

			if (_.isEmpty(_api)) {
				return;
			}

			window.mockMap[_api] = {
				api : _api,
				url : _url,
				timeout : _timeout,
				httpStatus : _httpStatus,
				contentType : _contentType,
				response : _response,
				proxy : _proxy
			};
		},

		/**
		 * 自动检测是否有模拟数据，有则回调，并返回true，否则返回false
		 * @param {Object} options 参数表
		 * @param {String} options.api 接口名
		 * @param {String} options.success 回调函数
		 */
		call : function (options) {
			var response,directoryId;
			var mock = window.mockMap[options.api];
			if (mock) {

				response = mock.response;
				if (mock.timeout) {
					setTimeout(function () {
						if (mock.httpStatus == "200") {
							options.success(response);
						} else {
							options.error(mock.httpStatus);
						}
					}, mock.timeout);
				}

				if (mock.httpStatus == "200") {
					if (response.responseData.code === "S_OK") {
						if (options.api == "disk:downloadMock") {
							var fileIds = options.data && options["data"]["fileIds"].split(',');
							var files = [];
							for(var i = 0; i<fileIds.length;i++){
								files.push(response.responseData["var"][fileIds[i]])
							}
							options.success(files);
							return;
						}
						if (options.api == "disk:fileListPageMock") {
							var directoryId = options.data && options["data"]["directoryId"];
							options.success(response.responseData["var"][directoryId]);
							
							return;
						}
						options.success(response);

					} else {
						//    options.error(response.code, response);
					}
				} else {
					options.error(mock.httpStatus);
				}
				return true;
			}

			if (window.mockMap.testapi && mockMap.testapi[options.api]) {
				M139.requireJS(["api.mockdata"], function () {
					mock = mockMap[options.api];
					if (mock) {
						if (mock.response && mock.response.code) {
							if (mock.response.responseData.code != "S_OK") {
								options.error(mock.response.code, mock.response);
								return;
							}
						}
						options.success(mock.response);
					}
				});
				return true;
			}

			return false;
		}

	});

})(M139);
