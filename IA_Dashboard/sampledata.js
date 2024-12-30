const urlSearchParams = new URLSearchParams(window.location.search);
const module = urlSearchParams.get('module');
const teachermode = urlSearchParams.get('teacher');
if (teachermode == 'true') {
    user_id = JSON.parse(localStorage.getItem('student_id'));
} else {
    user_id = JSON.parse(localStorage.getItem('user_data')).user_id;
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
let colorList = ['#ff4a86', '#aeff4a', '#ff4a53', '#ffed4a', '#a14aff', '#ff90b3', '#4aaeff', '#4affc9', '#ff4a4a', '#a172fd', '#4a5cff', '#ef6803', '#722e9a']
let totalquestion = 0;
let textAroundposition = 0 + 155;
if (screen.width >= 768 && screen.width < 1024) {
    textAroundposition = 0 + 120;
}
// Developer - Nimit Shah
// Developed on - 21/12/2024
// Description - Use to initialize data of Reading or Listening of user for Dashboard view
// Updated on - -
// Input - none
function dashboardconnectedCallback() {
    try {

        Userlogo();

        // Changes herer -------
        Array.from(document.getElementsByClassName('charts')).forEach(element => {
            element.style.display = "flex";
        });
        Array.from(document.getElementsByClassName('no_graph')).forEach(element => {
            element.style.display = "none";
        });

        Array.from(document.getElementsByClassName('body_section')).forEach(element => {
            element.style.height = "fit-content"
        });

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
        let colorList = ['#ff4a86', '#aeff4a', '#ff4a53', '#ffed4a', '#a14aff', '#ff90b3', '#4aaeff', '#4affc9', '#ff4a4a', '#a172fd', '#4a5cff', '#ef6803', '#722e9a']
        let totalquestion = 0;
        responseData = [
            { id: 56, user_id: '112727238629250521382', exam_name: 'Reading 1', exam_id: 43, date: '2024-11-17T18:30:00.000Z', module: 'Reading', question_type: 'MCQ', section: 2, total: 4, miss: 0, incorrect: 0, correct: 4 },
            { id: 57, user_id: '112727238629250521382', exam_name: 'Reading 2', exam_id: 44, date: '2024-11-18T18:30:00.000Z', module: 'Reading', question_type: 'Yes/No/Not Given', section: 1, total: 5, miss: 0, incorrect: 0, correct: 5 },
            { id: 59, user_id: '112727238629250521382', exam_name: 'Reading 2', exam_id: 44, date: '2024-11-18T18:30:00.000Z', module: 'Reading', question_type: 'Summary Completion', section: 2, total: 14, miss: 0, incorrect: 10, correct: 4 },
            { id: 58, user_id: '112727238629250521382', exam_name: 'Reading 2', exam_id: 44, date: '2024-11-18T18:30:00.000Z', module: 'Reading', question_type: 'Yes/No/Not Given', section: 1, total: 4, miss: 0, incorrect: 4, correct: 0 },
            { id: 63, user_id: '112727238629250521382', exam_name: 'Reading 3', exam_id: 45, date: '2024-12-26T18:30:00.000Z', module: 'Reading', question_type: 'Note Completion', section: 3, total: 10, miss: 0, incorrect: 4, correct: 6 },
            { id: 60, user_id: '112727238629250521382', exam_name: 'Reading 3', exam_id: 45, date: '2024-12-26T18:30:00.000Z', module: 'Reading', question_type: 'Matching Feature', section: 1, total: 5, miss: 0, incorrect: 4, correct: 1 },
            { id: 65, user_id: '112727238629250521382', exam_name: 'Reading 3', exam_id: 45, date: '2024-12-26T18:30:00.000Z', module: 'Reading', question_type: 'Flow Chart', section: 1, total: 9, miss: 0, incorrect: 5, correct: 4 },
            { id: 62, user_id: '112727238629250521382', exam_name: 'Reading 3', exam_id: 45, date: '2024-12-26T18:30:00.000Z', module: 'Reading', question_type: 'Table Completion', section: 3, total: 5, miss: 0, incorrect: 3, correct: 2 },
            { id: 64, user_id: '112727238629250521382', exam_name: 'Reading 3', exam_id: 45, date: '2024-12-26T18:30:00.000Z', module: 'Reading', question_type: 'Match Paragraph', section: 2, total: 8, miss: 0, incorrect: 3, correct: 5 },
            { id: 61, user_id: '112727238629250521382', exam_name: 'Reading 3', exam_id: 45, date: '2024-12-26T18:30:00.000Z', module: 'Reading', question_type: 'Matching Heading', section: 2, total: 9, miss: 0, incorrect: 6, correct: 3, }
        ]


        responseData.forEach(element => {
            // FOR CHART 2 and 5
            totalquestion += element.total;
            if (exammap.has(element.exam_id)) {
                exammap.set(element.exam_id, { 'exam_name': element.exam_name, 'date': element.date, 'score': exammap.get(element.exam_id).score + element.correct });
            } else {
                bandtotal.set(element.exam_id, element.band)
                exammap.set(element.exam_id, { 'exam_name': element.exam_name, 'date': element.date, 'score': element.correct });
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
            if (question_correct.has(element.question_type)) {
                question_correct.set(element.question_type, question_correct.get(element.question_type) + element.correct)
            } else {
                question_correct.set(element.question_type, element.correct);
            }

            // FOR CHART 6 || Question wise incorrect map
            if (question_incorrect.has(element.question_type)) {
                question_incorrect.set(element.question_type, question_incorrect.get(element.question_type) + element.incorrect)
            } else {
                question_incorrect.set(element.question_type, element.incorrect);
            }

            // FOR TIP || Question wise total map
            if (question_total.has(element.question_type)) {
                question_total.set(element.question_type, question_total.get(element.question_type) + element.total)
            } else {
                question_total.set(element.question_type, element.total);
            }
        });

        drawChart();


        function drawChart() {
            try {
                countbox(bandtotal, exammap, totalquestion);
                chart1(sectionscorrect);
                chart3(sectionsincorrect);
                chart5(exammap);
                chart4(question_correct);
                chart6(question_incorrect);
                chart7(responseData);
                chart8(responseData);
                // chart9();
            } catch (error) {
                createToast('error', 'Error while loading chart : ' + error.message)
            }
        }





    } catch (error) {
        createToast('error', 'Error while loading chart : ' + error.message)
    }
}



// Developer - Nimit Shah
// Developed on - 21/12/2024
// Description - Use to initialize chart 1
// Updated on - -
// Input - none
function chart1(sectionscorrect) {
    try {
        // 1st Chart ------------------------------------------------------

        let fontStyle = '25px sans-serif';
        let textAroundposition = 0 + 155;
        if (screen.width >= 768 && screen.width < 1024) {
            textAroundposition = 0 + 105;
            fontStyle = '20px sans-serif'
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
function countbox(bandtotal, exammap, totalquestion) {
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


// Developer - Nimit Shah
// Developed on - 21/12/2024
// Description - Use to initialize chart 3
// Updated on - -
// Input - none
function chart3(sectionsincorrect) {
    try {
        let fontStyle = '25px sans-serif';
        let textAroundposition = 0 + 155;
        if (screen.width >= 768 && screen.width < 1024) {
            textAroundposition = 0 + 105;
            fontStyle = '20px sans-serif'
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
function chart4(question_correct) {
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
                    // barThickness: 50,
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
function chart5(exammap) {
    try {
        // 5th Chart ---------------------------------------------- 

        let setdata = [];
        let setlabel = [];

        for (const key of exammap.keys()) {
            setlabel.push(exammap.get(key).exam_name);
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
function chart6(question_incorrect) {
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
                    // barThickness: 50,
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
function chart7(responseData) {
    // 7th chart -----------------------------------------------
    try {
        let colorList = ['#ff4a86', '#aeff4a', '#ff4a53', '#ffed4a', '#a14aff', '#ff90b3', '#4aaeff', '#4affc9', '#ff4a4a', '#a172fd', '#4a5cff', '#ef6803', '#722e9a']

        let quest_score1 = new Map();
        let quest_score2 = new Map();
        let quest_score3 = new Map();
        let quest_score4 = new Map();
        let question_type = [];

        responseData.forEach(element => {
            if (!question_type.includes(element.question_type) && element.correct != '') {
                question_type.push(element.question_type);
            }
            if (element.section == 1) {
                if (quest_score1.has(element.question_type)) {
                    quest_score1.set(element.question_type, quest_score1.get(element.question_type) + element.correct);
                } else {
                    quest_score1.set(element.question_type, element.correct);
                }
            } else if (element.section == 2) {
                if (quest_score2.has(element.question_type)) {
                    quest_score2.set(element.question_type, quest_score2.get(element.question_type) + element.correct);
                } else {
                    quest_score2.set(element.question_type, element.correct);
                }
            } else if (element.section == 3) {
                if (quest_score3.has(element.question_type)) {
                    quest_score3.set(element.question_type, quest_score3.get(element.question_type) + element.correct);
                } else {
                    quest_score3.set(element.question_type, element.correct);
                }
            } else if (element.section == 4) {
                if (quest_score4.has(element.question_type)) {
                    quest_score4.set(element.question_type, quest_score4.get(element.question_type) + element.correct);
                } else {
                    quest_score4.set(element.question_type, element.correct);
                }
            }
        });
        const ctx = document.getElementById('chart7');
        let dataset = [];
        question_type.forEach((element, index) => {
            dataset.push({
                'label': element,
                'data': [quest_score1.get(element) == undefined ? 0 : quest_score1.get(element),
                quest_score2.get(element) == undefined ? 0 : quest_score2.get(element),
                quest_score3.get(element) == undefined ? 0 : quest_score3.get(element),
                quest_score4.get(element) == undefined ? 0 : quest_score4.get(element)],
                'backgroundColor': colorList.at(index),
                'borderWidth': 0.5,
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
function chart8(responseData) {
    try {
        let colorList = ['#ff4a86', '#aeff4a', '#ff4a53', '#ffed4a', '#a14aff', '#ff90b3', '#4aaeff', '#4affc9', '#ff4a4a', '#a172fd', '#4a5cff', '#ef6803', '#722e9a']

        // 8th Chart -----------------------------------------------
        let quest_score1 = new Map();
        let quest_score2 = new Map();
        let quest_score3 = new Map();
        let quest_score4 = new Map();
        let question_type = [];

        responseData.forEach(element => {
            if (!question_type.includes(element.question_type) && element.incorrect != '') {
                question_type.push(element.question_type);
            }
            if (element.section == 1) {
                if (quest_score1.has(element.question_type)) {
                    quest_score1.set(element.question_type, quest_score1.get(element.question_type) + element.incorrect);
                } else {
                    quest_score1.set(element.question_type, element.incorrect);
                }
            } else if (element.section == 2) {
                if (quest_score2.has(element.question_type)) {
                    quest_score2.set(element.question_type, quest_score2.get(element.question_type) + element.incorrect);
                } else {
                    quest_score2.set(element.question_type, element.incorrect);
                }
            } else if (element.section == 3) {
                if (quest_score3.has(element.question_type)) {
                    quest_score3.set(element.question_type, quest_score3.get(element.question_type) + element.incorrect);
                } else {
                    quest_score3.set(element.question_type, element.incorrect);
                }
            } else if (element.section == 4) {
                if (quest_score4.has(element.question_type)) {
                    quest_score4.set(element.question_type, quest_score4.get(element.question_type) + element.incorrect);
                } else {
                    quest_score4.set(element.question_type, element.incorrect);
                }
            }
        });

        let dataset = [];
        question_type.forEach((element, index) => {
            dataset.push({
                'label': element,
                'data': [quest_score1.get(element) == undefined ? 0 : quest_score1.get(element),
                quest_score2.get(element) == undefined ? 0 : quest_score2.get(element),
                quest_score3.get(element) == undefined ? 0 : quest_score3.get(element),
                quest_score4.get(element) == undefined ? 0 : quest_score4.get(element)],
                'backgroundColor': colorList.at(index),
                'borderWidth': 0.5,
                'borderColor': 'black',
                borderRadius: 5,
                // barThickness: 50,
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

// Developer - Nimit Shah
// Developed on - 21/12/2024
// Description - Use to open summary/tip box and also set values
// Updated on - -
// Input - none
function tipopen() {
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

            if (correctquest >= 75) {
                goodlistsect.push(' ' + key.charAt(0).toUpperCase() + key.slice(1));
            } else if (correctquest < 75) {
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
        let href = "../IA_Trick/IA_Trick.html?module=";
        if (module == 'Listening') {
            href += 'Listening';
        } else {
            href += 'Reading';
        }
        document.getElementById('trick').href = href

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