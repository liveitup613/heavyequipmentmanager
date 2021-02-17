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


// Sales Column Data
var columnData = [
    {
        "title": "",
        sortable: false,    
        "render": function (data, type, full, meta) {   
            var salesLog = '';
            var depositLog = '';
            var dealInfo = '';
            var incentive = '';
            var buyingInfo = '';
            var deposit = '';
            var btnCustomerInvoice = '';
            var changeDealStatus = '';
            var btnClose = '';
            var edit = '';
            var btnDelete = '';
            var btnCancel = '';
            var btnChangeSalesRep = '';
            var bntProcurement = '<button  class="col-lg-4 btn btn-sm btn-default btn-action"  data-toggle="tooltip" data-placement="top" title="' + getLocalizationWord('Buy') + '" onclick="onProcurement(' + full.DealID + ')"><i class="icon-basket"></i></button>'
            var btnDocs = '<button  class="col-lg-4 btn btn-sm btn-default btn-action"  data-toggle="tooltip" data-placement="top" title="' + getLocalizationWord('Documents') + '" onclick="onDocuments(' + full.ID + ')"><i class="icon-docs"></i></button>';
            var btnPrint = '<button  class="col-lg-4 btn btn-sm btn-default btn-action"  data-toggle="tooltip" data-placement="top" title="' + getLocalizationWord('Sale Document') + '" onclick="onDocumentPrint(' + full.ID + ')"><i class="icon-printer"></i></button>';
            if ($('#permission').html() == 'admin' || $('#accounting').val() == 'ON')
                btnChangeSalesRep = '<button  class="col-lg-4 btn btn-sm btn-default btn-action"  data-toggle="tooltip" data-placement="top" title="' + getLocalizationWord('Change Sales Rep') + '" onclick="onChangeSalesRep(' + full.ID + ')"><i class="icon-user"></i></button>';            
            salesLog = '<button  class="col-lg-4 btn btn-sm btn-default btn-action"  data-toggle="tooltip" data-placement="top" title="' + getLocalizationWord('Sales Log') + '" onclick="onSalesLog(' + full.ID +')"><i class="icon-notebook"></i></button>';            
            depositLog = '<button  class="col-lg-4 btn btn-sm btn-default btn-action"  data-toggle="tooltip" data-placement="top" title="' + getLocalizationWord('Deposit History') + '" onclick="onDepositHistory(' + full.ID +', \'' + full.SalesCurrency + '\', ' + full.TotalDeposit + ')"><i class="icon-calculator"></i></button>';
            btnCustomerInvoice = '<button  class="col-lg-4 btn btn-sm btn-default btn-action"  data-toggle="tooltip" data-placement="top" title="' + getLocalizationWord('Edit Customer Invoice Information') + '" onclick="onCustomerInvoiceData(' + full.CustomerID + ')"><i class="icon-users"></i></button>';
            
            if (full.DealID != 0) 
                dealInfo = '<button  class="col-lg-4 btn btn-sm btn-default btn-action"  data-toggle="tooltip" data-placement="top" title="' + getLocalizationWord('Deal Info') + '" onclick="onDealInfo(' + full.ID +')"><i class="icon-info"></i></button>';            
            else
                dealInfo = '<button  class="col-lg-4 btn btn-sm btn-default btn-action"  data-toggle="tooltip" data-placement="top" title="' + getLocalizationWord('Deal Info') + '" onclick="onOppInfo(' + full.OppID+')"><i class="icon-info"></i></button>';            

            // if (full.DealStatus != '' && full.DealStatus != 'Pending' && full.DealStatus != 'Closed')
            //     incentive = '<button  class="col-lg-4 btn btn-sm btn-default btn-action"  data-toggle="tooltip" data-placement="top" title="' + getLocalizationWord('Incentives') + '" onclick="onIncentives(' + full.ID + ')"><i class="fa fa-dollar"></i></button>';            

            // if ($('#permission').html() == 'admin' || $('#accounting').val() == 'ON')
            // {
            //     if (full.DealStatus != '' && full.DealStatus != 'Pending' && full.DealStatus != 'Closed')
            //         buyingInfo = '<button  class="col-lg-4 btn btn-sm btn-default btn-action"  data-toggle="tooltip" data-placement="top" title="' + getLocalizationWord('Buying Information') + '" onclick="OnBuyingInfo(' + full.ID+')"><i class="icon-like"></i></button>';                                        
            // }

            if (full.TruckStatus == 'PendingProcurement' || full.DealType == 'Inventory')
                bntProcurement = '';

            if (full.DealType == 'Manufacturing' || full.DealType == 'Logistics' || full.DealID == 0 || full.DealType == 'Inventory')
                bntProcurement = '';

            if (full.DealType == 'Auction') {
                var today = new Date();                
                startDate = today.toLocaleString("en-US", {timeZone: "America/Phoenix"});
                startDate = new Date(startDate);               
                var startFormatedDate = formatDate(startDate);    
                
                console.log(startFormatedDate);

                if (startFormatedDate < full.EndDate)
                    bntProcurement = '';
            }

            if (full.SalesStatus != 'New')
                changeDealStatus = '<button  class="col-lg-4 btn btn-sm btn-default btn-action"  data-toggle="tooltip" data-placement="top" title="' + getLocalizationWord('Change Deal Status') + '" onclick="onChangeDealStatus(' + full.ID +', \'' + full.DealStatus + '\')"><i class="icon-settings"></i></button>';
                 
            if (full.SalesStatus == 'New')
                btnCancel = '<button  class="col-lg-4 btn btn-sm btn-default btn-action"  data-toggle="tooltip" data-placement="top" title="' + getLocalizationWord('Cancel Sale') + '" onclick="onCancel(' + full.ID +',)"><i class="icon-action-undo"></i></button>';            

            if (full.SalesStatus == 'Canceled' && full.TotalDeposit == 0)
                btnDelete = '<button  class="col-lg-4 btn btn-sm btn-default btn-action"  data-toggle="tooltip" data-placement="top" title="' + getLocalizationWord('Delete') + '" onclick="onDeleteSale(' + full.ID +')"><i class="icon-trash"></i></button>';

            var rounded_total = Number(full.Total).toFixed(2);
            var total_deposit = Number(full.TotalDeposit).toFixed(2);
            var percentage = Number(full.TotalDeposit / full.Total * 100);
            if ((rounded_total == 0 || rounded_total != full.TotalDeposit) && ($('#permission').html() == 'admin' || $('#accounting').val() == 'ON')) 
                deposit = '<button  class="col-lg-4 btn btn-sm btn-default btn-action"  data-toggle="tooltip" data-placement="top" title="' + getLocalizationWord('Deposit') + '" onclick="onDeposit(' + full.ID +', \'' + full.SalesCurrency + '\', ' + full.TotalDeposit + ', ' + rounded_total + ')"><i class="icon-wallet"></i></button>';

            if (full.DealStatus == 'Ready' && percentage >= 90) {
                    btnClose = '<button  class="col-lg-4 btn btn-sm btn-default btn-action"  data-toggle="tooltip" data-placement="top" title="' + getLocalizationWord('Close') + '" onclick="onClose(' + full.ID+')"><i class="icon-close"></i></button>';            
                }
                
            if (full.SalesStatus == 'In Progress' && full.DealStatus != 'Ready') 
                edit = '<button  class="col-lg-4 btn btn-sm btn-default btn-action"  data-toggle="tooltip" data-placement="top" title="' + getLocalizationWord('Edit Price') + '" onclick="onEditPrice(' + full.ID +')"><i class="icon-note"></i></button>';            

            if (full.SalesStatus == 'Closed' || full.SalesStatus == 'Canceled') {
                edit = '';
                changeDealStatus = '';
                deposit = '';
                btnClose = '';
            }

            return  '<div class="row" style = "width : 120px;">' + 
                    dealInfo + btnChangeSalesRep + edit + deposit + changeDealStatus + buyingInfo + salesLog + depositLog + btnCancel + incentive + btnCustomerInvoice + btnClose + btnDelete + bntProcurement + btnDocs + btnPrint + 
                    '</div>';
        }
    }, {
        'title' : 'Status',
        sortable : false,
        'render' : function(data, type, full, meta) {
            var SalesCode = full.SalesCode + '<br>';
            var SalesRep = full.SalesRep + '<br>';
            var DateAdded = getLocalizationWord('Start') + ': ' + getSecondRemovedDateTime(full.DateAdded) + '<br>';
            var SalesStatus = getLocalizationWord('Status') + ': ' + getLocalizationWord(full.SalesStatus) + '<br>';
            var DealsStatus = '';
            var LastUpdateDate = '';

            if (full.DealStatus != '')
                DealsStatus = getLocalizationWord('Deal Status') + ': ' + getBadgetForEachStatusOnSale(full.DealStatus) + '<br>';

            if (full.SalesStatus != 'New')
                LastUpdateDate = getLocalizationWord('Last Update') + ': ' + getSecondRemovedDateTime(full.LastUpdateDate) + '<br>';
            var ContactDate = '';            
            if (full.ContactDate != '') {
                var today = new Date();
                startDate = today.toLocaleString("en-US", {timeZone: "America/Phoenix"});
                startDate = new Date(startDate);
                endDate = new Date();
                endDate.setDate(startDate.getDate() + 2);
                var startFormatedDate = formatDate(startDate);
                var endFormatDate = formatDate(endDate);                

                if (startFormatedDate <= full.ContactDate && full.ContactDate <= endFormatDate)
                    ContactDate = getLocalizationWord('Contact') + ': <span class="badge badge-warning" style="margin-left : 0px;">' + full.ContactDate + '</span>';
                else
                    ContactDate = getLocalizationWord('Contact') + ': ' + full.ContactDate;
            }
                
            return SalesCode + SalesRep + DateAdded + SalesStatus + LastUpdateDate + DealsStatus + ContactDate;
        }
    }, {
        "title": getLocalizationWord("Client Info"),
        sortable: false,
        "render": function (data, type, full, meta) {

            return  '<div class="row" style = "width : 250px; white-space:break-spaces; padding-left:8px;">' + 
                        full.Name + ' ' + full.LastName +  '<br>' + 
                        getCheckedValue(getStyledPhoneNumber(full.Phone))+ 
                        getCheckedValue(full.CompanyName) + 
                        getCheckedValue(full.RFC) + 
                        getCheckedValue(full.Source) +
                    '</div>';
        }
    }, {
        "title": getLocalizationWord("Deposit Info"),
        sortable: false,
        "render": function (data, type, full, meta) {

            if (full.TotalDeposit != 0) {
                var TotalDeposit = getLocalizationWord("Deposits") + ": " + numberWithCommas(Number(full.TotalDeposit).toFixed(2)) + ' ' + full.SalesCurrency + '<br>';
                var Remain = '';
                var percentage = '';

                if (full.Total != 0 && full.DealID != 0) {
                    Remain = getLocalizationWord("Remaining") + ": " + numberWithCommas(Number(full.Total - full.TotalDeposit).toFixed(2)) + ' ' + full.SalesCurrency + '<br>';
                    percentage = Number(full.TotalDeposit / full.Total * 100).toFixed(2) + '%';   
                }

                return TotalDeposit + Remain + percentage;
                
            }
            return getLocalizationWord('No Deposit');
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
        'title' : getLocalizationWord('Deal Info'),
        sortable : false,
        render : function (data, type, full, meta) {
            if (full.DealID == 0) 
                return '';
            
            if (full.DealType == 'Manufacturing') {
                var DealType = getBadgetForDealType(full.DealType) + '<br>';
                var EqCategory = getCheckedValue(full.EquipmentCategory);
                var Capacity = getCheckedValue(full.ManuCapacity);
                var TruckMake = getCheckedValue(full.ManuTruckMake);
                var TruckYear = getCheckedValue(full.ManuTruckYear);

                return DealType + EqCategory + Capacity + TruckMake + TruckYear;
            }
            else if (full.DealType == 'Logistics') {
                var DealType = getBadgetForDealType(full.DealType) + '<br>';
                var EqCategory = getCheckedValue(full.LogiEqCategory);
                var PickUp = (full.PickUpCity == '' ? '' : full.PickUpCity + ', ') +
                            (full.PickUpState == '' ? '' : full.PickUpState + ', ') + 
                            full.PickUpCountry;
                            
                var Final = (full.FinalCity == '' ? '' : full.FinalCity + ', ') +
                            (full.FinalState == '' ? '' : full.FinalState + ', ') + 
                            full.FinalCountry;
                            
                return DealType + EqCategory + PickUp + '<br>' + Final;
            }
            else {
                var Title = getCheckedValue(getTitleFromDatabase(full));
                var DealType = getBadgetForDealType(full.DealType) + '<br>';
                var SN = '';
                var EndDate = '';     
                var User = full.USERNAME;           

                
                SN = full.DealCode + '<br>';

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
                        EndDate = '<span class="badge badge-warning">' + EndDate + '</span><br>';

                }

                return DealType + Title + EndDate + SN + User;
            }       
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
            var buyingUser = '';
            var subTotal = '';
            var procurementStatus = '';

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
            
            if (full.BuyingPrice != null && full.BuyingPrice != 0)
                buyingAmount = getLocalizationWord('Buying Amount') + ': ' + numberWithCommas(Number(full.BuyingPrice)) + ' ' + full.SalesCurrency + '<br>';
            
            if (full.Buyer != null && full.Buyer != '')
                buyingUser = getLocalizationWord('Buying User') + ': ' + full.Buyer + '<br>';

            if (full.ProcurementStatus != null)
                procurementStatus = getBadgetForEachStatusOnProcurement(full.ProcurementStatus);

            return price + buyPremium + shipping + customs + comm + discount + taxP + subTotal + shop + extras + total + buyingAmount + buyingUser + procurementStatus;
        }
    }
];

