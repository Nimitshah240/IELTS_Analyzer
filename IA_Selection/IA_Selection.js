const urlSearchParams = new URLSearchParams(window.location.search);
const selectionType = urlSearchParams.get('type');
const slides = [
    {
        image: "../Asset\/5790b59f9d49b818ca27538455000a07.jpg", header: "Dashboard", description: `Great! Let's start analyzing your score now. 🚀Get ready for detailed insights and improvements! ✅.'`
    },
    { image: "../Asset\/380764fbad3e9dd30345b06511ed756e.jpg", header: "Data", description: `Share your IELTS data, and I'll generate deep insights to help you improve! 📊🚀` },
    { image: "../Asset\/380764fbad3e9dd30345b06511ed756e.jpg", header: "Knowledge", description: `Here lies a vast treasury of knowledge—dive in, explore, and unlock endless possibilities! 📚✨🚀` }

];

// Developer - Nimit Shah
// Developed on - 21/12/2024
// Description - Use to just set user login image
// Updated on - -
// Input - none
function selectionconnectedCallback() {
    try {
        const myDiv = document.getElementById('main');
        const myDivheader = document.getElementById('header');
        const myDivdescription = document.getElementById('description');

        Userlogo();
        if (selectionType == 'data') {
            myDiv.style.backgroundImage = `url('${slides[1].image}')`;
            myDivheader.innerText = `${slides[1].header}`;
            myDivdescription.innerText = `${slides[1].description}`;
        } else if (selectionType == 'dashboard') {
            myDiv.style.backgroundImage = `url('${slides[0].image}')`;
            myDivheader.innerText = `${slides[0].header}`;
            myDivdescription.innerText = `${slides[0].description}`;
        } else if (selectionType == 'trick') {
            myDiv.style.backgroundImage = `url('${slides[2].image}')`;
            myDivheader.innerText = `${slides[2].header}`;
            myDivdescription.innerText = `${slides[2].description}`;
        }
    } catch (error) {
        console.error(error);
    }
}

// Developer - Nimit Shah
// Developed on - 21/12/2024
// Description - Use to set URL for DATA, DASHBOARD or TRICK page on user choose
// Updated on - -
// Input - event
function setHrefs(event) {
    try {
        let module = event.target.id;
        let dynamicUrl;
        if (selectionType == 'dashboard') {
            dynamicUrl = '../IA_Dashboard/IA_Dashboard.html';
        } else if (selectionType == 'data') {
            dynamicUrl = '../IA_Listview/IA_Listview.html';
        } else if (selectionType == 'trick') {
            dynamicUrl = '../IA_Trick/IA_Trick.html';
        }
        if (module == 'Reading') {
            dynamicUrl = dynamicUrl + '?module=Reading';
        } else {
            dynamicUrl = dynamicUrl + '?module=Listening';
        }
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