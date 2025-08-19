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
  companyName: ""
};
var kycData = {
  "id": "",
  'instituteId': "",
  'name': "",
  'documentType': "",
  'documentNumber': "",
  'document': "",
  'verified': ""
};
let bankData = {
  "id": "",
  "instituteId": "",
  "accountNumber": "",
  "ifscCode": "",
  "branch": "",
  "bankName": "",
  "accHolderName": "",
  "document": "",
  "verified": ""
};


async function adsConnectedCallback() {
  try {
    showSpinner("Checking user...");
    await getEnglishJsonFile("../CommonUtils/en_properties.json");
    Userlogo();
    if (localStorage.getItem("instituteUserData") == null) {
      document.getElementById("google-button").style.display = "block";
      document.getElementsByClassName("validation-box-signin")[0].classList.add("google-sign-in-btn");
    } else {
      let curData = JSON.parse(localStorage.getItem("instituteUserData"));
      apiURL = enProperties.apiURL + enProperties.apiEndPoints.adsUser + `?googleId=${curData.googleId} `;
      let responsedata = await apiCallOuts(apiURL, "GET", null, 6000);
      console.log(responsedata);
      if (responsedata != null && responsedata.institute != null) {
        setData(responsedata);
//        setIcons(responsedata);
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
  } catch (error) {
    createToast('error', 'Failed to login');
    document.getElementById("google-button").style.display = "flex";
    document.getElementsByClassName("validation-box-signin")[0].classList.add("google-sign-in-btn");
    stopSpinner();
  }
}

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

async function fetchUser(id) {
  try {

    apiURL = enProperties.apiURL + enProperties.apiEndPoints.institute + `?googleId=${id} `;
    showSpinner("Checking user...");

    let responsedata = await apiCallOuts(apiURL, "GET", null, 6000);
    document.getElementById("continue").style.display = "block";
    document.getElementById("google-button").style.display = "none";
    if (responsedata != null && responsedata.institute != null) {
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

async function continueClick() {
  try {
    let companyName = document.getElementById("companyName").value;
    let address = document.getElementById("address").value;
    let email = document.getElementById("email").value;
    let number = document.getElementById("number").value;
    privacy = true;

    // Checking for changes in data
    if (companyName.trim() != "" && address.trim() != "" && number.trim() != "" && privacy) {
      if (instituteData.companyName != companyName || instituteData.email != email ||
        instituteData.number != number || instituteData.address != address || instituteData.privacy != privacy) {
        instituteData.companyName = companyName;
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
    apiURL = enProperties.apiURL + enProperties.apiEndPoints.notification + `?refId=${instituteData.id}&refType=ads`;
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
          '<div class="column index" id=' + element.id + ">" + (index + 1) + "</div>" +
          '<div class="column examname" id=' + element.id + ">" + element.message +
          "</div>" +
          '<div class="column date" id=' + element.id + ">" + notificationDate +
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
    instituteData.newInstitute = data.newAdsUser;
    instituteData.id = data.id;
    instituteData.companyName = data.companyName;
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
      document.getElementById("companyName").value = instituteData.companyName;
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
    document.getElementById("welcome-sign").innerHTML = `Hi, ${instituteData.companyName}`;
    document.getElementsByClassName("validation-box-signin")[0].classList.remove("google-sign-in-btn");
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

    let bankIcon = document.getElementById("bank")
    //    bankIcon.style.setProperty("display", "flex", "important");
    if (responsedata.bank == null) {
      bankIcon.style.setProperty("color", "red", "important");
      bankIcon.title = "No Bank detail found";
    } else if (!responsedata.bank.verified) {
      bankIcon.style.setProperty("color", "var(--table-header-bgcolor)", "important");
      bankIcon.title = "Your Bank document is currently under verification. Please check back later.";
    } else {
      bankCheck = true;
      bankIcon.style.setProperty("display", "none", "important");
    }

    let kycIcon = document.getElementById("kyc");
    //    kycIcon.style.setProperty("display", "flex", "important");
    if (responsedata.kyc == null) {
      kycIcon.style.setProperty("color", "red", "important");
      kycIcon.title = "No Kyc detail found";
    } else if (!responsedata.kyc.verified) {
      kycIcon.style.setProperty("color", "var(--table-header-bgcolor)", "important");
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

function keyPressed() {
  if (!instituteData.newInstitute) {
    document.getElementById("continue").innerText = "Update"
  } else {
    document.getElementById("continue").innerText = "Save"
  }
}

async function popupopen(event) {
  let source;
  let data;
  switch (event.target.id) {
    case "kyc":
      source = 'kycpopup';
      kycData.instituteId = instituteData.id != "" ? instituteData.id : "";
      data = kycData;
      break;
    case "bank":
      source = 'bankpopup';
      bankData.instituteId = instituteData.id != "" ? instituteData.id : "";
      data = bankData;
      break;
    case "student":
      dynamicUrl = await getFilePaths('insStudent') + "?insId=" + instituteData.id;
      event.target.href = dynamicUrl;
      window.location.href = dynamicUrl;
      break;
    default:
      break;
  }

  document.getElementById('popupFrame').style.display = "flex";
  popupFrame.contentWindow.postMessage({ source: source, command: 'openPopup', data: data }, enProperties.domainName);

}

window.addEventListener('message', function (event) {
  try {
    if (event.origin !== enProperties.domainName) return;

    const message = event.data;
    if (message.command == 'closePopup') {
      if (message.source == 'IA_Notification') {
        setNotification();
      } else if (message.source == 'IA_KycPopup') {
        setKycData(message.data.data)
        if (message.data.operation == 'save') {
          getNotification();
          createToast('success', 'Kyc detail updated');
        }
      } else if (message.source == 'IA_BankPopup') {
        setBankData(message.data.data)
        if (message.data.operation == 'save') {
          getNotification();
          createToast('success', 'Bank detail updated');
        }
      }
      document.getElementById('popupFrame').style.display = "none";
    }
  } catch (error) {
    console.log(error);
  }
});

function setKycData(data) {
  try {
    kycData.id = data.id;
    kycData.instituteId = data.instituteId;
    kycData.name = data.name;
    kycData.documentType = data.documentType;
    kycData.documentNumber = data.documentNumber;
    kycData.document = data.document;
    kycData.verified = data.verified;
  } catch (error) {
    console.log(error);
  }
}

function setBankData(data) {
  try {
    bankData.id = data.id;
    bankData.instituteId = data.instituteId;
    bankData.accountNumber = data.accountNumber;
    bankData.ifscCode = data.ifscCode;
    bankData.branch = data.branch;
    bankData.bankName = data.bankName;
    bankData.accHolderName = data.accHolderName;
    bankData.document = data.document;
    bankData.verified = data.verified;
  } catch (error) {
    console.log(error);
  }
}