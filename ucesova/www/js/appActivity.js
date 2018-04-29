
// load a map
var mymap = L.map('mapid').setView([51.505, -0.09], 13);

// load the tiles
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
	maxZoom: 18,
	attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' + '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' + 'Imagery © <a href="http://mapbox.com">Mapbox</a>',
	id: 'mapbox.streets'
}).addTo(mymap);

// create a variable that will hold the XMLHttpRequest()
var client;


// get the questions points from the database using an XMLHttpRequest (to show them on the map)

var POIlayer; // variable that will hold the layer itself – we need to do this outside the function so that we can use it to remove the layer later on

function getPOI() {
	client = new XMLHttpRequest();
	client.open('GET', 'http://developer.cege.ucl.ac.uk:30293/getGeoJSON/questions/geom');
	client.onreadystatechange = POIResponse;
	client.send();
}
// create the code to wait for the response from the data server, and process the response once it is received
function POIResponse() {
	// this function listens out for the server to say that the data is ready - i.e. has state 4
	if (client.readyState == 4) {
		// once the data is ready, process the data
		var POIdata = client.responseText;
		loadPOIlayer(POIdata);
	}
}
// convert the received data - which is text - to JSON format and add it to the map
function loadPOIlayer(POIdata) {

	// convert the text to JSON
	var POIjson = JSON.parse(POIdata);

	// add the JSON layer onto the map -it will apper using the default icons
	POIlayer = L.geoJson(POIjson).addTo(mymap);

	//change the map zoom so that all the data is shown
	mymap.fitBounds(POIlayer.getBounds());
}

// get the questions
function getQuestions() {
	client = new XMLHttpRequest();
	client.open('GET', 'http://developer.cege.ucl.ac.uk:30293/getQuestions');
	client.onreadystatechange = questionsResponse;
	client.send();
}

// get the questions, 2nd version (using javascript promises) 
// based on https://developers.google.com/web/fundamentals/primers/promises)
// and https://stackoverflow.com/questions/30008114/how-do-i-promisify-native-xhr?utm_medium=organic&utm_source=google_rich_qa&utm_campaign=google_rich_qa
function getQuestionsV2(method, url) { 
	return new Promise(function (resolve, reject) {
		var xhr = new XMLHttpRequest();
		xhr.open(method, url);
		xhr.onload = resolve;
		xhr.onerror = reject;
		xhr.send();
	});
}

function questionsResponse() {
	if (client.readyState == 4) {
		var questionsData = client.responseText;
		loadQuestionsLayer(questionsData);
	}
}

// convert the received data - which is text - to JSON format
function loadQuestionsLayer(questionsData) {

	// convert the text to JSON
	var questionsJSON = JSON.parse(questionsData);
}

