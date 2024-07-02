const urlSearchParams = new URLSearchParams(window.location.search);
var type = urlSearchParams.get('type');

var tdExam = urlSearchParams.get('tdExam')
var exam = JSON.parse(localStorage.getItem('Exam' + tdExam));
var questions = JSON.parse(localStorage.getItem('Questions' + tdExam));
console.log(questions);
function connectedCallback() {
    sectionsetter();
    signincheck();
}

function sectionsetter(event) {
    try {
        if (type == 'reading') {
            document.getElementById('section4').style.display = 'none';
        } else {
            document.getElementById('section4').style.display = 'flex';
        }
    } catch (error) {
        console.log(error);
    }
}

function setHref(event) {
    try {

        var dynamicUrl = '../IA_Listview/IA_Listview.html?type=' + type;
        event.target.href = dynamicUrl;
        window.location.href = dynamicUrl;
    } catch (error) {
        console.log(error);
    }
}

function popupopen(event) {
    try {

        var section = event.target.dataset.section;
        var type = event.target.id;


        if (type == 'save') {
            document.getElementById('save-div').style.display = 'flex';
        } else {
            var sectiondata = '<tr><th colspan="5"> Question Type</th></tr><tr><th> Correct </th><th> Incorrect </th><th> Missed </th><th> Total </th><th> Delete </th></tr >';

            questions.forEach(element => {
                if (element.Section == section) {
                    sectiondata +=
                        '<tr><td colspan="5">' + element.Question + '</td></tr >' +
                        '<tr>' +
                        '<td>' + element.Obtain + '</td>' +
                        '<td>' + element.Wrong + '</td>' +
                        '<td>' + element.Missed + '</td>' +
                        '<td> ' + element.Total + ' </td>' +
                        '<td class="delete-icon"><i class="fa fa-trash" aria-hidden="true"></i> </td> </tr>';
                }
            });
            document.getElementById('show-div').style.display = 'flex';
            document.getElementById("table").innerHTML = sectiondata;
            document.getElementById("data-title").innerHTML = 'Section ' + section;

        }
    } catch (error) {
        console.log(error.message);
        console.log(error.linenumber);

    }
}

function popupclose(event) {
    try {
        var type = event.target.id;
        console.log(type);
        if (type == 'save') {
            // document.getElementById('save-div').style.display = 'none';
            dynamicUrl = '../IA_Listview/IA_Listview.html?type=' + type;

            event.target.href = dynamicUrl;
            window.location.href = dynamicUrl;
        } else {
            document.getElementById('save-div').style.display = 'none';
            document.getElementById('show-div').style.display = 'none';
        }

    } catch (error) {
        console.log(error);
    }
}