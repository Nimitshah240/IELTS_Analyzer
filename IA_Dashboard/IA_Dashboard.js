const urlSearchParams = new URLSearchParams(window.location.search);
const module = urlSearchParams.get('module');
const teachermode = urlSearchParams.get('teacher');
if (teachermode == 'true') {
    user_id = JSON.parse(sessionStorage.getItem('student_id'));
} else {
    user_id = JSON.parse(localStorage.getItem('user_data')).id;
}

const exammap = new Map();
const sectionscorrect = new Map();
sectionscorrect.set('section1', 0);
sectionscorrect.set('section2', 0);
sectionscorrect.set('section3', 0);
sectionscorrect.set('section4', 0);

const sectionsincorrect = new Map();
sectionsincorrect.set('section1', 0);
sectionsincorrect.set('section2', 0);
sectionsincorrect.set('section3', 0);
sectionsincorrect.set('section4', 0);

const sectiontotal = new Map();
sectiontotal.set('section1', 0);
sectiontotal.set('section2', 0);
sectiontotal.set('section3', 0);
sectiontotal.set('section4', 0);

let question_correct = new Map();
let question_incorrect = new Map();
let question_total = new Map();
let responseData = [];
let bandtotal = new Map();
let setcolor = [];
let totalquestion = 0;
let fontStyle = '25px sans-serif';
let textAroundposition = 0 + 155;
colorList = ['#17ffee', '#6917d0', '#cc17ff', '#17ffa4', '#ff1791', '#95e214', '#ee9b00', '#94d2bd', '#cdff03', '#007cbe', '#bdb2ff', '#ede7b1', '#d3a588'];

// Developer - Nimit Shah
// Developed on - 21/12/2024
// Description - Use to initialize data of Reading or Listening of user for Dashboard view
// Updated on - -
// Input - none
async function dashboardconnectedCallback() {
    try {

        await getEnglishJsonFile('../en_properties.json');
        if (screen.width >= 768 && screen.width < 1024) {
            textAroundposition = 0 + 105;
            fontStyle = '20px sans-serif'
        }
        Userlogo();
        if ((JSON.parse(localStorage.getItem('user_data')) != null)) {

            apiURL = enProperties.apiURL + enProperties.apiEndPoints.dashboard + `?user_id=${user_id}&module=${module}`;
            let responsedata = await apiCallOuts(apiURL, 'GET', null);

            if (responsedata.length > 0) {
                Array.from(document.getElementsByClassName('charts')).forEach(element => {
                    element.style.display = "flex";
                });
                Array.from(document.getElementsByClassName('no_graph')).forEach(element => {
                    element.style.display = "none";
                });

                Array.from(document.getElementsByClassName('body_section')).forEach(element => {
                    element.style.height = "fit-content"
                });
            } else {
                createToast('error', 'No data found');
            }

            responseData = responsedata;
            responseData.forEach(element => {
                // FOR CHART 2 and 5
                totalquestion += element.total;
                if (exammap.has(element.examId)) {
                    exammap.set(element.examId, { 'examName': element.examName, 'date': element.examDate, 'score': exammap.get(element.examId).score + element.correct });
                } else {
                    bandtotal.set(element.examId, element.band)
                    exammap.set(element.examId, { 'examName': element.examName, 'date': element.examDate, 'score': element.correct });
                }

                // FOR CHART 1 and 3
                if (element.section == 1) {
                    sectionscorrect.set('section1', sectionscorrect.get('section1') + element.correct);
                    sectionsincorrect.set('section1', sectionsincorrect.get('section1') + element.incorrect);
                    sectiontotal.set('section1', sectiontotal.get('section1') + element.total);
                } else if (element.section == 2) {
                    sectionscorrect.set('section2', sectionscorrect.get('section2') + element.correct);
                    sectionsincorrect.set('section2', sectionsincorrect.get('section2') + element.incorrect);
                    sectiontotal.set('section2', sectiontotal.get('section2') + element.total);
                } else if (element.section == 3) {
                    sectionscorrect.set('section3', sectionscorrect.get('section3') + element.correct);
                    sectionsincorrect.set('section3', sectionsincorrect.get('section3') + element.incorrect);
                    sectiontotal.set('section3', sectiontotal.get('section3') + element.total);
                } else if (element.section == 4) {
                    sectionscorrect.set('section4', sectionscorrect.get('section4') + element.correct);
                    sectionsincorrect.set('section4', sectionsincorrect.get('section4') + element.incorrect);
                    sectiontotal.set('section4', sectiontotal.get('section4') + element.total);
                }

                //  FOR CHART 4 || Question wise correct map
                if (question_correct.has(element.questionType)) {
                    question_correct.set(element.questionType, question_correct.get(element.questionType) + element.correct)
                } else {
                    question_correct.set(element.questionType, element.correct);
                }

                // FOR CHART 6 || Question wise incorrect map
                if (question_incorrect.has(element.questionType)) {
                    question_incorrect.set(element.questionType, question_incorrect.get(element.questionType) + element.incorrect)
                } else {
                    question_incorrect.set(element.questionType, element.incorrect);
                }

                // FOR TIP || Question wise total map
                if (question_total.has(element.questionType)) {
                    question_total.set(element.questionType, question_total.get(element.questionType) + element.total)
                } else {
                    question_total.set(element.questionType, element.total);
                }
            });

            drawChart();

            function drawChart() {
                try {
                    countbox();
                    chart1();
                    chart3();
                    chart5();
                    chart4();
                    chart6();
                    chart7();
                    chart8();
                    // chart9();
                } catch (error) {
                    createToast('error', 'Error while loading chart : ' + error.message)
                }
            }
        } else {
            createToast('error', 'Please Login First')
        }
    } catch (error) {
        createToast('error', 'Error while loading chart : ' + error.message)
    }
}


