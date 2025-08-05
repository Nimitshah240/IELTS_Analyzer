let fileInput;


document.addEventListener('DOMContentLoaded', function() {
    // Other event listeners, if needed
    window.addEventListener('message', function (event) {
        try {
            const data = event.data;
            console.log(data);
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
                const newBlob = new Blob([firstFile], { type: firstFile.type });
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
    fileInput = document.getElementById('fileInput');
    getEnglishJsonFile("../../CommonUtils/en_properties.json");
}

function closeBtn(event){
    popupclose();
}
function saveUpdateBtn(params) {
    var name = document.getElementById('name').value;
    var docNumber = document.getElementById('docNumber').value;
    console.log(name);
    console.log(docNumber);    
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