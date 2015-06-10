/**
 * hook
 * 全局钩子
 */
var $ = require('zepto'),
    runtime = require('runtime');


// config.HooksList = {
//     'before_app_init': true,
//     'after_app_init': true,
//     'user_login': true
// };

if(!HooksList){
    return;
}

for(var hook in HooksList){
    if(!HooksList[hook]){
        return;    
    }
    (function(hook){
        $(runtime).bind(hook, function(){
            setTimeout(function(){
                require.async('app/hooks/' + hook);
            }, 0);
        });
    })(hook);
}