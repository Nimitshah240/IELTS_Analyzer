const urlSearchParams = new URLSearchParams(window.location.search);
let signin = '';
signin = urlSearchParams.get('signedin');
var examdata;
var index = 0;
var images = [];
var imageElement;
let hero;
let numText;
let heroContent;
let heroText;
const slides = [
    { image: "Asset\/5790b59f9d49b818ca27538455000a07.jpg", text: "01 / 02", heroText: 'Welcome to IELTS ANALYZER. We specialize in transforming IELTS exam data into insightful visualizations that enhance understanding and facilitate better preparation for test-takers.', button: ["Data", "Dashboard"], buttonURL: ['data', 'dashboard'] },
    { image: "Asset\/380764fbad3e9dd30345b06511ed756e.jpg", text: "02 / 02", heroText: 'On the Tricks page, you will find a collection of effective techniques and strategies designed to help you master the art of answering reading and listening questions, improving your skills and performance.', button: ['Knowledge'], buttonURL: ['tips'] }
];

window.addEventListener('scroll', () => {
    const logo = document.getElementById('logo');
    const navbar = document.getElementById('navbar');

    if (window.scrollY > 0) {
        navbar.style.backgroundColor = '#161F1E'
        navbar.style.justifyContent = 'space-between';
        navbar.style.borderBottom = '1px solid white';
        logo.style.display = 'block';
    } else {
        logo.style.display = 'none';
        navbar.style.justifyContent = 'flex-end';
        navbar.style.backgroundColor = 'transparent'
        navbar.style.borderBottom = '0px';
    }
});

