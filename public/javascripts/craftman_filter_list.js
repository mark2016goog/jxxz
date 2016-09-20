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

    disDiv.addEventListener("click", function () {
        setSelectHeader(0);
    });

    cmtDiv.addEventListener("click", function () {
        setSelectHeader(1);
    });

    orderAmountDiv.addEventListener("click", function () {
        setSelectHeader(2);
    });

});