const textAroundDoughnut1 = {
    id: 'textAroundDoughnut',
    beforeDatasetDraw(chart, args, plugins) {
        const { ctx, data } = chart;
        const xCenter = chart.getDatasetMeta(0).data[0].x;
        const yCenter = chart.getDatasetMeta(0).data[0].y;

        ctx.save();
        ctx.font = fontStyle;
        ctx.fillStyle = 'rgba(0,0,0,1)';
        ctx.textAlign = 'center'
        ctx.fillText('Correct', xCenter, textAroundposition);

    }
}
// Developer - Nimit Shah
// Developed on - 21/12/2024
// Description - Use to initialize chart 1
// Updated on - -
// Input - none
function chart1() {
    try {
        // 1st Chart ------------------------------------------------------

        let setlabel = ['Section 1', 'Section 2', 'Section 3', 'Section 4'];
        let setdata = [parseInt(sectionscorrect.get('section1')), parseInt(sectionscorrect.get('section2')), parseInt(sectionscorrect.get('section3')), parseInt(sectionscorrect.get('section4'))];

        const ctx = document.getElementById('chart1');
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: setlabel,
                datasets: [{
                    label: 'Correct',
                    data: setdata,
                }]
            },
            options: {
                plugins: {
                    legend: {
                        display: false,
                        labels: {
                            color: 'rgba(0,0,0,1)'
                        }
                    }
                }
            },
            plugins: [textAroundDoughnut1]
        });

    } catch (error) {
        createToast('error', 'Error while loading chart 1 : ' + error.message)
    }
}

// Developer - Nimit Shah
// Developed on - 21/12/2024
// Description - Use to initialize count boxes
// Updated on - -
// Input - none
function countbox() {
    try {
        let avg = [];
        bandtotal.forEach(element => {
            avg.push(element);
        });
        document.getElementById('examcount').innerHTML = exammap.size
        document.getElementById('totalquestion').innerHTML = totalquestion
        document.getElementById('avg-band').innerHTML = calculateAverage(avg);
    } catch (error) {
        console.error(error);
    }
}

