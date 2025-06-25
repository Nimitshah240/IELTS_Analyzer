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
        type = data.type;
        if (document.getElementById("firstname")) {
            document.getElementById('continue').style.display = 'block';
            document.getElementById('signout').style.display = 'block';
            document.getElementById("firstname").disabled = false;
            document.getElementById("lastname").disabled = false;
            document.getElementById("email").disabled = true;
            document.getElementById("number").disabled = false;
            firstName = document.getElementById("firstname").value = data.name;
            lastName = document.getElementById("lastname").value = data.lastName;
            email = document.getElementById("email").value = data.email;
            number = document.getElementById("number").value = data.number;
            if (type == 'academic') {
                document.getElementById("Academic").checked = true;
            } else if (type == 'general') {
                document.getElementById("General").checked = true;
            }
            privacy = document.getElementById("privacy").checked = privacy;
        }
    }

    if (window.location.href.includes('#')) {
        SignedIn();
    }
}

// Developer - Nimit Shah
// Developed on - 21/12/2024
// Description - Use to open google authentication page
// Updated on - -
// Input - none
function googleSignin() {
    try {
        let oauth2Endpoint = "https://accounts.google.com/o/oauth2/v2/auth";

        let form = document.createElement('form');
        form.setAttribute('method', 'GET');
        form.setAttribute('action', oauth2Endpoint);

        let params = {
            "client_id": "960583894295-h50j910bdioqrmlrargqs6hust6in4ap.apps.googleusercontent.com",
            "redirect_uri": "http://localhost/Projects/Ielts%20Analyzer/IA_Client/IA_Authentication/IA_Authentication.html",
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
                    "Authorization": `Bearer ${access_token}`
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
                    dynamicUrl = await getFilePaths("index") + "?signedin=true";
                    if (info) {
                        let today = new Date();
                        let year = today.getFullYear();
                        let month = ('0' + (today.getMonth() + 1)).slice(-2);
                        let day = ('0' + today.getDate()).slice(-2);
                        today = `${year}-${month}-${day}`;
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
function fetchUser(id) {
    try {
        apiURL = enProperties.apiURL + enProperties.apiEndPoints.studentApi + enProperties.apiEndPoints.student;

        fetch(`${apiURL}?user_id=${id}`)
            .then(response => response.json())
            .then(responsedata => {
                document.getElementById('continue').style.display = 'block';
                document.getElementById('google-button').style.display = 'none';
                document.getElementById("firstname").disabled = false;
                document.getElementById("lastname").disabled = false;
                document.getElementById("number").disabled = false;
                if (responsedata.length > 0) {

                    // User is already availabe in DB
                    // Setting data in fields
                    let tempdata = responsedata[0];
                    id = tempdata.id;
                    firstName = document.getElementById("firstname").value = tempdata.name;
                    lastName = document.getElementById("lastname").value = tempdata.lastName;
                    email = document.getElementById("email").value = tempdata.email;
                    number = document.getElementById("number").value = tempdata.number;
                    picture = tempdata.picture;
                    loginDate = tempdata.loginDate;
                    user_location = tempdata.location;
                    type = tempdata.type
                    if (type == 'academic') {
                        document.getElementById("Academic").checked = true;
                    } else if (type == 'general') {
                        document.getElementById("General").checked = true;
                    }
                    if (tempdata.privacy == true) {
                        privacy = document.getElementById("privacy").checked = true;
                    }
                    data = { 'new': false, 'id': id, 'name': firstName, 'lastName': lastName, 'email': email, 'number': number, 'type': type, 'privacy': privacy, 'location': user_location, 'loginDate': loginDate, 'picture': picture };
                } else {
                    // New user is sign in
                    id = maindata.id;
                    firstName = document.getElementById("firstname").value = maindata.given_name;
                    lastName = document.getElementById("lastname").value = maindata.family_name;
                    email = document.getElementById("email").value = maindata.email;
                    // number = document.getElementById("number").value = maindata.number;
                    picture = maindata.picture;
                    user_location = '';
                    data = { 'new': true, 'id': maindata.id, 'name': maindata.given_name, 'lastName': maindata.family_name, 'email': maindata.email, 'number': 'number', 'type': 'academic', 'privacy': '', 'location': '', 'loginDate': loginDate, 'picture': maindata.picture };
                }

            }).catch(error => createToast('error', error));
    } catch (error) {
        createToast('error', error)
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
        if (document.getElementById("Academic").checked == true) { // Change here
            temptype = 'academic';
        } else if (document.getElementById("General").checked == true) { // Change here
            temptype = 'general';
        }
        let tempprivacy = document.getElementById("privacy").checked;

        // Checking for changes in data
        if (tempname.trim() != '' && tempemail.trim() != '' && tempnumber.trim() != '' && tempprivacy) {
            if (firstName != tempname || lastName != templastName || email != tempemail || number != tempnumber || temptype != type) {
                data.name = tempname;
                data.lastName = templastName;
                data.email = tempemail;
                data.number = tempnumber;
                data.type = temptype;
                data.privacy = tempprivacy;

                apiURL = enProperties.apiURL + enProperties.apiEndPoints.studentApi + enProperties.apiEndPoints.updateStudent;

                fetch(apiURL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                }).then(async response => {
                    data.new = false
                    localStorage.setItem('user_data', JSON.stringify(data));
                    dynamicUrl = await getFilePaths("index");
                    window.location.href = dynamicUrl;
                }).catch(error => console.error('Error:', error.message));
            } else {
                localStorage.setItem('user_data', JSON.stringify(data));
                dynamicUrl = await getFilePaths("index") + "?signedin=true";
                window.location.href = dynamicUrl;
            }
        } else {
            createToast('error', "Fill require detail");
        }
    } catch (error) {
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
        await setAnchorHref("index", "../en_properties.json");
        await setIframeSrc("spinner", "../en_properties.json");
        if (localStorage.getItem('user_data') != null && document.getElementById("not-log")) {
            document.getElementById('not-log').style.display = 'none';
            document.getElementById('login-img').style.display = 'block';
            document.getElementById('login-img').setAttribute('src', JSON.parse(localStorage.getItem('user_data')).picture);
        }
    } catch (error) {
        createToast('error', 'Error while fetching user data : ' + error.message);
    }
}