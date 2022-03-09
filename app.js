/**
 * Used by login.html's submit button
 * User input gets posted to the server using the API
 */

function loadNextPage() {
  console.log("In loadNextPage()");

  const user = String(document.getElementById("username").value);
  const dataToSend = { id: user, score: 0};
  console.log(dataToSend);

  const url = "http://basic-web.dev.avc.web.usf.edu/".concat(user);
  console.log(url);

  post(url ,dataToSend).then(function(response){
    switch(response.status) {
      case 200: // User successfully updated.
        console.log("case 200");
        break;
      case 201: // User successfully created.
        console.log("case 201");
        break;
      case 400: // Invalid request.
        console.log("case 400");
        console.error(response.data);
        break;
      case 500: // Internal server error.
        console.log("case 500");
        console.error(response.data);
        break;
    }
  });

  window.location.assign("fizzbuzz.html");

}

  function welcomeUser() {
    console.log("In welcomeUser()");

    // let url = "http://basic-web.dev.avc.web.usf.edu/".concat(user);

    get("http://basic-web.dev.avc.web.usf.edu/ad").then(function(response){
      console.log(response);
      if(response.status == 200) {
        console.log("case 200");
        const username = String(response.data.id); //The username that was requested. In this case it is "myUserName".
        const score = parseInt(response.data.score); //The user's current score.
        console.log(username, score);
        display (username, score);
        document.getElementById("realValue").innerHTML = score;
      }
      else {
        //User "myUserName" not found.
        //response.data is null
        post("http://basic-web.dev.avc.web.usf.edu", { id: response.data.id, score: 0 }); //create a new user.
      }
    });

  }

  function display(username, score) {
    let message = "Welcome ".concat(username);
    document.getElementById("welcome").innerHTML = message;
    document.getElementById("displayValue").innerHTML = score;
  }

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
        console.log(http);
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
    console.log("In post()");

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

function fizzbuzz() {
  let realValue = parseInt(document.getElementById("realValue").textContent);
  console.log("realvalue");console.log(realValue);
  realValue += 1;
  document.getElementById("realValue").innerHTML = String(realValue);

  let displayValue ="";

  if (realValue%3 == 0 && realValue%5 == 0) {
    displayValue = "FizzBuzz";
  }
  else if (realValue%3 == 0) {
    displayValue = "Fizz";
  }
  else if (realValue%5 == 0) {
    displayValue = "Buzz";
  }
  else {
    displayValue = String(realValue);
  }

  console.log(realValue);
  console.log(displayValue);

  document.getElementById("displayValue").innerHTML = displayValue;
}
