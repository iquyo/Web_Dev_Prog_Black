const request = new XMLHttpRequest();

request.open('GET', '/artists')
request.onload = function() {
    var data = request.responseText;
    console.log(data)
};

request.send();