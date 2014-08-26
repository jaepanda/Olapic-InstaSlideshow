$(document).ready(function(e){

    // init vars 
    var imgs = [];
    var url = 'http://z1photorankapi-a.akamaihd.net/customers/216710/media/recent?auth_token=1f6da15fd360ed792faa8cc5c5c3e324f7e2cea031c1c9f020becaf8ccbe3e78&version=v2.2&count=50';

    // start ajax
    $.get( url, function( data ) {

        imgs = data.data._embedded.media;
        var arrayLength = imgs.length;

        for (var i = 0;i < arrayLength;i++){
            var thisImg = $('<img />',
                { 
                    id: imgs[i].id,
                    class: 'olaThumbnail inBucket',
                    src: imgs[i].images.normal
                })
            .appendTo($('div.bucket'));

            if(i == arrayLength - 1)
                firstInsert();
        }


        // Initialize packery
        var container = document.querySelector('#container');
        var myPackery = new Packery( container, {});

        // Function for initial insert
        function firstInsert(){
            $('.item_container').each(function(e){
                $(this).append($('.bucket .olaThumbnail:eq(0)'));
                $('.olaThumbnail', this).removeClass('inBucket');
            });
        }

        // @TODO - refactor randomization
        function doMagic(){

            var oldImgRand = Math.floor((Math.random()* $('.photoItem').length ));
            var newImgRand = Math.floor((Math.random()* $('.bucket img').length ));

            var oldImg = $(".photoItem:eq("+oldImgRand+") > .item_container > img:eq(0)");
            var newImg = $('.bucket img:eq('+newImgRand+')');

            newImg.hide().removeClass('bucket').appendTo($(".photoItem:eq("+oldImgRand+") .item_container"));

            oldImg.stop(true).fadeOut(500, function() {
                $(this).appendTo('.bucket').addClass('inBucket');
            });

            newImg.fadeIn(500);
            oldImg = newImg = null;
        };

        window.setInterval(function(){
            doMagic();
        }, 3800);

        window.setInterval(function(){
            refreshContent(url);
        }, 60000);

        function refreshContent(inputUrl){
            // Ping API, and put new images into DOM
            $.get( inputUrl, function( data ) {
                var imgs = [];
                imgs = data.data._embedded.media;
                var arrayLength = imgs.length;

                for (var i = 0;i < arrayLength;i++){

                    if ( $('img#'+imgs[i].id).length == 0 ){
                        var thisImg = $('<img />',
                            { 
                                id: imgs[i].id,
                                class: 'olaThumbnail inBucket',
                                src: imgs[i].images.normal
                            })
                        .appendTo($('div.bucket'));

                        console.log(imgs[i].id + ' doesn\t exist, adding into bucket...');
                    } else {
                        console.log(imgs[i].id + ' exists, skipping');
                    }
                }
            });
        };


    });

});