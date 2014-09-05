var s, loader = function() {
    var waitForAPI = {
        checkAPI: function() {
            if (typeof API !== 'undefined' && API.enabled){
                waitForAPI.createScript();
            } else {
                setTimeout(function() {
                    waitForAPI.checkAPI();
                }, 100);
            }
        }, createScript: function() {
            console.log('PlugNotify enabled!');
            var url = $('#plugNotifyInject').data('url');
            $.getScript(url);
            $('#plugNotifyInject').remove();
        }
    };
    waitForAPI.checkAPI();
};

s = document.createElement('script');
s.type = 'text/javascript';
s.id = 'plugNotifyInject';
s.dataset.url = chrome.extension.getURL('main.js');
s.innerText = '(' + loader.toString() + ')();';
document.head.appendChild(s);