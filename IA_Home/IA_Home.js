function connectedCallback(event) {
    try {

        // HELPFUL METHOD FOR SUMMING ARRAY !!!! DO NOT REMOVE UNTIL IT USE.
        // const number = [1,2,3,4,5];
        // const sum = number.reduce((accumulator, currentvalue) => accumulator + currentvalue,0);
        // console.log(sum);

        signincheck();
        fetchData();
    } catch (error) {
        console.log('e', error);
    }
}

async function fetchData() {
    try {

        const response = await fetch('/IA_Code/IA_Home/IA_Home.html/data');
        const data = await response.text();
        console.log(data);
        // const dataList = document.getElementById('dataList');
        // dataList.innerHTML = '';
        // data.forEach(item => {
        //     const li = document.createElement('li');
        //     li.textContent = `${item.column1} - ${item.column2}`;
        //     dataList.appendChild(li);
        // });
    } catch (error) {
        console.log(error);
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

function sigin() {
    try {
        let oauth2Endpoint = "https://accounts.google.com/o/oauth2/v2/auth";

        let form = document.createElement('form');
        form.setAttribute('method', 'GET');
        form.setAttribute('action', oauth2Endpoint);

        let params = {
            "client_id": "960583894295-h50j910bdioqrmlrargqs6hust6in4ap.apps.googleusercontent.com",
            "redirect_uri": "http://localhost/IA_Code/IA_Home/IA_Home.html",
            "response_type": "token",
            "scope": "https://www.googleapis.com/auth/userinfo.profile",
            "include_granted_scope": 'true',
            'state': 'pass-through-value'
        }

        for (var p in params) {
            let input = document.createElement('input');
            input.setAttribute('type', 'hidden');
            input.setAttribute('name', p);
            input.setAttribute('value', params[p]);
            form.appendChild(input);
        }

        document.body.appendChild(form);
        form.submit();
    } catch (error) {
        console.error(error);
    }
}

function signincheck() {
    try {
        if (window.location.href.includes('#') || localStorage.getItem("authInfo") != null) {
            let access_token = '';
            if (localStorage.getItem("authInfo") == null) {
                let params = {}
                let regex = /([^&=]+)=([^&]*)/g, m

                while (m = regex.exec(location.href)) {
                    params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
                }
                window.history.pushState({}, document.title, "/" + "IA_Code/IA_Home/IA_Home.html");

                let info = JSON.parse(JSON.stringify(params));
                access_token = info['access_token'];
                localStorage.setItem("authInfo", info['access_token']);
            } else {
                access_token = localStorage.getItem("authInfo");
            }
            fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
                headers: {
                    "Authorization": `Bearer ${access_token}`
                }
            })
                .then((data) => data.json())
                .then((info) => {
                    document.getElementById('not-log').style.display = 'none';
                    document.getElementById('login-img').style.display = 'block';
                    document.getElementById('login-img').setAttribute('src', info.picture);
                })
        }
    } catch (error) {
        console.error('e', error);
    }
}

function signout() {
    try {
        let access_token = localStorage.getItem('authInfo');
        fetch("https://oauth2.googleapis.com/revoke?token=" + access_token, {
            method: 'POST',
            headers: {
                'Content-type': 'application/x-www-form-urlencoded'
            }
        })
            .then(() => {
                localStorage.removeItem('authInfo');
                document.getElementById('not-log').style.display = 'block';
                document.getElementById('login-img').style.display = 'none';
            })
    } catch (error) {
        console.error(error);
    }
}