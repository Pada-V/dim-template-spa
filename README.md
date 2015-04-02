dim-template-spa
=====================
关于combo请求
前端dim解析模块依赖模块 > 计算需要加载的模块 > 生成要加载的模块列表 > 发送combo请求 > server combo接口接收请求 > 解析url得到要读取的文件 > 根据解析出来的列表读取文件 > 拼装文件 > 输出到客户端 > 前端 dim 解析返回数据 > 循环生成每个模块并缓存到ls中 > ...
example:
http://localhost:8080/mobile/??mobile/4.5.6/search/css/search-common.css.js,mobile/4.5.6/search/css/search.css.js,mobile/1.0.0/css/toast.css.js,mobile/4.5.6/header/css/header.css.js,mobile/4.5.6/grid/css/grid.css.js,mobile/4.5.6/footer/css/footer.css.js,mobile/4.5.6/entry-guide/css/entry-guide.css.js,mobile/4.5.6/prompt/css/prompt.css.js,mobile/4.5.6/barrage/css/barrage.css.js&1b45192
<combo api>??<file_path_1>,<file_path_2>,<file_path_n>&<hash>

