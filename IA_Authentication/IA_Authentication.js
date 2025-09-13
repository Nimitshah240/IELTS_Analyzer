var firstName = "";
var lastName = "";
var email = "";
var number = "";
var type = "";
var privacy = true;
var picture;
var loginDate;
var user_location;
var id;
var data = [];
var maindata;
var user_id;
var dob = "";
// let notificationList = [];
let studentData = {
  newStudent: "",
  id: "",
  name: "",
  lastName: "",
  email: "",
  number: "",
  type: "academic",
  privacy: true,
  location: "",
  picture: "",
  allowedExamCount: 10,
  insCode: "",
  securityKey: "",
  dob: "",
  examCount: 0,
  loginDate: "",
  subscribed: "",
  referralCode: "",
};

let tempStudentData;

// Developer - Nimit Shah
// Developed on - 21/12/2024
// Description - Use to open authentication/signin page
// Updated on - -
// Input - none
async function authentication(event) {
  dynamicUrl = await getFilePaths("authentication");
  event.target.href = dynamicUrl;
  window.location.href = dynamicUrl;
}

// Developer - Nimit Shah
// Developed on - 21/12/2024
// Description - Use to initialize authentication page on load of page
// Updated on - -
// Input - none
async function connectedCallback() {
  await getEnglishJsonFile("../CommonUtils/en_properties.json");
  Userlogo();
  if (localStorage.getItem("user_data") == "undefined" || localStorage.getItem("user_data") == null) {
    document.getElementById("google-button").style.display = "block";
  } else {
    let curData = JSON.parse(localStorage.getItem("user_data"));
    apiURL = enProperties.apiURL + enProperties.apiEndPoints.student + `?googleId=${curData.googleId} `;
    showSpinner("Checking user...");
    let responsedata = await apiCallOuts(apiURL, "GET", null, 6000);
    if (responsedata.code == 200 && responsedata.data != null && responsedata.data.length > 0) {
      setData(responsedata.data[0]);
    } else {
      document.getElementById("welcome-sign").innerText = "Sign In";
      document.getElementById("validation-box-body-signin").style.display = "none";
      document.getElementById("google-button").style.display = "flex";
      document.getElementsByClassName("validation-box-signin")[0].classList.add("google-sign-in-btn");
    }
  }

  // Notification
  getNotification();
  if (window.location.href.includes("#")) {
    SignedIn();
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
      redirect_uri: `${await getFilePaths("authentication")}`,
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
    localStorage.setItem("authInfo", info["access_token"]);
    dynamicUrl = await getFilePaths("authentication");
    window.history.pushState({}, document.title, dynamicUrl);

    if (access_token != "") {
      fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: {
          Authorization: `Bearer ${access_token} `,
        },
      })
        .then((data) => {
          if (!data.ok) {
            localStorage.removeItem("authInfo");
            localStorage.removeItem("user_data");
            throw new Error(data.status + " " + data.statusText);
          }
          return data.json();
        })
        .then(async (info) => {
          info.googleId = info.sub;
          info.id = "";
          delete info.sub;
          maindata = info;
          picture = info.picture;
          dynamicUrl = await getFilePaths("index");
          if (info) {
            loginDate = setDate(new Date());
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
      let access_token = localStorage.getItem("authInfo");
      fetch("https://oauth2.googleapis.com/revoke?token=" + access_token, {
        method: "POST",
        headers: {
          "Content-type": "application/x-www-form-urlencoded",
        },
      }).then(async () => {
        localStorage.removeItem("authInfo");
        localStorage.removeItem("user_data");
        dynamicUrl = await getFilePaths("index");
        window.location.href = dynamicUrl;
      });
    } else {
      dynamicUrl = await getFilePaths("authentication");
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

    apiURL = enProperties.apiURL + enProperties.apiEndPoints.student + `?googleId=${id} `;
    showSpinner("Checking user...");

    document.getElementById("continue").style.display = "block";
    document.getElementById("google-button").style.display = "none";
    document.getElementById("firstname").disabled = false;
    document.getElementById("lastname").disabled = false;
    document.getElementById("number").disabled = false;

    let responsedata = await apiCallOuts(apiURL, "GET", null, 6000);
    if (responsedata.code == 200 && responsedata.data != null && responsedata.data.length > 0) {
      // User is already availabe in DB
      responsedata.data[0].newStudent = false;
      setData(responsedata.data[0]);
      getNotification();
    } else {
      // New user is sign in
      maindata.newStudent = true;
      maindata.name = maindata.given_name;
      maindata.lastName = maindata.family_name;
      maindata.allowedExamCount = 10;
      maindata.examCount = 0;
      maindata.type = 'academic';
      maindata.insCode = "";
      document.getElementById("continue").innerText = "Save";
      setData(maindata);
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

    firstName = document.getElementById("firstname").value;
    lastName = document.getElementById("lastname").value;
    email = document.getElementById("email").value;
    number = document.getElementById("number").value;
    dob = document.getElementById("dob").value;
    document.getElementById("Academic").checked == true ? (type = "academic") : (type = "general");
    privacy = true;


    // Checking for changes in data
    if (firstName.trim() != "" && email.trim() != "" &&
      number.trim() != "" && privacy && dob != "") {
      if (studentData.name != firstName || studentData.lastName != lastName || studentData.email != email ||
        studentData.number != number || studentData.type != type || studentData.dob != dob || studentData.privacy != privacy) {
        studentData.name = firstName;
        studentData.lastName = lastName;
        studentData.email = email;
        studentData.number = number;
        studentData.dob = dob;
        studentData.type = type;
        studentData.privacy = privacy;
        studentData.referralCode = document.getElementById('referral').value;

        setData(studentData);
        let failureBackUp = studentData;
        apiURL = enProperties.apiURL + enProperties.apiEndPoints.student;
        showSpinner("Saving user");

        let method = studentData.newStudent ? "POST" : "PUT";

        await apiCallOuts(apiURL, method, JSON.stringify(studentData), 10000)
          .then(async (responsedata) => {
            if (responsedata.code == 200 && responsedata.data != null) {
              responsedata.data.newStudent = false;
              setData(responsedata.data[0]);
              dynamicUrl = await getFilePaths("index");
              window.location.href = dynamicUrl;
            }
            stopSpinner();
          })
          .catch((error) => {
            setData(failureBackUp);
            stopSpinner();
            createToast("error", error.message);
          });
      } else {
        localStorage.setItem("user_data", JSON.stringify(studentData));
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
    if (
      localStorage.getItem("user_data") != null &&
      document.getElementById("not-log")
    ) {
      document.getElementById("not-log").style.display = "none";
      document.getElementById("login-img").style.display = "block";
      document
        .getElementById("login-img")
        .setAttribute(
          "src",
          JSON.parse(localStorage.getItem("user_data")).picture
        );
    }
  } catch (error) {
    createToast("error", "Error while fetching user data : " + error.message);
  }
}

async function getNotification() {
  try {
    showSpinner("Getting Notification...");
    apiURL = enProperties.apiURL + enProperties.apiEndPoints.notification + `?refId=${studentData.id}&refType=student`;
    let responsedata = await apiCallOuts(apiURL, "GET", null, 6000);
    if (responsedata.code == 200 && responsedata.data != null) {
      notificationList = responsedata.data;
    }
    setNotification();
    stopSpinner();
  } catch (error) {
    createToast("error", "Error while signin : " + error.message);
  }
}

function openNotification(event) {
  try {
    showSpinner("Opening Notification...");

    notificationList.forEach((element) => {
      if (event.target.id == element.id) {
        document.getElementById('popupFrame').style.display = "flex";
        popupFrame.contentWindow.postMessage({ source: 'notificationpopup', command: 'openPopup', data: { 'notification': element, "header": "Notification" } }, enProperties.domainName);
        element.readed = true;
      }
    });
    stopSpinner();
  } catch (error) {
    console.error(error);
    stopSpinner();
  }
}

function setNotification() {
  try {
    if (notificationList.length > 0) {
      let htmldata = "";
      notificationList.forEach((element, index) => {
        let notificationDate = setDate(element.createdDate);
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
    console.log(error);

  }
}

function setData(data) {
  try {
    studentData.newStudent = data.newStudent;
    studentData.id = data.id;
    studentData.name = data.name;
    studentData.lastName = data.lastName;
    studentData.email = data.email;
    studentData.number = data.number;
    studentData.type = data.type;
    studentData.privacy = data.privacy;
    studentData.location = data.location;
    studentData.picture = data.picture;
    studentData.allowedExamCount = data.allowedExamCount;
    studentData.insCode = data.insCode;
    studentData.securityKey = data.securityKey;
    studentData.dob = data.dob;
    studentData.examCount = data.examCount;
    studentData.loginDate = data.loginDate;
    studentData.subscribed = data.subscribed;
    studentData.referralCode = data.referralCode;
    studentData.googleId = data.googleId;
    tempStudentData = studentData;
    localStorage.setItem("user_data", JSON.stringify(studentData));
    setFields();
  } catch (error) {
    console.log(error);
  }
}

function setFields() {
  try {

    if (studentData.id != "") {
      document.getElementById("id").innerText = studentData.id;
      studentData.id == ""
        ? (document.getElementById("id-div").style.display = "none")
        : (document.getElementById("id-div").style.display = "flex");
    }
    if (studentData.firstName != "") {
      document.getElementById("firstname").value = studentData.name;
      document.getElementById("firstname").disabled = false;
      document.getElementById("number").disabled = false;
      document.getElementById("dob").disabled = false;
      document.getElementById("referral").disabled = false;
      document.getElementById("referral-hidden").style.display = "flex";
    }
    if (studentData.lastName != "") {
      document.getElementById("lastname").value = studentData.lastName;
      document.getElementById("lastname").disabled = false;
    }
    if (studentData.email != "") {
      document.getElementById("email").value = studentData.email;
    }
    if (studentData.number != "") {
      document.getElementById("number").value = studentData.number;
    }
    if (studentData.dob != "") {
      document.getElementById("dob").value = studentData.dob;
    }

    if (studentData.referralCode != "" && studentData.referralCode != undefined) {
      document.getElementById("referral").disabled = true;
      document.getElementById("referral").value = studentData.referralCode;
    }
    if (studentData.insCode != "") {
      document.getElementById("inscode-hidden").style.display = "flex";
      document.getElementById("insCode").value = studentData.insCode;
    }
    studentData.insCode != ""
      ? (document.getElementById("insCode").style.fontWeight = "bold")
      : (document.getElementById("insCode").style.fontWeight = "normal");

    // document.getElementById("privacy").checked = studentData.privacy;
    document.getElementById(
      "examCount"
    ).innerText = `${studentData.examCount}/${studentData.allowedExamCount}`;

    studentData.type == "academic"
      ? (document.getElementById("Academic").checked = true)
      : (document.getElementById("General").checked = true);


    document.getElementById("loading-progress").value =
      (studentData.examCount / studentData.allowedExamCount) * 100;

    document.getElementById("continue").style.display = "block";
    document.getElementById("signout").style.display = "block";
    document.getElementById("validation-box-body-signin").style.display = "flex";
    document.getElementById("welcome-sign").innerText = `Hi, ${studentData.name}`;

    if (studentData.newStudent == false) {
      document.getElementsByClassName("privacy")[0].style.display = "flex";
    }

  } catch (error) {
    console.log(error);
  }
}

function keyPressed() {
  if (!studentData.newStudent) {
    document.getElementById("continue").innerText = "Update"
  } else {
    document.getElementById("continue").innerText = "Save"
  }
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

window.addEventListener('message', function (event) {
  try {
    if (event.origin !== enProperties.domainName) return;

    const message = event.data;
    if (message.command == 'closePopup') {
      if (message.source == 'IA_Notification') {
        document.getElementById('popupFrame').style.display = "none";
        setNotification();
      }
    }
  } catch (error) {
    console.log(error);
  }
});