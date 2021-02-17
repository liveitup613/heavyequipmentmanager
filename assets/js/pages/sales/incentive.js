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
        "title": "",
        sortable: false,    
        "render": function (data, type, full, meta) {                                      
            var incentive = '<button  class="col-lg-4 btn btn-sm btn-default btn-action"  data-toggle="tooltip" data-placement="top" title="' + getLocalizationWord('Incentives') + '" onclick="onIncentives(' + full.ID + ')"><i class="fa fa-dollar"></i></button>'; 
            var deposit = '<button  class="col-lg-4 btn btn-sm btn-default btn-action"  data-toggle="tooltip" data-placement="top" title="' + getLocalizationWord('Deposit') + '" onclick="onDeposit(' + full.ID + ')"><i class="icon-wallet"></i></button>';
            var discard = '<button  class="col-lg-4 btn btn-sm btn-default btn-action"  data-toggle="tooltip" data-placement="top" title="' + getLocalizationWord('Discard') + '" onclick="onDiscard(' + full.ID + ')"><i class="icon-close"></i></button>';
            var btnReturn = '<button  class="col-lg-4 btn btn-sm btn-default btn-action"  data-toggle="tooltip" data-placement="top" title="' + getLocalizationWord('Return') + '" onclick="onReturn(' + full.ID + ')"><i class="icon-action-undo"></i></button>';
            var paidIncentive = '';

            var totalDeposit =  Number(full.SellerDepositUSD) + 
                                Number(full.SellerDepositMXN) + 
                                Number(full.FinderDepositMXN) + 
                                Number(full.FinderDepositUSD) + 
                                Number(full.BuyerDepositUSD) + 
                                Number(full.BuyerDepositMXN);

            if (totalDeposit != 0) {
                paidIncentive = '<button  class="col-lg-4 btn btn-sm btn-default btn-action"  data-toggle="tooltip" data-placement="top" title="' + getLocalizationWord('Paid Incentive') + '" onclick="onPaid(' + full.ID + ')"><i class="icon-check"></i></button>';
                discard = '';
            }
                

            var Status = $('#inputStatus').val();

            if (Status == 'Open') {
                return  '<div class="row" style = "width : 120px;">' + 
                    incentive + deposit + paidIncentive + discard + 
                    '</div>';
            }
            else if (Status == 'Paid') {
                return  '<div class="row" style = "width : 120px;">' + 
                    btnReturn + 
                    '</div>';
            }

            return  '<div class="row" style = "width : 120px;">' + 
                    btnReturn + 
                    '</div>';
                
        }
    }, {
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

            var SellerDetail = getLocalizationWord("Sales") + ': ' + SalesUser + '<br>' + 
                    (SellerIncentive == null ? getLocalizationWord('No Comm Calc') : SellerIncentive + ' ' + full.SellerCurrency) + '<br>';
            var BuyerDetail = getLocalizationWord('Buyer') + ': ' + (Buyer == '' ? 'None' : Buyer) + '<br>' + 
                    (BuyerIncentive == null ? getLocalizationWord('No Comm Calc') : BuyerIncentive + ' ' + full.BuyerCurrency) + '<br>';
            var FinderDetail = getLocalizationWord('Finder') + ': ' + Finder + '<br>' + 
                    (FinderIncentive == null ? getLocalizationWord('No Comm Calc') : FinderIncentive + ' ' + full.FinderCurrency) + '<br>';

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
                returnHtml += users[index] + '<br>' + 
                            numberWithCommas(Number(UsdDeposit[index]).toFixed(0)) + ' USD / ' + 
                            numberWithCommas(Number(MxnDeposit[index]).toFixed(0)) + ' MXN<br>' ;
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

    $.ajax({
        url : base_url + 'User/getAllUserName',
        type : 'post',
        success : function(data) {
            result = JSON.parse(data);
           
            var assigned = "<option value='All'>All</option>";
            for (var i = 0; i < result.length ; i++) {              
                if (result[i].SALESREP == 'ON')  
                    assigned += '<option value="' + result[i].USERNAME +'">' + result[i].USERNAME + '</option>';                
            }
            $('#inputSalesRep').html(assigned);
        }
    }); 

    updateCounterPanel();
});

