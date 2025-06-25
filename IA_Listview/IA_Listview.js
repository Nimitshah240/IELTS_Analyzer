const urlSearchParams = new URLSearchParams(window.location.search);
const module = urlSearchParams.get('module');
var savedexam = urlSearchParams.get('savedexam')
var question;
var exam;
let examdata = [];
var del_exam_id = '';

// Developer - Nimit Shah
// Developed on - 21/12/2024
// Description - Use to initialize data for list view onload of page
// Updated on - -
// Input - none
async function listviewconnectedCallback() {
    try {
        await getEnglishJsonFile('../en_properties.json');
        Userlogo();
        if (savedexam == 'yes') {
            createToast('success', 'Exam has been saved');
            dynamicUrl = await getFilePaths("listview") + "?module=" + module;
            window.history.pushState({}, document.title, dynamicUrl);
        }
        examData();// need to call once
    } catch (error) {
        createToast('error', 'Error while loading : ' + error.message);
    }

}

// Developer - Nimit Shah
// Developed on - 21/12/2024
// Description - Use to open data entry page while clicking on new button
// Updated on - -
// Input - event
async function setHref(event) {
    try {

        if ((localStorage.getItem('user_data')) != null) {
            dynamicUrl = await getFilePaths("dataentry") + "?module=" + module;
            event.target.href = dynamicUrl;
            window.location.href = dynamicUrl;
        } else {
            createToast('error', 'Please login first')
        }
    } catch (error) {
        createToast('error', 'Error while redirecting : ' + error.message);
    }

}

// Developer - Nimit Shah
// Developed on - 21/12/2024
// Description - Use to open selected exam
// Updated on - -
// Input - event
async function openexam(event) {
    try {
        let questions = [];
        question.forEach(element => {
            if (element.examId == event.target.id) {
                questions.push(element);
            }
        });

        sessionStorage.setItem("question" + event.target.id, JSON.stringify(questions));

        dynamicUrl = await getFilePaths("dataentry") + "?module=" + module + '&tdExam=' + event.target.id;
        event.target.href = dynamicUrl;
        window.location.href = dynamicUrl;
    } catch (error) {
        createToast('error', 'Error while fetching exam : ' + error.message);
    }
}

// Developer - Nimit Shah
// Developed on - 21/12/2024
// Description - Use to get exam data of user while intializing page
// Updated on - -
// Input - none
function examData() {
    try {
        if ((JSON.parse(localStorage.getItem('user_data')) != null)) {
            const user_id = JSON.parse(localStorage.getItem('user_data')).id;
            apiURL = enProperties.apiURL + enProperties.apiEndPoints.studentApi + enProperties.apiEndPoints.examData
            fetch(`${apiURL}?user_id=${user_id}&module=${module}`)
                .then(response => response.json())
                .then(responseData => {
                    question = responseData;
                    if (question.length > 0) {

                        const Section1 = new Map();
                        const Section2 = new Map();
                        const Section3 = new Map();
                        const Section4 = new Map();
                        const Exammap = new Map();
                        let htmldata = "";

                        // Setting map for examid and date
                        responseData.forEach(element => {
                            Exammap.set(element.examId, {
                                'Name': element.examName,
                                'Date': element.examDate
                            });
                        });
                        // Calculating section wise marks for exach exam
                        question.forEach(element => {
                            if (element.section == 1) {
                                if (Section1.has(element.examId)) {
                                    Section1.set(element.examId, Section1.get(element.examId) + element.correct);
                                } else {
                                    Section1.set(element.examId, element.correct);
                                }
                            } else if (element.section == 2) {
                                if (Section2.has(element.examId)) {
                                    Section2.set(element.examId, Section2.get(element.examId) + element.correct);
                                } else {
                                    Section2.set(element.examId, element.correct);
                                }
                            } else if (element.section == 3) {
                                if (Section3.has(element.examId)) {
                                    Section3.set(element.examId, Section3.get(element.examId) + element.correct);
                                } else {
                                    Section3.set(element.examId, element.correct);
                                }
                            } else if (element.section == 4) {
                                if (Section4.has(element.examId)) {
                                    Section4.set(element.examId, Section4.get(element.examId) + element.correct);
                                } else {
                                    Section4.set(element.examId, element.correct);
                                }
                            }
                        });

                        // Arranging Data in Variable
                        for (const key of Exammap.keys()) {
                            let examDate = new Date(Exammap.get(key).Date);
                            let year = examDate.getFullYear();
                            let month = ('0' + (examDate.getMonth() + 1)).slice(-2);
                            let day = ('0' + examDate.getDate()).slice(-2);
                            examDate = `${year}-${month}-${day}`;

                            examdata.push({
                                'examId': key,
                                'examName': Exammap.get(key).Name,
                                'examDate': examDate,
                                'Section 1': (Section1.get(key) == undefined ? 0 : Section1.get(key)),
                                'Section 2': (Section2.get(key) == undefined ? 0 : Section2.get(key)),
                                'Section 3': (Section3.get(key) == undefined ? 0 : Section3.get(key)),
                                'Section 4': (Section4.get(key) == undefined ? 0 : Section4.get(key)),
                                'total': (Section1.get(key) == undefined ? 0 : Section1.get(key)) +
                                    (Section2.get(key) == undefined ? 0 : Section2.get(key)) +
                                    (Section3.get(key) == undefined ? 0 : Section3.get(key)) +
                                    (Section4.get(key) == undefined ? 0 : Section4.get(key)),
                            })
                        }


                        //Setting data to html
                        examdata.forEach((element, index) => {
                            htmldata +=
                                '<div class="data" id=' + element.examId + '>' +
                                '<div class="column index" onclick="openexam(event)" id=' + element.examId + '>' + (index + 1) + '</div>' +
                                '<div class="column examname" onclick="openexam(event)" id=' + element.examId + '>' + element.examName + '</div>' +
                                '<div class="column date" onclick="openexam(event)" id=' + element.examId + '>' + element.examDate + '</div>' +
                                '<div class="column total" onclick="openexam(event)" id=' + element.examId + '>' + element.total + '</div>' +
                                '<div class="column section" onclick="openexam(event)" id=' + element.examId + '>' + element["Section 1"] + '</div>' +
                                '<div class="column section" onclick="openexam(event)" id=' + element.examId + '>' + element["Section 2"] + '</div>' +
                                '<div class="column section" onclick="openexam(event)" id=' + element.examId + '>' + element["Section 3"] + '</div>' +
                                '<div class="column section" onclick="openexam(event)" id=' + element.examId + '>' + element["Section 4"] + '</div>' +
                                '<div class="column delete" onclick="deleteexam(event)" id=' + element.examId + `> <i class="fa fa-trash" id="${element.examId}" aria-hidden="true"></i>` +
                                '</div>' +
                                '</div>'
                        });

                        document.getElementById("table").innerHTML = htmldata;
                    } else {
                        createToast('error', 'No Data Found');
                    }
                })
                .catch(error => createToast('error', 'Error while fetching exams : ' + error.message));
        } else {
            createToast('error', 'Please Login First');
        }
    } catch (error) {
        createToast('error', 'Error while fetching exams : ' + error.message);
    }
}

