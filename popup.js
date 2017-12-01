function getCurrentTabUrl(callback) {
  var queryInfo = {
    active: true,
    currentWindow: true }

  chrome.tabs.query(queryInfo, (tabs) => {
    var tab = tabs[0];
    var url = tab.url;
    console.assert(typeof url == 'string', 'tab.url should be a string');
    callback(url);
  })
}

$(document).ready(function(){
  getCurrentTabUrl((url) => {
    $('#app').html(url)
  })
})