// Developer - Nimit Shah
// Developed on - 21/12/2024
// Description - Use to calculate average of band
// Updated on - -
// Input - band
function calculateAverage(numbers) {
    if (numbers.length === 0) {
        return 0;
    }
    const sum = numbers.reduce((acc, curr) => acc + curr, 0);
    const average = sum / numbers.length;
    const roundToNearestHalf = (num) => Math.round(num * 2) / 2;
    return roundToNearestHalf(average);
}

const textAroundDoughnut = {
    id: 'textAroundDoughnut',
    beforeDatasetDraw(chart, args, plugins) {
        const { ctx, data } = chart;
        const xCenter = chart.getDatasetMeta(0).data[0].x;
        const yCenter = chart.getDatasetMeta(0).data[0].y;

        ctx.save();
        ctx.font = fontStyle;
        ctx.fillStyle = 'rgba(0,0,0,1)';
        ctx.textAlign = 'center'
        ctx.fillText('Incorrect', xCenter, textAroundposition);

    }
}
// Developer - Nimit Shah
// Developed on - 21/12/2024
// Description - Use to initialize chart 3
// Updated on - -
// Input - none
function chart3() {
    try {
        // 3rd Chart ------------------------------------------------------

        let setlabel = ['Section 1', 'Section 2', 'Section 3', 'Section 4'];
        let setdata = [parseInt(sectionsincorrect.get('section1')), parseInt(sectionsincorrect.get('section2')), parseInt(sectionsincorrect.get('section3')), parseInt(sectionsincorrect.get('section4'))];

        const ctx = document.getElementById('chart3');
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: setlabel,
                datasets: [{
                    label: 'Incorrect',
                    data: setdata,
                }]
            },
            options: {
                plugins: {
                    legend: {
                        display: false,
                        labels: {
                            color: 'rgba(0,0,0,1)'
                        }
                    }
                },
            },
            plugins: [textAroundDoughnut]
        });

    } catch (error) {
        createToast('error', 'Error while loading chart 3 : ' + error.message)
    }
}

// Developer - Nimit Shah
// Developed on - 21/12/2024
// Description - Use to initialize chart 4
// Updated on - -
// Input - none
function chart4() {
    try {
        // 4th Chart ----------------------------------------------------

        let setdata = [];
        let setlabel = [];

        for (let key of question_correct.keys()) {
            setlabel.push(key);
            setdata.push(question_correct.get(key));
        }

        const ctx = document.getElementById('chart4').getContext('2d');
        var purple_orange_gradient = ctx.createLinearGradient(0, 0, 0, 600);
        purple_orange_gradient.addColorStop(0, '#008000');
        purple_orange_gradient.addColorStop(0.5, '#ccff33');

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: setlabel,
                datasets: [{
                    label: 'Correct',
                    data: setdata,
                    borderColor: 'white',
                    borderWidth: 2,
                    borderRadius: 10,
                    backgroundColor: purple_orange_gradient,
                    hoverBackgroundColor: purple_orange_gradient,
                    hoverBorderWidth: 2,
                    hoverBorderColor: 'black'
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            color: 'rgba(0,0,0,1)'
                        }
                    },
                    x: {
                        ticks: {
                            color: 'rgba(0,0,0,1)'
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: true,
                        labels: {
                            color: 'rgba(0,0,0,1)'
                        }
                    }
                }
            }
        });
    } catch (error) {
        createToast('error', 'Error while loading chart 4 : ' + error.message)
    }
}

