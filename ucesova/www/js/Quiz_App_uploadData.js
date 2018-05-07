//Code to upload the user answers into a table called "answers" in the database, among with the corresponding question.

// Method to create a pair/value string that is going to be used as parameter of the function that sends the data to the database
function saveUserAnswer() {
	alert ("saving your answer");

	// Create a variable to store the question that is going to be answered so we can then insert it into the name/value pair string that it's going to be sended to the database
	var question = document.getElementById("nearQuestion").innerHTML; 

	//create a name/value pair string as parameters for the URL to send values to the server initializing it with the question
	var postString = "question=" + question;

	// now get the user's answer and add it to the string
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
	
	// calling the processData function using the postString we just created as parameter
	processData(postString);
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
    document.getElementById("saveAnswer").innerHTML = client.responseText;
    }
}