function renderTB() {
    managementTB = $('#lead-management-table').DataTable({
        'processing': true,
        'serverSide': true,
        'ajax': {
            url: base_url + 'Incentive/getData',
            type: 'POST',
            data: function (d) {                      
                d.status = $('#inputStatus').val();   
                d.dealType = $('#inputDealTypeFilter').val();
                d.minStartDate = $('#minStartDateInput').val();
                d.maxStartDate = $('#maxStartDateInput').val();
                d.salesRep = $('#inputSalesRep').val();                            
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
}

function onIncentives(ID) {
    showSpinner();

    $('#edit-item-id').val(ID);


    $.ajax({
        url: base_url + 'Incentive/getDataByID',
        type: 'post',
        data: {
            ID : ID
        },
        success: function(res) {
            hiddenSpinner();
            var data = JSON.parse(res);

            if (data.success == false) {
                toastr.error("Incentive Error");
                return;                
            }            

            var Deal = data.deal;
            var Sale = data.sale;
            var Setting = data.setting;
            var DealType = Deal.DealType;
            var MarginProfit = 0;
            var BuyingProfit = 0;

            if (Number(Deal.Margin) != 0) {
                if (Number(Sale.Price) >= Number(Deal.Price))
                    MarginProfit = Number(Deal.Margin);
                else
                    MarginProfit = Number(Sale.Price) - (Number(Deal.Price) - Number(Deal.Margin));
            }
            else 
                MarginProfit = 0;

            if (Number(Sale.BuyingAmount) != 0) {
                BuyingProfit = Number(Deal.Price) - Number(Deal.Margin) - Number(Sale.BuyingAmount);                
            }
            else   
                BuyingProfit = 0;

            MarginProfit = MarginProfit < 0 ? 0 : MarginProfit;
            BuyingProfit = BuyingProfit < 0 ? 0 : BuyingProfit;

            var DealInfo = '';
            DealInfo += '<span class="item-info-index">' + getLocalizationWord('Deal Type') + ':&nbsp </span><span class="item-info-content">' + getBadgetForDealType(Sale.DealType) + '</span><br>';                    
            if (Sale.DealType == 'Inventory' || Sale.DealType == 'Supplier' || Sale.DealType == 'Consignment') {
                DealInfo += '<span class="item-info-index">' + getLocalizationWord('Listing Price') + ':&nbsp </span><span class="item-info-content">' + numberWithCommas(Deal.Price) + '</span><br>';                    
                DealInfo += '<span class="item-info-index">' + getLocalizationWord('Margin') + ':&nbsp </span><span class="item-info-content">' + numberWithCommas(Deal.Margin) + '</span><br>';                    
            }

            //$('#DealInfoPanel').html(DealInfo);

            var BuyingInfo = '';

            BuyingInfo += '<span class="item-info-index">' + getLocalizationWord('Buying Amount') + ':&nbsp </span><span class="item-info-content">' + numberWithCommas(Sale.BuyingAmount) + '</span><br>';                    
            BuyingInfo += '<span class="item-info-index">' + getLocalizationWord('Equipment Category') + ':&nbsp </span><span class="item-info-content">' + (lang == 'spanish' ? get_translated_word(Deal.EqCategory) : Deal.EqCategory) + '</span><br>';                    

            if (DealType != 'Manufacturing' && DealType != 'Logistics') {
                if (DealType != 'Inventory') {
                    BuyingInfo += '<span class="item-info-index">' + getLocalizationWord('Equipment Category Grade') + ':&nbsp </span><span class="item-info-content">' + Deal.EquipmentCategoryGrade + '</span><br>';                    
                    BuyingInfo += '<span class="item-info-index">' + getLocalizationWord('Equipment Category Paygrade') + ':&nbsp </span><span class="item-info-content">' + Deal.EquipmentCategoryPaygrade + '</span><br>';                    
                    BuyingInfo += '<span class="item-info-index">' + getLocalizationWord('Source') + ':&nbsp </span><span class="item-info-content">' + Deal.BuyingSource + '</span><br>';                                        
                }                             
                
                BuyingInfo += '<span class="item-info-index">' + getLocalizationWord('Source Grade') + ':&nbsp </span><span class="item-info-content">' + Deal.SourceGrade + '</span><br>';                    
                BuyingInfo += '<span class="item-info-index">' + getLocalizationWord('Source Paygrade') + ':&nbsp </span><span class="item-info-content">' + Deal.SourcePaygrade + '</span><br>';                    
            }
            BuyingInfo += '<span class="item-info-index">' + getLocalizationWord('Profit from Buying') + ':&nbsp </span><span class="item-info-content">' + numberWithCommas(Number(BuyingProfit)) + '</span><br>';                    

            //$('#BuyingInfoPanel').html(BuyingInfo);            
            totalProfit =   Number(Sale.Price) + 
                            Number(Sale.Additional) + 
                            Number(Sale.Comm) - 
                            Number(Sale.Discount) -
                            Number(Sale.BuyingAmount);

            var SalesInfo = '';
            var CommissionAmount = totalProfit * Setting.Commission / 100;
            CommissionAmount = Number(CommissionAmount).toFixed();
            SalesInfo += '<span class="item-info-index">' + getLocalizationWord('Price') + ':&nbsp </span><span class="item-info-content">' + numberWithCommas(Sale.Price) + ' ' + Sale.SalesCurrency + '</span><br>';                    
            SalesInfo += '<span class="item-info-index">' + getLocalizationWord('Additional Charges') + ':&nbsp </span><span class="item-info-content">' + numberWithCommas(Sale.Additional) + '</span><br>';                    
            SalesInfo += '<span class="item-info-index">' + getLocalizationWord('Discount') + ':&nbsp </span><span class="item-info-content">' + numberWithCommas(Sale.Discount) + '</span><br>';                    
            SalesInfo += '<span class="item-info-index">' + getLocalizationWord('Buying Amount') + ':&nbsp </span><span class="item-info-content">' + numberWithCommas(Sale.BuyingAmount) + '</span><br>';                    
            SalesInfo += '<span class="item-info-index">' + getLocalizationWord('Total Profit') + ':&nbsp </span><span class="item-info-content">' + numberWithCommas(Number(totalProfit)) + '</span>&nbsp<span class="item-info-content" id="SalesCurrency">' + Sale.SalesCurrency + '</span><br>';                    
            SalesInfo += '<span class="item-info-index">' + getLocalizationWord('Commission Rate') + ':&nbsp </span><span class="item-info-content" id="CommissionRate">' + numberWithCommas(Setting.Commission) + '%</span><br>';                    
            SalesInfo += '<span class="item-info-index">' + getLocalizationWord('Commission Amount') + ':&nbsp </span><span class="item-info-content" id="CommissionAmount">' + numberWithCommas(CommissionAmount) + ' ' + Sale.SalesCurrency + '</span><br>';                    
            
            $('#SalesInfoPanel').html(SalesInfo);

            var DealUpload = Number(Deal.EquipmentCategoryPaygrade) + Number(Deal.SourcePaygrade);
            var Buying = 0;
            var BuyingNegotiation = 0;
            var FinderProfitFromMargin = 0;
            var SellerProfitFromMargin = 0;
            var SalePrice = 0;
            var SaleBonus = 0;


            if (DealType == 'Auction')
                Buying = Setting.AuctionPaygrade;
            else if (DealType == 'Supplier')
                Buying = Setting.SupplierPaygrade;

            BuyingNegotiation = BuyingProfit * Setting.BuyingNegotiation / 100;
            FinderProfitFromMargin = MarginProfit * Setting.FinderMargin / 100;
            SellerProfitFromMargin = MarginProfit * Setting.SellerMargin / 100;

            SalePrice = Sale.Price * Setting.Sale /  100;
            SaleBonus = Sale.Additional * Setting.SaleBonus / 100;

            var IncentiveCalcInfo = '';
            
            IncentiveCalcInfo += '<span class="item-info-index">' + getLocalizationWord('Deal Upload') + ':&nbsp </span><span class="item-info-content">' + numberWithCommas(DealUpload) + '</span><br>';                    
            IncentiveCalcInfo += '<span class="item-info-index">' + getLocalizationWord('Buying') + ':&nbsp </span><span class="item-info-content">' + numberWithCommas(Buying) + '</span><br>';                    
            IncentiveCalcInfo += '<span class="item-info-index">' + getLocalizationWord('Buying Negotiation') + ':&nbsp </span><span class="item-info-content">' + numberWithCommas(Number(BuyingNegotiation).toFixed(2)) + '</span><br>';                    
            IncentiveCalcInfo += '<span class="item-info-index">' + getLocalizationWord('Finder Profit from Margin') + ':&nbsp </span><span class="item-info-content">' + numberWithCommas(Number(FinderProfitFromMargin).toFixed(2)) + '</span><br>';                    
            IncentiveCalcInfo += '<span class="item-info-index">' + getLocalizationWord('Seller Profit from Margin') + ':&nbsp </span><span class="item-info-content">' + numberWithCommas(Number(SellerProfitFromMargin).toFixed(2)) + '</span><br>';                    
            IncentiveCalcInfo += '<span class="item-info-index">' + getLocalizationWord('Sale') + ':&nbsp </span><span class="item-info-content">' + numberWithCommas(Number(SalePrice).toFixed(2)) + '</span><br>';                    
            IncentiveCalcInfo += '<span class="item-info-index">' + getLocalizationWord('Sale Bonus') + ':&nbsp </span><span class="item-info-content">' + numberWithCommas(Number(SaleBonus).toFixed(2)) + '</span><br>';                    
            //$('#IncentiveCalcuationPanel').html(IncentiveCalcInfo);

            var FinderIncentive = Number(DealUpload) + Number(FinderProfitFromMargin);
            var BuyerIncentive = Number(Buying) + Number(BuyingNegotiation);
            var SellerIncentive = Number(SellerProfitFromMargin) + Number(SalePrice) + Number(SaleBonus);

            /*$('#SellerIncentive').val(SellerIncentive);
            $('#FinderIncentive').val(FinderIncentive);
            $('#BuyerIncentive').val(BuyerIncentive);*/

            $('#SellerIncentiveCurrency').val(Sale.SalesCurrency);
            $('#BuyerIncentiveCurrency').val(Sale.SalesCurrency);
            $('#FinderIncentiveCurrency').val(Sale.SalesCurrency);

            DealType = Sale.DealType;
            var PersonNum = 0;
            var DistributionAmount = totalProfit * Setting.Commission / 100;      
            
            $('#FinderIncentive').val(0);
            $('#BuyerIncentive').val(0);
            $('#SellerIncentive').val(0);
            
            if (DealType == 'Inventory') {
                $('#SellerPanel').show();
                $('#BuyerPanel').hide();
                $('#FinderPanel').hide();
                PersonNum = 1;
                $('#SellerIncentive').val(Number(DistributionAmount / PersonNum).toFixed(2));                
            }
            else if (DealType == 'Auction') {
                $('#SellerPanel').show();
                $('#BuyerPanel').show();
                $('#FinderPanel').show();
                PersonNum = 3;
                $('#SellerIncentive').val(Number(DistributionAmount / PersonNum).toFixed(2));
                $('#FinderIncentive').val(Number(DistributionAmount / PersonNum).toFixed(2));
                $('#BuyerIncentive').val(Number(DistributionAmount / PersonNum).toFixed(2));
            }
            else if (DealType == 'Supplier') {
                $('#SellerPanel').show();
                $('#BuyerPanel').show();
                $('#FinderPanel').show();
                PersonNum = 3;
                $('#SellerIncentive').val(Number(DistributionAmount / PersonNum).toFixed(2));
                $('#FinderIncentive').val(Number(DistributionAmount / PersonNum).toFixed(2));
                $('#BuyerIncentive').val(Number(DistributionAmount / PersonNum).toFixed(2));
            }
            else if (DealType == 'Consignment') {
                $('#SellerPanel').show();
                $('#BuyerPanel').hide();
                $('#FinderPanel').show();
                PersonNum = 2;
                $('#SellerIncentive').val(Number(DistributionAmount / PersonNum).toFixed(2));
                $('#FinderIncentive').val(Number(DistributionAmount / PersonNum).toFixed(2));                
            }
            else if (DealType == 'Manufacturing') {
                $('#SellerPanel').show();
                $('#BuyerPanel').hide();
                $('#FinderPanel').hide();
                PersonNum = 1;
                $('#SellerIncentive').val(Number(DistributionAmount / PersonNum).toFixed(2));                
            }
            else if (DealType == 'Logistics') {
                $('#SellerPanel').show();
                $('#BuyerPanel').hide();
                $('#FinderPanel').hide();
                PersonNum = 1;
                $('#SellerIncentive').val(Number(DistributionAmount / PersonNum).toFixed(2));
            }

            

            $.ajax({
                url : base_url + 'Incentive/getDepositUsers',
                type : 'post',
                data : {
                    ID : ID
                },
                success: function(res) {                    
                    var result = JSON.parse(res);
        
                    if (result.success == false) {
                        return;
                    }

                    if (result.Seller != '') {
                        $('#SellerName').html(getLocalizationWord('Seller') + ': ' + result.Seller);                        
                    }
                    else 
                        $('#SellerName').html(getLocalizationWord('Seller') + ': None');

                    if (result.Buyer != '') {
                        $('#BuyerName').html(getLocalizationWord('Buyer') + ': ' + result.Buyer);   
                    }
                    else   
                        $('#BuyerName').html(getLocalizationWord('Buyer') + ': None');

                    if (result.Finder != '') {                
                        $('#FinderName').html(getLocalizationWord('Finder') + ': ' + result.Finder);
                    }
                    else
                        $('#FinderName').html(getLocalizationWord('Finder') + ': None');  
                    

                    $('#IncentivesModal').modal('show');
                }

            })

            
        }
    });    
}   

function calcDistribution() {
    console.log('calc distribution');

    var SellerIncentive = $('#SellerIncentive').val();
    var BuyerIncentive = $('#BuyerIncentive').val();
    var FinderIncentive = $('#FinderIncentive').val();

    var SellerCurrency = $('#SellerIncentiveCurrency').val();
    var BuyerCurrency = $('#BuyerIncentiveCurrency').val();
    var FinderCurrency = $('#FinderIncentiveCurrency').val();

    var SalesCurrency = $('#SalesCurrency').html();

    if (SellerCurrency != SalesCurrency || BuyerCurrency != SalesCurrency || FinderCurrency != SalesCurrency) {
        $('#CommissionRate').html('Currencies do not match');
        $('#CommissionAmount').html('Currencies do not match');
    }
    else {
        var totalDistribution = Number(SellerIncentive) + Number(BuyerIncentive) + Number(FinderIncentive);
        var CommissionRate = totalDistribution / totalProfit * 100;
        $('#CommissionRate').html(Number(CommissionRate).toFixed(2) + '%');
        $('#CommissionAmount').html(Number(totalDistribution).toFixed() + ' ' + $('#SalesCurrency').html());
    }
}

$('#btnIncentive').click(function() {

    showSpinner();

    var SaleID = $('#edit-item-id').val();
    var SellerIncentive = $('#SellerIncentive').val();
    var BuyerIncentive = $('#BuyerIncentive').val();
    var FinderIncentive = $('#FinderIncentive').val();
    var SellerCurrency = $('#SellerIncentiveCurrency').val();
    var BuyerCurrency = $('#BuyerIncentiveCurrency').val();
    var FinderCurrency = $('#FinderIncentiveCurrency').val();

    $.ajax({
        url : base_url + 'Incentive/setIncentiveValue',
        type : 'post',
        data : {
            SellerIncentive : SellerIncentive,
            FinderIncentive : FinderIncentive,
            BuyerIncentive : BuyerIncentive,
            SellerCurrency : SellerCurrency,
            BuyerCurrency : BuyerCurrency,
            FinderCurrency : FinderCurrency,
            SaleID : SaleID
        },
        success : function() {

            hiddenSpinner();

            $('#IncentivesModal').modal('hide');

            refreshDatatable(false);     
        }
    })
}) ;

function onDeposit(ID) {
    $('#edit-item-id').val(ID);

    showSpinner();

    $.ajax({
        url : base_url + 'Incentive/getDepositUsers',
        type : 'post',
        data : {
            ID : ID
        },
        success: function(res) {
            hiddenSpinner();
            var result = JSON.parse(res);

            if (result.success == false) {
                return;
            }

            var comboHtml = '';
            var SelectedUser = '';

            if (result.Seller != '') {
                comboHtml += '<option value="Seller">' + getLocalizationWord('Seller') +' ' + result.Seller + '</option>';
                SelectedUsser = result.Seller;
            }
            if (result.Buyer != '') {
                comboHtml += '<option value="Buyer">' + getLocalizationWord('Buyer') + ' ' + result.Buyer + '</option>';
                SelectedUser = result.Buyer;
            }
            if (result.Finder != '') {                
                comboHtml += '<option value="Finder">' + getLocalizationWord('Finder') + ' ' + result.Finder + '</option>';
                SelectedUser = result.Finder;
            }
                
            $('#inputDepositUser').html(comboHtml);
            var today = new Date();
            startDate = today.toLocaleString("en-US", {timeZone: "America/Phoenix"});
            $('#DepositDate').datepicker('setDate', new Date(startDate));
            $('#DepositAmount').val(0);
            $('#DepositCurrency').val('MXN');

            showIncentiveDetail('Seller', ID);

            $('#DepositModal').modal('show');
        }   
    })
}

function DepositUserSelected() {
    var User = $('#inputDepositUser').val();
    var SaleId = $('#edit-item-id').val();

    showIncentiveDetail(User, SaleId);
}

function showIncentiveDetail(User, SalesID) {
    console.log(User + ' ' + SalesID);

    showDepositLoading();

    $.ajax({
        url : base_url + 'Incentive/getIncentiveDetail',
        type : 'post',
        data : {
            User : User,
            SalesID : SalesID
        },
        success : function (res) {
            hideDepositLoading();

            var result = JSON.parse(res);

            if (result.success == false) {
                return;
            }

            var IncentiveAmount = result.IncentiveAmount;
            var IncentiveCurrency = result.IncentiveCurrency;
            var MXNDeposit = result.MXNDeposit;
            var USDDeposit = result.USDDeposit;

            var html = '';

            html += '<span class="item-info-index">' + getLocalizationWord('Incentive Amount') + ':&nbsp </span><span class="item-info-content">' + (IncentiveAmount == '' ? 'None' : IncentiveAmount + ' ' + IncentiveCurrency) + '</span><br>';                    
            html += '<span class="item-info-index">' + getLocalizationWord('Deposit in MXN') + ':&nbsp </span><span class="item-info-content">' + (MXNDeposit + ' MXN') + '</span><br>';                    
            html += '<span class="item-info-index">' + getLocalizationWord('Deposit in USD') + ':&nbsp </span><span class="item-info-content">' + (USDDeposit + ' USD') + '</span><br>';                                

            $('#DepositInfoPanel').html(html);
        }
    });    
}

$('#btnDeposit').click(function() {
    var SalesID = $('#edit-item-id').val();
    var User = $('#inputDepositUser').val();
    var DepositDate = $('#DepositDate').val();
    var Amount = $('#DepositAmount').val();
    var Currency = $('#DepositCurrency').val();

    if (Amount == '0') {
        toastr.warning('Amoust must be above 0');
        return;
    }

    showSpinner();

    $.ajax({
        url : base_url + 'Incentive/addIncentive',
        type : 'post',
        data : {
            User : User,
            SalesID : SalesID,
            Date : DepositDate,
            Amount : Amount,
            Currency : Currency
        },
        success : function (res) {
            hiddenSpinner();

            var result = JSON.parse(res);

            if (result.success == false) {
                toastr.error(getLocalizationWord('Add Incentive Error'));
                return;
            }

            $('#DepositModal').modal('hide');
            refreshDatatable(false);
        }
    })
});

$('#btnIncentiveSettings').click(function() {
    showSpinner();

    $.ajax({
        url: base_url + 'Incentive/getSettings',
        type : 'post',
        success : function(res) {
            hiddenSpinner();

            var result = JSON.parse(res);

            $('#Commission').val(result.Commission);         
            $('#IncentivesSettingModal').modal('show');
        }
    });
    
});

$('#btnIncentiveSettingsUpdate').click(function() {
    showSpinner();

    $.ajax({
        url: base_url + 'Incentive/updateSettings',
        type : 'post',
        data : {
            Commission : $('#Commission').val(),          
        },
        success : function() {
            hiddenSpinner();
            logSuccessActivity('Update Commission Rate', 0, '');
            $('#IncentivesSettingModal').modal('hide');            
        }
    });
});

function onDiscard(ID) {
    showSpinner();

    $.ajax({
        url: base_url + 'Incentive/discardIncentive',
        type: 'post',
        data : {
            ID : ID
        },
        success: function() {
            hiddenSpinner();

            logSuccessActivity('Discard Incentive', ID, 'tblSale');
            refreshDatatable();
        }
    })
}

function onReturn(ID) {
    showSpinner();

    $.ajax({
        url: base_url + 'Incentive/returnToOpen',
        type: 'post',
        data : {
            ID : ID
        },
        success: function() {
            hiddenSpinner();
            logSuccessActivity('Return Incentive', ID, 'tblSale');
            refreshDatatable();
        }
    })
}

function onPaid(ID) {
    showSpinner();

    $.ajax({
        url: base_url + 'Incentive/setPaidIncentive',
        type: 'post',
        data : {
            ID : ID
        },
        success: function() {
            hiddenSpinner();

            logSuccessActivity('Set Paid Incentive', ID, 'tblSale');
            refreshDatatable();
        }
    })
}

function getProjectedIncentiveStatus() {
    $.ajax({
        url : base_url + 'Incentive/getProjectedIncentiveStatus',
        type : 'post',   
        data : {
            user : 'All',
            dealType : $('#inputDealTypeFilter').val(),
            minStartDate : $('#minStartDateInput').val(),
            maxStartDate : $('#maxStartDateInput').val(),
            salesRep : $('#inputSalesRep').val(),
            role : 'All'
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
            user : 'All',
            dealType : $('#inputDealTypeFilter').val(),
            minStartDate : $('#minStartDateInput').val(),
            maxStartDate : $('#maxStartDateInput').val(),
            salesRep : $('#inputSalesRep').val(),
            role : 'All'
        },
        success : function(res) {
            var data = JSON.parse(res);

            $('#TotalCountonPaidPanel').html(data.TotalCnt);
            $('#USDPaidIncentive').html(numberWithCommas(data.USD) + ' USD');
            $('#MXNPaidIncentive').html(numberWithCommas(data.MXN) + ' MXN');
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
            Webpage : 'Sales.Incentive',
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
            Webpage : 'Sales.Incentive',
            Status : 'Error',
            Error : ErrorMsg
        },
        success : function() {
            websocket.send(JSON.stringify({ 'msg': 'activity', 'poster': $('#usernameInput').val() }));
        }
    });
}