// Developer - Nimit Shah
// Developed on - 21/12/2024
// Description - Use to initialize chart 5
// Updated on - -
// Input - none
function chart5() {
    try {
        // 5th Chart ---------------------------------------------- 

        let setdata = [];
        let setlabel = [];

        for (const key of exammap.keys()) {
            setlabel.push(exammap.get(key).examName);
            setdata.push(exammap.get(key).score);
        }
        const ctx = document.getElementById('chart5').getContext('2d');
        const gradientColor = ctx.createLinearGradient(0, 0, 0, 350);
        gradientColor.addColorStop(0.2, '#5aedc9')
        gradientColor.addColorStop(1, 'rgba(255, 255, 255, 0)')

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: setlabel,
                datasets: [
                    {
                        label: '',
                        data: setdata,
                        fill: true,
                        borderColor: 'rgb(44, 217, 255)',
                        tension: 0.3,
                        borderWidth: 2,
                        fill: {
                            target: 'origin',
                            above: gradientColor,
                            below: gradientColor
                        },
                    }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            color: 'rgba(0,0,0,1)'
                        }
                    },
                    x: {
                        beginAtZero: true,
                        ticks: {
                            color: 'rgb(0,0,0)'
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false,
                        labels: {
                            color: 'rgba(0,0,0,1)'
                        }
                    }
                }
            }
        });

    } catch (error) {
        createToast('error', 'Error while loading chart 5 : ' + error.message)
    }
}

// Developer - Nimit Shah
// Developed on - 21/12/2024
// Description - Use to initialize chart 6
// Updated on - -
// Input - none
function chart6() {
    try {

        // 6th Chart ---------------------------------------------

        let setdata = [];
        let setlabel = [];

        for (let key of question_incorrect.keys()) {
            setlabel.push(key);
            setdata.push(question_incorrect.get(key));
        }

        const ctx = document.getElementById('chart6').getContext('2d');
        var purple_orange_gradient = ctx.createLinearGradient(0, 0, 0, 600);
        purple_orange_gradient.addColorStop(0, '#f63e02');
        purple_orange_gradient.addColorStop(0.8, '#ffea00');

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: setlabel,
                datasets: [{
                    label: 'Incorrect',
                    data: setdata,
                    borderColor: 'white',
                    borderWidth: 2,
                    borderRadius: 10,
                    backgroundColor: purple_orange_gradient,
                    hoverBackgroundColor: purple_orange_gradient,
                    hoverBorderWidth: 2,
                    hoverBorderColor: 'black'
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            color: 'rgba(0,0,0,1)'
                        }
                    },
                    x: {
                        beginAtZero: true,
                        ticks: {
                            color: 'rgba(0,0,0,1)'
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: true,
                        labels: {
                            color: 'rgba(0,0,0,1)'
                        }
                    }
                }
            }
        });

    } catch (error) {
        createToast('error', 'Error while loading chart 6 : ' + error.message)
    }
}

// Developer - Nimit Shah
// Developed on - 21/12/2024
// Description - Use to initialize chart 7
// Updated on - -
// Input - none
function chart7() {
    // 7th chart -----------------------------------------------
    try {

        let quest_score1 = new Map();
        let quest_score2 = new Map();
        let quest_score3 = new Map();
        let quest_score4 = new Map();
        let questionType = [];

        responseData.forEach(element => {
            if (!questionType.includes(element.questionType) && element.correct != '') {
                questionType.push(element.questionType);
            }
            if (element.section == 1) {
                if (quest_score1.has(element.questionType)) {
                    quest_score1.set(element.questionType, quest_score1.get(element.questionType) + element.correct);
                } else {
                    quest_score1.set(element.questionType, element.correct);
                }
            } else if (element.section == 2) {
                if (quest_score2.has(element.questionType)) {
                    quest_score2.set(element.questionType, quest_score2.get(element.questionType) + element.correct);
                } else {
                    quest_score2.set(element.questionType, element.correct);
                }
            } else if (element.section == 3) {
                if (quest_score3.has(element.questionType)) {
                    quest_score3.set(element.questionType, quest_score3.get(element.questionType) + element.correct);
                } else {
                    quest_score3.set(element.questionType, element.correct);
                }
            } else if (element.section == 4) {
                if (quest_score4.has(element.questionType)) {
                    quest_score4.set(element.questionType, quest_score4.get(element.questionType) + element.correct);
                } else {
                    quest_score4.set(element.questionType, element.correct);
                }
            }
        });
        const ctx = document.getElementById('chart7');
        let dataset = [];
        questionType.forEach((element, index) => {
            dataset.push({
                'label': element,
                'data': [quest_score1.get(element) == undefined ? 0 : quest_score1.get(element),
                quest_score2.get(element) == undefined ? 0 : quest_score2.get(element),
                quest_score3.get(element) == undefined ? 0 : quest_score3.get(element),
                quest_score4.get(element) == undefined ? 0 : quest_score4.get(element)],
                'backgroundColor': colorList.at(index),
                'borderWidth': 1,
                hoverBorderWidth: 2,
                'borderColor': 'black',
                borderRadius: 5,
            })
        });
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Section 1', 'Section 2', 'Section 3', 'Section 4'],
                datasets: dataset
            },
            options: {
                indexAxis: 'y',
                scales: {
                    x: {
                        stacked: true,
                        ticks: {
                            color: 'rgba(0,0,0,1)'
                        }
                    },
                    y: {
                        stacked: true,
                        ticks: {
                            color: 'rgba(0,0,0,1)'
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: true,
                        labels: {
                            color: 'rgba(0,0,0,1)'
                        }
                    }
                }
            }
        });

    } catch (error) {
        createToast('error', 'Error while loading chart 7 : ' + error.message)
    }
}

