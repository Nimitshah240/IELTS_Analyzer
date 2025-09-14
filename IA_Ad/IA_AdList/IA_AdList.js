let adData = {
    "id": "",
    "adUserId": "",
    "adTypeId": "",
    "ad": "",
    "paid": "",
    "startDateTime": "",
    "endDateTime": "",
    "adPageId": "",
    "isActive": ""
};
let responsedata;
let en_propertiesLocation = "../../CommonUtils/en_properties.json";

async function adListConnectedCallback() {
    try {
        await getEnglishJsonFile(en_propertiesLocation);
        if (localStorage.getItem("adUserData")) {
            let adUserId;
            adUserId = JSON.parse(localStorage.getItem("adUserData")).id;
            apiURL = enProperties.apiURL + enProperties.apiEndPoints.advertisement + `?adUserId=${adUserId}`;
            responsedata = await apiCallOuts(apiURL, "GET", null, 6000);
            if (responsedata.code == 200 && responsedata.data != null)
                setAdList(responsedata.data);
        }
        Userlogo();
    } catch (error) {
        console.log(error);
        createToast('error', 'Error while loading : ' + error.message);
    }
}

function openAdPopup(event) {
    try {
        let source = 'adPopup';
        let adUser = '';
        if (localStorage.getItem("adUserData")) {
            adUser = JSON.parse(localStorage.getItem("adUserData"));
        }
        let data = { "adUser": adUser, "isNew": true };
        document.getElementById('popupFrame').style.display = "flex";
        popupFrame.contentWindow.postMessage({ source: source, command: 'openPopup', data: data }, enProperties.domainName);
    } catch (error) {
        console.log(error);
    }
}

window.addEventListener('message', function (event) {
    try {
        if (event.origin !== enProperties.domainName) return;

        const message = event.data;
        if (message.command == 'closePopup') {
            if (message.source == 'IA_Ad') {
                if (message.data.operation == 'save') {
                    // After saving ad process
                }
            }
            if (message.source == 'IA_Delete') {
                if (message.data.deleteType) {
                    afterDeleteAd(message.data.id);
                }
            }
            document.getElementById('popupFrame').style.display = "none";
        }
    } catch (error) {
        console.log(error);
    }
});

function setAdList(responsedata) {
    try {
        let htmldata = "";
        if (responsedata == null || responsedata.length < 1) {
            htmldata = '<span class="no_data">No Data Found!</span>';
        } else {
            responsedata.forEach((element, index) => {
                let startDate = "-";
                let endDate = "-";

                if (element.startDate != null) {
                    startDate = setDate(element.startDate);
                }
                if (element.endDate) {
                    endDate = setDate(element.endDate);
                }
                let slot = element.adSlots.map(adSlot => adSlot.slot).join(",");
                let payment = element.isPaid ? "Receipt" : "Payment";
                htmldata +=
                    `<div class="data" id='${element.id}'>
            <div class="column index" onclick="openAdPopup(event)" id='${element.id}'> ${(index + 1)} </div>
            <div class="column total slotText" onclick="openAdPopup(event)" id='${element.id}'> ${slot} </div>
            <div class="column total" onclick="openAdPopup(event)" id='${element.id}'> <input type="checkbox" id="${element.id}" value=${element.isActive} ${element.isActive ? 'checked' : ''} disabled></div>
            <div class="column total dash" onclick="opendashboard(event)" id='${element.id}'> <button class="button-63 payment-button" name = "Listening" id = '${element.id}'>${payment}</button></div>
            <div class="column total hideDate" onclick="openAdPopup(event)" id='${element.id}'> ${startDate}</div>
            <div class="column total hideDate" onclick="openAdPopup(event)" id='${element.id}'> ${endDate}</div>
            <div class="column delete" onclick="deleteAd(event)" id='${element.id}'> <i class="fa fa-trash" id="${element.id}" aria-hidden="true"></i>
            </div>
            </div>`
            });
        }
        document.getElementById("table").innerHTML = htmldata;
    } catch (error) {
        console.log(error);
    }
}

function deleteAd(event) {
    try {
        let deleteAdId = event.target.id;
        for (let element of responsedata) {
            if ((element.id == deleteAdId) && (!element.paid)) {
                let endPoints = ['advertisement'];
                let params = [`adId=${deleteAdId}`];
                let data = { 'jsonBody': null, 'endPoints': endPoints, 'params': params, 'module': "IA_AdList", "id": deleteAdId };
                document.getElementById('popupFrame').style.display = "flex";
                popupFrame.contentWindow.postMessage({ source: 'delete', command: 'openPopup', data: data }, enProperties.domainName);
                break;
            } else {
                notification = { 'message': `Can't delete paid advertisment` };
                document.getElementById('popupFrame').style.display = "flex";
                popupFrame.contentWindow.postMessage({ source: 'notificationpopup', command: 'openPopup', data: { 'notification': notification, "header": "Alert" } }, enProperties.domainName);
            }
        }
    } catch (error) {
        console.log(error);
    }
}

function afterDeleteAd(deleteAdId) {
    try {
        responsedata.forEach((element, index) => {
            if (element.id == deleteAdId) {
                responsedata.splice(index, 1);
                setAdList(responsedata);
            }
        });
        createToast("success", "Advertisement deleted successfully");
    } catch (error) {
        console.log(error);
    }
}