angular.module("myApp.controller", []).controller("songCtrl", function($scope, $http, $window) {

    $scope.toggle =true;
    $scope.text = "Speak";

    var accessToken = "7c911012ec344e70af01da4fe262173c",
        baseUrl = "https://api.api.ai/v1/",
        $speechInput,
        $recBtn,
        recognition,
        messageRecording = "Recording...",
        messageCouldntHear = "I couldn't hear you, could you say that again?",
        messageInternalError = "Oh no, there has been an internal server error",
        messageSorry = "I'm sorry, I don't have the answer to that yet.";

    $scope.start = function(){
        switchRecognition()
    };

    var switchRecognition = function() {
        if (recognition) {
            stopRecognition();
        } else {
            startRecognition();
        }
    };


    var startRecognition = function() {
        recognition = new webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.onstart = function(event) {
            respond(messageRecording);
            updateRec();
        };
        recognition.onresult = function(event) {
            recognition.onend = null;

            var text = "";
            for (var i = event.resultIndex; i < event.results.length; ++i) {
                text += event.results[i][0].transcript;
            }
            setInput(text);
            stopRecognition();
        };
        recognition.onend = function() {
            respond(messageCouldntHear);
            stopRecognition();
        };
        recognition.lang = "en-US";
        recognition.start();
    }

    var stopRecognition = function() {
        if (recognition) {
            recognition.stop();
            recognition = null;
        }
        updateRec();
    }
    var switchRecognition = function() {
        if (recognition) {
            stopRecognition();
        } else {
            startRecognition();
        }
    }
    var setInput = function(text) {
        //$speechInput.val(text);
        $scope.speech = text;
        send();
    }
    var updateRec = function() {
        $scope.text = 'Speak';
    }
    var send  = function() {
        var text = $scope.speech;
        var postUrl = baseUrl+"query";
        var postData = {query: text, lang: "en", sessionId: "newId"};
        var configDetails={
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            headers: {
                "Authorization": "Bearer " + accessToken
            }
        };
        $http.post(postUrl, postData, configDetails)
            .then(function(data, status, headers, config){
                    console.log(data.data);
                    if(data.data.result.action == "showmusic")
                        $window.open('https://dose.com/tagged/music','_blank');
                    else if (data.data.result.action == "showfood")
                        $window.open('https://dose.com/tagged/food','_blank');
                    prepareResponse(data.data);
                },
                function(){
                    respond(messageInternalError);
                });
    }
    var prepareResponse = function(val) {
        var debugJSON = JSON.stringify(val, undefined, 2),
            spokenResponse = val.result.speech;
        respond(spokenResponse);
    }

    var respond = function(val) {
        if (val == "") {
            val = messageSorry;
        }
        if (val !== messageRecording) {
            var msg = new SpeechSynthesisUtterance();
            msg.voiceURI = "native";
            msg.text = val;
            msg.lang = "en-US";
            window.speechSynthesis.speak(msg);
        }
    }
});