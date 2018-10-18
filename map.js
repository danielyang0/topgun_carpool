var map;
var markers = [];
var infowindow;
var messagewindow;
var location;

function initMap() {
  var california = {lat: 37.4419, lng: -122.1419};
  map = new google.maps.Map(document.getElementById('map'), {
    center: california,
    zoom: 15
  });

  var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  locations = [
  {lat: 37.7723, lng: -122.440}
  ]
  var matchedMarkers = locations.map(function(location, i) {
    return new google.maps.Marker({
      position: location,
      label: labels[i % labels.length]
    });
  });

          // Add a marker clusterer to manage the markers.
          var markerCluster = new MarkerClusterer(map, matchedMarkers,
            {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});


          google.maps.event.addListener(map, 'click', function(event) {
            if(markers.length == 1) {
              markers[0].setMap(null);
            }
            markers = [];
            var marker = new google.maps.Marker({
              position: event.latLng,
              map: map
            });
            markers.push(marker);
          });

          currInfoWindow = new google.maps.InfoWindow;

        // Try HTML5 geolocation.
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };

            var currLatLng = new google.maps.LatLng(pos.lat,pos.lng);
            var marker = new google.maps.Marker({
              position: currLatLng,
              icon: {
                path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
                scale: 5
              },
              draggable: true,
              map: map
            });

            map.setCenter(pos);
          }, function() {
            handleLocationError(true, currInfoWindow, map.getCenter());
          });
        } else {
          // Browser doesn't support Geolocation
          handleLocationError(false, currInfoWindow, map.getCenter());
        }
      }
      function handleLocationError(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
          'Error: The Geolocation service failed.' :
          'Error: Your browser doesn\'t support geolocation.');
        infoWindow.open(map);
      }

      function saveData() {
        var time = document.getElementById('time').value;
        var attendance = document.getElementById('attendance').value;
        var latlng = markers[0].getPosition();
        alert('latitude: '+latlng.lat());
        alert('longitude: '+ latlng.lng());
        alert('time: '+time+'  max attentance: '+attendance);
      }
