/*
@@ MY-SALES-MANAGEMENT.JS
@@ By Zheng
@@ 2020-04-03
*/

var managementTB;
var managementDealTB;
var Glo_Category = "All Equipments";
var Glo_DealType = "Auction";
var Glo_SelectedDeal = 0;
var Glo_SalesCurrency = 'USD';
var DepositHistoryID = [];
var history_index = 0;
var totalProfit = 0;


// Sales Column Data
var columnData = [
    {
        "title": getLocalizationWord("Photo"),
        sortable: false,
        "render": function (data, type, full, meta) {
            if (full.DealID == 0)
                return '';

            if (full.SalesStatus != 'New' && full.DealType != 'Manufacturing' && full.DealType != 'Logistics') {
                $imgUrl = base_url + "assets/images/thumbImages/" + full.PrimaryImage;
                var photoElement = '<div class="photo-cell" style="background-image: url(\'' + $imgUrl + '\')">' +
                    '<img  class="auction-photo" src="' + $imgUrl + '" >' +              
                    '</div>';

                return photoElement;
            }
            return '';
        }
    }, {
        'title' : 'Sale Info',
        sortable : false,
        'render' : function(data, type, full, meta) {
            var DealInfo = '';
            if (full.DealType == 'Manufacturing') {
                var DealType = getBadgetForDealType(full.DealType) + '<br>';
                var EqCategory = getCheckedValue(full.EquipmentCategory);                

                DealInfo = DealType + EqCategory;
            }
            else if (full.DealType == 'Logistics') {
                var DealType = getBadgetForDealType(full.DealType) + '<br>';                                            
                DealInfo = DealType;
            }
            else {
                var Title = getCheckedValue(getTitleFromDatabase(full));
                var DealType = getBadgetForDealType(full.DealType) + '<br>';                

                DealInfo =  DealType + Title;
            } 

            var DateAdded = getLocalizationWord('Start') + ': ' + getSecondRemovedDateTime(full.DateAdded) + '<br>';
            var SalesStatus = getLocalizationWord('Status') + ': ' + getLocalizationWord(full.SalesStatus) + '<br>';
            var DealsStatus = '';
            var LastUpdateDate = '';

            if (full.DealStatus != '')
                DealsStatus = getLocalizationWord('Deal Status') + ': ' + getBadgetForEachStatusOnSale(full.DealStatus) + '<br>';

            if (full.SalesStatus != 'New')
                LastUpdateDate = getLocalizationWord('Last Update') + ': ' + getSecondRemovedDateTime(full.LastUpdateDate) + '<br>';            
            
                
            return DealInfo + DateAdded + SalesStatus + LastUpdateDate + DealsStatus;
        }
    }, {
        "title": getLocalizationWord("Client Info"),
        sortable: false,
        "render": function (data, type, full, meta) {

            return  '<div class="row" style = "width : 250px; white-space:break-spaces; padding-left:8px;">' + 
                        full.Name + ' ' + full.LastName +  '<br>' + 
                        getCheckedValue(getStyledPhoneNumber(full.Phone))+ 
                        getCheckedValue(full.Source) +
                    '</div>';
        }
    }, {
        "title": getLocalizationWord("Price Info"),
        sortable: false,
        "render": function (data, type, full, meta) {
            if (full.DealID == 0)
                return  '';

            var price = "";
            var buyPremium = '';
            var shipping = '';
            var customs = '';
            var comm = '';
            var discount = '';
            var shop = '';
            var extras = '';
            var taxP = '';
            var total = '';
            var buyingAmount = '';
            var subTotal = '';

            if (full.Total != 0) {
                if (full.Price != 0)
                    price = getLocalizationWord('Price') + ': ' + numberWithCommas(full.Price) + ' ' + full.SalesCurrency + '<br>';
                if (full.BuyPremium != 0)
                    buyPremium = getLocalizationWord('Buy P') + ': ' + numberWithCommas(full.BuyPremium) + ' ' + full.SalesCurrency + '<br>';
                if (full.Shipping != 0)
                    shipping = getLocalizationWord('Shipping') + ': ' + numberWithCommas(full.Shipping) + ' ' + full.SalesCurrency + '<br>';
                if (full.Customs != 0)
                    customs = getLocalizationWord('Customs') + ': ' + numberWithCommas(full.Customs) + ' ' + full.SalesCurrency + '<br>';   
                if (full.Comm != 0)
                    comm = getLocalizationWord('Comm') + ': ' + numberWithCommas(full.Comm) + ' ' + full.SalesCurrency + '<br>';
                if (full.Discount != 0)
                    discount = getLocalizationWord('Discount') + ': ' + numberWithCommas(full.Discount) + ' ' + full.SalesCurrency + '<br>';
                if (full.Shop != 0)
                    shop = getLocalizationWord('Shop') + ': ' + numberWithCommas(full.Shop) + ' ' + full.SalesCurrency + '<br>';
                if (full.Extras != 0)
                    extras = getLocalizationWord('Extras') + ': ' + numberWithCommas(full.Extras) + ' ' + full.SalesCurrency + '<br>';
                taxP = getLocalizationWord('IVA') + ': ' + full.TaxP + ' %<br>';
                subTotal = full.Total - full.Shop - full.Extras;
                if (full.Shop != 0 || full.Extras != 0)
                    subTotal = getLocalizationWord('Sub Total') + ': ' + numberWithCommas(Number(subTotal).toFixed(2)) + ' ' + full.SalesCurrency + '<br>'; 
                else   
                    subTotal = '';
                total = getLocalizationWord('Total') + ': ' + numberWithCommas(Number(full.Total).toFixed(2)) + ' ' + full.SalesCurrency + '<br>';
            }      
            
            if (full.BuyingAmount != 0)
                buyingAmount = getLocalizationWord('Buying Amount') + ': ' + numberWithCommas(Number(full.BuyingAmount)) + ' ' + full.SalesCurrency + '<br>';

            return price + buyPremium + shipping + customs + comm + discount + taxP + subTotal + shop + extras + total + buyingAmount;
        } 
    }, {
        "title": getLocalizationWord("Commission"),
        sortable: false,
        "render": function (data, type, full, meta) {

            var SalesUser = full.SalesRep;
            var Buyer = full.BuyingUser;
            var Finder = full.USERNAME;
            var SellerIncentive = full.SellerIncentive;
            var BuyerIncentive = full.BuyerIncentive;
            var FinderIncentive = full.FinderIncentive;

            var userName = $('#usernameInput').val();

            var SellerDetail = '';
            var BuyerDetail = '';
            var FinderDetail = '';

            if (SalesUser == userName) {
                SellerDetail = getLocalizationWord("Sales") + ': ' + SalesUser + '<br>' + 
                    (SellerIncentive == null ? getLocalizationWord('No Comm Calc') : SellerIncentive + ' ' + full.SellerCurrency) + '<br>';
            }

            if (Buyer == userName) {
                BuyerDetail = getLocalizationWord('Buyer') + ': ' + (Buyer == '' ? 'None' : Buyer) + '<br>' + 
                    (BuyerIncentive == null ? getLocalizationWord('No Comm Calc') : BuyerIncentive + ' ' + full.BuyerCurrency) + '<br>';
            }   

            if (Finder == userName) {
                FinderDetail = getLocalizationWord('Finder') + ': ' + Finder + '<br>' + 
                    (FinderIncentive == null ? getLocalizationWord('No Comm Calc') : FinderIncentive + ' ' + full.FinderCurrency) + '<br>';
            }

            var DealType = full.DealType;

            if (DealType == 'Inventory') {
                return SellerDetail;
            }
            else if (DealType == 'Auction') {
                return SellerDetail + BuyerDetail + FinderDetail;
            }
            else if (DealType == 'Supplier') {
                return SellerDetail + BuyerDetail + FinderDetail;
            }
            else if (DealType == 'Consignment') {
                return SellerDetail + FinderDetail;
            }
            else if (DealType == 'Manufacturing') {
                return SellerDetail;
            }
            else if (DealType == 'Logistics') {
                return SellerDetail;
            }            
        }
    }, {
        "title": getLocalizationWord("Deposits"),
        sortable: false,
        "render": function (data, type, full, meta) {

            var SalesUser = full.SalesRep;
            var Buyer = full.BuyingUser;
            var Finder = full.USERNAME;
            var username = $('#usernameInput').val();

            var users = [];
            var UsdDeposit = [];
            var MxnDeposit = [];

            if (users.indexOf(SalesUser) == -1) {
                users.push(SalesUser);
                UsdDeposit.push(full.SellerDepositUSD);
                MxnDeposit.push(full.SellerDepositMXN);
            }

            if (Buyer != '') {
                if (users.indexOf(Buyer) == -1) {
                    users.push(Buyer);
                    UsdDeposit.push(full.BuyerDepositUSD);
                    MxnDeposit.push(full.BuyerDepositMXN);
                }
                else {
                    var index = users.indexOf(Buyer);
                    UsdDeposit[index] = Number(UsdDeposit[index]) + Number(full.BuyerDepositUSD);
                    MxnDeposit[index] = Number(MxnDeposit[index]) + Number(full.BuyerDepositMXN);
                }
            }
            

            if (Finder != '') {
                if (users.indexOf(Finder) == -1) {
                    users.push(Finder);
                    UsdDeposit.push(full.FinderDepositUSD);
                    MxnDeposit.push(full.FinderDepositMXN);
                }
                else {
                    var index = users.indexOf(Finder);
                    UsdDeposit[index] = Number(UsdDeposit[index]) + Number(full.FinderDepositUSD);
                    MxnDeposit[index] = Number(MxnDeposit[index]) + Number(full.FinderDepositMXN);
                }
            }
            

            var returnHtml = '';            

            for (var index = 0; index < users.length; index++) {
                if (users[index] == username) {
                    returnHtml += users[index] + '<br>' + 
                            numberWithCommas(Number(UsdDeposit[index]).toFixed(0)) + ' USD / ' + 
                            numberWithCommas(Number(MxnDeposit[index]).toFixed(0)) + ' MXN<br>' ;
                }
                
            }

            return  returnHtml;
            
        }
    }

];

