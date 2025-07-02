const urlSearchParams = new URLSearchParams(window.location.search);
var module = urlSearchParams.get('module');
var tdExam = urlSearchParams.get('tdExam')
var question = [];
let examName = '';
let examId = '';
let examDate = '';
let user_data = JSON.parse(localStorage.getItem('user_data'));
studentId = user_data.id;
let questionId = '';

// Developer - Nimit Shah
// Developed on - 21/12/2024
// Description - Use to initialize data for Data entry page
// Updated on - -
// Input - none
async function dataentryconnectedCallback() {
    try {
        await getEnglishJsonFile("../en_properties.json");
        if ((JSON.parse(sessionStorage.getItem('question' + tdExam))) == null || (JSON.parse(sessionStorage.getItem('question' + tdExam))).length == 0) {
            examDate = `${new Date().getFullYear()}-${('0' + (new Date().getMonth() + 1)).slice(-2)}-${('0' + new Date().getDate()).slice(-2)}`;
            examId = '';
            examName = '';
        } else {
            examId = JSON.parse(sessionStorage.getItem('question' + tdExam))[0].examId
            examName = JSON.parse(sessionStorage.getItem('question' + tdExam))[0].examName;
            examDate = new Date(JSON.parse(sessionStorage.getItem('question' + tdExam))[0].examDate);
            examDate = `${examDate.getFullYear()}-${('0' + (examDate.getMonth() + 1)).slice(-2)}-${('0' + examDate.getDate()).slice(-2)}`;
            question = JSON.parse(sessionStorage.getItem('question' + tdExam));
        }
        sectionsetter();
        Userlogo();
    } catch (error) {
        createToast('error', 'Error while loading : ' + error.message);
    }
}

// Developer - Nimit Shah
// Developed on - 21/12/2024
// Description - Use to set number of section depending on Reading or Listening module
// Updated on - -
// Input - none
function sectionsetter() {
    try {
        let html;
        if (module == 'Reading') {
            document.getElementById('section4').style.display = 'none';

            for (let index = 0; index < 4; index++) {
                let q = document.getElementById(`question${index + 1}`);
                html =
                    '<option value="MCQ">MCQ</option>' +
                    '<option value="True/False/Not Given">True/False/Not Given </option>' +
                    '<option value="Yes/No/Not Given">Yes/No/Not Given</option>' +
                    '<option value="Matching Heading">Matching Heading</option>' +
                    '<option value="Matching Feature">Matching Feature</option>' +
                    '<option value="Match Paragraph">Match Paragraph</option>' +
                    '<option value="Complete Sentence Ending">Complete Sentence Ending</option>' +
                    '<option value="Summary Completion">Summary Completion</option>' +
                    '<option value="Table Completion">Table Completion</option>' +
                    '<option value="Flow Chart">Flow Chart</option>' +
                    '<option value="Short Answer">Short Answer</option>' +
                    '<option value="Note Completion">Note Completion</option>' +
                    '<option value="Diagram Labelling">Diagram Labelling</option>';
                q.innerHTML = html;
            }
        } else {
            document.getElementById('section4').style.display = 'flex';

            for (let index = 0; index < 4; index++) {
                let q = document.getElementById(`question${index + 1}`);
                html =
                    '<option value="MCQ">MCQ</option>' +
                    '<option value="Extended MCQ">Extended MCQ</option>' +
                    '<option value="Classification">Classification</option>' +
                    '<option value="Map">Map</option>' +
                    '<option value="Sentence Completion">Sentence Completion</option>' +
                    '<option value="Form Completion">Form Completion</option>' +
                    '<option value="Note Completion">Note Completion</option>' +
                    '<option value="Summary Completion">Summary Completion</option>' +
                    '<option value="Table Completion">Table Completion</option>' +
                    '<option value="Flow Chart">Flow Chart</option>' +
                    '<option value="Short Answer">Short Answer</option>';
                q.innerHTML = html;
            }
        }

    } catch (error) {
        createToast('error', 'Error while setting data : ' + error.message);
    }
}

