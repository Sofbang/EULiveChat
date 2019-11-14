function sendMessage(t) {  
    Bots.sendMessage(t);
}

function powerLine() {
    Bots.sendMessage('Downed Power Line');
    document.getElementById('web-messenger-container').contentDocument.getElementById("menu-items").style.display = "none";
}

function outage() {
    Bots.sendMessage('Outage');
    document.getElementById('web-messenger-container').contentDocument.getElementById("menu-items").style.display = "none";
}

function billing() {    
    Bots.sendMessage('Billing');
    document.getElementById('web-messenger-container').contentDocument.getElementById("menu-items").style.display = "none";
}

function accountNumber() {
    Bots.sendMessage('Find Account Number');
    document.getElementById('web-messenger-container').contentDocument.getElementById("menu-items").style.display = "none";
}

function startStop() {
    Bots.sendMessage('Start, Stop, or Move Service');
    document.getElementById('web-messenger-container').contentDocument.getElementById("menu-items").style.display = "none"; 
}

function recycling() {
    Bots.sendMessage('Recycling, Appliances, and Ways to Save');
    document.getElementById('web-messenger-container').contentDocument.getElementById("menu-items").style.display = "none"; 
}

function enableComments(comments) {
    comments.style.display='inline';   
}

// Slider Images
function imgurl(n)
{
if(n==1)
window.open("http://bit.ly/ODAEnablement");
else if(n==2)
window.open("https://fnimphiu.github.io/OracleTechExchange/#Tutorials");
else if(n==3)
window.open("hhttps://fnimphiu.github.io/OracleTechExchange/#AdvancedTraining2018");
else if(n==4)
window.open("https://fnimphiu.github.io/OracleTechExchange/tutorials/agentIntegration_032019_1/index.html");
else if(n==5)
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

function Close()
{

    
    Bots.destroy();
    clearChat();
    var appId = window.localStorage.getItem("appId");

    initBots(appId)
        .then(function() {
            window.sessionStorage.setItem('chatEnabled', 'true');
        })
        .catch(function(err) {
            console.log(err);
        });
}

function Close()
{
    var messengerDocument = document.getElementById('web-messenger-container').contentDocument;
    messengerDocument.getElementById("prompt").style.display="grid";
    messengerDocument.getElementById("conversation").style.opacity="0.2";
    messengerDocument.getElementById("selfin").style.opacity="0.2";
    messengerDocument.getElementById("textintro").style.opacity="0.2";
    messengerDocument.getElementById("cslider").style.opacity="0.2";
    messengerDocument.getElementById("footer").style.opacity="0.2";
    messengerDocument.getElementById("headerEl").style.opacity="0.2";
    messengerDocument.getElementById("conversation").style.pointerEvents ="none";
    messengerDocument.getElementById("selfin").style.pointerEvents ="none";
    messengerDocument.getElementById("textintro").style.pointerEvents ="none";
    messengerDocument.getElementById("cslider").style.pointerEvents ="none";
    messengerDocument.getElementById("footer").style.pointerEvents ="none";
    messengerDocument.getElementById("headerEl").style.pointerEvents ="none";
}

function CloseYes()
{
 Bots.destroy();
    clearChat();
    var appId = window.localStorage.getItem("appId");

    initBots(appId)
        .then(function() {
            window.sessionStorage.setItem('chatEnabled', 'true');
		    //document.getElementById("openChatButton1").style.display = "block";
        })
        .catch(function(err) {
            console.log(err);
        });
}

function CloseNo()
{
    var messengerDocument = document.getElementById('web-messenger-container').contentDocument;
    messengerDocument.getElementById("prompt").style.display="none";
    messengerDocument.getElementById("conversation").style.opacity="1";
    messengerDocument.getElementById("selfin").style.opacity="1";
    messengerDocument.getElementById("textintro").style.opacity="1";
    messengerDocument.getElementById("cslider").style.opacity="1";
    messengerDocument.getElementById("footer").style.opacity="1";
    messengerDocument.getElementById("headerEl").style.opacity="1";
    messengerDocument.getElementById("conversation").style.pointerEvents ="all";
    messengerDocument.getElementById("selfin").style.pointerEvents ="all";
    messengerDocument.getElementById("textintro").style.pointerEvents ="all";
    messengerDocument.getElementById("cslider").style.pointerEvents ="all";
    messengerDocument.getElementById("footer").style.pointerEvents ="all";
    messengerDocument.getElementById("headerEl").style.pointerEvents ="all";
}

function minimize()
{
    Bots.close();
    //document.getElementById("openChatButton1").style.display = "block";
}

function menuItems() {   
    var messengerDocument = document.getElementById('web-messenger-container').contentDocument;
    var k = messengerDocument.getElementById("menu-items").style.display = "block";
    console.log(k)
    /*console.log(k)
    if(k.style.display == "" || k.style.display == "none"){
          k.style.display = "block"    
     }else{
         k.style.display = "none"
     }*/
}

function menuMouseOut() {   
    var messengerDocument = document.getElementById('web-messenger-container').contentDocument;
    var k = messengerDocument.getElementById("menu-items");
    console.log("On Mouse Out")
    console.log(k)
    if(k.style.display == "" || k.style.display == "none"){
          k.style.display = "block"    
     }else{
         k.style.display = "none"
     }  
}

// to get the url paramters
function getUrlData() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m, key, value) {
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

    var appId = window.localStorage.getItem("appId");

    console.log('calling initBots');
    Bots.destroy();
    initBots(appId)
        .then(function() {
            console.log("init complete");
            window.sessionStorage.setItem('chatEnabled', 'true');
        })
        .catch(function(err) {
            console.log(err);
        });
}


