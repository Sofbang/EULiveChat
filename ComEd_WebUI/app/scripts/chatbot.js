!function(e,t,n,r){
    function s(){try{var e;if((e="string"==typeof this.response?JSON.parse(this.response):this.response).url){var n=t.getElementsByTagName("script")[0],r=t.createElement("script");r.async=!0,r.src=e.url,n.parentNode.insertBefore(r,n)}}catch(e){}}var o,p,a,i=[],c=[];e[n]={init:function(){o=arguments;var e={then:function(t){return c.push({type:"t",next:t}),e},catch:function(t){return c.push({type:"c",next:t}),e}};return e},on:function(){i.push(arguments)},render:function(){p=arguments},destroy:function(){a=arguments}},e.__onWebMessengerHostReady__=function(t){if(delete e.__onWebMessengerHostReady__,e[n]=t,o)for(var r=t.init.apply(t,o),s=0;s<c.length;s++){var u=c[s];r="t"===u.type?r.then(u.next):r.catch(u.next)}p&&t.render.apply(t,p),a&&t.destroy.apply(t,a);for(s=0;s<i.length;s++)t.on.apply(t,i[s])};var u=new XMLHttpRequest;u.addEventListener("load",s),u.open("GET",r+"/loader.json",!0),u.responseType="json",u.send()
}(window,document,"Bots", "http://localhost:3000/bots-client-sdk-js");

function initbots() {
    var messageBody = {
        text: 'Hi',
        type: 'text',
        metadata: {
            isHidden: true
        }
    };
    return Bots.init({
        appId: '5dce32aa4a4ccc00104a995f',
        displayStyle: 'button',
        buttonIconUrl: '/images/chat-launch.svg', //'{Url to image at least 200 x 200 pixels and in either JPG, PNG, or GIF format}',
        buttonWidth: '58px', //'58px',
        buttonHeight: '58px',
        businessName: 'Oracle, MCE',
        menuItems: {
            imageUpload: false,
            fileUpload: false,
            shareLocation: false
        },

        customText: {
            fetchingHistory: 'Retrieving history...',
            headerText: 'OMCE, How can we help?',
            introductionText: 'Mobile Cloud Enterprise'
        }
    }).then(function (res) {
        var initialBotMessage=false;
        Bots.on('widget:opened', function () {
            if (Bots.getConversation().messages != null && Bots.getConversation().messages.length < 1) {
                Bots.setDelegate({
                    beforeDisplay(messageBody) {
                        if (messageBody.metadata && messageBody.metadata.isHidden) {
                            initialBotMessage=true;
                            return null;
                        }
                        return messageBody;
                    }
                });
                Bots.sendMessage(messageBody);
            }
        })

        console.log('calling Bots.on message');
        /* CUSTOM - START*/
        Bots.on('message', function(message) {
            console.log('message >>' + message.text);
            if(!initialBotMessage && message.equals('Hi')){
            Bots.setDelegate({
                beforeDisplay(message) {
                    if (message.text.includes('Ask ComEd')) {
                        let displayText = message.text.replace('Ask ComEd', '');
                        message.text = displayText;
                        return message;
                    } 
                    return message;
                }
            });
        }
          //  console.log("message"+JSON.stringify(Bots.getConversation().messages));
            var messengerDocument = document.getElementById('web-messenger-container').contentDocument;
            messengerDocument.getElementById("conversation").style.visibility = "visible";
            var cdescItems = messengerDocument.querySelectorAll('.carousel-description');
            if (cdescItems != null) {
                cdescItems.forEach(function (singleCDesc) {
                    singleCDesc.style = "margin: 0px 8px 13px; font-size: 13px; color: rgb(179, 179, 179); white-space: pre-wrap; flex: 2 1";
                });
            }
        });

        /* CUSTOM - END*/
        //});
    }).then(customUI); /* CUSTOM - */

}

function clearChat(e) {
    if (e != null) e.preventDefault(); /* CUSTOM - Added if(e != null) */
    var keys = Object.keys(localStorage);
    for (var i = 0; i < keys.length; i++) {
        if (keys[i] === 'appId') {
            continue;
        }
        localStorage.removeItem(keys[i]);
    }
}
/*-------------------------------------------------------------------------------------------------------------------------------------------*/

function sendMessage(t) {
    Bots.sendMessage(t);
}

function powerLine() {
    Bots.sendMessage('Ask ComEd Downed Power Line');
    document.getElementById('web-messenger-container').contentDocument.getElementById("menu-items").style.display = "none";
}