$(function () {

    getMonthlySalesStatus();
    getActiveSalesStatus();
    getReadySalesStatus();
    getNoDealSalesStatus();

    $('.loading-box').css('width', $(window).width());
    $('.loading-box').css('height', $(window).height());

    $('.socket-loading-box').css('width', $(window).width());
    $('.socket-loading-box').css('height', $(window).height());

    $('.progress-box-layer').css('width', $(window).width());
    $('.progress-box-layer').css('height', $(window).height());
    

    $('.socket-loading-btn').click(function () {
        hiddenSocketLoadingSpinner();
        refreshDatatable();
    })

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
        
        if (msg == 'sales')
        {
            getMonthlySalesStatus();
            getActiveSalesStatus();
            getReadySalesStatus();
            getNoDealSalesStatus();

            refreshDatatable(false);
        }
    }

    renderTB();

    $('#minAucYearInput').datepicker({
        startDate: new Date()
    }).on('changeDate', function (selected) {
        var startDate = new Date(selected.date.valueOf());
        var endDate = new Date($('#maxAucYearInput').val());
        if (startDate.getTime() > endDate.getTime()) {

            $('#maxAucYearInput').datepicker('setDate', startDate);
        }
        $('#maxAucYearInput').datepicker('setStartDate', startDate);
    });

    $('#minAucYearInput').datepicker('setStartDate', new Date);
    $('#maxAucYearInput').datepicker('setStartDate', new Date);

    $('#minStartDateInput').datepicker().on('changeDate', function (selected) {
        var startDate = new Date(selected.date.valueOf());
        var endDate = new Date($('#maxStartDateInput').val());
        if (startDate.getTime() > endDate.getTime()) {

            $('#maxStartDateInput').datepicker('setDate', startDate);
        }
        $('#maxStartDateInput').datepicker('setStartDate', startDate);
    });  

    var categoryValue = $('#inputEqCategory').html();
    categoryValue += get_translated_equipment_category_element();
    $('#inputEqCategory').html(categoryValue);

    var today = new Date();
    $('#ContactDate').datepicker('setStartDate', today);    

    $('#DepositDate').datepicker().on('changeDate', function(selected) {
        console.log(selected.date.valueOf());
        var selectedDate = new Date(selected.date.valueOf());
        $('#DepositDateInput').val(formatDate(selectedDate) + ' 00:00:00');
    });

    $.ajax({
        url : base_url + 'User/getAllUserName',
        type : 'post',
        success : function(data) {
            result = JSON.parse(data);
           
            var all_assigned = "<option value='All'>All</option>";
            var assigned = '';
            var buyers = "<option value=''></option>";
            for (var i = 0; i < result.length ; i++) {              
                if (result[i].SALESREP == 'ON')  {
                    all_assigned += '<option value="' + result[i].USERNAME +'">' + result[i].USERNAME + '</option>';
                    assigned += '<option value="' + result[i].USERNAME +'">' + result[i].USERNAME + '</option>';
                }
                buyers += '<option value="' + result[i].USERNAME +'">' + result[i].USERNAME + '</option>';
            }
            $('#inputSalesRep').html(all_assigned);
            $('#SalesRep').html(assigned);
            $('#BuyingUser').html(buyers);
        }
    });   

    $('#Estado').html(get_state_options_elements('Mexico'));
});

