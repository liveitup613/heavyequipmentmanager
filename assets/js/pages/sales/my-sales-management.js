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

            var deal = '';
            var edit = '';
            var btnDelete = '';
            var clone = '';
            var note = '';
            var changeDealStatus = '';
            var contact = '';
            var salesLog = '';
            var deposit = '';
            var depositLog = '';
            var dealInfo = '';
            var btnClose = '';
            var btnCancel = '';
            var btnCustomerConf = '';
            var btnCustomerInvoice = '';
            var bntProcurement = '<button  class="col-lg-4 btn btn-sm btn-default btn-action"  data-toggle="tooltip" data-placement="top" title="' + getLocalizationWord('Buy') + '" onclick="onProcurement(' + full.DealID + ')"><i class="icon-basket"></i></button>'
            var btnDocs = '<button  class="col-lg-4 btn btn-sm btn-default btn-action"  data-toggle="tooltip" data-placement="top" title="' + getLocalizationWord('Documents') + '" onclick="onDocuments(' + full.ID + ')"><i class="icon-docs"></i></button>';
            var btnPrint = '<button  class="col-lg-4 btn btn-sm btn-default btn-action"  data-toggle="tooltip" data-placement="top" title="' + getLocalizationWord('Sale Document') + '" onclick="onDocumentPrint(' + full.ID + ')"><i class="icon-printer"></i></button>';

            clone = '<button  class="col-lg-4 btn btn-sm btn-default btn-action"  data-toggle="tooltip" data-placement="top" title="' + getLocalizationWord('Add Sale') + '" onclick="onClone(' + full.ID +')"><i class="icon-plus"></i></button>';
            note = '<button  class="col-lg-4 btn btn-sm btn-default btn-action"  data-toggle="tooltip" data-placement="top" title="' + getLocalizationWord('Note') + '" onclick="onNote(' + full.ID +')"><i class="icon-pencil"></i></button>';
            contact = '<button  class="col-lg-4 btn btn-sm btn-default btn-action"  data-toggle="tooltip" data-placement="top" title="' + getLocalizationWord('Contact') + '" onclick="onContact(' + full.ID +')"><i class="fa fa-phone"></i></button>';
            salesLog = '<button  class="col-lg-4 btn btn-sm btn-default btn-action"  data-toggle="tooltip" data-placement="top" title="' + getLocalizationWord('Sales Log') + '" onclick="onSalesLog(' + full.ID +')"><i class="icon-notebook"></i></button>';            
            depositLog = '<button  class="col-lg-4 btn btn-sm btn-default btn-action"  data-toggle="tooltip" data-placement="top" title="' + getLocalizationWord('Deposit History') + '" onclick="onDepositHistory(' + full.ID +', \'' + full.SalesCurrency + '\', ' + full.TotalDeposit + ')"><i class="icon-calculator"></i></button>';
            btnCustomerConf = '<button  class="col-lg-4 btn btn-sm btn-default btn-action"  data-toggle="tooltip" data-placement="top" title="' + getLocalizationWord('Edit Customer Information') + '" onclick="onEditCustomer(' + full.CustomerID + ')"><i class="icon-user"></i></button>';
            btnCustomerInvoice = '<button  class="col-lg-4 btn btn-sm btn-default btn-action"  data-toggle="tooltip" data-placement="top" title="' + getLocalizationWord('Edit Customer Invoice Information') + '" onclick="onCustomerInvoiceData(' + full.CustomerID + ')"><i class="icon-users"></i></button>';

            if (full.SalesStatus == 'New')
                deal = '<button  class="col-lg-4 btn btn-sm btn-default btn-action"  data-toggle="tooltip" data-placement="top" title="' + getLocalizationWord('Deal') + '" onclick="onDeal(' + full.ID +')"><i class="fa fa-gavel"></i></button>';
            else
            {
                if (full.DealStatus == 'Pending')
                {
                    deal = '<button  class="col-lg-4 btn btn-sm btn-default btn-action"  data-toggle="tooltip" data-placement="top" title="' + getLocalizationWord('Clear Deal Info') + '" onclick="onClearDeal(' + full.ID +')"><i class="fa fa-times"></i></button>';                    
                }
            }
            if (full.SalesStatus != 'New')
                changeDealStatus = '<button  class="col-lg-4 btn btn-sm btn-default btn-action"  data-toggle="tooltip" data-placement="top" title="' + getLocalizationWord('Change Deal Status') + '" onclick="onChangeDealStatus(' + full.ID +', \'' + full.DealStatus + '\')"><i class="icon-settings"></i></button>';

            if (full.SalesStatus == 'In Progress' && full.DealStatus != 'Ready') 
                edit = '<button  class="col-lg-4 btn btn-sm btn-default btn-action"  data-toggle="tooltip" data-placement="top" title="' + getLocalizationWord('Edit Price') + '" onclick="onEditPrice(' + full.ID +')"><i class="icon-note"></i></button>';            

            if (full.SalesStatus == 'New')
                btnCancel = '<button  class="col-lg-4 btn btn-sm btn-default btn-action"  data-toggle="tooltip" data-placement="top" title="' + getLocalizationWord('Cancel Sale') + '" onclick="onCancel(' + full.ID +',)"><i class="icon-action-undo"></i></button>';            

            if (full.SalesStatus == 'Canceled' && full.TotalDeposit == 0)
                btnDelete = '<button  class="col-lg-4 btn btn-sm btn-default btn-action"  data-toggle="tooltip" data-placement="top" title="' + getLocalizationWord('Delete') + '" onclick="onDeleteSale(' + full.ID +')"><i class="icon-trash"></i></button>';            
        
            if (full.DealID != 0) 
                dealInfo = '<button  class="col-lg-4 btn btn-sm btn-default btn-action"  data-toggle="tooltip" data-placement="top" title="' + getLocalizationWord('Deal Info') + '" onclick="onDealInfo(' + full.ID +')"><i class="icon-info"></i></button>';            
            else
                dealInfo = '<button  class="col-lg-4 btn btn-sm btn-default btn-action"  data-toggle="tooltip" data-placement="top" title="' + getLocalizationWord('Deal Info') + '" onclick="onOppInfo(' + full.OppID+')"><i class="icon-info"></i></button>';            
            
            var rounded_total = Number(full.Total).toFixed(2);
            var total_deposit = Number(full.TotalDeposit).toFixed(2);
            var percentage = Number(full.TotalDeposit / full.Total * 100);
            if (full.DealStatus == 'Ready' && percentage >= 90) {
                btnClose = '<button  class="col-lg-4 btn btn-sm btn-default btn-action"  data-toggle="tooltip" data-placement="top" title="' + getLocalizationWord('Close') + '" onclick="onClose(' + full.ID+')"><i class="icon-close"></i></button>';            
            }   

            if ((rounded_total == 0 || rounded_total != total_deposit) && ($('#permission').html() == 'admin' || $('#accounting').val() == 'ON')) 
                deposit = '<button  class="col-lg-4 btn btn-sm btn-default btn-action"  data-toggle="tooltip" data-placement="top" title="' + getLocalizationWord('Deposit') + '" onclick="onDeposit(' + full.ID + ', \'' + full.SalesCurrency + '\', ' + full.TotalDeposit + ', ' + rounded_total + ')"><i class="icon-wallet"></i></button>';
                

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
                
            if (full.SalesStatus == 'Closed' || full.SalesStatus == 'Canceled') {
                deal = '';
                note = '';
                clone = '';
                contact = '';
                edit = '';
                changeDealStatus = '';
                deposit = '';
                btnClose = '';
            }

            return  '<div class="row" style = "width : 120px;">' + 
                    deal + dealInfo + clone + edit + deposit + changeDealStatus + note + contact + salesLog + depositLog + btnCancel + btnCustomerConf + btnCustomerInvoice + btnClose + btnDelete + bntProcurement + btnDocs + btnPrint +
                    '</div>';
        }
    }, {
        'title' : getLocalizationWord('Status'),
        sortable : false,
        'render' : function(data, type, full, meta) {
            var SalesCode = full.SalesCode + '<br>';
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
                    ContactDate = getLocalizationWord('Contact') + ': <span class="badge badge-warning">' + full.ContactDate + '</span>';
                else
                    ContactDate = getLocalizationWord('Contact') + ': ' + full.ContactDate;
            }
                
            return SalesCode +  DateAdded + SalesStatus + LastUpdateDate + DealsStatus + ContactDate;
        }
    }, {
        "title": getLocalizationWord("Client Info"),
        sortable: false,
        "render": function (data, type, full, meta) {
            var whatsapp_link = '';
            if(full.Phone) {
                whatsapp_link = '<a class="contact-link" href="javascript:void(0);" onclick="SendViaWhatsapp(\'' + full.Phone + '\');"><img class="publish-icon" src="/assets/images/publish_icon/WhatsApp_icon.png"></a>';
            }

            return  '<div style = "width : 250px; white-space:break-spaces; padding-left: 8px;">' +
                        full.Name + ' ' + full.LastName +  '<br>' + 
                        getStyledPhoneNumber(full.Phone)+ whatsapp_link + '<br>' +
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
                var EqCategory = get_translated_word(full.EquipmentCategory) + '<br>';
                var Capacity = getCheckedValue(full.ManuCapacity);
                var TruckMake = getCheckedValue(full.ManuTruckMake);
                var TruckYear = getCheckedValue(full.ManuTruckYear);

                return DealType + EqCategory + Capacity + TruckMake + TruckYear;
            }
            else if (full.DealType == 'Logistics') {
                var DealType = getBadgetForDealType(full.DealType) + '<br>';
                var EqCategory = get_translated_word(full.LogiEqCategory) + '<br>';
                var PickUp = getLocalizationWord("From") + ": " + (full.PickUpCity == '' ? '' : full.PickUpCity + ', ') +
                            (full.PickUpState == '' ? '' : full.PickUpState + ', ') + 
                            full.PickUpCountry;
                            
                var Final = getLocalizationWord("To") + ": " + (full.FinalCity == '' ? '' : full.FinalCity + ', ') +
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
            return '';
        }
    }, {
        "title": "Price Info",
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

            if (full.ProcurmentStatus != null)
                procurementStatus = getBadgetForEachStatusOnProcurement(full.ProcurementStatus);

            return price + buyPremium + shipping + customs + comm + discount + taxP + subTotal + shop + extras + total + buyingAmount + buyingUser + procurementStatus;            
        }
    }
];


