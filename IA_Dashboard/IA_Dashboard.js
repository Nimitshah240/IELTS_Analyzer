function connectedCallback() {
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