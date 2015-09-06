var meta = require('./package.json');

fis.config.set("modules.parser.less", "less");
fis.config.set("roadmap.ext.less", "css");

fis.config.set('name', meta.name);
fis.config.set('version', meta.version);
fis.config.set('project.exclude', 'node_modules/**');

fis.config.get("roadmap.path").unshift({
    "reg":/^\/components\/(.*)\.(less|css)$/i,
    "id":"${name}/${version}/$1.css",
    "isMod":true,
    "useSprite":true,
    "useHash":false,
    "url":"${urlPrefix}/c/${name}/${version}/$1.$2",
    "release":"/public/c/${name}/${version}/$1.$2"
});

fis.config.set('framework', {
    cache: true,
    urlPattern: '/c/%s',
    comboPattern: '/co??%s',
    alias: {
        
    }
});