/*
@@ LEAD-MANAGEMENT.JS
@@ By Zheng
@@ 2020-02-15
*/

var managementTB;
var expirationTimes = [];
var startTimes = [];
var closedByUsers = [];
var statuses = [];
var DepositHistoryID = [];
var rows = [];
var phone;

// column data
var columnData = [
    {
        "title" : "",
        sortable : false,
        render : function(data, type, full, meta) {
            var btnCancel = '<button  class="col-lg-4 btn btn-sm btn-default btn-action"  data-toggle="tooltip" data-placement="top" title="' + getLocalizationWord('Cancel') +'" onclick="onUndo(' + full.ID + ', ' + full.TotalDeposit + ')"><i class="icon-action-undo"></i></button>';            
            var btnPricingInfo = '<button  class="col-lg-4 btn btn-sm btn-default btn-action"  data-toggle="tooltip" data-placement="top" title="' + getLocalizationWord('Pricing Info') +'" onclick="onPricingInfo(' + full.ID + ')"><i class="icon-trophy"></i></button>';
            var btnInventory = '';

            var rounded_total = Number(full.BuyingPrice).toFixed(2);
            // var total_deposit = Number(full.TotalDeposit).toFixed(2);
            // var percentage = Number(full.TotalDeposit / full.Total * 100);

            var btnDeposit = '<button  class="col-lg-4 btn btn-sm btn-default btn-action"  data-toggle="tooltip" data-placement="top" title="' + getLocalizationWord('Deposit') +'" onclick="onDeposit(' + full.ID + ', \'' + full.Currency + '\', ' + full.TotalDeposit + ', ' + rounded_total + ')"><i class="icon-wallet"></i></button>';
            var depositLog = '<button  class="col-lg-4 btn btn-sm btn-default btn-action"  data-toggle="tooltip" data-placement="top" title="' + getLocalizationWord('Deposit History') + '" onclick="onDepositHistory(' + full.ID +', \'' + full.Currency + '\', ' + full.TotalDeposit + ')"><i class="icon-calculator"></i></button>';
            var btnDocs = '<button  class="col-lg-4 btn btn-sm btn-default btn-action"  data-toggle="tooltip" data-placement="top" title="' + getLocalizationWord('Documents') + '" onclick="onDocuments(' + full.ID + ')"><i class="icon-docs"></i></button>';

            if (full.Status == 'Paid' || full.Status == 'Canceled') {
                btnCancel = '';
                btnPricingInfo = '';
                btnDeposit = '';
                if (full.DealType != 'Inventory' && full.State == 'Paid')
                    btnInventory = '<button  class="col-lg-4 btn btn-sm btn-default btn-action"  data-toggle="tooltip" data-placement="top" title="' + getLocalizationWord('Inventory') +'" onclick="onInventory(' + full.DealID + ')"><i class="icon-pin"></i></button>';
            }            
            
            return  '<div class="row" style = "width : 120px;">' + 
                btnCancel + btnPricingInfo + btnDeposit + depositLog + btnDocs + btnInventory + 
                '</div>';
        }
    },  {
        "title": getLocalizationWord("Photo"),
        sortable: false,
        "render": function (data, type, full, meta) {
            if (full.DealID == 0)
                return '';
            
            $imgUrl = base_url + "assets/images/thumbImages/" + full.PrimaryImage;
            var photoElement = '<div class="photo-cell" style="background-image: url(\'' + $imgUrl + '\')">' +
                '<img  class="auction-photo" src="' + $imgUrl + '" >' +              
                '</div>';

            return photoElement;
        }
    }, {
        "title": getLocalizationWord("Buying Status"),
        sortable: false,
        "render": function (data, type, full, meta) {            
            var endDate = '';
            var SalesCode = '';

            if (full.SalesCode != null)
                SalesCode = full.SalesCode + '<br>';

            if (full.Status == 'Canceled')
                endDate = full.EndDate;

            
            return  getDatefromDateTime(full.DateAdded) + '<br>' + 
                    getBadgetForEachStatusOnProcurement(full.Status) + '<br>' +
                    endDate + 
                    SalesCode;
        }
    }, {
        "title": getLocalizationWord("Equipment Info"),
        sortable: false,
        "render": function (data, type, full, meta) {            
            var EqCategory = '';
            if (full.EqCategory == null)
                EqCategory = '';
            else {
                if (lang == 'spanish')
                    EqCategory = get_translated_word(full.EqCategory) + '<br>';               
                else 
                    EqCategory = full.EqCategory + '<br>';
            }
            return  EqCategory + 
                    getCheckedValue(full.EqMake) + 
                    getCheckedValue(full.EqModel) + 
                    getCheckedValue((full.MinYear == '0' ? "" : full.MinYear));
        }
    }, {
        "title": getLocalizationWord("Location Info"),
        sortable: false,
        "render": function (data, type, full, meta) {            
            return  getCheckedValue(full.City) + 
            getCheckedValue(full.State)+ 
            getCheckedValue(full.Country); 
        }
    }, {
        'title' : getLocalizationWord('Deal Info'),
        sortable : false,
        render : function (data, type, full, meta) {
            if (full.DealID == 0) 
                return '';

            var Title = getCheckedValue(getTitleFromDatabase(full));
            var DealType = getBadgetForDealType(full.DealType) + '<br>';
            var SN = '';
            var EndDate = '';
            var mhCode = full.MHCode + '<br>';
            var Finder = getLocalizationWord("Finder") + ": " + full.USERNAME + '<br>';
            var Buyer = full.Buyer;

            if (full.EqSN != '') 
                SN = 'SN: ' + full.EqSN + '<br>';

            if (full.DealType == 'Auction')
            {
                EndDate = full.EndDate + '<br>';
                var today = new Date();
                today.setDate(today.getDate() - 1);
                startDate = today.toLocaleString("en-US", {timeZone: "America/Phoenix"});
                startDate = new Date(startDate);
                endDate = new Date();
                endDate.setDate(startDate.getDate() + 2);
                var startFormatedDate = formatDate(startDate);
                var endFormatDate = formatDate(endDate);                

                if (startFormatedDate <= EndDate && EndDate <= endFormatDate)
                    EndDate = '<span class="badge badge-warning" style="margin-left: 0px;">' + EndDate + '</span><br>';

            }

            if (Buyer != '')
                Buyer = getLocalizationWord("Buyer") + ": " + Buyer;

            return DealType + Title + EndDate + SN + mhCode + Finder + Buyer; 
        }
    }, {
        "title": getLocalizationWord("Price Info"),
        sortable: false,
        "render": function (data, type, full, meta) {            
            
            return  getLocalizationWord('Price') + ': ' + numberWithCommas(full.BuyingPrice) + ' ' + full.Currency + '<br>' +
                    getLocalizationWord('Deposits') + ': ' + numberWithCommas(full.TotalDeposit) + ' ' + full.Currency + '<br>' + 
                    getLocalizationWord('Remaining') + ': ' + numberWithCommas(Number(full.BuyingPrice - full.TotalDeposit).toFixed(0)) + ' ' + full.Currency + 
                    (full.AuctionAccount == '' ? '' : '<br>' + getLocalizationWord('Account') + ': ' + full.AuctionAccount);
        }
    }
];



