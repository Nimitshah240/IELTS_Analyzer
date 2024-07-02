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