function outage() {
    Bots.sendMessage('Ask ComEd Outage');
    document.getElementById('web-messenger-container').contentDocument.getElementById("menu-items").style.display = "none";
}

function billing() {
    Bots.sendMessage('Ask ComEd Billing and Payment');
    document.getElementById('web-messenger-container').contentDocument.getElementById("menu-items").style.display = "none";
}

function accountNumber() {
    Bots.sendMessage('Ask ComEd Find Account Number');
    document.getElementById('web-messenger-container').contentDocument.getElementById("menu-items").style.display = "none";
}

function startStop() {
    Bots.sendMessage('Ask ComEd Start Stop or Move Service');
    document.getElementById('web-messenger-container').contentDocument.getElementById("menu-items").style.display = "none";
}

function recycling() {
    Bots.sendMessage('Ask ComEd Ways to Save');
    document.getElementById('web-messenger-container').contentDocument.getElementById("menu-items").style.display = "none";
}

function enableComments(comments) {
    comments.style.display = 'inline'
}

// Slider Images
function imgurl(n) {
    if (n == 1)
        window.open("http://bit.ly/ODAEnablement");
    else if (n == 2)
        window.open("https://fnimphiu.github.io/OracleTechExchange/#Tutorials");
    else if (n == 3)
        window.open("hhttps://fnimphiu.github.io/OracleTechExchange/#AdvancedTraining2018");
    else if (n == 4)
        window.open("https://fnimphiu.github.io/OracleTechExchange/tutorials/agentIntegration_032019_1/index.html");
    else if (n == 5)
        window.open("https://docs.oracle.com/en/cloud/paas/digital-assistant/use-chatbot/overview-digital-assistants-and-skills.html#GUID-386AB33B-C131-4A0A-9138-6732AE841BD8");
}


var slideIndex = 1;

function plusSlides(n) {
    showSlides(slideIndex += n);
}

function currentSlide(n) {
    showSlides(slideIndex = n);
}

function showSlides(n) {

    var messengerDocument = document.getElementById('web-messenger-container').contentDocument;
    var i;
    var slides = messengerDocument.getElementsByClassName("mySlides");

    if (n > slides.length) {
        slideIndex = 1
    }
    if (n < 1) {
        slideIndex = slides.length
    }
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = 'none';
    }

    slides[slideIndex - 1].style.display = 'block';

}

function Close() {

    Bots.destroy();
    clearChat();
   
    initbots()
        .then(function () {
            window.sessionStorage.setItem('chatEnabled', 'true');
        })
        .catch(function (err) {
            console.log(err);
        });
}

function Close() {
    var messengerDocument = document.getElementById('web-messenger-container').contentDocument;
    messengerDocument.getElementById("prompt").style.display = "grid";
    messengerDocument.getElementById("conversation").style.opacity = "0.2";
    messengerDocument.getElementById("cslider").style.opacity = "0.2";
    messengerDocument.getElementById("footer").style.opacity = "0.2";
    messengerDocument.getElementById("headerEl").style.opacity = "0.2";
    messengerDocument.getElementById("conversation").style.pointerEvents = "none";
   // messengerDocument.getElementById("selfin").style.pointerEvents = "none";
    messengerDocument.getElementById("textintro").style.pointerEvents = "none";
    messengerDocument.getElementById("cslider").style.pointerEvents = "none";
    messengerDocument.getElementById("footer").style.pointerEvents = "none";
    messengerDocument.getElementById("headerEl").style.pointerEvents = "none";
}

function CloseYes() {
    Bots.destroy();
    clearChat();
   

    initbots()
        .then(function () {
            window.sessionStorage.setItem('chatEnabled', 'true');
        })
        .catch(function (err) {
            console.log(err);
        });
}

function CloseNo() {
    var messengerDocument = document.getElementById('web-messenger-container').contentDocument;
    messengerDocument.getElementById("prompt").style.display = "none";
    messengerDocument.getElementById("conversation").style.opacity = "1";
    messengerDocument.getElementById("textintro").style.opacity = "1";
    messengerDocument.getElementById("cslider").style.opacity = "1";
    messengerDocument.getElementById("footer").style.opacity = "1";
    messengerDocument.getElementById("headerEl").style.opacity = "1";
    messengerDocument.getElementById("conversation").style.pointerEvents = "all";
    messengerDocument.getElementById("selfin").style.pointerEvents = "all";
    messengerDocument.getElementById("textintro").style.pointerEvents = "all";
    messengerDocument.getElementById("cslider").style.pointerEvents = "all";
    messengerDocument.getElementById("footer").style.pointerEvents = "all";
    messengerDocument.getElementById("headerEl").style.pointerEvents = "all";
}