// set up  truck management table
$(function () {

    getActiveBuys();
    getRemainingDeposits();

    $('.loading-box').css('width', $(window).width());
    $('.loading-box').css('height', $(window).height());

    $('.socket-loading-box').css('width', $(window).width());
    $('.socket-loading-box').css('height', $(window).height());

    $('.progress-box-layer').css('width', $(window).width());
    $('.progress-box-layer').css('height', $(window).height());

    renderTB();

    $('.socket-loading-btn').click(function () {
        hiddenSocketLoadingSpinner();
        refreshDatatable();
    })

    $('#searchbtn').click(function () {
        refreshDatatable(true);
    });    


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

    $.ajax({
        url : base_url + 'User/getAllUserName',
        type : 'post',
        success : function(data) {
            result = JSON.parse(data);
            var buyers = "<option value=''></option>";
            for (var i = 0; i < result.length ; i++) {                              
                buyers += '<option value="' + result[i].USERNAME +'">' + result[i].USERNAME + '</option>';
            }            
            $('#Buyer').html(buyers);
        }
    });
       
});


function renderTB() {
    managementTB = $('#lead-management-table').DataTable({
        'processing': true,
        'serverSide': true,
        'ajax': {
            url: base_url + 'Procurement/getData',
            type: 'POST',
            data: function (d) {                                
                d.minStartDate = $('#minStartDateInput').val();
                d.maxStartDate = $('#maxStartDateInput').val();
                d.minPrice = $('#minPriceInput').val();
                d.maxPrice = $('#maxPriceInput').val();
                d.minRemaining = $('#minRemainingInput').val();
                d.maxRemaining = $('#maxRemainingInput').val();
                d.status = $('#inputStatus').val();
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
                "previous" : lang == 'english' ? "Previous" : "Atrás ",
                "next" : lang == 'english' ? "Next" : 'Siguiente'
            }
        },
        'searching': false,
        'searchDelay': 700,
        'lengthChange': true,
        'sorting' : false,
        'lengthMenu': [[10, 25, 50, -1], [10, 25, 50, getLocalizationWord('All')]],
        //'order': [[5, 'asc']],
        'autoWidth': true,
        'pageLength' : 50
    });
}


