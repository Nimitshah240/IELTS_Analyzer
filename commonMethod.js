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

async function getFilePaths(params, jsonFileLocation) {
    try {
        await getEnglishJsonFile(jsonFileLocation)
        let url = enProperties.dynamicURL + enProperties.dynamicURLEndPoints[params];
        return url;
    } catch (error) {
        console.error(error.message);
    }

}

async function setAnchorHref(params, jsonFileLocation) {
    try {
        var element = document.getElementsByName(params);
        element.forEach(async ele => {
            ele.href = await getFilePaths(params, jsonFileLocation);
        });
    } catch (error) {
        console.error(error);
    }
}

async function setIframeSrc(params, jsonFileLocation) {
    try {
        var element = document.getElementsByName(params);
        element.forEach(async ele => {
            ele.src = await getFilePaths(params, jsonFileLocation);
        });
    } catch (error) {
        console.error(error);
    }
}