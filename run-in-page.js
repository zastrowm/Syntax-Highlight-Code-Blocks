function isSiteMatched(hostname, path) {
  return location.hostname == hostname
         && location.pathname.startsWith(path)
}

function highlightAll() {
  highlightInCodeBlocks();
  highlightMultilinePres();
}

/**
 * Highlight code in a multi-line <pre>s
 * @note should not be done automatically
 **/
function highlightMultilinePres() {
  var pres = document.querySelectorAll('pre');
  
  for (var i = 0; i < pres.length; ++i) {
    var pre = pres[i];

    // only all text pres are desired to be fixed
    if (pre.children.length > 0)
      continue;
    
    // only multi-line pres
    if (!pre.textContent.includes("\n"))
      continue;
      
    var code = document.createElement("CODE");
    code.innerHTML = pre.innerHTML;
    pre.innerHTML = "";
    pre.appendChild(code);
    
    hightlightCodeBlock(code, pre);
  }
}

/**
 * Highlight code in a pre > code blocks 
 * @note could be done automatically
 **/
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

highlightAll();

// Used so that we don't load the scripts multiple times
var isLoaded = true;