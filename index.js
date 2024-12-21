var examdata;
var index = 0;
var images = [];
var readingimage = [];
var readingimageElement;
var imageElement;

// Developer - Nimit Shah
// Developed on - 21/12/2024
// Description - Use to initialise data onloading home page
// Updated on - -
// Input - none
function indexconnectedCallback() {
    try {
        images[0] = ['Asset\/2148573970.jpg'];
        images[1] = ['Asset\/2148524577.jpg'];
        readingimage = ['Asset\/2149200171.jpg', 'Asset\/1209.jpg']
        imageElement = document.getElementById('listening-img');
        readingimageElement = document.getElementById('reading-img');


        change();
        Userlogo();

        if (JSON.parse(localStorage.getItem('user_data')) != null) {
            if (signin) {
                window.history.pushState({}, document.title, "/IA_Code/index.html");
                createToast('success', "Welcome " + JSON.parse(localStorage.getItem('user_data')).firstname)
            }
            fetchExamData();// Control api callout
        }

    } catch (error) {
        createToast('error', 'Error while loading : ' + error.message);
    }
}

// Developer - Nimit Shah
// Developed on - 21/12/2024
// Description - Use to change photo of reading and listening div in every 6 seconds
// Updated on - -
// Input - none
function change() {
    try {
        imageElement.classList.add('hidden');
        readingimageElement.classList.add('hidden');
        setTimeout(() => {
            // For listening
            index = (index + 1) % images.length;
            imageElement.src = images[index];
            imageElement.classList.remove('hidden');

            // For reading
            readingimageElement.src = readingimage[index];
            readingimageElement.classList.remove('hidden');
        }, 1000);

    } catch (error) {
        createToast('error', 'Error while changing image : ' + error.message);
    }
}
setInterval(change, 6000);

// Developer - Nimit Shah
// Developed on - 21/12/2024
// Description - It use to get user exam data to show on home page.
// Updated on - -
// Input - none
async function fetchExamData() {
    try {
        const user_data = JSON.parse(localStorage.getItem('user_data'));
        const user_id = user_data.user_id;
        const module = undefined;
        let listening_exam_count = 0;
        let reading_exam_count = 0;
        let reading_question_count = 0;
        let listening_question_count = 0;
        let readingband = [];
        let listeningband = [];
        let exammap = new Map();

        fetch(`http://localhost:3000/api/examdata?user_id=${user_id}&module=${module}`)
            .then(response => response.json())
            .then(responseData => {
                responseData.forEach(element => {
                    exammap.set(element.exam_id, { 'band': element.band, 'module': element.module });
                    if (element.module == 'Reading' && element.id != null) {
                        reading_question_count++;
                    } else if (element.module == 'Listening' && element.id != null) {
                        listening_question_count++;
                    }
                });

                exammap.forEach(element => {
                    if (element.module == 'Reading') {
                        reading_exam_count++;
                        readingband.push(element.band);
                    } else {
                        listening_exam_count++;
                        listeningband.push(element.band);
                    }
                });

                document.getElementById("listening-band").innerHTML = calculateAverage(listeningband);
                document.getElementById("reading-band").innerHTML = calculateAverage(readingband);
                document.getElementById("question-count-listening").innerHTML = listening_question_count;
                document.getElementById("question-count-reading").innerHTML = reading_question_count;
                document.getElementById("count-listening").innerHTML = listening_exam_count;
                document.getElementById("count-reading").innerHTML = reading_exam_count;
            })
            .catch(error => createToast('error', 'Error while fetching exam data : ' + error));

    } catch (error) {
        createToast('error', 'Error while fetching exam data : ' + error);
    }
}

// Developer - Nimit Shah
// Developed on - 21/12/2024
// Description - Use to calculate average band of user.
// Updated on - -
// Input - band
function calculateAverage(numbers) {
    if (numbers.length === 0) {
        return 0;
    }
    const sum = numbers.reduce((acc, curr) => acc + curr, 0);
    const average = sum / numbers.length;
    const roundToNearestHalf = (num) => Math.round(num * 2) / 2;
    return roundToNearestHalf(average);
}

// Developer - Nimit Shah
// Developed on - 21/12/2024
// Description - Use to set URL link of pages such as DATA, DASHBOARD, TRICK page
// Updated on - -
// Input - event
function setHref(event) {
    try {

        var dynamicUrl;
        let buttonId = event.target.id;

        if (buttonId == 'data') {
            dynamicUrl = './IA_Selection/IA_Selection.html?type=data';
        } else if (buttonId == 'dashboard') {
            dynamicUrl = './IA_Selection/IA_Selection.html?type=dashboard';
        } else if (buttonId == 'tips') {
            dynamicUrl = './IA_Selection/IA_Selection.html?type=trick';
        }

        event.target.href = dynamicUrl;
        window.location.href = dynamicUrl;

    } catch (error) {
        createToast('error', 'Error while redirecting : ' + error.message);
    }
}

// Developer - Nimit Shah
// Developed on - 21/12/2024
// Description - Use to save feedback of any user.
// Updated on - -
// Input - none
function sendemail() {
    try {
        let user_id = ((localStorage.getItem('user_data'))) == null ? "" : JSON.parse(localStorage.getItem('user_data')).user_id;
        var name = document.getElementById('name').value;
        var email = document.getElementById('email').value;
        var message = document.getElementById('message').value;
        let data = { 'user_id': user_id, 'name': name, 'email': email, 'message': message };
        var re = /\S+@\S+\.\S+/;

        if (data.name.trim() != '' && data.email.trim() != '' && re.test(email)) {
            fetch('http://localhost:3000/api/feedback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })
                .then(() => {
                    name = document.getElementById('name').value = '';
                    email = document.getElementById('email').value = '';
                    message = document.getElementById('message').value = '';
                    createToast('success', 'Thank you for your feedback');
                })
                .catch(error => createToast('error', 'Error while sending email : ' + error.message));

        } else {
            createToast('error', 'Please fill required data');
        }

    } catch (error) {
        createToast('error', 'Error while sending email : ' + error.message);
    }
}


// Developer - Nimit Shah
// Developed on - 21/12/2024
// Description - Use to set spinner
// Updated on - -
// Input - none
window.addEventListener("beforeunload", function (event) {
    Array.from(document.getElementById('main')).forEach(element => {
        element.style.display = "none"
    });
    document.getElementById("spinner").style.display = 'flex';
});

// Developer - Nimit Shah
// Developed on - 21/12/2024
// Description - Use to remove spinner
// Updated on - -
// Input - none
document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "hidden") {
        document.getElementById("spinner").style.display = 'none';
        Array.from(document.getElementById('main')).forEach(element => {
            element.style.display = "block"
        });
    }
});