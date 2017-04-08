# DOSE Junior Developer Coding Challenge

This is your opportunity to show us what you are capabale of!  We are looking for developers who :
- Write clean, well structured code
- Have attention to detail
- Can solve difficult problems
- Are creative

## Introducing DOSE Digital Assistant

For this coding challenge you're going to take on Siri, Alexa, and Google!

Create a single page web application that takes a voice command such as "DOSE, show me music" or "DOSE, show me food".  The application will then redirect the user to the appropriate tag page on dose.com : [music](https://dose.com/tagged/music), [food](https://dose.com/tagged/food)

It turns out you won't exactly be taking on Google for this challange as you'll be using one of their products for the voice recognition part of it.  [API.AI](https://api.ai/) is a free service that provides voice recognition capabilities via an API.  You'll need to create a free account there and then get started with the appropriate [SDK](https://docs.api.ai/docs/sdks).

## Submitting Your Solution

To submit your code exercise:
- Fork this repository
- Implement your solution in the fork
- Submit a pull request back to this repository with your solution (we won't actually be merging the request, but it lets us know you can perform basic git workflow).

## Bonus Points

Here's how to get bonus ponts:
- Host the project on something like [GitHub Pages](https://pages.github.com/).
- Include good documentation on how to build and run your app.
- Provide tests for your app.
- Use [Vue.js](https://vuejs.org/) and [Bootstrap](http://getbootstrap.com/) for the UI (that's what we use here).
- Make your app as compact as possible using something like [Webpack])[https://webpack.github.io/] or [Rollup](https://rollupjs.org/).

## Hints

There are two ways to do the speech recognition.  
The first is to use webkitSpeechRecognition which is used in the demo code snippet that the API.AI docs point to.
This method will only work on Chrome (and maybe Opera) browsers.
This document may be more useful than the JS/HTML5 example that API.AI provides in converting voice to text : 
https://developers.google.com/web/updates/2013/01/Voice-Driven-Web-Apps-Introduction-to-the-Web-Speech-API

The second way is to use the ApiAiStreamClient (recommended). 
This method doesn't have the best documentation, but these will get you pointed in the right direction.
https://github.com/api-ai/apiai-javascript-client
https://github.com/api-ai/apiai-javascript-client/blob/master/ts/Stream/StreamClient.ts

Along with this code snippet

```
import {ApiAiClient, ApiAiStreamClient} from 'api-ai-javascript';
const client = new ApiAiClient({accessToken: 'YOUR API.AI CLIENT TOKEN HERE', streamClientClass: ApiAiStreamClient});

...

startStream() {
        
    // Method 2 - Use stream client
    if(this.streamClient) {
        this.closeStream();
    }

    this.streamClient = client.createStreamClient({
        onInit: () => {
            console.log("onInit");
            this.streamClient.open();
        },
        onOpen: () => {
            console.log("onOpen");
            this.streamClient.startListening();

            // It looks like the stream doesn't stop on it's own after a match, so 
            // help things along by stopping after a set period of time.
            setTimeout(() => {
                this.stop();
            }, 4000);
        },
        onClose: () => {
            console.log("onClose");
        },
        onStartListening: () => {
            console.log("onStartListening");
            this.error = "";
            this.speech = "";
            this.listening = true;
            this.event_count = 0;
        },
        onStopListening: () => {
            console.log("onStopListening");
            this.listening = false;
        },
        onResults: (arg) => {
            console.log("onResults", arg);
            if((arg) && (arg.result) && (arg.result.speech)) {
                this.result = arg.result.speech;
            }
            if((arg) && (arg.result) && (arg.result.resolvedQuery)) {
                this.speech = arg.result.resolvedQuery;
            }
            this.closeStream();
        },
        onEvent: (code, message) => {
            console.log("onEvent : "+code+" - ", message);
            this.event_count = this.event_count + 1;

            this.blinkMic();

        },
        onError: (code, message) => {
            console.log("onEvent : "+code+" - ", message);
            this.closeStream();
        },
    });
    this.streamClient.init();
},

stopStream() {
    if((this.streamClient) && (this.listening)) {
        this.streamClient.stopListening();
    }
},

closeStream() {
    if(this.streamClient) {
        if((this.streamClient) && (this.listening)) {
            this.streamClient.stopListening();
        }
        this.streamClient.close();
        this.streamClient = null;
    }
},
```