//process the geoJSON (based on practical 6's appendix) 
// --> But we need to do this without pasting the geoJSONString so if it changes in the data base it also changes here
var geoJSONString = '[{"type":"FeatureCollection","features":[{"type":"Feature","geometry":{"type":"Point","coordinates":[-0.13464,51.52427]},"properties":{"question":"Which is the architecture style of the Cruciform building?","choice1":"Victorian","choice2":"Tudor","choice3":"Queen Ann","choice4":"Eduardian","correct_choice":"choice 1"}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-0.132126,51.522647]},"properties":{"question":"Which is the architecture style of the Waterstone bookstore building?","choice1":"Art Deco","choice2":"Revivalism","choice3":"Neo Gothic","choice4":"Eduardian","correct_choice":"choice 3"}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-0.130991,51.523339]},"properties":{"question":"The Church of Christ the King, built in 1854?","choice1":"Neo Clasical","choice2":"Neo Gothic","choice3":"Beaux Arts","choice4":"Romanesque","correct_choice":"choice 2"}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-0.05529,51.545476]},"properties":{"question":"The Empire Theatre, which was built on 1901?","choice1":"Tudor","choice2":"Neo Gothic","choice3":"Victorian Barroque","choice4":"Romanesque","correct_choice":"choice 3"}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-0.055351,51.544755]},"properties":{"question":"Which is the architecture style of the Hackney Picturehouse?","choice1":"Romanesque","choice2":"Classical","choice3":"Bizantine","choice4":"Renaissance","correct_choice":"choice 2"}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-0.05527,51.545173]},"properties":{"question":"The Kreative House building, built in 1910","choice1":"Queen Ann","choice2":"Art Deco","choice3":"Eclectic Eduardian","choice4":"Victorian","correct_choice":"choice 3"}}]}]';
function processGeoJSON() {

	// convert the string of downloaded data to JSON
	var geoJSON = JSON.parse(geoJSONString);
	alert(geoJSON[0].type);
	for (var i = 0; i < geoJSON[0].features.length; i++) {
		var feature = geoJSON[0].features[i];
		for (component in feature) {
			if (component == "geometry") { // this is the geometry
				for (geometry in feature[component]) {
					attribute = "geometry " + feature[component][geometry];
					document.getElementById("loopresults").innerHTML = document.getElementById("loopresults").innerHTML + " || " + attribute;
				}
			}
			if (component == "properties") { // these are the attributes
				for (property in feature[component]) {
					attribute = "property " + feature[component][property];
					document.getElementById("loopresults").innerHTML = document.getElementById("loopresults").innerHTML + " || " + attribute;
				}
			}
			document.getElementById("loopresults").innerHTML = document.getElementById("loopresults").innerHTML + " <br> ";
		}
	}
}


// code to track the user location
var position_marker

function trackLocation() {
	if (navigator.geolocation) {
		navigator.geolocation.watchPosition(showPosition);
		navigator.geolocation.getCurrentPosition(getDistanceFromPoint);
	} else {
		document.getElementById('showLocation').innerHTML = "Geolocation is not supported by this browser.";
	}
}

function showPosition(position) {
	if (position_marker) {
		mymap.removeLayer(position_marker);
	}
	position_marker = L.circleMarker([position.coords.latitude, position.coords.longitude], { radius: 4 }).addTo(mymap);
	mymap.setView([position.coords.latitude, position.coords.longitude], 25);
}

/* // get distance from a fixed point
function getDistanceFromPoint(position){
	//find the coordinates of a point to test using this website: https://itouchmap.com/latlong.html
	// these are the coordinates of my building's garden
	var lat = 51.557102 
	var lng = -0.113329
	// returns the distance in kilometers
	var distance = calculateDistance(position.coords.latitude, position.coords.longitude, lat,lng, 'K');
	document.getElementById('showDistance').innerHTML = "Distance: " + distance;
	
	var alertRadius = 0.06
	/* // code to create a proximity alert, first attempt --> it doesn't work
		if (distance < 0.06) {
			position_marker.bindPopup("</b>the distance is less than 0.06<br/>and alternatives.");
		} else {
			position_marker.bindPopup("</b>the distance is higher than 0.06<br/>and alternatives.");
		} */

// code to create a proximity alert, 2nd attempt 
// --> it's working but we need an interactive popup that promts the correspondent question
//if (distance < alertRadius) {
//alert("you are close to a point of interest!!!!");
/* var popup = L.popup()
.setLatLng(51.557102 -0.113329)
.setContent('<p>menor!<br />posible respuesta 1.</p>')
.openOn(mymap);
} else { 
alert("You are not close yet to a point of interest!!!!");
/* L.popup()
.setLatLng(51.557102 -0.113329)
.setContent('<p>mayor!<br />posible respuesta 1.</p>')
.openOn(mymap);
}	
}
 */