function renderTB() {
    managementTB = $('#lead-management-table').DataTable({
        'processing': true,
        'serverSide': true,
        'ajax': {
            url: base_url + 'Sales/getSalesData',
            type: 'POST',
            data: function (d) {      
                d.user = $('#inputSalesRep').val();
                d.status = $('#inputStatus').val();               
                d.dealStatus = $('#inputDealStatus').val();
                d.dealType = $('#inputDealTypeFilter').val();
                d.minStartDate = $('#minStartDateInput').val();
                d.maxStartDate = $('#maxStartDateInput').val();
                d.minPrice = $('#minPriceInput').val();
                d.maxPrice = $('#maxPriceInput').val();
                d.minRemaining = $('#minRemainingInput').val();
                d.maxRemaining = $('#maxRemainingInput').val();
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
    console.log('refresh');
    if (refresh == false)
        managementTB.ajax.reload(null, false);
    else
        managementTB.ajax.reload();
}
function onChangeCategory() {
    Glo_Category = $('#inputEqCategory').val();

    $('#minYearInput').val('');
    $('#maxYearInput').val('');

    $('#minAucYearInput').val('');
    $('#maxAucYearInput').val('');

    $('#minTotalInput').val('');
    $('#maxTotalInput').val('');

    $('#minLiftCapacity').val('');
    $('#maxLiftCapacity').val('');

    if (has_capacity_field(Glo_Category)) {
        $('.lift-capacity').css('display', 'flex');
    } else {
        // $('.lift-capacity').css('display', 'none');
    }

    managementTB.ajax.reload();  
}

function has_capacity_field(category) {
    var len = Special_field_array.length;
    for (var i = 0; i < len; i++) {
        var element = Special_field_array[i];
        if (element.category == category) {

            var check = false;

            for (var k = 0; k < element.equip_info_fields.length; k++) {
                if (element.equip_info_fields[k] == 'Capacity') {
                    check = true;
                }
            }
            return check;
        }
    }
}

////////////////////////////////////////////////////////////////////////
///////////////////////// Action Buttons ///////////////////////////////
////////////////////////////////////////////////////////////////////////

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}

function onDealInfo(ID) {
    showSpinner();
    $('#DealInfoTitle').html(getLocalizationWord('Deal Info'));    

    $.ajax({
        url : base_url + 'Sales/getDealDetail',
        type : 'post',
        data : {
            ID : ID
        },
        success : function(res) {
            hiddenSpinner();
            var data = JSON.parse(res);

            if (data.success == false) {
                toastr.error(data.message);
                return;
            }

            var DealType = data.DealType;
            var full = data.data;

            if (DealType == 'Manufacturing') {
                var html = '';

                if (full.EquipmentCategory)
                    html += '<span class="item-info-index">' + getLocalizationWord('Equipment Category') + ':&nbsp </span><span class="item-info-content">' + full.EquipmentCategory + '</span><br>';                    
                
                if (full.Capacity)
                    html += '<span class="item-info-index">' + getLocalizationWord('Capacity') + ':&nbsp </span><span class="item-info-content">' + full.Capacity + '</span><br>';                                        
                
                if (full.TruckMake)
                    html += '<span class="item-info-index">' + getLocalizationWord('Truck Make') + ':&nbsp </span><span class="item-info-content">' + full.TruckMake + '</span><br>';                 
                    
                if (full.TruckModel)
                    html += '<span class="item-info-index">' + getLocalizationWord('Truck Model') + ':&nbsp </span><span class="item-info-content">' + full.TruckModel + '</span><br>';                   
                
                if (full.TruckYear)
                    html += '<span class="item-info-index">' + getLocalizationWord('Truck Year') + ':&nbsp </span><span class="item-info-content">' + full.TruckYear + '</span><br>';                 
                
                if (full.TruckEngine)
                    html += '<span class="item-info-index">' + getLocalizationWord('Truck Engine') + ':&nbsp </span><span class="item-info-content">' + full.TruckEngine + '</span><br>';             
                
                if (full.TruckTrans)
                    html += '<span class="item-info-index">' + getLocalizationWord('Truck Transmission') + ':&nbsp </span><span class="item-info-content">' + full.TruckTrans + '</span><br>';        

                if (full.wtType)
                    html += '<span class="item-info-index">' + getLocalizationWord('Water Truck Type') + ':&nbsp </span><span class="item-info-content">' + full.wtType + '</span><br>';                    
                   

                $('#DealInfoContent').html(html);
            }
            else if (DealType == 'Logistics') {
                var html = '';
                if (full.EqCategory) 
                    html += '<span class="item-info-index">' + getLocalizationWord('Equipment Category') + ':&nbsp </span><span class="item-info-content">' + full.EqCategory + '</span><br>';
                if (full.EqSN)
                    html += '<span class="item-info-index">' + getLocalizationWord('Serial Number') + ':&nbsp </span><span class="item-info-content">' + full.EqSN + '</span><br>';
                var PickUp = (full.PickUpCity == '' ? '' : full.PickUpCity + ', ') +
                            (full.PickUpState == '' ? '' : full.PickUpState + ', ') + 
                            full.PickUpCountry;
                        
                var Final = (full.FinalCity == '' ? '' : full.FinalCity + ', ') +
                            (full.FinalState == '' ? '' : full.FinalState + ', ') + 
                            full.FinalCountry;

                html += '<span class="item-info-index">' + getLocalizationWord('PickUp Location') + ':&nbsp </span><span class="item-info-content">' + PickUp + '</span><br>';
                html += '<span class="item-info-index">' + getLocalizationWord('Final Location') + ':&nbsp </span><span class="item-info-content">' + Final + '</span><br>';

                if (full.EqYear != '0')
                    html += '<span class="item-info-index">' + getLocalizationWord('Equipment Year') + ':&nbsp </span><span class="item-info-content">' + full.EqYear + '</span><br>';

                if (full.EqMake)
                    html += '<span class="item-info-index">' + getLocalizationWord('Equipment Manufacturer') + ':&nbsp </span><span class="item-info-content">' + full.EqMake + '</span><br>';

                if (full.EqModel)
                    html += '<span class="item-info-index">' + getLocalizationWord('Equipment Model') + ':&nbsp </span><span class="item-info-content">' + full.EqModel + '</span><br>';

                if (full.TruckYear != '0')
                    html += '<span class="item-info-index">' + getLocalizationWord('Truck Year') + ':&nbsp </span><span class="item-info-content">' + full.TruckYear + '</span><br>';

                if (full.TruckMake)
                    html += '<span class="item-info-index">' + getLocalizationWord('Truck Make') + ':&nbsp </span><span class="item-info-content">' + full.TruckMake + '</span><br>';

                if (full.TruckModel)
                    html += '<span class="item-info-index">' + getLocalizationWord('Truck Model') + ':&nbsp </span><span class="item-info-content">' + full.TruckModel + '</span><br>';

                if (full.TruckCondition)
                    html += '<span class="item-info-index">' + getLocalizationWord('Truck Condition') + ':&nbsp </span><span class="item-info-content">' + full.TruckCondition + ' ' + full.TruckConditionUnit + '</span><br>';

                $('#DealInfoContent').html(html);
            }
            else {
                var capacity = '';            

                if (parseFloat(full.Capacity)) {

                    var unit = '';
                    for (var i = 0 ; i < Special_field_array.length; i++) {
                        if (full.EqCategory == Special_field_array[i].category) {
                            unit = Special_field_array[i].unit.Capacity;
                            break;
                        }
                    }
                    html += '<span class="item-info-index">' + getLocalizationWord('Capacity') + ':&nbsp </span><span class="item-info-content">' + full.Capacity + ' ' + getLocalizationWord(unit) + '</span><br>';                                   
                }

                var length = '';
                if (parseFloat(full.Length)) {
                    length = '<span class="item-info-index">' + getLocalizationWord('Length') + ':&nbsp </span><span class="item-info-content">' + full.Length + '</span><br>';                    
                }

                var hour = '';
                if (parseFloat(full.Hours)) {
                    hour = '<span class="item-info-index">' + getLocalizationWord('Hour') + ':&nbsp </span><span class="item-info-content">' + full.Hours + '</span><br>';                    
                }

                var type = '';
                if (full.Type) {
                    type = '<span class="item-info-index">' + getLocalizationWord('Type') + ':&nbsp </span><span class="item-info-content">' + full.Type + '</span><br>';                    
                }

                var cab = '';
                if (parseInt(full.Cab)) {
                    cab = '<span class="item-info-content">' + (full.Cab == 1 ? '' : getLocalizationWord('Cabin')) + '</span><br>';
                    
                }

                var wd = '';
                if (parseInt(full['4WD'])) {
                    wd = '<span class="item-info-content">' + (full['4WD'] == 1 ? '' : getLocalizationWord('4WD')) + '</span><br>';                    
                }

                var ext = '';
                if (parseInt(full.Ext)) {
                    ext = '<span class="item-info-content">' + (full.Ext == 1 ? '' : getLocalizationWord('Extendahoe')) + '</span><br>';                    
                }

                var auxHyd = '';
                if (parseInt(full.AuxHyd)) {
                    auxHyd = '<span class="item-info-content">' + (full.AuxHyd == 1 ? '' : getLocalizationWord('AuxHyd')) + '</span><br>';                    
                }

                var ripper = '';
                if (parseInt(full.Ripper)) {
                    ripper += '<span class="item-info-content">' + (full.Ripper == 1 ? '' : getLocalizationWord('Ripper')) + '</span><br>';                    
                }

                var html =  capacity + length + hour + type + cab + wd + ext + auxHyd + ripper;

                var truckYear = '';
                if (parseInt(full.TruckYear)) {
                    truckYear = '<span class="item-info-index">' + getLocalizationWord('Truck Year') + ':&nbsp </span><span class="item-info-content">' + full.TruckYear + '</span><br>';                    
                }

                var truckMake = '';
                if (full.TruckMake) {
                    truckMake = '<span class="item-info-index">' + getLocalizationWord('Truck Make') + ':&nbsp </span><span class="item-info-content">' + full.TruckMake + '</span><br>';                    
                }

                var truckModel = '';
                if (full.TruckModel) {
                    truckModel = '<span class="item-info-index">' + getLocalizationWord('Truck Model') + ':&nbsp </span><span class="item-info-content">' + full.TruckModel + '</span><br>';             
                }

                var engine = '';
                if (full.Engine) {
                    engine = '<span class="item-info-index">' + getLocalizationWord('Truck Engine') + ':&nbsp </span><span class="item-info-content">' + full.Engine + '</span><br>';                    
                }

                var truckTrans = '';
                if (full.TruckTrans) {
                    truckTrans = '<span class="item-info-index">' + getLocalizationWord('Truck Transmission') + ':&nbsp </span><span class="item-info-content">' + full.TruckTrans + '</span><br>';                    
                }

                var suspension = '';
                if (full.Suspension) {
                    suspension = '<span class="item-info-index">' + getLocalizationWord('Suspension') + ':&nbsp </span><span class="item-info-content">' + full.Suspension + '</span><br>';                                        
                }

                var truckCondition = '';
                if (full.TruckCondition) {
                    truckCondition = '<span class="item-info-index">' + getLocalizationWord('Condition') + ':&nbsp </span><span class="item-info-content">' + full.TruckCondition + '</span><br>';                                        
                }
                html += truckYear + truckMake + truckModel + engine + truckTrans + suspension + truckCondition;

                $('#DealInfoContent').html(html);
            }

            $('#DealInfoModal').modal('show');
        }
    })
}

function onOppInfo(ID) {
    showSpinner();

    $.ajax({
        url : base_url + 'Opportunities/getOpportunityByID',
        type : 'post',
        data : {
            ID: ID
        },
        success : function(res) {
            hiddenSpinner();
            var data = JSON.parse(res);

            if (data.success == false)
            {
                toastr.error(data.message);
                return;
            }
            var html = '';
            var full = data.data;

            if (full.EqCategory)
                html += '<span class="item-info-index">' + getLocalizationWord('Equipment Category') + ':&nbsp </span><span class="item-info-content">' + full.EqCategory + '</span><br>';                
            
            if (full.EqMake)
                html += '<span class="item-info-index">' + getLocalizationWord('Make') + ':&nbsp </span><span class="item-info-content">' + full.EqMake + '</span><br>';                    
            
            if (full.EqModelCap)
                html += '<span class="item-info-index">' + getLocalizationWord('Model/Capacity') + ':&nbsp </span><span class="item-info-content">' + full.EqModelCap + '</span><br>';                
                
            if (full.MinYear)
                html += '<span class="item-info-index">' + getLocalizationWord('Min Year') + ':&nbsp </span><span class="item-info-content">' + full.MinYear + '</span><br>';                   
            
            if (full.MaxPrice)
                html += '<span class="item-info-index">' + getLocalizationWord('Max Price') + ':&nbsp </span><span class="item-info-content">' + full.MaxPrice + '</span><br>';                
            
            if (full.AdditionalInfo)
                html += '<span class="item-info-index">' + getLocalizationWord('Additional Info') + ':&nbsp </span><span class="item-info-content">' + full.AdditionalInfo + '</span><br>';                

            $('#DealInfoContent').html(html);
            $('#DealInfoTitle').html(getLocalizationWord('Opportunity Info'));
            $('#DealInfoModal').modal('show');
        },
        error : function() {
            hiddenSpinner();
            toastr.error('Get Opportunity data Failed');
        }
    });
}


function onSalesLog(ID) {
    showSpinner();

    $.ajax({
        url : base_url + 'Sales/getLog',
        type : 'post',
        data : {
            ID : ID
        },
        success : function(res) {
            hiddenSpinner();

            var data = JSON.parse(res);

            if (data.success == false) {
                toastr.error(data.message);
                return;
            }

            var SalesLog = data.SalesLog;
            var logs = SalesLog.split('&&&');
            var html_logs_panel = '';
            
            if (logs.length < 2) {
                toastr.error(LocalizationMessage('Sales Log Empty'));
                return;
            }

            for (var i = logs.length - 2; i >= 0; i--) {
                var log = JSON.parse(logs[i]);

                html_logs_panel += 
                    "<div class='contact'><div style='width : 30px;'>" + (logs.length - i - 1) + ".</div>" +
                    "<div style='margin-left : 20px; width : 100%;'>"+
                    "<div ><span style='font-weight: bolder'>" + getLocalizationWord("Date") + ": </span>" + log.Date + "</div>";
                if (log.DealStatus != '')
                {                    
                    html_logs_panel += "<div ><span style='font-weight: bolder'>" + getLocalizationWord('Deal Status') + ": </span>" + getLocalizationWord(log.DealStatus) + "</div>";
                    
                }
                else {
                    if (log.ContactDate != '') {
                        html_logs_panel += "<div ><span style='font-weight: bolder'>" + getLocalizationWord('Contact Date') + ": </span>" + log.ContactDate + "</div>";
                    }
                }
                
                html_logs_panel += "<div ><span style='font-weight: bolder'>" + getLocalizationWord('Note') + ":<br></span>" + restoreSpecificCharacter(log.Note) + "</div>";

                if (log.DealStatus == 'Closed') {
                    var disabled = log.ContactDate == '' ? "disabled" : "";
                    html_logs_panel += '<div style="text-align: right; width : 100%;">' + 
                        '<button class="btn btn-default" onclick="receiptCloseDownload(\'' + log.ContactDate + '\', ' + ID + ');" '+ disabled + '>' + getLocalizationWord('Download') + '</button>' +                         
                    '</div>';
                }
                html_logs_panel += "</div></div>";
            }

            $('#LogPanel').html(html_logs_panel);
            $('#LogModal').modal('show');
        }
    })
}

function onDeposit(ID, SalesCurrency, TotalDeposit, Total) {    

    $('#edit-item-id').val(ID);
    var today = new Date();
    startDate = today.toLocaleString("en-US", {timeZone: "America/Phoenix"});
    $('#DepositDate').datepicker('setDate', new Date(startDate));
    $('#DepositAmount').val(0);
    $('#DepositExchangeRate').val(1);
    $('#DepositCurrency').val('MXN');
    $('#DepositType').val('Electronic');
    $('#DepositDateInput').val('');
    $('#DepositConvertedAmount').val('');
    $('#DepositReceiptUpload').val('');
    $('#DepositTotalDeposit').html(numberWithCommas(TotalDeposit) + ' ' + SalesCurrency);
    $('#DepositRemainingAmount').html(numberWithCommas(Total - TotalDeposit) + ' ' + SalesCurrency);
    $('#DepositSalesCurrency').html(SalesCurrency);
    $('#DepositConcept').val('');

    ShowHideExchangePanel();

    $('#DepositModal').modal('show');
}

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
                    toastr.error(data.message);
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



$('#DepositCurrency').change(function() {
    ShowHideExchangePanel();
});

$('#DepositCurrencyEdit').change(function() {
    ShowHideExchangeEditPanel();
});

$('#btnDeposit').click(function() {

    showSpinner();

    console.log($('#DepositDateInput').val());

    var ID = $('#edit-item-id').val();
    $('#DepositSalesID').val(ID);
    $('#DepositUser').val($('#usernameInput').val());    

    $.ajax({
        url : base_url + 'Sales/deposit',
        type : 'post',
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
                    toastr.error('Deposit exceeds Total Error');
                else
                    toastr.error(LocalizationMessage('Add Deposit') + ' Error');
                logErrorActivity('Add Deposit', ID, 'tblSales', data.message);
                return;
            }

            $('#DepositModal').modal('hide');
            toastr.success(LocalizationMessage('Add Deposit'));
            logSuccessActivity('Add Deposit', ID, 'tblSales');
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
    $('#DepositTotalDepositEdit').html(numberWithCommas(Number(TotalDeposit).toFixed(2)) + ' ' + SalesCurrency);

    showSpinner();
    $.ajax({
        url : base_url + 'Sales/getDepositHistoryID',
        type : 'post',
        data : {
            ID : ID
        },
        success : function(res) {
            hiddenSpinner();
            var data = JSON.parse(res);            

            if (data.success == false) {
                toastr.error(data.message);
                return;
            }

            if (data.data.length == 1)
                $('#DepositLogNextBtn').prop('disabled', true);
                
            DepositHistoryID = data.data;

            showDepositHistory(0);

            $('#DepositHistoryModal').modal('show');
        },
        error : function() {
            toastr.error('Get Deposit Error');
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
                toastr.error(data.message);
                return;
            }           

            data = data.data;            

            var disabled = data.ReceiptPhoto == '' ? "disabled" : "";
            
            var html =                      
                    '<div><label>' + getLocalizationWord('Deposit Date') + ': </label>&nbsp;<label style="font-weight: bolder;">' + getDatefromDateTime(data.Date) +'</label></div>'+ 
                    '<div><label>' + getLocalizationWord('Added By') + ': </label>&nbsp;<label style="font-weight: bolder;">' + data.DepositUser + " " + (data.UpdateDate != '0000-00-00 00:00:00' ? getShortDateTime(data.UpdateDate) : "") +'</label></div>' +             
                    '<div><label>' + getLocalizationWord('Amount') + ': </label>&nbsp;<label style="font-weight: bolder;">'+ numberWithCommas(data.Amount) + '</label></div>' + 
                    '<div><label>' + getLocalizationWord('Currency') + ': </label>&nbsp;<label style="font-weight: bolder;">' + data.Currency + '</label></div>' + 
                    '<div><label>' + getLocalizationWord('Exchange Rate') + ': </label>&nbsp;<label style="font-weight: bolder;">' + data.ExchangeRate + '</label></div>' + 
                    '<div><label>' + getLocalizationWord('Converted Amount') + ': </label>&nbsp;<label style="font-weight: bolder;">'+ numberWithCommas(data.RealAmount) + '</label></div>' + 
                    '<div><label>' + getLocalizationWord('Deposit Type') + ': </label>&nbsp;<label style="font-weight: bolder;">'+ getLocalizationWord(data.DepositType) + '</label></div>' + 
                    '<div><label>' + getLocalizationWord('Concept') + ': </label>&nbsp;<label style="font-weight: bolder;">'+ data.Concept +'</label></div>' + 
                    '<div style="text-align: right;">' + 
                        '<button class="btn btn-default" onclick="receiptDownload(\'' + data.ReceiptPhoto + '\', ' + data.ID + ');" '+ disabled + '>' + getLocalizationWord('Download') + '</button>';
            if ($('#accounting').val() == 'ON' || $('#permission').html() == 'admin') {
                html += '&nbsp;<button class="btn btn-default" onclick="depositEdit(' + data.ID + ');">' + getLocalizationWord('Edit') + '</button>';
                html += '&nbsp;<button class="btn btn-danger" onclick="depositDelete(' + data.ID + ');">' + getLocalizationWord('Delete') + '</button>';
            }
            html += '</div>';
            $('.depositHistoryPanel').html(html);
        },
        error : function() {
            toastr.error('Get Deposit Data Eror');
            hiddenSpinner();
        }
    });
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
        url : base_url + 'Sales/depositEdit',
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
                toastr.error(LocalizationMessage('Edit Deposit') + ' Error');
                logErrorActivity('Edit Deposit', ID, 'tblSales', data.message);
                return;
            }

            toastr.success(LocalizationMessage('Edit Deposit'));
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

function onCustomerInvoiceData(ID) {
    showSpinner();

    $('#edit-item-id').val(ID);

    $.ajax({
        url : base_url + 'Customers/getInvoiceData',
        type : 'post',
        data : {
            ID : ID
        },
        success : function (res) {
            var data = JSON.parse(res);
            hiddenSpinner();

            if (data.success == false) {
                toastr.error(LocalizationMessage('Get Invoice Data') + ' Error');
                return;
            }

            data = data.invoice;

            $('#RFC').val(data.RFC);
            $('#NombreSocial').val(data.NombreSocial);
            $('#NombreComercial').val(data.NombreComercial);
            $('#Telefono').val(data.Telefono);
            $('#CorreoElectronico').val(data.CorreoElectronico);
            $('#Calle').val(data.Calle);
            $('#NumExt').val(data.NumExt);
            $('#NumInt').val(data.NumInt);
            $('#Colonia').val(data.Colonia);
            $('#CP').val(data.CP);
            $('#Estado').val(data.Estado);
            $('#Ciudad').val(data.Ciudad);

            $('#invoiceModal').modal('show');
        }
    });
}

$('#btnUpdateInvoice').click(function() {
    showSpinner();

    var  ID = $("#edit-item-id").val();

    $.ajax({
        url : base_url + 'Customers/updateInvoiceData',
        type : 'post',
        data : {
            ID : ID,
            RFC : $('#RFC').val(),
            NombreSocial : $('#NombreSocial').val(),
            NombreComercial : $('#NombreComercial').val(),
            Telefono : $('#Telefono').val(),
            CorreoElectronico : $('#CorreoElectronico').val(),
            Calle : $('#Calle').val(),
            NumExt : $('#NumExt').val(),
            NumInt : $('#NumInt').val(),
            Colonia : $('#Colonia').val(),
            CP : $('#CP').val(),
            Estado : $('#Estado').val(),
            Ciudad : $('#Ciudad').val()
        },
        success : function(res) {
            hiddenSpinner();
            var data = JSON.parse(res);

            if (data.success == false) {
                toastr.error(LocalizationMessage('Set Invoice Data') + ' Error');
                return;
            }

            toastr.success(LocalizationMessage('Set Invoice Data'));
            $('#invoiceModal').modal('hide');
        }
    })
});



function depositDelete(DepositID) {
    $('#DepositHistoryModal').modal('hide');
    $('#deleteDepositModal').modal('show');
    $('#edit-item-id').val(DepositID);
}

function deleteDepositComfired() {
    var ID = $('#edit-item-id').val();

    showSpinner();
    
    $.ajax({
        url :  base_url + 'Sales/deleteDeposit',
        type : 'post',
        data: {
            DepositID : ID
        },
        success : function() {
            hiddenSpinner();
            $('#deleteDepositModal').modal('hide');

            getReadySalesStatus();
            refreshDatatable(false);
        }
    })
}

function updateTotalDepositForSale(SalesID)
{
    showSpinner();
    $.ajax({
        url : base_url + 'Sales/getTotalDeposit',
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

function OnBuyingInfo(ID) {
    showSpinner();

    $('#edit-item-id').val(ID);

    $.ajax({
        url : base_url + 'Sales/getBuyingInfo',
        type : 'post',
        data : {
            ID : ID
        },
        success : function(res) {
            hiddenSpinner();
            data = JSON.parse(res);

            if (data.success == false) {
                toastr.error('ERROR');
                return;
            }

            $('#BuyingAmount').val(data.BuyingAmount);
            $('#BuyingUser').val(data.BuyingUser);

            $('#BuyingInfoModal').modal('show');
        }
    });
}

$('#btnSaveBuyingInfo').click(function() {
    var ID = $('#edit-item-id').val();

    showSpinner();
    $.ajax({
        url : base_url + 'Sales/setBuyingUser',
        type : 'post',
        data : {
            ID : ID,
            BuyingAmount : $("#BuyingAmount").val(),
            BuyingUser: $('#BuyingUser').val()
        },            
        success : function(res) {
            hiddenSpinner();
            $('#BuyingInfoModal').modal('hide');
            var data = JSON.parse(res);

            if (data.success == false) {
                toastr.error(LocalizationMessage('Update Buying Information') + ' Error');
                logErrorActivity('Update Buying Information', ID, 'tblSales', data.message);
                return;
            }

            toastr.success(LocalizationMessage('Update Buying Information'));
            logSuccessActivity('Update Buying Information', ID, 'tblSales');
        } 
    });
});

function onIncentives(ID) {
    showSpinner();

    $.ajax({
        url : base_url + 'Sales/getIncentiveData',
        type : 'post',
        data : {
            ID : ID
        },
        success : function(res) {
            hiddenSpinner();
            var data = JSON.parse(res);

            if (data.success == false) {
                toastr.error('ERROR');
                return;
            }
            data = data.data;

            $('#IncentiveTotal').html(data.Total + " " + data.SalesCurrency);
            $('#IncentivePrice').html(data.Price + " " + data.SalesCurrency);
            $('#IncentiveMargin').html(data.Margin + " " + data.SalesCurrency);
            $('#IncentiveDiscount').html(data.Discount + " " + data.SalesCurrency);
            $('#IncentiveBuyingPrice').html(data.BuyingAmount + " " + data.SalesCurrency);
            $('#IncentiveBuyer').html(data.BuyingUser == '' ? getLocalizationWord('Unknown') : data.BuyingUser);
            
            $('#IncentiveModal').modal('show');
        }
    });
}


function receiptDownload(receipt, ID) {    
    var url = base_url + 'assets/images/depositRecipt/' + receipt;    
    var newElement = $("<a href='" + url + "' download='" + receipt + "'>test</a>");
    $(newElement)[0].click();

    var ID = $('#edit-item-id').val();
    toastr.success(LocalizationMessage('Download Deposit Picture'));
    logSuccessActivity('Download Deposit Picture', ID, 'tblSales');
}


function receiptCloseDownload(receipt, ID) {    
    var url = base_url + 'assets/images/closeSale/' + receipt;    
    var newElement = $("<a href='" + url + "' download='" + receipt + "'>test</a>");
    $(newElement)[0].click();

    toastr.success(LocalizationMessage('Download Sale Picture'));
    logSuccessActivity('Download Sale Picture', ID, 'tblSales');
}

function getMonthlySalesStatus() {
    $.ajax({
        url : base_url + 'Sales/getMonthlySalesStatus',
        type : 'post',
        data : {
            SalesRep : $('#inputSalesRep').val()
        },
        success : function(res) {
            var data = JSON.parse(res);

            $('#SalesCountForMonth').html(data.month);
            $('#SalesCountForToday').html(data.today);
        }
    });
}

function getActiveSalesStatus() {
    $.ajax({
        url : base_url + 'Sales/getActiveSalesStatus',
        type : 'post',
        data : {
            SalesRep : $('#inputSalesRep').val()
        },
        success : function(res) {
            var data = JSON.parse(res);

            var total = data.pending + data.shipping + data.customs + data.shop;

            $('#ActiveSalesCount').html(total);
            $('#PendingSalesCount').html(data.pending);
            $('#ShippingSalesCount').html(data.shipping);
            $('#CustomsSalesCount').html(data.customs);
            $('#ShopSalesCount').html(data.shop);
        }
    });
}

function getReadySalesStatus() {
    $.ajax({
        url : base_url + 'Sales/getReadySalesStatus',
        type : 'post',
        data : {
            SalesRep : $('#inputSalesRep').val()
        },
        success : function(res) {
            var data = JSON.parse(res);

            $('#ReadyStatusSalesCount').html(data.ready);
            
            $('#USDRemainingAmount').html(numberWithCommas(Number(data.usd).toFixed(2)) + ' USD');
            $('#MXNRemainingAmount').html(numberWithCommas(Number(data.mxn).toFixed(2)) + ' MXN');
        }
    });
}

function getNoDealSalesStatus() {
    $.ajax({
        url : base_url + 'Sales/getNoDealSalesStatus',
        type : 'post',
        data : {
            SalesRep : $('#inputSalesRep').val()
        },
        success : function(res) {
            var data = JSON.parse(res);

            $('#NoDealSalesCount').html(data.count);
        }
    })
}


function selectSalesRep() {
    
    getMonthlySalesStatus();
    getActiveSalesStatus();
    getReadySalesStatus();
    getNoDealSalesStatus();

    refreshDatatable();    
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

    exportTableToExcel('Sales'+ year + month + day);
});

function exportTableToExcel( filename = '') {

    showSpinner();

    $.ajax({
        url: base_url + 'Sales/getSalesDataForExcel',
        type: 'POST',
        data:  {                
            user : $('#inputSalesRep').val(),
            status : $('#inputStatus').val(),            
            dealStatus : $('#inputDealStatus').val(),
            dealType : $('#inputDealTypeFilter').val(),
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
                    if (j == 8)
                        cols[j] = getStyledPhoneNumber(cols[j]);
                    
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

function onChangeDealStatus(ID, DealStatus) {
    $('#edit-item-id').val(ID);

    $('#DealStatus').val(DealStatus);    
    $('#DealStatusNote').val('');

    $('#DealStatusModal').modal('show');
}

$('#btnChangeDealStatus').click(function() {

    var ID = $('#edit-item-id').val();
    var CurrentDealStatus = $('#CurrentDealStatus').val();
    $('#DealStatusModal').modal('hide');

    showSpinner();

    $.ajax({
        url : base_url + 'Sales/changeDealStatus',
        type : 'post',
        data : {
            ID : ID,
            DealStatus : $('#DealStatus').val(),
            Note : replaceNR2Br($('#DealStatusNote').val())
        },
        success : function(ret) {
            hiddenSpinner();

            var data = JSON.parse(ret);

            if (data.success == false) {
                toastr.error(LocalizationMessage('Change Deal Status') + ' Error');
                logErrorActivity('Change Deal Status', ID, 'tblSales', data.message);
                return;
            }

            toastr.success(LocalizationMessage('Change Deal Status'));
            logSuccessActivity('Change Deal Status', ID, 'tblSales');
            websocket.send(JSON.stringify({ 'msg': 'sales', 'poster': $('#usernameInput').val() }));
            refreshDatatable(false);
        }
    });
});

function onCancel(ID) {
    $('#edit-item-id').val(ID);
    showSpinner();

    $.ajax({
        url : base_url + 'Sales/getTotalDeposit',
        type : 'post',
        data : {
            ID : ID
        },
        success : function (res) {
            hiddenSpinner();
            var data = JSON.parse(res);

            if (data.success == false) {
                toastr.error('ERROR');
                return;
            }

            if (data.TotalDeposit == 0) {
                $('#btnCancelSale').click();
                return;
            }

            $('#ReturnAmount').val(data.TotalDeposit);
            $('#CancelModal').modal('show');
        }
    });    
}

$('#btnCancelSale').click(function() {
    

    var ID = $('#edit-item-id').val();

    var ReturnAmount = $('#ReturnAmount').val();

    showSpinner();
    $.ajax({
        url : base_url + 'Sales/cancelSale',
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

function onDeleteSale(ID) {
    showSpinner();

    $.ajax({
        url : base_url + 'Sales/deleteSale',
        type : 'post',
        data : {
            ID : ID
        },
        success : function (ret) {
            hiddenSpinner();

            var data = JSON.parse(ret);

            if (data.success == false) {
                toastr.error(LocalizationMessage('Delete Sale') + ' Error');
                logErrorActivity('Delete Sale', ID, 'tblSales', data.message);
                return;
            }

            toastr.success(LocalizationMessage('Delete Sale'));
            logSuccessActivity('Delete Sale', ID, 'tblSales');
            websocket.send(JSON.stringify({ 'msg': 'sales', 'poster': $('#usernameInput').val() }));
            refreshDatatable(false);
        }
    })
}

function onClose(ID) {
    $('#CloseNote').val('');
    $('#CloseAttach').val('');
    $('#CloseID').val(ID);

    $('#CloseModal').modal('show');
}

$('#btnCloseSale').click(function () {
    showSpinner();
    $('#CloseNoteEdited').val(replaceNR2Br($('#CloseNote').val()));

    var ID = $('#CloseID').val();

    $.ajax({
        url : base_url + 'Sales/close',
        type : 'post',
        type: 'POST',
        data: new FormData(document.getElementById('CloseForm')),
        contentType: false,
        cache: false,
        processData: false,
        dataType: "json",        
        success : function(data) {
            //var data = JSON.parse(res);

            hiddenSpinner();
            if (data.success == false) {
                toastr.error(LocalizationMessage('Close Sale') + ' Error');
                logErrorActivity('Close Sale', ID, 'tblSales', data.message);
                return;
            }

            toastr.success(LocalizationMessage('Close Sale'));
            logSuccessActivity('Close Sale', ID, 'tblSales');
            websocket.send(JSON.stringify({ 'msg': 'sales', 'poster': $('#usernameInput').val() }));
            refreshDatatable();
        }
    });
});

function onEditPrice(ID) {
    $('#edit-item-id').val(ID);

    $.ajax({
        url : base_url + 'Sales/getSaleInfo',
        type : 'post',
        data : {
            ID : ID
        },
        success : function(res) {
            hiddenSpinner();

            var data = JSON.parse(res) ;

            if (data.success == false) {
                toastr.error(data.message);
                return;
            }

            data = data.data;

            $('#Price').val(data.Price);
            $('#BuyPremium').val(data.BuyPremium);
            $('#Shipping').val(data.Shipping);
            $('#Customs').val(data.Customs);
            $('#Comm').val(data.Comm);
            $('#Discount').val(data.Discount);
            $('#Shop').val(data.Shop);
            $('#Extras').val(data.Extras);
            $('#Additional').val(data.Additional);
            $('.SalesUnit').html(data.SalesCurrency);

            $('#TaxRate').val(data.TaxP);

            if (data.DealStatus != 'Shop')
            {
                $('#WarhousePanel').hide();
                setEditPriceInput(false);
            }
            else
            {
                $('#WarhousePanel').show();
                setEditPriceInput(true);
            }

            $('.PriceInputBox').show();
            $('.BuyerPremiumInputBox').show();
            $('.ShippingInputBox').show();
            $('.CustomsInputBox').show();
            $('.DiscountInputBox').show();
            $('.CommInputBox').show();

            if (data.DealType == 'Supplier') {
                $('.BuyerPremiumInputBox').hide();
            }
            else if (data.DealType == 'Consignment') {
                $('.BuyerPremiumInputBox').hide();
                $('.CustomsInputBox').hide();
                $('.ShippingInput').hide();
            }
            else if (data.DealType == 'Inventory' || data.DealType == 'Manufacturing') {
                $('.BuyerPremiumInputBox').hide();
                $('.ShippingInputBox').hide();
                $('.CustomsInputBox').hide();
                $('.CommInputBox').hide();
            }
            else if (data.DealType == 'Logistics') {
                $('.BuyerPremiumInputBox').hide();
                $('.PriceInputBox').hide();
            }

            CalculateForEdit();

            $('#EditPriceModal').modal('show');

        },
        error : function() {
            hiddenSpinner();
            toastr.error('Error occured');
        }
    });
}

function setEditPriceInput(status) {
    $('#Price').prop('disabled', status);
    $('#BuyPremium').prop('disabled', status);
    $('#Shipping').prop('disabled', status);
    $('#Customs').prop('disabled', status);
    $('#Comm').prop('disabled', status);
    $('#Discount').prop('disabled', status);
    $('#Additional').prop('disabled', status);

    $('#TaxRate').prop('disabled', status);
}

function CalculateForEdit() {
    var Price = Number($('#Price').val());
    var BuyPremium = Number($('#BuyPremium').val());
    var Shipping = Number($('#Shipping').val());
    var Customs = Number($('#Customs').val());
    var Comm = Number($('#Comm').val());
    var Discount = Number($('#Discount').val());
    var Shop = Number($('#Shop').val());
    var Extras = Number($('#Extras').val());
    var Additional = Number($('#Additional').val());
    var TaxRate = Number($('#TaxRate').val());
    

    var SubTotal = BuyPremium + Price + Shipping + Customs + Comm - Discount + Additional;
    var TaxAmount = SubTotal * TaxRate / 100;
    subTotalPrice = SubTotal + TaxAmount;
    var Total = subTotalPrice + Shop + Extras;

    $('#TaxAmount').html(numberWithCommas(Number(TaxAmount).toFixed(2)));
    $('#SubTotal').html(numberWithCommas(Number(subTotalPrice).toFixed(2)));
    $('#Total').html(numberWithCommas(Number(Total).toFixed(2)));
}

$('#btnEditPrice').click(function() {
    var ID = $('#edit-item-id').val();

    $('#EditPriceModal').modal('hide');

    showSpinner();
    $.ajax({
        url : base_url + 'Sales/updatePrice',
        type : 'post',
        data : {
            ID : ID,
            Price : $('#Price').val(),
            BuyPremium : $('#BuyPremium').val(),
            Shipping : $('#Shipping').val(),
            Customs : $('#Customs').val(),
            Comm : $('#Comm').val(),
            Discount : $('#Discount').val(),
            Additional : $('#Additional').val(),
            Shop : $('#Shop').val(),
            Extras : $('#Extras').val(),
            TaxP : $('#TaxRate').val(),
            TaxAmount : numbeWithoutCommas($('#TaxAmount').html()),
            Total : numbeWithoutCommas($('#Total').html())
        },
        success : function(res) {
            hiddenSpinner();

            var data = JSON.parse(res) ;

            if (data.success == false) {
                toastr.error(LocalizationMessage('Edit Price') + ' Error');
                logErrorActivity('Edit Price', ID, 'tblSales', data.message);
                return;
            }

            toastr.success(LocalizationMessage('Edit Price'));
            logSuccessActivity('Edit Price', ID, 'tblSales');
            websocket.send(JSON.stringify({ 'msg': 'sales', 'poster': $('#usernameInput').val() }));
            refreshDatatable(false);
        },
        error : function() {
            hiddenSpinner();
            toastr.error('Error occured');
        } 
    });
});

function onProcurement(ID) {
    showSpinner();

    $.ajax({
        url: base_url + 'Procurement/add',
        type: 'post',
        data: {
            DealID: ID,
            AddedFrom: 'Sales'
        },
        success: function(res) {
            hiddenSpinner();
            
            var data = JSON.parse(res);

            if (data.success == false) {
                toastr.warning(LocalizationMessage("Buy Deal"));
                logErrorActivity('Buy Deal', ID, 'tblDeals', 'Buy Deal Error');
                return;
            }

            toastr.success(LocalizationMessage("Buy Deal"));
            logSuccessActivity('Buy Deal', ID, 'tblDeals');
            refreshDatatable(false);
        },
        error: function(res) {
            toastr.warning(LocalizationMessage("Buy Deal"));
            logErrorActivity('Buy Deal', ID, 'tblDeals', 'Buy Deal Error');
        }
    })
}

function onDocuments(ID) {
    $('#edit-item-id').val(ID);
    $('#SalesID').val(ID);
    showSpinner();

    $.ajax({
        url: base_url + 'Sales/getDocuments',
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
        url: base_url + 'Sales/uploadDocument',        
        type: 'POST',
        data: new FormData(document.getElementById('DocumentForm')),
        contentType: false,
        cache: false,
        processData: false,
        dataType: "json",        
        success : function(data) {
            if (data.success == true){
                toastr.success("Upload Document", 'Machinery Hawkers');                
                logSuccessActivity('Upload Document', ID, 'tblSales');
                onDocuments(ID);
            }
            else {
                toastr.warning(data.message, 'Machinery Hawkers');                
                logErrorActivity('Upload Document Error', ID, 'tblSales', 'Upload Document Error');
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

function onSaleDocument(ID) {
    showSpinner();

    $.ajax({
        url: base_url + 'Sales/getSaleDetail',
        type: 'post',
        data: {
            ID: ID
        },
        success: function(res) {
            
            var data = JSON.parse(res);

            if (data.success == false) {
                hiddenSpinner();
                toastr.error("Get Sale Document", "Machinery Hawkers");
                return;
            }
            var full = data.sale;

            var client =    getCheckedValueForDocument(full.Name + " " + full.LastName) + 
                            getCheckedValueForDocument(getStyledPhoneNumber(full.Phone)) + 
                            getCheckedValueForDocument(full.Email) + 
                            getCheckedValueForDocument(full.CompanyName) + 
                            getCheckedValueForDocument(full.Country) + 
                            getCheckedValueForDocument(full.State) + 
                            getCheckedValueForDocument(full.City) + 
                            getCheckedValueForDocument(full.RFC);

            var equipment = '';

            if (full.DealType == 'Manufacturing') {
                $('#portfolio').hide();
                $('#deal_type').html('Fabricación');
                var DealType = '<li>' + getBadgetForDealType(full.DealType) + '</li>';
                var EqCategory = getCheckedValueForDocument(full.EquipmentCategory);
                var Capacity = getCheckedValueForDocument(full.ManuCapacity);
                var TruckMake = getCheckedValueForDocument(full.ManuTruckMake);
                var TruckYear = getCheckedValueForDocument(full.ManuTruckYear);
                equipment =  DealType + EqCategory + Capacity + TruckMake + TruckYear;
                
            }
            else if (full.DealType == 'Logistics') {
                $('#portfolio').hide();
                $('#deal_type').html('Logística');
                var DealType = '<li>' + getBadgetForDealType(full.DealType) + '</li>';
                var EqCategory = getCheckedValueForDocument(full.LogiEqCategory);
                var PickUp = '<li>' + (full.PickUpCity == '' ? '' : full.PickUpCity + ', ') +
                            (full.PickUpState == '' ? '' : full.PickUpState + ', ') + 
                            full.PickUpCountry + '</li>';
                            
                var Final = '<li>' + (full.FinalCity == '' ? '' : full.FinalCity + ', ') +
                            (full.FinalState == '' ? '' : full.FinalState + ', ') + 
                            full.FinalCountry + '</li>';
                            
                equipment =  DealType + EqCategory + PickUp + Final;
            }
            else {
                $imgUrl = base_url + "assets/images/primaryImages/" + full.PrimaryImage;
                var photoElement = '<div class="photo-cell" style="background-image: url(\'' + $imgUrl + '\')">' +
                    '<img  class="auction-photo" src="' + $imgUrl + '" >' +              
                    '</div>';
                $('#portfolio').html(photoElement);
                $('#portfolio').show();

                var DealCode = getCheckedValueForDocument(full.DealCode);                
                var EqCategory = getCheckedValueForDocument(get_translated_word(full.EqCategory));
                var equip_content = get_equip_content_data_for_sale_document(full);

                if (full.DealType == 'Auction')                
                    $('#deal_type').html('Subasta');                                   
                else if (full.DealType == 'Inventory') 
                    $('#deal_type').html('Inventario');                
                else if (full.DealType == 'Supplier')
                    $('#deal_type').html('Proveedor');
                else if (full.DealType == 'Consignment')
                    $('#deal_type').html('Consignación');

                equipment =  DealCode + EqCategory + equip_content;
            }

            var deal = '';

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
            var buyingUser = '';
            var subTotal = '';

            if (full.Total != 0) {
                if (full.Price != 0)
                    price = '<li>Precio: ' + numberWithCommas(full.Price) + ' ' + full.SalesCurrency + '</li>';
                if (full.BuyPremium != 0)
                    buyPremium = '<li>Comisión de Subasta:' + numberWithCommas(full.BuyPremium) + ' ' + full.SalesCurrency + '</li>';
                if (full.Shipping != 0)
                    shipping = '<li>Flete' + ': ' + numberWithCommas(full.Shipping) + ' ' + full.SalesCurrency + '</li>';
                if (full.Customs != 0)
                    customs = '<li>Importación' + ': ' + numberWithCommas(full.Customs) + ' ' + full.SalesCurrency + '</li>';   
                if (full.Comm != 0)
                    comm = '<li>Comisión' + ': ' + numberWithCommas(full.Comm) + ' ' + full.SalesCurrency + '</li>';
                if (full.Discount != 0)
                    discount = '<li>Descuento' + ': ' + numberWithCommas(full.Discount) + ' ' + full.SalesCurrency + '</li>';
                if (full.Shop != 0)
                    shop = '<li>Taller' + ': ' + numberWithCommas(full.Shop) + ' ' + full.SalesCurrency + '</li>';
                if (full.Extras != 0)
                    extras = '<li>' + getLocalizationWord('Extras') + ': ' + numberWithCommas(full.Extras) + ' ' + full.SalesCurrency + '</li>';
                taxP = '<li>IVA en Cantidad' + ': ' + numberWithCommas(Number(full.TaxAmount).toFixed(2)) + '' + full.SalesCurrency + '</li>';
                
                subTotal = full.Total - full.Shop - full.Extras;
                if (full.Shop != 0 || full.Extras != 0)
                    subTotal = '<li>' + getLocalizationWord('Sub Total') + ': ' + numberWithCommas(Number(subTotal).toFixed(2)) + ' ' + full.SalesCurrency + '</li>'; 
                else   
                    subTotal = '';

                total = numberWithCommas(Number(full.Total).toFixed(0)) + ' ' + full.SalesCurrency;
                $('#total-price').html(total);
            }  
            else {
                $('#total-price').html('');
            }    
            
            if (full.BuyingPrice != null && full.BuyingPrice != 0)
                buyingAmount = '<li>Precio de Compra' + ': ' + numberWithCommas(Number(full.BuyingPrice)) + ' ' + full.SalesCurrency + '</li>';
            
            if (full.Buyer != null && full.Buyer != '')
                buyingUser = '<li>Comprador' + ': ' + full.Buyer + '</li>';

            deal =  price + buyPremium + shipping + customs + comm + discount + taxP + subTotal + shop + extras + buyingAmount + buyingUser;

            var today = new Date();
            var startDate = today.toLocaleString("en-US", {timeZone: "America/Phoenix"});
            startDate = new Date(startDate);
                
            $('#SaleDate').html(startDate.today());
            $('#SaleCode').html(full.SalesCode);
            $('#deal-content > ul').html(deal);
            $('#client-content > ul').html(client);
            $('#equipment-content > ul').html(equipment);

            // Footer
            var user = data.user;
            var footer = user.NAME + ' ' +  user.LASTNAME + ' / Oficina: (653) 518 733 / Cel: ' + getStyledPhoneNumberonDocument(user.PHONE) + ' / Correo: ' + user.EMAIL;
            $('#salesrep_desc').html(footer);

            var options = {
                backgroundColor: '#ffffff',
                scale: 5
            };

            $('#SaleDocument').show();
            var element = document.getElementById('SaleDocument');
            var wid = 800;
            var hei = 1131;

            html2canvas(element, options).then(function (canvas) {

                var imgdata = canvas.toDataURL('image/jpeg');
                var doc = new jsPDF('p', 'mm', 'a4');
                var pdfWidth = doc.internal.pageSize.width;
                var pdfHeight = doc.internal.pageSize.height;
                var topMargin = 0;
                var leftMargin = 0;
                var contentWidth = pdfWidth - 2 * leftMargin;
                var contentHeight = contentWidth / wid * hei;

              
                doc.addImage(imgdata, 'JPEG', leftMargin, topMargin, contentWidth, contentHeight);                
                doc.save('Venta:' + full.SalesCode + "_" + startDate.today() + '.pdf');
                $('#SaleDocument').hide();
                hiddenSpinner();
            });
            
        },
        error : function(err) {
            hiddenSpinner();
            toastr.error("Get Sale Document", "Machinery Hawkers");
        }
    })
}

function onDepsoitDocument(ID) {
    showSpinner();

    $.ajax({
        url: base_url + 'Sales/getSaleDetail',
        type: 'post',
        data: {
            ID: ID
        },
        success: function(res) {
            
            var data = JSON.parse(res);

            if (data.success == false) {
                hiddenSpinner();
                toastr.error("Get Sale Document", "Machinery Hawkers");
                return;
            }

            var full = data.sale;

            var client =    getCheckedValueForDocument(full.Name + " " + full.LastName) + 
                            getCheckedValueForDocument(getStyledPhoneNumber(full.Phone)) + 
                            getCheckedValueForDocument(full.Email) + 
                            getCheckedValueForDocument(full.CompanyName) + 
                            getCheckedValueForDocument(full.Country) + 
                            getCheckedValueForDocument(full.State) + 
                            getCheckedValueForDocument(full.City) + 
                            getCheckedValueForDocument(full.RFC);

            $('#deposit_client_content').html(client);

            var equipment = '';
            if (full.DealType == 'Manufacturing') {
                $('#portfolio').hide();
                $('#deal_type').html('Fabricación');
                var DealType = '<li>' + getBadgetForDealType(full.DealType) + '</li>';
                var EqCategory = getCheckedValueForDocument(full.EquipmentCategory);
                var Capacity = getCheckedValueForDocument(full.ManuCapacity);
                var TruckMake = getCheckedValueForDocument(full.ManuTruckMake);
                var TruckYear = getCheckedValueForDocument(full.ManuTruckYear);
                equipment =  DealType + EqCategory + Capacity + TruckMake + TruckYear;
                
            }
            else if (full.DealType == 'Logistics') {
                $('#portfolio').hide();
                $('#deal_type').html('Logística');
                var DealType = '<li>' + getBadgetForDealType(full.DealType) + '</li>';
                var EqCategory = getCheckedValueForDocument(full.LogiEqCategory);
                var PickUp = '<li>' + (full.PickUpCity == '' ? '' : full.PickUpCity + ', ') +
                            (full.PickUpState == '' ? '' : full.PickUpState + ', ') + 
                            full.PickUpCountry + '</li>';
                            
                var Final = '<li>' + (full.FinalCity == '' ? '' : full.FinalCity + ', ') +
                            (full.FinalState == '' ? '' : full.FinalState + ', ') + 
                            full.FinalCountry + '</li>';
                            
                equipment =  DealType + EqCategory + PickUp + Final;
            }
            else {
                var DealCode = getCheckedValueForDocument(full.DealCode);                               
                var EqCategory = getCheckedValueForDocument(get_translated_word(full.EqCategory));
                var equip_content = get_equip_content_data_for_sale_document(full);

                if (full.DealType == 'Auction')                
                    $('#deal_type').html('Subasta');                                   
                else if (full.DealType == 'Inventory') 
                    $('#deal_type').html('Inventario');                
                else if (full.DealType == 'Supplier')
                    $('#deal_type').html('Proveedor');
                else if (full.DealType == 'Consignment')
                    $('#deal_type').html('Consignación');

                equipment =  DealCode + EqCategory + equip_content;
            }

            $('#deposit_equip_conent').html(equipment);

            var deposit_history = '';
            var deposits = data.deposits;
            for (var i = 0; i < deposits.length;  i++) {
                deposit_history += 
                    '<tr>' + 
                    '<td>' + getDatefromDateTime(deposits[i]['Date']) + '</td>' +                     
                    '<td>' + numberWithCommas(deposits[i]['Amount']) + '</td>' + 
                    '<td>' + deposits[i]['Currency'] + '</td>' + 
                    '<td>' + deposits[i]['ExchangeRate'] + '</td>' + 
                    '<td>' + numberWithCommas(deposits[i]['RealAmount']) + '</td>' +                     
                    '<td class="concept">' + deposits[i]['Concept'] + '</td>' +
                    '</tr>';
            }
            $('#deposit_history_content').html(deposit_history);

            var deal = '';
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
            var buyingUser = '';
            var subTotal = '';

            if (full.Total != 0) {
                if (full.Price != 0)
                    price = '<li>Precio: ' + numberWithCommas(full.Price) + ' ' + full.SalesCurrency + '</li>';
                if (full.BuyPremium != 0)
                    buyPremium = '<li>Comisión de Subasta:' + numberWithCommas(full.BuyPremium) + ' ' + full.SalesCurrency + '</li>';
                if (full.Shipping != 0)
                    shipping = '<li>Flete' + ': ' + numberWithCommas(full.Shipping) + ' ' + full.SalesCurrency + '</li>';
                if (full.Customs != 0)
                    customs = '<li>Importación' + ': ' + numberWithCommas(full.Customs) + ' ' + full.SalesCurrency + '</li>';   
                if (full.Comm != 0)
                    comm = '<li>Comisión' + ': ' + numberWithCommas(full.Comm) + ' ' + full.SalesCurrency + '</li>';
                if (full.Discount != 0)
                    discount = '<li>Descuento' + ': ' + numberWithCommas(full.Discount) + ' ' + full.SalesCurrency + '</li>';
                if (full.Shop != 0)
                    shop = '<li>Taller' + ': ' + numberWithCommas(full.Shop) + ' ' + full.SalesCurrency + '</li>';
                if (full.Extras != 0)
                    extras = '<li>' + getLocalizationWord('Extras') + ': ' + numberWithCommas(full.Extras) + ' ' + full.SalesCurrency + '</li>';
                taxP = '<li>IVA en Cantidad' + ': ' + numberWithCommas(Number(full.TaxAmount).toFixed(2)) + '' + full.SalesCurrency + '</li>';
                
                subTotal = full.Total - full.Shop - full.Extras;
                if (full.Shop != 0 || full.Extras != 0)
                    subTotal = '<li>' + getLocalizationWord('Sub Total') + ': ' + numberWithCommas(Number(subTotal).toFixed(2)) + ' ' + full.SalesCurrency + '</li>'; 
                else   
                    subTotal = '';

                total = numberWithCommas(Number(full.Total).toFixed(0)) + ' ' + full.SalesCurrency;
                $('#deposit_total-price').html(total);
            }  
            else {
                $('#deposit_total-price').html('0 USD');
            }    
            
            if (full.BuyingPrice != null && full.BuyingPrice != 0)
                buyingAmount = '<li>Precio de Compra' + ': ' + numberWithCommas(Number(full.BuyingPrice)) + ' ' + full.SalesCurrency + '</li>';
            
            if (full.Buyer != null && full.Buyer != '')
                buyingUser = '<li>Comprador' + ': ' + full.Buyer + '</li>';

            deal =  price + buyPremium + shipping + customs + comm + discount + taxP + subTotal + shop + extras + buyingAmount + buyingUser;
            $('#deposit_deal_content').html(deal);
            $('#total-deposit').html(numberWithCommas(Number(data.TotalDeposit).toFixed(0)) + ' ' + full.SalesCurrency);
            var totalPrice = full.Total;
            var totalDeposit = data.TotalDeposit;
            var remaing = numberWithCommas((Number(totalPrice) - Number(totalDeposit)).toFixed(0)) + ' ' + full.SalesCurrency;
            $('#deposit_remaining').html(remaing);

            var today = new Date();
            var startDate = today.toLocaleString("en-US", {timeZone: "America/Phoenix"});
            startDate = new Date(startDate);
                
            $('#deposit_SaleDate').html(startDate.today());
            $('#deposit_SaleCode').html(full.SalesCode);

            // Footer
            var user = data.user;
            var footer = user.NAME + ' ' +  user.LASTNAME + ' / Oficina: (653) 518 733 / Cel: ' + getStyledPhoneNumberonDocument(user.PHONE) + ' / Correo: ' + user.EMAIL;
            $('#deposit_salesrep_desc').html(footer);

            var options = {
                backgroundColor: '#ffffff',
                scale: 5
            };

            $('#DepositDocument').show();
            var element = document.getElementById('DepositDocument');            
            var wid = 800;
            var hei = 1131;

            html2canvas(element, options).then(function (canvas) {

                var imgdata = canvas.toDataURL('image/jpeg');
                var doc = new jsPDF('p', 'mm', 'a4');
                var pdfWidth = doc.internal.pageSize.width;
                var pdfHeight = doc.internal.pageSize.height;
                var topMargin = 0;
                var leftMargin = 0;
                var contentWidth = pdfWidth - 2 * leftMargin;
                var contentHeight = contentWidth / wid * hei;

              
                doc.addImage(imgdata, 'JPEG', leftMargin, topMargin, contentWidth, contentHeight);                
                doc.save('Cuenta:' + full.SalesCode + "_" + startDate.today() + '.pdf');
                $('#DepositDocument').hide();
                hiddenSpinner();
            });
        }
    });
}

function onDocumentPrint(ID) {
    $('#edit-item-id').val(ID);
    $('#DocumentPrintModal').modal('show');
}

$('#btnDocumentPrint').click(function() {
    var type = $('#DocumentType').val();
    var ID = $('#edit-item-id').val();
    $('#DocumentPrintModal').modal('hide');
    
    if (type == 'sale') 
        onSaleDocument(ID);
    else   
        onDepsoitDocument(ID);
})

function onChangeSalesRep(ID) {
    $('#ChangeSalesRepModal').modal('show');
    $('#edit-item-id').val(ID);
}

$('#btnChangeSalesRep').click(function() {
    showSpinner();

    var ID = $('#edit-item-id').val();

    $.ajax({
        url: base_url + 'Sales/changeSalesRep',
        type: 'post',
        data: {
            ID : ID,
            SalesRep: $('#SalesRep').val()
        },
        success: function(res) {
            hiddenSpinner();
            var data = JSON.parse(res);

            if (data.success == false) {
                toastr.warning('Change Sales Rep', 'Machinery Hawkers');
                return;
            }

            toastr.success('Changes Sales Rep', 'Machinery Hawkers');
            refreshDatatable(false);
        },
        error: function(err) {
            hiddenSpinner();
            toastr.error('Change Sales Rep', 'Machinery Hawkers');
        }
    })
})

function logSuccessActivity(Activity, ID, Table) {
    $.ajax({
        url : base_url + 'Activity/addActivity',
        type : 'post',
        data : {
            Activity : Activity,
            ObjectiveTable : Table,
            ObjectiveID : ID,
            Webpage : 'Sales.Sale',
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
            Webpage : 'Sales.Sale',
            Status : 'Error',
            Error : ErrorMsg
        },
        success : function() {
            websocket.send(JSON.stringify({ 'msg': 'activity', 'poster': $('#usernameInput').val() }));
        }
    });
}