// Developer - Nimit Shah
// Developed on - 21/12/2024
// Description - Use to initialize chart 8
// Updated on - -
// Input - none
function chart8() {
    try {
        // 8th Chart -----------------------------------------------
        let quest_score1 = new Map();
        let quest_score2 = new Map();
        let quest_score3 = new Map();
        let quest_score4 = new Map();
        let questionType = [];

        responseData.forEach(element => {
            if (!questionType.includes(element.questionType) && element.incorrect != '') {
                questionType.push(element.questionType);
            }
            if (element.section == 1) {
                if (quest_score1.has(element.questionType)) {
                    quest_score1.set(element.questionType, quest_score1.get(element.questionType) + element.incorrect);
                } else {
                    quest_score1.set(element.questionType, element.incorrect);
                }
            } else if (element.section == 2) {
                if (quest_score2.has(element.questionType)) {
                    quest_score2.set(element.questionType, quest_score2.get(element.questionType) + element.incorrect);
                } else {
                    quest_score2.set(element.questionType, element.incorrect);
                }
            } else if (element.section == 3) {
                if (quest_score3.has(element.questionType)) {
                    quest_score3.set(element.questionType, quest_score3.get(element.questionType) + element.incorrect);
                } else {
                    quest_score3.set(element.questionType, element.incorrect);
                }
            } else if (element.section == 4) {
                if (quest_score4.has(element.questionType)) {
                    quest_score4.set(element.questionType, quest_score4.get(element.questionType) + element.incorrect);
                } else {
                    quest_score4.set(element.questionType, element.incorrect);
                }
            }
        });

        let dataset = [];
        questionType.forEach((element, index) => {
            dataset.push({
                'label': element,
                'data': [quest_score1.get(element) == undefined ? 0 : quest_score1.get(element),
                quest_score2.get(element) == undefined ? 0 : quest_score2.get(element),
                quest_score3.get(element) == undefined ? 0 : quest_score3.get(element),
                quest_score4.get(element) == undefined ? 0 : quest_score4.get(element)],
                'backgroundColor': colorList.at(index),
                'borderWidth': 1,
                hoverBorderWidth: 2,
                'borderColor': 'black',
                borderRadius: 5,
            })
        });
        const ctx = document.getElementById('chart8');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Section 1', 'Section 2', 'Section 3', 'Section 4'],
                datasets: dataset
            },
            options: {
                indexAxis: 'y',
                scales: {
                    x: {
                        stacked: true,
                        ticks: {
                            color: 'rgba(0,0,0,1)'
                        }
                    },
                    y: {
                        stacked: true,
                        ticks: {
                            color: 'rgba(0,0,0,1)'
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: true,
                        labels: {
                            color: 'rgba(0,0,0,1)'
                        }
                    }
                }
            }
        });

    } catch (error) {
        createToast('error', 'Error while loading chart 8 : ' + error.message)
    }
}

