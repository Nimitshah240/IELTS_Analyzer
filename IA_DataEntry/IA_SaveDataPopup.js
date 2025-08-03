var module;
var tdExam;
let user_data = JSON.parse(localStorage.getItem('user_data'));
let question;
window.addEventListener('message', function (event) {
    try {
        const data = event.data;
        openAndSetPopup(data.data);
    } catch (error) {
        console.log(error);
    }
});

async function openAndSetPopup(data) {
    await getEnglishJsonFile("../CommonUtils/en_properties.json");

    document.getElementById('examdate').value = data.examDate;
    document.getElementById('examname').value = data.examName;
    module = data.module;
    tdExam = data.tdExam;
    question = data.question;
}


// Developer - Nimit Shah
// Developed on - 21/12/2024
// Description - Use to save exam in DB
// Updated on - -
// Input - event
async function saveexam(event) {
    try {
        console.log('saving..');

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
                    let id = element.id;
                    if (!(typeof id == "number") && id.includes('temp_')) {
                        element.id = id.replace("temp_", "");
                    }
                });
                // showSpinner('Saving exam ...');
                apiURL = enProperties.apiURL + enProperties.apiEndPoints.data;
                await apiCallOuts(apiURL, 'POST', JSON.stringify(question), 10000).then(() => {
                    popupclose(event);
                }).catch(error => {
                    // stopSpinner();
                    event.target.id = ''
                    // popupclose(event);
                    createToast('error', 'Error while saving data : ' + error.message);
                });
            } else {
                createToast('error', 'There is no question to save');
            }
        }
    } catch (error) {
        // stopSpinner();
        createToast('error', 'Error while saving data : ' + error.message);
    }
}

function popupclose(event) {
    parent.postMessage(
        { source: 'IA_SaveDataPopup', command: 'closePopup', data: event.target.id },
        enProperties.domainName
    );
}