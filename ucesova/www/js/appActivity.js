
// load a map
var mymap = L.map('mapid').setView([51.505, -0.09], 13);
		
// load the tiles
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw',{
maxZoom:18,
attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' + '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' + 'Imagery © <a href="http://mapbox.com">Mapbox</a>',
id: 'mapbox.streets'
}).addTo(mymap);
		
// create a variable that will hold the XMLHttpRequest() - this must be done outside a function so that all the functions can use the same variable
var client; 

// get the questions points from the database using an XMLHttpRequest

var POIlayer; // variable that will hold the layer itself – we need to do this outside the function so that we can use it to remove the layer later on

function getPOI() {
	client = new XMLHttpRequest();
	client.open('GET','http://developer.cege.ucl.ac.uk:30293/getGeoJSON/questions/geom'); // when using http
	//client.open('GET','https://developer.cege.ucl.ac.uk:31093/getGeoJSON/questions/geom'); //when using https
	client.onreadystatechange = POIResponse;  
	client.send();
}
// create the code to wait for the response from the data server, and process the response once it is received
var geoJSONString; // this s needed as a global variable
var listCoordinates;
var listQuestions;
var listChoice1;
var listChoice2;
var listChoice3;
var listChoice4;
var listCorrectChoice;

function POIResponse() {
// this function listens out for the server to say that the data is ready - i.e. has state 4
	if (client.readyState == 4) {
		// once the data is ready, process the data
		var POIdata = client.responseText;
		geoJSONString = client.responseText;
		loadPOIlayer(POIdata); // this code make POIdata available to be used by loadPOIlayer function
	}
		
	var responseJSON = JSON.parse(POIdata);
	
	// Get the geometries
	listCoordinates = responseJSON[0]["features"].map(function(feature) {
		var featureCoordinate = feature["geometry"]["coordinates"];
		var featureLat = featureCoordinate[1];
		var featureLng = featureCoordinate[0]
		return {
			lat: featureLat,
			lon: featureLng
		}
	});
		
	// Get the properties (questions, choices or correct choice)
	listQuestions = responseJSON[0]["features"].map(function(feature) {
		var featureQuestion = feature["properties"]["question"];
		return {
			questionpoint: featureQuestion,
		}
	});	
	
	listChoice1 = responseJSON[0]["features"].map(function(feature) {
		var featureChoice1 = feature["properties"]["choice1"];
		return {
			questionChoice1: featureChoice1,
		}
	});	
	
	listChoice2 = responseJSON[0]["features"].map(function(feature) {
		var featureChoice2 = feature["properties"]["choice2"];
		return {
			questionChoice2: featureChoice2,
		}
	});	
	
	listChoice3 = responseJSON[0]["features"].map(function(feature) {
		var featureChoice3 = feature["properties"]["choice3"];
		return {
			questionChoice3: featureChoice3,
		}
	});	
	
	listChoice4 = responseJSON[0]["features"].map(function(feature) {
		var featureChoice4 = feature["properties"]["choice4"];
		return {
			questionChoice4: featureChoice4,
		}
	});
	
	listCorrectChoice = responseJSON[0]["features"].map(function(feature) {
		var featureCorrectChoice = feature["properties"]["correct_choice"];
		return {
			questionCorrectChoice: featureCorrectChoice,
		}
	});
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
	if (position_marker){
		mymap.removeLayer(position_marker);
	}
	position_marker = L.circleMarker([position.coords.latitude, position.coords.longitude], {radius: 4}).addTo(mymap);
	mymap.setView([position.coords.latitude, position.coords.longitude], 25);
	// get distance between the user's location and the questions in the database(returns the distance in kilometers)
	var alertRadius = 0.015; // 15 meters
	var j = null;
	for(var i = 0; i < listCoordinates.length; i++) {
		var distance = calculateDistance(position.coords.latitude, position.coords.longitude, listCoordinates[i].lat,listCoordinates[i].lon, 'K');
		document.getElementById('showDistance').innerHTML = "Distance: " + distance; // this is making problems because that div can't be removed from the html
		if (distance<= alertRadius){
			j=i;
		}
	}
	// code to create a proximity alert
	if (j!= null) {
		alert("You are close to an interesting building! See a question about it below the map");
		//Print the corresponding question and choices in the html
		document.getElementById('nearQuestion').innerHTML = listQuestions[j].questionpoint;
		document.getElementById('choice1').innerHTML = listChoice1[j].questionChoice1;
		document.getElementById('choice2').innerHTML = listChoice2[j].questionChoice2;
		document.getElementById('choice3').innerHTML = listChoice3[j].questionChoice3;
		document.getElementById('choice4').innerHTML = listChoice4[j].questionChoice4;
		document.getElementById('correct').innerHTML = listChoice4[j].questionCorrectChoice; // this one is not working
		
	} 
	//else if (j== null) { 
		//alert("you are not yet close enough to an interesting building. Click on 'Show buildings of interest' to see where to go!");
}

