var ajaxGet = function(url, successCallback, errorCallback) {
    var maxNumTries = 10;
    var tryNum = 0;
    var xhr = new XMLHttpRequest();
    var retry = function() {
        xhr.open("GET", url);
        xhr.send();
        tryNum++;
        if (tryNum == maxNumTries) {
            console.log("request aborted due to max tries");
            xhr.abort();
        }
    };
    xhr.open("GET", url);
    xhr.onload = function() {
        var response = xhr.responseText;
        if (xhr.status == 200) {
            console.log("request success");
            successCallback(response);
        } else if (xhr.status == 500) {
            console.log("retrying request due to 500 error");
            retry();
        } else {
            errorCallback(response);
        }
    };
    xhr.timeout = 3000;
    xhr.ontimeout = function() {
        console.log("retrying request due to timeout");
        retry();
    };
    xhr.onerror = function() {
        errorCallback(xhr.responseText);
    };
    xhr.send();
};