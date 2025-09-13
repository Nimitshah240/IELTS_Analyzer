let mainData;
let instituteId;
document.addEventListener('DOMContentLoaded', function () {
    window.addEventListener('message', function (event) {
        try {
            mainData = event.data.data.data;
            instituteId = event.data.data.instituteId;
            setData(mainData);
            getEnglishJsonFile("../../CommonUtils/en_properties.json");
        } catch (error) {
            console.log(error);
        }
    });
});

function insStudentAddPopupConnectedCallback() {

}

function closeBtn(params) {
    popupclose('close');
}

function popupclose(operation) {
    try {
        parent.postMessage(
            { source: 'IA_InsStudentAddPopup', command: 'closePopup', data: { 'data': mainData, 'operation': operation } },
            enProperties.domainName)
    } catch (error) {
        console.log(error);
    }
}

async function getSaveBtn(params) {
    try {
        let btnText = document.getElementById('btnYes').innerText;
        if (btnText === 'Get') {
            email = document.getElementById('email').value;
            id = document.getElementById('id').value;
            if (id != null && email != null) {
                let searchKey = id.trim() != '' ? id : email;
                apiURL = enProperties.apiURL + enProperties.apiEndPoints.insStudent + enProperties.apiEndPoints.insStudentData + `?searchKey=${searchKey}`;
                let responsedata = await apiCallOuts(apiURL, "GET", null, 6000);
                if (responsedata.code == 200 && responsedata.data != null)
                    setData(responsedata.data);
                delete mainData.createdDate;
                delete mainData.updatedDate;
                delete mainData.createdBy;
                delete mainData.updatedBy;
            }
        } else if (btnText === 'Save') {
            mainData.instituteId = instituteId;
            apiURL = enProperties.apiURL + enProperties.apiEndPoints.insStudent;
            let responsedata = await apiCallOuts(apiURL, "POST", JSON.stringify(mainData), 6000);
            if (responsedata.code == 200 && responsedata.data != null) {
                mainData = responsedata.data;
                popupclose('save');
            } else {
                createToast('warning', responsedata.message)
            }
        }
    } catch (error) {
        console.error(error);
    }
}

function setData(data) {
    try {
        if (data != null && data.studentId != null) {
            if (data.studentId != null) {
                document.getElementById('id').value = data.studentId;
                document.getElementById('id').disabled = true;
            }
            if (data.name != null) document.getElementById('name').value = data.name;
            if (data.number != null) document.getElementById('number').value = data.number;

            if (data.email != null) {
                document.getElementById('email').value = data.email;
                document.getElementById('email').disabled = true;
            }
            document.getElementById('name-div').style.display = 'flex';
            document.getElementById('number-div').style.display = 'flex';
            document.getElementById('orText').style.display = 'none';
            document.getElementById('btnYes').innerText = 'Save';
            mainData = data;

        }
        else if (data != null && data.message != null) createToast('warning', data.message);
        else {
            document.getElementById('btnYes').innerText = 'Get';
            document.getElementById('id').disabled = false;
            document.getElementById('email').disabled = false;
            document.getElementById('name-div').style.display = 'none';
            document.getElementById('number-div').style.display = 'none';
            document.getElementById('orText').style.display = 'flex';
        }
    } catch (error) {
        console.log(error);
    }
}