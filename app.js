/**
 * Used by login.html's submit button
 * User input gets posted to the server using the API
 */

function loadNextPage() {
  console.log("In loadNextPage()");

  const user = document.getElementById("username").value;
  const dataToSend = { id: user, score: 0};
  console.log(dataToSend);

  post("http://basic-web.dev.avc.web.usf.edu/:",dataToSend).then(function(response){
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
  
  get("http://basic-web.dev.avc.web.usf.edu/:a").then(function(response) {
      console.log("test1");

      switch(response.status) {
        case 200: // User successfully recieved.
          console.log("case 200");
          const id = response.data.id;
          const score = response.data.score;
          console.log(response.data.id);
          console.log(id);
          break;
        case 404: // User does not exist.
          console.log("case 404");
          post("http://basic-web.dev.avc.web.usf.edu/:", { id: "John Doe", score: 0 }); //create a new user.
          break;
      }

    }
  );
}

function display(id, score) {
  console.log(id, score);
  let message = "Welcome ".concat(id);
  document.getElementById("welcome").innerHTML = message;
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
      console.log("test2");
      http.onload = function() {
        console.log("Exiting get()");
        resolve({ status: http.status, data: JSON.parse(http.response) });
      };
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
    data = JSON.stringify(data);
    return new Promise((resolve, reject) => {
      const http = new XMLHttpRequest();
      http.onload = function() {
        resolve({ status: http.status, data: JSON.parse(http.response) });
      };
      http.open("POST", url);
      //Make sure that the server knows we're sending it json data.
      http.setRequestHeader("Content-Type", "application/json");
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