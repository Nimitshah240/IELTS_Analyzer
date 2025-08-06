let newBlob = null;
let data;
let userName;
let docNumber;
let docType;
let instituteId;

document.addEventListener('DOMContentLoaded', function () {
    window.addEventListener('message', function (event) {
        try {
            data = event.data.data;
            userName = document.getElementById('name').value = data.name;
            docNumber = document.getElementById('docNumber').value = data.documentNumber;
            docType = document.getElementById('docType').value = data.documentType;
            instituteId = data.instituteId;
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
    popupclose();
}

async function saveUpdateBtn(event) {
    try {
        userName = document.getElementById('name').value;
        docNumber = document.getElementById('docNumber').value;
        docType = document.getElementById('docType').value;

        if (docType != null && docType.trim() != '' && userName != null && docNumber != null
            && userName.trim() != '' && docNumber.trim != '' && newBlob != null) {

            let base64 = await blobToBase64(newBlob);
            data = { 'id': data.id, 'name': userName, 'documentType': docType, 'documentNumber': docNumber, 'document': base64, 'instituteId': data.instituteId };

            let method;

            if (document.getElementById('btnYes').innerText == 'Save' && data.id == '') {
                method = 'POST';
            } else if (document.getElementById('btnYes').innerText == 'Update') {
                method = 'PUT'
            }
            apiURL = enProperties.apiURL + enProperties.apiEndPoints.institute + enProperties.apiEndPoints.kyc;
            if (method != null)
                await apiCallOuts(apiURL, method, JSON.stringify(data), 6000);

            popupclose();
        } else {
            createToast('error', 'Please fill required details');
        }
    } catch (error) {
        createToast('error', 'Error');
    }
}

function popupclose() {
    try {
        parent.postMessage(
            { source: 'IA_KycPopup', command: 'closePopup', data: data },
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