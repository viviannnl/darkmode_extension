document.addEventListener('DOMContentLoaded', function() {
  const toggleSwitch = document.getElementById('darkModeToggle');
  const statusText = document.getElementById('status');
  const statusIcon = document.getElementById('statusIcon');

  // Load saved state
  chrome.storage.local.get(['isDarkMode'], function(result) {
    toggleSwitch.checked = result.isDarkMode || false;
    updateUI(result.isDarkMode || false);
  });

  // Handle toggle changes
  toggleSwitch.addEventListener('change', function() {
    const isDarkMode = toggleSwitch.checked;
    
    // Add transition class for smooth animation
    document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    
    // Update storage
    chrome.storage.local.set({isDarkMode: isDarkMode});
    
    // Send message to content script
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: "toggle",
          isDarkMode: isDarkMode
        });
      }
    });

    updateUI(isDarkMode);
  });

  // Update popup UI
  function updateUI(isDarkMode) {
    document.body.classList.toggle('dark', isDarkMode);
    statusText.textContent = `Dark mode is ${isDarkMode ? 'on' : 'off'}`;
    statusIcon.classList.toggle('active', isDarkMode);
    
    // Animate status icon
    if (isDarkMode) {
      statusIcon.style.transform = 'scale(1.2)';
      setTimeout(() => {
        statusIcon.style.transform = 'scale(1)';
      }, 200);
    }
  }

  // Add hover effect to the toggle
  toggleSwitch.addEventListener('mouseover', function() {
    this.style.transform = 'scale(1.05)';
  });

  toggleSwitch.addEventListener('mouseout', function() {
    this.style.transform = 'scale(1)';
  });
});

