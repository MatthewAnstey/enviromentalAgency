navigator.geolocation.getCurrentPosition(
    function(position) {
        var latitude = position.coords.latitude,
            longitude = position.coords.longitude;

        var userPosition = new google.maps.LatLng(latitude, longitude);

        map = new google.maps.Map(document.getElementById('map'), {
            center: userPosition,
            zoom: 15
        });

        var layer = new google.maps.FusionTablesLayer({
            query: {
                select: 'Location',
                from: global.Config.fusionTableId
            },
            map: map
        });

    },
    function() {
        //error
    });