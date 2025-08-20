let domainName;

async function popupConnectedCallback(params) {
    try {
        await getEnglishJsonFile("../CommonUtils/en_properties.json");
        domainName = enProperties.domainName
    } catch (error) {
        console.log(error);
    }
}

window.addEventListener('message', function (event) {
    try {
        if (event.origin !== domainName) return;

        const message = event.data;
        if (message.command == 'openPopup') {
            openAndSetPopup(message);
        } else if (message.command == 'closePopup') {
            const popupData = document.getElementById("popupData");
            popupData.src = '';
            closePopup(message);
        }
    } catch (error) {
        console.log(error);
    }
});

async function openAndSetPopup(message) {
    try {
        const popupData = document.getElementById("popupData");
        popupData.src = await getPopup(message.source);
        popupData.onload = function () {
            popupData.contentWindow.postMessage(
                { data: message.data },
                domainName
            );
        };
    } catch (error) {
        console.log(error);
    }
}

function closePopup(message) {
    try {
        parent.postMessage(
            { source: message.source, command: message.command, data: message.data },
            enProperties.domainName
        );
    } catch (error) {
        console.log(error);
    }
}