/// Deal Column Data

var DealColumnData = [
    {
        "title": "",
        sortable: false,
        "render": function (data, type, full, meta) {           
            return '<button  class="btn btn-default btn-round"  data-toggle="" data-placement="top" title="' + getLocalizationWord('Select Item') + '" onclick="onSelectDeal(' + full.ID + ')" style="width : 100px;">' + getLocalizationWord('Select') + '</button>';                       
        }
    }, {
        "title": getLocalizationWord("Photo"),
        sortable: false,
        "render": function (data, type, full, meta) {
            $imgUrl = base_url + "assets/images/thumbImages/" + full.PrimaryImage;
            var photoElement = '<div class="photo-cell" style="background-image: url(\'' + $imgUrl + '\')">' +
                '<img  class="auction-photo" src="' + $imgUrl + '" >' +              
                '</div>';

            return photoElement;
        }
    }, {
        "title": getLocalizationWord("Equipment"),
        sortable: true,
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

            var year = '';
            if (parseInt(full.EqYear)) {
                year = full.EqYear + '<br>';
            }
            var make = '';
            if (full.EqMake) {
                make = full.EqMake + '<br>';
            }
            return EqCategory + year + make + full.EqModel;
        }
    }, {
        "title": getLocalizationWord("Location"),
        sortable: false,
        "render": function (data, type, full, meta) {

            var city = '';
            if (full.City) {
                city = full.City + '<br>';
            }
            var state = '';
            if (full.State) {
                state = full.State + '<br>';
            }
            var country = '';
            if (full.Country) {
                country = full.Country + '<br>';
            }

            var warehouse = '';
            if (full.WareHouse) {
                warehouse = full.WareHouse;
            }

            return city + state + country + warehouse;
        }
    }, {
        "title": getLocalizationWord("Deal Info"),
        sortable: true,
        "render": function (data, type, full, meta) {
            var dealType = getBadgetForEachStatusOnDeal(full.DealType) + '<br>';
            var startDate = '';
            if (full.StartDate) {
                startDate = full.StartDate + "<br>";
            }
            var endDate = '';
            if (full.EndDate) {
                endDate = full.EndDate + '<br>';
            }

            var auctioneer = '';
            if (full.Auctioneer) {
                auctioneer = full.Auctioneer;
            }
            return dealType + startDate + endDate + auctioneer;
        }
    }, {
        "title": getLocalizationWord("Price Info"),
        sortable: true,
        "render": function (data, type, full, meta) {

            var price = '';
            if (full.Price) {
                price = getLocalizationWord('Price') + ': ' + numberWithCommas(full.Price) + '<br>';
            }

            var total = '';
            if (full.Total) {
                total = getLocalizationWord('Total') + ': ' + numberWithCommas(full.Total);
            }

            return price + '' + total;
        }
    }, {
        "title": getLocalizationWord("Added By"),
        sortable: true,
        render: function (data, type, full, meta) {
            var addDateTime = full.DateAdded.split(' ');
            var addDate = addDateTime[0];
            var item = full.USERNAME + '<br>' + addDate;
            return item;
        }
    }, {
        "title": getLocalizationWord("Published"),
        sortable: false,
        render: function (data, type, full, meta) {
            var maquinariaJR = '';
            
            if (full.MaquinariaJRLink != '') {
                maquinariaJR = '<button  class="btn btn-sm btn-default"  style="padding:4px 7px;" data-toggle="tooltip" data-placement="top" title="LINK TO MAQUINARIA JR" onclick="gotoLink(\'' + full.MaquinariaJRLink + '\')"><img class="publish-icon" src="' +  base_url + '/assets/images/publish_icon/maquinaria_active_icon.png"></button>';
            }
            else {
                maquinariaJR = '';
            }

            return maquinariaJR;
        }
    }, {
        "title": getLocalizationWord("Details"),
        sortable: true,
        render: function (data, type, full, meta) {
            var capacity = '';

            

            if (parseFloat(full.Capacity)) {

                var unit = '';
                for (var i = 0 ; i < Special_field_array.length; i++) {
                    if (full.EqCategory == Special_field_array[i].category) {
                        unit = Special_field_array[i].unit.Capacity;
                        break;
                    }
                }
                                
                apacity = full.Capacity + ' ' + getLocalizationWord(unit) + '<br>';                    
            }

            var length = '';
            if (parseFloat(full.Length)) {
                length = full.Length +  '<br>';
            }

            var hour = '';
            if (parseFloat(full.Hours)) {
                hour = full.Hours + ' ' + getLocalizationWord('Hours') + '<br>';
            }

            var type = '';
            if (full.Type) {
                type = getLocalizationWord(full.Type) + '<br>';
            }

            var cab = '';
            if (parseInt(full.Cab)) {
                cab = full.Cab == 1 ? '' : getLocalizationWord('Cabin') + '<br>';
            }

            var wd = '';
            if (parseInt(full['4WD'])) {
                wd = full['4WD'] == 1 ? '' : getLocalizationWord('4WD') + '<br>';
            }

            var ext = '';
            if (parseInt(full.Ext)) {
                ext = full.Ext == 1 ? '' : getLocalizationWord('Extendahoe') + '<br>';
            }

            var auxHyd = '';
            if (parseInt(full.AuxHyd)) {
                auxHyd = full.AuxHyd == 1 ? '' : getLocalizationWord('AuxHyd') + '<br>';
            }

            var ripper = '';
            if (parseInt(full.Ripper)) {
                ripper = full.Ripper == 1 ? '' : getLocalizationWord('Ripper') + '<br>';
            }

            return capacity + length + hour + type + cab + wd + ext + auxHyd + ripper;
        }
    }, {
        "title": getLocalizationWord("Truck Info"),
        sortable: false,
        render: function (data, type, full, meta) {
            var truckYear = '';
            if (parseInt(full.TruckYear)) {
                truckYear = full.TruckYear + '<br>';
            }

            var truckMake = '';
            if (full.TruckMake) {
                truckMake = full.TruckMake + '<br>';
            }

            var truckModel = '';
            if (full.TruckModel) {
                truckModel = full.TruckModel + '<br>';
            }

            var engine = '';
            if (full.Engine) {
                engine = full.Engine + '<br>';
            }

            var truckTrans = '';
            if (full.TruckTrans) {
                truckTrans = full.TruckTrans + '<br>';
            }

            var suspension = '';
            if (full.Suspension) {
                suspension = full.Suspension + '<br>';
            }

            var truckCondition = '';
            if (full.TruckCondition) {
                truckCondition = full.TruckCondition + '<br>';
            }
            return truckYear + truckMake + truckModel + engine + truckTrans + suspension + truckCondition;
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
    });

    $('#ReturnAmount').inputFilter(function (value) {
        return /^-?\d*[.]?\d*$/.test(value) && (value === "" || parseInt(value) >= 0);        
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

    // Mask Here
    var phoneConfig = {
        onlyCountries : phoneCountries,
        preferredCountries : ["mx"],
        separateDialCode : true,
        nationalMode : false,
        utilsScript : base_url + 'assets/vendor/intlTelInput/js/utils.js',
        formatOnDisplay : true,
        autoPlaceholder : ''
    };    

    $('#PhoneEdit').intlTelInput(phoneConfig);    

    renderTB();
    renderDealsTB();

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

    $('#LogisticsEqCategory').html(get_translated_equipment_category_element());
    $('#Estado').html(get_state_options_elements('Mexico'));

});

