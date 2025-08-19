let enProperties;
let apiURL;
var dynamicUrl;
var notificationList;

async function getEnglishJsonFile(jsonFileLocation) {
    try {
        const res = await fetch(jsonFileLocation);
        const data = await res.json();
        enProperties = data;
    } catch (error) {
        console.error(error);
    }
}

async function getPopup(params) {
    try {
        await getEnglishJsonFile("../CommonUtils/en_properties.json")
        let url = enProperties.dynamicURL + enProperties.popups[params];
        return url;
    } catch (error) {
        console.error(error.message);
    }
}

async function getFilePaths(params) {
    try {
        await getEnglishJsonFile("../CommonUtils/en_properties.json")
        let url = enProperties.dynamicURL + enProperties.dynamicURLEndPoints[params];
        return url;
    } catch (error) {
        console.error(error.message);
    }
}

async function setAnchorHref(params) {
    try {
        var element = document.getElementsByName(params);
        element.forEach(async ele => {
            ele.href = await getFilePaths(params);
        });
    } catch (error) {
        console.error(error);
    }
}

async function setIframeSrc(params) {
    try {
        var element = document.getElementsByName(params);
        element.forEach(async ele => {
            ele.src = await getFilePaths(params);
        });
    } catch (error) {
        console.error(error);
    }
}

async function apiCallOuts(apiURL, method, body, preftimeout) {
    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), preftimeout);
        let header =
        {
            method: `${method}`,
            headers: { 'Content-Type': 'application/json' },
            signal: controller.signal
        }
        if (method != 'GET' && (body != undefined || body != null)) {
            header.body = body
        }
        let response = await fetch(`${apiURL}`, header)

        if (response.status == 200) {
            let data = await response.json();
            return data;
        } else if (response.status == 204) {
            return null;
        }
        throw new Error("Server Error");
    } catch (error) {
        console.log(error);
        throw new Error("Server Error");
    }

}
function showSpinner(message) {
    try {
        document.getElementById("spinner").style.display = 'flex';
        document.getElementById("main").style.display = 'none';
    } catch (error) {

    }
}

function stopSpinner() {
    try {
        document.getElementById("spinner").style.display = 'none';
        document.getElementById("main").style.display = 'block';
    } catch (error) {

    }
}

// Developer - Nimit Shah
// Developed on - 21/12/2024
// Description - Use to set spinner
// Updated on - -
// Input - none
window.addEventListener("beforeunload", function (event) {
    showSpinner("Loading ...");
    let popupFrame = document.getElementById('popupFrame');
    if (popupFrame != null) {
        popupFrame.style.display = "none";
    }
});

// Developer - Nimit Shah
// Developed on - 21/12/2024
// Description - Use to remove spinner
// Updated on - -
// Input - none
document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "hidden") {
        stopSpinner();
    }
});