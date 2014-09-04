$(document).ready(function(e){

    // init vars 
    var imgs = [];
    var olapicKeys = JSON.parse('{"customerkeys":[{"name":"Piperlime","key":"1f6da15fd360ed792faa8cc5c5c3e324f7e2cea031c1c9f020becaf8ccbe3e78","customerID":"216710"},{"name":"Coachfromabove","key":"0416f4fb8dd48d79ce229eade4fdc66bdef7e8ce6b7b76719a38608f99c4fbb4","customerID":"215841"},{"name":"Westelm","key":"11ff75db4075b453ac4a21146a210e347479b26b67b1a396d9e29705150daa0d","customerID":"215934"},{"name":"Giggle","key":"538266d11aa4c6ebcac965c8f780bd613259c345698af1cd06ee4251449b4150","customerID":"216289"},{"name":"Aerie","key":"50f9310f38e9d3c0098de527a33b61d80ab0f1cdfc7619dafadca6e3be81a3f8","customerID":"216260"}]}');
    var rand = Math.floor(Math.random()*olapicKeys.customerkeys.length);
    var olapicKey = olapicKeys.customerkeys[rand].key;
    var olapicId = olapicKeys.customerkeys[rand].customerID;
    var url = 'http://z1photorankapi-a.akamaihd.net/customers/'+olapicId+'/media/recent?auth_token='+olapicKey+'&version=v2.2&count=50';

    $('#client-name').text(olapicKeys.customerkeys[rand].name);

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