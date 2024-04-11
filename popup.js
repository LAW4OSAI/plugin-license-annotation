document.getElementById("toggle-switch").addEventListener("change", switchFunction);


function switchFunction(e){
    if(e.target.checked == true){
        fetch(chrome.runtime.getURL('/annotation-bar.html')).then(r => r.text()).then(html => {
            document.body.insertAdjacentHTML('beforeend', html);
            document.getElementById('license-picker-btn').onclick = startLicenseSelection;
            document.getElementById('content-picker-btn').onclick = startContentSelection;
            document.getElementById("content-all-btn").onclick = allContent;
        });
    }
    else{
        document.getElementById("annotation-bar").remove();
    }
}