// function chart9() {
//     try {
//         // 9th Chart --------------------------------------------
//         let quest_score1 = new Map();
//         let quest_score2 = new Map();
//         let quest_score3 = new Map();
//         let quest_score4 = new Map();
//         let questionType = [];

//         responseData.forEach(element => {
//             if (!questionType.includes(element.questionType) && element.miss != '') {
//                 questionType.push(element.questionType);
//             }
//             if (element.section == 1) {
//                 if (quest_score1.has(element.questionType)) {
//                     quest_score1.set(element.questionType, quest_score1.get(element.questionType) + element.miss);
//                 } else {
//                     quest_score1.set(element.questionType, element.miss);
//                 }
//             } else if (element.section == 2) {
//                 if (quest_score2.has(element.questionType)) {
//                     quest_score2.set(element.questionType, quest_score2.get(element.questionType) + element.miss);
//                 } else {
//                     quest_score2.set(element.questionType, element.miss);
//                 }
//             } else if (element.section == 3) {
//                 if (quest_score3.has(element.questionType)) {
//                     quest_score3.set(element.questionType, quest_score3.get(element.questionType) + element.miss);
//                 } else {
//                     quest_score3.set(element.questionType, element.miss);
//                 }
//             } else if (element.section == 4) {
//                 if (quest_score4.has(element.questionType)) {
//                     quest_score4.set(element.questionType, quest_score4.get(element.questionType) + element.miss);
//                 } else {
//                     quest_score4.set(element.questionType, element.miss);
//                 }
//             }
//         });

//         let dataset = [];
//         questionType.forEach((element, index) => {
//             dataset.push({
//                 'label': element,
//                 'data': [quest_score1.get(element) == undefined ? 0 : quest_score1.get(element),
//                 quest_score2.get(element) == undefined ? 0 : quest_score2.get(element),
//                 quest_score3.get(element) == undefined ? 0 : quest_score3.get(element),
//                 quest_score4.get(element) == undefined ? 0 : quest_score4.get(element)],
//                 'backgroundColor': colorList.at(index),
//                 'borderWidth': 2,
//                 'borderColor': 'white'
//             })
//         });
//         const ctx = document.getElementById('chart9');
//         new Chart(ctx, {
//             type: 'bar',
//             data: {
//                 labels: ['Section 1', 'Section 2', 'Section 3', 'Section 4'],
//                 datasets: dataset
//             },
//             options: {
//                 indexAxis: 'y',
//                 scales: {
//                     x: {
//                         stacked: true,
//                         ticks: {
//                             color: 'rgba(0,0,0,1)'
//                         }
//                     },
//                     y: {
//                         stacked: true,
//                         ticks: {
//                             color: 'rgba(0,0,0,1)'
//                         }
//                     }
//                 },
//                 plugins: {
//                     legend: {
//                         display: true,
//                         labels: {
//                             color: 'rgba(0,0,0,1)'
//                         }
//                     }
//                 }
//             }
//         });

//     } catch (error) {
//         createToast('error', 'Error while loading chart 9 : ' + error.message)
//     }
// }

