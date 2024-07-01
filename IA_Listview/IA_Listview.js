var Question = [];
var Exam = [];
const urlSearchParams = new URLSearchParams(window.location.search);
const type = urlSearchParams.get('type');
function connectedCallback() {

    Question = [
        {
            'ExamId': '123',
            'Section': 1,
            'Question': 'q',
            'Total': 4,
            'Obtain': 2,
            'Wrong': 1,
            'Missed': 10
        },
        {
            'ExamId': '123',
            'Section': 1,
            'Question': 'q',
            'Total': 4,
            'Obtain': 2,
            'Wrong': 1,
            'Missed': 0,
        },
        {
            'ExamId': '123',
            'Section': 1,
            'Question': 'q',
            'Total': 4,
            'Obtain': 2,
            'Wrong': 1,
            'Missed': 0,
        },
        {
            'ExamId': '123',
            'Section': 1,
            'Question': 'q',
            'Total': 4,
            'Obtain': 2,
            'Wrong': 1,
            'Missed': 0,
        },
        {
            'ExamId': '123',
            'Section': 1,
            'Question': 'q',
            'Total': 4,
            'Obtain': 2,
            'Wrong': 1,
            'Missed': 0,
        },
        {
            'ExamId': '123',
            'Section': 2,
            'Question': 'q',
            'Total': 4,
            'Obtain': 9,
            'Wrong': 9,
            'Missed': 9,
        },
        {
            'ExamId': '123',
            'Section': 2,
            'Question': 'q',
            'Total': 4,
            'Obtain': 9,
            'Wrong': 9,
            'Missed': 9,
        },
        {
            'ExamId': '123',
            'Section': 3,
            'Question': 'q',
            'Total': 4,
            'Obtain': 9,
            'Wrong': 9,
            'Missed': 9,
        },
        {
            'ExamId': '345',
            'Section': 1,
            'Question': 'q',
            'Total': 4,
            'Obtain': 9,
            'Wrong': 9,
            'Missed': 9,
        },
        {
            'ExamId': '345',
            'Section': 1,
            'Question': 'q',
            'Total': 4,
            'Obtain': 9,
            'Wrong': 9,
            'Missed': 9,
        },
        {
            'ExamId': '345',
            'Section': 2,
            'Question': 'q',
            'Total': 4,
            'Obtain': 9,
            'Wrong': 9,
            'Missed': 9,
        },
        {
            'ExamId': '345',
            'Section': 2,
            'Question': 'q',
            'Total': 4,
            'Obtain': 9,
            'Wrong': 9,
            'Missed': 9,
        },
        {
            'ExamId': '345',
            'Section': 3,
            'Question': 'q',
            'Total': 4,
            'Obtain': 9,
            'Wrong': 9,
            'Missed': 9,
        },
        {
            'ExamId': '234',
            'Section': 1,
            'Question': 'q',
            'Total': 4,
            'Obtain': 9,
            'Wrong': 9,
            'Missed': 9,
        },
        {
            'ExamId': '234',
            'Section': 1,
            'Question': 'q',
            'Total': 4,
            'Obtain': 9,
            'Wrong': 9,
            'Missed': 9,
        },
        {
            'ExamId': '234',
            'Section': 2,
            'Question': 'q',
            'Total': 4,
            'Obtain': 9,
            'Wrong': 9,
            'Missed': 9,
        },
        {
            'ExamId': '234',
            'Section': 2,
            'Question': 'q',
            'Total': 4,
            'Obtain': 9,
            'Wrong': 9,
            'Missed': 9,
        },
        {
            'ExamId': '234',
            'Section': 3,
            'Question': 'q',
            'Total': 2,
            'Obtain': 9,
            'Wrong': 9,
            'Missed': 9,
        }

    ]

    Exam = [
        {
            'ExamId': '123',
            'ExamName': 'Exam 1',
            'ExamDate': '03/12/2022s'
        },
        {
            'ExamId': '234',
            'ExamName': 'Exam 2',
            'ExamDate': '03/12/2022'
        },
        {
            'ExamId': '345',
            'ExamName': 'Exam 3',
            'ExamDate': '03/12/2022'
        },
        {
            'ExamId': '45',
            'ExamName': 'Exam 4',
            'ExamDate': '03/12/2022'
        }
    ];

    let data = [];
    const Section1 = new Map();
    const Section2 = new Map();
    const Section3 = new Map();
    const Section4 = new Map();
    const Exammap = new Map();
    let htmldata = "";

    // Setting map for examid and date
    Exam.forEach(element => {
        Exammap.set(element.ExamId, {
            'Name': element.ExamName,
            'Date': element.ExamDate
        });
    });

    // Calculating section wise marks for exach exam
    Question.forEach(element => {
        if (element.Section == 1) {
            if (Section1.has(element.ExamId)) {
                Section1.set(element.ExamId, Section1.get(element.ExamId) + element.Total);
            } else {
                Section1.set(element.ExamId, element.Total);
            }
        } else if (element.Section == 2) {
            if (Section2.has(element.ExamId)) {
                Section2.set(element.ExamId, Section2.get(element.ExamId) + element.Total);
            } else {
                Section2.set(element.ExamId, element.Total);
            }
        } else if (element.Section == 3) {
            if (Section3.has(element.ExamId)) {
                Section3.set(element.ExamId, Section3.get(element.ExamId) + element.Total);
            } else {
                Section3.set(element.ExamId, element.Total);
            }
        } else if (element.Section == 4) {
            if (Section4.has(element.ExamId)) {
                Section4.set(element.ExamId, Section4.get(element.ExamId) + element.Total);
            } else {
                Section4.set(element.ExamId, element.Total);
            }
        }
    });

    // Arranging Data in Variable
    for (const key of Exammap.keys()) {
        data.push({
            'ExamId': key,
            'ExamName': Exammap.get(key).Name,
            'ExamDate': Exammap.get(key).Date,
            'Section 1': (Section1.get(key) == undefined ? 0 : Section1.get(key)),
            'Section 2': (Section2.get(key) == undefined ? 0 : Section2.get(key)),
            'Section 3': (Section3.get(key) == undefined ? 0 : Section3.get(key)),
            'Section 4': (Section4.get(key) == undefined ? 0 : Section4.get(key)),
            'Total': (Section1.get(key) == undefined ? 0 : Section1.get(key)) +
                (Section2.get(key) == undefined ? 0 : Section2.get(key)) +
                (Section3.get(key) == undefined ? 0 : Section3.get(key)) +
                (Section4.get(key) == undefined ? 0 : Section4.get(key)),
        })
    }

    //Setting data to html
    data.forEach((element, index) => {
        htmldata +=
            '<div class="data" onclick="openexam(event)" id=' + element.ExamId + '>' +
            '<div class="column index" id=' + element.ExamId + '>' + (index + 1) + '</div>' +
            '<div class="column examname" id=' + element.ExamId + '>' + element.ExamName + '</div>' +
            '<div class="column date" id=' + element.ExamId + '>' + element.ExamDate + '</div>' +
            '<div class="column total" id=' + element.ExamId + '>' + element.Total + '</div>' +
            '<div class="column section" id=' + element.ExamId + '>' + element["Section 1"] + '</div>' +
            '<div class="column section" id=' + element.ExamId + '>' + element["Section 2"] + '</div>' +
            '<div class="column section" id=' + element.ExamId + '>' + element["Section 3"] + '</div>' +
            '<div class="column section" id=' + element.ExamId + '>' + element["Section 4"] + '</div>' +
            '<div class="column delete" id=' + element.ExamId + '> <i class="fa fa-trash" aria-hidden="true"></i>' +
            '</div>' +
            '</div>'
    });

    document.getElementById("table").innerHTML = htmldata;

    signincheck();
}
function setHref(event) {
    try {
        var dynamicUrl = '../IA_DataEntry/IA_DataEntry.html?type=' + type;
        event.target.href = dynamicUrl;
        window.location.href = dynamicUrl;
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

function openexam(event) {
    let exam = [];
    let questions = [];

    Exam.forEach(element => {
        if (element.ExamId == event.target.id) {
            exam.push(element);
        }
    });

    Question.forEach(element => {
        if (element.ExamId == event.target.id) {
            questions.push(element);
        }
    })

    localStorage.setItem("Exam" + event.target.id, JSON.stringify(exam));
    localStorage.setItem("Questions" + event.target.id, JSON.stringify(questions));

    var dynamicUrl = '../IA_DataEntry/IA_DataEntry.html?type=' + type + '&tdExam=' + event.target.id;
    event.target.href = dynamicUrl;
    window.location.href = dynamicUrl;
}