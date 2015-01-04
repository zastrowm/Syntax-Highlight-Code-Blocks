/**
 * This function should only be invoked in the page where the context menu/browser button
 * was invoked and not in the background.js page
 */
function highlightInCodeBlocks() {
  var codes = document.querySelectorAll('pre code');
  
  for (var i = 0; i < codes.length; ++i) {
    var code = codes[i];
    var pre = code.parentElement;

    hightlightCodeBlock(code, pre);
  }
}

/**
 * Highlight the given codeElement and the (optional) associated preElement
 * that contains it.
 */
function hightlightCodeBlock(codeElement, preElement) {
  
  // ignore elements that have already been printed
  if (preElement != null && preElement.classList.contains("prettyprint")) {
    return;
  }
  
  var hasOnlyBRs = true;

  for (var i = 0; i < codeElement.children.length; i++) {
    var child = codeElement.children[i];
    if (child.tagName != "BR") {
      hasOnlyBRs = false;
      break;
    }
  }

  // somebody put <br/>s in our code block, so remove them
  if (hasOnlyBRs) {
    console.log("removing BRs");
    while (codeElement.lastElementChild != null) {
      codeElement.removeChild(codeElement.lastElementChild);
    }

    console.log(codeElement);
  }

  hljs.highlightBlock(codeElement);
}

console.log("Highlighted Blocks");
highlightInCodeBlocks();

// Used so that we don't load the scripts multiple times
var isLoaded = true;