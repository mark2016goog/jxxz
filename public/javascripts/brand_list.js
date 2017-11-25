var app = app || {};

document.addEventListener("DOMContentLoaded", function () {
  var innerContainer = document.getElementById("inner-container");
  innerContainer.addEventListener("click", function(e) {
    console.log("List item clicked:",e.target);
  });
  
  app.ItemList = function (data) {
    var list = [];
    var map = {};
    var html;
  
    html = data.map(function (item) {
      var i = item.lastIndexOf(' ');
      var en = item.slice(0, i);
      var cn = item.slice(i + 1);
      var ch = en[0];
      if (map[ch]) {
        return '<li>' + en + '<br>' + cn + '</li>'
      } else {
        map[ch] = true
        return '<li data-ch="' + ch + '">' + en + '<br>' + cn + '</li>'
      }
    }).join('')
  
    var elItemList = document.querySelector('#item-container ul')
    elItemList.innerHTML = html;
  
    return {
      gotoChar: function (ch) {
        if (ch === '*') {
          elItemList.scrollTop = 0
        } else if (ch === '#') {
          elItemList.scrollTop = elItemList.scrollHeight
        } else {
          var target = elItemList.querySelector('[data-ch="' + ch + '"]')
          if (target) {
            target.scrollIntoView()
          }
        }
      }
    }
  }
  
  app.main = function () {
    var itemList = app.ItemList(app.data)
    new IndexSidebar().on('charChange', itemList.gotoChar)
  }
  
  app.main();
});
