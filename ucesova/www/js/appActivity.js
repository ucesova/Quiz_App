
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
var questionsData;
	
// get the questions points from the database using an XMLHttpRequest

var POIlayer; // variable that will hold the layer itself – we need to do this outside the function so that we can use it to remove the layer later on

function getPOI() {
	client = new XMLHttpRequest();
	client.open('GET','http://developer.cege.ucl.ac.uk:30293/getGeoJSON/questions/geom');
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


/* 

function getQuestions(){
	client = new XMLHttpRequest();
	client.open('GET','http://developer.cege.ucl.ac.uk:30293/getQuestions');
	client.onreadystatechange = questionsResponse; 
	client.send();
} */

/* function questionsResponse(){
	if(client.readyState == 4){
		var questionsData = client.responseText;
		loadQuestionsLayer(questionsData);
	}
}

// convert the received data - which is text - to JSON format
function loadQuestionsLayer(questionsData){
	
	// convert the text to JSON
	var questionsJSON = JSON.parse(questionsData);	
} */

//process the geoJSON (based on practical 6's appendix)

	// get the questions with all its properties from the database
// based on https://www.w3schools.com/js/tryit.asp?filename=tryjson_ajax
/* var Questions = new XMLHttpRequest();
getQuestions.onreadystatechange = function(){
	if (this.readyState == 4 && this.status == 200) {
		var myArr = JSON.parse(this.responseText);
		document.getElementById("loopresults").innerHTML = myArr[1];
	}
}
getQuestions.open('GET','http://developer.cege.ucl.ac.uk:30293/getQuestions', true);
getQuestions.send();
 */

 
 
function processGeoJSON() {
	
	// convert the string of downloaded data to JSON
	var geoJSONString = 
	var geoJSON = JSON.parse(geoJSONString);
	alert(geoJSON[0].type);
	for(var i = 0; i < geoJSON[0].features.length; i++) {
		var feature = geoJSON[0].features[i];
		for ( component in feature){
			if (component == "geometry") { // this is the geometry
				for (geometry in feature[component]){attribute = "geometry " + feature[component][geometry];
					document.getElementById("loopresults").innerHTML = document.getElementById("loopresults").innerHTML + " || " +attribute;
				}
			}
			if (component == "properties") { // these are the attributes
				for (property in feature[component]) {
					attribute = "property " + feature[component][property];
					document.getElementById("loopresults").innerHTML = document.getElementById("loopresults").innerHTML + " || " +attribute;
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
	if (position_marker){
		mymap.removeLayer(position_marker);
	}
	position_marker = L.circleMarker([position.coords.latitude, position.coords.longitude], {radius: 4}).addTo(mymap);
	mymap.setView([position.coords.latitude, position.coords.longitude], 25);
}

// get distance from a fixed list of points (returns the distance in kilometers) --> but actually we need to get it from the points in the database
function getDistanceFromPoint(position){
	var listCoords = [{lat:51.52445, lon:-0.13412},{lat:51.52422, lon: -0.13435},{lat:51.52479, lon:-0.13213},{lat:51.52379, lon:-0.13417}];
	var alertRadius = 0.4;
    var minDistance = null;
	var j = null;
	for(var i = 0; i < listCoords.length; i++) {
		var distance = calculateDistance(position.coords.latitude, position.coords.longitude, listCoords[i].lat,listCoords[i].lon, 'K');
		document.getElementById('showDistance').innerHTML = "Distance: " + distance;
		if (distance<= alertRadius&&(minDistance==null||distance<minDistance)){
			minDistance=distance;
			j=i;
		}
	}
	// code to create a proximity alert
	if (j!= null) {
		alert("Alright lets play!");

	} else if (j== null) { 
		alert("But you are far from our game; press show points to see where to go!");
	}	
}




/* // calculate the distance first version
	var distance = calculateDistance(position.coords.latitude, position.coords.longitude, lat,lng, 'K');
	document.getElementById('showDistance').innerHTML = "Distance: " + distance;
	
	var alertRadius = 0.06
	// code to create a proximity alert, First version (anyway 
		if (distance < 0.06) {
			position_marker.bindPopup("</b>la distancia es menor a 0.06<br/>and alternatives.");
		} else {
			position_marker.bindPopup("</b>la distancia es mayor a 0.06<br/>and alternatives.");
		}
	 */
// get distance between current position and the questions' points
/* var questionPopUp

function getDistanceFromPoint(position){
	for (i in 
	var distance = calculateDistance (position.coords.latitude, position.coords.longitude, feature.geometry.coordinates[0], feature.geometry.coordinates[1], 'K');
	var alertRadius = 0.06
	if (distance < alertRadius) {
		questionPopUp = L.marker(feature.geometry.coordinates[0], feature.geometry.coordinates[1]
	}  */
/* /* // code to create a proximity alert 2do intento
	if (distance < alertRadius) {
		alert("you are close to a point of interest!!!!"); // but we need an interactive pop up
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
} */
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
	
	