function renderDealsTB() {

    managementDealTB = $('#auction-management-table').DataTable({
        'processing': true,
        'serverSide': true,
        'ajax': {
            url: base_url + 'Deals/getTruckData',
            type: 'POST',
            data: function (d) {
                d.minYear = $('#minYearInput').val();
                d.maxYear = $('#maxYearInput').val();
                d.minAucYear = $('#minAucYearInput').val();
                d.maxAucYear = $('#maxAucYearInput').val();
                d.minTotal = $('#minTotalInput').val();
                d.maxTotal = $('#maxTotalInput').val();
                d.minLiftCapacity = $('#minLiftCapacity').val();
                d.maxLiftCapacity = $('#maxLiftCapacity').val();
                d.searchText = getTranslatedWordForSearch($('#searchDealInput').val());
                d.tvMode = "all";
                d.published = "all";
                d.categoryName = Glo_Category;
                d.dealType = Glo_DealType;
            }
        },
        "columns": DealColumnData,
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
        'order': [[7, 'desc']],
        'autoWidth': true,
        'drawCallback': function (setting) {

            if (Glo_Category == 'All Equipments') {
                managementDealTB.column(9).visible(true);
            } else {

                var has_truck_info = has_truck_special_field(Glo_Category);
                if (has_truck_info) {
                    managementDealTB.column(9).visible(true);
                } else {
                    managementDealTB.column(9).visible(false);
                }
            }

             $('#selected-label-total').html(setting['_iRecordsDisplay']);

             $('#allCheck').prop('checked', false);
        },
        'fnRowCallback' :  function (nRow, aData, iDisplayInex, iDisplayIndexFull) {
            var today = new Date();
            var tomorrow = new Date();
            tomorrow.setDate(today.getDate() + 1);
            var startDate = new Date(aData.StartDate);
            
            if (aData.DealType == 'Auction' && (today >= startDate || tomorrow >= startDate)) {                
                $td = $('td', nRow);
                console.log($td);   
                $td[4].style.backgroundColor =  'rgb(128, 128, 128)';
                $td[4].style.color =  'black';
                $td[4].style.fontWeight =  'bolder';
            }
                
        }

    });
}