//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////

function gotoLink($link) {
    window.open($link, "_blank");
}

//////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////

function checkEnterkey(e) {
    if (e.keyCode == 13) {
        $('#searchbtn').trigger('click');
    }
}


function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////

function showSpinner() {
    $('.loading-box').css('display', 'flex');
}

function hiddenSpinner() {
    $('.loading-box').css('display', 'none');
}


//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

function convertDate(date) {
    var dateList = date.split("-");
    return dateList[2] + "/" + dateList[1] + "/" + dateList[0];
}

function refreshDatatable(refresh = false) {
    getActiveBuys();
    getRemainingDeposits();


    console.log('refresh');
    if (refresh == false)
        managementTB.ajax.reload(null, false);
    else
        managementTB.ajax.reload();
}

function onUndo(ID, TotalDeposit) {

    if (TotalDeposit != 0) {
        $('#edit-item-id').val(ID);
        $('#ReturnAmount').val(TotalDeposit);
        $('#CancelModal').modal('show');
        return;
    }

    showSpinner();
    $.ajax({
        url: base_url + 'Procurement/undo',
        type: 'post',
        data: {
            'ID' : ID
        },
        success: function(res) {
            hiddenSpinner();
            var data = JSON.parse(res);

            if (data.success == false) {
                toastr.warning('Cancel Procurement Error', 'Machinery Hawkers');
                logErrorActivity('Cancel Procurement', ID, 'tblprocurement', 'Cancel Procurement Error');
                return;
            }

            toastr.success('Cancel Procurement', 'Machinery Hawkers');
            logSuccessActivity('Cancel Procurement', ID, 'tblprocurement');
            refreshDatatable(false);
        }
    })
}

$('#btnCancelSale').click(function() {
    

    var ID = $('#edit-item-id').val();

    var ReturnAmount = $('#ReturnAmount').val();

    showSpinner();
    $.ajax({
        url : base_url + 'Procurement/cancel',
        type : 'post',
        data : {
            ID : ID,
            ReturnAmount : $('#ReturnAmount').val()
        },
        success : function(res) {
            hiddenSpinner();
            $('#CancelModal').modal('hide');
            var data = JSON.parse(res);

            if (data.success == false) {
                if (data.message == 'Limited Deposit')
                    toastr.error(LocalizationMessage('Deposit exceeds Total Error'));
                else
                    toastr.error(LocalizationMessage('Cancel Sale') + ' Error');
                logErrorActivity('Cancel Sale', ID, 'tblSales', data.message);
                return;
            }

            toastr.success(LocalizationMessage('Cancel Sale'));
            logSuccessActivity('Cancel Sale', ID, 'tblSales');

            refreshDatatable(false);
        }
    });
});

function onPricingInfo(ID) {
    $('#edit-item-id').val(ID);

    showSpinner();
    $.ajax({
        url: base_url + 'Procurement/get',
        type: 'post',
        data: {
            ID: ID
        },
        success: function(res) {
            hiddenSpinner();
            var data = JSON.parse(res);
            if (data.success == true) {
                toastr.error('Get Procurement Error', 'Machinery Hawkers');
            }

            var procurement = data.procurement;

            $('#OriginalPrice').val(procurement.OriginalPrice);
            $('#Currency').val(procurement.Currency);
            $('#BuyingPrice').val(procurement.BuyingPrice);
            $('#Buyer').val(procurement.Buyer);
            $('#AuctionAccount').val(procurement.AuctionAccount);
            $('#PricingInfoModal').modal('show');
        }
    });    
}

