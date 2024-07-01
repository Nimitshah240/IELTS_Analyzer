function connectedCallback() {
    signincheck();
    google.charts.load('current', { 'packages': ['corechart'] });
    google.charts.load('current', { packages: ['gauge'] });
    google.charts.setOnLoadCallback(drawChart);

    function drawChart() {
        try {

            // 1st Chart ------------------------------------------------------
            var data = google.visualization.arrayToDataTable([
                ['Effort', 'Amount given'],
                ['My all', 90],
                ['My ', 10],
            ]);

            var options = {
                pieHole: 0.5,
                pieSliceTextStyle: {
                    color: 'black',
                },
                slices: {
                    0: { color: 'lightblue' },
                    1: { color: 'blue' }
                },
                legend: { position: 'bottom' }

            };
            var chart = new google.visualization.PieChart(document.getElementById('chart1'));
            chart.draw(data, options);


            // 2nd Chart ------------------------------------------------------

            var data2 = google.visualization.arrayToDataTable([
                ['Label', 'Value'],
                ['Total Exam', 10]
            ]);

            var options2 = {
                width: 500, height: 300,
                redFrom: 0, redTo: 8,
                yellowFrom: 9, yellowTo: 14,
                greenFrom: 15, greenTo: 20,
            };

            try {
                var chart2 = new google.visualization.Gauge(document.getElementById('chart2'));
            } catch (error) {
                console.error(error.message);
            }

            chart2.draw(data2, options2);


            // 3rd Chart ------------------------------------------------------
            var data = google.visualization.arrayToDataTable([
                ['Effort', 'Amount given'],
                ['My all', 90],
                ['My ', 10],
            ]);

            var options = {
                pieHole: 0.5,
                pieSliceTextStyle: {
                    color: 'black',
                },
                slices: {
                    0: { color: 'lightblue' },
                    1: { color: 'blue' }
                },
                legend: { position: 'bottom' }
            };
            var chart = new google.visualization.PieChart(document.getElementById('chart3'));
            chart.draw(data, options);

            // 4th Chart ----------------------------------------------------

            var data = google.visualization.arrayToDataTable([
                ["Element", "Density", { role: "style" }],
                ["Copper", 8.94, "#b87333"],
                ["Silver", 10.49, "silver"],
                ["Gold", 19.30, "gold"],
                ["Platinum", 21.45, "color: #e5e4e2"]
            ]);

            var view = new google.visualization.DataView(data);
            view.setColumns([0, 1,
                {
                    calc: "stringify",
                    sourceColumn: 1,
                    type: "string",
                    role: "annotation"
                },
                2]);

            var options = {
                title: "Density of Precious Metals, in g/cm^3",
                bar: { groupWidth: "75%" },
                legend: { position: "none" },
                bars: 'vertical'
            };
            var chart = new google.visualization.BarChart(document.getElementById("chart4"));
            chart.draw(view, options);

            // 5th Chart ---------------------------------------------- 
            var data = google.visualization.arrayToDataTable([
                ['Year', 'Sales'],
                ['2004', 1000],
                ['2005', 1170],
                ['2006', 660],
                ['2007', 1030]
            ]);

            var options = {
                title: 'Company Performance',
                legend: { position: 'bottom' }
            };

            var chart = new google.visualization.LineChart(document.getElementById('chart5'));

            chart.draw(data, options);


            // 6th Chart --------------------------------------------- 
            var data = google.visualization.arrayToDataTable([
                ["Element", "Density", { role: "style" }],
                ["Copper", 8.94, "#b87333"],
                ["Silver", 10.49, "silver"],
                ["Gold", 19.30, "gold"],
                ["Platinum", 21.45, "color: #e5e4e2"]
            ]);

            var view = new google.visualization.DataView(data);
            view.setColumns([0, 1,
                {
                    calc: "stringify",
                    sourceColumn: 1,
                    type: "string",
                    role: "annotation"
                },
                2]);

            var options = {
                title: "Density of Precious Metals, in g/cm^3",
                bar: { groupWidth: "75%" },
                legend: { position: "none" },
                bars: 'vertical'
            };
            var chart = new google.visualization.BarChart(document.getElementById("chart6"));
            chart.draw(view, options);

            // 7th chart -----------------------------------------------

            var data = google.visualization.arrayToDataTable([
                ['Genre', 'Fantasy & Sci Fi', 'Romance', 'Mystery/Crime', 'General',
                    'Western', 'Literature', { role: 'annotation' }],
                ['2010', 10, 24, 20, 32, 18, 5, ''],
                ['2020', 16, 22, 23, 30, 16, 9, ''],
                ['2030', 28, 19, 29, 30, 12, 13, '']
            ]);

            var options = {
                legend: { position: 'bottom', maxLines: 10 },
                bar: { groupWidth: '75%' },
                isStacked: true
            };

            var chart = new google.visualization.BarChart(document.getElementById("chart7"));
            chart.draw(data, options);

            // 8th Chart -----------------------------------------------


            var data = google.visualization.arrayToDataTable([
                ['Genre', 'Fantasy & Sci Fi', 'Romance', 'Mystery/Crime', 'General',
                    'Western', 'Literature', { role: 'annotation' }],
                ['2010', 10, 24, 20, 32, 18, 5, ''],
                ['2020', 16, 22, 23, 30, 16, 9, ''],
                ['2030', 28, 19, 29, 30, 12, 13, '']
            ]);

            var options = {
                legend: { position: 'bottom', maxLines: 10 },
                bar: { groupWidth: '75%' },
                isStacked: true
            };

            var chart = new google.visualization.BarChart(document.getElementById("chart8"));
            chart.draw(data, options);

            // 9th Chart --------------------------------------------

            var data = google.visualization.arrayToDataTable([
                ['Genre', 'Fantasy & Sci Fi', 'Romance', 'Mystery/Crime', 'General',
                    'Western', 'Literature', { role: 'annotation' }],
                ['2010', 10, 24, 20, 32, 18, 5, ''],
                ['2020', 16, 22, 23, 30, 16, 9, ''],
                ['2030', 28, 19, 29, 30, 12, 13, '']
            ]);

            var options = {
                legend: { position: 'bottom', maxLines: 10 },
                bar: { groupWidth: '75%' },
                isStacked: true,
                bars: 'vertical'
            };

            var chart = new google.visualization.BarChart(document.getElementById("chart9"));
            chart.draw(data, options);

        } catch (error) {
            console.log(error.message);
        }
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
                });
        }
    } catch (error) {
        console.error(error);
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