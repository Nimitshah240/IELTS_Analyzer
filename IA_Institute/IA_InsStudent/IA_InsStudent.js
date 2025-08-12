const urlSearchParams = new URLSearchParams(window.location.search);
let instituteId = urlSearchParams.get('insId');
let allData = [];
let delInsStudentId;

async function insStudentConnectedCallback() {
    try {
        await getEnglishJsonFile('../../CommonUtils/en_properties.json');
        Userlogo();
        apiURL = enProperties.apiURL + enProperties.apiEndPoints.insStudent + `?instituteId=${instituteId}`;
        let responsedata = await apiCallOuts(apiURL, "GET", null, 6000);
        if (responsedata.message == null || responsedata.message == undefined) {
            allData = responsedata;
            setView(allData);
        }
    } catch (error) {
        createToast('error', 'Error while loading : ' + error.message);
    }
}

function openStudentAddPopup(event) {
    try {
        let data = null;
        let targetId = event.target.id;
        if (targetId != null && targetId != '') {
            allData.forEach(element => {
                if (element.id == targetId) {
                    data = element;
                }
            })
        }
        document.getElementById('popupFrame').style.display = "flex";
        popupFrame.contentWindow.postMessage({ source: 'insStudentAddPopup', command: 'openPopup', data: { 'data': data, 'instituteId': instituteId } }, enProperties.domainName);
    } catch (error) {
        console.log(error);
    }
}

window.addEventListener('message', function (event) {
    try {
        if (event.origin !== enProperties.domainName) return;

        const message = event.data;
        let data;
        if (message.command == 'closePopup') {
            if (message.source == 'IA_InsStudentAddPopup') {
                if (message.data.operation == 'save') {
                    data = message.data.data;
                    allData.push(data);
                    setView(allData);
                }
            } else if (message.source == 'IA_Delete') {
                if (message.data.deleteType) {
                    afterDeleteInsStudent();
                }
            }
            document.getElementById('popupFrame').style.display = "none";
        }
    } catch (error) {
        console.log(error);
    }
});

function setView(data) {
    if (data.length > 0) {
        let htmldata = '';
        data.forEach((element, index) => {
            let createdDate = new Date(element.createdDate);
            let year = createdDate.getFullYear();
            let month = ('0' + (createdDate.getMonth() + 1)).slice(-2);
            let day = ('0' + createdDate.getDate()).slice(-2);
            createdDate = `${year}-${month}-${day}`;
            htmldata += `
            <div class="data" id='${element.id}'>
                    <div class="column index" onclick="openStudentAddPopup(event)" id="${element.id}"> ${index + 1} </div>
                    <div class="column examname" onclick="openStudentAddPopup(event)" id="${element.id}"> ${element.name} </div>
                    <div class="column date" onclick="openStudentAddPopup(event)" id="${element.id}">  ${createdDate} </div>
                    <div class="column date" onclick="reSendEmail(event)" id="${element.id}">  <i class="fa fa-share-alt" title="Resend email" id="${element.id}" aria-hidden="true"></i> </div>
                    <div class="column total" onclick="openStudentAddPopup(event)" id="${element.id}"> <button class="button-63 dashboard-button" onclick="openDashboard(event)" id='${element.studentId}'>Dashboard</button></div>
                    <div class="column section" onclick="openStudentAddPopup(event)" id="${element.id}"> <button class="button-63 dashboard-button" id='${element.id}'>Report</button></div>
                    <div class="column delete" onclick="openDeletePopup(event)" id="${element.id}">  <i class="fa fa-trash" id="${element.id}" aria-hidden="true"></i></div>
                 </div>`;
        });
        document.getElementById("table").innerHTML = htmldata;
    } else {
        document.getElementById("table").innerHTML = '<span class="no_data">No Data Found!</span>';
    }
}

function openDeletePopup(event) {
    delInsStudentId = event.target.id;
    let endPoints = ['insStudent'];
    let params = [`insStudentId=${delInsStudentId}`];
    let data = { 'jsonBody': null, 'endPoints': endPoints, 'params': params, 'module': "IA_InsStudent" };
    document.getElementById('popupFrame').style.display = "flex";
    popupFrame.contentWindow.postMessage({ source: 'delete', command: 'openPopup', data: data }, enProperties.domainName);
}

function afterDeleteInsStudent() {
    try {
        allData.forEach((element, i) => {
            if (element.id == delInsStudentId) {
                allData.splice(i, 1);
            }
        });
        setView(allData)
        createToast('success', 'Successfully deleted');
    } catch (error) {
        console.log(error);
    }
}

async function reSendEmail(event) {
    try {
        let insStudentId = event.target.id;
        apiURL = enProperties.apiURL + enProperties.apiEndPoints.insStudent + enProperties.apiEndPoints.sendEmail + `?insStudentId=${insStudentId}`;
        let responsedata = await apiCallOuts(apiURL, "GET", null, 6000);
        createToast('success', responsedata.message);
    } catch (error) {
        console.log(error);
    }
}

async function openDashboard(event) {
    try {
        sessionStorage.setItem('student_id', event.target.id);
        dynamicUrl = await getFilePaths("selection") + '?type=dashboard&teacher=true';
        event.target.href = dynamicUrl;
        window.location.href = dynamicUrl;
    } catch (error) {
        console.log(error);
    }
}