let isDarkMode = false;
let observer = null;
let darkModeStyle = null;

// Create dark mode styles
function createDarkModeStyle() {
  const style = document.createElement('style');
  style.id = 'dark-mode-style';
  style.textContent = `
    /* Force dark mode on all elements */
    html, body, div, section, article, aside, nav, header, footer, main,
    .container, .content, .wrapper, .main, .header, .footer, .sidebar {
      background-color: #1a1a1a !important;
      color: #e8e8e8 !important;
    }

    /* Override any existing background colors */
    [class*="bg-"], [class*="background"], [style*="background"] {
      background-color: #1a1a1a !important;
    }

    /* Text colors with better contrast */
    body, p, h1, h2, h3, h4, h5, h6, span, div, li, ul, ol {
      color: #e8e8e8 !important;
    }

    /* Links with better visibility */
    a:not(:hover) {
      color: #7cb4ff !important;
    }

    a:hover {
      color: #99ccff !important;
    }

    a:visited {
      color: #c299ff !important;
    }

    /* Input fields with better contrast */
    input, textarea, select, button {
      background-color: #2d2d2d !important;
      color: #e8e8e8 !important;
      border-color: #404040 !important;
    }

    /* Buttons with better visibility */
    button, input[type="button"], input[type="submit"], input[type="reset"],
    .button, .btn, [class*="btn-"] {
      background-color: #2d2d2d !important;
      color: #e8e8e8 !important;
      border-color: #404040 !important;
    }

    button:hover, input[type="button"]:hover, input[type="submit"]:hover, input[type="reset"]:hover,
    .button:hover, .btn:hover, [class*="btn-"]:hover {
      background-color: #383838 !important;
    }

    /* Tables with improved readability */
    table, tr, td, th {
      background-color: #1a1a1a !important;
      color: #e8e8e8 !important;
      border-color: #404040 !important;
    }

    th, td {
      background-color: #242424 !important;
    }

    /* Code blocks */
    pre, code {
      background-color: #2d2d2d !important;
      color: #e8e8e8 !important;
    }

    /* Cards and containers */
    .card, .box, .panel, [class*="card-"], [class*="box-"], [class*="panel-"] {
      background-color: #242424 !important;
      border-color: #404040 !important;
    }

    /* Navigation elements */
    nav, .nav, .navbar, .menu, header, footer {
      background-color: #242424 !important;
      color: #e8e8e8 !important;
    }

    /* Dropdowns and popups */
    .dropdown, .popup, .modal, .tooltip, .menu {
      background-color: #2d2d2d !important;
      color: #e8e8e8 !important;
    }

    /* Lists */
    ul, ol, li, dl, dt, dd {
      background-color: transparent !important;
      color: #e8e8e8 !important;
    }

    /* Form elements */
    form, fieldset, legend {
      background-color: transparent !important;
      color: #e8e8e8 !important;
    }

    /* Preserve original colors for images and videos */
    img, video, canvas, picture, svg {
      filter: none !important;
    }

    /* Preserve original colors for elements with background images */
    [style*="background-image"] {
      background-color: transparent !important;
    }

    /* Override white backgrounds */
    [style*="background-color: rgb(255, 255, 255)"],
    [style*="background-color: #fff"],
    [style*="background-color: #ffffff"],
    [style*="background: rgb(255, 255, 255)"],
    [style*="background: #fff"],
    [style*="background: #ffffff"] {
      background-color: #1a1a1a !important;
    }

    /* Override light backgrounds */
    [style*="background-color: rgb(245, 245, 245)"],
    [style*="background-color: rgb(250, 250, 250)"],
    [style*="background-color: rgb(240, 240, 240)"] {
      background-color: #242424 !important;
    }
  `;
  return style;
}

// Function to handle dynamic content changes
function handleDynamicContent() {
  if (isDarkMode) {
    const style = document.getElementById('dark-mode-style');
    if (!style) {
      document.documentElement.appendChild(darkModeStyle);
    }
  }
}

// Function to start the observer
function startObserver() {
  if (!observer) {
    observer = new MutationObserver(handleDynamicContent);
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'class']
    });
  }
}

// Function to stop the observer
function stopObserver() {
  if (observer) {
    observer.disconnect();
    observer = null;
  }
}

// Function to toggle dark mode
function toggleDarkMode(enable) {
  try {
    if (enable) {
      if (!darkModeStyle) {
        darkModeStyle = createDarkModeStyle();
      }
      document.documentElement.appendChild(darkModeStyle);
      startObserver();
    } else {
      const style = document.getElementById('dark-mode-style');
      if (style) {
        style.remove();
      }
      stopObserver();
    }
    
    isDarkMode = enable;
  } catch (error) {
    console.error('Error toggling dark mode:', error);
  }
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "toggle") {
    toggleDarkMode(request.isDarkMode);
    sendResponse({success: true});
  }
  return true;
});

// Check saved state when page loads
chrome.storage.local.get(['isDarkMode'], function(result) {
  if (result.isDarkMode) {
    toggleDarkMode(true);
  }
});