// Developer - Nimit Shah
// Developed on - 21/12/2024
// Description - Use to initialise data onloading home page
// Updated on - -
// Input - none
function indexconnectedCallback() {
    try {
        hero = document.getElementById("hero");
        heroContent = document.getElementById("hero-content");
        numText = document.getElementById("slide-indicator");
        heroText = document.getElementById("hero-text");

        updateSlide();
        Userlogo();

        if (JSON.parse(localStorage.getItem('user_data')) != null) {
            if (signin) {
                window.history.pushState({}, document.title, "/");
                createToast('success', "Welcome " + JSON.parse(localStorage.getItem('user_data')).firstname)
            }
            // fetchExamData();// Control api callout
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
let currentIndex = 0;
function updateSlide() {
    try {
        const currentSlide = slides[currentIndex];
        hero.style.backgroundImage = `url(${currentSlide.image})`;
        heroContent.style.animation = "none"; // Reset animation
        heroContent.offsetHeight; // Trigger reflow to restart animation
        heroContent.style.animation = "slideText 1s forwards";
        heroText.textContent = currentSlide.heroText;
        setTimeout(() => {
            numText.textContent = currentSlide.text;

        }, 500);
        let htmlbuttons = '';
        currentSlide.button.forEach((element, index) => {
            if (index % 2 === 0 || index === 0) {
                htmlbuttons += `<button class="btn btn-primary green-button" onclick="setHref(event)" id="${currentSlide.buttonURL[index]}">${element}</button>`
            } else {
                htmlbuttons += `<button class="btn btn-primary white-button" onclick="setHref(event)" id="${currentSlide.buttonURL[index]}">${element}</button>`
            }
        });

        document.getElementById("buttons").innerHTML = htmlbuttons;
        currentIndex = (currentIndex + 1) % slides.length;
    } catch (error) {
        createToast('error', 'Error while loading : ' + error.message);
    }
}
setInterval(updateSlide, 5000);

// Developer - Nimit Shah
// Developed on - 21/12/2024
// Description - It use to get user exam data to show on home page (NOT IN USE ANYMORE, REMOVE IT IN CLEANUP PROCESS).
// Updated on - 05/02/2025 
// Input - none
// async function fetchExamData() {
//     try {
//         const user_data = JSON.parse(localStorage.getItem('user_data'));
//         const user_id = user_data.user_id;
//         const module = undefined;
//         let listening_exam_count = 0;
//         let reading_exam_count = 0;
//         let reading_question_count = 0;
//         let listening_question_count = 0;
//         let readingband = [];
//         let listeningband = [];
//         let exammap = new Map();

//         fetch(`https://ielts-analyzer.onrender.com/api/examdata?user_id=${user_id}&module=${module}`)
//             .then(response => response.json())
//             .then(responseData => {
//                 responseData.forEach(element => {
//                     exammap.set(element.exam_id, { 'band': element.band, 'module': element.module });
//                     if (element.module == 'Reading' && element.id != null) {
//                         reading_question_count += element.total;
//                     } else if (element.module == 'Listening' && element.id != null) {
//                         listening_question_count += element.total;
//                     }
//                 });

//                 exammap.forEach(element => {
//                     if (element.module == 'Reading') {
//                         reading_exam_count++;
//                         readingband.push(element.band);
//                     } else {
//                         listening_exam_count++;
//                         listeningband.push(element.band);
//                     }
//                 });

//                 document.getElementById("listening-band").innerHTML = calculateAverage(listeningband);
//                 document.getElementById("reading-band").innerHTML = calculateAverage(readingband);
//                 document.getElementById("question-count-listening").innerHTML = listening_question_count;
//                 document.getElementById("question-count-reading").innerHTML = reading_question_count;
//                 document.getElementById("count-listening").innerHTML = listening_exam_count;
//                 document.getElementById("count-reading").innerHTML = reading_exam_count;
//             })
//             .catch(error => createToast('error', 'Error while fetching exam data : ' + error));

//     } catch (error) {
//         createToast('error', 'Error while fetching exam data : ' + error);
//     }
// }

// Developer - Nimit Shah
// Developed on - 21/12/2024
// Description - Use to calculate average band of user (NOT IN USE ANYMORE, REMOVE IT IN CLEANUP PROCESS).
// Updated on - 05/02/2025
// Input - band
// function calculateAverage(numbers) {
//     if (numbers.length === 0) {
//         return 0;
//     }
//     const sum = numbers.reduce((acc, curr) => acc + curr, 0);
//     const average = sum / numbers.length;
//     const roundToNearestHalf = (num) => Math.round(num * 2) / 2;
//     return roundToNearestHalf(average);
// }

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
// Description - Use to save feedback of any user. (NOT IN USE ANYMORE, REMOVE IT IN CLEANUP PROCESS).
// Updated on - 05/02/2025
// Input - none
// function sendemail() {
//     try {
//         let user_id = ((localStorage.getItem('user_data'))) == null ? "" : JSON.parse(localStorage.getItem('user_data')).user_id;
//         var name = document.getElementById('name').value;
//         var email = document.getElementById('email').value;
//         var message = document.getElementById('message').value;
//         let data = { 'user_id': user_id, 'name': name, 'email': email, 'message': message };
//         var re = /\S+@\S+\.\S+/;

//         if (data.name.trim() != '' && data.email.trim() != '' && re.test(email)) {
//             fetch('https://ielts-analyzer.onrender.com/api/feedback', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify(data),
//             })
//                 .then(() => {
//                     name = document.getElementById('name').value = '';
//                     email = document.getElementById('email').value = '';
//                     message = document.getElementById('message').value = '';
//                     createToast('success', 'Thank you for your feedback');
//                 })
//                 .catch(error => createToast('error', 'Error while sending email : ' + error.message));

//         } else {
//             createToast('error', 'Please fill required data');
//         }

//     } catch (error) {
//         createToast('error', 'Error while sending email : ' + error.message);
//     }
// }


// Developer - Nimit Shah
// Developed on - 21/12/2024
// Description - Use to set spinner
// Updated on - -
// Input - none
window.addEventListener("beforeunload", function (event) {
    document.getElementById("main").style.display = 'none';
    document.getElementById("spinner").style.display = 'flex';
});

// Developer - Nimit Shah
// Developed on - 21/12/2024
// Description - Use to remove spinner
// Updated on - -
// Input - none
document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "hidden") {
        document.getElementById("main").style.display = 'block';
        document.getElementById("spinner").style.display = 'none';
    }
});