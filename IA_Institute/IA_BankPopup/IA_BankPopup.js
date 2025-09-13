let fileInput;
let accHolderName;
let accountNumber;
let ifscCode;
let branch;
let bankName;
let instituteId;
let documentId;
let data;
let newBlob;
let documentData = {
    "id": "",
    "userId": "",
    "refId": "",   // Related table id such as Kyc, Bank, Advertisement, etc.
    "refType": "", // Related type such as Kyc, Bank, Advertisement, etc.
    "documentBlob": ''
};

let bankData = {
    "id": "",
    "instituteId": "",
    "accountNumber": "",
    "ifscCode": "",
    "branch": "",
    "bankName": "",
    "accHolderName": "",
    "documentId": "",
    "verified": ""
};

document.addEventListener('DOMContentLoaded', function () {
    // Other event listeners, if needed
    window.addEventListener('message', function (event) {
        try {
            data = event.data.data;
            setBankData(data);
            getEnglishJsonFile("../../CommonUtils/en_properties.json");
        } catch (error) {
            console.log(error);
        }
    });

    const fileInput = document.getElementById('fileInput');

    if (fileInput) { // Check if the element was actually found
        fileInput.addEventListener('change', (event) => {
            const files = event.target.files;
            if (files.size > 2000000) {
                const firstFile = files[0];
                newBlob = new Blob([firstFile], { type: firstFile.type });
            } else {
                console.log('No files selected.');
            }
        });
    } else {
        console.error('Error: "fileInput" element not found in the DOM. Please check your HTML ID.');
    }
});

function bankConnectedCallback() {
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
            await setDocument(documentData);

            data = { 'id': data.id, 'accHolderName': accHolderName, 'accountNumber': accountNumber, 'ifscCode': ifscCode, 'instituteId': instituteId, 'branch': branch, 'bankName': bankName, "document": documentData, "documentId": documentId };

            let method;
            if (document.getElementById('btnYes').innerText == 'Update') {
                method = 'PUT'
            }

            apiURL = enProperties.apiURL + enProperties.apiEndPoints.institute + enProperties.apiEndPoints.bank;
            if (method != null) {
                let responsedata = await apiCallOuts(apiURL, method, JSON.stringify(data), 6000);
                if (responsedata.code == 200 && responsedata.data != null && responsedata.data.id != null) {
                    document.getElementById('btnYes').disabled = true;
                    setBankData(responsedata.data);
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
            { source: 'IA_BankPopup', command: 'closePopup', data: { 'data': bankData, 'operation': operation } },
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

function setBankData(data) {
    try {
        bankData.id = data.id;
        instituteId = bankData.instituteId = data.instituteId;
        accountNumber = bankData.accountNumber = data.accountNumber;
        ifscCode = bankData.ifscCode = data.ifscCode;
        branch = bankData.branch = data.branch;
        bankName = bankData.bankName = data.bankName;
        accHolderName = bankData.accHolderName = data.accHolderName;
        documentId = bankData.documentId = data.documentId;
        bankData.verified = data.verified;
        setFields(data);
    } catch (error) {
        console.log(error);
    }
}

function setFields(data) {
    try {
        document.getElementById('name').value = data.accHolderName;
        document.getElementById('accNumber').value = data.accountNumber;
        document.getElementById('ifscCode').value = data.ifscCode;
        document.getElementById('branch').value = data.branch;
        document.getElementById('bankName').value = data.bankName;
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
        documentData.refType = "BANK";
    } catch (error) {
        console.log(error);
    }
}