$(function () {

    $('.loading-box').css('width', $(window).width());
    $('.loading-box').css('height', $(window).height());

    $('#searchbtn').click(function () {
        refreshDatatable(true);        
    });    

    $('#dealSearchBtn').click(function() {
        managementDealTB.ajax.reload();
    })

    //socket setting

    // init websocket  
    websocket = new WebSocket(WS_URL);

    // data display from websocket
    websocket.onmessage = function (evt) {
        onMessage(evt)
    };

    websocket.onclose = function (evt) {
        console.log('socket-connection-close');
    };

    websocket.onerror = function (evt) {
        console.log('socket-connection-error');
    };
    websocket.onopen = function (evt) {
        console.log('socket-connection-open');
        setInterval(function () {
            websocket.send(JSON.stringify({ 'msg': 'maintain', 'poster': $('#usernameInput').val() }));
        }, 100000);
    };

    function onMessage(evt) {
        var message = JSON.parse(evt.data);
        var msg = message.msg;
        var poster = message.poster;           
    }

    $('#minStartDateInput').datepicker().on('changeDate', function (selected) {
        var startDate = new Date(selected.date.valueOf());
        var endDate = new Date($('#maxStartDateInput').val());
        if (startDate.getTime() > endDate.getTime()) {

            $('#maxStartDateInput').datepicker('setDate', startDate);
        }
        $('#maxStartDateInput').datepicker('setStartDate', startDate);
    }); 

    renderTB();    

    updateCounterPanel();
});

