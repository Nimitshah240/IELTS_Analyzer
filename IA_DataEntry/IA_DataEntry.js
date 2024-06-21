function sectionsetter(event) {
    try {
        const urlSearchParams = new URLSearchParams(window.location.search);
        const type = urlSearchParams.get('type');

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
        const urlSearchParams = new URLSearchParams(window.location.search);
        const type = urlSearchParams.get('type');
        var dynamicUrl = '../IA_Listview/IA_Listview.html?type=' + type;
        event.target.href = dynamicUrl;
        window.location.href = dynamicUrl;
    } catch (error) {
        console.log(error);
    }
}

function popupopen(event) {
    try {
        var type = event.target.id;
        console.log(type);
        if (type == 'save') {
            document.getElementById('save-div').style.display = 'flex';
        } else {
            document.getElementById('show-div').style.display = 'flex';
        }
    } catch (error) {
        console.log(error);
    }
}

function popupclose(event) {
    try {
        var type = event.target.id;
        document.getElementById('save-div').style.display = 'none';
        document.getElementById('show-div').style.display = 'none';

    } catch (error) {
        console.log(error);
    }
}