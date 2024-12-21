const platforms = [
  { name: "LeetCode", url: "https://leetcode.com/problemset/", icon: "../icons/leetcode.svg" },
  { name: "CodingNinjas", url: "https://www.naukri.com/code360/problem-of-the-day", icon: "../icons/codingninjas.svg" },
  { name: "GeeksforGeeks", url: "https://www.geeksforgeeks.org/problem-of-the-day", icon: "../icons/geeksforgeeks.svg" },
];

let theme = 'light';

const parentContainer = document.getElementsByClassName('container');
const problemsDiv = document.getElementById('problems');
const openAllButton = document.getElementById('openAllButton');

const themeContainer = document.getElementById('theme');
const themeIcon = document.createElement('img');
themeIcon.src = '../icons/device-theme.svg';
themeContainer.append(themeIcon);

platforms.forEach(platform => {
  const linkContainer = document.createElement('div');
  linkContainer.classList.add('link-container');

  const link = document.createElement('a');
  link.classList.add('btn-link');
  link.href = platform.url;
  link.target = '_blank';
  const icon = document.createElement('img');
  icon.src = platform.icon;
  icon.classList.add('link-icon');
  link.classList.add('link');
  const buttonText = document.createElement('span');
  buttonText.textContent = platform?.name;
  link.appendChild(icon);
  link.appendChild(buttonText);
  linkContainer.appendChild(link);
  problemsDiv.appendChild(linkContainer);
});

themeIcon.addEventListener('click', () => {
  if (theme === 'light') {
    parentContainer?.[0]?.classList?.add('dark');
    theme = 'dark';
  } else {
    parentContainer?.[0]?.classList?.remove('dark');
    theme = 'light';
  }
});

openAllButton.addEventListener('click', () => {
  platforms.forEach(platform => {
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