// get distance from a the question points in the database (returns the distance in kilometers)
function getDistanceFromPoint(position) {
	// Fetch data here
	//console.log(getQuestions());

	getQuestionsV2('GET', 'http://developer.cege.ucl.ac.uk:30293/getQuestions')
		.then(function (data) {
			var responseJSON = JSON.parse(data.target.response);
			// Get the geometries
			// console.log(JSON.stringify(responseJSON));
			var listCoordinates = responseJSON[0]["features"].map(function(feature) {
				var featureCoordinate = feature["geometry"]["coordinates"];
				var featureLat = featureCoordinate[1];
				var featureLng = featureCoordinate[0]
				return {
					lat: featureLat,
					lon: featureLng
				}
			});

			// Get the questions
			var listQuestions = responseJSON[0]["features"].map(function(feature) {
				var featureQuestion = feature["properties"]["question"];
				return {
					questionpoint: featureQuestion,
				}
			});

			console.log(listCoordinates);
			console.log(listQuestions[3]); // the index refers to the property index so this print in the console the question num 4
			// Move the other part here
			// var listCoords = [{ lat: 51.52445, lon: -0.13412 }, { lat: 51.52422, lon: -0.13435 }, { lat: 51.52479, lon: -0.13213 }, { lat: 51.52379, lon: -0.13417 }];
			// var listCoords = listCoordinates;
			var alertRadius = 10;
			var minDistance = null;
			var j = null;
			console.log("User location: ", {lat: position.coords.latitude, lng: position.coords.longitude });

			for (var i = 0; i < listCoordinates.length; i++) {
				var distance = calculateDistance(position.coords.latitude, position.coords.longitude, listCoordinates[i].lat, listCoordinates[i].lon, 'K');
				document.getElementById('showDistance').innerHTML = "Distance: " + distance;
				if (distance <= alertRadius && (minDistance == null || distance < minDistance)) {
					minDistance = distance;
					j = i;
				}
			}
			// code to create a proximity alert print the question and choises asociated to the point where the user is near to
			if (j != null) {
				alert("You are near to an interesting building! go to the bottom to answer which is its architecture style");
				document.getElementById("nearQuestion").innerHTML = listQuestions[i];
				
			} else if (j == null) {
				alert("You are not close yet to a buildings in this game; press show buildings to see where to go!");
			}
			
 
			
		})
		.catch(function (error) {
			console.log(error.message);
		});
}

// code adapted from https://www.htmlgoodies.com/beyond/javascript/calculate-the-distance-between-two-points-inyour-web-apps.html
function calculateDistance(lat1, lon1, lat2, lon2, unit) {
	var radlat1 = Math.PI * lat1 / 180;
	var radlat2 = Math.PI * lat2 / 180;
	var radlon1 = Math.PI * lon1 / 180;
	var radlon2 = Math.PI * lon2 / 180;
	var theta = lon1 - lon2;
	var radtheta = Math.PI * theta / 180;
	var subAngle = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
	subAngle = Math.acos(subAngle);
	subAngle = subAngle * 180 / Math.PI; // convert the degree value returned by acos back to degrees from radians
	dist = (subAngle / 360) * 2 * Math.PI * 3956; // ((subtended angle in degrees)/360) * 2 * pi * radius )
	// where radius of the earth is 3956 miles
	if (unit == "K") { dist = dist * 1.609344; }  // convert miles to km
	if (unit == "N") { dist = dist * 0.8684; }    // convert miles to nautical miles
	return dist;
}

//////////////

var xhr; // define the global variable to process the AJAX request
function callDivChange() {
	xhr = new XMLHttpRequest();
	var filename = document.getElementById("filename").value;
	xhr.open("GET", filename, true);
	xhr.onreadystatechange = processDivChange;
	try {
		xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	}
	catch (e) {
		// this only works in internet explorer
	}
	xhr.send();
}

function processDivChange() {
	if (xhr.readyState < 4) // while waiting response from server
		document.getElementById('ajaxtest').innerHTML = "Loading...";
	else if (xhr.readyState === 4) { // 4 = Response from server has been completely loaded.
		if (xhr.status == 200 && xhr.status < 300)// http status between 200 to 299 are all successful
			document.getElementById('ajaxtest').innerHTML = xhr.responseText;
	}
}

// NOTE: For testing try http://developer.cege.ucl.ac.uk:31293/
// It's also neccesary to run httpServer.js, server.js and phonegap serve (unless is already deployed as a standalone app)