// Developer - Nimit Shah
// Developed on - 21/12/2024
// Description - Use to open summary/tip box and also set values
// Updated on - -
// Input - none
async function tipopen() {
    try {

        Array.from(document.getElementsByClassName('glass')).forEach(element => {
            element.style.backdropFilter = "none";
        });

        // This portion is used to check question wise details
        var correctquest = 0;
        let excellentlist = [];
        let goodlist = [];
        let avglist = [];
        let poorlist = [];
        for (let key of question_total.keys()) {
            correctquest = question_correct.get(key) * 100 / question_total.get(key);

            if (correctquest >= 80) {
                excellentlist.push(' ' + key);
            } else if (correctquest < 80 && correctquest >= 70) {
                goodlist.push(' ' + key);
            } else if (correctquest < 70 && correctquest >= 60) {
                avglist.push(' ' + key);
            } else {
                poorlist.push(' ' + key);
            }
        }
        // ----------------------------------------------------------------------------------

        // This portion is used to check section wise details
        correctquest = 0;
        let goodlistsect = [];
        let poorlistsect = [];
        for (let key of sectiontotal.keys()) {
            correctquest = sectionscorrect.get(key) * 100 / sectiontotal.get(key);

            if (correctquest >= 80) {
                goodlistsect.push(' ' + key.charAt(0).toUpperCase() + key.slice(1));
            } else if (correctquest < 80) {
                poorlistsect.push(' ' + key.charAt(0).toUpperCase() + key.slice(1));
            }
        }
        // ----------------------------------------------------------------------------------


        // This portion is used to set Tip popup
        var tip_popup = document.getElementById('tip-popup');
        tip_popup.style.display = "flex"

        // Excellent question type
        if (excellentlist.length > 0) {
            document.getElementById('excellent').innerHTML = ` You have performed exceptionally 
            well in<span class="list"> ${excellentlist}</span>. Keep up the great work!`;
        } else {
            document.getElementById('excellent').innerHTML = ' - ';
        }

        // Good question type
        if (goodlist.length > 0) {
            document.getElementById('good').innerHTML = ` You are doing well in<span class="list">
             ${goodlist}</span>. With a little more practice, you can excel further.`;
        } else {
            document.getElementById('good').innerHTML = ' - ';
        }

        // Average question type
        if (avglist.length > 0) {
            document.getElementById('average').innerHTML = ` Your performance in<span class="list"> 
            ${avglist}</span> is moderate.Focus on improving this area to achieve better results.`;
        } else {
            document.getElementById('average').innerHTML = ' - ';
        }

        // Poor question type
        if (poorlist.length > 0) {
            document.getElementById('poor').innerHTML = ` There is room for growth in<span class="list"> 
            ${poorlist}</span>. Consider dedicating more time and effort to enhance your skills here.`;
        } else {
            document.getElementById('poor').innerHTML = ' - ';
        }

        let sectiontext = '';

        // Mixture of performance in all section
        if (goodlistsect.length > 0 && poorlistsect.length > 0) {
            sectiontext += `It is evident that your performance in <span class="list"> ${goodlistsect}</span> is excellent, while there is significant room for improvement in<span class="list"> ${poorlistsect}</span>.`
        }
        // Bad perfomance in all section
        if (poorlistsect.length > 0 && goodlistsect.length == 0) {
            sectiontext += `It is evident that your performance in <span class="list"> ${poorlistsect}</span> is very poor, with no strong performance in any section.`
        }
        // Good performance in all section
        if (goodlistsect.length > 0 && poorlistsect.length == 0) {
            sectiontext = 'It is evident that your performance is outstanding across all sections, with no weak areas to note.'
        }

        // Set Section wise tip
        document.getElementById('section-summary').innerHTML = sectiontext

        // Setting href for Trick anchor tag
        dynamicUrl = await getFilePaths("trick") + `?module=${module}`;
        document.getElementById('trick').href = dynamicUrl

    } catch (error) {
        createToast('error', 'Failed to open Tip. Try refreshing page.');
    }
}

// Developer - Nimit Shah
// Developed on - 21/12/2024
// Description - Use to close tip/summary box
// Updated on - -
// Input - none
function tipclose() {
    try {
        Array.from(document.getElementsByClassName('glass')).forEach(element => {
            element.style.backdropFilter = "blur(1px)";
        });
        var tip_popup = document.getElementById('tip-popup');
        tip_popup.style.display = "none"
    } catch (error) {
        console.error(error);
    }
}

// Developer - Nimit Shah
// Developed on - 21/12/2024
// Description - Use to set spinner
// Updated on - -
// Input - none
window.addEventListener("beforeunload", function (event) {
    document.getElementById("spinner").style.display = 'flex';
    document.getElementById("main").style.display = 'none';
});

// Developer - Nimit Shah
// Developed on - 21/12/2024
// Description - Use to remove spinner
// Updated on - -
// Input - none
document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "hidden") {
        document.getElementById("spinner").style.display = 'none';
        document.getElementById("main").style.display = 'block';
    }
});