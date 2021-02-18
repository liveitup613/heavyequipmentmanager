

var managementTB;
var modalTB;

var totalPdfPage = 0;
var totalPdfImageData = [];
var savedProposalId = -1;

var Glo_Category = "All Equipments";
var Glo_DealType = "All Deals";

var Glo_RecordSelectedList = 0;

var id_selected_for_publish = 0;
var site_name = '';

var stepIndex = 0;

// column data
var columnData = [
    {
        "title": "",
        sortable: false,
        "render": function (data, type, full, meta) {                        
            return '<button  class="btn btn-sm btn-default"  data-toggle="" data-placement="top" title="' + getLocalizationWord('Select Item') + '" onclick="setIdToSelectedList(' + full.ID + ', this)">' + getLocalizationWord('Select') + '</button>';           
        }

    },
    {
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
            var eqCategory = '';
            if (lang == 'spanish')
                eqCategory = get_translated_word(full.EqCategory) + '<br>';               
            else 
                eqCategory = full.EqCategory + '<br>';

            var year = '';
            if (parseInt(full.EqYear)) {
                year = full.EqYear + '<br>';
            }
            var make = '';
            if (full.EqMake) {
                make = full.EqMake + '<br>';
            }
            return eqCategory + year + make + full.EqModel;
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
                                
                capacity = full.Capacity + ' ' + unit + '<br>';                
            }

            var length = '';
            if (parseFloat(full.Length)) {
                length = full.Length +  '<br>';
            }

            var hour = '';
            if (parseFloat(full.Hours)) {
                hour = full.Hours + ' hours' + '<br>';
            }

            var type = '';
            if (full.Type) {
                type = full.Type + '<br>';
            }

            var cab = '';
            if (parseInt(full.Cab)) {
                cab = full.Cab == 1 ? '' : 'Cabin' + '<br>';
            }

            var wd = '';
            if (parseInt(full['4WD'])) {
                wd = full['4WD'] == 1 ? '' : '4WD' + '<br>';
            }

            var ext = '';
            if (parseInt(full.Ext)) {
                ext = full.Ext == 1 ? '' : 'Ext' + '<br>';
            }

            var auxHyd = '';
            if (parseInt(full.AuxHyd)) {
                auxHyd = full.AuxHyd == 1 ? '' : 'Aux Hyd' + '<br>';
            }

            var ripper = '';
            if (parseInt(full.Ripper)) {
                ripper = full.Ripper == 1 ? '' : 'Ripper' + '<br>';
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



// set up  truck management table
$(function () {

    $('.loading-box').css('width', $(window).width());
    $('.loading-box').css('height', $(window).height());

    $('.socket-loading-box').css('width', $(window).width());
    $('.socket-loading-box').css('height', $(window).height());

    $('.progress-box-layer').css('width', $(window).width());
    $('.progress-box-layer').css('height', $(window).height());


    renderTB();

    $('.socket-loading-btn').click(function () {
        hiddenSocketLoadingSpinner();
        managementTB.ajax.reload(null, false);  
    })

    $('#searchbtn').click(function () {
        managementTB.ajax.reload();  
    });

    $('#pdfbtn').click(function () {
        $('#pdfModal').modal('show');
        renderModalTB();
    });


    $('#excelbtn').click(function () {
        exportTableToExcel('DealData');
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

        if (msg == 'new_truck') {
            return;
        } else if (msg == 'delete_truck') {

            managementTB.ajax.reload(null, false);  

        } else if (msg == 'save_truck') {

            managementTB.ajax.reload(null, false);  
        } else if (msg == 'unpublish_truck') {

            managementTB.ajax.reload(null, false);
        } else if (msg == 'publish_truck') {

            managementTB.ajax.reload(null, false);
        }
    }


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

    var categoryValue = '<option value="All Equipments">' + getLocalizationWord('All Equipment') + '</li>';
    categoryValue += get_translated_equipment_category_element();
    $('#inputEqCategory').html(categoryValue);

    showEquipmentSelectPanel();
    $('#LogisticsEqCategory').html(get_translated_equipment_category_element());
});

function renderTB() {

    managementTB = $('#auction-management-table').DataTable({
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
                d.searchText = $('#searchInput').val();
                d.tvMode = "all";
                d.published = "all";
                d.categoryName = Glo_Category;
                d.dealType = Glo_DealType;
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
        'order': [[7, 'desc']],
        'autoWidth': true,
        'drawCallback': function (setting) {
            $('[data-toggle="tooltip"]').tooltip({boundary: 'window'});
          

            if (Glo_Category == 'All Equipments') {
                managementTB.column(9).visible(true);
            } else {

                var has_truck_info = has_truck_special_field(Glo_Category);
                if (has_truck_info) {
                    managementTB.column(9).visible(true);
                } else {
                    managementTB.column(9).visible(false);
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

function showEquipmentSelectPanel() {
    var Type = $('#edit-item-type').val();

    if (Type == 'equipment') {
        hideAllSelectionPanel();
        $('.EquipmSelectPanel').css('display', 'flex');
    }
    else if (Type == 'manufacturing') {
        hideAllSelectionPanel();
        $('#btnStepNext').show();
        $('#ManuEqCategory').val('Dump Truck');

        $('#ManuDumpTruckPanel').show();
        $('#ManuWaterTruckPanel').hide();
        $('.ManufactureSelectPanel').show();

    }
    else if (Type == 'logistics') {
        hideAllSelectionPanel();
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
        $('#btnStepNext').show();
        $('.LogisticsSelectPanel').show();    
    }
}

function hideAllSelectionPanel() {
    $('.EquipmSelectPanel').hide();
    $('.ManufactureSelectPanel').hide();
    $('.LogisticsSelectPanel').hide();
}

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

function renderPDFPreview() {    
    showSpinner();

    var itemBody = document.getElementById('addtionalInfoPanelBody');
    var result = itemBody.getElementsByTagName('tr');

    $.ajax({
        url: base_url + 'Opportunities/getProposalDocumentData',
        type: 'post',
        data: {
            ID: Glo_RecordSelectedList,
            AssignmentID : $('#edit-item-id').val()
        },
        success: function(res) {
            hiddenSpinner();
            var data =  JSON.parse(res);            
            var customer = data.customer;
            var full = data.deal;

            // Date
            var today = new Date();
            var startDate = today.toLocaleString("en-US", {timeZone: "America/Phoenix"});
            startDate = new Date(startDate);
                
            $('#SaleDate').html(startDate.today());

            // Client
            var client =    getCheckedValueForDocument(customer.Name + " " + customer.LastName) + 
                            getCheckedValueForDocument(customer.Phone) + 
                            getCheckedValueForDocument(customer.Email) + 
                            getCheckedValueForDocument(customer.CompanyName) + 
                            getCheckedValueForDocument(customer.Country) + 
                            getCheckedValueForDocument(customer.State) + 
                            getCheckedValueForDocument(customer.City) + 
                            getCheckedValueForDocument(customer.RFC);
            $('#client-content > ul').html(client);


            // Equipment

            var Type = $('#edit-item-type').val();

            var equipment = '';
            if (Type == 'equipment') {
                $imgUrl = base_url + "assets/images/primaryImages/" + full.PrimaryImage;
                var photoElement = '<div class="photo-cell" style="background-image: url(\'' + $imgUrl + '\')">' +
                    '<img  class="auction-photo" src="' + $imgUrl + '" >' +              
                    '</div>';
                $('#portfolio').html(photoElement);
                $('#portfolio').show();
    
                var DealCode = getCheckedValueForDocument(full.DealID);
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
            else if (Type == 'manufacturing') {
                $('#deal_type').html('Fabricación');
                var ManuEqCategory = $('#ManuEqCategory').val();
                var DealType = '<li>Fabricación</li>';
                var EqCategory = getCheckedValueForDocument($('#ManuEqCategory').val());
                var Capacity = '';

                if (ManuEqCategory == 'Dump Truck') 
                    Capacity = getCheckedValueForDocument($('#ManuDumpTruckCapacity').val());
                else
                    Capacity = getCheckedValueForDocument($('#ManuWaterTruckCapacity').val());
                var TruckMake = getCheckedValueForDocument($('#ManuTruckMake').val());
                var TruckYear = getCheckedValueForDocument($('#ManuTruckYear').val());
                equipment =  DealType + EqCategory + Capacity + TruckMake + TruckYear;
            }
            else if (Type == 'logistics') {
                $('#deal_type').html('Logística');
                var DealType = '<li>Logística</li>';
                var EqCategory = getCheckedValueForDocument($('#LogisticsEqCategory').val());
                var PickUpCity = $('#City').val();
                var PickUpState = $('#State').val();
                var PickUpCountry = $('#Country').val();
                var PickUp = '<li>' + (PickUpCity == '' ? '' : PickUpCity + ', ') +
                            (PickUpState == '' ? '' : PickUpState + ', ') + 
                            PickUpCountry + '</li>';
                            
                var FinalCity = $('#FinalCity').val();
                var FinalState = $('#FinalState').val();
                var FinalCountry = $('#FinalCountry').val();
                var Final = '<li>' + (FinalCity == '' ? '' : FinalCity + ', ') +
                            (FinalState == '' ? '' : FinalState + ', ') + 
                            FinalCountry + '</li>';
                            
                equipment =  DealType + EqCategory + PickUp + Final;
            }

            
            $('#equipment-content > ul').html(equipment);
            // Price 

            var price = '';
            var customs = '';
            var shipping = '';
            var buyPremium = '';
            var comm = '';
            var discount = '';
            var taxRate = '';
            var totalAmount = '';
            var taxAmount = '';
            var subTotal = '';

            if (Type == 'equipment') {
                price = $('.PriceInput').val();
                customs = $('.CustomsInput').val();
                shipping = $('.ShippingInput').val();
                buyPremium = $('.BuyPremiumInput').val();
                comm = $('.CommInput').val();
                discount = $('.DiscountInput').val();                
            }
            else if (Type == 'manufacturing') {
                price = $('.PriceInput').val();
                discount = $('.DiscountInput').val();
                additional = $('.AdditionalInput').val();
            }
            else if (Type == 'logistics') {
                price = $('.PriceInput').val();
                customs = $('.CustomsInput').val();                               
                comm = $('.CommInput').val();
                discount = $('.DiscountInput').val();
                additional = $('.AdditionalInput').val();
            }        
                
            taxRate = $('#taxRate').val();
            totalAmount = $('#totalAmount').html();
            taxAmount = $('#taxAmount').html();
            subTotal = $('#subTotal').html();
            
            var pricePanel ='';

            if (price != '0' && price != '') 
                pricePanel += '<li>Precio: ' + numberWithCommas(price) + ' USD</li>';
            if (customs != '0' && customs != '') 
                pricePanel += '<li>Importación: ' + numberWithCommas(customs) + ' USD</li>';
            if (shipping != '0' && shipping != '') 
                pricePanel += '<li>Flete: ' + numberWithCommas(shipping) + ' USD</li>';
            if (buyPremium != '0' && buyPremium != '') 
                pricePanel += '<li>Comisión de Subasta: ' + numberWithCommas(buyPremium) + ' USD</li>';
            if (comm != '0' && comm != '') 
                pricePanel += '<li>Comisión: ' + numberWithCommas(comm) + ' USD</li>';
            if (discount != '0' && discount != '') 
                pricePanel += '<li>Descuento: ' + numberWithCommas(discount) + ' USD</li>';
            pricePanel += '<li>Sub Total: ' + numberWithCommas(subTotal) + ' USD</li>';            
            pricePanel += '<li>IVA: ' + taxRate + '%</li>';            
            pricePanel += '<li>IVA en Cantidad: ' + numberWithCommas(taxAmount) + ' USD</li>';            
            
            var total = numberWithCommas(Number(numbeWithoutCommas(totalAmount)).toFixed(0)) + ' USD';
            $('#total-price').html(total);

            $('#deal-content > ul').html(pricePanel);

            var user = data.user;
            var footer = user.NAME + ' ' +  user.LASTNAME + ' / Oficina: (653) 518 733 / Cel: ' + getStyledPhoneNumberonDocument(user.PHONE) + ' / Correo: ' + user.EMAIL;
            $('#salesrep_desc').html(footer);
            
        },
        error: function(err) {
            hiddenSpinner();
        }
    });
}

function renderAddtionalInfoPanel() {
    showSpinner();

    $('#addtionalInfoPanelBody').html();
    var html = '';
   
    console.log(Glo_RecordSelectedList);        

    var Type = $('#edit-item-type').val();

    if (Type == 'equipment') {
        $.ajax({
            url : base_url + 'Deals/getTruckById',
            type : 'post',
            data : {
                id : Glo_RecordSelectedList
            },
            async: false,
            cache: false,
            timeout: 30000,
            success : function(data) {
                var result = JSON.parse(data);
    
                $imgUrl = base_url + "assets/images/primaryImages/" + result.PrimaryImage;
                
                html += '<tr>' +
                            '<td>1</td>'+
                            '<td>' + 
                                '<div class="photo-cell" style="background-image: url(\'' + $imgUrl +'\')">'+
                                    '<img  class="auction-photo" src="' + $imgUrl +'" >' +
                                '</div>'+
                            '</td>'+
                            '<td>'+
                                '<h6 class="mb-0">'+ getTitleFromDatabase(result) +'</h6>'+
                                '<span>'+ getLocalizationWord(result.DealType) + '</span>'+
                            '</td>'+
                            '<td style="vertical-align:top">'+
                                '<span>' + getLocalizationWord('Price') + ': </span><input type="number" class="PriceInput form-control" onchange="Calculate(this);" value="' + result.Price + '" onkeyup="this.onchange();" onpaste="this.onchange();" oninput="this.onchange();"><br>'+
                                '<span>' + getLocalizationWord("Buyer's Premium") + ': </span><input type="number" class="BuyPremiumInput form-control" onchange="Calculate(this);" value="'+ result.BuyPremium +'" onkeyup="this.onchange();" onpaste="this.onchange();" oninput="this.onchange();">'+
                            '</td>'+
                            '<td style="vertical-align:top">'+
                                '<span>' + getLocalizationWord('Customs') + ': </span><input type="number" class="CustomsInput form-control" onchange="Calculate(this);" value="'+ result.Customs +'" onkeyup="this.onchange();" onpaste="this.onchange();" oninput="this.onchange();"><br>'+
                                '<span>' + getLocalizationWord('Commission') + ': </span><input type="number" class="CommInput form-control" onchange="Calculate(this);" value="' + result.Commission + '" onkeyup="this.onchange();" onpaste="this.onchange();" oninput="this.onchange();">'+
                            '</td>'+
                            '<td style="vertical-align:top">'+
                                '<span>' + getLocalizationWord('Shipping') + ': </span><input type="number" class="ShippingInput form-control" onchange="Calculate(this);" value="' + result.Shipping +'" onkeyup="this.onchange();" onpaste="this.onchange();" oninput="this.onchange();"><br>'+
                                '<span>' + getLocalizationWord('Discount') + ': </span><input type="number" class="DiscountInput form-control" onchange="Calculate(this);" value="0" onkeyup="this.onchange();" onpaste="this.onchange();" oninput="this.onchange();">'+
                            '</td>'+
                            '<td><span class="TotalInput">'+ numberWithCommas(result.Total) + '</span> USD</td>'+                
                        '</tr>';
            }
        });
    }
    else if (Type == 'manufacturing') {
        html += '<tr>' +
                    '<td>1</td>'+
                    '<td>' +                         
                    '</td>'+
                    '<td>'+                       
                        '<span>'+ getLocalizationWord("Manufacturing") + '</span>'+
                    '</td>'+
                    '<td style="vertical-align:top">'+
                        '<span>' + getLocalizationWord('Price') + ': </span><input type="number" class="PriceInput form-control" onchange="Calculate(this);" value="" onkeyup="this.onchange();" onpaste="this.onchange();" oninput="this.onchange();"><br>'+                        
                    '</td>'+
                    '<td style="vertical-align:top">'+
                        '<span>' + getLocalizationWord('Discount') + ': </span><input type="number" class="DiscountInput form-control" onchange="Calculate(this);" value="" onkeyup="this.onchange();" onpaste="this.onchange();" oninput="this.onchange();"><br>'+                        
                    '</td>'+
                    '<td style="vertical-align:top">'+
                        '<span>' + getLocalizationWord('Additional Charges') + ': </span><input type="number" class="AdditionalInput form-control" onchange="Calculate(this);" value="" onkeyup="this.onchange();" onpaste="this.onchange();" oninput="this.onchange();"><br>'+                        
                    '</td>'+
                    '<td><span class="TotalInput">0</span> USD</td>'+                
                '</tr>';
    }
    else if (Type == 'logistics') {
        html += '<tr>' +
                    '<td>1</td>'+
                    '<td>' +                         
                    '</td>'+
                    '<td>'+                       
                        '<span>'+ getLocalizationWord("Logistics") + '</span>'+
                    '</td>'+
                    '<td style="vertical-align:top">'+
                        '<span>' + getLocalizationWord('Price') + ': </span><input type="number" class="PriceInput form-control" onchange="Calculate(this);" value="" onkeyup="this.onchange();" onpaste="this.onchange();" oninput="this.onchange();"><br>'+                        
                        '<span>' + getLocalizationWord('Discount') + ': </span><input type="number" class="DiscountInput form-control" onchange="Calculate(this);" value="0" onkeyup="this.onchange();" onpaste="this.onchange();" oninput="this.onchange();">'+
                    '</td>'+
                    '<td style="vertical-align:top">'+
                    '<span>' + getLocalizationWord('Customs') + ': </span><input type="number" class="CustomsInput form-control" onchange="Calculate(this);" value="" onkeyup="this.onchange();" onpaste="this.onchange();" oninput="this.onchange();"><br>'+
                    '<span>' + getLocalizationWord('Commission') + ': </span><input type="number" class="CommInput form-control" onchange="Calculate(this);" value="" onkeyup="this.onchange();" onpaste="this.onchange();" oninput="this.onchange();">'+
                    '</td>'+
                    '<td style="vertical-align:top">'+
                        '<span>' + getLocalizationWord('Additional Charges') + ': </span><input type="number" class="AdditionalInput form-control" onchange="Calculate(this);" value="" onkeyup="this.onchange();" onpaste="this.onchange();" oninput="this.onchange();"><br>'+                        
                    '</td>'+
                    '<td><span class="TotalInput">0</span> USD</td>'+                
                '</tr>';
    }
   


    $('#addtionalInfoPanelBody').html(html);

    CalculateTotal();

    hiddenSpinner();
}

$('#taxRate').change(function() {
    CalculateTotal();
});

//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////

function gotoLink($link) {
    window.open($link, "_blank");
}

//////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////

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

///////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////

function onChangeDealType() {
    Glo_DealType = $('#DealType').val();
    if (Glo_DealType == 'All Deals') {
        $('.endDate-filter').css('display', 'flex');
    } else if (Glo_DealType == 'Auction') {
        $('.endDate-filter').css('display', 'flex');
    } else {
        $('.endDate-filter').css('display', 'none');
    }


    $('#minYearInput').val('');
    $('#maxYearInput').val('');

    $('#minAucYearInput').val('');
    $('#maxAucYearInput').val('');

    $('#minTotalInput').val('');
    $('#maxTotalInput').val('');

    $('#minLiftCapacity').val('');
    $('#maxLiftCapacity').val('');

    managementTB.ajax.reload();  
}

///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////


function setIdToSelectedList(id, element) {
    Glo_RecordSelectedList = id;
    $('#btnStepNext').click();
}

////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////

function printAsPdf() {

    showSpinner();

    var options = {
        backgroundColor: '#ffffff',
        scale: 5
    };

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
        
        $.ajax({
            url : base_url + 'Opportunities/savePdfImages',
            type : 'post',
            async : false,
            timeout : 30000,
            cache : false,
            data : {
                ID : savedProposalId,
                imageData : imgdata
            },
            success : function(data) {
                
                var result = JSON.parse(data);                        

                if (result.success == false) {                    
                    hiddenSpinner();
                    var assignmentID = $('#edit-item-id').val();                    
                    toastr.error('Make a Proposal Error');
                    logErrorActivity('Make a Proposal', assignmentID, 'tblAssignments', result.message);
                    return;
                }

                var filename = $('#ProposalName').val();
                doc.addImage(imgdata, 'JPEG', leftMargin, topMargin, contentWidth, contentHeight);                
                doc.save(filename + '.pdf');
                hiddenSpinner();
                logSuccessActivity('Make a Proposal', assignmentID, 'tblAssignments');
                document.location.href = base_url + 'Opportunities/mine';
                
            },
            error : function() {
                hiddenSpinner();
                errorOccured = true;
            }
        });

        
    });
}

/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////

function onCheckAll(checked) {

    var len = managementTB.rows().data().length;
    var rows = managementTB.rows().data();
    for (var i = 0; i < len; i++) {

        var eqCategory = rows[i].EqCategory;
        var id = rows[i].ID;
        setIdToSelectedList(checked, id);
    }

    
    $('.checkbox-tick').each(function () {
        $(this).prop('checked', checked);
    });

    setSelectedCount();

}

///////////////////////////////////////////////////////
//////////////////////////////////////////////////////////

function checkEnterkey(e) {
    if (e.keyCode == 13) {
        $('#searchbtn').trigger('click');
    }
}

///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////

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

/////////////////////////////////////////////////////
/////////////////////////////////////////////////////

function setSelectedCount() {

    var result_array = [];
    var len = Glo_RecordSelectedList.length;
    var assoc = [];
    while (len--) {
        var item = Glo_RecordSelectedList[len];
        if (item != 0) {
            if (!assoc[item]) {
                result_array.unshift(item);
                assoc[item] = true;
            }
        }

    }

    var selectItemCount = result_array.length;

    $('#selected-label-count').html(selectItemCount);
}

////////////////////////////////////////////////////////
////////////////////////////////////////////////////////

$('#btnStepPrev').click(function() {
    $('#btnStepNext').prop('disabled', false);
    stepIndex--;
    showStepPanel();
});

$('#btnStepNext').click(function() {

    if (stepIndex < 2) {
        stepIndex++;
        showStepPanel();
    }
    else {
        var assignmentID = $('#edit-item-id').val();

        $.ajax({
            url : base_url + 'Opportunities/saveProposal',
            type : 'post',
            data : {
                ID : assignmentID
            },
            success : function(data) {
                var result = JSON.parse(data);

                if (result.success == false) {
                    toastr.error('Make a Proposal Error');
                    logErrorActivity('Make a Proposal', assignmentID, 'tblAssignments', result.message);
                }
                else {
                    savedProposalId = result.ID;
                    printAsPdf();
                }
            }
        })
        
    }    
});

function showStepPanel() {
    var Type = $('#edit-item-type').val();
    if (stepIndex == 0) {
        $('#btnStepPrev').hide();
        if (Type == 'equipment')
            $('#btnStepNext').hide();
        else    
            $('#btnStepNext').show();
        $('#btnStepNext').html(getLocalizationWord('Next'));

        $('#SpanFileName').hide();
        $('#ProposalName').hide();

        $('#ItemSelectionPanel').show();
        $('#AdditionalInfoPanel').hide();
        $('#PreviewPanel').hide();

        $('#stepChooseItem').addClass('active');
        $('#stepTaxInfo').removeClass('active');
        $('#stepPreview').removeClass('active');       

    }
    else if (stepIndex == 1) {
        $('#btnStepPrev').show();
        $('#btnStepNext').show();
        $('#btnStepNext').html(getLocalizationWord('Next'));

        $('#SpanFileName').hide();
        $('#ProposalName').hide();

        $('#ItemSelectionPanel').hide();
        $('#AdditionalInfoPanel').show();
        $('#PreviewPanel').hide();

        $('#stepChooseItem').addClass('active');
        $('#stepTaxInfo').addClass('active');
        $('#stepPreview').removeClass('active');

        showSpinner();

        renderAddtionalInfoPanel();
    }
    else if (stepIndex == 2) {
        $('#btnStepPrev').show();
        $('#btnStepNext').show();
        $('#btnStepNext').html(getLocalizationWord('Complete'));

        $('#SpanFileName').show();
        $('#ProposalName').show();

        $('#ItemSelectionPanel').hide();
        $('#AdditionalInfoPanel').hide();
        $('#PreviewPanel').show();

        $('#stepChooseItem').addClass('active');
        $('#stepTaxInfo').addClass('active');
        $('#stepPreview').addClass('active');

        renderPDFPreview();
    }
}

function Calculate(element) {
    var Type = $('#edit-item-type').val();    
    var tr = $(element).parent().parent().get(0);    
    if (Type == 'equipment') {
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

        total = (valBuyPremium * valPrice) / 100 + valPrice + valShipping + valCustoms + valComm - valDiscount;
        
        TotalInput = tr.getElementsByClassName('TotalInput');
        TotalInput[0].innerHTML = numberWithCommas(total);
    }
    else if (Type == 'manufacturing') {
        var Price = tr.getElementsByClassName('PriceInput');
        var Additional = tr.getElementsByClassName('AdditionalInput');
        var Discount = tr.getElementsByClassName('DiscountInput');

        var valPrice = Number(Price[0].value);
        var valAdditioanl = Number(Additional[0].value);
        var valDiscount = Number(Discount[0].value);

        total = valPrice + valAdditioanl - valDiscount;
        
        TotalInput = tr.getElementsByClassName('TotalInput');
        TotalInput[0].innerHTML = numberWithCommas(total);
    }
    else if (Type == 'logistics') {
        var Price = tr.getElementsByClassName('PriceInput');                
        var Customs = tr.getElementsByClassName('CustomsInput');
        var Comm = tr.getElementsByClassName('CommInput');
        var Discount = tr.getElementsByClassName('DiscountInput');
        var Additional = tr.getElementsByClassName('AdditionalInput');
        
        var valPrice = Number(Price[0].value);      
        var valCustoms = Number(Customs[0].value);
        var valComm = Number(Comm[0].value);        
        var valDiscount = Number(Discount[0].value);
        var valAdditioanl = Number(Additional[0].value);

        total = valPrice + valCustoms + valComm + valAdditioanl - valDiscount;
        
        TotalInput = tr.getElementsByClassName('TotalInput');
        TotalInput[0].innerHTML = numberWithCommas(total);
    }
    

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
    
    $('#subTotal').html(numberWithCommas(subTotalPrice));
    $('#taxAmount').html(numberWithCommas(taxAmount));
    $('#totalAmount').html(numberWithCommas(totalPrice));
}

function logSuccessActivity(Activity, ID, Table) {
    $.ajax({
        url : base_url + 'Activity/addActivity',
        type : 'post',
        data : {
            Activity : Activity,
            ObjectiveTable : Table,
            ObjectiveID : ID,
            Webpage : 'Demand.MyOpportunity',
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
            Webpage : 'Demand.MyOpportunity',
            Status : 'Error',
            Error : ErrorMsg
        },
        success : function() {
            websocket.send(JSON.stringify({ 'msg': 'activity', 'poster': $('#usernameInput').val() }));
        }
    });
}

