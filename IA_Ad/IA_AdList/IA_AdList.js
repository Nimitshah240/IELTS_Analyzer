let adDataList = [];
let responsedata;
let en_propertiesLocation = "../../CommonUtils/en_properties.json";

async function adListConnectedCallback() {
    try {
        await getEnglishJsonFile(en_propertiesLocation);
        await setIframeSrc("spinner");
        showSpinner('Loading ...');
        setAnchorHref("index");
        if (localStorage.getItem("adUserData")) {
            let adUserId;
            adUserId = JSON.parse(localStorage.getItem("adUserData")).id;
            apiURL = enProperties.apiURL + enProperties.apiEndPoints.advertisement + `?adUserId=${adUserId}`;
            responsedata = await apiCallOuts(apiURL, "GET", null, 6000);
            if (responsedata.code == 200 && responsedata.data != null) {
                adDataList = responsedata.data;
                setAdList(adDataList);
            }
            stopSpinner();
        }
        Userlogo();
    } catch (error) {
        console.log(error);
        createToast('error', 'Error while loading : ' + error.message);
    }
}

function newAdPopup(event) {
    try {
        let adUser = '';
        if (localStorage.getItem("adUserData")) {
            adUser = JSON.parse(localStorage.getItem("adUserData"));
        }
        let data = { "adUser": adUser, "isNew": true };
        openAdPopup(data);
    } catch (error) {
        console.log(error);
    }
}

function editAdPopup(event) {
    try {
        let adId = event.target.id;
        let adData;
        if (localStorage.getItem("adUserData")) {
            adUser = JSON.parse(localStorage.getItem("adUserData"));
        }
        adDataList.forEach(element => {
            if (adId != null && adId == element.id) {
                adData = element;
            }
        });
        let data = { "adData": adData, "adUser": adUser, "isNew": false };
        openAdPopup(data);
    } catch (error) {
        console.log(error);
    }
}

function openAdPopup(data) {
    try {
        document.getElementById('popupFrame').style.display = "flex";
        popupFrame.contentWindow.postMessage({ source: 'adPopup', command: 'openPopup', data: data }, enProperties.domainName);
    } catch (error) {

    }
}

window.addEventListener('message', function (event) {
    try {
        if (event.origin !== enProperties.domainName) return;

        const message = event.data;
        if (message.command == 'closePopup') {
            if (message.source == 'IA_AdPopup') {
                if (message.data.operation == 'save') {
                    adDataList.push(message.data.data);
                    setAdList(adDataList);
                }
            }
            if (message.source == 'IA_Delete') {
                if (message.data.deleteType) {
                    afterDeleteAd(message);
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
            <div class="column index" onclick="editAdPopup(event)" id='${element.id}'> ${(index + 1)} </div>
            <div class="column total slotTextDiv" title="${slot}" onclick="editAdPopup(event)" id='${element.id}'> <span class="slotText" id='${element.id}'> ${slot} </span> </div>
            <div class="column total" onclick="editAdPopup(event)" id='${element.id}'> <input type="checkbox" id="${element.id}" value=${element.isActive} ${element.isActive ? 'checked' : ''} disabled></div>
            <div class="column total dash" onclick="opendashboard(event)" id='${element.id}'> <button class="button-63 payment-button" name = "Listening" id = '${element.id}'>${payment}</button></div>
            <div class="column total hideDate" onclick="editAdPopup(event)" id='${element.id}'> ${startDate}</div>
            <div class="column total hideDate" onclick="editAdPopup(event)" id='${element.id}'> ${endDate}</div>
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
        showSpinner("Loading..");
        let deleteAdId = event.target.id;
        for (let element of responsedata.data) {
            if ((element.id == deleteAdId) && !(element.isPaid || element.isActive)) {
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
        stopSpinner();
    } catch (error) {
        console.log(error);
    }
}

function afterDeleteAd(message) {
    try {
        showSpinner("Loading...");
        let jsonBody = message.data.jsonBody;
        if (jsonBody.code == 422) {
            createToast("error", jsonBody.message);
            stopSpinner();
            return;
        }
        let deleteAdId = message.data.id
        responsedata.data.forEach((element, index) => {
            if (element.id == deleteAdId) {
                responsedata.data.splice(index, 1);
                setAdList(responsedata.data);
            }
        });
        stopSpinner();
        createToast("success", "Advertisement deleted successfully");
    } catch (error) {
        console.log(error);
    }
}