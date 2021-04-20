// var dataSpeedVariable = [21, 41, 54, 74, 84, 95, 98, 100];
var parallaxEffect = document.getElementById("ceros-parallax-effect-plugin");
var dataSpeedVariable = parallaxEffect.getAttribute("data-speed-variable").split(" ");
var minMaxScroll = parallaxEffect.getAttribute("min-max-scroll");
var parallaxDelay = parallaxEffect.getAttribute("parallax-delay");
var parallaxAnchors;

(function(){
    'use strict';
    require.config({
        paths: {
            CerosSDK: '//sdk.ceros.com/standalone-player-sdk-v5.min'
        }
    });
    require(['CerosSDK'], function (CerosSDK) {
        CerosSDK.findExperience()
            .fail(function (error) {
                console.error(error);
            })
            .done(function (experience) {
                window.myExperience = experience;
                var parallaxObjects = experience.findLayersByTag("parallax").layers;

                experience.on(CerosSDK.EVENTS.PAGE_CHANGED, pageChangedCallback);
                function pageChangedCallback(){
                    console.log("works_00");
                    var pageContainer = document.querySelector(".page-viewport.top > .page-container");
                    //making new array of parallaxObjects that are on current page 
                    currentPageParallaxObjects = parallaxObjects.filter(($object) =>{
                        let $obj = document.getElementById($object.id);
                        if(pageContainer.contains($obj)){
                            return $object;
                        }
                    });

                    console.log("works_01");
                    var pageScroll = $(pageContainer).children().first();
                    parallaxAnchors = $(pageScroll).find(".scranchor").toArray();

                    console.log("works_02");
                    var sortByZIndex = function(a, b){
                        return b.style.zIndex - a.style.zIndex;
                    }
                    console.log("works_03");
                    var sorted = $(currentPageParallaxObjects).sort(sortByZIndex);
                    for(let i = 0; i < sorted.length; i++){
                        console.log("arr");
                        sorted[i].setAttribute("data-speed", dataSpeedVariable[i]);
                        if(parallaxDelay != ""){
                            let delay = 'transform ' + parallaxDelay + 'ms ease';
                            sorted[i].style.setProperty("transition", delay);
                        }
                    }

                    pageContainer.addEventListener("scroll", function(){requestAnimationFrame(para(sorted))});
                }
            })
    });
})();

function para(layers) {
    console.log("para");
    let top = this.scrollTop;
    let minScroll = parseInt(anchors[0].style.top, 10);
    let maxScroll = parseInt(anchors[(anchors.length)-1].style.top, 10);
    let layer, speed, yPos;

    if(minMaxScroll != ""){
        let rangeOfScroll = minMaxScroll.split(" ");
        minScroll = rangeOfScroll[0];
        maxScroll = rangeOfScroll[1];
    }
        
    for (let i = 0; i < layers.length; i++) {
        layer = layers[i];
        speed = layer.getAttribute('data-speed');
        yPos = (top * speed / 100);

        //scroll position is between Ceros anchors
        if(top >= minScroll && top <= maxScroll){
            layer.style.transform = 'translate3d(0px, ' + yPos + 'px, 0px)';
        }
        //scroll position is above first Ceros anchor
        // if(top >= minScroll && top <= maxScroll){
        //     layer.style.transform = 'translate3d(0px, ' + yPos + 'px, 0px)';
        // }
    }
};