function renderTB() {
    managementTB = $('#lead-management-table').DataTable({
        'processing': true,
        'serverSide': true,
        'ajax': {
            url: base_url + 'Sales/getSalesData',
            type: 'POST',
            data: function (d) {      
                d.user = $('#usernameInput').val();
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
                d.salesRep = $('#usernameInput').val();
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
    getMonthlySalesStatus();
    getActiveSalesStatus();
    getReadySalesStatus();
    getNoDealSalesStatus();

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

function onDeal(ID) {

    $('#edit-item-id').val(ID);

    $('#inputDealType').val('Auction');
    $('#DealModal').modal('show');
}

$('#btnSelectDeal').click(function() {

    console.log("Select Deal");
    $('#DealModal').modal('hide');
    var DealType = $('#inputDealType').val();

    if (DealType != 'Manufacturing' && DealType != 'Logistics') {
        $('#SalesPanel').hide();

        $('#btnStepPrev').hide();
        $('#btnComplete').hide();
        $('#DealsPanel').show();

        $('#ItemSelectionPanel').show();
        $('#AdditionalInfoPanel').hide();

        managementDealTB.ajax.reload();
    }
    else if (DealType == 'Manufacturing') {
        $('#ManuEqCategory').val('Dump Truck');

        $('#ManuDumpTruckPanel').show();
        $('#ManuWaterTruckPanel').hide();

        $('#ManufacturingModal').modal('show');
    }
    else if (DealType == 'Logistics') {
        $('#Country').val('USA');
        $('#FinalCountry').val('Mexico');
        $('#City').val('');
        $('#FinalCity').val('');
        $('#LogisticsEqCategory').val('Accessory');
        $('#LogitsticsSalesID').val($('#edit-item-id').val());

        $('#EqSN').val('');

        showEquipmentInfoElement('Accessory');
        showTruckInfoElement('Accessory');
        onCountryChange();
        $('#LogisticsModal').modal('show');
    }
});

$('#LogisticsEqCategory').change(function() {
    var EqCategory = $('#LogisticsEqCategory').val();
    showEquipmentInfoElement(EqCategory);
    showTruckInfoElement(EqCategory);
});

function showEquipmentInfoElement(category) {
    for (var i = 0; i < Special_field_array.length; i++) {
        if (category == Special_field_array[i].category) {
            var input_field = Special_field_array[i].equip_info_fields;

            var contentElement = '';

            for (field of input_field) {
                if (field == 'EqYear') {
                    contentElement += 
                        '<div class="form-group col-lg-4">' +
                        '<label>' + getLocalizationWord('Equipment Year') + '</label>' +
                        '<input class="form-control" id="EqYear" name="EqYear" >' +
                        '</div>';
                }
                if (field == 'EqMake') {
                    contentElement += 
                        '<div class="form-group col-lg-4">' +
                        '<label>' + getLocalizationWord('Equipment Manufacturer') + '</label>' +
                        '<input type="text" class="form-control" id="EqMake" name="EqMake" maxlength="25" required >' +
                        '</div>';
                }
                if (field == 'EqModel') {
                    contentElement += 
                        '<div class="form-group col-lg-4">' +
                        '<label>' + getLocalizationWord('Equipment Model') + '</label>' +
                        '<input type="text" class="form-control" id="EqModel" name="EqModel" maxlength="25" >' +
                        '</div>';
                }
            }
        }

        if (contentElement == '') {
            $('#EquipmentInfoGroup').hide();
        }
        else {
            $('#EquipmentInfoGroup').show();
            $('#EquipmentInfoPanel').html(contentElement);
        }
    }
}

function showTruckInfoElement(category) {
    var has_truck_info = has_truck_special_field(category); 

    if (has_truck_info == false) {
        $('#TruckInfoGroup').hide();    
        return;    
    }

    $('#TruckInfoGroup').show();

    var contentElement = '';
    special_field_array = ['TruckYear', 'TruckMake', 'TruckModel', 'TruckCondition'];
    for (field of special_field_array) {
        if (field == 'TruckYear') {
            contentElement += '<div class="col-lg-4 col-md-12">' +
                ' <div class="form-group">' +
                '<label>' + getLocalizationWord('Truck Year') + '</label>' +
                '<input  class="form-control" id="TruckYear" name="TruckYear" required>' +
                '</div>' +
                '</div>';
        }
        if (field == 'TruckMake') {
            contentElement += '<div class="col-lg-4 col-md-12">' +
                '<div class="form-group">' +
                '<label>' + getLocalizationWord('Truck Manufacturer') + '</label>' +
                '<input type="text" class="form-control" maxlength="25" id="TruckMake" name="TruckMake" required>' +
                '</div>' +
                '</div>';
        }
        if (field == 'TruckModel') {
            contentElement += '<div class="col-lg-4 col-md-12">' +
                '<div class="form-group">' +
                '<label>' + getLocalizationWord('Truck Model') + '</label>' +
                '<input type="text" class="form-control" maxlength="20" id="TruckModel" name="TruckModel">' +
                '</div>' +
                '</div>';
        }
        if (field == 'TruckCondition') {
            contentElement += 
                '<div class="form-group col-lg-4">' +
                '<label>' + getLocalizationWord('Condition') + ' [mi/km]</label>' +
                '<div style="display:flex;">' +
                '<input type="number" class="form-control has-unit" maxlength="25" id="TruckCondition" name="TruckCondition">&nbsp;' +
                '<select class="form-control unit-select" id="TruckConditionUnit" name="TruckConditionUnit" style="width: 75px;">'+
                ' <option value="mi">mi</option>' +
                ' <option value="km">km</option>' +
                '</select>'+
                '</div>' +
                '</div>';
        }
    }

    $('#TruckInfoPanel').html(contentElement);
}

function onCountryChange() {
    var country = $('#Country').val();
    if (country != 'Other') {
        var options = get_state_options_elements(country);
        $('#State').html(options);
    }
    else {
        $('#State').html('<option value=""></option>');
    }

    country = $('#FinalCountry').val();
    if (country != 'Other') {
        var options = get_state_options_elements(country);
        $('#FinalState').html(options);
    }
    else {
        $('#FinalState').html('<option value=""></option>');
    }
}

$('#btnLogisticsSave').click(function() {
    var ID = $('#edit-item-id').val();
    showSpinner();          
    $.ajax({
        url: base_url + "Sales/addLogistics",
        method: "POST",
        data: new FormData($('#LogisticsForm').get(0)),
        contentType: false,
        cache: false,
        processData: false,
        dataType: "json",
        success: function (result) {
            hiddenSpinner();
            $('#LogisticsModal').modal("hide");

            if (result.success == true) {
                toastr.success(LocalizationMessage('Add Deal to Sale'));
                logSuccessActivity('Add Deal to Sale', ID, 'tblSales');
                websocket.send(JSON.stringify({ 'msg': 'sales', 'poster': $('#usernameInput').val() }));
                refreshDatatable();
            } else {
                toastr.error(LocalizationMessage('Add Deal to Sale') + ' Error');
                logErrorActivity('Add Deal to Sale', ID, 'tblSales', data.message);
                return;
            }
        }
    });
});
 

$('#ManuEqCategory').change(function() {
    var ManuEqCategory = $('#ManuEqCategory').val();

    if (ManuEqCategory == 'Dump Truck') {
        $('#ManuDumpTruckPanel').show();
        $('#ManuWaterTruckPanel').hide();
    }
    else {
        $('#ManuDumpTruckPanel').hide();
        $('#ManuWaterTruckPanel').show();
    }
});

$('#btnManuSave').click(function() {
    var ID = $('#edit-item-id').val();
    var EqCategory = $('#ManuEqCategory').val();
    var Capacity = 0;
    if (EqCategory == 'Dump Truck')
        Capacity = $('#ManuDumpTruckCapacity').val();
    else   
        Capacity = $('#ManuWaterTruckCapacity').val();

    var WaterTruckType = $('#ManuWaterTruckType').val();

    showSpinner();
    $('#ManufacturingModal').modal('hide');

    $.ajax({
        url : base_url + 'Sales/addManufacture',
        type : 'post',
        data : {
            ID : ID,
            EquipmentCategory : $('#ManuEqCategory').val(),
            Capacity : Capacity,
            wtType : WaterTruckType,
            TruckMake : $('#ManuTruckMake').val(),
            TruckModel : $('#ManuTruckModel').val(),
            TruckYear : $('#ManuTruckYear').val(),
            TruckEngine : $('#ManuTruckEngine').val(),
            TruckTrans : $('#ManuTruckTransmission').val()
        },
        success : function (res) {
            hiddenSpinner();
            var data = JSON.parse(res);

            if (data.success == false) {
                toastr.error(LocalizationMessage('Add Deal to Sale') + ' Error');
                logErrorActivity('Add Deal to Sale', ID, 'tblSales', data.message);
                return;
            }

            $('#ManuTruckMake').val('');
            $('#ManuTruckModel').val('');
            $('#ManuTruckYear').val('');
            $('#ManuTruckEngine').val('');
            $('#ManuTruckTransmission').val('');

            toastr.success(LocalizationMessage('Add Deal to Sale'));
            logSuccessActivity('Add Deal to Sale', ID, 'tblSales');
            websocket.send(JSON.stringify({ 'msg': 'sales', 'poster': $('#usernameInput').val() }));
            refreshDatatable();
        }
    })
});

$('#btnBack').click(function() {
    console.log('back clicked');

    Glo_DealType = 'Auction';
    Glo_Category = 'All Equipments';
    $('#SalesPanel').show();
    $('#DealsPanel').hide();
});

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

function onSelectDeal(ID) {

    Glo_SelectedDeal = ID;

    $('#btnStepPrev').show();
    $('#btnComplete').show();

    $('#ItemSelectionPanel').hide();
    $('#AdditionalInfoPanel').show();
    
    $('#stepTaxInfo').addClass('active');    

    renderAddtionalInfoPanel();
}

$('#btnStepPrev').click(function() {
    $('#btnStepPrev').hide();
    $('#btnComplete').hide();

    $('#ItemSelectionPanel').show();
    $('#AdditionalInfoPanel').hide();
    
    $('#stepTaxInfo').removeClass('active');
});

$('#btnComplete').click(function() {
    showSpinner();

    var ID = $('#edit-item-id').val();

    $.ajax({
        url : base_url + 'Sales/addDeal',
        type : 'post',
        data : {
            ID : $('#edit-item-id').val(),
            DealType : Glo_DealType,
            DealID : Glo_SelectedDeal,
            Price : $('.PriceInput').val(),
            Customs : $('.CustomsInput').val(),
            Comm : $('.CommInput').val(),
            Shipping : $('.ShippingInput').val(),
            Discount : $('.DiscountInput').val(),       
            BuyPremium : $('.BuyPremiumInput').val(),
            SalesCurrency : $('#SalesCurrency').val(),
            TaxP : $('#taxRate').val(),
            TaxAmount : numbeWithoutCommas($('#taxAmount').html()),
            Total : numbeWithoutCommas($('#totalAmount').html())
        },
        success : function(res) {
            hiddenSpinner();
            var data = JSON.parse(res);

            if (data.success == false) {
                toastr.error(LocalizationMessage('Add Deal to Sale') + ' Error');
                logErrorActivity('Add Deal to Sale', ID, 'tblSales', result.message);
                return;
            }

            toastr.success(LocalizationMessage('Add Deal to Sale'));
            logSuccessActivity('Add Deal to Sale', ID, 'tblSales');
            websocket.send(JSON.stringify({ 'msg': 'sales', 'poster': $('#usernameInput').val() }));

            Glo_DealType = 'Auction';
            Glo_Category = 'All Equipments';
            $('#SalesPanel').show();
            $('#DealsPanel').hide();
            refreshDatatable();
        }
    })
});

function onClearDeal(ID) {
    $.ajax({
        url : base_url + 'Sales/clearDeal',
        type : 'post',
        data : {
            ID : ID
        },
        success : function(res) {
            var data = JSON.parse(res);

            if (data.success == false) {
                toastr.error(LocalizationMessage('Delete Deal form Sale') + ' Error');
                logErrorActivity('Delete Deal from Sale', ID, 'tblSales', data.message);
                return;
            }

            toastr.success(LocalizationMessage('Delete Deal from Sale'));
            logSuccessActivity('Delete Deal from Sale', ID, 'tblSales');
            websocket.send(JSON.stringify({ 'msg': 'sales', 'poster': $('#usernameInput').val() }));
            refreshDatatable(false);
        }
    });
}

function onClone(ID) {

    $.ajax({
        url : base_url + 'Sales/clone',
        type : 'post',
        data : {
            ID : ID
        },
        success : function(res) {
            var data = JSON.parse(res);

            if (data.success == false) {
                toastr.error(LocalizationMessage('Add Sale for Existing Customer') + ' Error');
                logErrorActivity('Add Sale for Existing Customer', ID, 'tblSales', data.message);
                return;
            }

            toastr.success(LocalizationMessage('Add Sale for Existing Customer'));
            logSuccessActivity('Add Sale for Existing Customer', ID, 'tblSales');
            websocket.send(JSON.stringify({ 'msg': 'sales', 'poster': $('#usernameInput').val() }));
            refreshDatatable(false);
        }
    })
}

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

            if (data.DealType == 'For Sale') {
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

function onNote(ID) {
    $('#edit-item-id').val(ID);

    $('#Note').val('');    
    $('#NoteModal').modal('show');
}

$('#btnNote').click(function() {    
    var ID = $('#edit-item-id').val();

    $('#NoteModal').modal('hide');
    showSpinner();
    $.ajax({
        url : base_url + 'Sales/addNote',
        type : 'post',
        data : {
            ID : ID,
            Note : replaceNR2Br($('#Note').val())
        },
        success : function(ret) {
            hiddenSpinner();

            var data = JSON.parse(ret);

            if (data.success == false) {
                toastr.error(LocalizationMessage('Add Note') + ' Error');
                logErrorActivity('Add Note', ID, 'tblSales', data.message);
                return;
            }

            toastr.success(LocalizationMessage('Add Note'));      
            websocket.send(JSON.stringify({ 'msg': 'sales', 'poster': $('#usernameInput').val() }));      
            logSuccessActivity('Add Note', ID, 'tblSales');
        }
    });
});

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

function onContact(ID) {
    $('#edit-item-id').val(ID);

    $('#ContactDate').val('');
    $('#ContactNote').val('');
    $('#ContactModal').modal('show');
}

$('#btnContact').click(function() {
    var ID = $('#edit-item-id').val();
    $('#ContactModal').modal('hide');

    showSpinner();
    $.ajax({
        url : base_url + 'Sales/contact',
        type : 'post',
        data : {
            ID : ID,
            ContactDate : $('#ContactDate').val(),
            Note : replaceNR2Br($('#ContactNote').val())
        },
        success : function(res) {
            hiddenSpinner();

            var data = JSON.parse(res);

            if (data.success == false) {
                toastr.error(LocalizationMessage('Schedule Contact') + ' Error');
                logErrorActivity('Schedule Contact', ID, 'tblSales', data.message);
                return;
            }

            toastr.success(LocalizationMessage('Schedule Contact'));
            logSuccessActivity('Schedule Contact', ID, 'tblSales');
            websocket.send(JSON.stringify({ 'msg': 'sales', 'poster': $('#usernameInput').val() }));
            refreshDatatable(false);
        },
        error : function() {
            hiddenSpinner();
            toastr.error('Contact Failed');
        }
    });    
});

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
    $('#DepositRemainingAmount').html(numberWithCommas(Number(Total - TotalDeposit).toFixed(2)) + ' ' + SalesCurrency);
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
                    toastr.error(LocalizationMessage('Deposit exceeds Total Error'));
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
                    '<div><label>' + getLocalizationWord('Deposit Date') + ': </label>&nbsp;<label style="font-weight: bolder;">' + getDatefromDateTime(data.Date) +'</label></div>' +
                    '<div><label>' + getLocalizationWord('Added By') + ': </label>&nbsp;<label style="font-weight: bolder;">' + data.DepositUser + " " + (data.UpdateDate != '0000-00-00 00:00:00' ? getShortDateTime(data.UpdateDate) : "") +'</label></div>' +             
                    '<div><label>' + getLocalizationWord('Amount') + ': </label>&nbsp;<label style="font-weight: bolder;">'+ numberWithCommas(data.Amount) + '</label></div>' + 
                    '<div><label>' + getLocalizationWord('Currency') + ': </label>&nbsp;<label style="font-weight: bolder;">' + data.Currency + '</label></div>' + 
                    '<div><label>' + getLocalizationWord('Exchange Rate') + ': </label>&nbsp;<label style="font-weight: bolder;">' + data.ExchangeRate + '</label></div>' + 
                    '<div><label>' + getLocalizationWord('Converted Amount') + ': </label>&nbsp;<label style="font-weight: bolder;">'+ numberWithCommas(data.RealAmount) + '</label></div>' + 
                    '<div><label>' + getLocalizationWord('Deposit Type') + ': </label>&nbsp;<label style="font-weight: bolder;">'+ getLocalizationWord(data.DepositType) + '</label></div>' + 
                    '<div><label>' + getLocalizationWord('Concept') + ': </label>&nbsp;<label style="font-weight: bolder;">'+ data.Concept +'</label></div>' + 
                    '<div style="text-align: right;">' + 
                        '<button class="btn btn-default" onclick="receiptDownload(\'' + data.ReceiptPhoto + '\', ' + data.ID + ');" '+ disabled + '>' + getLocalizationWord('Download') + '</button>';
                    if ($('#accounting').val() == 'ON' || $('#permission').html() == 'admin')
                        html += '&nbsp;<button class="btn btn-default" onclick="depositEdit(' + data.ID + ');">' + getLocalizationWord('Edit') + '</button>';
                html += '</div>';
            $('.depositHistoryPanel').html(html);
        },
        error : function() {
            toastr.error('Get Deposit Data Eror');
            hiddenSpinner();
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

$('#inputDealType').change(function() {
    Glo_DealType = $('#inputDealType').val();
}) 

function renderAddtionalInfoPanel() {
    showSpinner();

    var ID = $('#edit-item-id').val();
    var DepositCurrency = '';

    $.ajax({
        url : base_url + 'Sales/getDepositCurrency',
        type : 'post',
        data : {
            ID : ID
        },
        async : false,
        cache : false,
        timeout : 30000,
        success : function(res) {
            DepositCurrency = JSON.parse(res);

            console.log(DepositCurrency);
            if (DepositCurrency == '') {
                $('#SalesCurrency').html(
                    '<option value="USD">USD</option>' + 
                    '<option value="MXN">MXN</option>'
                );
                $('#SalesCurrency').val('USD');
            }
            else if (DepositCurrency == 'USD') {
                $('#SalesCurrency').html(
                    '<option value="USD">USD</option>'
                );
                $('#SalesCurrency').val('USD');
            }
            else if (DepositCurrency == 'MXN') {
                $('#SalesCurrency').html(
                    '<option value="MXN">MXN</option>'
                );
                $('#SalesCurrency').val('MXN');
            }
    
        }
    });

    
    $('#addtionalInfoPanelBody').html();
    var html = '';

    $.ajax({
        url : base_url + 'Deals/getTruckById',
        type : 'post',
        data : {
            id : Glo_SelectedDeal
        },
        async: false,
        cache: false,
        timeout: 30000,
        success : function(data) {
            var result = JSON.parse(data);

            $imgUrl = base_url + "assets/images/primaryImages/" + result.PrimaryImage;
            
            html += '<tr>' +
                        '<td>'+ 1 + '</td>'+
                        '<td>' + 
                            '<div class="photo-cell" style="background-image: url(\'' + $imgUrl +'\')">'+
                                '<img  class="auction-photo" src="' + $imgUrl +'" >' +
                            '</div>'+
                        '</td>'+
                        '<td>'+
                            '<h6 class="mb-0">'+ getTitleFromDatabase(result) +'</h6>'+
                            '<span>'+ getLocalizationWord(result.DealType) + '</span>'+
                        '</td>'+
                        '<td style="vertical-align:middle; min-width: 250px;">'+
                            '<span>' + getLocalizationWord('Price') + ': </span><input type="number" class="PriceInput form-control" onchange="Calculate(this);" value="' + result.Price + '" onkeyup="this.onchange();" onpaste="this.onchange();" oninput="this.onchange();"><br>'+
                            '<span class="CustomsInputTitle">' + getLocalizationWord('Customs') + ': </span><input type="number" class="CustomsInput form-control" onchange="Calculate(this);" value="'+ result.Customs +'" onkeyup="this.onchange();" onpaste="this.onchange();" oninput="this.onchange();">'+                            
                        '</td>'+
                        '<td style="vertical-align:middle; min-width: 250px;">'+                            
                            '<span class="DiscountInputTitle">' + getLocalizationWord('Discount') + ': </span><input type="number" class="DiscountInput form-control" onchange="Calculate(this);" value="0" onkeyup="this.onchange();" onpaste="this.onchange();" oninput="this.onchange();"><br>' +
                            '<span class="ShippingInputTitle">' + getLocalizationWord('Shipping') + ': </span><input type="number" class="ShippingInput form-control" onchange="Calculate(this);" value="' + result.Shipping +'" onkeyup="this.onchange();" onpaste="this.onchange();" oninput="this.onchange();">'+
                        '</td>'+
                        '<td style="vertical-align:middle; min-width: 250px;">'+    
                            '<span class="CommInputTitle">' + getLocalizationWord('Comm') + ': </span><input type="number" class="CommInput form-control" onchange="Calculate(this);" value="' + result.Commission + '" onkeyup="this.onchange();" onpaste="this.onchange();" oninput="this.onchange();"><br>'+
                            '<span class="BuyPremiumInputTitle">' + getLocalizationWord('Buyer\'s Premium Amount') + ': </span><input type="number" class="BuyPremiumInput form-control" onchange="Calculate(this);" value="'+ result.BuyPremium +'" onkeyup="this.onchange();" onpaste="this.onchange();" oninput="this.onchange();">'+
                        '</td>'+
                        '<td><span class="TotalInput">'+ numberWithCommas(result.Total) + '</span> <span class="SalesCurrency">' + $("#SalesCurrency").val() +'</span></td>'+                
                    '</tr>';
        }
    });

    $('#addtionalInfoPanelBody').html(html);

    if (Glo_DealType == 'For Sale') {
        hidePriceElement('BuyPremiumInput');        
    }
    else if (Glo_DealType == 'Consignment') {
        hidePriceElement('BuyPremiumInput');   
        hidePriceElement('CustomsInput');   
        hidePriceElement('ShippingInput');
    }
    else if (Glo_DealType == 'Inventory') {
        hidePriceElement('BuyPremiumInput');   
        hidePriceElement('ShippingInput');   
        hidePriceElement('CustomsInput');   
        hidePriceElement('CommInput');   
    }

    CalculateTotal();

    hiddenSpinner();
}

function hidePriceElement(className) {
    $('.' + className).hide();    
    $('.' + className + 'Title').hide();
}

$('#taxRate').change(function() {
    CalculateTotal();
});



function Calculate(element) {
    var tr = $(element).parent().parent().get(0);    
    var Price = tr.getElementsByClassName('PriceInput');
    var BuyPremium = tr.getElementsByClassName('BuyPremiumInput');
    var Shipping = tr.getElementsByClassName('ShippingInput');
    var Customs = tr.getElementsByClassName('CustomsInput');
    var Comm = tr.getElementsByClassName('CommInput');
    var Discount = tr.getElementsByClassName('DiscountInput');
    
    var valPrice = Number(Price[0].value);
    var valShipping = Number(Shipping[0].value);
    var valCustoms = Number(Customs[0].value);
    var valComm = Number(Comm[0].value);
    var valBuyPremium = Number(BuyPremium[0].value);
    var valDiscount = Number(Discount[0].value);

    total = valBuyPremium  + valPrice + valShipping + valCustoms + valComm - valDiscount;
    
    TotalInput = tr.getElementsByClassName('TotalInput');
    TotalInput[0].innerHTML = numberWithCommas(total);

    CalculateTotal();
}

function CalculateTotal() {

    var additionaInfoBody = document.getElementById('addtionalInfoPanelBody');
    var total = additionaInfoBody.getElementsByClassName('TotalInput');
    console.log(total);
    var subTotalPrice = 0;

    for (var i = 0; i < total.length; i++) {
        subTotalPrice += Number(numbeWithoutCommas(total[i].innerHTML));
    }
    subTotalPrice = subTotalPrice.toFixed(2);
    var taxRate = $('#taxRate').val();
    var taxAmount = subTotalPrice * Number(taxRate) / 100;
    taxAmount = taxAmount.toFixed(2);
    var totalPrice = Number(subTotalPrice) + Number(taxAmount);
    totalPrice = totalPrice.toFixed(2);
    
    SetSalesCurrency();

    $('#subTotal').html(numberWithCommas(subTotalPrice));
    $('#taxAmount').html(numberWithCommas(taxAmount));
    $('#totalAmount').html(numberWithCommas(totalPrice));
}

$('#SalesCurrency').change(function() {
    $('.SalesCurrency').html($('#SalesCurrency').val());
});

function SetSalesCurrency() {
    $('.SalesCurrency').html($('#SalesCurrency').val());
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

function receiptCloseDownload(receipt, ID) {    
    var url = base_url + 'assets/images/closeSale/' + receipt;    
    var newElement = $("<a href='" + url + "' download='" + receipt + "'>test</a>");
    $(newElement)[0].click();

    toastr.success(LocalizationMessage('Download Sale Picture'));
    logSuccessActivity('Download Sale Picture', ID, 'tblSales');
}


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

function onEditCustomer(id) {
    console.log('Edit Clicked');       

    showSpinner();
    
    $.ajax({
        url : base_url + 'Customers/getCustomerByID',
        type : 'POST',
        data : {
            ID : id
        },
        success : function(data) {
            console.log(data);
            result = JSON.parse(data);
            

            $('#edit-item-id').val(id);            
            $('#NameEdit').val(result.Name);
            $('#LastNameEdit').val(result.LastName);
            $('#PhoneEdit').intlTelInput('setNumber', result.Phone);
            $('#EmailEdit').val(result.Email);    
            $('#CompanyEdit').val(result.Company);
            $('#CountryEdit').val(result.Country);
            $('#StateEdit').val(result.State);
            $('#CityEdit').val(result.City);

            hiddenSpinner();

            $('#editCusomterModal').modal('show');
        }
    });
}

$('#btnUpdateCustomer').click(function() {
    console.log('Edit Customer');

    if (!$('#editCusomterForm').valid())
        return;  

    $('#editCusomterModal').modal('hide');
    showSpinner();
    $id = $('#edit-item-id').val();

    $.ajax({
        url : base_url + 'Customers/UpdateCustomer',
        type : 'post',
        data : {
            ID : $id,
            Name : $('#NameEdit').val(),
            LastName : $('#LastNameEdit').val(),
            Phone : $('#PhoneEdit').intlTelInput('getNumber'),
            Email : $('#EmailEdit').val(),
            CompanyName : $('#CompanyEdit').val(),
            Country : $('#CountryEdit').val(),
            State : $('#StateEdit').val(),
            City : $('#CityEdit').val()
        },
        success : function(data) {
            result = JSON.parse(data);
            hiddenSpinner();

            if (result.success == false) {                
                toastr.error(LocalizationMessage('Edit Customer') + ' Error');
                logErrorActivity('Edit Customer', $id, 'tblCustomer', result.message);
            }
            else {            
                $('#NameEdit').val('');
                $('#LastNameEdit').val('');
                $('#PhoneEdit').val('');
                $('#EmailEdit').val('');
                $('#CompanyEdit').val('');                
                $('#StateEdit').val('');
                $('#CityEdit').val('');
                toastr.success(LocalizationMessage('Edit Customer'));
                logSuccessActivity('Edit Customer', $id, 'tblCustomer');
                websocket.send(JSON.stringify({ 'msg': 'edit_customer', 'poster': $('#usernameInput').val() }));
                refreshDatatable();
            }
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


function getMonthlySalesStatus() {
    $.ajax({
        url : base_url + 'Sales/getMonthlySalesStatus',
        type : 'post',
        data : {
            SalesRep : $('#usernameInput').val()
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
            SalesRep : $('#usernameInput').val()
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
            SalesRep : $('#usernameInput').val()
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
            SalesRep : $('#usernameInput').val()
        },
        success : function(res) {
            var data = JSON.parse(res);

            $('#NoDealSalesCount').html(data.count);
        }
    })
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

    exportTableToExcel('MySales'+ $('#usernameInput').val() + year + month + day);
});

function exportTableToExcel( filename = '') {

    showSpinner();

    $.ajax({
        url: base_url + 'Sales/getSalesDataForExcel',
        type: 'POST',
        data:  {                
            user : $('#usernameInput').val(),
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

// For todays date;
Date.prototype.today = function () { 
    return this.getFullYear() + "-"+(((this.getMonth()+1) < 10)?"0":"") + (this.getMonth()+1) +"-" + ((this.getDate() < 10)?"0":"") + this.getDate();
}

// For the time now
Date.prototype.timeNow = function () {
     return ((this.getHours() < 10)?"0":"") + this.getHours() +":"+ ((this.getMinutes() < 10)?"0":"") + this.getMinutes();
}

function getCheckedValueForDocument(value) {
    if (value == null || value == '')
        return '';
    return "<li>" + value + '</li>';
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
                else if (full.DealType == 'For Sale')
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
                else if (full.DealType == 'For Sale')
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

            var element = document.getElementById('DepositDocument');
            $('#DepositDocument').show();
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



function logSuccessActivity(Activity, ID, Table) {
    $.ajax({
        url : base_url + 'Activity/addActivity',
        type : 'post',
        data : {
            Activity : Activity,
            ObjectiveTable : Table,
            ObjectiveID : ID,
            Webpage : 'Sales.MySale',
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
            Webpage : 'Sales.MySale',
            Status : 'Error',
            Error : ErrorMsg
        },
        success : function() {
            websocket.send(JSON.stringify({ 'msg': 'activity', 'poster': $('#usernameInput').val() }));
        }
    });
}