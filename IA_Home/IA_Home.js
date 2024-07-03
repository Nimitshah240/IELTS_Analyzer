var user_id;
async function connectedCallback(event) {
    try {

        // HELPFUL METHOD FOR SUMMING ARRAY !!!! DO NOT REMOVE UNTIL IT USE.
        // const number = [1,2,3,4,5];
        // const sum = number.reduce((accumulator, currentvalue) => accumulator + currentvalue,0);
        // console.log(sum);

        signincheck(() => {
            fetchUserData();
        });

    } catch (error) {
        console.log('e', error);
    }
}

async function fetchUserData() {
    try {
        let today = new Date();
        let year = today.getFullYear();
        let month = ('0' + (today.getMonth() + 1)).slice(-2);
        let day = ('0' + today.getDate()).slice(-2);
        today = `${year}-${month}-${day}`;

        const data = JSON.parse(localStorage.getItem('user_data'));
        if (data) {
            data.fl_date = today;
            data.ll_date = today;
            data.email = undefined;    // remove if you get email from the first google login 
            data.location = undefined; // remove if you get location from the first google login

            delete data.family_name;
            delete data.given_name;

            fetch('http://localhost:3000/logindata', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })
                .then(response => response.json())
                .then(responseData => {
                    document.getElementById('not-log').style.display = 'none';
                    document.getElementById('login-img').style.display = 'block';
                    document.getElementById('login-img').setAttribute('src', responseData.picture);
                    user_id = responseData.user_id;
                    fetchExamData();
                })
                .catch(error => console.error('Error:', error.message));
        }

    } catch (error) {
        console.error(error);
    }
}

async function fetchExamData() {
    try {

        const user_data = JSON.parse(localStorage.getItem('user_data'));
        let listening_exam_count = 0;
        let reading_exam_count = 0;
        let reading_question_count = 0;
        let listening_question_count = 0;
        let exam;
        let question;
        let questionmap = new Map();
        let readingband = [];
        let listeningband = [];


        fetch('http://localhost:3000/examdata', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user_data),
        })
            .then(response => response.json())
            .then(responseData => {

                exam = responseData.exam;
                question = responseData.question;

                question.forEach(element => {
                    let questionlist = [];
                    if (questionmap.has(element.exam_id)) {
                        questionlist = questionmap.get(element.exam_id);
                    }
                    questionlist.push(element);
                    questionmap.set(element.exam_id, questionlist);
                });

                exam.forEach(element => {
                    let a = questionmap.get(element.id);
                    if (element.module == 'Reading') {
                        reading_exam_count++;
                        readingband.push(element.band);
                        if (a != undefined) {
                            reading_question_count += a.length;
                        }
                    } else {
                        listening_exam_count++;
                        listeningband.push(element.band);
                        if (a != undefined) {
                            listening_question_count += a.length;
                        }
                    }
                });

                document.getElementById("listening-band").innerHTML = calculateAverage(listeningband) + ' Band';
                document.getElementById("reading-band").innerHTML = calculateAverage(readingband) + ' Band';
                document.getElementById("question-count-listening").innerHTML = listening_question_count + ' Question';
                document.getElementById("question-count-reading").innerHTML = reading_question_count + ' Question';
                document.getElementById("count-listening").innerHTML = listening_exam_count + ' Exam';
                document.getElementById("count-reading").innerHTML = reading_exam_count + ' Exam';

            })
            .catch(error => console.error('Error:', error));

    } catch (error) {
        console.error(error);
    }
}

function calculateAverage(numbers) {
    if (numbers.length === 0) {
        return 0; // Handle edge case for empty array
    }

    const sum = numbers.reduce((acc, curr) => acc + curr, 0);
    const average = sum / numbers.length;
    const roundToNearestHalf = (num) => Math.round(num * 2) / 2;

    return roundToNearestHalf(average);
}

function setHref(event) {
    try {
        var dynamicUrl;
        let buttonId = event.target.id;

        if (buttonId == 'selection') {
            dynamicUrl = '../IA_Selection/IA_Selection.html?type=data';
        } else if (buttonId == 'dashboard') {
            dynamicUrl = '../IA_Selection/IA_Selection.html?type=dashboard';
        }

        event.target.href = dynamicUrl;
        window.location.href = dynamicUrl;
    } catch (error) {
        console.error(error);
    }
}
