var maindata;
var instituteData = {
  id: "",
  email: "",
  number: "",
  address: "",
  picture: "",
  googleId: "",
  verified: "",
  loginDate: "",
  newInstitute: true,
  instituteName: ""
};

// Developer - Nimit Shah
// Developed on - 26/07/2025
// Description - Use to initialize authentication page on load of page
// Updated on - -
// Input - none
async function connectedCallback() {
  try {
    showSpinner("Checking user...");
    await getEnglishJsonFile("../en_properties.json");
    Userlogo();
    if (localStorage.getItem("instituteUserData") == null) {
      document.getElementById("google-button").style.display = "block";
    } else {
      let curData = JSON.parse(localStorage.getItem("instituteUserData"));
      apiURL = enProperties.apiURL + enProperties.apiEndPoints.institute + `?googleId=${curData.googleId} `;
      let responsedata = await apiCallOuts(apiURL, "GET", null, 6000);
      console.log(responsedata);

      if (responsedata.institute != null) {
        setData(responsedata.institute);
        setIcons(responsedata);
      } else {
        document.getElementById("welcome-sign").innerText = "Sign In";
        document.getElementById("validation-box-body-signin").style.display = "none";
        document.getElementById("google-button").style.display = "flex";
      }
    }

    // Notification
    getNotification();
    if (window.location.href.includes("#")) {
      SignedIn();
    }
  } catch (error) {
    stopSpinner();
  }
}

// Developer - Nimit Shah
// Developed on - 21/12/2024
// Description - Use to open google authentication page
// Updated on - -
// Input - none
async function googleSignin() {
  try {
    let oauth2Endpoint = "https://accounts.google.com/o/oauth2/v2/auth";

    let form = document.createElement("form");
    form.setAttribute("method", "GET");
    form.setAttribute("action", oauth2Endpoint);

    let params = {
      client_id:
        "960583894295-h50j910bdioqrmlrargqs6hust6in4ap.apps.googleusercontent.com",
      redirect_uri: `${await getFilePaths("institute")}`,
      response_type: "token",
      scope:
        "https://www.googleapis.com/auth/userinfo.profile  https://www.googleapis.com/auth/userinfo.email",
      include_granted_scope: "true",
      state: "pass-through-value",
    };

    for (var p in params) {
      let input = document.createElement("input");
      input.setAttribute("type", "hidden");
      input.setAttribute("name", p);
      input.setAttribute("value", params[p]);
      form.appendChild(input);
    }

    document.body.appendChild(form);
    form.submit();
  } catch (error) {
    createToast("error", "Error while signin : " + error.message);
  }
}

// Developer - Nimit Shah
// Developed on - 21/12/2024
// Description - Use to verify that user have google signed in or not and also user is available in DB or not
// Updated on - -
// Input - none
async function SignedIn() {
  try {
    let access_token = "";
    let params = {};
    let regex = /([^&=]+)=([^&]*)/g,
      m;

    while ((m = regex.exec(location.href))) {
      params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
    }

    let info = JSON.parse(JSON.stringify(params));
    access_token = info["access_token"];
    localStorage.setItem("instituteAuthInfo", info["access_token"]);
    dynamicUrl = await getFilePaths("institute");
    window.history.pushState({}, document.title, dynamicUrl);

    if (access_token != "") {
      fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: {
          Authorization: `Bearer ${access_token} `,
        },
      })
        .then((data) => {
          if (!data.ok) {
            localStorage.removeItem("instituteAuthInfo");
            localStorage.removeItem("instituteUserData");
            throw new Error(data.status + " " + data.statusText);
          }
          return data.json();
        })
        .then(async (info) => {
          info.googleId = info.sub;
          info.id = "";
          delete info.sub;
          dynamicUrl = await getFilePaths("index");
          if (info) {
            instituteData.googleId = info.googleId;
            console.log(info);

            instituteData.email = info.email;
            instituteData.picture = info.picture
            fetchUser(info.googleId);
          }
        });
    }
  } catch (error) {
    console.error(error);
  }
}

// Developer - Nimit Shah
// Developed on - 21/12/2024
// Description - Use to Signout user
// Updated on - -
// Input - event
async function Signout(event) {
  try {
    if (event.target.id == "yes") {
      let access_token = localStorage.getItem("instituteAuthInfo");
      fetch("https://oauth2.googleapis.com/revoke?token=" + access_token, {
        method: "POST",
        headers: {
          "Content-type": "application/x-www-form-urlencoded",
        },
      }).then(async () => {
        localStorage.removeItem("instituteAuthInfo");
        localStorage.removeItem("instituteUserData");
        dynamicUrl = await getFilePaths("index");
        window.location.href = dynamicUrl;
      });
    } else {
      dynamicUrl = await getFilePaths("institute");
      window.location.href = dynamicUrl;
    }
  } catch (error) {
    console.error(error);
  }
}

