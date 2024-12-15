chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "setAlarm") {
    const { reminderTime } = message;

    // Parse the reminder time
    const [hours, minutes] = reminderTime.split(":").map(Number);
    const now = new Date();
    const reminderDate = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      hours,
      minutes,
      0
    );
    const timeUntilAlarm =
      reminderDate.getTime() > now.getTime()
        ? reminderDate.getTime() - now.getTime()
        : reminderDate.getTime() + 24 * 60 * 60 * 1000 - now.getTime(); // Add 24 hours if the time has passed today
    console.log(timeUntilAlarm / 60000);
    // Clear any previous alarm
    chrome.alarms.clear("dailyReminder");

    // Set up a new daily alarm
    chrome.alarms.create("dailyReminder", {
      delayInMinutes: timeUntilAlarm / 60000, // Convert to minutes
      periodInMinutes: 24 * 60, // Repeat every 24 hours
    });

    sendResponse({ success: true });
  }
});

// Handle alarms
chrome.alarms.onAlarm.addListener((alarm) => {
  console.log(`Alarm triggered: ${alarm.name}`);
  if (alarm.name === "dailyReminder") {
    chrome.notifications.create(
      {
        type: "basic",
        iconUrl: "../icons/leetCode.png",
        title: "Coding Reminder",
        message: "Time to solve today's coding problems!",
      },
      (notificationId) => {
        if (chrome.runtime.lastError) {
          console.error("Notification Error:", chrome.runtime.lastError);
        } else {
          console.log("Notification Created with ID:", notificationId);
        }
      }
    );

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (chrome.scripting) {
          // For Chrome 88 and above, use chrome.scripting.executeScript
          chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            func: showCustomModal,
          });
        } else {
          // For older versions, use chrome.tabs.executeScript
          chrome.tabs.executeScript(tabs[0].id, {
            code: 'alert("Time to solve today\'s coding problems!");',
          });
        }
      });
  }
});

function showCustomModal() {
    // Prevent duplicate modals
    const existingModal = document.getElementById("coding-reminder-modal");
    if (existingModal) return;
  
    // Create the modal container
    const modal = document.createElement("div");
    modal.id = "coding-reminder-modal";
    modal.style.position = "fixed";
    modal.style.top = "50%";
    modal.style.left = "50%";
    modal.style.transform = "translate(-50%, -50%)";
    modal.style.zIndex = "10000";
    modal.style.backgroundColor = "#fff";
    modal.style.boxShadow = "0 4px 8px rgba(0,0,0,0.2)";
    modal.style.padding = "20px";
    modal.style.borderRadius = "10px";
    modal.style.width = "300px";
    modal.style.textAlign = "center";
    modal.style.fontFamily = "Arial, sans-serif";
    modal.style.color = "#333";
  
    // Add content to the modal
    modal.innerHTML = `
      <h2 style="margin-bottom: 10px; font-size: 18px;">Coding Reminder</h2>
      <p style="margin-bottom: 20px;">Time to solve today's coding problems!</p>
      <div>
        <button id="ok-button" style="
          margin-right: 10px;
          padding: 10px 20px;
          background-color: #4CAF50;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        ">OK</button>
        <button id="snooze-button" style="
          padding: 10px 20px;
          background-color: #f44336;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        ">Snooze 30 min</button>
      </div>
    `;
  
    document.body.appendChild(modal);
  
    // Add event listeners to the buttons
    document.getElementById("ok-button").addEventListener("click", () => {
      chrome.runtime.sendMessage({ type: "openPopup" });
      modal.remove(); // Close modal
    });
  
    document.getElementById("snooze-button").addEventListener("click", () => {
      chrome.runtime.sendMessage({ type: "snoozeAlarm", snoozeMinutes: 30 });
      modal.remove(); // Close modal
    });
  }
  
  
  // Handle snooze functionality
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "snoozeAlarm") {
      const { snoozeMinutes } = message;
  
      // Clear existing alarm
      chrome.alarms.clear("dailyReminder");
  
      // Set a new alarm after snooze duration
      chrome.alarms.create("dailyReminder", {
        delayInMinutes: snoozeMinutes,
      });
  
      console.log(`Snoozed for ${snoozeMinutes} minutes`);
      sendResponse({ success: true });
    }
  
    if (message.type === "openPopup") {
      chrome.action.openPopup(() => {
        if (chrome.runtime.lastError) {
          console.error("Failed to open popup:", chrome.runtime.lastError);
        } else {
          console.log("Popup opened successfully");
        }
      });
    }
  });