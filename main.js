(function($){
    var originalTitle = document.title;
    var titleUpdate;
    //Profanity Filter
    //Word list from https://github.com/shutterstock/List-of-Dirty-Naughty-Obscene-and-Otherwise-Bad-Words
    var filterWords = ["2g1c","2 girls 1 cup","acrotomophilia","anal","anilingus","anus","arsehole","ass","asshole","assmunch","auto erotic","autoerotic","babeland","baby batter","ball gag","ball gravy","ball kicking","ball licking","ball sack","ball sucking","bangbros","bareback","barely legal","barenaked","bastardo","bastinado","bbw","bdsm","beaver cleaver","beaver lips","bestiality","bi curious","big black","big breasts","big knockers","big tits","bimbos","birdlock","bitch","black cock","blonde action","blonde on blonde action","blow j","blow your l","blue waffle","blumpkin","bollocks","bondage","boner","boob","boobs","booty call","brown showers","brunette action","bukkake","bulldyke","bullet vibe","bung hole","bunghole","busty","butt","buttcheeks","butthole","camel toe","camgirl","camslut","camwhore","carpet muncher","carpetmuncher","chocolate rosebuds","circlejerk","cleveland steamer","clit","clitoris","clover clamps","clusterfuck","cock","cocks","coprolagnia","coprophilia","cornhole","cum","cumming","cunnilingus","cunt","darkie","date rape","daterape","deep throat","deepthroat","dick","dildo","dirty pillows","dirty sanchez","doggie style","doggiestyle","doggy style","doggystyle","dog style","dolcett","domination","dominatrix","dommes","donkey punch","double dong","double penetration","dp action","eat my ass","ecchi","ejaculation","erotic","erotism","escort","ethical slut","eunuch","faggot","fecal","felch","fellatio","feltch","female squirting","femdom","figging","fingering","fisting","foot fetish","footjob","frotting","fuck","fuck buttons","fudge packer","fudgepacker","futanari","gang bang","gay sex","genitals","giant cock","girl on","girl on top","girls gone wild","goatcx","goatse","gokkun","golden shower","goodpoop","goo girl","goregasm","grope","group sex","g-spot","guro","hand job","handjob","hard core","hardcore","hentai","homoerotic","honkey","hooker","hot chick","how to kill","how to murder","huge fat","humping","incest","intercourse","jack off","jail bait","jailbait","jerk off","jigaboo","jiggaboo","jiggerboo","jizz","juggs","kike","kinbaku","kinkster","kinky","knobbing","leather restraint","leather straight jacket","lemon party","lolita","lovemaking","make me come","male squirting","masturbate","menage a trois","milf","missionary position","motherfucker","mound of venus","mr hands","muff diver","muffdiving","nambla","nawashi","negro","neonazi","nigga","nigger","nig nog","nimphomania","nipple","nipples","nsfw images","nude","nudity","nympho","nymphomania","octopussy","omorashi","one cup two girls","one guy one jar","orgasm","orgy","paedophile","panties","panty","pedobear","pedophile","pegging","penis","phone sex","piece of shit","pissing","piss pig","pisspig","playboy","pleasure chest","pole smoker","ponyplay","poof","poop chute","poopchute","porn","porno","pornography","prince albert piercing","pthc","pubes","pussy","queaf","raghead","raging boner","rape","raping","rapist","rectum","reverse cowgirl","rimjob","rimming","rosy palm","rosy palm and her 5 sisters","rusty trombone","sadism","scat","schlong","scissoring","semen","sex","sexo","sexy","shaved beaver","shaved pussy","shemale","shibari","shit","shota","shrimping","slanteye","slut","s&m","smut","snatch","snowballing","sodomize","sodomy","spic","spooge","spread legs","strap on","strapon","strappado","strip club","style doggy","suck","sucks","suicide girls","sultry women","swastika","swinger","tainted love","taste my","tea bagging","threesome","throating","tied up","tight white","tit","tits","titties","titty","tongue in a","topless","tosser","towelhead","tranny","tribadism","tub girl","tubgirl","tushy","twat","twink","twinkie","two girls one cup","undressing","upskirt","urethra play","urophilia","vagina","venus mound","vibrator","violet wand","vorarephilia","voyeur","vulva","wank","wetback","wet dream","white power","women rapping","wrapping men","wrinkled starfish","xx","xxx","yaoi","yellow showers","yiffy","zoophilia",];
    var rgx = new RegExp(filterWords.join("|"), "gi");

    function callbackDJAdvance(obj) {

        //Auto-woot
        if(autoWoot) {
            setTimeout( function(){
                $('#woot').trigger("click");
            }, 4000);
        } else if(debugMode) {
            console.log("Autowoot disable")
        }


        if(notifMusic) {
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

    }

    function wordFilter(str) {
        var tmp = document.createElement("DIV");
        tmp.innerHTML = str.replace(rgx, "***");
        return tmp.textContent||tmp.innerText;
    }

    function callbackChat (data) {

        data.type // "message", "emote", "moderation", "system"
        data.from // the username of the person
        data.fromID // the user id of the person
        data.message // the chat message
        data.language // the two character code of the incoming language

        var userNameMention = '@'+ API.getUser().username;
        var mention = false;
        var msgNotification;

        if (data.message.indexOf(userNameMention) > -1) {
            msgNotification = "You were mentioned in chat!";
            mention = true;

        } else {
            msgNotification = "New chat message";

        }

        if(notifMessage || (notifMention && mention)) {
            var notification = new Notification(msgNotification, {
                icon: 'http://stephentvedt.com/plug-notify/message.png',
                body:  wordFilter(data.message)
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
    if(notifMessage) {
        API.on(API.CHAT, callbackChat);
    }
    console.log('hi');
    //Wait for API to be defined

})(jQuery);//global title namespace