function saveUserAnswer() {
	alert ("saving your answer"); // the alert is working when the function is empty but not when using the below code

	var question = document.getElementById("nearQuestion").innerHTML; //The innerHTML property sets or returns the HTML content (inner HTML) of an element.
	// var phoneid = device.uuid; //based on http://docs.phonegap.com/en/3.0.0/cordova_device_device.md.html#device.uuid --> error: the device is not defined
	
	//alert(question);

	//create a name/value pair string as parameters for the URL to send values to the server
	var postString = "question=" + question;

	// now get the user's answer --> these are working
	if (document.getElementById("choice1selected").checked) {
 		 postString = postString + "&users_answer=choice 1";
	}
	if (document.getElementById("choice2selected").checked) {
 		 postString = postString + "&users_answer=choice 2";
	}
	if (document.getElementById("choice3selected").checked) {
 		 postString = postString + "&users_answer=choice 3";
	}
	if (document.getElementById("choice4selected").checked) {
 		 postString = postString +"&users_answer=choice 4";
	}

	processData(postString);
	
	//alert(postString);
}

//Adding an AJAX call and response method
var client;

function processData(postString) {
   client = new XMLHttpRequest();
   //client.open('POST','https://developer.cege.ucl.ac.uk:31093/Quiz_App_uploadData',true);    // when using on https
   client.open('POST','http://developer.cege.ucl.ac.uk:30293/Quiz_App_uploadData',true);     // when using on http
   client.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
   client.onreadystatechange = answerSaved;  
   client.send(postString);
}
// create the code to wait for the response from the data server, and process the response once it is received
function answerSaved() {
  // this function listens out for the server to say that the data is ready - i.e. has state 4
  if (client.readyState == 4) {
    // change the DIV to show the response
    document.getElementById("saveAnswer").innerHTML = client.responseText; //this is working but is saving something different
    }
}