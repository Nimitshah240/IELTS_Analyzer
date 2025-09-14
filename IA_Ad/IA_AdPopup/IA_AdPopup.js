let fileInput;
let data;
let allSlot;
let oldAdvertisement;
let newBlob;
let en_propertiesLocation = "../../CommonUtils/en_properties.json";
let incomingdata;


document.addEventListener('DOMContentLoaded', function () {
    // Other event listeners, if needed
    window.addEventListener('message', async function (event) {
        try {
            await getEnglishJsonFile(en_propertiesLocation);
            incomingdata = event.data.data;
            if (incomingdata != null) {
                if (incomingdata.isNew) {
                    getData("freshAd").then(responsedata => {
                        if (responsedata.code === 200 && responsedata.data != null) {
                            data = responsedata.data;
                            data.adUser = incomingdata.adUser;
                        }
                    })
                }
            }

            getData("slot").then(responsedata => {
                console.log(responsedata);
                if (responsedata.code === 200 && responsedata.data != null) {
                    allSlot = responsedata.data;
                    console.log(allSlot);
                    getSlotName(allSlot);
                }
            });

            getData("oldAdvertisement").then(responsedata => {
                console.log(responsedata);
                if (responsedata.code === 200 && responsedata.data != null) {
                    console.log(responsedata);
                    getOldAdvertisement(responsedata.data)
                }
            });
        } catch (error) {
            console.log(error);
        }
    });

    const fileInput = document.getElementById('fileInput');

    if (fileInput) {
        fileInput.addEventListener('change', (event) => {
            const files = event.target.files;
            if (files.length > 0) {
                const firstFile = files[0];
                newBlob = new Blob([firstFile], { type: firstFile.type });
            } else {
                console.log('No files selected.');
            }
        });
    } else {
        console.error('Error: "fileInput" element not found in the DOM. Please check your HTML ID.');
    }
    const selectElement = document.getElementById('slots');
    selectElement.addEventListener('change', () => {
        console.log('NN');

        const selectedOptions = selectElement.selectedOptions;
        console.log(selectedOptions);
        const selectedValues = Array.from(selectedOptions).map(option => option.value);

        // outputElement.textContent = selectedValues.length > 0 ? selectedValues.join(', ') : 'None';
    });
});

function adPopupConnectedCallback() {
}

function closeBtn(event) {
    popupclose('close');
}

async function saveUpdateBtn(event) {
    try {
        accHolderName = document.getElementById('name').value;
        accountNumber = document.getElementById('accNumber').value;
        ifscCode = document.getElementById('ifscCode').value;
        branch = document.getElementById('branch').value;
        bankName = document.getElementById('bankName').value;

        if (accHolderName != null && accHolderName.trim() != '' &&
            accountNumber != null && accountNumber.trim() != '' &&
            ifscCode != null && ifscCode.trim() != '' &&
            branch != null && branch.trim() != '' &&
            bankName != null && bankName.trim() != '' && newBlob != null) {

            let base64 = await blobToBase64(newBlob);
            data = { 'id': data.id, 'accHolderName': accHolderName, 'accountNumber': accountNumber, 'ifscCode': ifscCode, 'instituteId': instituteId, 'branch': branch, 'bankName': bankName, 'document': base64 };

            let method;
            console.log(document.getElementById('btnYes').innerText);
            if (document.getElementById('btnYes').innerText == 'Save' && data.id == '') {
                method = 'POST';
            } else if (document.getElementById('btnYes').innerText == 'Update') {
                method = 'PUT'
            }

            apiURL = enProperties.apiURL + enProperties.apiEndPoints.institute + enProperties.apiEndPoints.bank;
            if (method != null) {
                await apiCallOuts(apiURL, method, JSON.stringify(data), 6000);
            }

            notification = { 'message': 'Thank you, Uploaded files will get deleted within 2 days of verification' };
            document.getElementById('popupFrame').style.display = "flex";
            popupFrame.contentWindow.postMessage({ source: 'notificationpopup', command: 'openPopup', data: { 'notification': notification, "header": "Alert" } }, enProperties.domainName);
        } else {
            createToast('error', 'Please fill required details');
        }
    } catch (error) {
        console.log(error);
        createToast('error', 'Error');
    }
}

function popupclose(operation) {
    try {
        parent.postMessage(
            { source: 'IA_AdPopup', command: 'closePopup', data: { 'data': data, 'operation': operation } },
            enProperties.domainName)
    } catch (error) {
        console.log(error);

    }
}

function blobToBase64(blob) {
    try {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result.split(',')[1]);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    } catch (error) {
        console.log(error);
    }
}

function keyPressed() {
    if (data.id != '') {
        document.getElementById("btnYes").innerText = "Update"
    } else {
        document.getElementById("btnYes").innerText = "Save"
    }
}

async function getData(param) {
    try {
        let timeout = 6000;
        let method = "GET";
        switch (param) {
            case "slot":
                apiURL = enProperties.apiURL + enProperties.apiEndPoints.adMaster + enProperties.apiEndPoints.slot;
                break;
            case "oldAdvertisement":
                timeout = 20000;
                apiURL = enProperties.apiURL + enProperties.apiEndPoints.asset + enProperties.apiEndPoints.userAdAsset + `?userId=${incomingdata.adUser.id}`;
                break;
            case "freshAd":
                apiURL = enProperties.apiURL + enProperties.apiEndPoints.advertisement + enProperties.apiEndPoints.freshAd;
                break;
            default:
                break;
        }
        return await apiCallOuts(apiURL, method, null, timeout);

    } catch (error) {
        console.log(error);
    }
}

function setData(params) {
    try {

    } catch (error) {

    }
}

function getSlotName(allSlot) {
    try {
        let htmlSLot = `<option value="SELECT" >-- SELECT --</option>`
        allSlot.forEach(element => {
            htmlSLot += `<option value="${element.id}" > ${element.slot}</option>`
        });
        document.getElementById('slots').innerHTML = htmlSLot;
    } catch (error) {

    }
}

function getOldAdvertisement(oldAdvertisement) {
    let htmlOldAdvertisement = `<option value="SELECT" >-- SELECT --</option>`;

    oldAdvertisement.forEach(element => {
        htmlOldAdvertisement += `<option value="${element.id}" > ${element.assetName}.${element.assetType}</option>`
    });
    document.getElementById('oldAd').innerHTML = htmlOldAdvertisement;
}

function getPageName(params) {

}

function getTypeName(params) {

}

function getCost(params) {

}
