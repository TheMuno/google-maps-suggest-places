const $map = document.querySelector('#map'),
    $autocomplete = document.querySelector('.user-input'), 
    $placeType = document.querySelector('.place-type'),
    mapZoom = 13,
    initialCoords  = { lat: 40.7580, lng: -73.9855 },
    mapIcon = 'https://uploads-ssl.webflow.com/61268cc8812ac5956bad13e4/64ba87cd2730a9c6cf7c0d5a_pin%20(3).png'; 

const icon = {
    url: mapIcon, //place.icon,
    size: new google.maps.Size(71, 71),
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(17, 34),
    scaledSize: new google.maps.Size(25, 25),
};

const markerPopup = new google.maps.InfoWindow();  

!function initMap() {
    map = new google.maps.Map($map, { 
        zoom: mapZoom,
        center: initialCoords,
    });

    let autocomplete = new google.maps.places.Autocomplete($autocomplete);
    autocomplete.bindTo('bounds', map); 

    google.maps.event.addListener(autocomplete, 'place_changed', ()=>{
        let place = autocomplete.getPlace();
        if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport);
        }
        else {
            map.setCenter(place.geometry.location);
        }

        const placeType = $placeType.value;

        let request = {
            location: place.geometry.location,
            radius: '500',
            type: [placeType]
        };

        service = new google.maps.places.PlacesService(map);
        service.nearbySearch(request, callback);

        // $autocomplete.value = ''; 

    });
}(); 

function callback(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
        for (let i = 0; i < results.length; i++) {
            let place = results[i];
            // console.log(place) 
            createMarker(place.name, place.geometry.location);
        }
    }
}

function createMarker(title, position) {
    const marker = new google.maps.Marker({
        map,
        icon,
        title, 
        position,  
    });

    marker.addListener('click', () => { 
        markerPopup.close();
        markerPopup.setContent(marker.getTitle());
        markerPopup.open(marker.getMap(), marker);
    });

    return marker; 
} 