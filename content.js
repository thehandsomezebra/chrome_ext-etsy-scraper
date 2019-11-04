console.log("content running for etsy image scraper");

function wait(ms) {
  var start = new Date().getTime();
  var end = start;
  while (end < start + ms) {
    end = new Date().getTime();
  }
}

chrome.runtime.onMessage.addListener(gotMessage);

function gotMessage(request, sender, sendResponse) {
  if (request.message === "start") {
    console.log(request.message);

    function eventFire(el, etype) {
      if (el.fireEvent) {
        el.fireEvent("on" + etype);
      } else {
        var evObj = document.createEvent("Events");
        evObj.initEvent(etype, true, false);
        el.dispatchEvent(evObj);
      }
    }

////If the url contains "listing", then it's a page that we download the images from.
    //Make new arrays
    if (document.URL.includes("/listing/")){
var urlList = [];

//heres the entire list of images on the page
var domImageNodeList = document.querySelectorAll(".carousel-image")

    //walk down all images in the carosuel...
    for (var i = 0; i < domImageNodeList.length; i++) {
        urlList.push(domImageNodeList[i].src)

    }
    
urlList.push("\n")
    console.log(urlList);

//set up the txt file
    let txtContent =
      "data:text/txt;charset=utf-8," +
      urlList.join("\n");
txtFileName = document.title + ".txt"
    var encodedUri = encodeURI(txtContent);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", txtFileName);
    document.body.appendChild(link); // Required for FF
//download the txt file
    link.click();
//now close the tab
  setTimeout(closeTab, 600);
  
    }

////else the page should be the shop... open all of the listings shown
else {
var listingsOnPage = document.querySelectorAll(".listing-cards")[0].querySelectorAll(".listing-link")


for (var i = 0; i < listingsOnPage.length; i++) {
    listingsOnPage[i].click()
    // if (i === 5 || i === 10 || i === 20 || i === 30 || i === 40 || i === 15 || i === 25 || i === 35){
    //     wait(10000)
    // }
}


}



    chrome.runtime.sendMessage({ message: "scrapestart" });
  } else if (request.message === "scrapedone") {
    console.log(request.message);
    chrome.runtime.sendMessage({ message: "done" });
  }
}

function closeTab() {
     chrome.runtime.sendMessage({type: "closeTab"});
}
