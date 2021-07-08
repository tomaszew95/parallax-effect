var parallaxEffect = document.getElementById("ceros-parallax-effect-plugin");
var dataSpeedVariable = parallaxEffect.getAttribute("data-speed-variable").split(" ");
var minMaxScroll = parallaxEffect.getAttribute("min-max-scroll");
var parallaxTiming = parallaxEffect.getAttribute("parallax-timing").split(" ");
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
                        if(parallaxTiming != ""){
                            let easing = (1<parallaxTiming.length) ? parallaxTiming[1]:'ease';
                            let delay = 'transform ' + parallaxTiming[0] + 'ms ' + easing;
                            sorted[i].style.setProperty("transition", delay);
                        }
                    }
                    //adding scroll starting and ending position
                    let scrollPos = {
                        minScroll: 0,
                        maxScroll: pageHeight
                    }
                    if(minMaxScroll != ""){
                        let rangeOfScroll = minMaxScroll.split(" ");
                        if(rangeOfScroll.length >=2){
                            scrollPos.minScroll = parseInt(rangeOfScroll[0], 10);
                            scrollPos.maxScroll = parseInt(rangeOfScroll[1], 10);
                        }
                        else{
                            scrollPos.maxScroll = parseInt(rangeOfScroll, 10);
                        }
                    }

                    pageContainer.addEventListener("scroll", function(){para(this, sorted, scrollPos)});
                }
            })
    });
})();

var para = ($this, layers, scrollPos) =>{
    let top = $this.scrollTop;
    let layer, speed, yPos;
        
    for (let i = 0; i < layers.length; i++) {
        layer = layers[i];
        speed = layer.getAttribute('data-speed');
        yPos = ((top-scrollPos.minScroll) * speed/100);
        if(top >= scrollPos.minScroll && top <= scrollPos.maxScroll){
            layer.style.transform = 'translate3d(0px, ' + yPos + 'px, 0px)';
        }
    }
}
