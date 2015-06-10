'use strict';

/*
 * 项目构建时，_‍_FRAMEWOR‍K_CONFIG__变量会被替换成框架配置，包括依
 * 赖树、别名表、combo连接形式、配置文件等，这样就可以对资源请求进行
 * 按需、合并等优化了
 */
require.config(__FRAMEWORK_CONFIG__);

require.async('app', function (app) { 
    app();
});
