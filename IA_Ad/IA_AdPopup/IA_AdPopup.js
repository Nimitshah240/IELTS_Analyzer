let fileInput;
let adData;
let allSlot;
let oldAdvertisement;
let newBlob;
let en_propertiesLocation = "../../CommonUtils/en_properties.json";
let incomingdata;
let selectedSlot = [];
let slotMap = new Map();
let asset;
let adUser;
let totalCost = 0;


document.addEventListener('DOMContentLoaded', async function () {
    await getEnglishJsonFile(en_propertiesLocation);
    await setIframeSrc("spinner");
    window.addEventListener('message', function (event) {
        try {
            showSpinner('Loading ...');
            setAnchorHref("index");
            let freshAdPromise = Promise.resolve();
            incomingdata = event.data.data;
            if (incomingdata != null) {
                adUser = incomingdata.adUser;
                if (incomingdata.isNew) {
                    freshAdPromise = getData("freshAd").then(responsedata => {
                        if (responsedata.code === 200 && responsedata.data != null) {
                            adData = responsedata.data;
                            asset = adData.asset;
                        }
                    });
                } else {
                    adData = incomingdata.adData;
                    asset = adData.asset;
                    freshAdPromise = getData("advertisementAsset").then(responsedata => {
                        console.log(responsedata);
                        if (responsedata.code === 200 && responsedata.data != null) {
                            asset = responsedata.data;
                            setBlobToInput(asset);
                        }
                    });
                    setData();
                }
            }

            let slotPromise = getData("slot").then(responsedata => {
                if (responsedata.code === 200 && responsedata.data != null) {
                    allSlot = responsedata.data;
                    getSlotName(allSlot);
                }
            });

            let oldAdPromise = getData("oldAdvertisement").then(responsedata => {
                if (responsedata.code === 200 && responsedata.data != null) {
                    oldAdvertisement = responsedata.data;
                    getOldAdvertisement(oldAdvertisement)
                }
            });

            Promise.all([freshAdPromise, slotPromise, oldAdPromise])
                .then(() => stopSpinner())
                .catch(err => {
                    console.error("Error fetching data:", err);
                    stopSpinner();
                });
        } catch (error) {
            console.log(error);
        }
    });

    // FILE INPUT
    const fileInput = document.getElementById('fileInput');
    if (fileInput) {
        fileInput.addEventListener('change', async (event) => {
            asset = {};
            const files = event.target.files;
            if (files.length > 0) {
                const firstFile = files[0];
                newBlob = new Blob([firstFile], { type: firstFile.type });
                asset.assetBlob = await blobToBase64(newBlob);
                asset.assetName = firstFile.name;
                asset.assetType = firstFile.type;
            } else {
                console.log('No files selected.');
            }
        });
    } else {
        console.error('Error: "fileInput" element not found in the DOM. Please check your HTML ID.');
    }

    // SLOT SELECTION;
    const selectElement = document.getElementById('slots');
    selectElement.addEventListener('change', () => {
        const selectedOptions = selectElement.selectedOptions;
        selectedSlot = [];
        const selectedValues = Array.from(selectedOptions).map(option => {
            if (option.value != "SELECT")
                selectedSlot.push(slotMap.get(option.value));
        });
        calculateCost(selectedSlot);
        selectedPageName(selectedSlot);
        selectedTypeName(selectedSlot);
        keyPressed();
    });
});

function adPopupConnectedCallback() {
}

function closeBtn(event) {
    popupclose('close');
}

async function saveUpdateBtn(event) {
    try {
        showSpinner('Loading ...');
        let startDate = document.getElementById('startDate').value;
        let url = document.getElementById('url').value;
        if (selectedSlot.length > 0 && asset.assetBlob != null && startDate != null
            && url != null && url.trim() != '') {
            adData.asset = asset;
            adData.adSlots = selectedSlot;
            adData.startDate = startDate;
            adData.cost = totalCost;
            adData.url = url
            adData.adUser = adUser;
            let method;
            if (document.getElementById('btnYes').innerText == 'Save' && (adData.id == null || adData.id == '')) {
                method = 'POST';
            } else if (document.getElementById('btnYes').innerText == 'Update') {
                method = 'PUT'
            }

            apiURL = enProperties.apiURL + enProperties.apiEndPoints.advertisement;
            if (method != null) {
                let responsedata = await apiCallOuts(apiURL, method, JSON.stringify(adData), 6000);
                if (responsedata.code == 200) {
                    adData = responsedata.data;
                    popupclose('save');
                } else
                    createToast('error', responsedata.message);
                stopSpinner();
            }
        } else {
            stopSpinner();
            createToast('error', 'Please fill required details');
        }
    } catch (error) {
        stopSpinner();
        createToast('error', 'Error');
    }
}

