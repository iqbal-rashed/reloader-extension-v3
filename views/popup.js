// document select
const checkbox = document.getElementById("checkbox");
const formSection = document.getElementById("form-section");
const ipInput = document.getElementById("ipInput");
const saveBtn = document.getElementById("saveBtn");

let globalHostIp;

// Update Popup
function updatePopup() {
    chrome.storage.local.get(["hostIp"], function (result) {
        // type
        setType(result.hostIp);

        // ipAddress
        setIpAddress(result.hostIp);

        // set button color
        setSaveBtn(result.hostIp);

        // set global value
        globalHostIp = result.hostIp;
    });
}

// checkbox event
checkbox.addEventListener("click", (event) => {
    checkChecbox(event.target);
    sendCheckboxData(event.target);
});

// checkbox function
function checkChecbox(bool) {
    if (bool.checked) {
        formSection.style.display = "flex";
    } else {
        formSection.style.display = "none";
    }
}

// set type function
function setType(type) {
    if (type === "localhost") {
        checkbox.checked = false;
    } else {
        checkbox.checked = true;
    }
    checkChecbox(checkbox);
}

// domcontentloaded event
document.addEventListener("DOMContentLoaded", updatePopup);

// set ip address to input
function setIpAddress(ipAddress) {
    if (ipAddress !== "localhost") {
        ipInput.value = ipAddress;
    }
}

// set save btn
function setSaveBtn(result) {
    if (result === "localhost") {
        saveBtn.style.backgroundColor = "#27ae60";
        saveBtn.innerHTML = "Save";
    } else {
        saveBtn.style.backgroundColor = "#919EAB";
        saveBtn.innerHTML = "Saved";
    }
}

// save btn event
saveBtn.addEventListener("click", function (e) {
    const ipAddress = ipInput.value;
    if (!ipAddress) {
        ipInput.style.borderColor = "red";
        return;
    }
    handleSaveBtn(ipAddress);
});

// handle save btn
function handleSaveBtn(ipAddress) {
    chrome.storage.local.get("hostIp", function (result) {
        if (result.hostIp === "localhost") {
            chrome.storage.local.set({ hostIp: ipAddress });
            sendHostIp(ipAddress);
            updatePopup();
        } else if (result.hostIp !== ipAddress) {
            chrome.storage.local.set({ hostIp: ipAddress });
            sendHostIp(ipAddress);
            updatePopup();
        }
    });
}

// checkbox data
function sendCheckboxData(type) {
    if (!type.checked) {
        chrome.storage.local.get("hostIp", function (result) {
            if (result.hostIp !== "localhost") {
                chrome.storage.local.set({ hostIp: "localhost" });
                sendHostIp("localhost");
                updatePopup();
            }
        });
    }
}

// change event input
ipInput.addEventListener("input", function (e) {
    if (ipInput.value !== globalHostIp) {
        saveBtn.style.backgroundColor = "#27ae60";
        saveBtn.innerHTML = "Save";
    } else {
        saveBtn.style.backgroundColor = "#919EAB";
        saveBtn.innerHTML = "Saved";
    }
});

function sendHostIp(ipAddress) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(
            tabs[0].id,
            { hostIp: ipAddress },
            function (response) {}
        );
    });
}
