async function adsListConnectedCallback() {
    try {
        await getEnglishJsonFile('../../CommonUtils/en_properties.json');
        Userlogo();
    } catch (error) {
        console.log(error);
        createToast('error', 'Error while loading : ' + error.message);
    }
}

async function setHref(event) {
    try {
        if ((localStorage.getItem('user_data')) != null) {
            dynamicUrl = await getFilePaths("dataentry") + "?module=" + module;
            event.target.href = dynamicUrl;
            window.location.href = dynamicUrl;
        } else {
            createToast('error', 'Please login first')
        }
    } catch (error) {
        createToast('error', 'Error while redirecting : ' + error.message);
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