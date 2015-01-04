
/**
 * Inject the HighlightJs library into the document, invoking the callback
 * parameter when both have been loaded
 */
function injectHighlightJs(callback) {
  var count = 0;
  var invokeWhenBothAreDone = function() {
    count++;

    if (count == 2) {
      callback();
    }
  }

  chrome.tabs.insertCSS({file: "highlight.min.css"}, invokeWhenBothAreDone);
  chrome.tabs.executeScript({file: "highlight.min.js"}, invokeWhenBothAreDone);
}

/**
 * Main entry point that executes when the user hits the extension button
 * or activates the context menu
 */
function main() {
  injectHighlightJs(function() {
    chrome.tabs.executeScript({file: "run-in-page.js"});
  }); 
}

chrome.contextMenus.create({
  id: "syntax-highlight-code",
  title: "Syntax Highlight Code Blocks",
}, function() {
  if (chrome.runtime.lastError != null) {
      console.error(chrome.runtime.lastError);
  }
});

// we don't really need a browser button for now
// chrome.browserAction.onClicked.addListener(main);

chrome.contextMenus.onClicked.addListener(main);