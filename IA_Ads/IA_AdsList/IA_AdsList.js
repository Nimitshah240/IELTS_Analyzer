let adsData = {
    "id": "",
    "adsUserId": "",
    "adsTypeId": "",
    "ads": "",
    "paid": "",
    "startDateTime": "",
    "endDateTime": "",
    "adsPageId": "",
    "isActive": ""
};
let responsedata;

async function adsListConnectedCallback() {
    try {
        await getEnglishJsonFile('../../CommonUtils/en_properties.json');
        if (localStorage.getItem("adsUserData")) {
            let adsUserId;
            adsUserId = JSON.parse(localStorage.getItem("adsUserData")).id;
            apiURL = enProperties.apiURL + enProperties.apiEndPoints.advertisement + `?adsUserId=${adsUserId}`;
            responsedata = await apiCallOuts(apiURL, "GET", null, 6000);
            setAdsList(responsedata);
        }
        Userlogo();
    } catch (error) {
        console.log(error);
        createToast('error', 'Error while loading : ' + error.message);
    }
}

function openAdsPopup(event) {
    try {
        let source = 'adsPopup';
        let data = null;
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
            if (message.source == 'IA_Ads') {
                if (message.data.operation == 'save') {
                    // After saving ads process
                }
            }
            if (message.source == 'IA_Delete') {
                if (message.data.deleteType) {
                    afterDeleteAds(message.data.id);
                }
            }
            document.getElementById('popupFrame').style.display = "none";
        }
    } catch (error) {
        console.log(error);
    }
});

function setAdsList(responsedata) {
    try {
        let htmldata = "";
        if (responsedata.length < 1) {
            htmldata = '<span class="no_data">No Data Found!</span>';
        } else {
            responsedata.forEach((element, index) => {
                let startDate = new Date(element.startDateTime);
                let year = startDate.getFullYear();
                let month = ('0' + (startDate.getMonth() + 1)).slice(-2);
                let day = ('0' + startDate.getDate()).slice(-2);
                startDate = `${year}-${month}-${day}`;
                let endDate = new Date(element.endDateTime);
                year = endDate.getFullYear();
                month = ('0' + (endDate.getMonth() + 1)).slice(-2);
                day = ('0' + endDate.getDate()).slice(-2);
                endDate = `${year}-${month}-${day}`;
                let Payment = element.paid ? `<p style="font-weight:bold" name="Listening" id='${element.id}'>Paid</p>` : `<button class="button-63 dashboard-button" name="Listening" id='${element.id}'>Payment</button>`;
                htmldata +=
                    `<div class="data" id='${element.id}'>
            <div class="column index" onclick="openAdsPopup(event)" id='${element.id}'> ${(index + 1)} </div>
            <div class="column total" onclick="openAdsPopup(event)" id='${element.id}'> ${element.advertisementTypeId} </div>
            <div class="column total" onclick="openAdsPopup(event)" id='${element.id}'> ${element.advertisementPageId}</div>
            <div class="column total" onclick="openAdsPopup(event)" id='${element.id}'> <input type="checkbox" id="${element.id}" value=${element.isActive} ${element.isActive ? 'checked' : ''} disabled></div>
            <div class="column total dash" onclick="opendashboard(event)" id='${element.id}'>${Payment}</div>
            <div class="column total" onclick="openAdsPopup(event)" id='${element.id}'> ${startDate}</div>
            <div class="column total" onclick="openAdsPopup(event)" id='${element.id}'> ${endDate}</div>
            <div class="column delete" onclick="deleteAds(event)" id='${element.id}'> <i class="fa fa-trash" id="${element.id}" aria-hidden="true"></i>
            </div>
            </div>`
            });
        }
        document.getElementById("table").innerHTML = htmldata;
    } catch (error) {
        console.log(error);
    }
}

function deleteAds(event) {
    try {
        let deleteAdsId = event.target.id;
        responsedata.forEach((element, index) => {
            if (element.id == deleteAdsId && !element.paid) {
                let endPoints = ['advertisement'];
                let params = [`id=${deleteAdsId}`];
                let data = { 'jsonBody': null, 'endPoints': endPoints, 'params': params, 'module': "IA_AdsList", "id": deleteAdsId };
                document.getElementById('popupFrame').style.display = "flex";
                popupFrame.contentWindow.postMessage({ source: 'delete', command: 'openPopup', data: data }, enProperties.domainName);
            } else {
                notification = { 'message': `Can't delete paid advertisment` };
                document.getElementById('popupFrame').style.display = "flex";
                popupFrame.contentWindow.postMessage({ source: 'notificationpopup', command: 'openPopup', data: { 'notification': notification, "header": "Alert" } }, enProperties.domainName);
            }
        });
    } catch (error) {
        console.log(error);
    }
}

function afterDeleteAds(deleteAdsId) {
    try {
        responsedata.forEach((element, index) => {
            if (element.id == deleteAdsId) {
                responsedata.splice(index, 1);
                setAdsList(responsedata);
            }
        });
    } catch (error) {
        console.log(error);
    }
}