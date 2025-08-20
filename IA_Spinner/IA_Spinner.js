window.addEventListener('message', function (event) {
    try {
        console.log("spinner");
        if (event.origin !== domainName) return;
        
        const message = event.data;
        if (message.command == 'openPopup') {
            openAndSetPopup(message);
        } else if (message.command == 'closePopup') {
            const popupData = document.getElementById("popupData");
            popupData.src = '';            
            closePopup(message);
        }
    } catch (error) {
        console.log(error);
    }
});