$('#btnPricingInfoSave').click(function() {
    showSpinner();
    var ID = $('#edit-item-id').val();

    $.ajax({
        url: base_url + 'Procurement/update',
        type: 'post',
        data : {
            ID : ID,
            OriginalPrice: $('#OriginalPrice').val(),
            Currency: $('#Currency').val(),
            BuyingPrice: $('#BuyingPrice').val(),
            Buyer: $('#Buyer').val(),
            AuctionAccount: $('#AuctionAccount').val()
        },
        success: function(res) {
            hiddenSpinner();
            $('#PricingInfoModal').modal('hide');

            var data = JSON.parse(res);

            if (data.success == false) {
                toastr.warning('Update Pricing Info Error', 'Machinery Hawkers');
                logErrorActivity('Update Pricing Info', ID, 'tblprocurement', 'Update Pricing Info Error');
                return;
            }

            toastr.success('Update Pricing Info', 'Machinery Hawkers');
            logSuccessActivity('Update Pricing Info', ID, 'tblprocurement');
            refreshDatatable(false);
        }
    });
});

function onDeposit(ID, Currency, TotalDeposit, Total) {
    $('#edit-item-id').val(ID);

    var today = new Date();
    startDate = today.toLocaleString("en-US", {timeZone: "America/Phoenix"});
    $('#DepositDate').datepicker('setDate', new Date(startDate));
    $('#DepositAmount').val(0);
    $('#DepositExchangeRate').val(1);
    $('#DepositCurrency').val('USD');
    $('#DepositType').val('Electronic');
    $('#DepositDateInput').val('');
    $('#DepositConvertedAmount').val('');
    $('#DepositReceiptUpload').val('');
    $('#DepositTotalDeposit').html(numberWithCommas(TotalDeposit) + ' ' + Currency);
    $('#DepositRemainingAmount').html(numberWithCommas(Number(Total - TotalDeposit).toFixed(2)) + ' ' + Currency);
    $('#DepositSalesCurrency').html(Currency);
    $('#DepositConcept').val('');

    ShowHideExchangePanel();

    $('#DepositModal').modal('show');
}

$('#DepositCurrency').change(function() {
    ShowHideExchangePanel();
});

function ShowHideExchangePanel(){
    var SalesCurrency = $('#DepositSalesCurrency').html();
    var DepositCurrency = $('#DepositCurrency').val();

    if (SalesCurrency == DepositCurrency) {
        $('#DepositExchangeRate').val('1');
        $('#DepositExchangeRatePanel').hide();
        $('#DepositConvertedAmountPanel').hide();
        CalculateConvertedAmount();
    }
    else {
        showSpinner();
        $.ajax({
            url : base_url + 'Sales/getLastExchangeRate',
            type : 'post',
            async : false,
            cache : false,
            timeout : 30000,
            success : function(res) {
                hiddenSpinner();
                var data = JSON.parse(res);
    
                if (data.success == false) {
                    toastr.error(data.message, 'Machinery Hawkers');
                    return;
                }
    
                $('#DepositExchangeRate').val(data.ExchangeRate);      
                $('#DepositExchangeRatePanel').show();
                $('#DepositConvertedAmountPanel').show();
                CalculateConvertedAmount();
            }
        });   
    }
}

function CalculateConvertedAmount() {
    var Amount = $('#DepositAmount').val();
    var ExchangeRate = $('#DepositExchangeRate').val();

    var SalesCurrency = $('#DepositSalesCurrency').html();    
    
    if (ExchangeRate != 0) {
        var ConvertedAmount = 0;
        if (SalesCurrency == 'MXN')
            ConvertedAmount = Number(Amount) * Number(ExchangeRate);
        else
            ConvertedAmount = Number(Amount) / Number(ExchangeRate);

        ConvertedAmount = Number(ConvertedAmount).toFixed(2);

        $('#DepositConvertedAmount').val(ConvertedAmount);
    }    
}

