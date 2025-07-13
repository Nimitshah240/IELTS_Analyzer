var firstName = '';
var lastName = '';
var email = '';
var number = '';
var type = '';
var privacy = false;
var picture;
var loginDate;
var user_location;
var id;
var data = [];
var maindata;
var user_id;
var dob = "";

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
    await getEnglishJsonFile('../en_properties.json');
    Userlogo();
    data = { "new": false, "id": "112727238629250521382", "name": "NIMIT", "lastName": "SHAH", "email": "nimitshah240@gmail.com", "number": 6353756701, "type": "academic", "privacy": true, "location": "", "loginDate": "2025-07-13T22:26:14.549145", "picture": "https://lh3.googleusercontent.com/a/ACg8ocJFiNEg2k1N47R69HPxsnQ6Oo9q2VTIqIcQ_ZR9R_i4lx_zULUYRw=s96-c", "allowedExamCount": 10, "insCode": "", "securityKey": "", "dob": "2025-07-13", "examCount": 9 };
    localStorage.setItem('user_data', JSON.stringify(data));
    if (localStorage.getItem('user_data') == 'undefined' || localStorage.getItem('user_data') == null) {
        if (document.getElementById('firstname')) {
            document.getElementById('google-button').style.display = 'block';
            document.getElementById("firstname").disabled = true;
            document.getElementById("lastname").disabled = true;
            document.getElementById("email").disabled = true;
            document.getElementById("number").disabled = true;
        }
    } else {
        data = JSON.parse(localStorage.getItem('user_data'));
        firstName = data.firstName;
        lastName = data.lastName;
        email = data.email;
        number = data.number;
        privacy = data.privacy;
        dob = data.dob;
        type = data.type;
        if (document.getElementById("firstname")) {
            document.getElementById('continue').style.display = 'block';
            document.getElementById('signout').style.display = 'block';
            document.getElementById("firstname").disabled = false;
            document.getElementById("lastname").disabled = false;
            document.getElementById("email").disabled = true;
            document.getElementById("number").disabled = false;
            document.getElementById("id").innerText = data.id;
            firstName = document.getElementById("firstname").value = data.name;
            lastName = document.getElementById("lastname").value = data.lastName;
            email = document.getElementById("email").value = data.email;
            number = document.getElementById("number").value = data.number;
            dob = document.getElementById("dob").value = data.dob;
            document.getElementById("examCount").innerText = `${data.examCount}/${data.allowedExamCount}`
            document.getElementById("loading-progress").value = data.examCount / data.allowedExamCount * 100;
            if (type == 'academic') {
                document.getElementById("Academic").checked = true;
            } else if (type == 'general') {
                document.getElementById("General").checked = true;
            }
            privacy = document.getElementById("privacy").checked = privacy;
        }
    }

    // Notification 
    getNotification();
    if (window.location.href.includes('#')) {
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

        let form = document.createElement('form');
        form.setAttribute('method', 'GET');
        form.setAttribute('action', oauth2Endpoint);

        let params = {
            "client_id": "960583894295-h50j910bdioqrmlrargqs6hust6in4ap.apps.googleusercontent.com",
            "redirect_uri": `${await getFilePaths('authentication')}`,
            "response_type": "token",
            "scope": "https://www.googleapis.com/auth/userinfo.profile  https://www.googleapis.com/auth/userinfo.email",
            "include_granted_scope": 'true',
            'state': 'pass-through-value'
        }

        for (var p in params) {
            let input = document.createElement('input');
            input.setAttribute('type', 'hidden');
            input.setAttribute('name', p);
            input.setAttribute('value', params[p]);
            form.appendChild(input);
        }

        document.body.appendChild(form);
        form.submit();
    } catch (error) {
        createToast('error', 'Error while signin : ' + error.message);
    }
}

