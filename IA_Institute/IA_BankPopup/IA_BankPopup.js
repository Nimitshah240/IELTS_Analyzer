let fileInput;
let accHolderName;
let accountNumber;
let ifscCode;
let branch;
let bankName;
let instituteId;
let data;
let newBlob;

document.addEventListener('DOMContentLoaded', function() {
    // Other event listeners, if needed
    window.addEventListener('message', function (event) {
        try {
            data = event.data.data;
            instituteId = data.instituteId;
            accHolderName = document.getElementById('name').value = data.accHolderName;
            accountNumber = document.getElementById('accNumber').value = data.accountNumber;
            ifscCode = document.getElementById('ifscCode').value = data.ifscCode;
            branch = document.getElementById('branch').value = data.branch;
            bankName = document.getElementById('bankName').value = data.bankName;
            getEnglishJsonFile("../../CommonUtils/en_properties.json");
        } catch (error) {
            console.log(error);
        }
    });

    const fileInput = document.getElementById('fileInput');

    if (fileInput) { // Check if the element was actually found
        fileInput.addEventListener('change', (event) => {
            const files = event.target.files;             
            if (files.length > 0) {
                const firstFile = files[0]; 
                console.log('File name:', firstFile.name); 
                console.log('File size (bytes):', firstFile.size);
                console.log('File type:', firstFile.type); 
                console.log('File type:', firstFile.blob); 
                newBlob = new Blob([firstFile], { type: firstFile.type });
                console.log('New Blob created from file:', newBlob); 
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

function closeBtn(event){
    popupclose();
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
            data = { 'id': data.id, 'accHolderName': accHolderName, 'accountNumber': accountNumber, 'ifscCode': ifscCode, 'instituteId': instituteId, 'branch': branch, 'bankName': bankName, 'document':base64};

            let method;
            console.log(document.getElementById('btnYes').innerText);
            if (document.getElementById('btnYes').innerText == 'Save' && data.id == '') {
                method = 'POST';
            } else if (document.getElementById('btnYes').innerText == 'Update') {
                method = 'PUT'
            }

            apiURL = enProperties.apiURL + enProperties.apiEndPoints.institute + enProperties.apiEndPoints.bank;
            if (method != null){
                await apiCallOuts(apiURL, method, JSON.stringify(data), 6000);
            }

            popupclose();
        } else {
            createToast('error', 'Please fill required details');
        }
    } catch (error) {
    console.log(error);
        createToast('error', 'Error');
    }
}

function popupclose(){
    try {
        parent.postMessage(
            { source: 'IA_BankPopup', command: 'closePopup', data: "data" },
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