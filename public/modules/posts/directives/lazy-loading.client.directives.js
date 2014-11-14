'use strict';

angular.module('posts').directive('lazySrc', ['$window', '$document', function($window, $document) {
    var lazyLoader = (function() {
        // var images = [];

        // var renderTimer = null;
        // var renderDelay = 100;

        // var win = $($window);

        // var doc = $document;
        // var documentHeight = doc.height();
        // var documentTimer = null;
        // var documentDelay = 2000;

        // var isWatchingWindow = false;

        // function addImage(image) {
        //     images.push(image);

        //     if (!renderTimer) {
        //         startRenderTimer();
        //     }

        //     if (!isWatchingWindow) {
        //         startWatchingWindow();
        //     }
        // }

        // function removeImage( image ) {
        //     for (var i=0 ; i<images.length ; i++) {
        //         if (images[i] === image) {
        //             images.splice(i, 1);
        //             break;
        //         }
        //     }

        //     if (!images.length) {
        //         clearRenderTimer();
        //         stopWatchingWindow();
        //     }
        // }

        // function checkDocumentHeight() {
        //     if (renderTimer) {
        //         return;
        //     }

        //     var currentDocumentHeight = doc.height();

        //     if (currentDocumentHeight === documentHeight) {
        //         return;
        //     }

        //     documentHeight = currentDocumentHeight;
        //     startRenderTimer();
        // }

        // function checkImages() {
        //     console.log( "Checking for visible images..." );

        //     var visible = [];
        //     var hidden = [];

        //     var windowHeight = win.height();
        //     var scrollTop = win.scrollTop();

        //     var topFoldOffset = scrollTop;
        //     var bottomFoldOffset = ( topFoldOffset + windowHeight );

        //     for (var i=0 ; i<images.length ; i++) {
        //         var image = images[i];

        //         if (image.isVisible(topFoldOffset, bottomFoldOffset)) {
        //             visible.push(image);
        //         } else {
        //             hidden.push(image);
        //         }
        //     }

        //     for (var i=0 ; i<visible.length ; i++) {
        //         visible[i].render();
        //     }

        //     images = hidden;
        //     clearRenderTimer();

        //     if (!images.length) {
        //         stopWatchingWindow();
        //     }
        // }

        // function clearRenderTimer() {
        //     clearTimeout(renderTimer);
        //     renderTimer = null;
        // }

        // function startRenderTimer() {
        //     renderTimer = setTimeout( checkImages, renderDelay );
        // }

        // function startWatchingWindow() {
        //     isWatchingWindow = true;

        //     win.on("resize.lazySrc", windowChanged);
        //     win.on("scroll.lazySrc", windowChanged);

        //     documentTimer = setInterval(checkDocumentHeight, documentDelay);
        // }

        // function stopWatchingWindow() {
        //     isWatchingWindow = false;

        //     win.off("resize.lazySrc");
        //     win.off("scroll.lazySrc");

        //     clearInterval(documentTimer);
        // }

        // function windowChanged() {
        //     if (!renderTimer) {
        //         startRenderTimer();
        //     }

        // }

        // return({
        //     addImage: addImage,
        //     removeImage: removeImage
        // });
    })();

    function link($scope, element, attributes) {
        // var lazyImage = new LazyImage(element);

        // lazyLoader.addImage(lazyImage);

        // attributes.$observe(
        //     "lazySrc",
        //     function(newSource) {
        //         lazyImage.setSource(newSource);
        //     }
        // );

        // $scope.$on(
        //     "$destroy",
        //     function() {
        //         lazyLoader.removeImage(lazyImage);
        //     }
        // );
    }

    return({
        link: link,
        restrict: 'A'
    });
}]);
