const urlSearchParams = new URLSearchParams(window.location.search);
let instituteId = urlSearchParams.get('insId');

async function listviewconnectedCallback() {
    try {
        await getEnglishJsonFile('../../CommonUtils/en_properties.json');
        Userlogo();
    } catch (error) {
        createToast('error', 'Error while loading : ' + error.message);
    }
}

window.addEventListener('message', function (event) {
    try {
        if (event.origin !== enProperties.domainName) return;

        const message = event.data;
        if (message.command == 'closePopup') {
            if (message.source == 'IA_Delete') {
                afterDelete(message.data);
            }
        }
    } catch (error) {
        console.log(error);
    }
});

function openStudentAddPopup(params) {
    try {
        let data = null;
        document.getElementById('popupFrame').style.display = "flex";
        popupFrame.contentWindow.postMessage({ source: 'insStudentAddPopup', command: 'openPopup', data: { 'data': data, 'instituteId': instituteId } }, enProperties.domainName);
    } catch (error) {
        console.log(error);
    }
}

window.addEventListener('message', function (event) {
    try {
        if (event.origin !== enProperties.domainName) return;

        const message = event.data;
        if (message.command == 'closePopup') {
            document.getElementById('popupFrame').style.display = "none";
        }
    } catch (error) {
        console.log(error);
    }
});