// Developer - Nimit Shah
// Developed on - 21/12/2024
// Description - Use to open exam save or show data popup 
// Updated on - -
// Input - event
function popupopen(event) {
    try {

        var section = event.target.dataset.section;
        var type = event.target.id;

        if (type == 'save') {

            document.getElementById('examdate').value = examDate;
            document.getElementById('examname').value = examName;
            document.getElementById('save-div').style.display = 'flex';

        } else {
            var sectiondata = '<tr class="header-table"><th colspan="5"> Question Type</th></tr><tr class="header-table"><th> Correct </th><th> Incorrect </th><th> Missed </th><th> Total </th><th> Delete </th></tr>';
            question.forEach(element => {

                if (element.section == section) {
                    sectiondata +=
                        `<tr><td colspan="5" id = ${element.id}>` + element.questionType + '</td></tr >' +
                        `<tr id = ${element.id}>` +
                        '<td>' + element.correct + '</td>' +
                        '<td>' + element.incorrect + '</td>' +
                        '<td>' + element.miss + '</td>' +
                        '<td> ' + element.total + ' </td>' +
                        `<td id = "${element.id}" onclick="deletequestion(event)" class="question-delete"><i class="fa fa-trash" aria-hidden="true"id=${element.id}></i> </td> </tr>`;
                }
            });
            document.getElementById('show-div').style.display = 'flex';
            document.getElementById("table").innerHTML = sectiondata;
            document.getElementById("data-title").innerHTML = 'Section ' + section;

        }
    } catch (error) {
        createToast('error', 'Error while loading exam data : ' + error.message);
    }
}

// Developer - Nimit Shah
// Developed on - 21/12/2024
// Description - Use to close show data popup or close save exam div and redirect to list view
// Updated on - -
// Input - event
async function popupclose(event) {
    try {
        var type = event.target.id;
        if (type == 'save') {
            dynamicUrl = await getFilePaths("listview") + "?module=" + module + '&savedexam=yes';
            event.target.href = dynamicUrl;
            window.location.href = dynamicUrl;
        } else {
            document.getElementById('save-div').style.display = 'none';
            document.getElementById('show-div').style.display = 'none';
        }

    } catch (error) {
        console.error(error);
    }
}

// Developer - Nimit Shah
// Developed on - 21/12/2024
// Description - Use to get data on each "save and new" button click
// Updated on - -
// Input - event
function getData(event) {
    try {

        let section = event.target.dataset.section;

        const selectElement = document.getElementById('question' + section);
        const questionType = selectElement.value;

        let correct = 0;
        let incorrect = 0;
        let miss = 0;
        let total;

        correct = parseInt(document.getElementById('correct' + section).value);
        incorrect = parseInt(document.getElementById('incorrect' + section).value);
        miss = parseInt(document.getElementById('miss' + section).value);
        total = correct + incorrect + miss;

        question.push(
            {
                "band": "",
                "correct": correct,
                "date": examDate,
                "examId": examId == "" ? "" : examId,
                "examName": examName == "" ? "" : examName,
                "id": question.length + 1,
                "incorrect": incorrect,
                "miss": miss,
                "module": module,
                "questionType": questionType,
                "section": section,
                "total": total,
                "studentId": studentId,
            }
        )

        document.getElementById('correct' + section).value = 0;
        document.getElementById('incorrect' + section).value = 0;
        document.getElementById('miss' + section).value = 0
        selectElement.value = 'MCQ';
        createToast('success', 'Question saved temporarily');

    } catch (error) {
        createToast('error', 'Error while getting data : ' + error.message);
    }
}

// Developer - Nimit Shah
// Developed on - 21/12/2024
// Description - Use to save exam in DB
// Updated on - -
// Input - event
async function saveexam(event) {
    try {
        let examName = ''
        let examDate = ''
        examName = document.getElementById('examname').value;
        examDate = document.getElementById('examdate').value;

        if (examDate == '' || examName.trim() == '') {
            createToast('error', 'Fill require details');
        } else {

            if (question.length > 0) {
                let correct = 0;
                let band = 0;
                examDate = new Date(examDate);

                examDate = examDate.toISOString().slice(0, 10);
                question.forEach(element => {
                    element.examDate = examDate;
                    element.examName = examName;
                    correct += element.correct;
                });

                if (user_data.type == 'general' && module == 'Reading') {
                    if (correct >= 15 && correct <= 18) { band = 4; }
                    else if (correct >= 19 && correct <= 22) { band = 4.5; }
                    else if (correct >= 23 && correct <= 26) { band = 5; }
                    else if (correct >= 27 && correct <= 29) { band = 5.5; }
                    else if (correct >= 30 && correct <= 31) { band = 6; }
                    else if (correct >= 32 && correct <= 33) { band = 6.5; }
                    else if (correct >= 34 && correct <= 35) { band = 7; }
                    else if (correct == 36) { band = 7.5; }
                    else if (correct >= 37 && correct <= 38) { band = 8; }
                    else if (correct == 39) { band = 8.5 }
                    else if (correct == 40) { band = 9; }
                } else {
                    if (correct >= 10 && correct <= 12) { band = 4; }
                    else if (correct >= 13 && correct <= 15) { band = 4.5; }
                    else if (correct >= 16 && correct <= 17) { band = 5; }
                    else if (correct >= 18 && correct <= 22) { band = 5.5; }
                    else if (correct >= 23 && correct <= 25) { band = 6; }
                    else if (correct >= 26 && correct <= 29) { band = 6.5 }
                    else if (correct >= 30 && correct <= 31) { band = 7; }
                    else if (correct >= 32 && correct <= 34) { band = 7.5; }
                    else if (correct >= 35 && correct <= 36) { band = 8; }
                    else if (correct >= 37 && correct <= 38) { band = 8.5 }
                    else if (correct >= 39 && correct <= 40) { band = 9; }
                }

                question.forEach(element => {
                    element.band = band;

                });
                apiURL = enProperties.apiURL + enProperties.apiEndPoints.data;
                await apiCallOuts(apiURL, 'POST', JSON.stringify(question), 20000).then(() => {
                    popupclose(event);
                }).catch(error => {
                    event.target.id = ''
                    popupclose(event);
                    createToast('error', 'Error while saving data : ' + error.message);
                });
            } else {
                createToast('error', 'There is no question to save');
            }
        }
    } catch (error) {
        createToast('error', 'Error while saving data : ' + error.message);
    }
}

