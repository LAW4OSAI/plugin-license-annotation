console.log("license-annotation-extension started");

let selectionType = "";
let selectionId = 0;
let maxId = 0;

function analyseLicense(element) {
    return "";
}

function getIdFromName(name){
    return name.substring(name.lastIndexOf("-")+1 , name.length)
}

let applyMask = function(e) {
        e.target.classList.add(selectionType + "-picker-highlight");
        e.target.setAttribute("law4osai", selectionType);
        e.target.setAttribute("law4osai-id", selectionId);
        if (selectionType == "license") {
            e.target.setAttribute("law4osai-license", analyseLicense(e.target));
        }
}

function clearMasks(e) {
    e.target.classList.remove(selectionType + "-picker-highlight");
    e.target.removeAttribute("law4osai");
    e.target.removeAttribute("law4osai-id");

    if(selectionType == "license"){
        e.target.removeAttribute("law4osai-license")
    }
}

function finishLicenseSelection(e) {
    console.log("finishLicenseSelection");

    e.preventDefault();
    e.stopPropagation();

    if(e.target.id == "license-picker-btn") {
        return;
    }
    else{
        window.removeEventListener('mouseout', clearMasks);
        window.removeEventListener('mouseover', applyMask);
        window.removeEventListener('click', finishLicenseSelection);
    }
}

function finishContentSelection(e, mId) {
    console.log("finishContentSelection");

    e.preventDefault();
    e.stopPropagation();

    if(e.target.id == "content-picker-btn") {
        return;
    }
    else{
        window.removeEventListener('mouseout', clearMasks);
        window.removeEventListener('mouseover', applyMask);
        window.removeEventListener('click', finishContentSelection);
    }
}

let startLicenseSelection = function (e) {
    console.log("start license selection");
    selectionId = getIdFromName(e.target.getAttribute("id"))

    document.documentElement.style.cursor = 'pointer';

    selectionType = "license";

    window.addEventListener('mouseover', applyMask);
    window.addEventListener('mouseout', clearMasks);
    e.preventDefault();
    e.stopPropagation();
    window.addEventListener('click', finishLicenseSelection)
}

let startContentSelection = function (e) {
    console.log("start content selection");
    selectionId = getIdFromName(e.target.getAttribute("id"))

    document.documentElement.style.cursor = 'pointer';

    selectionType = "content";

    window.addEventListener('mouseover', applyMask);
    window.addEventListener('mouseout', clearMasks);
    e.preventDefault();
    e.stopPropagation();
    window.addEventListener('click', finishContentSelection)
}

let allContent = function (e) {
    document.body.classList.add("border-all");
}

let saveCurrent = function () {
    console.log("save");

    chrome.runtime.sendMessage({msgType: "tabId"}, function(response) {
        var _tabId = response.tabId;
    });
}

let addRow = function () {
    let e = document.getElementById("annotation-list");
    e.innerHTML = e.innerHTML + ("<div class=\"annotation-unit\">\n" + "<div class='picker-number'>" + maxId + "</div>" +
        "            <div class=\"license-picker\">\n" +
        "                License: <button id=\"license-picker-btn-" + maxId + "\">Pick</button> <button class=\"none-btn\">None</button>\n" +
        "\n" +
        /*"                select name=\"license-type-" + maxId + "\" class=\"license-type\">\n" +
        "                    <option value=\"individual\">Individual</option>\n" +
        "                    <option value=\"cc-by\">CC-BY</option>\n" +
        "                    <option value=\"cc-by-sa\">CC-BY-SA</option>\n" +
        "                    <option value=\"cc-by-nc\">CC-BY-NC</option>\n" +
        "                </select>\n" +*/
        "            </div>\n" +
        "            <div class=\"content-picker\" id=\"content-picker-" + maxId + "\">\n" +
        "                Content: <button id=\"content-picker-btn-" + maxId + "\">Pick</button> <button id=\"content-all-btn-" + maxId + "\">All</button>\n" +
        "            </div>\n" +
        "        </div>");

    document.getElementById('license-picker-btn-' + maxId).onclick =  startLicenseSelection;
    document.getElementById('content-picker-btn-' + maxId).onclick = startContentSelection;
    document.getElementById('content-all-btn-' + maxId).onclick = allContent;

    maxId = maxId + 1;
}

fetch(chrome.runtime.getURL('/annotation-bar.html')).then(r => r.text()).then(html => {
    document.body.insertAdjacentHTML('beforeend', html);
    document.getElementById("save-btn").onclick = saveCurrent;
    document.getElementById("add-btn").onclick = addRow;
});