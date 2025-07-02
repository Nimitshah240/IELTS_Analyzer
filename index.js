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
async function indexconnectedCallback() {
    try {
        hero = document.getElementById("hero");
        heroContent = document.getElementById("hero-content");
        numText = document.getElementById("slide-indicator");
        heroText = document.getElementById("hero-text");
        await getEnglishJsonFile('en_properties.json');
        document.getElementById('version-number').innerText = enProperties.versionNumber;
        document.getElementById('version-date').innerText = enProperties.versionDate;

        updateSlide();
        Userlogo();

        if (JSON.parse(localStorage.getItem('user_data')) != null && signin) {
            createToast('success', "Welcome " + JSON.parse(localStorage.getItem('user_data')).name);
            dynamicUrl = await getFilePaths("index");
            window.history.pushState({}, document.title, dynamicUrl);
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
        currentIndex = currentIndex == 2 ? 0 : currentIndex;
        const currentSlide = enProperties.slides[currentIndex];
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
        currentIndex = (currentIndex + 1) % enProperties.slides.length;
    } catch (error) {
        createToast('error', 'Error while loading : ' + error.message);
    }
}
setInterval(updateSlide, 5000);

// Developer - Nimit Shah
// Developed on - 21/12/2024
// Description - Use to set URL link of pages such as DATA, DASHBOARD, TRICK page
// Updated on - -
// Input - event
async function setHref(event) {
    try {

        let buttonId = event.target.id;
        dynamicUrl = await getFilePaths("selection") + "?type=" + buttonId;
        event.target.href = dynamicUrl;
        window.location.href = dynamicUrl;

    } catch (error) {
        createToast('error', 'Error while redirecting : ' + error.message);
    }
}

// Developer - Nimit Shah
// Developed on - 21/12/2024
// Description - Use to set spinner
// Updated on - -
// Input - none
window.addEventListener("beforeunload", function (event) {
    showSpinner('Loading ...');
});

// Developer - Nimit Shah
// Developed on - 21/12/2024
// Description - Use to remove spinner
// Updated on - -
// Input - none
document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "hidden") {
        stopSpinner();
    }
});