$('#btnDeposit').click(function() {

    showSpinner();

    console.log($('#DepositDateInput').val());

    var ID = $('#edit-item-id').val();
    $('#DepositProcurementID').val(ID);
    $('#DepositUser').val($('#usernameInput').val());    

    $.ajax({
        url : base_url + 'procurement/deposit',
        type: 'POST',
        data: new FormData(document.getElementById('DepositForm')),
        contentType: false,
        cache: false,
        processData: false,
        dataType: "json",        
        success : function(data) {
            //var data = JSON.parse(res);

            hiddenSpinner();
            if (data.success == false) {
                if (data.message == 'Limited Deposit')
                    toastr.error(LocalizationMessage('Deposit exceeds Remaining Error'));
                else
                    toastr.error(LocalizationMessage('Add Deposit') + ' Error', 'Machinery Hawkers');
                logErrorActivity('Add Deposit', ID, 'tblProcurement', data.message);
                return;
            }

            $('#DepositModal').modal('hide');
            toastr.success(LocalizationMessage('Add Deposit'), 'Machinery Hawkers');
            logSuccessActivity('Add Deposit', ID, 'tblProcurement');
            websocket.send(JSON.stringify({ 'msg': 'sales', 'poster': $('#usernameInput').val() }));
            refreshDatatable();
        }
    });
});

function onDepositHistory(ID, SalesCurrency, TotalDeposit) {

    console.log('Deposit History');
    DepositHistoryID = [];
    history_index = 0;
    Glo_SalesCurrency = SalesCurrency;

    $('#edit-item-id').val(ID);
    $('#DepositLogPrevBtn').prop('disabled', true);
    $('#DepositLogNextBtn').prop('disabled', false);
    $('#DepositTotalDepositEdit').html(Number(TotalDeposit).toFixed(2) + ' ' + SalesCurrency);

    showSpinner();
    $.ajax({
        url : base_url + 'Procurement/getDepositHistoryID',
        type : 'post',
        data : {
            ID : ID
        },
        success : function(res) {
            hiddenSpinner();
            var data = JSON.parse(res);            

            if (data.success == false) {
                toastr.error(data.message, 'Machinery Hawkers');
                return;
            }

            if (data.data.length == 1)
                $('#DepositLogNextBtn').prop('disabled', true);
            DepositHistoryID = data.data;

            showDepositHistory(0);

            $('#DepositHistoryModal').modal('show');
        },
        error : function() {
            toastr.error('Get Deposit Error', 'Machinery Hawkers');
            hiddenSpinner();
        }
    });
}

$('#DepositLogNextBtn').click(function() {
    history_index++;
    if (history_index == DepositHistoryID.length - 1)
        $('#DepositLogNextBtn').prop('disabled', true);    

    $('#DepositLogPrevBtn').prop('disabled', false);
    showDepositHistory(history_index);
});

$('#DepositLogPrevBtn').click(function() {
    history_index--;
    if (history_index == 0)
        $('#DepositLogPrevBtn').prop('disabled', true);
    $('#DepositLogNextBtn').prop('disabled', false);
    showDepositHistory(history_index);
});

function showDepositHistory(index) {
    var DepositID = DepositHistoryID[index].ID;

    showSpinner();

    $.ajax({
        url : base_url + 'Sales/getDepositData',
        type : 'post',
        data : {
            DepositID : DepositID
        },
        success : function(res) {
            hiddenSpinner();            
            var data = JSON.parse(res);

            if (data.success == false) {
                toastr.error(data.message, 'Machinery Hawkers');
                return;
            }           

            data = data.data;            

            var disabled = data.ReceiptPhoto == '' ? "disabled" : "";
            var html =                      
                    '<div><label>' + getLocalizationWord('Deposit Date') + ': </label>&nbsp;<label style="font-weight: bolder;">' + getDatefromDateTime(data.Date) +'</label></div>' +
                    '<div><label>' + getLocalizationWord('Added By') + ': </label>&nbsp;<label style="font-weight: bolder;">' + data.DepositUser + " " + (data.UpdateDate != '0000-00-00 00:00:00' ? getShortDateTime(data.UpdateDate) : "") +'</label></div>' +             
                    '<div><label>' + getLocalizationWord('Amount') + ': </label>&nbsp;<label style="font-weight: bolder;">'+ data.Amount + '</label></div>' + 
                    '<div><label>' + getLocalizationWord('Currency') + ': </label>&nbsp;<label style="font-weight: bolder;">' + data.Currency + '</label></div>' + 
                    '<div><label>' + getLocalizationWord('Exchange Rate') + ': </label>&nbsp;<label style="font-weight: bolder;">' + data.ExchangeRate + '</label></div>' + 
                    '<div><label>' + getLocalizationWord('Converted Amount') + ': </label>&nbsp;<label style="font-weight: bolder;">'+ data.RealAmount + '</label></div>' + 
                    '<div><label>' + getLocalizationWord('Deposit Type') + ': </label>&nbsp;<label style="font-weight: bolder;">'+ getLocalizationWord(data.DepositType) + '</label></div>' + 
                    '<div><label>' + getLocalizationWord('Concept') + ': </label>&nbsp;<label style="font-weight: bolder;">'+ data.Concept +'</label></div>' + 
                    '<div style="text-align: right;">' + 
                        '<button class="btn btn-default" onclick="receiptDownload(\'' + data.ReceiptPhoto + '\', ' + data.ID + ');" '+ disabled + '>' + getLocalizationWord('Download') + '</button>';
                    if ($('#accounting').val() == 'ON' || permission == 'admin')
                        html += '&nbsp;<button class="btn btn-default" onclick="depositEdit(' + data.ID + ');">' + getLocalizationWord('Edit') + '</button>';
                html += '</div>';
            $('.depositHistoryPanel').html(html);
        },
        error : function() {
            toastr.error('Get Deposit Data Eror', 'Machinery Hawkers');
            hiddenSpinner();
        }
    });
}

