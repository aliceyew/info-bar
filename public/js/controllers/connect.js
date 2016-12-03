
            document.getElementById('btn-open-room').onclick = function() {
                disableInputButtons();
                connection.open(document.getElementById('room-id').value, function() {
                    showRoomURL(connection.sessionid);
                });
            };

            document.getElementById('btn-join-room').onclick = function() {
                disableInputButtons();
                connection.join(document.getElementById('room-id').value);
            }
    	   var connection = new RTCMultiConnection();
            connection.socketURL = '/';
            connection.socketMessageEvent = 'chat-test';
            connection.session = {
                audio:true,
                video: true,
                data: true
            };
            connection.videosContainer = document.getElementById('videos-container');

            connection.sdpConstraints.mandatory = {
                OfferToReceiveAudio: true,
                OfferToReceiveVideo: true
            };

            connection.onstream = function(event) {
                var width = parseInt(connection.videosContainer.clientWidth / 2) - 20;
                var mediaElement = getMediaElement(event.mediaElement, {
                    title: event.userid,
                    buttons: ['full-screen'],
                    width: width,
                    showonMouseEnter: false
                });
                connection.videosContainer.appendChild(mediaElement);
                setTimeout(function() {
                    mediaElement.media.play();
                }, 5000);
                mediaElement.id = event.streamid;
            };
            connection.onstreamended = function(event) {
                var mediaElement = document.getElementById(event.streamid);
                if (mediaElement) {
                    mediaElement.parentNode.removeChild(mediaElement);
                }
            };
            connection.onmessage = appendDIV;
            connection.onopen = function() {
                document.getElementById('input-text-chat').disabled = false;
                document.getElementById('btn-leave-room').disabled = false;
                document.querySelector('h5').innerHTML = 'You are connected with: ' + connection.getAllParticipants().join(', ');
            };
            connection.onclose = function() {
                if(connection.getAllParticipants().length) {
                    document.querySelector('h5').innerHTML = 'You are still connected with: ' + connection.getAllParticipants().join(', ');
                } else {
                    document.querySelector('h5').innerHTML = 'Seems session has been closed or all participants left.';
                }
            };
            connection.onEntireSessionClosed = function(event) {
                document.getElementById('input-text-chat').disabled = true;
                document.getElementById('btn-leave-room').disabled = true;
                document.getElementById('btn-open-room').disabled = false;
                document.getElementById('btn-join-room').disabled = false;
                document.getElementById('room-id').disabled = false;
                connection.attachStreams.forEach(function(stream) {
                    stream.stop();
                });

                if (connection.userid === event.userid) return;
                    document.querySelector('h1').innerHTML = 'Entire session has been closed by the moderator: ' + event.userid;
            };
            connection.onUserIdAlreadyTaken = function(useridAlreadyTaken, yourNewUserId) {
                // seems room is already opened
                connection.join(useridAlreadyTaken);
            };
            function disableInputButtons() {
                document.getElementById('btn-open-room').disabled = true;
                document.getElementById('btn-join-room').disabled = true;
                document.getElementById('room-id').disabled = true;
            };

            document.getElementById('btn-leave-room').onclick = function() {
                this.disabled = true;
                if(connection.isInitiator) {
                    // use this method if you did NOT set "autoCloseEntireSession===true"
                    // for more info: https://github.com/muaz-khan/RTCMultiConnection#closeentiresession
                    connection.closeEntireSession(function() {
                        document.querySelector('h1').innerHTML = 'Entire session has been closed.';
                    });
                }
                else {
                    connection.leave();
                }
            };
            // Text chat code
            document.getElementById('input-text-chat').onkeyup = function(e) {
                if (e.keyCode != 13) return;
                // remove trailing/ leading whitespace
                this.value = this.value.replace(/^\s+|\s+$/g, '');
                if (!this.value.length) return;
                connection.send(this.value);
                appendDIV(this.value);
                this.value = '';
            };
            var chatContainer = document.querySelector('.chat-output');
            function appendDIV(event) {
                var div = document.createElement('div');
                div.innerHTML = event.data || event;
                chatContainer.insertBefore(div, chatContainer.firstChild);
                div.tabIndex = 0;
                div.focus();
                document.getElementById('input-text-chat').focus();
            }

            // Handling room id
            function showRoomURL(roomid) {
                var roomHashURL = '#' + roomid;
                var roomQueryStringURL = '?roomid=' + roomid;
                var html = '<h2>Unique URL for your room:</h2><br>';
                html += 'Hash URL: <a href="' + roomHashURL + '" target="_blank">' + roomHashURL + '</a>';
                html += '<br>';
                html += 'QueryString URL: <a href="' + roomQueryStringURL + '" target="_blank">' + roomQueryStringURL + '</a>';
                var roomURLsDiv = document.getElementById('room-urls');
                roomURLsDiv.innerHTML = html;
                roomURLsDiv.style.display = 'block';
            }
            (function() {
                var params = {},
                    r = /([^&=]+)=?([^&]*)/g;
                function d(s) {
                    return decodeURIComponent(s.replace(/\+/g, ' '));
                }
                var match, search = window.location.search;
                while (match = r.exec(search.substring(1)))
                    params[d(match[1])] = d(match[2]);
                window.params = params;
            })();
            var roomid = '';
            if (localStorage.getItem(connection.socketMessageEvent)) {
                roomid = localStorage.getItem(connection.socketMessageEvent);
            } else {
                roomid = connection.token();
            }
            document.getElementById('room-id').value = roomid;
            document.getElementById('room-id').onkeyup = function() {
                localStorage.setItem(connection.socketMessageEvent, this.value);
            };
            var hashString = location.hash.replace('#', '');
            if(hashString.length && hashString.indexOf('comment-') == 0) {
              hashString = '';
            }
            var roomid = params.roomid;
            if(!roomid && hashString.length) {
                roomid = hashString;
            }
            if(roomid && roomid.length) {
                document.getElementById('room-id').value = roomid;
                localStorage.setItem(connection.socketMessageEvent, roomid);
                // auto-join-room
                (function reCheckRoomPresence() {
                    connection.checkPresence(roomid, function(isRoomExists) {
                        if(isRoomExists) {
                            connection.join(roomid);
                            return;
                        }
                        setTimeout(reCheckRoomPresence, 5000);
                    });
                })();
                disableInputButtons();
            }