function renderTB() {
    managementTB = $('#lead-management-table').DataTable({
        'processing': true,
        'serverSide': true,
        'ajax': {
            url: base_url + 'Incentive/getDataForMe',
            type: 'POST',
            data: function (d) {                      
                d.status = $('#inputStatus').val();   
                d.dealType = $('#inputDealTypeFilter').val();
                d.minStartDate = $('#minStartDateInput').val();
                d.maxStartDate = $('#maxStartDateInput').val();    
                d.role = $('#inputRole').val();
                d.searchText = getTranslatedWordForSearch($('#searchInput').val());
            }
        },
        "columns": columnData,
        'language': {
            processing: ' <img src="' + base_url + 'assets/images/spinner.gif" id="loading">',
            zeroRecords: getLocalizationWord('No Data'),
            lengthMenu: lang == 'english' ? 'Show _MENU_ records' : "Muestra _MENU_ registros",
            info: lang == 'english' ? "Showing _START_ to _END_ of _TOTAL_ records" : "Mostrando _START_ a _END_ de _TOTAL_ registros",
            infoFiltered: '',
            infoEmpty: getLocalizationWord('No Records'),
            paginate: {
                "previous" : lang == 'english' ? "Previous" : "Atrás",
                "next" : lang == 'english' ? "Next" : 'Siguiente'
            }
        },
        'searching': false,
        'searchDelay': 700,
        'lengthChange': true,
        'lengthMenu': [[10, 25, 50, -1], [10, 25, 50, getLocalizationWord('All')]],
        // 'order': [[5, 'asc']],
        'autoWidth': true,
        'pageLength' : -1
    });
}

function gotoLink($link) {
    window.open($link, "_blank");
}

function checkEnterkey(e) {
    if (e.keyCode == 13) {
        $('#searchbtn').trigger('click');
    }
}