function receiptDownload(receipt, ID) {    
    var url = base_url + 'assets/images/depositRecipt/' + receipt;    
    var newElement = $("<a href='" + url + "' download='" + receipt + "'>test</a>");
    $(newElement)[0].click();

    var ID = $('#edit-item-id').val();
    toastr.success(LocalizationMessage('Download Deposit Picture'), 'Machinery Hawkers');
    logSuccessActivity('Download Deposit Picture', ID, 'tblSales');
}

function depositEdit(ID) {
    $('#DepositHistoryModal').modal('hide');
    showSpinner();

    $.ajax({
        url : base_url + 'Sales/getDepositData',
        type : 'post',
        data : {
            DepositID : ID
        },
        success : function(res) {

            hiddenSpinner();
            var data = JSON.parse(res);

            if (data.success == false) {
                toastr.error(data.message);
                return;
            }

            data = data.data;

            $('#DepositIDEdit').val(ID);
            $('#DepositUserEdit').val($('#usernameInput').val());
            $('#DepositDateEdit').datepicker('setDate', new Date(data.Date));
            $('#DepositAmountEdit').val(data.Amount);
            $('#DepositExchangeRateEdit').val(data.ExchangeRate);
            $('#DepositCurrencyEdit').val(data.Currency);
            $('#DepositTypeEdit').val(data.DepositType);
            $('#DepositDateInputEdit').val('');
            $('#DepositConvertedAmountEdit').val(data.RealAmount);
            $('#DepositReceiptUploadEdit').val();         

            ShowHideExchangeEditPanel();

            $('#DepositEditModal').modal('show');
        },
        error : function() {
            toastr.error('Get Deposit Data Eror');
            hiddenSpinner();
        }
    });
}

$('#btnDepositEdit').click(function() {

    showSpinner();        

    var ID = $('#edit-item-id').val();

    $.ajax({
        url : base_url + 'Procurement/depositEdit',
        type : 'post',
        type: 'POST',
        data: new FormData(document.getElementById('DepositEditForm')),
        contentType: false,
        cache: false,
        processData: false,
        dataType: "json",        
        success : function(data) {
            //var data = JSON.parse(res);

            hiddenSpinner();
            if (data.success == false) {
                toastr.error(LocalizationMessage('Edit Deposit') + ' Error', 'Machinery Hawkers');
                logErrorActivity('Edit Deposit', ID, 'tblSales', data.message);
                return;
            }

            toastr.success(LocalizationMessage('Edit Deposit'), 'Machinery Hawkers');
            logSuccessActivity('Edit Deposit', ID, 'tblSales');
            websocket.send(JSON.stringify({ 'msg': 'sales', 'poster': $('#usernameInput').val() }));

            var SalesID = $('#edit-item-id').val();
            $('#DepositEditModal').modal('hide');
            $('#DepositHistoryModal').modal('show');

            updateTotalDepositForSale(SalesID);
            showDepositHistory(history_index);
            refreshDatatable();
        }
    })
});

