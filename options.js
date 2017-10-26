// Saves options to chrome.storage
function save_options() {
    var music = document.getElementById('music').checked;
    var message = document.getElementById('message').checked;
    var mention = document.getElementById('mention').checked;
    var autoWoot = document.getElementById('woot').checked;
    var debugMode = document.getElementById('debug').checked;

    chrome.storage.sync.set({
      "notifMusic": music,
      "notifMessage": message,
      "notifMention": mention,
      "autoWoot": autoWoot,
      "debugMode": debugMode
    }, function() {
        console.log('Save options: ');
        console.log('Music: ' + music);
        console.log('Message: ' + message);
        console.log('Mention: ' + mention);
        console.log('AutoWoot: ' + autoWoot);
        console.log('Debug: ' + debug);

        // Update status to let user know options were saved.
        var status = document.getElementById('status');
        status.textContent = 'Options saved.';
        status.style.display = "block";
        setTimeout(function() {
            status.textContent = '';
            status.style.display = "none";
        }, 1500);
    });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
    chrome.storage.sync.get(["notifMusic", "notifMessage", "notifMention", "autoWoot", "debugMode"], function(items) {
        if (items.notifMusic) {
            document.getElementById('music').checked = items.notifMusic;
        }

        if(items.notifMessage) {
            document.getElementById('message').checked = items.notifMessage;
        }

        if(items.notifMention) {
            document.getElementById('mention').checked = items.notifMention;
        }

        if (items.autoWoot) {
            document.getElementById('woot').checked = items.autoWoot;
        }

        if (items.debugMode) {
            document.getElementById('debug').checked = items.debugMode;
        }
        
        if(items.debugMode) {
            console.log('Load config: ' + items.notifMusic + " - " + items.notifMessage + " - " +
                items.notifMention + " - " + items.autoWoot);
        }
    });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);