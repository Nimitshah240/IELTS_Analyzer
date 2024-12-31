const urlSearchParams = new URLSearchParams(window.location.search);
const selectionType = urlSearchParams.get('type');


// Developer - Nimit Shah
// Developed on - 21/12/2024
// Description - Use to just set user login image
// Updated on - -
// Input - none
function selectionconnectedCallback() {
    try {
        Userlogo();
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