// Developer - Nimit Shah
// Developed on - 21/12/2024
// Description - Use to verify that user have google signed in or not and also user is available in DB or not
// Updated on - -
// Input - none
async function SignedIn() {
    try {
        let access_token = '';
        let params = {}
        let regex = /([^&=]+)=([^&]*)/g, m

        while (m = regex.exec(location.href)) {
            params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
        }

        let info = JSON.parse(JSON.stringify(params));
        access_token = info['access_token'];
        localStorage.setItem("authInfo", info['access_token']);
        dynamicUrl = await getFilePaths("authentication");
        window.history.pushState({}, document.title, dynamicUrl);

        if (access_token != '') {
            fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
                headers: {
                    "Authorization": `Bearer ${access_token} `
                }
            })
                .then((data) => {
                    if (!data.ok) {
                        localStorage.removeItem('authInfo');
                        localStorage.removeItem('user_data');
                        throw new Error(data.status + ' ' + data.statusText);
                    }
                    return data.json();
                })
                .then(async (info) => {
                    info.id = info.sub;
                    delete info.sub;
                    maindata = info;
                    picture = info.picture;
                    dynamicUrl = await getFilePaths("index");
                    if (info) {
                        let today = new Date();
                        let year = today.getFullYear();
                        let month = ('0' + (today.getMonth() + 1)).slice(-2);
                        let day = ('0' + today.getDate()).slice(-2);
                        today = `${year} -${month} -${day} `;
                        loginDate = today;
                        fetchUser(info.id);
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
        if (event.target.id == 'yes') {
            let access_token = localStorage.getItem('authInfo');
            fetch("https://oauth2.googleapis.com/revoke?token=" + access_token, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/x-www-form-urlencoded'
                }
            }).then(async () => {
                localStorage.removeItem('authInfo');
                localStorage.removeItem('user_data');
                dynamicUrl = await getFilePaths("index");
                window.location.href = dynamicUrl;
            })
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
        document.getElementById('validation-box-signin').style.display = 'none';
        document.getElementById('validation-box-signout').style.display = 'block';
        Array.from(document.getElementsByClassName('button')).forEach(element => {
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

        apiURL = enProperties.apiURL + enProperties.apiEndPoints.student + `?user_id=${id} `;
        showSpinner('Checking user...');
        let responsedata = await apiCallOuts(apiURL, 'GET', null, 6000);

        document.getElementById('continue').style.display = 'block';
        document.getElementById('google-button').style.display = 'none';
        document.getElementById("firstname").disabled = false;
        document.getElementById("lastname").disabled = false;
        document.getElementById("number").disabled = false;
        if (responsedata.length > 0) {
            // User is already availabe in DB
            // Setting data in fields
            let tempdata = responsedata[0];
            id = document.getElementById("id").innerText = tempdata.id;
            firstName = document.getElementById("firstname").value = tempdata.name;
            lastName = document.getElementById("lastname").value = tempdata.lastName;
            email = document.getElementById("email").value = tempdata.email;
            number = document.getElementById("number").value = tempdata.number;
            dob = document.getElementById("dob").value = tempdata.dob;
            picture = tempdata.picture;
            loginDate = tempdata.loginDate;
            user_location = tempdata.location;
            type = tempdata.type
            document.getElementById("examCount").innerText = `${tempdata.examCount}/${tempdata.allowedExamCount}`
            document.getElementById("loading-progress").value = data.examCount / data.allowedExamCount * 100;

            if (type == 'academic') {
                document.getElementById("Academic").checked = true;
            } else if (type == 'general') {
                document.getElementById("General").checked = true;
            }
            if (tempdata.privacy == true) {
                privacy = document.getElementById("privacy").checked = true;
            }
            data = { 'new': false, 'id': id, 'name': firstName, 'lastName': lastName, 'email': email, 'number': number, 'type': type, 'privacy': privacy, 'location': user_location, 'loginDate': loginDate, 'picture': picture, "allowedExamCount": tempdata.allowedExamCount, "insCode": tempdata.insCode, "securityKey": tempdata.securityKey, "dob": tempdata.dob, "examCount": tempdata.examCount };
        } else {
            // New user is sign in
            id = maindata.id;
            firstName = document.getElementById("firstname").value = maindata.given_name;
            lastName = document.getElementById("lastname").value = maindata.family_name;
            email = document.getElementById("email").value = maindata.email;
            picture = maindata.picture;
            user_location = '';
            data = { 'new': true, 'id': maindata.id, 'name': maindata.given_name, 'lastName': maindata.family_name, 'email': maindata.email, 'number': 'number', 'type': 'academic', 'privacy': '', 'location': '', 'picture': maindata.picture, "allowedExamCount": 10, "insCode": "", "securityKey": "", "dob": "", "examCount": 0 };
        }
        stopSpinner();
    } catch (error) {
        stopSpinner();
        createToast('error', 'Error while user : ' + error.message)
    }
}

// Developer - Nimit Shah
// Developed on - 21/12/2024
// Description - Use to update db if user update any details or redirect user to home page
// Updated on - -
// Input - none
async function continueClick() {
    try {
        let temptype;
        let tempname = document.getElementById("firstname").value;
        let templastName = document.getElementById("lastname").value;
        let tempemail = document.getElementById("email").value;
        let tempnumber = document.getElementById("number").value;
        let tempdob = document.getElementById("dob").value;
        if (document.getElementById("Academic").checked == true) { // Change here
            temptype = 'academic';
        } else if (document.getElementById("General").checked == true) { // Change here
            temptype = 'general';
        }
        let tempprivacy = document.getElementById("privacy").checked;

        // Checking for changes in data
        if (tempname.trim() != '' && tempemail.trim() != '' && tempnumber.trim() != '' && tempprivacy && tempdob != '') {
            if (firstName != tempname || lastName != templastName || email != tempemail || number != tempnumber || temptype != type || tempdob != dob) {
                data.name = tempname;
                data.lastName = templastName;
                data.email = tempemail;
                data.number = tempnumber;
                data.type = temptype;
                data.privacy = tempprivacy;
                data.dob = tempdob;

                apiURL = enProperties.apiURL + enProperties.apiEndPoints.student;
                showSpinner('Saving user');
                await apiCallOuts(apiURL, 'POST', JSON.stringify(data), 10000)
                    .then(async () => {
                        data.new = false
                        localStorage.setItem('user_data', JSON.stringify(data));
                        dynamicUrl = await getFilePaths("index");
                        window.location.href = dynamicUrl;
                        stopSpinner();
                    }).catch(error => {
                        stopSpinner();
                        createToast('error', error.message)
                    });

            } else {
                localStorage.setItem('user_data', JSON.stringify(data));
                dynamicUrl = await getFilePaths("index") + "?signedin=true";
                window.location.href = dynamicUrl;
            }
        } else {
            createToast('error', "Fill require detail");
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
        if (localStorage.getItem('user_data') != null && document.getElementById("not-log")) {
            document.getElementById('not-log').style.display = 'none';
            document.getElementById('login-img').style.display = 'block';
            document.getElementById('login-img').setAttribute('src', JSON.parse(localStorage.getItem('user_data')).picture);
        }
    } catch (error) {
        createToast('error', 'Error while fetching user data : ' + error.message);
    }
}

async function getNotification(params) {
    try {
        showSpinner('Getting Notification...');
        apiURL = enProperties.apiURL + enProperties.apiEndPoints.base + enProperties.apiEndPoints.notification;
        // let responsedata = await apiCallOuts(apiURL, 'GET', null, 6000);
        let responsedata = [
            { "id": 1, "message": "This is a sample notification message.", "createdDate": "2025-07-12T00:00:00Z", "refId": "112727238629250521382", "readed": true },
            { "id": 2, "message": "This is sample message", "createdDate": "2025-07-11T00:00:00Z", "refId": "112727238629250521382", "readed": true },
            { "id": 3, "message": "For ALL", "createdDate": "2025-07-11T00:00:00Z","refId": "112727238629250521382", "readed": false },
            { "id": 4, "message": null, "createdDate": null, "refId": null, "readed": false },
            { "id": 5, "message": null, "createdDate": null, "refId": "112727238629250521382", "readed": true },
            { "id": 6, "message": null, "createdDate": null, "refId": "112727238629250521382", "readed": true },
            { "id": 7, "message": null, "createdDate": null, "refId": "112727238629250521382", "readed": true },
            { "id": 8, "message": null, "createdDate": null, "refId": "112727238629250521382", "readed": true },
            { "id": 9, "message": null, "createdDate": null, "refId": "112727238629250521382", "readed": true },
            { "id": 10, "message": null, "createdDate": null, "refId": "112727238629250521382", "readed": true }
        ];
        if (responsedata.length > 0) {
            let htmldata = '';
            responsedata.forEach((element, index) => {
                let notificationDate = new Date(element.createdDate);
                let year = notificationDate.getFullYear();
                let month = ('0' + (notificationDate.getMonth() + 1)).slice(-2);
                let day = ('0' + notificationDate.getDate()).slice(-2);
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
                if (element.refId == null) {
                    read = "forAll";
                }
                htmldata +=
                    `<div class="data ${classes}" id= ${element.id} > ` +
                    `<div class="${read}"></div>` +
                    '<div class="column index" onclick="openNotification(event)" id=' + element.id + '>' + (index + 1) + '</div>' +
                    '<div class="column examname" onclick="openNotification(event)" id=' + element.id + '>' + element.message + '</div>' +
                    '<div class="column date" onclick="openNotification(event)" id=' + element.id + '>' + notificationDate + '</div>' +
                    '</div>' +
                    '</div>'
            });
            document.getElementById("table").innerHTML = htmldata;
        } else {
            document.getElementById("table").innerHTML = '<span class="no_data">No Data Found!</span>';
        }
        stopSpinner();
    } catch (error) {

    }
}
function openNotification(event) {
    try {

    } catch (error) {

    }
}

// Developer - Nimit Shah
// Developed on - 21/12/2024
// Description - Use to set spinner
// Updated on - -
// Input - none
window.addEventListener("beforeunload", function (event) {
    showSpinner('Loading ...');
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