function minimize() {
    Bots.close();
}

function menuItems() {
    var messengerDocument = document.getElementById('web-messenger-container').contentDocument;
    var k = messengerDocument.getElementById("menu-items").style.display = "block";
}

function menuMouseOut() {
    var messengerDocument = document.getElementById('web-messenger-container').contentDocument;
    var k = messengerDocument.getElementById("menu-items");
    console.log("On Mouse Out")
    console.log(k)
    if (k.style.display == "" || k.style.display == "none") {
        k.style.display = "block"
    } else {
        k.style.display = "none"
    }
}

// to get the url paramters
function getUrlData() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
        vars[key] = value;
    });

    return vars["bot"];
}

function showChatButton() {

    console.log('Show Bot');

    clearChat();
    if (window.sessionStorage.getItem('chatEnabled') === null) {
        clearChat();
    }
    console.log('calling initBots');
    Bots.destroy();
    initbots()
        .then(function () {
            console.log("init complete");
            window.sessionStorage.setItem('chatEnabled', 'true');
        })
        .catch(function (err) {
            console.log(err);
        });
}



function customUI() {
    // access messenger iframe document element
    var messengerDocument = document.getElementById('web-messenger-container').contentDocument;

    // Add the custom CSS to the message container frame.
    messengerDocument.head.innerHTML += "\n<link rel='stylesheet' href='./styles/chatbot.css' type='text/css'></link>\n";
    messengerDocument.head.innerHTML += "\n<link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.9.0/css/all.css' type='text/css'></link>\n";
    var headerElement = messengerDocument.getElementById('header');
    var introElement = messengerDocument.querySelector('.intro-pane');

    // Hide the Introductio Header.
    introElement.style.display = 'none';
    headerElement.innerText = '';

    // DO NOT ADD the buttons to the intro section.

    headerElement.insertAdjacentHTML("afterend", "<div id='cslider'> <div class='slideshow-container'> <div class='mySlides fade'>  <div class='text'></div></div><!--<a  class='prev' href='javascript:window.parent.plusSlides(-1);'>&#10094;</a><a class='next' href='javascript:window.parent.plusSlides(1);'>&#10095;</a>--></div><br><div style='text-align:center'> </div></div>");
    //our customized header
    headerElement.insertAdjacentHTML("afterend", "<div id='headerEl' class='header-wrapper' style='background-color: #FFFFFF;'><div class='app-name'><span>Let's Chat!</span><a onmouseover='javascript:window.parent.menuItems();' onmouseout='javascript:window.parent.menuMouseOut();' class='menu-icon'>Menu</a></div><div><div id='min' class='close-handle close-hidden'><a href='javascript:window.parent.minimize();'><i class='fa fa-minus'></i></a>&emsp;<a href='javascript:window.parent.Close();'><i class='fa fa-times'></i></a></div></div></div>")
    window.parent.currentSlide(1);
    headerElement.insertAdjacentHTML("afterend", "<div id='prompt'>Do you want to end the conversation?<br>This will clear your chat history.<div class='prompt-btn-sec'><a class='btn btn-primary prompt-btn-outline' style='border-color: rgb(0, 153, 255); background-color: rgb(0, 153, 255);' href='javascript:window.parent.CloseNo();'>No</a><a class='btn btn-primary prompt-btn-fill' style='border-color: rgb(0, 153, 255); background-color: rgb(0, 153, 255);' href='javascript:window.parent.CloseYes();'>Yes</a></div>");
    //The sample demo shipped with the Web SDK (app.js) can be modified to include this
    headerElement.insertAdjacentHTML("afterend", "<div id='menu-items' onmouseover='javascript:window.parent.menuItems();'  onmouseout='javascript:window.parent.menuMouseOut();'><ul><li><a>I can help you with:</a></li><li><a  href='javascript:window.parent.billing();'>Billing and Payment</a></li><li><a  href='javascript:window.parent.outage();'>Outage</a></li><li><a href='javascript:window.parent.powerLine();'>Downed Power Line</a></li><li><a href='javascript:window.parent.accountNumber();'>Find Account Number</a></li><li><a  href='javascript:window.parent.startStop();'>Start, Stop or Move Service</a></li><li><a href='javascript:window.parent.recycling();'>Ways to Save</a></li></ul></div>")

}