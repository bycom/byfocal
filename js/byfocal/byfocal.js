/*
 *  Project: ByFocal
 *  Description: Rule of thirds focal point selection for images
 *  @author: BY
 *  @url: http://github.com/bycom
 *  @version: 1.0
 *
 *  Basic usage:
 *  $('#img').byfocal();
 *  
 *  Advanced usage:
 *  $('#img').byfocal({ focus: "top-left" });
 *  
 *  Focus options (defaults to middle-center):
 *  top-left
 *  top-center
 *  top-right
 *  middle-left
 *  middle-center
 *  middle-right
 *  bottom-left
 *  bottom-center
 *  bottom-right
 *  
 *  Supports jQuery smartresize <https://github.com/louisremi/jquery-smartresize>
 */

;(function ( $, window, document, undefined ) {

    var pluginName = "byfocal",
        defaults = {
            focus: "middle-center"
        };

    function byfocal( element, options ) {
        
        this.element = element;
        this.options = $.extend( {}, defaults, options );

        this._defaults = defaults;
        this._name = pluginName;

        this.init();
    }

    byfocal.prototype = {

        init: function() {

            // check for smartresize

            var resizeEvent = $.event.special.debouncedresize ? "debouncedresize" :
                              $.event.special.throttledresize ? "throttledresize" : "resize";

            $(window).bind(resizeEvent, { _this: this }, function(e){

                var _this = e.data._this;

                _this.resizeImage(_this.element, _this.options);

            }).resize();
        },

        resizeImage: function(elem, options){

            var _attr = "style", _rel = "relative",
                focus = options.focus,

                $container = $(this.element).parent(),
                containerW = $container.width(),
                containerH = $container.height(),

                $img = $(this.element),
                imgW = $img.width(),
                imgH = $img.height(),

                diffW, diffH, pos;

            if( containerW / containerH >= imgW / imgH ){

                // window wider than img

                $img.removeAttr(_attr).css({ position: _rel, width: containerW });

                diffH = $img.height() - containerH;

                pos = focus.indexOf("top") >= 0 ? $img.css({ top: 0 }) :
                      focus.indexOf("bottom") >= 0 ? $img.css({ top: -diffH }) : $img.css({ top: -(diffH / 2) });

            } else {

                // img wider than window

                $img.removeAttr(_attr).css({ position: _rel, height: containerH });

                diffW = $img.width() - containerW;

                pos = focus.indexOf("left") > -1 ? $img.css({ left: 0 }) :
                      focus.indexOf("right") > -1 ? $img.css({ left: -diffW }) : $img.css({ left: -(diffW / 2) });
            }
        }
    };

    $.fn[pluginName] = function ( options ) {
        return this.each(function () {
            $.data(this, "plugin_" + pluginName, new byfocal( this, options ));
        });
    };

})( jQuery, window, document );