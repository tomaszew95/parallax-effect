var parallaxEffect = document.getElementById("ceros-parallax-effect-plugin");
var dataSpeedVariable = parallaxEffect.getAttribute("data-speed-variable").split(" ");
var minMaxScroll = parallaxEffect.getAttribute("min-max-scroll");
var parallaxDelay = parallaxEffect.getAttribute("parallax-delay");
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
                    var pageContainer = document.querySelector(".page-viewport.top > .page-container");
                    var pageHeight = experience.getCurrentPage().getHeight();

                    //making new array of parallaxObjects that are on current page 
                    var currentPageParallaxObjects = parallaxObjects.filter(($object) =>{
                        let $obj = document.getElementById($object.id);
                        if(pageContainer.contains($obj)){
                            return $object;
                        }
                    });

                    //making HTML Array of parallaxObjects 
                    var parallax = [];
                    for(let y=0;y<currentPageParallaxObjects.length;y++){
                        parallax[y] = document.getElementById(currentPageParallaxObjects[y].id);
                    }

                    //sorting parallaxObjects based on zIndex order
                    var sortByZIndex = function(a, b){
                        return b.style.zIndex - a.style.zIndex;
                    }
                    var sorted = $(parallax).sort(sortByZIndex);

                    //adding delay
                    for(let i = 0; i < sorted.length; i++){
                        sorted[i].setAttribute("data-speed", dataSpeedVariable[i]);
                        if(parallaxDelay != ""){
                            let delay = 'transform ' + parallaxDelay + 'ms ease';
                            sorted[i].style.setProperty("transition", delay);
                        }
                    }
                    pageContainer.addEventListener("scroll", function(){para(this, sorted, pageHeight)});
                }
            })
    });
})();

var para = ($this, layers, pageH) =>{
    let top = $this.scrollTop;
    let minScroll = 0;
    let maxScroll = pageH;
    let layer, speed, yPos;

    if(minMaxScroll != ""){
        let rangeOfScroll = minMaxScroll.split(" ");
        if(rangeOfScroll.length >=2){
            minScroll = parseInt(rangeOfScroll[0], 10);
            maxScroll = parseInt(rangeOfScroll[1], 10);
        }
        else{
            maxScroll = parseInt(rangeOfScroll, 10);
        }
    }
        
    for (let i = 0; i < layers.length; i++) {
        layer = layers[i];
        speed = layer.getAttribute('data-speed');
        yPos = (top * speed / 100);
        let newPos = yPos-minScroll;
        console.log(newPos);
        if(top >= minScroll && top <= maxScroll){
            layer.style.transform = 'translate3d(0px, ' + newPos + 'px, 0px)';
        }
    }
}
