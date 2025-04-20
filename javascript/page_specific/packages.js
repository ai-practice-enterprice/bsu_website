async function getPackageIntakeData(dataContainer,mode="calendar"){
    const response = await fetch("http://localhost:8000/frontend/package/all?group_by=day", {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });

    const data = await response.json();
    // data = data.map((record) => {
    //     return {
    //         coordinates: obj._source.coordinates,
    //         name: obj.name,
    //         population: obj.population
    //     }
    // });
    // this is because i want to format the data later on
    data.forEach(record => {
        record.date = new Date(record.date);
    });

    dataContainer.innerHTML = "";
    let chart = document.createElement("p");
    chart.innerText = `no chart available for ${mode}`;
    switch (mode) {
        case "calendar":
            chart = Plot.plot({
                padding: 0,
                x: {axis: null},
                y: {tickFormat: Plot.formatWeekday("en", "narrow"), tickSize: 0},
                fy: {tickFormat: "", reverse: true},
                color: {
                    scheme: "RdBu", 
                    legend: true, 
                    label: "Daily change of package intake",
                    tickFormat: "+%", 
                    domain: [-0.06,0.06],
                    type: "linear",
                },
                marks: [
                  Plot.cell(data, {
                    x: (d) => d3.utcWeek.count(d3.utcYear(d.date), d.date),
                    y: (d) => d.date.getUTCDay(),
                    fy: (d) => d.date.getUTCFullYear(),
                    fill: (d, i) => i > 0 ? ((d.count - data[i - 1].count) / data[i - 1].count) : NaN,
                    title: (d, i) => i > 0 ? ("Number of packages: " + d.count + "\nChange " + (d.count - data[i - 1].count) / data[i - 1].count + "\nDate: " + d.date) : NaN,
                    inset: 0.5
                  })
                ]
            });
            
            break;
        case "line chart":
            chart = Plot.plot({
                y: {grid: true, label: "Daily Package intake"},
                marks: [
                  Plot.ruleY([0]),
                  Plot.lineY(data, {x: "date", y: "count", stroke: "steelblue"})
                ]
            })
        
            break;
        default:
            break;
    }



    dataContainer.append(chart);
}

async function getPackageStorageDate(dataContainer,mode="calendar"){
    const response = await fetch("http://localhost:8000/frontend/package/packagemovement/storage", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }
    });

    data = await response.json();

    dataContainer.innerHTML = "";
    let chart = document.createElement("p");
    chart.innerText = `noy yet available ${mode}`;

    // Here comes the plots

    dataContainer.append(chart);
}

tabNav = document.getElementById("tabs-nav");
tabNav.addEventListener("click",async (e) => {
    if(!e.target.classList.contains("tab")){
        return;
    }

    if(e.target.classList.contains("active")){
        return;
    }

    resetTabs("tabNav");

    e.target.classList = "tab active";
    
    dataContainer = document.getElementById("data-holder");
    tabNav = document.getElementById("tabs-nav");

    switch (e.target.getAttribute("data-tab-id")) {
        case "tab-1": 
            getPackageIntakeData(dataContainer); 
            break;
        case "tab-2": 
            getPackageStorageDate(dataContainer); 
            break;
        default:
            break;
    }
});

tabChartNav = document.getElementById("tabs-chart-nav");
tabChartNav.addEventListener("click",async (e) => {
    if(!e.target.classList.contains("tab")){
        return;
    }

    if(e.target.classList.contains("active")){
        return;
    }

    resetTabs("tabChartNav");

    e.target.classList = "tab active";
    
    dataContainer = document.getElementById("data-holder");
    tabChartNav = document.getElementById("tabs-nav");
    tabOpen = document.getElementById("tabs-nav").querySelector(".tab.active").getAttribute("data-tab-id");

    mode = e.target.getAttribute("data-mode");
    switch (tabOpen) {
        case "tab-1": 
            getPackageIntakeData(dataContainer,mode); 
            break;
        case "tab-2": 
            getPackageStorageDate(dataContainer,mode); 
            break;
        default:
            break;
    }
});

function resetTabs(tabsToReset) {
    if(tabsToReset == "tabChartNav"){
        tabChartNav = document.getElementById("tabs-chart-nav");
        tabChartNav.querySelectorAll(".tab").forEach((element) => {
            element.classList = "tab";
        });
        return;
    }

    if(tabsToReset == "tabNav"){
        tabNav = document.getElementById("tabs-nav");
        tabNav.querySelectorAll(".tab").forEach((element) => {
            element.classList = "tab";
        });
        return;
    }

}

window.onload = () => {
    dataContainer = document.getElementById("data-holder");
    getPackageIntakeData(dataContainer,"line chart"); 
}