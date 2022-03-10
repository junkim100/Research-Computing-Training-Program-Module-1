/**
 * Request json data from the back-end API. This function is used to read data from the API. To update data in the API, use post().
 * @param {string} url - The url of the API plus the API path.
 * @returns {Promise<Response>} - A Promise of the Response.
 * @example
 * get("https://example.com/myUserName").then(function(response){
 *   //Put all code that relies on the data from this request in here.
 *
 *   if(response.status == 200){
 *     const username = response.data.id; //The username that was requested. In this case it is "myUserName".
 *     const score = response.data.score; //The user's current score.
 *   }
 *   else{
 *     //User "myUserName" not found.
 *     //response.data is null
 *     post("https://example.com/myUserName", { score: 0 }); //create a new user.
 *   }
 * });
 */
 function get(url) {
  console.log("In get()");

  return new Promise((resolve, reject) => {
    const http = new XMLHttpRequest();
    http.onload = function() {
      resolve({ status: http.status, data: JSON.parse(http.responseText) });
    };
    http.open("GET", url);
    http.send();
  });
}



/**
 * Send data to the back-end API.
 * @param {string} url - The url of the API plus the API path.
 * @param {object} data - The data to send.
 * @returns {Promise<Response>} - A Promise of the Response.
 * @example
 * const dataToSend = { score: 5 };
 * post("https://example.com/myUserName", dataToSend).then(function(response){
 *   switch(response.status){
 *     case 200:
 *       //User was updated successfully.
 *       //response.data will be the same as returned by get(), and should contain the updated data.
 *       const score = response.data.score;
 *       break;
 *     case 201:
 *       //A new user was successfully created. Otherwise same as status 200.
 *       const score = response.data.score;
 *       break;
 *     case 400:
 *       //Bad request. Most likely your data that you sent (in this case dataToSend) was formatted incorrectly, or you supplied a negative score value.
 *       //response.data will be: { Error: "error message" }
 *       console.error(response.data);
 *       break;
 *     case 500:
 *       //Something went wrong on the server, such as the database got deleted somehow. This should never happen.
 *       //response.data will be the same as status 400.
 *       console.error(response.data);
 *       break;
 *   }
 * });
 */
function post(url, data) {
  console.log("In post()", data);

  data = JSON.stringify(data);
  return new Promise((resolve, reject) => {
    const http = new XMLHttpRequest();
    http.onload = function() {
      resolve({ status: http.status, data: JSON.parse(http.response) });
    };
    http.open("POST", url);
    //Make sure that the server knows we're sending it json data.
    http.setRequestHeader("Content-Type", "application/json");
    console.log(data);
    http.send(data);
  });
}



/**
 * @typedef {{id: string, score: number}} User
 */

/**
 * @typedef {{Error: string}} Error
 */

/**
 * @typedef {{status: number, data: User|Error}} Response
 */



/**
 * Used by login.html's submit button
 * User input gets posted to the server using the API
 */
function sendData() {
  console.log("In sendData()");

  const user = String(document.getElementById("username").value);
  const dataToSend = { id: user};
  const url = "http://basic-web.dev.avc.web.usf.edu/".concat(user);

  post(url ,dataToSend).then(function(response){
    switch(response.status) {
      case 200: // User successfully updated
        console.log("case 200");
        break;
      case 201: // User successfully created
        console.log("case 201");
        break;
      case 400: // Invalid request
        console.log("case 400");
        console.error(response.data);
        break;
      case 500: // Internal server error
        console.log("case 500");
        console.error(response.data);
        break;
    }
  });
}



/**
 * Used by fizzbuzz.html on page load
 * Get user id and score from API then display it using display()
 */
function welcomeUser() {
  console.log("In welcomeUser()");

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const user = urlParams.get("name");
  const url = "http://basic-web.dev.avc.web.usf.edu/".concat(user);
  console.log(url);

  get(url).then(function(response){

    if(response.status == 200) {
      console.log("case 200");

      const id = String(response.data.id); // User's id recieved from API
      const score = parseInt(response.data.score); // User's score recieved from API
      display (id, score);

      const dataArr = [id, score];

      // Set value of increment button to response.data
      // The response is getting passed into fizzbuzz() as an argument
      document.getElementById("increment").setAttribute("value", dataArr);

      document.getElementById("realValue").innerHTML = score;
    }
    // User does not exist
    else {
      console.log("case 404");

      // Create new user with score 0
      post(url, { id: user, score: 0 });

      // Reload fizzbuzz.html after creating new user so that the user information is displayed
      // window.location.assign("fizzbuzz.html");

      document.getElementById("welcome").innerHTML = "User created. Go back to the previous page and enter username again. "
    }
  });

}


/**
 * Displays user's id and score into HTML
 */
function display(id, score) {
  let message = "Welcome ".concat(id);
  document.getElementById("welcome").innerHTML = message;
  document.getElementById("displayValue").innerHTML = score;
}


/**
 * Used by fizzbuzz.html's increment button
 * User score gets posted to the server using the API
 */
function fizzbuzz(dataArr) {
  console.log("In fizzbuzz()");
  console.log("User: ", dataArr);
  let displayValue, realValue = parseInt(document.getElementById("realValue").textContent);
  realValue += 1;
  document.getElementById("realValue").innerHTML = String(realValue);

  if (realValue%3 == 0 && realValue%5 == 0) // Divisible by 15
    displayValue = "FizzBuzz";
  else if (realValue%3 == 0) // Divisible by 3
    displayValue = "Fizz";
  else if (realValue%5 == 0) // Divisible by 5
    displayValue = "Buzz";
  else
    displayValue = String(realValue);

  document.getElementById("displayValue").innerHTML = displayValue;

  console.log(realValue);
  console.log(displayValue);

  dataArr = String(dataArr);
  const arr = dataArr.split(",");
  console.log("arr", arr);
  dataToSend = { id: String(arr[0]), score: parseInt(arr[1]) }
  const url = "http://basic-web.dev.avc.web.usf.edu/".concat(dataToSend.id);
  console.log("dataToSend: ", dataToSend);
  console.log("url: ", url);

  post(url ,dataToSend).then(function(response){
    switch(response.status) {
      case 200: // User successfully updated
        console.log("case 200");
        break;
      case 201: // User successfully created
        console.log("case 201");
        break;
      case 400: // Invalid request
        console.log("case 400");
        console.error(response.data);
        break;
      case 500: // Internal server error
        console.log("case 500");
        console.error(response.data);
        break;
    }
  });
  console.log("type", typeof dataToSend.score)

  const newDataArr = dataToSend.id.concat(",").concat(dataToSend.score+1);
  console.log("newDataArr: ", newDataArr);

  document.getElementById("increment").setAttribute("value", newDataArr);
  // console.log("fuck", document.getElementById("increment").value)

}
