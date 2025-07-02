
// Object containing details for different types of toasts
const toastDetails = {
    timer:2500,
    success: {
        icon: 'fa fa-check-circle',
    },
    error: {
        icon: 'fa fa-times-circle',
    },
    warning: {
        icon: 'fa fa-exclamation-circle',
    },
    info: {
        icon: 'fa fa-info-circle',
    }
}

const autoremoveToast = (toast) => {
    toast.classList.add("hide");
    if (toast.timeoutId) clearTimeout(toast.timeoutId); // Clearing the timeout for the toast
    setTimeout(() => toast.remove(), 500); // Removing the toast after 500ms
}

const removeToast = (toast) => {
    toast.classList.add("hide");
    if (toast.timeoutId) clearTimeout(toast.timeoutId); // Clearing the timeout for the toast
    setTimeout(() => toast.remove(), 500); // Removing the toast after 500ms
}

const createToast = (id, message) => {
    try {

        const notifications = document.getElementById("notifications");

        const { icon } = toastDetails[id];
        const toast = document.createElement("li");
        toast.className = `toast ${id}`;
        toast.innerHTML = `<div class="column">
                             <i class="${icon}"></i>
                             <span>${message}</span>
                          </div>
                          <i class="fa fa-times" onclick="removeToast(this.parentElement)"></i>`;

        notifications.appendChild(toast);
        toast.timeoutId = setTimeout(() => autoremoveToast(toast), toastDetails.timer);
    } catch (error) {
        console.error(error);

    }
}