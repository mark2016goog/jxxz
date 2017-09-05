/**
 * Created by xuanhong on 16/9/20.
 */
document.addEventListener("DOMContentLoaded", function () {
    var disDiv = document.getElementById('distanceHeader');
    var cmtDiv = document.getElementById('commentHeader');
    var orderAmountDiv = document.getElementById('orderAmountHeader');

    var headerList = [disDiv, cmtDiv, orderAmountDiv];

    function setSelectHeader(index) {
        for (var i = 0; i < headerList.length; i++) {
            headerList[i].classList.remove("selected");
        }

        if (!headerList[index].classList.contains("selected")) {
            headerList[index].classList.add("selected");
        }

    }

    var craftmanListDom = document.getElementById("craftman_list");
    var queryParam = {};

    disDiv.addEventListener("click", function () {
        setSelectHeader(0);
        queryParam.searchType = 1;

        ajax.get("/searchCraftmanAsync", queryParam, function (response) {
            craftmanListDom.innerHTML = response;
        });
    });

    cmtDiv.addEventListener("click", function () {
        setSelectHeader(1);
        queryParam.searchType = 2;
        ajax.get("/searchCraftmanAsync", queryParam, function (response) {
            craftmanListDom.innerHTML = response;
        });
    });

    orderAmountDiv.addEventListener("click", function () {
        setSelectHeader(2);
        queryParam.searchType = 3;
        ajax.get("/searchCraftmanAsync", queryParam, function (response) {
            craftmanListDom.innerHTML = response;
        });
    });

});

window.craftmanDetail = function (id) {
    window.location.href = "/craftmanBusinessCard" + "?id=" + id;
}