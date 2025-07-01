const urlSearchParams = new URLSearchParams(window.location.search);
const selectionType = urlSearchParams.get('type');

// Developer - Nimit Shah
// Developed on - 21/12/2024
// Description - Use to just set user login image
// Updated on - -
// Input - none
async function selectionconnectedCallback() {
    try {

        await getEnglishJsonFile("../en_properties.json")
        Userlogo();

        if (selectionType == 'listview') {
            setTextsImages(1);
        } else if (selectionType == 'dashboard') {
            setTextsImages(0);
        } else if (selectionType == 'trick') {
            setTextsImages(2);
        }
    } catch (error) {
        console.error(error);
    }
}

function setTextsImages(count) {
    const myDiv = document.getElementById('main');
    const myDivheader = document.getElementById('header');
    const myDivdescription = document.getElementById('description');

    myDiv.style.backgroundImage = `url('${enProperties.slides[count].image}')`;
    myDivheader.innerText = `${enProperties.slides[count].header}`;
    myDivdescription.innerText = `${enProperties.slides[count].description}`;
}

// Developer - Nimit Shah
// Developed on - 21/12/2024
// Description - Use to set URL for DATA, DASHBOARD or TRICK page on user choose
// Updated on - -
// Input - event
async function setHrefs(event) {
    try {
        let module = event.target.id;
        dynamicUrl = await getFilePaths(selectionType) + "?module=" + module;
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