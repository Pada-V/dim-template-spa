var meta = require('./package.json');
fis.config.set('name', meta.name);
fis.config.set('version', meta.version);
fis.config.set('project.exclude', 'node_modules/**');
fis.config.set('framework', {
    cache: true,
    urlPattern: '/c/%s',
    comboPattern: '/co??%s',
    alias: {
    	//'$': 			'components/spa/lib/zepto.js',
    	//'fastclick': 	'components/spa/lib/fastclick.js',
    	//'template': 	'components/spa/lib/template.js',
    	//'basepage': 	'components/spa/core/basepage.js',
        //'baseapi':      'components/spa/core/baseapi.js',
    	//'spaconfig': 	'components/spa/core/spaconfig.js',
    	//'runtime': 		'components/spa/core/runtime.js',
    	//'tploader': 	'components/spa/core/tploader.js',
    	//'dispatcher': 	'components/spa/core/dispatcher.js',
    	//'clearout': 	'components/spa/widget/clearout.js',
    	//'scroller': 	'components/spa/widget/scroller.js',
        //'listview':     'components/spa/widget/listview.js'
    }
});