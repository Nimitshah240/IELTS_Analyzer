// Developer - Nimit Shah
// Developed on - 21/12/2024
// Description - Use to initialize central student data page
// Updated on - -
// Input - none
async function connectedCallback() {
    try {
        await getEnglishJsonFile('../en_properties.json');
        if (sessionStorage.getItem('Check')) {
            document.getElementById('validation-box').style.display = 'none';
            document.getElementById('body-section').style.display = 'block';
            document.getElementById('dataheader').style.display = 'block';
            setdata(JSON.parse(sessionStorage.getItem('Data')));
        }
    } catch (error) {
        createToast('error', error)
    }

}


// Developer - Nimit Shah
// Developed on - 21/12/2024
// Description - Use to check user is valid or not and also get data of students
// Updated on - -
// Input - none
function checkuser() {
    try {
        var username = document.getElementById('username').value;
        var password = document.getElementById('password').value;
        apiURL = enProperties.apiURL + enProperties.apiEndPoints.studentApi + enProperties.apiEndPoints.allStudentData;
        fetch(`${apiURL}?username=${username}&password=${password}`)
            .then(response => response.json())
            .then(responsedata => {

                if (responsedata == 'Invalid User') {
                    createToast('error', 'Invalid User');
                } else {
                    sessionStorage.setItem('Check', true)
                    createToast('success', 'Valid User');
                    document.getElementById('validation-box').style.display = 'none';
                    document.getElementById('body-section').style.display = 'block';
                    document.getElementById('dataheader').style.display = 'block';
                }
                if (responsedata.length != 0 && responsedata != 'Invalid User') {
                    sessionStorage.setItem('Data', JSON.stringify(responsedata))
                    setdata(responsedata);
                }

                if (responsedata.length == 0) {
                    document.getElementById('no_data').style.display = 'flex';
                    createToast('error', 'No data found');
                }

            }).catch(error => createToast('error', error));
    } catch (error) {
        console.error(error);
    }
}


// Developer - Nimit Shah
// Developed on - 21/12/2024
// Description - Use to set list view of student data
// Updated on - -
// Input - responsedata
function setdata(responsedata) {
    try {
        let htmldata = ''
        responsedata.forEach((element, index) => {
            let date = new Date(element.loginDate);
            let year = date.getFullYear();
            let month = ('0' + (date.getMonth() + 1)).slice(-2);
            let day = ('0' + date.getDate()).slice(-2);
            date = `${year}-${month}-${day}`;
            htmldata +=
                '<div class="data" id=' + element.id + '>' +
                '<div class="column index"  id=' + element.id + '>' + (index + 1) + '</div>' +
                '<div class="column studentname"  id=' + element.id + '>' + element.name + '</div>' +
                '<div class="column date"  id=' + element.id + '>' + date + '</div>' +
                '<div class="column total"  id=' + element.id + '>' + element.reading_count + '</div>' +
                '<div class="column dashboard dash" onclick="opendashboard(event)" id=' + element.id + '> <button class="button-63 dashboard-button" name="Reading" id=' + element.id + '>Dashboard</button>' + '</div>' +
                '<div class="column total"  id=' + element.id + '>' + element.listening_count + '</div>' +
                '<div class="column dashboard dash" onclick="opendashboard(event)" id=' + element.id + '>' + '<button class="button-63 dashboard-button" name="Listening" id=' + element.id + '>Dashboard</button>' + '</div>' +
                '</div>'
        });

        document.getElementById("table").innerHTML = htmldata;
    } catch (error) {
        createToast('error', error)
    }
}


// Developer - Nimit Shah
// Developed on - 21/12/2024
// Description - Use to open dashboard of selected student
// Updated on - -
// Input - event
async function opendashboard(event) {
    try {
        let module = event.target.name;
        let user_id = event.target.id;
        sessionStorage.setItem('student_id', JSON.stringify(user_id));
        dynamicUrl = await getFilePaths("dashboard") + "?module=" + module + "&teacher=true";

        event.target.href = dynamicUrl;
        window.location.href = dynamicUrl;
    } catch (error) {
        console.error(error);
    }
}