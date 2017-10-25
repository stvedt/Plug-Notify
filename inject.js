function loadAfterConfig() {
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
    var innerText = '(' + loader.toString() + ')(); ';
    innerText += 'var notifMusic = ' + notifMusic + ';';
    innerText += 'var notifMessage = ' + notifMessage + ';';
    innerText += 'var autoWoot = ' + autoWoot + ';';
    s.innerText = innerText;
    document.head.appendChild(s);
}


var notifMusic = false;
var notifMessage = false;
var autoWoot = false;

chrome.storage.sync.get(["notifMusic", "notifMessage", "autoWoot"], function(items) {
    notifMusic = items.notifMusic;
    notifMessage = items.notifMessage;
    autoWoot = items.autoWoot;
    
    console.log('Load config: ' + notifMusic + " - " + notifMessage + " - " + autoWoot);
    loadAfterConfig();
});