function mouseOverImage() {
    document.getElementById("chatImg").src = "../images/chat-hover.png";
}

function mouseOutImage() {
   document.getElementById("chatImg").src = "../images/chat-launch.png";
}


function customUI() {
     // access messenger iframe document element
    var messengerDocument = document.getElementById('web-messenger-container').contentDocument;

    // Add the custom CSS to the message container frame.
    messengerDocument.head.innerHTML += "\n<link rel='stylesheet' href='./styles/customUI.css' type='text/css'></link>\n";
    messengerDocument.head.innerHTML += "\n<link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.9.0/css/all.css' type='text/css'></link>\n";
    var headerElement = messengerDocument.getElementById('header');
    var introElement = messengerDocument.querySelector('.intro-pane');
    
    // Hide the Introductio Header.
    introElement.style.display='none';
    headerElement.innerText = '';

    // DO NOT ADD the buttons to the intro section.
    //headerElement.innerHTML = introElement.innerHTML + headerElement.innerHTML;
    
    //quick response button
    //headerElement.insertAdjacentHTML("afterend", "<div id='selfin'><left><p id='spara'></p><a class='selfin-style' href='javascript:window.parent.powerLine();'>Downed Power Line</a><a class='selfin-style' href='javascript:window.parent.outage();'>Outage</a><a class='selfin-style' href='javascript:window.parent.billing();'>Billing</a><a class='selfin-style' href='javascript:window.parent.accountNumber();'>Find Account Number</a><a class='selfin-style' href='javascript:window.parent.startStop();'>Start, Stop, or Move Service</a><a class='selfin-style' href='javascript:window.parent.recycling();'>Recycling, Appliances, and Ways to Save</a></div>");
    //conversation intro text
    //headerElement.insertAdjacentHTML("afterend", "<div id='textintro'>Hi! How can I help you today? You can choose a topic to get started, or type in a direct question.</div>");
    //with next prev button slider
    //headerElement.insertAdjacentHTML("afterend", "<div id='cslider'> <div class='slideshow-container'> <div class='mySlides fade'> <div class='numbertext'>1 / 5</div><a class='tooltip' href='javascript:window.parent.imgurl(1)' ;><img src='./images/slider/slider-1.png' style='width:100%'><span class='tooltiptext'>ODA Enablement</span></a> <div class='text'></div></div><div class='mySlides fade'> <div class='numbertext'>2 / 5</div><a class='tooltip' href='javascript:window.parent.imgurl(2);'> <img class='simg' src='./images/slider/slider-2.jpg' style='width:100%'> <span class='tooltiptext'>Tutorials</span></a> <div class='text'></div></div><div class='mySlides fade'> <div class='numbertext'>3 / 5</div><a class='tooltip' href='javascript:window.parent.imgurl(3);'> <img class='simg' src='./images/slider/slider-3.jpg' style='width:100%'><span class='tooltiptext'>ODA Advanced Training</span> </a> <div class='text'></div></div><div class='mySlides fade'> <div class='numbertext'>4 / 5</div><a class='tooltip' href='javascript:window.parent.imgurl(4);'> <img class='simg' src='./images/slider/slider-4.jpg' style='width:100%'><span class='tooltiptext'>Agent Integration</span> </a> <div class='text'></div></div><div class='mySlides fade'> <div class='numbertext'>5 / 5</div><a class='tooltip' href='javascript:window.parent.imgurl(5);'> <img class='simg' src='./images/slider/slider-5.jpg' style='width:100%'> <span class='tooltiptext'>ODA Documentation</span></a> <div class='text'></div></div><a  class='prev' href='javascript:window.parent.plusSlides(-1);'>&#10094;</a><a class='next' href='javascript:window.parent.plusSlides(1);'>&#10095;</a></div><br><div style='text-align:center'> </div></div>");
    headerElement.insertAdjacentHTML("afterend", "<div id='cslider'> <div class='slideshow-container'> <div class='mySlides fade'>  <div class='text'></div></div><!--<a  class='prev' href='javascript:window.parent.plusSlides(-1);'>&#10094;</a><a class='next' href='javascript:window.parent.plusSlides(1);'>&#10095;</a>--></div><br><div style='text-align:center'> </div></div>");
    //our customized header
    headerElement.insertAdjacentHTML("afterend","<div id='headerEl' class='header-wrapper' style='background-color: #FFFFFF;'><div class='app-name'><span>Let's Chat!</span><a onmouseover='javascript:window.parent.menuItems();' onmouseout='javascript:window.parent.menuMouseOut();' class='menu-icon'>Menu</a></div><div><div id='min' class='close-handle close-hidden'><a href='javascript:window.parent.minimize();'><i class='fa fa-minus'></i></a>&emsp;<a href='javascript:window.parent.Close();'><i class='fa fa-times'></i></a></div></div></div>")
    window.parent.currentSlide(1);
    headerElement.insertAdjacentHTML("afterend","<div id='prompt'>Do you want to end the conversation?<br>This will clear your chat history.<div class='prompt-btn-sec'><a class='btn btn-primary prompt-btn-outline' style='border-color: rgb(0, 153, 255); background-color: rgb(0, 153, 255);' href='javascript:window.parent.CloseNo();'>No</a><a class='btn btn-primary prompt-btn-fill' style='border-color: rgb(0, 153, 255); background-color: rgb(0, 153, 255);' href='javascript:window.parent.CloseYes();'>Yes</a></div>");
    //The sample demo shipped with the Web SDK (app.js) can be modified to include this
    headerElement.insertAdjacentHTML("afterend","<div id='menu-items' onmouseover='javascript:window.parent.menuItems();'  onmouseout='javascript:window.parent.menuMouseOut();'><ul><li><a>I can help you with:</a></li><li><a  href='javascript:window.parent.billing();'>Billing and Payment</a></li><li><a  href='javascript:window.parent.outage();'>Outage</a></li><li><a href='javascript:window.parent.powerLine();'>Downed Power Line</a></li><li><a href='javascript:window.parent.accountNumber();'>Find Account Number</a></li><li><a  href='javascript:window.parent.startStop();'>Start, Stop or Move Service</a></li><li><a href='javascript:window.parent.recycling();'>Ways to Save</a></li></ul></div>")
    
    Bots.setDelegate({
    beforeDisplay: (message) => {
      // if message contains something specific about web view.
        if(message.text == 'DUMMY') {
            // Do additional checks
            var payL;
            if(message.actions[0] != null && message.actions[0].payload != null) {
                payL = JSON.parse(message.actions[0].payload);
                if(payL != null && payL.isHidden) {
                    
                // Make message text empty
                message.text = "";

                message.actions = [{
                    type: 'webview', // type of message action
                    text: payL.title, // button label
                    uri: payL.video, //some frame to be loaded in the Web SDK UI
                    fallback: payL.video, //in case the channel/browser doesn't WebViews
                    openOnReceive: true
                }];

                }
            } 
        }
    
      return message;
    }
  });
}