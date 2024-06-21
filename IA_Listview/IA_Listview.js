function setHref(event) {
    try {
        const urlSearchParams = new URLSearchParams(window.location.search);
        const type = urlSearchParams.get('type');

        var dynamicUrl;

        dynamicUrl = '../IA_DataEntry/IA_DataEntry.html?type=' + type;

        event.target.href = dynamicUrl;
        window.location.href = dynamicUrl;
    } catch (error) {
        console.log(error);
    }

}