function ShowHideExchangeEditPanel(){
    var DepositCurrency = $('#DepositCurrencyEdit').val();

    if (Glo_SalesCurrency == DepositCurrency) {
        $('#DepositExchangeRateEdit').val('1');
        $('#DepositExchangeRatePanelEdit').hide();
        $('#DepositConvertedAmountPanelEdit').hide();
        CalculateConvertedAmountEdit();
    }
    else {
        showSpinner();
        $.ajax({
            url : base_url + 'Sales/getLastExchangeRate',
            type : 'post',
            async : false,
            cache : false,
            timeout : 30000,
            success : function(res) {
                hiddenSpinner();
                var data = JSON.parse(res);
    
                if (data.success == false) {
                    toastr.error(data.message);
                    return;
                }
    
                $('#DepositExchangeRateEdit').val(data.ExchangeRate);      
                $('#DepositExchangeRatePanelEdit').show();
                $('#DepositConvertedAmountPanelEdit').show();
                CalculateConvertedAmountEdit();
            }
        });   
    }
}

$('#DepositCurrencyEdit').change(function() {
    ShowHideExchangeEditPanel();
});


function updateTotalDepositForSale(SalesID)
{
    showSpinner();
    $.ajax({
        url : base_url + 'Procurement/getTotalDeposit',
        type : 'post',
        data : {
            ID : SalesID
        },
        success : function(res) {
            hiddenSpinner();
            var data = JSON.parse(res);

            if (data.success == false) {
                return;
            }

            $('#DepositTotalDepositEdit').html(data.TotalDeposit + ' ' +  Glo_SalesCurrency);
        }
    })
}

function CalculateConvertedAmountEdit() {
    var Amount = $('#DepositAmountEdit').val();
    var ExchangeRate = $('#DepositExchangeRateEdit').val();
    
    if (ExchangeRate != 0) {
        var ConvertedAmount = 0;
        console.log(Glo_SalesCurrency);
        if (Glo_SalesCurrency == 'MXN')
            ConvertedAmount = Number(Amount) * Number(ExchangeRate);
        else
            ConvertedAmount = Number(Amount) / Number(ExchangeRate);

        ConvertedAmount = Number(ConvertedAmount).toFixed(2);

        $('#DepositConvertedAmountEdit').val(ConvertedAmount);
    }
}

function onDocuments(ID) {
    $('#edit-item-id').val(ID);
    $('#DocumentProcurementID').val(ID);
    showSpinner();

    $.ajax({
        url: base_url + 'Procurement/getDocuments',
        type: 'post',
        data: {
            ID: ID
        },
        success: function(res) {
            hiddenSpinner();
            var data = JSON.parse(res);

            var documents = data.documents;
            var html = '';

            for (var i = 0; i < documents.length; i++) {
                html += "<div class='document'>" + 
                            "<div class='title'>" + 
                                documents[i].Title+
                            "</div>" + 
                            "<div class='action'>" + 
                                "<a class='btn btn-default' href='" + base_url + "assets/doc/" + documents[i].Attach + "' target='blank'><i class='icon-cloud-download'></i></a>" + 
                                "&nbsp;<a class='btn btn-default' href='javascript:deleteDocument(" + documents[i].ID +")'><i class='icon-trash'></i></a>" + 
                            "</div>" + 
                        "</div>";
            }

            if (documents.length == 0)
                html = 'No Documents Now';

            $('#DocumentTitle').val('');
            $('#DocumentAttach').val('');

            $('#DocumentPanel').html(html);
            $('#DocumentModal').modal('show');
        }
    });
}

$('#DocumentUpload').click(function() {
    if (!$('#DocumentForm').valid())
        return;

    var ID = $('#edit-item-id').val();

    $.ajax({
        url: base_url + 'Procurement/uploadDocument',        
        type: 'POST',
        data: new FormData(document.getElementById('DocumentForm')),
        contentType: false,
        cache: false,
        processData: false,
        dataType: "json",        
        success : function(data) {
            if (data.success == true){
                toastr.success("Upload Document", 'Machinery Hawkers');                
                onDocuments(ID);
            }
            else {
                toastr.warning(data.message, 'Machinery Hawkers');                
            }
        }
    })
});

function deleteDocument(ID) {
    var result = confirm("Do you want to delete this document?");
    var procurementID = $('#edit-item-id').val();
    
    if (result == true) {
        showSpinner();
        $.ajax({
            url: base_url + 'Procurement/deleteDocument',
            type: 'post',
            data: {
                ID : ID
            },
            success: function(res) {
                hiddenSpinner();
                var data = JSON.parse(res);

                if (data.success == true) {
                    toastr.success("Delete Document", "Machinery Hawkers");
                    onDocuments(procurementID);
                    return;
                }
                toastr.warning("Delete Document", "Machinery Hawkers");
            },
            error: function(err) {
                hiddenSpinner();
                toastr.error("Delet Document", 'Machinery Hawkers');
            }
        })
    }
}


