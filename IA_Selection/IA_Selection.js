let dynamicUrl;

function connectedCallback(event) {
    try {

        signincheck();
        const urlSearchParams = new URLSearchParams(window.location.search);
        const type = urlSearchParams.get('type');

        if (type == 'dashboard') {
            dynamicUrl = '../IA_Dashboard/IA_Dashboard.html';
        } else if (type == 'data') {
            dynamicUrl = '../IA_Listview/IA_Listview.html';
        }

    } catch (error) {
        console.error(error);
    }
}

function setHref(event) {
    try {
        let type = event.target.id;
        console.log(type);
        if (type == 'reading') {
            dynamicUrl = dynamicUrl + '?type=reading';
        } else {
            dynamicUrl = dynamicUrl + '?type=listening';
        }

        event.target.href = dynamicUrl;
        window.location.href = dynamicUrl;
    } catch (error) {
        console.log(error);
    }
}