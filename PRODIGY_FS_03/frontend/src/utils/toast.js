// Simple toast notification utility
let toastCallback = null;

export const setToastCallback = (callback) => {
    toastCallback = callback;
};

export const toast = {
    success: (message) => {
        if (toastCallback) {
            toastCallback({ message, type: 'success' });
        } else {
            alert(message); // Fallback
        }
    },
    error: (message) => {
        if (toastCallback) {
            toastCallback({ message, type: 'error' });
        } else {
            alert(message); // Fallback
        }
    },
    info: (message) => {
        if (toastCallback) {
            toastCallback({ message, type: 'info' });
        } else {
            alert(message); // Fallback
        }
    }
};