/* function getDistance() {
	alert('getting distance');
	// getDistancefromPoint is the function called once the distance has been found
	navigator.geolocation.getCurrentPosition(getDistanceFromPoint);
} */
		
/* // get distance between the user's location and the questions in the database(returns the distance in kilometers)
function getDistanceFromPoint(position){
	var alertRadius = 0.01; // 10 meters
	var j = null;
	for(var i = 0; i < listCoordinates.length; i++) {
		var distance = calculateDistance(position.coords.latitude, position.coords.longitude, listCoordinates[i].lat,listCoordinates[i].lon, 'K');
		document.getElementById('showDistance').innerHTML = "Distance: " + distance; // this is making problems because that div can't be removed from the html
		if (distance<= alertRadius){
			j=i;
		}
	}
	// code to create a proximity alert
	if (j!= null) {
		alert("You are close to an interesting building! See a question about it below the map");
		//Print the corresponding question and choices in the html
		document.getElementById('nearQuestion').innerHTML = listQuestions[j].questionpoint;
		document.getElementById('choice1').innerHTML = listChoice1[j].questionChoice1;
		document.getElementById('choice2').innerHTML = listChoice2[j].questionChoice2;
		document.getElementById('choice3').innerHTML = listChoice3[j].questionChoice3;
		document.getElementById('choice4').innerHTML = listChoice4[j].questionChoice4;
		document.getElementById('correct').innerHTML = listChoice4[j].questionCorrectChoice; // this one is not working
		
	} else if (j== null) { 
		alert("you are not yet close enough to an interesting building. Click on 'Show buildings of interest' to see where to go!");
	}		
} */

// code to show the correct answer (which previously is just hide)
// based on https://www.w3schools.com/howto/howto_js_toggle_hide_show.asp
function showCorrect() {
    var x = document.getElementById("correct");
    if (x.style.display === "none") {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }
}

// code adapted from https://www.htmlgoodies.com/beyond/javascript/calculate-the-distance-between-two-points-inyour-web-apps.html
function calculateDistance(lat1, lon1, lat2, lon2, unit) {
	var radlat1 = Math.PI * lat1/180;
	var radlat2 = Math.PI * lat2/180;
	var radlon1 = Math.PI * lon1/180;
	var radlon2 = Math.PI * lon2/180;
	var theta = lon1-lon2;
	var radtheta = Math.PI * theta/180;
	var subAngle = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
	subAngle = Math.acos(subAngle);
	subAngle = subAngle * 180/Math.PI; // convert the degree value returned by acos back to degrees from radians
	dist = (subAngle/360) * 2 * Math.PI * 3956; // ((subtended angle in degrees)/360) * 2 * pi * radius )
                                             // where radius of the earth is 3956 miles
	if (unit=="K") { dist = dist * 1.609344 ;}  // convert miles to km
	if (unit=="N") { dist = dist * 0.8684 ;}    // convert miles to nautical miles
	return dist;
}

function startGame() {
    getPOI();
    trackLocation();
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
// It's also neccesary to run httpServer.js, server.js and phonegap serve (if not deployed as a stand-alone app)

// To test in https go to https://developer.cege.ucl.ac.uk:31093/testApp/test.html running httpsServer inside Server