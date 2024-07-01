let Question = [
    {
        'Exam Id': '123',
        'Section': '1',
        'Question': 'q',
        'Total': '4',
        'Obtain': '9',
        'Wrong': '9',
        'Missed': '9',
    },
    {
        'Exam Id': '123',
        'Section': '1',
        'Question': 'q',
        'Total': '4',
        'Obtain': '9',
        'Wrong': '9',
        'Missed': '9',
    },
    {
        'Exam Id': '123',
        'Section': '2',
        'Question': 'q',
        'Total': '4',
        'Obtain': '9',
        'Wrong': '9',
        'Missed': '9',
    },
    {
        'Exam Id': '123',
        'Section': '2',
        'Question': 'q',
        'Total': '4',
        'Obtain': '9',
        'Wrong': '9',
        'Missed': '9',
    },
    {
        'Exam Id': '123',
        'Section': '3',
        'Question': 'q',
        'Total': '4',
        'Obtain': '9',
        'Wrong': '9',
        'Missed': '9',
    },
    {
        'Exam Id': '345',
        'Section': '1',
        'Question': 'q',
        'Total': '4',
        'Obtain': '9',
        'Wrong': '9',
        'Missed': '9',
    },
    {
        'Exam Id': '345',
        'Section': '1',
        'Question': 'q',
        'Total': '4',
        'Obtain': '9',
        'Wrong': '9',
        'Missed': '9',
    },
    {
        'Exam Id': '345',
        'Section': '2',
        'Question': 'q',
        'Total': '4',
        'Obtain': '9',
        'Wrong': '9',
        'Missed': '9',
    },
    {
        'Exam Id': '345',
        'Section': '2',
        'Question': 'q',
        'Total': '4',
        'Obtain': '9',
        'Wrong': '9',
        'Missed': '9',
    },
    {
        'Exam Id': '345',
        'Section': '3',
        'Question': 'q',
        'Total': '4',
        'Obtain': '9',
        'Wrong': '9',
        'Missed': '9',
    },
    {
        'Exam Id': '234',
        'Section': '1',
        'Question': 'q',
        'Total': '4',
        'Obtain': '9',
        'Wrong': '9',
        'Missed': '9',
    },
    {
        'Exam Id': '234',
        'Section': '1',
        'Question': 'q',
        'Total': '4',
        'Obtain': '9',
        'Wrong': '9',
        'Missed': '9',
    },
    {
        'Exam Id': '234',
        'Section': '2',
        'Question': 'q',
        'Total': '4',
        'Obtain': '9',
        'Wrong': '9',
        'Missed': '9',
    },
    {
        'Exam Id': '234',
        'Section': '2',
        'Question': 'q',
        'Total': '4',
        'Obtain': '9',
        'Wrong': '9',
        'Missed': '9',
    },
    {
        'Exam Id': '234',
        'Section': '3',
        'Question': 'q',
        'Total': '4',
        'Obtain': '9',
        'Wrong': '9',
        'Missed': '9',
    }

]

let Exam = [
    {
        'Exam Id': '123',
        'Exam Name': 'Exam 1'
    },
    {
        'Exam Id': '234',
        'Exam Name': 'Exam 2'
    },
    {
        'Exam Id': '345',
        'Exam Name': 'Exam 3'
    },
]
console.log(a);
console.log(Exam);

Question.forEach(element => {
    console.log(element);
});


// if (element.ExamId != EId) {
//     if (EId != undefined) {
//         Section1.set(EId, section1);
//         Section2.set(EId, section2);
//         Section3.set(EId, section3);
//         Section4.set(EId, section4);

//         section1 = 0;
//         section2 = 0;
//         section3 = 0;
//         section4 = 0;
//     }
//     EId = element.ExamId;
// }

// if (element.Section == 1) {
//     section1 += element.Total
// } else if (element.Section == 2) {
//     section2 += element.Total
// } else if (element.Section == 3) {
//     section3 += element.Total
// } else if (element.Section == 4) {
//     section4 += element.Total
// }