// Developer - Nimit Shah
// Developed on - 21/12/2024
// Description - Use to get id of deleting question and open delete popup
// Updated on - -
// Input - event
function deletequestion(event) {
    try {
        questionId = event.target.id;
        Array.from(document.getElementsByClassName('glass')).forEach(element => {
            element.style.backdropFilter = "none";
        });
        Array.from(document.getElementsByClassName('front-div')).forEach(element => {
            element.style.display = "none";
        });
        Array.from(document.getElementsByClassName('delete-popup')).forEach(element => {
            element.style.display = "block";
        });
        Array.from(document.getElementsByClassName('info-container')).forEach(element => {
            element.style.position = "static";
        });

    } catch (error) {
        createToast('error', 'Error while deleting data : ' + error.message);
    }

}

// Developer - Nimit Shah
// Developed on - 21/12/2024
// Description - Use to delete selected temporary or permanent question and close delete popup
// Updated on - -
// Input - event
async function del(event) {
    try {
        let permcount = 0;
        if (event.target.id == 'yes') {
            if (!questionId.includes('temp')) {
                question.forEach(element => {
                    if (!JSON.stringify(element.id).includes('temp')) {
                        permcount++;
                    }
                });
                if (permcount > 1) {
                    apiURL = enProperties.apiURL + enProperties.apiEndPoints.data + enProperties.apiEndPoints.deleteQuestion + `?questionId=${questionId}`;
                    let deleteQuestionBody = {
                        "questionId": questionId,
                        "studentId": studentId,
                        "module": module
                    }
                                        
                    await apiCallOuts(apiURL, 'DELETE', JSON.stringify(deleteQuestionBody), 10000).then(() => {

                        for (let index = 0; index < 2; index++) {
                            const divToRemove = document.getElementById(questionId);
                            divToRemove.remove();
                        }

                        question.forEach((element, i) => {
                            if (element.id == questionId) {
                                question.splice(i, 1);
                            }
                        });
                        if (tdExam != null)
                            sessionStorage.setItem('question' + tdExam, JSON.stringify(question))

                        createToast('success', 'Question deleted');
                    }).catch(error => {
                        createToast('error', 'Error while deleting data : ' + error.message);
                    });
                } else {
                    createToast('error', 'Cannot delete last stored type');
                    createToast('info', 'Store new question and save exam before deleting last stored type');

                }
            } else {
                question.forEach((element, i) => {
                    if (element.id == questionId) {
                        question.splice(i, 1);
                    }
                });
                if (tdExam != null)
                    sessionStorage.setItem('question' + tdExam, JSON.stringify(question));

                createToast('success', 'Question deleted');

            }
        }
        Array.from(document.getElementsByClassName('glass')).forEach(element => {
            element.style.backdropFilter = "blur(1px)";
        });
        Array.from(document.getElementsByClassName('delete-popup')).forEach(element => {
            element.style.display = "none";
        });
        Array.from(document.getElementsByClassName('info-container')).forEach(element => {
            element.style.position = "relative";
        });

    } catch (error) {
        createToast('error', 'Error while deleting data : ' + error.message);
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