// Developer - Nimit Shah
// Developed on - 21/12/2024
// Description - Use to show signout page
// Updated on - -
// Input - none
function showSignout() {
  try {
    document.getElementById("validation-box-signin").style.display = "none";
    document.getElementById("body_section").className = "signout-body-section";
    document.getElementById("validation-box-notification").style.display =
      "none";
    document.getElementById("validation-box-signout").style.display = "block";
    Array.from(document.getElementsByClassName("button")).forEach((element) => {
      element.style.display = "block";
    });
  } catch (error) {
    console.error(error);
  }
}

// Developer - Nimit Shah
// Developed on - 21/12/2024
// Description - Use to check/get user from the DB
// Updated on - -
// Input - id
async function fetchUser(id) {
  try {

    apiURL = enProperties.apiURL + enProperties.apiEndPoints.institute + `?googleId=${id} `;
    showSpinner("Checking user...");
    let responsedata = await apiCallOuts(apiURL, "GET", null, 6000);
    document.getElementById("continue").style.display = "block";
    document.getElementById("google-button").style.display = "none";
    if (responsedata.institute != null) {
      // User is already availabe in DB
      responsedata.institute.newInstitute = false;
      setData(responsedata.institute);
      setIcons(responsedata);
      getNotification();
    } else {
      // New user is sign in
      instituteData.newInstitute = true;
      document.getElementById("continue").innerText = "Save";
      setData(instituteData);
    }
    stopSpinner();
  } catch (error) {
    stopSpinner();
    createToast("error", "Error while user : " + error.message);
  }
}

// Developer - Nimit Shah
// Developed on - 21/12/2024
// Description - Use to update db if user update any details or redirect user to home page
// Updated on - -
// Input - none
async function continueClick() {
  try {
    let instituteName = document.getElementById("instituteName").value;
    let address = document.getElementById("address").value;
    let email = document.getElementById("email").value;
    let number = document.getElementById("number").value;
    privacy = true;

    // Checking for changes in data
    if (instituteName.trim() != "" && address.trim() != "" && number.trim() != "" && privacy) {
      if (instituteData.instituteName != instituteName || instituteData.email != email ||
        instituteData.number != number || instituteData.address != address || instituteData.privacy != privacy) {
        instituteData.instituteName = instituteName;
        instituteData.email = email;
        instituteData.number = number;
        instituteData.address = address;
        instituteData.privacy = privacy;

        setData(instituteData);
        apiURL = enProperties.apiURL + enProperties.apiEndPoints.institute;
        showSpinner("Saving user");

        let method = instituteData.newInstitute ? "POST" : "PUT";

        await apiCallOuts(apiURL, method, JSON.stringify(instituteData), 10000)
          .then(async (data) => {
            console.log(data);
            setData(data);
            dynamicUrl = await getFilePaths("index");
            window.location.href = dynamicUrl;
            stopSpinner();
          })
          .catch((error) => {
            stopSpinner();
            createToast("error", error.message);
          });
      } else {
        localStorage.setItem("instituteUserData", JSON.stringify(instituteData));
        dynamicUrl = (await getFilePaths("index")) + "?signedin=true";
        window.location.href = dynamicUrl;
      }
    } else {
      createToast("error", "Fill require detail");
    }
  } catch (error) {
    stopSpinner();
    console.error(error);
  }
}

// Developer - Nimit Shah
// Developed on - 21/12/2024
// Description - Use to show user login picture on header of every page
// Updated on - -
// Input - none
async function Userlogo() {
  try {
    await setAnchorHref("index");
    await setIframeSrc("spinner");
    if (localStorage.getItem("instituteUserData") != null && document.getElementById("not-log")) {
      document.getElementById("not-log").style.display = "none";
      document.getElementById("login-img").style.display = "block";
      document.getElementById("login-img").setAttribute("src", JSON.parse(localStorage.getItem("instituteUserData")).picture);
    }
  } catch (error) {
    createToast("error", "Error while fetching user data : " + error.message);
  }
}

async function getNotification() {
  try {
    showSpinner("Getting Notification...");
    apiURL = enProperties.apiURL + enProperties.apiEndPoints.notification + `?refId=${instituteData.id}`;
    notificationList = await apiCallOuts(apiURL, "GET", null, 6000);
    setNotification();
    stopSpinner();
  } catch (error) {
    console.log(error);
    createToast("error", "Error while signin : " + error.message);
  }
}

function openNotification(event) {
  try {
    showSpinner("Opening Notification...");

    notificationList.forEach(async (element) => {
      if (event.target.id == element.id) {
        document.getElementById("notification").innerText = element.message;
        if (!element.readed && (element.refId != null || element.refId.trim() != "" || element.refId != undefined)) {
          apiURL = enProperties.apiURL + enProperties.apiEndPoints.notification;
          element.readed = true;
          await apiCallOuts(apiURL, "PUT", JSON.stringify(element), 6000);
          setNotification();
        }
      }
    });
    document.getElementById("notification-popup").style.display = "flex";
    stopSpinner();
  } catch (error) {
    console.error(error);
    stopSpinner();
  }
}

function closeNotification(params) {
  try {
    document.getElementById("notification-popup").style.display = "none";
  } catch (error) { }
}

