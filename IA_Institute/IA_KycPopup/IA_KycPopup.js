let newBlob = null;
let data;
let userName;
let docNumber;
let docType;
let instituteId;
let documentId;

var kycData = {
    "id": "",
    'instituteId': "",
    'name': "",
    'documentType': "",
    'documentNumber': "",
    'documentId': "",
    'verified': ""
};

let documentData = {
    "id": "",
    "userId": "",
    "refId": "",   // Related table id such as Kyc, Bank, Advertisement, etc.
    "refType": "", // Related type such as Kyc, Bank, Advertisement, etc.
    "documentBlob": ''
};

document.addEventListener('DOMContentLoaded', function () {
    window.addEventListener('message', function (event) {
        try {
            data = event.data.data;
            setKycData(data);
            getEnglishJsonFile("../../CommonUtils/en_properties.json");
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
                if (firstFile.size > 2000000) {
                    createToast('error', "Size is greater than 2mb");
                    newBlob = null;
                } else {
                    newBlob = new Blob([firstFile], { type: firstFile.type });
                }
            }
        });
    } else {
        console.error('Error: "fileInput" element not found in the DOM. Please check your HTML ID.');
    }
});

function kycConnectedCallback() {
}

function closeBtn(event) {
    popupclose('close');
}

async function saveUpdateBtn(event) {
    try {
        userName = document.getElementById('name').value;
        docNumber = document.getElementById('docNumber').value;
        docType = document.getElementById('docType').value;

        if (docType != null && docType.trim() != '' && userName != null && docNumber != null
            && userName.trim() != '' && docNumber.trim != '' && newBlob != null) {

            await setDocument(documentData);
            data = { 'id': data.id, 'name': userName, 'documentType': docType, 'documentNumber': docNumber, 'document': documentData, 'instituteId': data.instituteId, "documentId": documentId };

            let method;
            if (document.getElementById('btnYes').innerText == 'Update') {
                method = 'PUT'
            }
            apiURL = enProperties.apiURL + enProperties.apiEndPoints.institute + enProperties.apiEndPoints.kyc;
            if (method != null) {
                let responsedata = await apiCallOuts(apiURL, method, JSON.stringify(data), 6000);
                if (responsedata.code == 200 && responsedata.data != null && responsedata.data.id != null) {
                    document.getElementById('btnYes').disabled = true;
                    setKycData(responsedata.data);
                    stopSpinner();
                    popupclose('save');
                }
            }
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
            { source: 'IA_KycPopup', command: 'closePopup', data: { 'data': kycData, 'operation': operation } },
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

function setKycData(data) {
    try {
        kycData.id = data.id;
        instituteId = kycData.instituteId = data.instituteId;
        userName = kycData.name = data.name;
        docType = kycData.documentType = data.documentType;
        docNumber = kycData.documentNumber = data.documentNumber;
        documentId = kycData.documentId = data.documentId;
        kycData.verified = data.verified;
        setFields(data);
    } catch (error) {
        console.log(error);
    }
}

function setFields(data) {
    try {
        document.getElementById('name').value = data.name;
        document.getElementById('docNumber').value = data.documentNumber;
        document.getElementById('docType').value = data.documentType;
    } catch (error) {
        console.log(error);
    }
}

async function setDocument(documentData) {
    try {
        let base64 = await blobToBase64(newBlob);
        documentData.documentBlob = base64;
        documentData.id = data.documentId;
        documentData.userId = instituteId;
        documentData.refId = data.id;
        documentData.refType = "KYC";
    } catch (error) {
        console.log(error);
    }
}