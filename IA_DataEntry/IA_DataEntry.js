const urlSearchParams = new URLSearchParams(window.location.search);
var type = urlSearchParams.get('type');

var tdExam = urlSearchParams.get('tdExam')
var exam = JSON.parse(localStorage.getItem('Exam' + tdExam));
var questions = JSON.parse(localStorage.getItem('Questions' + tdExam));
console.log(questions);
function connectedCallback() {
    sectionsetter();
    signincheck();
}

function sectionsetter(event) {
    try {
        if (type == 'reading') {
            document.getElementById('section4').style.display = 'none';
        } else {
            document.getElementById('section4').style.display = 'flex';
        }
    } catch (error) {
        console.log(error);
    }
}

function setHref(event) {
    try {

        var dynamicUrl = '../IA_Listview/IA_Listview.html?type=' + type;
        event.target.href = dynamicUrl;
        window.location.href = dynamicUrl;
    } catch (error) {
        console.log(error);
    }
}

function popupopen(event) {
    try {

        var section = event.target.dataset.section;
        var type = event.target.id;


        if (type == 'save') {
            document.getElementById('save-div').style.display = 'flex';
        } else {
            var sectiondata = '<tr><th colspan="5"> Question Type</th></tr><tr><th> Correct </th><th> Incorrect </th><th> Missed </th><th> Total </th><th> Delete </th></tr >';

            questions.forEach(element => {
                if (element.Section == section) {
                    sectiondata +=
                        '<tr><td colspan="5">' + element.Question + '</td></tr >' +
                        '<tr>' +
                        '<td>' + element.Obtain + '</td>' +
                        '<td>' + element.Wrong + '</td>' +
                        '<td>' + element.Missed + '</td>' +
                        '<td> ' + element.Total + ' </td>' +
                        '<td class="delete-icon"><i class="fa fa-trash" aria-hidden="true"></i> </td> </tr>';
                }
            });
            document.getElementById('show-div').style.display = 'flex';
            document.getElementById("table").innerHTML = sectiondata;
            document.getElementById("data-title").innerHTML = 'Section ' + section;

        }
    } catch (error) {
        console.log(error.message);
        console.log(error.linenumber);

    }
}

function popupclose(event) {
    try {
        var type = event.target.id;
        console.log(type);
        if (type == 'save') {
            // document.getElementById('save-div').style.display = 'none';
            dynamicUrl = '../IA_Listview/IA_Listview.html?type=' + type;

            event.target.href = dynamicUrl;
            window.location.href = dynamicUrl;
        } else {
            document.getElementById('save-div').style.display = 'none';
            document.getElementById('show-div').style.display = 'none';
        }

    } catch (error) {
        console.log(error);
    }
}

function sigin() {
    try {
        let oauth2Endpoint = "https://accounts.google.com/o/oauth2/v2/auth";

        let form = document.createElement('form');
        form.setAttribute('method', 'GET');
        form.setAttribute('action', oauth2Endpoint);

        let params = {
            "client_id": "960583894295-h50j910bdioqrmlrargqs6hust6in4ap.apps.googleusercontent.com",
            "redirect_uri": "http://localhost/IA_Code/IA_Home/IA_Home.html",
            "response_type": "token",
            "scope": "https://www.googleapis.com/auth/userinfo.profile",
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
        console.error(error);
    }
}

function signincheck() {
    try {
        let access_token = '';
        if (window.location.href.includes('#')) {

            let params = {}
            let regex = /([^&=]+)=([^&]*)/g, m

            while (m = regex.exec(location.href)) {
                params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
            }
            window.history.pushState({}, document.title, "/" + "IA_Code/IA_Home/IA_Home.html");

            let info = JSON.parse(JSON.stringify(params));
            access_token = info['access_token'];
            localStorage.setItem("authInfo", info['access_token']);


        } else if (localStorage.getItem("authInfo") != null) {
            access_token = localStorage.getItem("authInfo");
        }

        if (access_token != '') {

            fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
                headers: {
                    "Authorization": `Bearer ${access_token}`
                }
            })
                .then((data) => {
                    if (!data.ok) {
                        localStorage.removeItem('authInfo');
                        console.log(data);
                        throw new Error(data.status + ' ' + data.statusText);
                    }
                    return data.json();
                })
                .then((info) => {
                    document.getElementById('not-log').style.display = 'none';
                    document.getElementById('login-img').style.display = 'block';
                    document.getElementById('login-img').setAttribute('src', info.picture);
                });
        }
    } catch (error) {
        console.error('e', error);
    }
}

function signout() {
    try {
        let access_token = localStorage.getItem('authInfo');
        fetch("https://oauth2.googleapis.com/revoke?token=" + access_token, {
            method: 'POST',
            headers: {
                'Content-type': 'application/x-www-form-urlencoded'
            }
        })
            .then(() => {
                localStorage.removeItem('authInfo');
                document.getElementById('not-log').style.display = 'block';
                document.getElementById('login-img').style.display = 'none';
            })
    } catch (error) {
        console.error(error);
    }
}