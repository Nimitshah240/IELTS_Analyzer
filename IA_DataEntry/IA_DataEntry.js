const urlSearchParams = new URLSearchParams(window.location.search);
var module = urlSearchParams.get('module');
var tdExam = urlSearchParams.get('tdExam')
var question = [];
let exam_name = '';
let exam_id = '';
let exam_date = '';
let user_data = JSON.parse(localStorage.getItem('user_data'));
user_id = user_data.user_id;
let question_id = '';

// Developer - Nimit Shah
// Developed on - 21/12/2024
// Description - Use to initialize data for Data entry page
// Updated on - -
// Input - none
function dataentryconnectedCallback() {
    try {
        if ((JSON.parse(localStorage.getItem('question' + tdExam))).length == 0) {
            exam_date = `${new Date().getFullYear()}-${('0' + (new Date().getMonth() + 1)).slice(-2)}-${('0' + new Date().getDate()).slice(-2)}`;
            exam_id = '';
            exam_name = '';
        } else {
            exam_id = JSON.parse(localStorage.getItem('question' + tdExam))[0].exam_id
            exam_name = JSON.parse(localStorage.getItem('question' + tdExam))[0].exam_name;
            exam_date = new Date(JSON.parse(localStorage.getItem('question' + tdExam))[0].date);
            exam_date = `${exam_date.getFullYear()}-${('0' + (exam_date.getMonth() + 1)).slice(-2)}-${('0' + exam_date.getDate()).slice(-2)}`;
            question = JSON.parse(localStorage.getItem('question' + tdExam));
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

            document.getElementById('examdate').value = exam_date;
            document.getElementById('examname').value = exam_name;
            document.getElementById('save-div').style.display = 'flex';

        } else {
            var sectiondata = '<tr class="header-table"><th colspan="5"> Question Type</th></tr><tr class="header-table"><th> Correct </th><th> Incorrect </th><th> Missed </th><th> Total </th><th> Delete </th></tr>';
            question.forEach(element => {
                if (element.section == section) {
                    sectiondata +=
                        `<tr><td colspan="5" id = ${element.id}>` + element.question_type + '</td></tr >' +
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
function popupclose(event) {
    try {
        var type = event.target.id;
        if (type == 'save') {
            dynamicUrl = '../IA_Listview/IA_Listview.html?module=' + module + '&savedexam=yes';
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

        const selectElement = document.getElementById('question' + event.target.id);
        const question_type = selectElement.value;

        let correct = 0;
        let incorrect = 0;
        let miss = 0;
        let total;

        correct = parseInt(document.getElementById('correct' + event.target.id).value);
        incorrect = parseInt(document.getElementById('incorrect' + event.target.id).value);
        miss = parseInt(document.getElementById('miss' + event.target.id).value);
        total = correct + incorrect + miss;

        question.push(
            {
                "band": "",
                "correct": correct,
                "date": exam_date,
                "exam_id": exam_id == "" ? "" : exam_id,
                "exam_name": exam_name == "" ? "" : exam_name,
                "id": "temp_" + question.length,
                "incorrect": incorrect,
                "miss": miss,
                "module": module,
                "question_type": question_type,
                "section": event.target.id,
                "total": total,
                "user_id": user_id,
            }
        )

        document.getElementById('correct' + event.target.id).value = 0;
        document.getElementById('incorrect' + event.target.id).value = 0;
        document.getElementById('miss' + event.target.id).value = 0
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
function saveexam(event) {
    try {
        let exam_name = ''
        let exam_date = ''
        exam_name = document.getElementById('examname').value;
        exam_date = document.getElementById('examdate').value;

        if (exam_date == '' || exam_name.trim() == '') {
            createToast('error', 'Fill require details');
        } else {

            if (question.length > 0) {
                let correct = 0;
                let band = 0;
                exam_date = new Date(exam_date);

                exam_date = exam_date.toISOString().slice(0, 10);
                question.forEach(element => {
                    element.date = exam_date;
                    element.exam_name = exam_name;
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

                fetch('http://localhost:3000/api/insertExam', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'exam_id': exam_id == "" ? "" : exam_id
                    },
                    body: JSON.stringify(question),
                }).then(response => {
                    popupclose(event);

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
        question_id = event.target.id;
        Array.from(document.getElementsByClassName('glass')).forEach(element => {
            element.style.backdropFilter = "none";
        });
        Array.from(document.getElementsByClassName('front-div')).forEach(element => {
            element.style.display = "none";
        });
        Array.from(document.getElementsByClassName('delete-popup')).forEach(element => {
            element.style.display = "block";
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
function del(event) {
    try {
        if (event.target.id == 'yes') {
            if (!question_id.includes('temp')) {
                fetch(`http://localhost:3000/api/deleteQuestion?question_id=${question_id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                    .then(response => response.json())
                    .then(data => {
                        for (let index = 0; index < 2; index++) {
                            const divToRemove = document.getElementById(question_id);
                            divToRemove.remove();
                        }

                        question.forEach((element, i) => {
                            if (element.id == question_id) {
                                question.splice(i, 1);
                            }
                        });
                        localStorage.setItem('question' + tdExam, JSON.stringify(question))
                        createToast('success', 'Question deleted');
                    })
                    .catch(error =>
                        createToast('error', 'Error while deleting data : ' + error.message));
            } else {
                question.forEach((element, i) => {
                    if (element.id == question_id) {
                        question.splice(i, 1);
                    }
                });
                localStorage.setItem('question' + tdExam, JSON.stringify(question))
                createToast('success', 'Question deleted');

            }
        }
        Array.from(document.getElementsByClassName('glass')).forEach(element => {
            element.style.backdropFilter = "blur(1px)";
        });
        Array.from(document.getElementsByClassName('delete-popup')).forEach(element => {
            element.style.display = "none";
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