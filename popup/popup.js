const platforms = [
  {
    name: "LeetCode",
    url: "https://leetcode.com/problemset/",
    icon: "../icons/leetcode.svg",
  },
  {
    name: "CodingNinjas",
    url: "https://www.naukri.com/code360/problem-of-the-day",
    icon: "../icons/codingninjas.svg",
  },
  {
    name: "GeeksforGeeks",
    url: "https://www.geeksforgeeks.org/problem-of-the-day",
    icon: "../icons/geeksforgeeks.svg",
  },
];

const parentContainer = document.querySelector(".container");
const problemsDiv = document.getElementById("problems");
const openAllButton = document.getElementById("openAllButton");

platforms.forEach((platform) => {
  const linkContainer = document.createElement("div");
  linkContainer.classList.add("link-container");

  const link = document.createElement("a");
  link.classList.add("btn-link");
  link.href = platform.url;
  link.target = "_blank";
  const icon = document.createElement("img");
  icon.src = platform.icon;
  icon.classList.add("link-icon");
  link.classList.add("link");
  const buttonText = document.createElement("span");
  buttonText.textContent = platform.name;
  link.appendChild(icon);
  link.appendChild(buttonText);
  linkContainer.appendChild(link);
  problemsDiv.appendChild(linkContainer);
});

openAllButton.addEventListener("click", () => {
  platforms.forEach((platform) => {
    chrome.tabs.create({ url: platform.url });
  });
});

const reminderTimeInput = document.getElementById("reminder-time");
const setReminderBtn = document.getElementById("set-reminder-btn");
const reminderStatus = document.getElementById("reminder-status");

// Load previously set reminder time
chrome.storage.sync.get("reminderTime", (data) => {
  if (data.reminderTime) {
    reminderTimeInput.value = data.reminderTime;
    reminderStatus.textContent = `Reminder is set for ${data.reminderTime}`;
  }
});

setReminderBtn.addEventListener("click", () => {
  const reminderTime = reminderTimeInput.value;
  if (!reminderTime) {
    reminderStatus.textContent = "Please select a valid time!";
    return;
  }

  // Save the reminder time
  chrome.storage.sync.set({ reminderTime }, () => {
    reminderStatus.textContent = `Reminder is set for ${reminderTime}`;
  });

  // Notify background script to set the alarm
  chrome.runtime.sendMessage({ type: "setAlarm", reminderTime }, (response) => {
    if (response.success) {
      reminderStatus.textContent = `Reminder is set for ${reminderTime}`;
    } else {
      reminderStatus.textContent = "Failed to set reminder.";
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const focusMode = document.getElementById("focus-mode-button");

  focusMode.addEventListener("click", () => {
    chrome.tabs.create({
      url: chrome.runtime.getURL("popup/focus/focus.html"),
    });
  });
});
