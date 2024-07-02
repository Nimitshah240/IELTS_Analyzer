async function connectedCallback(event) {
    try {

        // HELPFUL METHOD FOR SUMMING ARRAY !!!! DO NOT REMOVE UNTIL IT USE.
        // const number = [1,2,3,4,5];
        // const sum = number.reduce((accumulator, currentvalue) => accumulator + currentvalue,0);
        // console.log(sum);


        signincheck(() => {
            fetchData();
        });

    } catch (error) {
        console.log('e', error);
    }
}

async function fetchData() {
    try {
        // console.log(localStorage.getItem('user_data'));
        let today = new Date();
        let year = today.getFullYear();
        let month = ('0' + (today.getMonth() + 1)).slice(-2); // Adding leading zero if month is a single digit
        let day = ('0' + today.getDate()).slice(-2); // Adding leading zero if day is a single digit
        today = `${year}-${month}-${day}`;

        const data = JSON.parse(localStorage.getItem('user_data'));
        data.fl_date = today;
        data.ll_date = today;
        data.email = undefined;
        data.location = undefined;
        delete data.picture;
        delete data.family_name;
        delete data.given_name;

        fetch('http://localhost:3000/data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then(response => response.json())
            .then(responseData => {
                console.log('Response from server:', responseData);
            })
            .catch(error => console.error('Error:', error.message));

    } catch (error) {
        console.error(error);
    }
}

function setHref(event) {
    try {
        var dynamicUrl;
        let buttonId = event.target.id;

        if (buttonId == 'selection') {
            dynamicUrl = '../IA_Selection/IA_Selection.html?type=data';
        } else if (buttonId == 'dashboard') {
            dynamicUrl = '../IA_Selection/IA_Selection.html?type=dashboard';
        }

        event.target.href = dynamicUrl;
        window.location.href = dynamicUrl;
    } catch (error) {
        console.error(error);
    }
}