function checkEnterkeyforDeal(e) {
    if (e.keyCode == 13) {
        $('#dealSearchBtn').trigger('click');
    }
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function showSpinner() {
    $('.loading-box').css('display', 'flex');
}

function hiddenSpinner() {
    $('.loading-box').css('display', 'none');
}

function showDepositLoading() {
    $('#DepositLoading').show();
}

function hideDepositLoading() {
    $('#DepositLoading').hide();
}

function showSocketLoadingSpinner(poster) {
    if (!poster) {
        poster = 'someone';
    }
    $('#poster').html('New Post by ' + poster);
    $('.socket-loading-box').css('display', 'flex');
}

function hiddenSocketLoadingSpinner() {
    $('.socket-loading-box').css('display', 'none');
}

function showProgressBox() {
    $('.progress-box-layer').css('display', 'flex');
}

function hiddenProgressBox() {
    $('.progress-box-layer').css('display', 'none');
}

//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

function convertDate(date) {
    var dateList = date.split("-");
    return dateList[2] + "/" + dateList[1] + "/" + dateList[0];
}

function refreshDatatable(refresh = true) {
    updateCounterPanel();

    console.log('refresh');
    if (refresh == false)
        managementTB.ajax.reload(null, false);
    else
        managementTB.ajax.reload();
}

function updateCounterPanel() {
    getPaidIncentiveStatus();
    getProjectedIncentiveStatus();
    getIncentiveRoleStatus();
}

function getProjectedIncentiveStatus() {
    $.ajax({
        url : base_url + 'Incentive/getProjectedIncentiveStatus',
        type : 'post',   
        data : {
            user : $('#usernameInput').val(),
            dealType : $('#inputDealTypeFilter').val(),
            minStartDate : $('#minStartDateInput').val(),
            maxStartDate : $('#maxStartDateInput').val(),
            salesRep : 'All',
            role : $('#inputRole').val()
        },
        success : function(res) {
            var data = JSON.parse(res);

            
            $('#TotalCountonProjectedPanel').html(data.TotalCnt);
            $('#USDProjectedIncentive').html(numberWithCommas(data.USD) + ' USD');
            $('#MXNProjectedIncentive').html(numberWithCommas(data.MXN) + ' MXN');
        }
    });
}

function getPaidIncentiveStatus() {
    $.ajax({
        url : base_url + 'Incentive/getPaidIncentiveStatus',
        type : 'post',   
        data : {
            user : $('#usernameInput').val(),
            dealType : $('#inputDealTypeFilter').val(),
            minStartDate : $('#minStartDateInput').val(),
            maxStartDate : $('#maxStartDateInput').val(),
            salesRep : 'All',
            role : $('#inputRole').val()
        },
        success : function(res) {
            var data = JSON.parse(res);

            $('#TotalCountonPaidPanel').html(data.TotalCnt);
            $('#USDPaidIncentive').html(numberWithCommas(data.USD) + ' USD');
            $('#MXNPaidIncentive').html(numberWithCommas(data.MXN) + ' MXN');
        }
    });
}

function getIncentiveRoleStatus() {
    $.ajax({
        url : base_url + 'Incentive/getIncentiveRoleStatus',
        type : 'post',   
        data : {
            user : $('#usernameInput').val(),
            status : $('#inputStatus').val(),
            dealType : $('#inputDealTypeFilter').val(),
            minStartDate : $('#minStartDateInput').val(),
            maxStartDate : $('#maxStartDateInput').val(),
            role : $('#inputRole').val()
        },
        success : function(res) {
            var data = JSON.parse(res);

            $('#IcentiveRoleCount').html(data.TotalCnt);
            $("#SellerCount").html(data.Seller);
            $('#FinderCount').html(data.Finder);
            $('#BuyerCount').html(data.Buyer);
        }
    });
}

function logSuccessActivity(Activity, ID, Table) {
    $.ajax({
        url : base_url + 'Activity/addActivity',
        type : 'post',
        data : {
            Activity : Activity,
            ObjectiveTable : Table,
            ObjectiveID : ID,
            Webpage : 'Sales.MyIncentive',
            Status : 'Success',
            Error : ''
        },
        success : function () {
            websocket.send(JSON.stringify({ 'msg': 'activity', 'poster': $('#usernameInput').val() }));
        }
    });
}

function logErrorActivity(Activity, ID, Table, ErrorMsg) {
    $.ajax({
        url : base_url + 'Activity/addActivity',
        type : 'post',
        data : {
            Activity : Activity,
            ObjectiveTable : Table,
            ObjectiveID : ID,
            Webpage : 'Sales.MyIncentive',
            Status : 'Error',
            Error : ErrorMsg
        },
        success : function() {
            websocket.send(JSON.stringify({ 'msg': 'activity', 'poster': $('#usernameInput').val() }));
        }
    });
}