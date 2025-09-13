let module = "";
let data;
let deleteType;
let jsonBody;
let endPoints;
let params;
let id;

// This is sample delete message coming from the main page
// let sampleMessage = {
//     jsonBody :{},
//     apiEnpoints:[],
//     params:[],
//     module:"IA_Data"
// }
async function deleteConnectedCallback(params) {
    await getEnglishJsonFile("../CommonUtils/en_properties.json");
}

window.addEventListener('message', function (event) {
    try {
        data = event.data.data;
        module = data.module;
        jsonBody = data.jsonBody;
        endPoints = data.endPoints;
        params = data.params;
        id = data.id;
    } catch (error) {
        console.log(error);
    }
});

async function deleteYes(params) {
    try {
        deleteType = true;
        deleteApiCall();
    } catch (error) {
        console.log(error);
    }
}

function deleteNo(params) {
    try {
        deleteType = false;
        returnMessage();
    } catch (error) {

    }
}

async function returnMessage() {
    try {
        await getEnglishJsonFile("../CommonUtils/en_properties.json");
        parent.postMessage(
            { source: "IA_Delete", command: "closePopup", data: { jsonBody: jsonBody, deleteType: deleteType, id: id } },
            enProperties.domainName
        );
    } catch (error) {
        console.log(error);
    }
}

async function deleteApiCall() {
    var del = false;
    // This switch case used, so that if delete have no such logic then it will happen from here 
    // else it will just return to the parent and parent will call delete api.
    switch (module) {
        case "IA_Data":
            del = false;
            break;
        default:
            del = true;
            break;
    }

    if (del) {
        let apiURL = enProperties.apiURL;
        if (endPoints != null) {
            endPoints.forEach(element => {
                apiURL += enProperties.apiEndPoints[element];
            });
        }
        if (params != null) {
            params.forEach((element, index) => {
                if (index == 0) {
                    apiURL += "?";
                } else {
                    apiURL += "&";
                }
                apiURL += element;
            });
        }

        await apiCallOuts(apiURL, 'DELETE', JSON.stringify(jsonBody), 6000).then(responsedata => {
            // Set API path and call api to delete;
            jsonBody = responsedata;
            returnMessage();
        }).catch(() => {
            deleteType = false;
            returnMessage();
        })
    } else {
        returnMessage();
    }
}