function popupclose(operation) {
    try {
        parent.postMessage(
            { source: 'IA_AdPopup', command: 'closePopup', data: { 'data': adData, 'operation': operation } },
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
    if (adData.id != null && adData.id != '') {
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
            case "advertisementAsset": // remove this not required
                timeout = 20000;
                apiURL = enProperties.apiURL + enProperties.apiEndPoints.asset + `?assetId=${adData.assetId}`;
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
        selectedPageName(adData.adSlots);
        selectedTypeName(adData.adSlots);
        calculateCost(adData.adSlots);
        document.getElementById("url").value = adData.url;
        document.getElementById('startDate').value = adData.startDate;
        if (adData.isPaid || adData.isActive) {
            document.getElementById("slots").disabled = true;
            document.getElementById("btnYes").style.cursor = 'no-drop';
            document.getElementById("btnYes").disabled = true;

        }
    } catch (error) {

    }
}

function getSlotName(allSlot) {
    try {
        let htmlSLot = `<option value="SELECT" >-- NONE --</option>`
        allSlot.forEach(element => {
            slotMap.set(String(element.id), element);
            htmlSLot += `<option value="${element.id}" > ${element.slot}</option>`
        });
        document.getElementById('slots').innerHTML = htmlSLot;
    } catch (error) {

    }
}

function getOldAdvertisement(oldAdvertisementAsset) {
    try {
        let htmlOldAdvertisement = `<option value="SELECT" >-- NONE --</option>`;

        oldAdvertisementAsset.forEach(element => {
            htmlOldAdvertisement += `<option value="${element.id}" id="${element.id}"> ${element.assetName}</option>`
        });
        document.getElementById('oldAd').innerHTML = htmlOldAdvertisement;
    } catch (error) {
        console.log(error);
    }
}

function selectedPageName(selectedAdSlot) {
    try {
        let htmlSLot;
        selectedAdSlot.forEach(element => {
            htmlSLot += `<option value="${element.adPage.id}" > ${element.adPage.page}</option>`
        });
        document.getElementById('page').innerHTML = htmlSLot;
    } catch (error) {
        console.log(error);
    }
}

function selectedTypeName(selectedAdSlot) {
    try {
        let htmlSLot;
        selectedAdSlot.forEach(element => {
            htmlSLot += `<option value="${element.adType.id}" > ${element.adType.type}</option>`
        });
        document.getElementById('type').innerHTML = htmlSLot;
    } catch (error) {
        console.log(error);
    }
}

function calculateCost(selectedAdSlot) {
    try {
        totalCost = 0;
        selectedAdSlot.forEach(element => {
            totalCost += element.adSlotPrices[0].adPrice.price;
        });
        document.getElementById('cost').value = totalCost;
    } catch (error) {
        console.log(error);
    }

}

async function setBlobToInput(asset) {
    try {
        console.log(asset);

        let blob = asset.assetBlob;
        let fileName = asset.assetName;

        let file = new File([blob], fileName, { type: blob.type });
        let dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        let input = document.getElementById("fileInput");
        input.files = dataTransfer.files;

        console.log("File set:", input.files[0]);
    } catch (error) {
        console.log(error);

    }
}

function selectOldAdvertisement(event) {
    try {
        let select = document.getElementById("oldAd");
        let selectedOption = select.options[select.selectedIndex];
        let oldAdId = selectedOption.id;
        oldAdvertisement.forEach(element => {
            if (oldAdId === element.id) {
                asset = element;
            }
        });
    } catch (error) {
        console.log(error);
    }
}