function onInventory(DealID) {
    showSpinner();

    $.ajax({
        url: base_url + 'Procurement/convertToInventory',
        type: 'post',
        data: {
            DealID: DealID
        },
        success: function(res) {
            hiddenSpinner();
            var data = JSON.parse(res);

            if (data.success == false) {
                toastr.error('Make Inventory Error', 'Machinery Hawkers');
                logErrorActivity('Make Inventory', DealID, 'tblDeals', 'Make Inventory Error');
                return;
            }
            toastr.success('Make Inventory', 'Machnery Hunters Platform');
            logSuccessActivity('Make Inventory', DealID, 'tblDeals');
            refreshDatatable(false);
        }
    });
}

$('#excelbtn').click(function () {
    var d = new Date();

    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    exportTableToExcel('Procurement'+ year + month + day);
});

function exportTableToExcel( filename = '') {

    showSpinner();

    $.ajax({
        url: base_url + 'Procurement/getDataForExcel',
        type: 'POST',
        data:  {       
            minPrice: $('#minPriceInput').val(),
            maxPrice: $('#maxPriceInput').val(),
            minRemaining: $('#minRemainingInput').val(),
            maxRemaining: $('#maxRemainingInput').val(),
            status : $('#inputStatus').val(),                      
            minStartDate : $('#minStartDateInput').val(),
            maxStartDate : $('#maxStartDateInput').val(),
            searchText : getTranslatedWordForSearch($('#searchInput').val())
        },
        success: function (result) {

            hiddenSpinner();         

            var downloadLink;
            var csv = [];

            for (var i = 0; i < result.length; i++) {
                var row = [];

                var cols = result[i];

                for (var j = 0; j < cols.length; j++) {
                    if (i > 0 && j == cols.length -1)
                        break;                  
                    
                    if (cols[j] != null)
                        row.push('"'+cols[j].trim() + '"');
                    else
                        row.push('""')
                }
                if (i > 0) {
                    var length = cols.length;
                    row.push('"' + (Number(cols[length - 1]) - Number(cols[length - 2])) + '"');
                }
                
                csv.push(row.join(','));
            }

            console.log(csv);
            var csvText = csv.join('\n');

            var csvFile = new Blob(["\ufeff" + csvText], { type: 'type: "text/csv;charset=UTF-8"' });

            //specify filename
            filename = filename ? filename + '.csv' : 'excel_data.csv';

            //create download link element  
            var downloadLink = $("<a href=''  download=''>excel</a>");

            $(downloadLink).prop('href', window.URL.createObjectURL(csvFile));
            $(downloadLink).prop('download', filename);
            $(downloadLink)[0].click();

            logSuccessActivity('Excel Extraction', 0, '');
        }

    });

}


function getActiveBuys() {
    $.ajax({
        url: base_url + 'Procurement/getActiveBuyStatus',
        type: 'post',
        success: function(res) {
            var data = JSON.parse(res);

            $('#ActiveBuyCount').html(data.Total); 
            $('#TodayActiveBuyCount').html(data.Today);
            $('#LastSevenActiveBuyCount').html(data.Seven);
            $('#LastThirtyActiveBuyCount').html(data.Thirty);
        }
    });
}


function getRemainingDeposits() {
    $.ajax({
        url: base_url + 'Procurement/getRemainingDepositStatus',
        type: 'post',
        success: function(res) {
            var data =  JSON.parse(res);

            
            $('#RemainingDepositsCount').html(data.Count);
            $('#RemainingUSDAmount').html(numberWithCommas(data.USD) + ' USD');
            $('#RemainingMXNAmount').html(numberWithCommas(data.MXN) + ' MXN');
        }
    })
}

function logSuccessActivity(Activity, ID, Table) {
    $.ajax({
        url : base_url + 'Activity/addActivity',
        type : 'post',
        data : {
            Activity : Activity,
            ObjectiveTable : Table,
            ObjectiveID : ID,
            Webpage : 'Deals.Procurement',
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
            Webpage : 'Deals.Procurement',
            Status : 'Error',
            Error : ErrorMsg
        },
        success : function() {
            websocket.send(JSON.stringify({ 'msg': 'activity', 'poster': $('#usernameInput').val() }));
        }
    });
}
