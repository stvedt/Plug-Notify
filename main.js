(function($){
    var originalTitle = document.title;
    var titleUpdate;

    function callbackDJAdvance(obj) {

        //Auto-woot
        setTimeout( function(){
            $('#woot').trigger("click");
        }, 4000);

        var title = obj.media.title;
        var author = obj.media.author;
        var nowPlaying = title + " by  " + author;
        var playedBy = "Played by " + obj.dj.username;

        var notification = new Notification( nowPlaying, {
            icon: 'http://stephentvedt.com/plug-notify/song.jpg',
            body: playedBy,
            tag: 'song'
        });

        notification.onshow = function () { setTimeout( function() { notification.close(); }, 6000); }
        notification.onclick = function(x) { window.focus(); }

    }

    function callbackChat (data) {

        data.type // "message", "emote", "moderation", "system"
        data.from // the username of the person
        data.fromID // the user id of the person
        data.message // the chat message
        data.language // the two character code of the incoming language

        var userNameMention = '@'+ API.getUser().username;

        if ( data.message.indexOf(userNameMention) > -1 ){

        var notification = new Notification( "You were mentioned in chat!", {
            icon: 'http://stephentvedt.com/plug-notify/message.png',
            body: data.message
        });

        notification.onclick = function(x) { window.focus(); }

        var count = 0;

        clearInterval(titleUpdate);

        titleUpdate = setInterval( function(){

            if (count%2 != 1) {
                window.document.title = "New Mention"
            } else {
                window.document.title = originalTitle;
            }

          count++;

        }, 700);
      }

    }

    function checkNotifcationsEnabled(){

        // Let's check if the browser supports notifications
        if (!("Notification" in window)) {
            API.chatLog('Running with Notifications DISABLED', true);
        } else if (Notification.permission === "granted") {
            // If it's okay no notice needed
        }

        // Otherwise, we need to ask the user for permission
        // Note, Chrome does not implement the permission static property
        // So we have to check for NOT 'denied' instead of 'default'
        else if (Notification.permission !== 'denied') {
            Notification.requestPermission(function (permission) {

                // Whatever the user answers, we make sure we store the information
                if(!('permission' in Notification)) {
                    Notification.permission = permission;
                }

                // If the user is okay, let's create a notification
                if (permission === "granted") {
                    var notification = new Notification("Notifications Enabled");
                }
            });
        }
    }

    var $window = $(window);

    API.chatLog('You are running Plug Notify', false);

    $('body').one('click', function(){ checkNotifcationsEnabled(); });

    $window.on('focus', function(){
        clearInterval(titleUpdate);
        document.title = originalTitle;
    });

    $window.find('body').on('click', function(){
        clearInterval(titleUpdate);
        document.title = originalTitle;
    });

    
    API.on(API.ADVANCE, callbackDJAdvance);
    API.on(API.CHAT, callbackChat);
    console.log('hi');
    //Wait for API to be defined

})(jQuery);//global title namespace