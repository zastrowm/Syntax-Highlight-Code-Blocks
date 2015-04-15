function isSiteMatched(hostname, path) {
  return location.hostname == hostname
         && location.pathname.startsWith(path)
}

/**
 * This function should only be invoked in the page where the context menu/browser button
 * was invoked and not in the background.js page
 */
function highlightInCodeBlocks() {
  
  fixSimpleMsdnDocumentation();
  
  var codes = document.querySelectorAll('pre code');
  
  for (var i = 0; i < codes.length; ++i) {
    var code = codes[i];
    var pre = code.parentElement;

    hightlightCodeBlock(code, pre);
  }
}

/**
 *  Fix code snippets on msdn.microsoft.com that only contain PRE and no CODE tags 
 */
function fixSimpleMsdnDocumentation() {
  
  // sometimes, documentation is only contained in a simple PRE block with no code
  // element.  If that's the case, put the content into a PRE CODE so that later on
  // the hightlight will work
  if (isSiteMatched("msdn.microsoft.com", "/en-us/library/")) {
    var pres = document.querySelectorAll('.codeSnippetContainerCodeContainer pre');
  
    for (var i = 0; i < pres.length; ++i) {
      var pre = pres[i];
      if (pre.children.length == []) {
        // move any html in the pre into the code
        var code = document.createElement("CODE");
        code.innerHTML = pre.innerHTML;
        pre.innerHTML = "";
        pre.appendChild(code);
        
        hightlightCodeBlock(code, pre);
      }
    }
  }
  
}

/**
 * Highlight the given codeElement and the (optional) associated preElement
 * that contains it.
 */
function hightlightCodeBlock(codeElement, preElement) {
  
  // ignore elements that have already been printed
  if (preElement != null && preElement.classList.contains("hljs")) {
    return;
  }
  
  // ignore elements that have already been printed
  if (codeElement != null && codeElement.classList.contains("hljs")) {
    return;
  }
  
  fixMsdnMagazine(codeElement, preElement);
  
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

function fixMsdnMagazine(codeElement, preElement) {
  // I don't understand why MSDN puts code blocks in pre > code.xml blocks
  // (and not in fixed-width at that), but if so, let hljs figure out how
  // to format it instead
  if (isSiteMatched("msdn.microsoft.com", "/en-us/magazine/")
      && codeElement != null
      && codeElement.className == "xml") {
    
    console.log("Fixing MSDN");
    codeElement.className = "";
    
    if (preElement != null) {
      preElement.style.fontFamily = "Consolas, monaco, monospace"
    }
  }
}

console.log("Highlighted Blocks");
highlightInCodeBlocks();

// Used so that we don't load the scripts multiple times
var isLoaded = true;