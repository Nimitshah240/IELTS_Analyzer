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