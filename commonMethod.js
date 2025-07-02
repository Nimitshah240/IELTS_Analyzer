let enProperties;
let apiURL;
var dynamicUrl;

async function getEnglishJsonFile(jsonFileLocation) {
    try {
        const res = await fetch(jsonFileLocation);
        const data = await res.json();
        enProperties = data;
    } catch (error) {
        console.error(error);
    }
}

async function getFilePaths(params) {
    try {
        await getEnglishJsonFile("../en_properties.json")
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
        }
        throw new Error("Server Error");

    } catch (error) {
        console.log(error);

        throw new Error("Server Error");
    }

}