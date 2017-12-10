var app = app || {};

document.addEventListener("DOMContentLoaded", function () {
  var innerContainer = document.getElementById("inner-container");
  innerContainer.addEventListener("click", function (e) {
    var clickedDom = e.target;
    console.log(clickedDom.getAttribute("id"));
    var selectedId = clickedDom.getAttribute("id");
    var selectParam = {
      id: selectedId
    };
    ajax.get("/selectBrand", selectParam, function (response) {
      var selectResult = JSON.parse(response);
      if (selectResult.result === 1) {
        window.location.href = "/preloadPosition";
      } else if (selectResult.result === -1) {
        window.location.href = "/?callbackURL=" + window.location.href;
      }
      else {
        alert("选择失败，请重新选择！");
      }
    });
  });

  app.ItemList = function (data) {
    var list = [];
    var map = {};
    var html;

    var brandId = 0;
    html = data.map(function (item) {
      brandId++;
      var i = item.indexOf(' ');
      var en = item.slice(0, i);
      var cn = item.slice(i + 1);
      var cnDiv = "<div class='brand-text-div'>" + cn + "</div>";
      var ch = en[0];
      var brandImg = "<div class='img-div'><img src='images/brands/" + cn + ".png' /></div>";
      if (map[ch]) {
        return '<li id="' + brandId + '">' + brandImg + cnDiv + '</li>'
      } else {
        map[ch] = true
        return '<li data-ch="' + ch + '" id="' + brandId + '">' + brandImg + cnDiv + '</li>'
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
