let data;
let notification;

async function notificationConnectedCallback(params) {
}

window.addEventListener('message', async function (event) {
    try {
        data = event.data.data;
        notification = data.notification;
        showSpinner("Opening Notification...");
        await getEnglishJsonFile("../CommonUtils/en_properties.json");
        notificationOpened();
        stopSpinner();
    } catch (error) {
        console.log(error);
    }
});

function closeNotification(event) {
    try {
        parent.postMessage(
            { source: 'IA_Notification', command: 'closePopup', data: { "notificationId": notification.id } },
            enProperties.domainName
        );
    } catch (error) {
        console.log(error);
    }
}

async function notificationOpened(params) {
    try {
        document.getElementById("notification-header").innerText = data.header;
        document.getElementById("notification").innerText = notification.message;

        if (data.header == 'Notification' && notification != null && !notification.readed && (notification.refId != null || notification.refId.trim() != "" || notification.refId != undefined)) {
            apiURL = enProperties.apiURL + enProperties.apiEndPoints.notification;
            notification.readed = true;
            await apiCallOuts(apiURL, "PUT", JSON.stringify(notification), 6000);
        }
    } catch (error) {
        console.log(error);

    }
}