// Developer - Nimit Shah
// Developed on - 21/12/2024
// Description - Use to get deleting exam id and open delete popup
// Updated on - -
// Input - event
function deleteexam(event) {
    try {
        del_exam_id = event.target.id;
        Array.from(document.getElementsByClassName('body_section')).forEach(element => {
            element.style.backdropFilter = "none";
        });
        Array.from(document.getElementsByClassName('delete-popup')).forEach(element => {
            element.style.display = "block";
        });
    } catch (error) {
        createToast('error', 'Error while deleting exam : ' + error.message);
    }
}

// Developer - Nimit Shah
// Developed on - 21/12/2024
// Description - Use to delete exam from the DB and close delete popup
// Updated on - -
// Input - event
function del(event) {
    try {
        if (event.target.id == 'yes') {
            apiURL = enProperties.apiURL + enProperties.apiEndPoints.studentApi + enProperties.apiEndPoints.deleteExam;
            fetch(`${apiURL}?examId=${del_exam_id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(response => response.json())
                .then(datas => {

                    const divToRemove = document.getElementById(del_exam_id);
                    divToRemove.remove();
                    examdata.forEach((element, i) => {
                        if (element.examId == del_exam_id) {
                            examdata.splice(i, 1);
                        }
                    });
                    createToast('success', 'Exam deleted');

                    if (examdata.length > 0) {
                        let htmldata = '';
                        examdata.forEach((element, index) => {
                            htmldata +=
                                '<div class="data" id=' + element.examId + '>' +
                                '<div class="column index" onclick="openexam(event)" id=' + element.examId + '>' + (index + 1) + '</div>' +
                                '<div class="column examname" onclick="openexam(event)" id=' + element.examId + '>' + element.examName + '</div>' +
                                '<div class="column date" onclick="openexam(event)" id=' + element.examId + '>' + element.examDate + '</div>' +
                                '<div class="column total" onclick="openexam(event)" id=' + element.examId + '>' + element.total + '</div>' +
                                '<div class="column section" onclick="openexam(event)" id=' + element.examId + '>' + element["Section 1"] + '</div>' +
                                '<div class="column section" onclick="openexam(event)" id=' + element.examId + '>' + element["Section 2"] + '</div>' +
                                '<div class="column section" onclick="openexam(event)" id=' + element.examId + '>' + element["Section 3"] + '</div>' +
                                '<div class="column section" onclick="openexam(event)" id=' + element.examId + '>' + element["Section 4"] + '</div>' +
                                '<div class="column delete" onclick="deleteexam(event)" id=' + element.examId + `> <i class="fa fa-trash" id="${element.examId}" aria-hidden="true"></i>` +
                                '</div>' +
                                '</div>'
                        });

                        document.getElementById("table").innerHTML = htmldata;
                    } else {
                        document.getElementById("table").innerHTML = '<span class="no_data">No Data Found!</span>';
                    }
                })
                .catch(error => {
                    createToast('error', 'Error while deleting exam : ' + error.message);
                });
        }

        Array.from(document.getElementsByClassName('body_section')).forEach(element => {
            element.style.backdropFilter = "blur(7.4px)";
        });
        Array.from(document.getElementsByClassName('delete-popup')).forEach(element => {
            element.style.display = "none";
        });
    } catch (error) {
        createToast('error', 'Error while deleting exam : ' + error.message);
    }
}

// Developer - Nimit Shah
// Developed on - 21/12/2024
// Description - Use to set spinner
// Updated on - -
// Input - none
window.addEventListener("beforeunload", function (event) {
    document.getElementById("spinner").style.display = 'flex';
    document.getElementById("main").style.display = 'none';
});

// Developer - Nimit Shah
// Developed on - 21/12/2024
// Description - Use to remove spinner
// Updated on - -
// Input - none
document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "hidden") {
        document.getElementById("spinner").style.display = 'none';
        document.getElementById("main").style.display = 'block';
    }
});