function setNotification() {
  try {
    if (notificationList.length > 0) {
      let htmldata = "";
      notificationList.forEach((element, index) => {
        let notificationDate = new Date(element.createdDate);
        let year = notificationDate.getFullYear();
        let month = ("0" + (notificationDate.getMonth() + 1)).slice(-2);
        let day = ("0" + notificationDate.getDate()).slice(-2);
        notificationDate = `${year}-${month}-${day}`;
        var classes = "";
        var read = "";
        if (element.readed == false) {
          classes = "bold";
          read = "unread";
        } else {
          classes = "light";
          read = "read";
        }
        if (element.refId == null || element.refId.trim() == "") {
          read = "forAll";
        }
        htmldata += `<div class="data ${classes}" onclick="openNotification(event)" id= ${element.id} > ` + `<div class="${read}"></div>` +
          '<div class="column index" onclick="openNotification(event)" id=' + element.id + ">" + (index + 1) + "</div>" +
          '<div class="column examname" onclick="openNotification(event)" id=' + element.id + ">" + element.message +
          "</div>" +
          '<div class="column date" onclick="openNotification(event)" id=' + element.id + ">" + notificationDate +
          "</div>" + "</div>" + "</div>";
      });
      document.getElementById("table").innerHTML = htmldata;
    } else {
      document.getElementById("table").innerHTML =
        '<span class="no_data">No Data Found!</span>';
    }
  } catch (error) {

  }
}

function setData(data) {
  try {
    instituteData.newInstitute = data.newInstitute;
    instituteData.id = data.id;
    instituteData.instituteName = data.instituteName;
    instituteData.email = data.email;
    instituteData.number = data.number;
    instituteData.privacy = data.privacy;
    instituteData.address = data.address;
    instituteData.picture = data.picture;
    instituteData.loginDate = data.loginDate;
    instituteData.googleId = data.googleId;
    localStorage.setItem("instituteUserData", JSON.stringify(instituteData));
    setFields();
  } catch (error) {
    console.log(error);
  }
}

function setFields() {
  try {

    if (instituteData.id != "") {
      document.getElementById("id").innerText = instituteData.id;
      document.getElementById("id-div").style.display = "flex";
      document.getElementById("instituteName").value = instituteData.instituteName;
    } else {
      document.getElementById("id-div").style.display = "none"
    }

    if (instituteData.email != "") {
      document.getElementById("email").value = instituteData.email;
    }
    if (instituteData.number != "") {
      document.getElementById("number").value = instituteData.number;
    }
    if (instituteData.address != "") {
      document.getElementById("address").value = instituteData.address;
    }
    document.getElementById("continue").style.display = "block";
    document.getElementById("signout").style.display = "block";
    document.getElementById("validation-box-body-signin").style.display = "flex";
    document.getElementById("welcome-sign").innerHTML = `Hi, ${instituteData.instituteName}`;

    if (instituteData.newInstitute == false) {
      document.getElementsByClassName("privacy")[0].style.display = "flex";
    }

  } catch (error) {
    console.log(error);
  }
}

function setIcons(responsedata) {
  try {
    let bankCheck = false;
    let kycCheck = false;
    let instituteCheck = responsedata.institute.verified;

    let bankIcon = document.getElementById("bank-icon")
    bankIcon.style.setProperty("display", "flex", "important");
    if (responsedata.bank == null) {
      bankIcon.style.setProperty("color", "red", "important");
      bankIcon.title = "No Kyc detail found";
    } else if (!responsedata.bank.verified) {
      bankIcon.style.setProperty("color", "greenyellow", "important");
      bankIcon.title = "Your Bank document is currently under verification. Please check back later.";
    } else {
      bankCheck = true;
      bankIcon.style.setProperty("display", "none", "important");
    }

    let kycIcon = document.getElementById("kyc-icon");
    kycIcon.style.setProperty("display", "flex", "important");
    if (responsedata.kyc == null) {
      kycIcon.style.setProperty("color", "red", "important");
      kycIcon.title = "No Kyc detail found";
    } else if (!responsedata.kyc.verified) {
      kycIcon.style.setProperty("color", "greenyellow", "important");
      kycIcon.title = "Your Kyc document is currently under verification. Please check back later.";
    } else {
      kycCheck = true;
      kycIcon.style.setProperty("display", "none", "important");
    }

    if (bankCheck && kycCheck && instituteCheck) {
      document.getElementById("welcome-sign").innerHTML += ` <img src="../Asset/blue-tick.svg" style="width:30px" title="Verified Institute" alt="">`;
    }
  } catch (error) {
    console.log(error);
  }
}

function keyPressed() {
  document.getElementById("continue").innerText = "Update"  
}

// Developer - Nimit Shah
// Developed on - 21/12/2024
// Description - Use to set spinner
// Updated on - -
// Input - none
window.addEventListener("beforeunload", function (event) {
  showSpinner("Loading ...");
});

// Developer - Nimit Shah
// Developed on - 21/12/2024
// Description - Use to remove spinner
// Updated on - -
// Input - none
document.addEventListener("visibilitychange", function () {
  if (document.visibilityState === "hidden") {
    stopSpinner();
  }
});
