

var managementTB;
var modalTB;

var totalPdfPage = 0;
var totalPdfImageData = [];

var Glo_Category = "All Equipments";
var Glo_DealType = "All Deals";

var Glo_RecordSelectedList = [0];

var id_selected_for_publish = 0;
var site_name = '';

// column data
var columnData = [
    {
        "title": '<div class="fancy-checkbox"><label><input type="checkbox" class="checkbox-tick" id="allCheck" onclick="onCheckAll(this.checked)"><span></span></label></div>',
        sortable: false,
        width: '20px',
        "render": function (data, type, full, meta) {

            var checked = "";

            for (var i = 0; i < Glo_RecordSelectedList.length; i++) {
                if (Glo_RecordSelectedList[i] == full.ID) {
                    checked = "checked";
                }
            }

            return '<div class="fancy-checkbox"><label><input type="checkbox" class="checkbox-tick" onclick="setIdToSelectedList(this.checked, ' + full.ID + ')" ' + checked + '><span></span></label></div>';            
        }
    }, {
        "title": "",
        sortable: false,
        "render": function (data, type, full, meta) {

            var action = 'disabled';

            if ($('#permission').val() == 'admin' || $('#permission').val() == 'editable') {
                action = '';
            }

            var infoButton = '<button  class="col-lg-4 btn btn-sm btn-default btn-action"  data-toggle="tooltip" data-placement="top" title="' + getLocalizationWord('Info') + '" onclick="onDetailInfo(' + full.ID + ')"><i class="icon-info"></i></button>';
            var linkButton = '<button  class="col-lg-4 btn btn-sm btn-default btn-action"  data-toggle="tooltip" data-placement="top" title="' + getLocalizationWord('Link') + '" onclick="gotoLink(\'' + full.Link + '\')"><i class="icon-link"></i></button>';
            var mediaButton = '<button  class="col-lg-4 btn btn-sm btn-default btn-action"  data-toggle="tooltip" data-placement="top" title="' + getLocalizationWord('Media') + '" onclick="onMediaView(' + full.ID + ')"><i class="fa fa-picture-o"></i></button>';
            //var editButton = '<button  class="col-lg-4 btn btn-sm btn-default btn-action"  data-toggle="tooltip" data-placement="top" title="' + getLocalizationWord('Edit') + '" onclick="onEditInfo(' + full.ID + ')"  ' + action + '><i class="icon-note"></i></button>';            
            var removeWatchListButton = '<button  class="col-lg-4 btn btn-sm btn-default btn-action"  data-toggle="tooltip" data-placement="top"  data-tvmode="yes"  title="' + getLocalizationWord('Remove from Watch List') + '" onclick="onDeleteWatchList(' + full.ID + ')"><i class="icon-publish-alt"></i></button>';

            return '<div class="row" style = "width : 125px; padding-left : 5px;">' +
                infoButton + linkButton + mediaButton + removeWatchListButton + 
            '</div>';
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
        "title": getLocalizationWord("Equipment Info"),
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

            var pictures = '';
            if (Number(full.PictureCount) == 0)
                pictures = '1 Picture';
            else   
                pictures = (Number(full.PictureCount) + 1) + ' Pictures';
            var model = '';

            if (full.EqModel)
                model = full.EqModel + '<br>';

            return full.DealID + '<br>' + EqCategory + year + make + model + pictures;  
        }
    }, {
        "title": getLocalizationWord("Location Info"),
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
            
            var today = new Date().toLocaleString("en-US", {timeZone: "America/Phoenix"});
            today = new Date(today);            
            var addedDay = new Date(full.DateAdded.replace(/\s/, 'T'));
            addedDay.setDate(addedDay.getDate() + 45);

            var addDateTime = full.DateAdded.split(' ');
            var addDate = addDateTime[0];

            if (addedDay.getTime() < today.getTime()) {
                return full.USERNAME  + '<br>' + 
                    "<span class='badge badge-warning' style='margin-left : 0px;'>" + addDate + "</span>";
            }           
                        
            var item = full.USERNAME + '<br>' + addDate;
            return item;
        }
    }, {
        "title": getLocalizationWord("Published"),
        sortable: false,
        render: function (data, type, full, meta) {
            var maquinariaJR = '';
            
            if (full.MaquinariaJRLink != '') {
                maquinariaJR = '<button  class="btn btn-sm btn-default"  style="padding:4px 7px;" data-toggle="tooltip" data-placement="top" title="LINK TO MAQUINARIA JR" onclick="gotoLink(\'' + full.MaquinariaJRLink + '\')"><img class="publish-icon" src="' + base_url + 'assets/images/publish_icon/maquinaria_active_icon.png"></button>';
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



// set up  truck management table
$(function () {
    if (SearchHelpCount > 0) {
        toastr.warning(SearchHelpCount + ' ' + LocalizationMessage('Opportunities Need Search Help'));
    }

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
        exportTableToExcel('WatchList');
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

        if (msg == 'delete_truck') {

            managementTB.ajax.reload(null, false);  

        } else if (msg == 'save_truck') {

            managementTB.ajax.reload(null, false);  
        } else if (msg == 'unpublish_truck') {

            managementTB.ajax.reload(null, false);
        } else if (msg == 'publish_truck') {
            managementTB.ajax.reload(null, false);
        } else if (msg == 'save_contact') {
            toastr.warning('New Opportunity Added');
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

    updateEquipmentCategory();
});

function renderTB() {


    managementTB = $('#auction-management-table').DataTable({
        'processing': true,
        'serverSide': true,
        'ajax': {
            url: base_url + 'Deals/getTruckDataForWatchList',
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
                d.searchText = getTranslatedWordForSearch($('#searchInput').val());
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
                "previous" : lang == 'english' ? "Previous" : "Atrás ",
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
            // $('[data-toggle="tooltip"]').tooltip({boundary: 'window'});

            if (Glo_Category == 'All Equipments') {
                managementTB.column(10).visible(true);
            } else {

                var has_truck_info = has_truck_special_field(Glo_Category);
                if (has_truck_info) {
                    managementTB.column(10).visible(true);
                } else {
                    managementTB.column(10).visible(false);
                }

            }

             $('#selected-label-total').html(setting['_iRecordsDisplay']);

             $('#allCheck').prop('checked', false);

        },
        'fnRowCallback' :  function (nRow, aData, iDisplayInex, iDisplayIndexFull) {
            var today = new Date();
            var tomorrow = new Date();
            tomorrow.setDate(today.getDate() + 1);
            var endDate = new Date(aData.EndDate.replace(/\s/, 'T'));
            
            if (aData.DealType == 'Auction' && (today >= endDate || tomorrow >= endDate)) {                
                $td = $('td', nRow);
                console.log($td);   
                $td[5].style.backgroundColor =  'rgb(128, 128, 128)';
                $td[5].style.color =  'black';
                $td[5].style.fontWeight =  'bolder';
            }
                
        }

    });
}

////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////

function renderModalTB() {

    showSpinner();

    $('.table-pdf').html('');

    $.ajax(
        {
            url: base_url + 'Deals/getTruckDataForPdf',
            type: 'POST',
            data: {
                recordSelectedList: Glo_RecordSelectedList
            },
            success: function (res) {

                result = res.data;

                if (result.length == 0) {
                    hiddenSpinner();

                    var content = "<p style='text-align:center; font-size: 16px;'>Select a deal to generate PDF</p>";
                    $('.table-pdf').html(content);

                    $('#printPdfBtn').prop('disabled', true);
                    $('#printPdfImages').prop('disabled', true);

                } else if (result.length == 1) {

                    var full = result[0];
                    $.ajax(
                        {
                            url: base_url + 'Deals/getGalleryImageData',
                            type: 'POST',
                            data: {
                                TruckID: full['ID']
                            },
                            success: function (re) {
                                var response = JSON.parse(re);
                                var images = response.pictures;

                                var images_for_first_page = [];
                                var images_for_rest_page = [];
                                if (images.length <= 4) {
                                    images_for_first_page = images;
                                } else {
                                    images_for_first_page = images.slice(0, 4);
                                    images_for_rest_page = images.slice(4, images.length);
                                }

                                var tempPage = (images.length + 2) / 6;
                                if (Math.abs(tempPage - Math.floor(tempPage)) > 0) {
                                    totalPdfPage = Math.floor(tempPage) + 1;
                                } else {
                                    totalPdfPage = Math.floor(tempPage);
                                }

                                $('#printPdfBtn').prop('disabled', false);
                                $('#printPdfImages').prop('disabled', false);
                                
                                var contentItem = '';
                                for (var i = 0; i < totalPdfPage; i++) {

                                    contentItem += '<div class="pdfPage" id="pdfPage' + i + '">';
                                    contentItem += '<div class="pdfPage-header">';
                                    contentItem += '<div class="pdf-header-logo">';
                                    contentItem += '<img src="' + base_url + 'assets/images/icon/pdf_logo.png"/>';
                                    contentItem += '</div>';
                                    contentItem += '<div class="pdf-header-icon-box">';
                                    contentItem += '<img src="' + base_url + 'assets/images/icon/pdf-header-icon1.png"/>';
                                    contentItem += '<img src="' + base_url + 'assets/images/icon/pdf-header-icon2.png"/>';
                                    contentItem += '<img src="' + base_url + 'assets/images/icon/pdf-header-icon3.png"/>';
                                    contentItem += '<img src="' + base_url + 'assets/images/icon/pdf-header-icon4.png"/>';
                                    contentItem += '<img src="' + base_url + 'assets/images/icon/pdf-header-icon5.png"/>';
                                    contentItem += '<img src="' + base_url + 'assets/images/icon/pdf-header-icon6.png"/>';
                                    contentItem += '</div>';
                                    contentItem += '</div>';
                                    contentItem += '<div class="pdfPage-content">';

                                    if (i == 0) {   // first page

                                        contentItem += '<div class="pageCell">';

                                        // image section cell

                                        var $banner1Url = base_url + "assets/images/ribbon/com_mark.png";
                                        var $banner2url = base_url + "assets/images/ribbon/auction-banner-footer.png";
                                        if (full.DealType == 'Supplier') {
                                            $banner2url = base_url + "assets/images/ribbon/supplier-banner-footer.png";
                                        } else if (full.DealType == 'Consignment') {
                                            $banner2url = base_url + "assets/images/ribbon/consignment-banner-footer.png";
                                        } else if (full.DealType == 'Inventory') {
                                            $banner2url = base_url + "assets/images/ribbon/inventory-banner-footer.png";
                                        }

                                        var $imgUrl = base_url + "assets/images/primaryImages/" + full.PrimaryImage;
                                        var height = 250;
                                        var width = parseInt(full.pmW * height / full.pmH);

                                        contentItem += '<div class="imageCell">' +
                                            '<div class="modal-photo-cell" style="background-image: url(\'' + $imgUrl + '\')">' +
                                            '<img  src="' + $imgUrl + '" style="width: ' + width + 'px; height: ' + height + 'px; position:absolute; top:0; left: 50%; margin-left:' + (-1 * width / 2) + 'px;" >' +
                                            '<img class="modal-banner1" src="' + $banner1Url + '" >' +
                                            '<img class="modal-banner2" src="' + $banner2url + '" >' +
                                            '</div>' +
                                            '</div>';

                                        // detail cell2 

                                        contentItem += '<div class="contentCell">';


                                        if (full.DealType == 'Auction') {

                                            var title = getTitleFromDatabase(full);                                            
                                            title = title.substring(0, 32);
                                            contentItem += "<h3 class='pdf-title'>" + title + "</h3>";
                                            contentItem += "<div style='display:flex; height: 35px; justify-content:  flex-start; align-items: flex-start;'>"
                                            contentItem += "<div class='pdf-total-price'>USD $" + numberWithCommas(full.Total) + "</div>";
                                            if (full.Price > 0) {
                                                contentItem += "<div class='pdf-price-to-bet-box'>";
                                                contentItem += "<div class='pdf-label2'>con una puja mÁxima de</div>";
                                                contentItem += "<div class='pdf-pricetobet'>USD $" + numberWithCommas(full.Price) + "</div>";
                                                contentItem += "</div>";
                                            }
                                            contentItem += "</div>";
                                            contentItem += "<p class='pdf-label1'>*PRECIO TOTAL APROXIMADO INCLUYE FLETE, IMPORTACIÓN Y COMISIONES</p>";
                                            contentItem += "<p class='pdf-label1'>*precio no incluye iva</p>";

                                            contentItem += "<div style='display:flex; justify-content:flex-start;'>";

                                            contentItem += "<div class='pdf-auctioneer-box'>";
                                            contentItem += "<img class='pdf-auctioneer-icon' src='" + base_url + "assets/images/icon/handshake_icon.png'>";
                                            contentItem += "<div class='pdf-auctioneer-content'>";
                                            contentItem += "<div class='pdf-label3'>tipo de trato</div>";
                                            contentItem += "<div class='pdf-auctioneer-name'>SUBASTA</div>";
                                            contentItem += "</div>";
                                            contentItem += "</div>";
                                            contentItem += "<div class='pdf-auction-date-box'>";
                                            contentItem += "<div class='pdf-label4'>fecha de subasta</div>";
                                            contentItem += "<div class='pdf-auction-date'>" + convertDate(full.EndDate) + "</div>";
                                            contentItem += "</div>";
                                            contentItem += "</div>";

                                            contentItem += '<div class="pdf-description-box">';
                                            contentItem += '<div class="pdf-label5">DESCRIPCIÓN</div>'
                                            contentItem += '<div class="pdf-description-content-box">';

                                        } else if (full.DealType == 'Supplier') {

                                            var title = getTitleFromDatabase(full);
                                            title = title.substring(0, 32);
                                            contentItem += "<h3 class='pdf-title'>" + title + "</h3>";
                                            contentItem += "<div style='display:flex; height: 35px; justify-content:  flex-start; align-items: flex-start;'>"
                                            contentItem += "<div class='pdf-total-price'>USD $" + numberWithCommas(full.Total) + "</div>";
                                            contentItem += "</div>";
                                            contentItem += "<p class='pdf-label1'>*PRECIO TOTAL APROXIMADO INCLUYE FLETE, IMPORTACIÓN Y COMISIONES</p>";
                                            contentItem += "<p class='pdf-label1'>*precio no incluye iva</p>";

                                            contentItem += "<div style='display:flex; justify-content:space-between;'>";

                                            contentItem += "<div class='pdf-auctioneer-box'>";
                                            contentItem += "<img class='pdf-auctioneer-icon' src='" + base_url + "assets/images/icon/handshake_icon.png'>";
                                            contentItem += "<div class='pdf-auctioneer-content'>";
                                            contentItem += "<div class='pdf-label3'>tipo de trato</div>";
                                            contentItem += "<div class='pdf-auctioneer-name'>PROVEEDOR</div>";
                                            contentItem += "</div>";
                                            contentItem += "</div>";
                                            contentItem += "<div class='pdf-auction-date-box'>";
                                            contentItem += "<div class='pdf-auction-date-title'></div>";
                                            contentItem += "<h5 class='pdf-auction-date'></h5>";
                                            contentItem += "</div>";
                                            contentItem += "</div>";
                                            contentItem += '<div class="pdf-description-box">';
                                            contentItem += '<div class="pdf-label5">DESCRIPCIÓN</div>'
                                            contentItem += '<div class="pdf-description-content-box">';

                                        } else if (full.DealType == 'Consignment') {

                                            var title = getTitleFromDatabase(full);
                                            title = title.substring(0, 32);
                                            contentItem += "<h3 class='pdf-title'>" + title + "</h3>";
                                            contentItem += "<div style='display:flex; height: 35px; justify-content:  flex-start; align-items: flex-start;'>"
                                            contentItem += "<div class='pdf-total-price'>USD $" + numberWithCommas(full.Total) + "</div>";
                                            contentItem += "</div>";                                            
                                            contentItem += "<p class='pdf-label1'>*precio no incluye iva</p>";

                                            contentItem += "<div style='display:flex; justify-content:space-between;'>";

                                            contentItem += "<div class='pdf-auctioneer-box'>";
                                            contentItem += "<img class='pdf-auctioneer-icon' src='" + base_url + "assets/images/icon/handshake_icon.png'>";
                                            contentItem += "<div class='pdf-auctioneer-content'>";
                                            contentItem += "<div class='pdf-label3'>tipo de trato</div>";
                                            contentItem += "<div class='pdf-auctioneer-name'>CONSIGNACIÓN</div>";
                                            contentItem += "</div>";
                                            contentItem += "</div>";
                                            contentItem += "<div class='pdf-auction-date-box'>";
                                            contentItem += "<div class='pdf-auction-date-title'></div>";
                                            contentItem += "<h5 class='pdf-auction-date'></h5>";
                                            contentItem += "</div>";
                                            contentItem += "</div>";
                                            contentItem += '<div class="pdf-description-box">';
                                            contentItem += '<div class="pdf-label5">DESCRIPCIÓN</div>'
                                            contentItem += '<div class="pdf-description-content-box">';

                                        } else if (full.DealType == 'Inventory') {

                                            var title = getTitleFromDatabase(full);
                                            title = title.substring(0, 32);
                                            contentItem += "<h3 class='pdf-title'>" + title + "</h3>";
                                            contentItem += "<div style='display:flex; height: 35px; justify-content:  flex-start; align-items: flex-start;'>"
                                            contentItem += "<div class='pdf-total-price'>USD $" + numberWithCommas(full.Total) + "</div>";
                                            contentItem += "</div>";                                            
                                            contentItem += "<p class='pdf-label1'>*precio no incluye iva</p>";

                                            contentItem += "<div style='display:flex; justify-content:space-between;'>";

                                            contentItem += "<div class='pdf-auctioneer-box'>";
                                            contentItem += "<img class='pdf-auctioneer-icon' src='" + base_url + "assets/images/icon/handshake_icon.png'>";
                                            contentItem += "<div class='pdf-auctioneer-content'>";
                                            contentItem += "<div class='pdf-label3'>tipo de trato</div>";
                                            contentItem += "<div class='pdf-auctioneer-name'>INVENTARIO</div>";
                                            contentItem += "</div>";
                                            contentItem += "</div>";
                                            contentItem += "<div class='pdf-auction-date-box'>";
                                            contentItem += "<div class='pdf-auction-date-title'></div>";
                                            contentItem += "<h5 class='pdf-auction-date'></h5>";
                                            contentItem += "</div>";
                                            contentItem += "</div>";
                                            contentItem += '<div class="pdf-description-box">';
                                            contentItem += '<div class="pdf-label5">DESCRIPCIÓN</div>'
                                            contentItem += '<div class="pdf-description-content-box">';

                                        }

                                        ///////////// special fields //////////////////////////////////////////////
                                        contentItem += get_detail_data_for_pdf(full);

                                        contentItem += '</div>';
                                        contentItem += '</div>';
                                        contentItem += '</div>';
                                        contentItem += '</div>';

                                        // add first page gallery
                                        contentItem += '<div class="first-pdf-page-gallery-container">';
                                        for (var m = 0; m < images_for_first_page.length; m++) {

                                            var imageItem = images_for_first_page[m];

                                            $imgUrl = imageItem.url;
                                            height = 250;
                                            width = parseInt(imageItem.Width * height / imageItem.Height);

                                            contentItem += '<div class="galleryCell">' +
                                                '<div class="modal-photo-cell" style="background-image: url(\'' + $imgUrl + '\')">' +
                                                '<img  src="' + $imgUrl + '" style="width: ' + width + 'px; height: ' + height + 'px; position:absolute; top:0; left: 50%; margin-left:' + (-1 * width / 2) + 'px;" >' +
                                                '<img class="modal-banner1" src="' + $banner1Url + '" >' +
                                                '<img class="modal-banner2" src="' + $banner2url + '" >' +
                                                '</div>' +
                                                '</div>';
                                        }
                                        contentItem += '</div>';

                                    }
                                    else {   // rest pages
                                        // add first page gallery
                                        contentItem += '<div class="rest-pdf-page-gallery-container">';
                                        for (var m = 0; m < images_for_rest_page.length; m++) {

                                            var imageItem = images_for_rest_page[m];

                                            $imgUrl = imageItem.url;
                                            height = 250;
                                            width = parseInt(imageItem.Width * height / imageItem.Height);

                                            contentItem += '<div class="galleryCell">' +
                                                '<div class="modal-photo-cell" style="background-image: url(\'' + $imgUrl + '\')">' +
                                                '<img  src="' + $imgUrl + '" style="width: ' + width + 'px; height: ' + height + 'px; position:absolute; top:0; left: 50%; margin-left:' + (-1 * width / 2) + 'px;" >' +
                                                '<img class="modal-banner1" src="' + $banner1Url + '" >' +
                                                '<img class="modal-banner2" src="' + $banner2url + '" >' +
                                                '</div>' +
                                                '</div>';
                                        }
                                        contentItem += '</div>';

                                    }
                                    contentItem += '</div>';
                                    contentItem += '<div class="pdfPage-footer">';
                                    contentItem += '<img  src="' + base_url + 'assets/images/icon/pdf-footer-label.png">';
                                    contentItem += '</div>';
                                    contentItem += '</div>';

                                }

                                $('.table-pdf').html(contentItem);
                                hiddenSpinner();

                            }
                        });


                } else {

                    var tempPage = result.length / 3;
                    if (Math.abs(tempPage - Math.floor(tempPage)) > 0) {
                        totalPdfPage = Math.floor(tempPage) + 1;
                    } else {
                        totalPdfPage = Math.floor(tempPage);
                    }

                    $('#printPdfBtn').prop('disabled', false);
                    $('#printPdfImages').prop('disabled', false);

                    var contentItem = '';
                    for (var i = 0; i < totalPdfPage; i++) {

                        contentItem += '<div class="pdfPage" id="pdfPage' + i + '">';
                        contentItem += '<div class="pdfPage-header">';
                        contentItem += '<div class="pdf-header-logo">';
                        contentItem += '<img src="' + base_url + 'assets/images/icon/pdf_logo.png"/>';
                        contentItem += '</div>';
                        contentItem += '<div class="pdf-header-icon-box">';
                        contentItem += '<img src="' + base_url + 'assets/images/icon/pdf-header-icon1.png"/>';
                        contentItem += '<img src="' + base_url + 'assets/images/icon/pdf-header-icon2.png"/>';
                        contentItem += '<img src="' + base_url + 'assets/images/icon/pdf-header-icon3.png"/>';
                        contentItem += '<img src="' + base_url + 'assets/images/icon/pdf-header-icon4.png"/>';
                        contentItem += '<img src="' + base_url + 'assets/images/icon/pdf-header-icon5.png"/>';
                        contentItem += '<img src="' + base_url + 'assets/images/icon/pdf-header-icon6.png"/>';
                        contentItem += '</div>';
                        contentItem += '</div>';
                        contentItem += '<div class="pdfPage-content">';

                        for (var k = 0; k < 3; k++) {

                            if (k + i * 3 >= result.length)
                                break;

                            var full = result[k + i * 3];

                            contentItem += '<div class="pageCell">';

                            // image section cell

                            var $banner1Url = base_url + "assets/images/ribbon/com_mark.png";
                            var $banner2url = base_url + "assets/images/ribbon/auction-banner-footer.png";
                            if (full.DealType == 'Supplier') {
                                $banner2url = base_url + "assets/images/ribbon/supplier-banner-footer.png";
                            } else if (full.DealType == 'Consignment') {
                                $banner2url = base_url + "assets/images/ribbon/consignment-banner-footer.png";
                            } else if (full.DealType == 'Inventory') {
                                $banner2url = base_url + "assets/images/ribbon/inventory-banner-footer.png";
                            }

                            var $imgUrl = base_url + "assets/images/primaryImages/" + full.PrimaryImage;
                            var height = 250;
                            var width = parseInt(full.pmW * height / full.pmH);

                            contentItem += '<div class="imageCell">' +
                                '<div class="modal-photo-cell" style="background-image: url(\'' + $imgUrl + '\')">' +
                                '<img  src="' + $imgUrl + '" style="width: ' + width + 'px; height: ' + height + 'px; position:absolute; top:0; left: 50%; margin-left:' + (-1 * width / 2) + 'px;" >' +
                                '<img class="modal-banner1" src="' + $banner1Url + '" >' +
                                '<img class="modal-banner2" src="' + $banner2url + '" >' +
                                '</div>' +
                                '</div>';

                            // detail cell2 

                            contentItem += '<div class="contentCell">';


                            if (full.DealType == 'Auction') {

                                var title = getTitleFromDatabase(full);
                                title = title.substring(0, 32);
                                contentItem += "<h3 class='pdf-title'>" + title + "</h3>";
                                contentItem += "<div style='display:flex; height: 35px; justify-content:  flex-start; align-items: flex-start;'>"
                                contentItem += "<div class='pdf-total-price'>USD $" + numberWithCommas(full.Total) + "</div>";
                                if (full.Price > 0) {
                                    contentItem += "<div class='pdf-price-to-bet-box'>";
                                    contentItem += "<div class='pdf-label2'>con una puja mÁxima de</div>";
                                    contentItem += "<div class='pdf-pricetobet'>USD $" + numberWithCommas(full.Price) + "</div>";
                                    contentItem += "</div>";
                                }
                                contentItem += "</div>";
                                contentItem += "<p class='pdf-label1'>*PRECIO TOTAL APROXIMADO INCLUYE FLETE, IMPORTACIÓN Y COMISIONES</p>";
                                contentItem += "<p class='pdf-label1'>*precio no incluye iva</p>";

                                contentItem += "<div style='display:flex; justify-content:flex-start;'>";

                                contentItem += "<div class='pdf-auctioneer-box'>";
                                contentItem += "<img class='pdf-auctioneer-icon' src='" + base_url + "assets/images/icon/handshake_icon.png'>";
                                contentItem += "<div class='pdf-auctioneer-content'>";
                                contentItem += "<div class='pdf-label3'>tipo de trato</div>";
                                contentItem += "<div class='pdf-auctioneer-name'>SUBASTA</div>";
                                contentItem += "</div>";
                                contentItem += "</div>";
                                contentItem += "<div class='pdf-auction-date-box'>";
                                contentItem += "<div class='pdf-label4'>fecha de subasta</div>";
                                contentItem += "<div class='pdf-auction-date'>" + convertDate(full.EndDate) + "</div>";
                                contentItem += "</div>";
                                contentItem += "</div>";

                                contentItem += '<div class="pdf-description-box">';
                                contentItem += '<div class="pdf-label5">DESCRIPCIÓN</div>'
                                contentItem += '<div class="pdf-description-content-box">';

                            } else if (full.DealType == 'Supplier') {

                                var title = getTitleFromDatabase(full);
                                title = title.substring(0, 32);
                                contentItem += "<h3 class='pdf-title'>" + title + "</h3>";
                                contentItem += "<div style='display:flex; height: 35px; justify-content:  flex-start; align-items: flex-start;'>"
                                contentItem += "<div class='pdf-total-price'>USD $" + numberWithCommas(full.Total) + "</div>";
                                contentItem += "</div>";
                                contentItem += "<p class='pdf-label1'>*PRECIO TOTAL APROXIMADO INCLUYE FLETE, IMPORTACIÓN Y COMISIONES</p>";
                                contentItem += "<p class='pdf-label1'>*precio no incluye iva</p>";

                                contentItem += "<div style='display:flex; justify-content:space-between;'>";

                                contentItem += "<div class='pdf-auctioneer-box'>";
                                contentItem += "<img class='pdf-auctioneer-icon' src='" + base_url + "assets/images/icon/handshake_icon.png'>";
                                contentItem += "<div class='pdf-auctioneer-content'>";
                                contentItem += "<div class='pdf-label3'>tipo de trato</div>";
                                contentItem += "<div class='pdf-auctioneer-name'>PROVEEDOR</div>";
                                contentItem += "</div>";
                                contentItem += "</div>";
                                contentItem += "<div class='pdf-auction-date-box'>";
                                contentItem += "<div class='pdf-auction-date-title'></div>";
                                contentItem += "<h5 class='pdf-auction-date'></h5>";
                                contentItem += "</div>";
                                contentItem += "</div>";
                                contentItem += '<div class="pdf-description-box">';
                                contentItem += '<div class="pdf-label5">DESCRIPCIÓN</div>'
                                contentItem += '<div class="pdf-description-content-box">';

                            } else if (full.DealType == 'Consignment') {

                                var title = getTitleFromDatabase(full);
                                title = title.substring(0, 32);
                                contentItem += "<h3 class='pdf-title'>" + title + "</h3>";
                                contentItem += "<div style='display:flex; height: 35px; justify-content:  flex-start; align-items: flex-start;'>"
                                contentItem += "<div class='pdf-total-price'>USD $" + numberWithCommas(full.Total) + "</div>";
                                contentItem += "</div>";                                
                                contentItem += "<p class='pdf-label1'>*precio no incluye iva</p>";

                                contentItem += "<div style='display:flex; justify-content:space-between;'>";

                                contentItem += "<div class='pdf-auctioneer-box'>";
                                contentItem += "<img class='pdf-auctioneer-icon' src='" + base_url + "assets/images/icon/handshake_icon.png'>";
                                contentItem += "<div class='pdf-auctioneer-content'>";
                                contentItem += "<div class='pdf-label3'>tipo de trato</div>";
                                contentItem += "<div class='pdf-auctioneer-name'>CONSIGNACIÓN</div>";
                                contentItem += "</div>";
                                contentItem += "</div>";
                                contentItem += "<div class='pdf-auction-date-box'>";
                                contentItem += "<div class='pdf-auction-date-title'></div>";
                                contentItem += "<h5 class='pdf-auction-date'></h5>";
                                contentItem += "</div>";
                                contentItem += "</div>";
                                contentItem += '<div class="pdf-description-box">';
                                contentItem += '<div class="pdf-label5">DESCRIPCIÓN</div>'
                                contentItem += '<div class="pdf-description-content-box">';

                            } else if (full.DealType == 'Inventory') {

                                var title = getTitleFromDatabase(full);

                                title = title.substring(0, 32);
                                contentItem += "<h3 class='pdf-title'>" + title + "</h3>";
                                contentItem += "<div style='display:flex; height: 35px; justify-content:  flex-start; align-items: flex-start;'>"
                                contentItem += "<div class='pdf-total-price'>USD $" + numberWithCommas(full.Total) + "</div>";
                                contentItem += "</div>";                                
                                contentItem += "<p class='pdf-label1'>*precio no incluye iva</p>";

                                contentItem += "<div style='display:flex; justify-content:space-between;'>";

                                contentItem += "<div class='pdf-auctioneer-box'>";
                                contentItem += "<img class='pdf-auctioneer-icon' src='" + base_url + "assets/images/icon/handshake_icon.png'>";
                                contentItem += "<div class='pdf-auctioneer-content'>";
                                contentItem += "<div class='pdf-label3'>tipo de trato</div>";
                                contentItem += "<div class='pdf-auctioneer-name'>INVENTARIO</div>";
                                contentItem += "</div>";
                                contentItem += "</div>";
                                contentItem += "<div class='pdf-auction-date-box'>";
                                contentItem += "<div class='pdf-auction-date-title'></div>";
                                contentItem += "<h5 class='pdf-auction-date'></h5>";
                                contentItem += "</div>";
                                contentItem += "</div>";
                                contentItem += '<div class="pdf-description-box">';
                                contentItem += '<div class="pdf-label5">DESCRIPCIÓN</div>'
                                contentItem += '<div class="pdf-description-content-box">';

                            }



                            ///////////// special fields //////////////////////////////////////////////
                            contentItem += get_detail_data_for_pdf(full);

                            contentItem += '</div>';
                            contentItem += '</div>';
                            contentItem += '</div>';
                            contentItem += '</div>';

                        }
                        contentItem += '</div>';
                        contentItem += '<div class="pdfPage-footer">';
                        contentItem += '<img  src="' + base_url + 'assets/images/icon/pdf-footer-label.png">';
                        contentItem += '</div>';
                        contentItem += '</div>';
                    }

                    $('.table-pdf').html(contentItem);
                    hiddenSpinner();
                }
            }
        }
    );
}

/////////////////////////////////////////////////////////////////
//////////////////  export excel file ///////////////////////////


function exportTableToExcel(filename = '') {

    showSpinner();

    $.ajax({
        url: base_url + 'Deals/getWatchListDataForExcel',
        type: 'POST',
        data: {
            minYear: $('#minYearInput').val(),
            maxYear: $('#maxYearInput').val(),
            minAucYear: $('#minAucYearInput').val(),
            maxAucYear: $('#maxAucYearInput').val(),
            minTotal: $('#minTotalInput').val(),
            maxTotal: $('#maxTotalInput').val(),
            minLiftCapacity: $('#minLiftCapacity').val(),
            maxLiftCapacity: $('#maxLiftCapacity').val(),
            searchText: $('#searchInput').val(),
            categoryName: Glo_Category,
            dealType: Glo_DealType
        },
        success: function (result) {

            hiddenSpinner();


            var downloadLink;
            var csv = [];

            for (var i = 0; i < result.length; i++) {
                var row = [];

                var cols = result[i];

                for (var j = 0; j < cols.length; j++) {
                    row.push('"' + cols[j] + '"');
                }


                csv.push(row.join(','));
            }

            var csvFile = new Blob([csv.join('\n')], { type: 'text/csv' });

            //specify filename
            filename = filename ? filename + '.csv' : 'excel_data.csv';

            //create download link element  
            var downloadLink = $("<a href=''  download=''>excel</a>");

            $(downloadLink).prop('href', window.URL.createObjectURL(csvFile));
            $(downloadLink).prop('download', filename);
            $(downloadLink)[0].click();

            logSuccessActivity("Excel Extraction", 0, "");
        }

    });

}


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
    Glo_Category = 'All Equipments';

    updateEquipmentCategory();


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

function updateEquipmentCategory() {
    var DealType = $('#DealType').val();

    $.ajax({
        url : base_url + 'Deals/getEquipmentCategoryForWatchList',
        type : 'post',
        data : {
            DealType : DealType
        }, 
        success : function(res) {
            var data = JSON.parse(res);

            var html = '<option value="All Equipments">' + getLocalizationWord('All Equipment') + '</option>';

            var EqCategory = [];

            for (var i = 0; i < data.length; i++)
            {
                if (lang == 'spanish') {
                    EqCategory.push(
                        {'key' : data[i]['EqCategory'], 'value' : get_translated_word(data[i]['EqCategory'])}
                    );
                }
                else  {
                    EqCategory.push(
                        {'key' : data[i]['EqCategory'], 'value' : data[i]['EqCategory']}
                    );        
                }                
            }
            
            EqCategory.sort(function(a, b) { 
                if (b.value > a.value)
                    return -1;
                else if (b.value < a.value)
                    return 1;
                else   
                    return 0;
            });            

            for (var i = 0; i < EqCategory.length; i++) {
                html += '<option value="' + EqCategory[i].key + '">' + EqCategory[i].value + '</option>';
            }
            $('#inputEqCategory').html(html);
        }
    })
}

///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////


function setIdToSelectedList(checked, id) {

    if (checked == true) {
        Glo_RecordSelectedList.push(id);
    } else {
        for (var i = 0; i < Glo_RecordSelectedList.length; i++) {
            if (Glo_RecordSelectedList[i] == id) {
                Glo_RecordSelectedList.splice(i, 1);
                i--;
            }
        }
    }

    if (checked == false) {
        $('#allCheck').prop('checked', false);
    }

    setSelectedCount();
}

////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////

function printAsPdf() {

    var options = {
        backgroundColor: '#ffffff',
        scale: 5
    };

    totalPdfImageData = [];
    PrintPdfEngine(0, options);
}



function PrintPdfEngine(index, options) {

    showSpinner();

    var element = document.getElementById('pdfPage' + index);
    var wid = 800;
    var hei = 1131;

    html2canvas(element, options).then(function (canvas) {

        var imgdata = canvas.toDataURL('image/jpeg');

        totalPdfImageData.push(imgdata);

        if (index + 1 < totalPdfPage) {

            PrintPdfEngine(index + 1, options);

        } else {

            var doc = new jsPDF('p', 'mm', 'a4');
            var pdfWidth = doc.internal.pageSize.width;
            var pdfHeight = doc.internal.pageSize.height;
            var topMargin = 0;
            var leftMargin = 0;
            var contentWidth = pdfWidth - 2 * leftMargin;
            var contentHeight = contentWidth / wid * hei;

            for (var page = 0; page < totalPdfImageData.length; page++) {

                var temp = totalPdfImageData[page];
                doc.addImage(temp, 'JPEG', leftMargin, topMargin, contentWidth, contentHeight);
                if (page + 1 < totalPdfImageData.length) {

                    doc.addPage();

                } else {
                    doc.save($('#CatalogName').val() + '.pdf');
                    logSuccessActivity('Download PDF Catalog', 0, '');
                   
                    hiddenSpinner();
                }

            }
        }
    });

}


/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////

function onCheckAll(checked) {

    var len = managementTB.rows().data().length;
    var rows = managementTB.rows().data();
    for (var i = 0; i < len; i++) {
        var id = rows[i].ID;
        setIdToSelectedList(checked, id);
    }

    $('.checkbox-tick').each(function () {
        $(this).prop('checked', checked);
    });


    setSelectedCount();

}

//////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////


function onDetailInfo(id) {

    $.ajax({
        url: base_url + 'Deals/getTruckById',
        type: 'POST',
        data: {
            'id': id
        },
        success: function (data) {

            result = JSON.parse(data);
            $('#detailModal').modal('show');
            var $imgUrl = base_url + "assets/images/primaryImages/" + result.PrimaryImage;

            var title = getTitleFromDatabase(result);
            var captainStr = '<img src="' + $imgUrl + '" style="width: auto; height: auto; max-width : 250px; max-height : 270px;">';
            captainStr += '<div class="item-info-content" style="text-align: center; margin-top: 15px;">' + title + '</div>';
            $('.detail-photo').html(captainStr);

            var city = result.City.trim();
            if (city.length != 0) {
                city = city + ", ";
            }
            var state = result.State.trim();
            if (state.length != 0) {
                state = state + ", ";
            }

            var location = city + state + result.Country;
            var item = '';
            if (result.DealType == 'Auction') {

                item += "<span class='item-info-index'>" + getLocalizationWord('Deal Type') + ":&nbsp; </span> <span class='item-info-content'>" + result.DealType + '</span><br>';
                item += "<span class='item-info-index'>" + getLocalizationWord('Category') + ":&nbsp; </span> <span class='item-info-content'>" + result.EqCategory + '</span><br>';
                item += "<span class='item-info-index'>" + getLocalizationWord('SN') + ":&nbsp; </span> <span class='item-info-content'>" + result.EqSN + '</span><br>';
                item += "<span class='item-info-index'>" + getLocalizationWord('Country') + ":&nbsp; </span> <span class='item-info-content'>" + result.Country + '</span><br>';
                item += "<span class='item-info-index'>" + getLocalizationWord('State') + ":&nbsp; </span> <span class='item-info-content'>" + result.State + '</span><br>';
                item += "<span class='item-info-index'>" + getLocalizationWord('City') + ":&nbsp; </span> <span class='item-info-content'>" + result.City + '</span><br>';
                item += "<span class='item-info-index'>" + getLocalizationWord('Start Date') + ":&nbsp; </span> <span class='item-info-content'>" + result.StartDate + '</span><br>';
                item += "<span class='item-info-index'>" + getLocalizationWord('End Date') + ":&nbsp; </span> <span class='item-info-content'>" + result.EndDate + '</span><br>';
                item += "<span class='item-info-index'>" + getLocalizationWord('Auctioneer') + ":&nbsp; </span> <span class='item-info-content'>" + result.Auctioneer + '</span><br>';
                item += "<span class='item-info-index'>" + getLocalizationWord('Price') + ":&nbsp; </span> <span class='item-info-content'>" + numberWithCommas(result.Price) + '</span><br>';
                item += "<span class='item-info-index'>" + getLocalizationWord('Shipping') + ":&nbsp; </span> <span class='item-info-content'>" + numberWithCommas(result.Shipping) + '</span><br>';
                item += "<span class='item-info-index'>" + getLocalizationWord('Customs') + ":&nbsp; </span> <span class='item-info-content'>" + numberWithCommas(result.Customs) + '</span><br>';
                item += "<span class='item-info-index'>" + getLocalizationWord('Commission') + ":&nbsp; </span> <span class='item-info-content'>" + numberWithCommas(result.Commission) + '</span><br>';
                item += "<span class='item-info-index'>" + getLocalizationWord('Buyer\'s Premium') + ":&nbsp; </span> <span class='item-info-content'>" + numberWithCommas(result.BuyPremium) + '</span><br>';
                item += "<span class='item-info-index'>" + getLocalizationWord('Total') + ":&nbsp; </span> <span class='item-info-content'>" + numberWithCommas(result.Total) + '</span><br>';
                item += "<span class='item-info-index'>" + getLocalizationWord('Added By') + ":&nbsp; </span> <span class='item-info-content'>" + result.USERNAME + '</span><br>';
                item += "<span class='item-info-index'>" + getLocalizationWord('Added Date') + ":&nbsp; </span> <span class='item-info-content'>" + result.DateAdded + '</span><br>';
                item += "<span class='item-info-index'>" + getLocalizationWord('Additional Info') + ":&nbsp; </span><br><textarea class='item-info-content' disabled>" + result.Note + '</textarea><br>';

            } else if (result.DealType == 'Supplier') {

                item += "<span class='item-info-index'>" + getLocalizationWord('Deal Type') + ":&nbsp; </span> <span class='item-info-content'>" + result.DealType + '</span><br>';
                item += "<span class='item-info-index'>" + getLocalizationWord('Category') + ":&nbsp; </span> <span class='item-info-content'>" + result.EqCategory + '</span><br>';
                item += "<span class='item-info-index'>" + getLocalizationWord('SN') + ":&nbsp; </span> <span class='item-info-content'>" + result.EqSN + '</span><br>';
                item += "<span class='item-info-index'>" + getLocalizationWord('Country') + ":&nbsp; </span> <span class='item-info-content'>" + result.Country + '</span><br>';
                item += "<span class='item-info-index'>" + getLocalizationWord('State') + ":&nbsp; </span> <span class='item-info-content'>" + result.State + '</span><br>';
                item += "<span class='item-info-index'>" + getLocalizationWord('City') + ":&nbsp; </span> <span class='item-info-content'>" + result.City + '</span><br>';
                item += "<span class='item-info-index'>" + getLocalizationWord('Contact') + ":&nbsp; </span> <span class='item-info-content'>" + result.Contact + '</span><br>';
                item += "<span class='item-info-index'>" + getLocalizationWord('Contact Phone') + ":&nbsp; </span> <span class='item-info-content'>" + getStyledPhoneNumber(result.ContactPhone) + '</span><br>';
                item += "<span class='item-info-index'>" + getLocalizationWord('Company Name') + ":&nbsp; </span> <span class='item-info-content'>" + result.CompanyName + '</span><br>';
                item += "<span class='item-info-index'>" + getLocalizationWord('Price') + ":&nbsp; </span> <span class='item-info-content'>" + numberWithCommas(result.Price) + '</span><br>';
                item += "<span class='item-info-index'>" + getLocalizationWord('Shipping') + ":&nbsp; </span> <span class='item-info-content'>" + numberWithCommas(result.Shipping) + '</span><br>';
                item += "<span class='item-info-index'>" + getLocalizationWord('Customs') + ":&nbsp; </span> <span class='item-info-content'>" + numberWithCommas(result.Customs) + '</span><br>';
                item += "<span class='item-info-index'>" + getLocalizationWord('Commission') + ":&nbsp; </span> <span class='item-info-content'>" + numberWithCommas(result.Commission) + '</span><br>';
                item += "<span class='item-info-index'>" + getLocalizationWord('Margin') + ":&nbsp; </span> <span class='item-info-content'>" + numberWithCommas(result.Margin) + '</span><br>';
                item += "<span class='item-info-index'>" + getLocalizationWord('Total') + ":&nbsp; </span> <span class='item-info-content'>" + numberWithCommas(result.Total) + '</span><br>';
                item += "<span class='item-info-index'>" + getLocalizationWord('Added By') + ":&nbsp; </span> <span class='item-info-content'>" + result.USERNAME + '</span><br>';
                item += "<span class='item-info-index'>" + getLocalizationWord('Added Date') + ":&nbsp; </span> <span class='item-info-content'>" + result.DateAdded + '</span><br>';
                item += "<span class='item-info-index'>" + getLocalizationWord('Additional Info') + ":&nbsp; </span><br><textarea class='item-info-content' disabled>" + result.Note + '</textarea><br>';

            } else if (result.DealType == 'Consignment') {

                item += "<span class='item-info-index'>" + getLocalizationWord('Deal Type') + ":&nbsp; </span> <span class='item-info-content'>" + result.DealType + '</span><br>';
                item += "<span class='item-info-index'>" + getLocalizationWord('Category') + ":&nbsp; </span> <span class='item-info-content'>" + result.EqCategory + '</span><br>';
                item += "<span class='item-info-index'>" + getLocalizationWord('SN') + ":&nbsp; </span> <span class='item-info-content'>" + result.EqSN + '</span><br>';
                item += "<span class='item-info-index'>" + getLocalizationWord('Country') + ":&nbsp; </span> <span class='item-info-content'>" + result.Country + '</span><br>';
                item += "<span class='item-info-index'>" + getLocalizationWord('State') + ":&nbsp; </span> <span class='item-info-content'>" + result.State + '</span><br>';
                item += "<span class='item-info-index'>" + getLocalizationWord('City') + ":&nbsp; </span> <span class='item-info-content'>" + result.City + '</span><br>';
                item += "<span class='item-info-index'>" + getLocalizationWord('Contact') + ":&nbsp; </span> <span class='item-info-content'>" + result.Contact + '</span><br>';
                item += "<span class='item-info-index'>" + getLocalizationWord('Contact Phone') + ":&nbsp; </span> <span class='item-info-content'>" + getStyledPhoneNumber(result.ContactPhone) + '</span><br>';
                item += "<span class='item-info-index'>" + getLocalizationWord('Commission') + ":&nbsp; </span> <span class='item-info-content'>" + numberWithCommas(result.Price) + '</span><br>';
                item += "<span class='item-info-index'>" + getLocalizationWord('Commission') + ":&nbsp; </span> <span class='item-info-content'>" + numberWithCommas(result.Commission) + '</span><br>';
                item += "<span class='item-info-index'>" + getLocalizationWord('Margin') + ":&nbsp; </span> <span class='item-info-content'>" + numberWithCommas(result.Margin) + '</span><br>';
                item += "<span class='item-info-index'>" + getLocalizationWord('Total') + ":&nbsp; </span> <span class='item-info-content'>" + numberWithCommas(result.Total) + '</span><br>';
                item += "<span class='item-info-index'>" + getLocalizationWord('Added By') + ":&nbsp; </span> <span class='item-info-content'>" + result.USERNAME + '</span><br>';
                item += "<span class='item-info-index'>" + getLocalizationWord('Added Date') + ":&nbsp; </span> <span class='item-info-content'>" + result.DateAdded + '</span><br>';
                item += "<span class='item-info-index'>" + getLocalizationWord('Additional Info') + ":&nbsp; </span><br><textarea class='item-info-content' disabled>" + result.Note + '</textarea><br>';

            } else if (result.DealType == 'Inventory') {

                item += "<span class='item-info-index'>" + getLocalizationWord('Deal Type') + ":&nbsp; </span> <span class='item-info-content'>" + result.DealType + '</span><br>';
                item += "<span class='item-info-index'>" + getLocalizationWord('Category') + ":&nbsp; </span> <span class='item-info-content'>" + result.EqCategory + '</span><br>';
                item += "<span class='item-info-index'>" + getLocalizationWord('SN') + ":&nbsp; </span> <span class='item-info-content'>" + result.EqSN + '</span><br>';
                item += "<span class='item-info-index'>" + getLocalizationWord('Warehouse') + ":&nbsp; </span> <span class='item-info-content'>" + result.Warehouse + '</span><br>';
                item += "<span class='item-info-index'>" + getLocalizationWord('Price') + ":&nbsp; </span> <span class='item-info-content'>" + numberWithCommas(result.Price) + '</span><br>';
                item += "<span class='item-info-index'>" + getLocalizationWord('Margin') + ":&nbsp; </span> <span class='item-info-content'>" + numberWithCommas(result.Margin) + '</span><br>';
                item += "<span class='item-info-index'>" + getLocalizationWord('Total') + ":&nbsp; </span> <span class='item-info-content'>" + numberWithCommas(result.Total) + '</span><br>';
                item += "<span class='item-info-index'>" + getLocalizationWord('Added By') + ":&nbsp; </span> <span class='item-info-content'>" + result.USERNAME + '</span><br>';
                item += "<span class='item-info-index'>" + getLocalizationWord('Added Date') + "x:&nbsp; </span> <span class='item-info-content'>" + result.DateAdded + '</span><br>';
                item += "<span class='item-info-index'>" + getLocalizationWord('Additional Info') + ":&nbsp; </span><br><textarea class='item-info-content' disabled>" + result.Note + '</textarea><br>';

            }



            $('.detail-info-box').html(item);

        }
    });
}


/////////////////////////////////////////////////////
/////////////////////////////////////////////////////

function onDeleteWatchList(id) {
    $.ajax({
        url: base_url + 'Deals/deleteTruckFromWatchList',
        type: 'POST',
        data: {
            'ID': id
        },
        success: function (data) {

            var result = JSON.parse(data);
            if (result.success) {
                toastr.success('Remove from Watchlist');
                logSuccessActivity("Remove from Watchlist", id);
                managementTB.ajax.reload(null, false);  
            } else {
                logErrorActivity("Remove from Watchlist", id, "No Current ID");
                toastr.error('Remove from Watchlist Error');
            }
        }
    });
}

///////////////////////////////////////////////////////
///////////////////////////////////////////////////////

function onEditInfo(id) {

    $.ajax({
        url: base_url + 'Deals/getTruckById',
        type: 'POST',
        data: {
            id: id
        },
        success: function (data) {

            result = JSON.parse(data);

            $('#editModal').modal('show');
            $('#edit-item-id').val(id);
            $('#edit-item-dealType').val(result.DealType);

            var $imgUrl = base_url + "assets/images/primaryImages/" + result.PrimaryImage;
            var captainStr = '<img  id="primaryImageEditController" onclick="onClickPrimaryEditImage()" src="' + $imgUrl + '" style="width: 100%; height: auto;  cursor: pointer;">';
            $('.edit-photo').html(captainStr);

            var item = '';
            if (result.DealType == 'Auction') {

                item += "<div class='item-edit-item-box'><span class='item-edit-index'>" + getLocalizationWord('Start Date') + ":&nbsp; </span> <input data-provide='datepicker' id='item-startdate' name='StartDate' data-date-autoclose='true'  data-date-format='yyyy-mm-dd' class='item-edit-content'  value='" + result.StartDate + "'></div>";
                item += "<div class='item-edit-item-box'><span class='item-edit-index'>" + getLocalizationWord('End Date') + ":&nbsp; </span> <input data-provide='datepicker' id='item-enddate' name='EndDate' data-date-autoclose='true'  data-date-format='yyyy-mm-dd' class='item-edit-content' value='" + result.EndDate + "'></div>";
                item += "<div class='item-edit-item-box'><span class='item-edit-index'>" + getLocalizationWord("Buyer's Premium") + ":&nbsp; </span> <input class='item-edit-content' id='item-buy-premium' name='BuyPremium' onkeyup='calculateTotalValue(\"" + result.DealType + "\")' value='" + result.BuyPremium + "'></div>";
                item += "<div class='item-edit-item-box'><span class='item-edit-index'>" + getLocalizationWord('Price') + ":&nbsp; </span> <input class='item-edit-content' id='item-price-to-bet' type='number' name='Price' onkeyup='calculateTotalValue(\"" + result.DealType + "\")'  value='" + result.Price + "'></div>";
                item += "<div class='item-edit-item-box'><span class='item-edit-index'>" + getLocalizationWord('Shipping') + ":&nbsp; </span> <input class='item-edit-content' type='number' id='item-shipping' name='Shipping' onkeyup='calculateTotalValue(\"" + result.DealType + "\")' value='" + result.Shipping + "'></div>";
                item += "<div class='item-edit-item-box'><span class='item-edit-index'>" + getLocalizationWord('Customs') + ":&nbsp; </span> <input class='item-edit-content' type='number' id='item-customs' name='Customs' onkeyup='calculateTotalValue(\"" + result.DealType + "\")' value='" + result.Customs + "'></div>";
                item += "<div class='item-edit-item-box'><span class='item-edit-index'>" + getLocalizationWord('Commission') + ":&nbsp; </span> <input class='item-edit-content' type='number' id='item-commission' name='Commission' onkeyup='calculateTotalValue(\"" + result.DealType + "\")' value='" + result.Commission + "'></div>";                
                item += "<div class='item-edit-item-box'><span class='item-edit-index'>" + getLocalizationWord('Total') + ":&nbsp; </span> <input class='item-edit-content' type='number'  id='item-total' name='Total' value='" + result.Total + "' readonly></div>";
                item += "<div class='item-edit-item-box'><span class='item-edit-index'>" + getLocalizationWord('Additional Info') + ":&nbsp; </span> <textarea class='item-edit-content' id='item-note' name='Note'>" + result.Note + "</textarea></div>";

                $('.edit-info-box').html(item);

                $('#item-buy-premium').inputFilter(function (value) {
                    return /^-?\d*[.]?\d*$/.test(value) && (value === "" || parseInt(value) <= 100);
                });

                // setting datepicker characteristc;

                $('#item-startdate').datepicker({
                    startDate: new Date()
                }).on('changeDate', function (selected) {
                    var startDate = new Date(selected.date.valueOf());
                    var endDate = new Date($('#item-enddate').val());
                    if (startDate.getTime() > endDate.getTime()) {

                        $('#item-enddate').datepicker('setDate', startDate);
                    }
                    $('#item-enddate').datepicker('setStartDate', startDate);
                });

                $('#item-enddate').datepicker('setStartDate', new Date);

            } else if (result.DealType == 'Supplier') {

                item += "<div class='item-edit-item-box'><span class='item-edit-index'>" + getLocalizationWord('Price') + "Price:&nbsp; </span> <input class='item-edit-content' type='number' id='item-price' name='Price'  onkeyup='calculateTotalValue(\"" + result.DealType + "\")'  value='" + result.Price + "'></div>";
                item += "<div class='item-edit-item-box'><span class='item-edit-index'>" + getLocalizationWord('Shipping') + ":&nbsp; </span> <input class='item-edit-content' type='number' id='item-shipping' name='Shipping' onkeyup='calculateTotalValue(\"" + result.DealType + "\")' value='" + result.Shipping + "'></div>";
                item += "<div class='item-edit-item-box'><span class='item-edit-index'>" + getLocalizationWord('Customs') + ":&nbsp; </span> <input class='item-edit-content' type='number' id='item-customs' name='Customs' onkeyup='calculateTotalValue(\"" + result.DealType + "\")' value='" + result.Customs + "'></div>";
                item += "<div class='item-edit-item-box'><span class='item-edit-index'>" + getLocalizationWord('commission') + ":&nbsp; </span> <input class='item-edit-content' type='number' id='item-commission' name='Commission' onkeyup='calculateTotalValue(\"" + result.DealType + "\")' value='" + result.Commission + "'></div>";
                item += "<div class='item-edit-item-box'><span class='item-edit-index'>" + getLocalizationWord('Margin') + ":&nbsp; </span> <input class='item-edit-content' id='item-margin' name='Margin' value='" + result.Margin + "'></div>";
                item += "<div class='item-edit-item-box'><span class='item-edit-index'>" + getLocalizationWord('Total') + ":&nbsp; </span> <input class='item-edit-content' type='number'  id='item-total' name='Total' value='" + result.Total + "' readonly></div>";
                item += "<div class='item-edit-item-box'><span class='item-edit-index'>" + getLocalizationWord('Additional Info') + ":&nbsp; </span> <textarea class='item-edit-content' id='item-note' name='Note'>" + result.Note + "</textarea></div>";


                $('.edit-info-box').html(item);

                $('#item-margin').inputFilter(function (value) {
                    return /^-?\d*[.]?\d*$/.test(value);
                });
            } else if (result.DealType == 'Consignment') {

                item += "<div class='item-edit-item-box'><span class='item-edit-index'>" + getLocalizationWord('Price') + ":&nbsp; </span> <input class='item-edit-content' type='number' id='item-price' name='Price'  onkeyup='calculateTotalValue(\"" + result.DealType + "\")'  value='" + result.Price + "'></div>";
                item += "<div class='item-edit-item-box'><span class='item-edit-index'>" + getLocalizationWord('commission') + ":&nbsp; </span> <input class='item-edit-content' type='number' id='item-commission' name='Commission' onkeyup='calculateTotalValue(\"" + result.DealType + "\")' value='" + result.Commission + "'></div>";
                item += "<div class='item-edit-item-box'><span class='item-edit-index'>" + getLocalizationWord('Margin') + ":&nbsp; </span> <input class='item-edit-content' id='item-margin' name='Margin' value='" + result.Margin + "'></div>";
                item += "<div class='item-edit-item-box'><span class='item-edit-index'>" + getLocalizationWord('Total') + ":&nbsp; </span> <input class='item-edit-content' type='number'  id='item-total' name='Total' value='" + result.Total + "' readonly></div>";
                item += "<div class='item-edit-item-box'><span class='item-edit-index'>" + getLocalizationWord('Additional Info') + ":&nbsp; </span> <textarea class='item-edit-content' id='item-note' name='Note'>" + result.Note + "</textarea></div>";

                $('.edit-info-box').html(item);

                $('#item-margin').inputFilter(function (value) {
                    return /^-?\d*[.]?\d*$/.test(value);
                });
            } else if (result.DealType == 'Inventory') {

                item += "<div class='item-edit-item-box'><span class='item-edit-index'>" + getLocalizationWord('Price') + ":&nbsp; </span> <input class='item-edit-content' type='number' id='item-price' name='Price'  onkeyup='calculateTotalValue(\"" + result.DealType + "\")'  value='" + result.Price + "'></div>";
                item += "<div class='item-edit-item-box'><span class='item-edit-index'>" + getLocalizationWord('Margin') + ":&nbsp; </span> <input class='item-edit-content' id='item-margin' name='Margin' value='" + result.Margin + "'></div>";
                item += "<div class='item-edit-item-box'><span class='item-edit-index'>" + getLocalizationWord('Total') + ":&nbsp; </span> <input class='item-edit-content' type='number'  id='item-total' name='Total' value='" + result.Total + "' readonly></div>";
                item += "<div class='item-edit-item-box'><span class='item-edit-index'>" + getLocalizationWord('Additional Info') + ":&nbsp; </span> <textarea class='item-edit-content' id='item-note' name='Note'>" + result.Note + "</textarea></div>";

                $('.edit-info-box').html(item);

                $('#item-margin').inputFilter(function (value) {
                    return /^-?\d*[.]?\d*$/.test(value);
                });
            }

        }
    });
}

/////////////////////////////////////////////////////////
////////////////////////////////////////////////////////

function calculateTotalValue(dealType) {

    if (dealType == 'Auction') {

        var valBuyersPremium = parseInt($('#item-buy-premium').val());
        var valPriceToBet = parseInt($('#item-price-to-bet').val());
        var valShipping = parseInt($('#item-shipping').val());
        var valCustoms = parseInt($('#item-customs').val());
        var valComm = parseInt($('#item-commission').val());

        var total = (valBuyersPremium * valPriceToBet) / 100 + valPriceToBet + valShipping + valCustoms + valComm;
        var decimal = total - Math.floor(total);

        if (decimal.toString().length > 2) {
            total = total.toFixed(2);
        }

        $('#item-total').val(total);

    } else if (dealType == 'Supplier') {

        var valPrice = parseInt($('#item-price').val());
        var valShipping = parseInt($('#item-shipping').val());
        var valCustoms = parseInt($('#item-customs').val());
        var valComm = parseInt($('#item-commission').val());

        var total = valPrice + valShipping + valCustoms + valComm;
        var decimal = total - Math.floor(total);

        if (decimal.toString().length > 2) {
            total = total.toFixed(2);
        }
        $('#item-total').val(total);


    } else if (dealType == 'Consignment') {

        var valPrice = parseInt($('#item-price').val());
        var valComm = parseInt($('#item-commission').val());

        var total = valPrice + valComm;
        var decimal = total - Math.floor(total);

        if (decimal.toString().length > 2) {
            total = total.toFixed(2);
        }
        $('#item-total').val(total);

    } else if (dealType == 'Inventory') {

        var valPrice = parseInt($('#item-price').val());

        var total = valPrice;
        var decimal = total - Math.floor(total);

        if (decimal.toString().length > 2) {
            total = total.toFixed(2);
        }
        $('#item-total').val(total);
    }
}

//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////

function onClickPrimaryEditImage() {
    $('#inputEditPrimaryImage').click();
}

$('#inputEditPrimaryImage').change(function () {
    readURL(this, $('#primaryImageEditController'));
});

function readURL(input, avatar) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $(avatar)
                .attr('src', e.target.result);
        };

        reader.readAsDataURL(input.files[0]);
    }
}

//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////


function saveDetailInfo() {
    showSpinner();
    $('#banner-picture-making-panel').html('');
    $.ajax({
        url: base_url + 'Deals/updateTruckById',
        type: 'POST',
        data: new FormData(document.getElementById('editModalForm')),
        contentType: false,
        cache: false,
        processData: false,
        dataType: "json",

        success: function (result) {

            if (result.success == true) {

                toastr.success(LocalizationMessage('Edit Deal Info'));

                logSuccessActivity('Edit Deal Info', $('#edit-item-id').val(), 'tblDeals');

                managementTB.ajax.reload(null, false);
                websocket.send(JSON.stringify({ 'msg': 'save_truck', 'poster': $('#usernameInput').val() }));

                hiddenSpinner();

                // if (result.pictures) {

                //     $('#banner-picture-making-panel').html(getBannerImageElement(result.pictures));

                // // make and save banner image
                // var element = document.getElementById('bannerImage0');
                // var id = $('#bannerImage0').data('id');

                // html2canvas(element).then(function (canvas) {
                //     var imgdata = canvas.toDataURL('image/jpeg');
                //     var bannerImagesCache = { imgdata: imgdata, ID: id };
                //     $.ajax({
                //         url: base_url + "Deals/AddBannerPrimaryImage",
                //         method: "POST",
                //         data: bannerImagesCache,
                //         success: function (res) {
                //             var result = JSON.parse(res);
                //             if (result.success) {

                //                 toastr.success('Truck Information has been updated successfully.');
                //                 managementTB.ajax.reload(null, false);  
                //                 websocket.send(JSON.stringify({ 'msg': 'save_truck', 'poster': $('#usernameInput').val() }));
                //             }

                //             hiddenSpinner();
                //         }
                //     });
                // });

                // } else {

                //     hiddenSpinner();
                //     toastr.success('Truck Information has been updated successfully.');
                //     managementTB.ajax.reload(null, false);  
                //     websocket.send(JSON.stringify({ 'msg': 'save_truck', 'poster': $('#usernameInput').val() }));

                // }


            } else {
                toastr.error(LocalizationMessage('Edit Deal Info') + ' Error');           
                logErrorActivity('Edit Deal Info', $('#edit-item-id').val(), 'tblDeals', result.message);                
                hiddenSpinner();
            }
            $('#editModal').modal('hide');
        }
    });
}

function onDeleteModal(id) {
    $('#deleteModal').modal('show');
    $('#delete-item-id').val(id);
}

function deleteTruck() {

    var id = $('#delete-item-id').val();

    showSpinner();

    $.ajax({
        url: base_url + 'Deals/deleteTruckById',
        type: 'POST',
        data: {
            id: id
        },
        success: function (data) {
            hiddenSpinner();
            var result = JSON.parse(data);
            if (result.message == true) {
                toastr.success(LocalizationMessage('Delete Auction'));
                setIdToSelectedList(false, id);
                setSelectedCount();
                managementTB.ajax.reload(null, false);  
                websocket.send(JSON.stringify({ 'msg': 'delete_truck', 'poster': $('#usernameInput').val() }));

                logSuccessActivity('Delete Auction',  id, 'tblDeals');                

            } else {
                toastr.error(LocalizationMessage('Delete Auction') + ' Error');
                logErrorActivity('Delete Auction', id, 'tblDeals', result.message);
            }
            $('#deleteModal').modal('hide');
        }
    });
}

function checkEnterkey(e) {
    if (e.keyCode == 13) {
        $('#searchbtn').trigger('click');
    }
}


function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


function onPublishPage(id, EqCategory) {

    $('#publishModal').modal('show');
    showSpinner();
    id_selected_for_publish = id;
    $('#publish_image_box').html('');

    $.ajax(
        {
            url: base_url + 'Deals/getTruckById',
            type: 'POST',
            data: {
                id: id
            },
            success: function (res) {
                var full = JSON.parse(res);
                $('.publish_image').prop('src'); 

                var contentItem = '';
                contentItem += '<div class="publish_image_container">';
                contentItem += '<img src="' + base_url + 'assets/images/primaryImages/' + full.PrimaryImage + '" class="publish_image">';
                contentItem += '<img class="publishModal-banner1" src="' + base_url + 'assets/images/ribbon/com_mark.png">';
                contentItem += '<img class="publishModal-banner2" src="' + base_url + 'assets/images/ribbon/banner_footer.png">';
                contentItem += '</div>';
                contentItem += '<div class="publish-content-box">';
                contentItem += "<div class='publish-title' contenteditable='true'>" + getTitleFromDatabase(full); + "</div>";
                contentItem += "<div class='publish-total-price' contenteditable='true'> USD $" + numberWithCommas(full.Total) + "</div>";
                contentItem += '<div class="publish-label">Descripcion</div>'
                contentItem += '<div class="publish-description-content-box" contenteditable="true">';

                if (full.EqCategory) {
                    contentItem += " - " + full.EqCategory + '<br>';
                }
                if (parseInt(full.TruckYear)) {
                    contentItem += " - " + full.TruckYear + '<br>';
                }
                if (full.TruckMake) {
                    contentItem += " - " + full.TruckMake + '<br>';
                }
                if (full.Engine) {

                    contentItem += " - " + full.Engine + '<br>';
                }
                if (full.TruckModel) {

                    contentItem += " - " + full.TruckModel + '<br>';
                }
                if (full.TruckTrans) {

                    contentItem += " - " + full.TruckTrans + '<br>';
                }
                if (full.TruckCondition) {

                    contentItem += " - " + full.TruckCondition + '<br>';
                }
                if (parseFloat(full.Capacity)) {

                    if (full.EqCategory == 'Skid Steer' || full.EqCategory == 'Forklift') {

                        contentItem += " - " + full.Capacity + ' pounds' + '<br>';

                    } else if (full.EqCategory == 'Concrete Pump Truck') {

                        contentItem += " - " + full.Capacity + ' meters' + '<br>';

                    } else if (full.EqCategory == 'Generator') {

                        contentItem += " - " + full.Capacity + ' kw' + '<br>';

                    } else {

                        contentItem += " - " + full.Capacity + ' tons' + '<br>';
                    }

                }
                if (parseFloat(full.Length)) {

                    contentItem += " - " + full.Length + ' ft' + '<br>';
                }
                if (full.Type) {

                    contentItem += " - " + full.Type + '<br>';
                }
                if (parseFloat(full.Hours)) {

                    contentItem += " - " + full.Hours + 'hours' + '<br>';
                }
                if (parseInt(full.Cab) == 2) {
                    contentItem += " - " + 'Cabin' + '<br>';
                }
                if (parseInt(full['4WD']) == 2) {

                    contentItem += " - " + '4WD' + '<br>';
                }
                if (parseInt(full.Ext) == 2) {

                    contentItem += " - " + 'Ext' + '<br>';
                }
                if (parseInt(full.AuxHyd) == 2) {

                    contentItem += " - " + 'AuxHyd' + '<br>';
                }
                if (parseInt(full.Ripper) == 2) {

                    contentItem += " - " + 'Ripper' + '<br>';
                }

                contentItem += '</div>';

                $('.publish_image_box').html(contentItem);
                hiddenSpinner();
            }

        });

}

function publishImageFrame() {
    var siteName = $('#siteinput').val();

    showSpinner();

    var element = document.getElementById('publish_image_box');

    html2canvas(element).then(function (canvas) {
        var imgdata = canvas.toDataURL('image/jpeg');
        // The content image converted should be uploaded.
        $.ajax({
            url: base_url + 'Deals/uploadImageForPost',
            type: 'POST',
            data: {
                'siteName': siteName,
                'imageData': imgdata
            },
            success: function (data) {
                var result = JSON.parse(data);
                hiddenSpinner();
                $('#publishModal').modal('hide');
                if (result.success == false) {
                    toastr.error(result.message);
                } else if (result.success == true) {
                    if (result.message) {
                        toastr.success(result.message);
                    }
                    if (result.redirectUrl) {
                        document.location.href = result.redirectUrl;
                    }
                }
            }
        });

    });

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


/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////

function onMediaView(id) {


    $('.truck-table-container').css('display', 'none');
    $('#media-content').css('display', 'block');
    $('#picture-gallery-box').html('');

    $('#truck-id').val(id);
    $('#truck-picture-view-id').val(id);
    $('#truck2-picture-view-id').val(id);
    $('#truck-video-view-id').val(id);
    showSpinner();

    $.ajax({
        url: base_url + "Deals/Media",
        method: "POST",
        data: { 'ID': id },
        success: function (res) {

            var result = JSON.parse(res);
            var pictures = result.pictures;
            var video = result.video;
            if (result.success == true) {

                var newItem = '';

                if (pictures.length > 0) {

                    newItem = ' <div id="lightgallery" class="clearfix lightGallery">';
                    newItem += getSliderImageElements(pictures);
                    newItem += '</div>';

                    $('#picture-gallery-box').html(newItem);
                    $("#lightgallery").lightGallery({
                        selector: '.light-link',
                        share: false
                    });


                    // var tempImageList = [];
                    // for (picture of pictures) {
                    //     if (parseInt(picture.BannerWidth) == 0 || parseInt(picture.BannerHeight) == 0 || picture.bannerUrl == '') {
                    //         tempImageList.push(picture);
                    //     }
                    // }
                    // if (tempImageList.length == 0) {

                    //     var newItem = ' <div id="lightgallery" class="clearfix lightGallery">';

                    //     newItem += getSliderImageElements(pictures);

                    //     newItem += '</div>';
                    //     $('#picture-gallery-box').html(newItem);
                    //     $("#lightgallery").lightGallery({
                    //         selector: '.light-link',
                    //         publish: false
                    //     });
                    //     hiddenSpinner();
                    // } else {
                    //     // make banner image
                    //     $('#banner-picture-making-panel').html('');
                    //     $('#banner-picture-making-panel').html(getBannerImageElement(tempImageList));

                    //     var bannerImagesCache = [];
                    //     var bannerImageCount = tempImageList.length;

                    //     uploadBannerImageWhenModalView(0, bannerImagesCache, bannerImageCount, id);

                    // }


                } else {
                    newItem += '<div class="message-box"><h2 style="text-align: center;">' + LocalizationMessage('No Images') + '!</h2></div>';
                    $('#picture-gallery-box').html(newItem);

                }

                var newElement = '';
                if (video) {

                    var videoUrl = video.url;

                    newElement += '<video width="600" height="450" controls>';
                    newElement += ' <source src="' + videoUrl + '" type="video/mp4">';
                    newElement += '</video>';

                    $('.video-gallery-box-body').html(newElement);

                } else {

                    newElement += '<div class="message-box"><h2 style="text-align: center;">' + LocalizationMessage('No Videos') + '!</h2></div>';
                    $('.video-gallery-box-body').html(newElement);

                }
            }

            hiddenSpinner();
        }
    });
}


function uploadBannerImageWhenModalView(index, bannerImagesCache, bannerImageCount, truckId) {

    var element = document.getElementById('bannerImage' + index);
    var id = $('#bannerImage' + index).data('id');
    var primary = parseInt($('#bannerImage' + index).data('primary'));

    html2canvas(element).then(function (canvas) {
        var imgdata = canvas.toDataURL('image/jpeg');
        bannerImagesCache.push({ imgdata: imgdata, ID: id, Primary: primary });
        if (index + 1 < bannerImageCount) {

            uploadBannerImageWhenModalView(index + 1, bannerImagesCache, bannerImageCount, truckId);

        } else {

            $.ajax({
                url: base_url + "Deals/AddBannerPrimaryAndSliderImage",
                method: "POST",
                data: { 'TruckID': truckId, 'images': bannerImagesCache },

                success: function (res) {
                    var result = JSON.parse(res);
                    if (result.success) {

                        var newItem = ' <div id="lightgallery" class="clearfix lightGallery">';
                        newItem += getSliderImageElements(result.pictures);
                        newItem += '</div>';
                        $('#picture-gallery-box').html(newItem);
                        $("#lightgallery").lightGallery({
                            selector: '.light-link',
                            share: false
                        });
                        hiddenSpinner();
                    }
                }
            });

        }
    });

}

/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////

function goBack() {
    $('.truck-table-container').css('display', 'block');
    $('#media-content').css('display', 'none');
}


function onMediaControlModal() {

    $('#mediaControlModal').modal('show');
    var TruckId = $('#truck-picture-view-id').val();

    $.ajax({
        url: base_url + "Deals/Media",
        method: "POST",
        data: { 'ID': TruckId },
        success: function (res) {

            var result = JSON.parse(res);

            var pictures = result.pictures;
            var video = result.video;

            if (result.success == true) {

                var picElements = '';
                var videoElement = '';

                $('.picture-control-main-box').html("");
                $('.video-control-panel-box').html("");

                if (pictures.length > 0) {
                    picElements += getSliderEditImageElements(pictures);
                }

                if (video) {
                    var url = video.url;
                    videoElement += '<video width="600" height="450" controls data-id="' + data.ID + '">';
                    videoElement += ' <source src="' + url + '" type="video/mp4">';
                    videoElement += '</video>';
                }



                $('.picture-control-main-box').html(picElements);
                $('.video-control-panel-box').html(videoElement);

                if ($('.video-control-panel-box').children().length == 0) {
                    $('#slider-video-delete-btn').prop('disabled', true);
                } else {
                    $('#slider-video-delete-btn').prop('disabled', false);
                }

            }
        }
    });


}

////////////////////////////////////////////////////////
///////////////////////multi image uploading in modal panel/////////////////////////////////

$('#slider-image-upload-btn').click(function () {
    $('#inputEditImgProfile').click();
});

$('#inputEditImgProfile').change(function () {

    var form = new FormData();
    var formfiles = $('#inputEditImgProfile').get(0).files;

    for (var i = 0; i < formfiles.length; i++) {
        form.append('files[]', formfiles[i]);
    }

    var truckID = $('#truck-picture-view-id').val();
    form.append('TruckID', $('#truck-picture-view-id').val());

    showSpinner();
    $('#banner-picture-making-panel').html('');

    $.ajax({
        url: base_url + "Deals/AddSliderImage",
        method: "POST",
        data: form,
        contentType: false,
        cache: false,
        processData: false,
        dataType: "json",
        success: function (result) {

            if (result.success == true) {

                var newElement = '';
                newElement += getSliderEditImageElements(result.pictures);
                $('.picture-control-main-box').html(newElement);

                var newItem = ' <div id="lightgallery" class="clearfix lightGallery">';
                newItem += getSliderImageElements(result.pictures);
                newItem += '</div>';

                $('#picture-gallery-box').html(newItem);
                $("#lightgallery").lightGallery({
                    selector: '.light-link',
                    share: false
                });

                logSuccessActivity('Upload Picture', truckID, 'tblDeals');

                // $('#banner-picture-making-panel').html(getBannerImageElement(result.pictures));

                // var bannerImagesCache = [];
                // var bannerImageCount = result.pictures.length;
                // var truckId = $('#truck-picture-view-id').val();

                // uploadBannerImage(0, bannerImagesCache, bannerImageCount, truckId);


                hiddenSpinner();

            } else {
                $('#inputEditImgProfile').val("");
                logErrorActivity('Upload Picture', truckID, 'tblDeals', result.message);
                hiddenSpinner();
            }

        }
    });
});




function uploadBannerImage(index, bannerImagesCache, bannerImageCount, truckId) {

    var element = document.getElementById('bannerImage' + index);
    var id = $('#bannerImage' + index).data('id');

    html2canvas(element).then(function (canvas) {
        var imgdata = canvas.toDataURL('image/jpeg');
        bannerImagesCache.push({ imgdata: imgdata, ID: id });
        if (index + 1 < bannerImageCount) {

            uploadBannerImage(index + 1, bannerImagesCache, bannerImageCount, truckId);

        } else {

            $.ajax({
                url: base_url + "Deals/AddSliderBannerImage",
                method: "POST",
                data: { 'TruckID': truckId, 'images': bannerImagesCache },

                success: function (res) {
                    var result = JSON.parse(res);
                    if (result.success) {

                        var newElement = '';
                        newElement += getSliderEditImageElements(result.pictures);
                        $('.picture-control-main-box').html(newElement);

                        var newItem = ' <div id="lightgallery" class="clearfix lightGallery">';
                        newItem += getSliderImageElements(result.pictures);
                        newItem += '</div>';

                        $('#picture-gallery-box').html(newItem);
                        $("#lightgallery").lightGallery({
                            selector: '.light-link',
                            share: false
                        });

                    }

                    $('#inputEditImgProfile').val("");
                    hiddenSpinner();

                }
            });

        }
    });

}


/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////

function onEditPrimaryImage() {
    $('#inputEditPrimaryImgProfile').click();
};

$('#inputEditPrimaryImgProfile').change(function () {

    showSpinner();
    $('#banner-picture-making-panel').html('');
    $.ajax({
        url: base_url + 'Deals/editPrimaryImage',
        method: "POST",
        data: new FormData(document.getElementById('upload-primary-image-form')),
        contentType: false,
        cache: false,
        processData: false,
        dataType: "json",
        success: function (result) {


            if (result.success == false) {
                toastr.error('File stream failed!');
                hiddenSpinner();
            } else {

                var newElement = '';
                newElement += getSliderEditImageElements(result.pictures);
                $('.picture-control-main-box').html(newElement);

                var newItem = ' <div id="lightgallery" class="clearfix lightGallery">';
                newItem += getSliderImageElements(result.pictures);
                newItem += '</div>';

                $('#picture-gallery-box').html(newItem);
                $("#lightgallery").lightGallery({
                    selector: '.light-link',
                    share: false
                });

                managementTB.ajax.reload(null, false);  
                websocket.send(JSON.stringify({ 'msg': 'save_truck', 'poster': $('#usernameInput').val() }));

                // $('#banner-picture-making-panel').html(getBannerImageElement(result.pictures));

                // // make and save banner image
                // var element = document.getElementById('bannerImage0');
                // var id = $('#bannerImage0').data('id');

                // html2canvas(element).then(function (canvas) {
                //     var imgdata = canvas.toDataURL('image/jpeg');
                //     var bannerImagesCache = { imgdata: imgdata, ID: id };
                //     $.ajax({
                //         url: base_url + "Deals/AddBannerPrimaryImage",
                //         method: "POST",
                //         data: bannerImagesCache,
                //         success: function (res) {
                //             var result = JSON.parse(res);
                //             if (result.success) {
                //                 toastr.success('Primary Image has been updated successfully');

                //                 var newElement = '';
                //                 newElement += getSliderEditImageElements(result.pictures);
                //                 $('.picture-control-main-box').html(newElement);

                //                 var newItem = ' <div id="lightgallery" class="clearfix lightGallery">';
                //                 newItem += getSliderImageElements(result.pictures);
                //                 newItem += '</div>';

                //                 $('#picture-gallery-box').html(newItem);
                //                 $("#lightgallery").lightGallery({
                //                     selector: '.light-link',
                //                     publish: false
                //                 });

                //                 managementTB.ajax.reload(null, false);  
                //                 websocket.send(JSON.stringify({ 'msg': 'save_truck', 'poster': $('#usernameInput').val() }));
                //             }

                //             hiddenSpinner();
                //         }
                //     });
                // });


            }
        }
    });

});


//////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////

function setBorder(element) {
    var mediaId = $(element).data('id');
    var property = $('.picture-item-check-box', element).css('display');
    if (property == 'none') {
        $('.picture-item-check-box', element).css('display', 'flex');
    } else {
        $('.picture-item-check-box', element).css('display', 'none');
    }

    var list = getCheckedElementIdList();

    if (list.length > 0) {
        $('#slider-image-delete-btn').prop('disabled', false);
    } else {
        $('#slider-image-delete-btn').prop('disabled', true);
    }
}

function getCheckedElementIdList() {
    var list = [];
    $('.slider-picture-control-item').each(function () {
        var property = $('.picture-item-check-box', this).css('display');
        if (property != 'none') {
            var mediaId = $(this).data('id');
            list.push(mediaId);
        }
    });

    return list;
}

/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////

function deleteSelectedPictureListConfirm() {

    $('#deletePicturesModal').modal('show');
}

function deletePictures() {

    $('#deletePicturesModal').modal('hide');
    showSpinner();

    var list = getCheckedElementIdList();
    var truckID = $('#truck-picture-view-id').val();

    if (list.length > 0) {
        $.ajax({
            url: base_url + "Deals/deleteMediaData",
            method: "POST",
            data: { 'IDs': list, 'TruckID': truckID },
            success: function (res) {

                var result = JSON.parse(res);

                if (result.success == true) {

                    logSuccessActivity('Delete Picture', truckID, 'tblDeals');
                    var newElement = '';
                    var newItem = '';

                    if (result.pictures.length > 0) {

                        newElement += getSliderEditImageElements(result.pictures);
                        $('.picture-control-main-box').html(newElement);

                        newItem += ' <div id="lightgallery" class="clearfix lightGallery">';
                        newItem += getSliderImageElements(result.pictures);
                        newItem += '</div>';

                        $('#picture-gallery-box').html(newItem);
                        $("#lightgallery").lightGallery({
                            selector: '.light-link',
                            share: false
                        });


                    } else {

                        newItem += '<div class="message-box"><h2 style="text-align: center;">No Images!</h2></div>';
                        $('#picture-gallery-box').html(newItem);
                        $('.picture-control-main-box').html("");

                    }


                    $('#slider-image-delete-btn').prop('disabled', true);

                }
                else {
                    logErrorActivity('Delete Picture', truckID, 'tblDeals', result.message);
                }
                hiddenSpinner();

            }
        });
    }

}

///////////////////////////////////////////////////
////////////////////////////////////////////////////

function progressStart(event) {
    $('#progress-value').html("0%");
    $('#progress-bar').width("0");
    showProgressBox();
}

function progressHandler(event) {
    var percent = parseInt((event.loaded / event.total) * 100);
    $('#progress-value').html(percent + "%");
    $('#progress-bar').width(percent + "%");
}

function completeHandler(event) {
    hiddenProgressBox();

}


$('#slider-video-upload-btn').click(function () {
    $('#inputEditVideoProfile').click();
});

$('#inputEditVideoProfile').change(function () {

    var file = document.getElementById('inputEditVideoProfile').files[0];
    if (file.size / 1024 / 1024 > 150) {

        toastr.error('File size is too large. Maximum size is 150MB.');

    } else {

        var form = document.getElementById('video-upload-panel-section-form');

        var formData = new FormData(form);
        var ajax = new XMLHttpRequest();
        ajax.upload.addEventListener('progress', progressHandler, false);

        ajax.addEventListener('loadstart', progressStart, false);
        ajax.open('POST', base_url + "Deals/AddVideo");
        ajax.responseType = 'text';

        ajax.onload = function () {
            var truckID = $('#truck-video-view-id').val();
            hiddenProgressBox();
            var response = ajax.responseText;

            var result = JSON.parse(response);
            if (result.success == true) {
                
                logSuccessActivity('Upload Video', truckID, 'tblDeals');
                var newElement = '';
                newElement += '<video width="600" height="450" controls data-id="' + result.ID + '">';
                newElement += ' <source src="' + result.url + '" type="video/mp4">';
                newElement += '</video>';
                $('.video-control-panel-box').html(newElement);
                $('.video-gallery-box-body').html(newElement);

                $('#slider-video-delete-btn').prop('disabled', false);
            }
            else {
                logErrorActivity('Upload Video', truckID, 'tblDeals', result.message);
            }
        }

        ajax.send(formData);

    }

});

///////////////////////////////////////////////////////
///////////////////////////////////////////////////////

$('#slider-video-delete-btn').click(function () {
    $('#deleteVideoModal').modal('show');
});

function deleteVideo() {
    $('#deleteVideoModal').modal('hide');
    var TruckID = $('#truck-video-view-id').val();
    showSpinner();
    $.ajax({
        url: base_url + "Deals/deleteVideo",
        method: "POST",
        data: { 'TruckID': TruckID },
        success: function (res) {

            var result = JSON.parse(res);
            if (result.success == true) {

                logSuccessActivity('Delete Video', TruckID, 'tblDeals');
                var newElement = '<div class="message-box"><h2 style="text-align: center;">No Videos!</h2></div>';

                $('.video-gallery-box-body').html(newElement);
                $('.video-control-panel-box').html('');

                $('#slider-video-delete-btn').prop('disabled', true);
            }
            else {
                logErrorActivity('Delete Video', TruckID, 'tblDeals', result.message);
            }
            hiddenSpinner();
        }
    });
}


/////////////////////////////////////////
/////////////////////////////////////////


function onAllDownload(banner) {

    if (banner == 1) {

        showSpinner();

        // first check whether banner image exists or not.
        var truckID = $('#truck-id').val();

        $.ajax({
            url: base_url + "Deals/Media",
            method: "POST",
            data: { 'ID': truckID },
            success: function (res) {

                var result = JSON.parse(res);
                var pictures = result.pictures;
                if (result.success == true) {

                    // check all
                    var nobannerFilelist = [];
                    for (picture of pictures) {
                        if (picture.bannerFilename == '' || parseInt(picture.BannerWidth) == 0 || parseInt(picture.BannerHeight) == 0) {
                            nobannerFilelist.push(picture);
                        }
                    }

                    if (nobannerFilelist.length == 0) {



                        for (picture of pictures) {

                            var url = picture.bannerUrl;
                            var str = picture.DownloadName;
                            var name = str.replace(/[^A-Za-z0-9]/g, '');
                            var newElement = $("<a href='" + url + "' download='" + name + "'>test</a>");
                            $(newElement)[0].click();
                        }
                        hiddenSpinner();

                        logSuccessActivity('Download Pictures with Banner', truckID, 'tblDeals');

                    } else {

                        // make banner image from no banner file truck list
                        $('#banner-picture-making-panel').html('');
                        $('#banner-picture-making-panel').html(getBannerImageElement(nobannerFilelist));

                        var bannerImagesCache = [];
                        var bannerImageCount = nobannerFilelist.length;

                        uploadBannerImageAndDownload(0, bannerImagesCache, bannerImageCount, truckID);

                    }
                } else {
                    logErrorActivity('Download Pictures with Banner', truckID, 'tblDeals', 'Error happens while downloading!')                    
                    toastr.error('Download Pictures with Banner Error');
                    hiddenSpinner();
                }
            }
        });

    } else {
        var truckID = $('#truck-id').val();
        $('#lightgallery>div>a').each(function () {

            // var url = $(this).prop('href');
            var url = $(this).prop('href');
            var str = $(this).data('downloadname');
            var name = str.replace(/[^A-Za-z0-9]/g, '');

            var newElement = $("<a href='" + url + "'  download='" + name + "'>test</a>");
            $(newElement)[0].click();
        });

        logSuccessActivity('Download Pictures without Banner', truckID, 'tblDeals');        
    }

}

function uploadBannerImageAndDownload(index, bannerImagesCache, bannerImageCount, truckId) {

    var element = document.getElementById('bannerImage' + index);
    var id = $('#bannerImage' + index).data('id');
    var primary = parseInt($('#bannerImage' + index).data('primary'));

    html2canvas(element).then(function (canvas) {
        var imgdata = canvas.toDataURL('image/jpeg');
        bannerImagesCache.push({ imgdata: imgdata, ID: id, Primary: primary });
        if (index + 1 < bannerImageCount) {

            uploadBannerImageAndDownload(index + 1, bannerImagesCache, bannerImageCount, truckId);

        } else {

            $.ajax({
                url: base_url + "Deals/AddBannerPrimaryAndSliderImage",
                method: "POST",
                data: { 'TruckID': truckId, 'images': bannerImagesCache },

                success: function (res) {
                    var result = JSON.parse(res);
                    var pictures = result.pictures;
                    if (result.success) {

                        for (picture of pictures) {
                            var url = picture.bannerUrl;
                            var str = picture.DownloadName;
                            var name = str.replace(/[^A-Za-z0-9]/g, '');
                            var newElement = $("<a href='" + url + "' download='" + name + "'>test</a>");
                            $(newElement)[0].click();
                        }

                        logSuccessActivity('Download Pictures with Banner', truckId, 'tblDeals');
                        
                    } else {
                        logErrorActivity('Download Pictures with Banner', truckId, 'tblDeals', 'Error happens while downloading');                        
                        toastr.error('Download Pictures with Banner Error');
                    }

                    hiddenSpinner();
                }
            });

        }
    });

}


//////////////////////////////////////////////
//////////////////////////////////////////////

// in main slider panel
function getSliderImageElements(pictures) {

    var newItem = '';
    var height, width, url, bannerUrl, downloadName;
    if (Array.isArray(pictures)) {
        for (data of pictures) {

            url = data.url;
            bannerUrl = data.bannerUrl;
            downloadName = data.DownloadName;
            newItem += '<div class="image-wrapper-box"  style="background-image: url(\'' + url + '\')"   >';
            newItem += '<a class="light-link" href="' + url + '" data-bannerlink="' + bannerUrl + '" data-downloadname="' + downloadName + '" >';
            newItem += '<img class="image-wrapper-box-image" src="' + url + '" alt="">';
            newItem += '</a>';
            newItem += '</div>';
        }
    }

    return newItem;

}

// in slider edit modal
function getSliderEditImageElements(pictures) {
    var picElements = '';
    var height, width, url;
    for (data of pictures) {

        url = data.url;
        bannerUrl = data.bannerUrl;

        if (data.Primary) {
            picElements += '<div class="slider-picture-control-item" style="background-image: url(\'' + url + '\')" data-id="' + data.ID + '">';
            picElements += '<img id="primaryImageControlSlider" class="slider-picture-control-item-image"  src="' + url + '" >';
            picElements += '<div class="primary-upload-box" id="primary_image_box" data-id="' + data.ID + '" onclick="onEditPrimaryImage()"><i class="fa fa-cloud-upload"></i></div>';
            picElements += '</div>';
        } else {
            picElements += '<div class="slider-picture-control-item" style="background-image: url(\'' + url + '\')" data-id="' + data.ID + '" onclick="setBorder(this)">';
            picElements += '<img  class="slider-picture-control-item-image"  src="' + url + '" >';
            picElements += '<div class="picture-item-check-box"><i class="fa  fa-check"></i></div>';
            picElements += '</div>';
        }

    }
    return picElements;
}


///////////////////////////////////////////////////////////

function getBannerImageElement(pictures) {
    var regularWidth = 800;
    var regularHeight = 600;
    var contentItem = '';
    var width, height, url;
    var i = 0;
    for (data of pictures) {

        var bannerImage = 'auction-banner-footer.png';
        if (data.DealType == 'Auction') {
            bannerImage = 'auction-banner-footer.png';
        } else if (data.DealType == 'Supplier') {
            bannerImage = 'supplier-banner-footer.png';
        } else if (data.DealType == 'Consignment') {
            bannerImage = 'consignment-banner-footer.png';
        } else if (data.DealType == 'Inventory') {
            bannerImage = 'inventory-banner-footer.png';
        }

        height = regularHeight;
        width = parseInt(data.Width * height / data.Height);
        url = data.url;

        contentItem += '<div class="banner-image-container" id="bannerImage' + i + '"  style="width: ' + regularWidth + 'px; height:' + regularHeight + 'px; background-image: url(\'' + url + '\')" data-primary="' + data.Primary + '" data-id="' + data.ID + '">';
        contentItem += '<img style="width:' + width + 'px; height: ' + height + 'px;  position:absolute; top:0; left: 50%; margin-left:' + (-1 * width / 2) + 'px;"  src="' + url + '">';
        contentItem += '<img class="banner-image-banner1" src="' + base_url + 'assets/images/ribbon/' + bannerImage + '">';
        contentItem += '<img class="banner-image-banner2" src="' + base_url + 'assets/images/ribbon/com_mark.png">';
        contentItem += '</div>';

        i += 1;
    }

    return contentItem;
}


/////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////

// TV mode setting 

// var TvModeData = [];


// $('#tVmodebtn').click(function () {
//     showSpinner();

//     $.ajax({
//         url: base_url + 'Deals/getWatchListDataForTVmode',
//         type: 'POST',
//         data: {},
//         success: function (result) {

//             hiddenSpinner();

//             TvModeData = result;

//             if (TvModeData.length > 0) {

//                 var contentItem = '';
//                 contentItem += '<ul  class="slides">';
//                 for (data of TvModeData) {
//                     contentItem += '<li>';
//                     contentItem += '<img class="main-tv-mode-image" src="' + base_url + 'assets/images/primaryImages/' + data.PrimaryImage + '" />';
//                     var footerImage = '';
//                     if (data.DealType == 'Auction') {
//                         footerImage = 'auction-banner-footer.png';
//                     } else if (data.DealType == 'Supplier') {
//                         footerImage = 'supplier-banner-footer.png';
//                     } else if (data.DealType == 'Consignment') {
//                         footerImage = 'consignment-banner-footer.png';
//                     } else if (data.DealType == 'Inventory') {
//                         footerImage = 'inventory-banner-footer.png';
//                     }
//                     contentItem += '<img class="flex-caption" src="' + base_url + 'assets/images/ribbon/' + footerImage + '" />';
//                     contentItem += '</li>';
//                 }
//                 contentItem += '</ul>';

//                 // initialize of flexslider
//                 $('#flexslider').before(' <div id = "flexslider_temp" class="flexslider" ></div > ');
//                 $('#flexslider_temp').html(contentItem);               

//                 $('#flexslider_temp').flexslider({
//                     animation: "slide",
//                     before: function(slider){
//                         console.log(slider);
//                     }

//                 });
//                 $('#flexslider_temp').attr('id','flexslider');

//                 // open flexslider
//                 $('#TVPanel').css('left', 0);

//             } else {
//                 toastr.warning('There is no watch list data');
//             }

//         }

//     });

// });

// $('#back-button').click(function () {
//     $('#TVPanel').css('left', '100%');
// });

function printAsImage() {
    var filename = new Date().getTime();
    filename = $('#CatalogName').val() + '-';
    PrintEachPageAsImage(0, filename)
}

    
function PrintEachPageAsImage(index, filename) {

    showSpinner();

    var element = document.getElementById('pdfPage' + index);
    var options = {
        backgroundColor: '#ffffff',
        scale: 5
    };

    html2canvas(element, options).then(function (canvas) {

        var imgdata = canvas.toDataURL('image/jpeg');

        var link = document.createElement("a");
        
        link.setAttribute("href", imgdata);
        link.setAttribute("download", filename + index + ".jpg");
        link.click();

        if (index + 1< totalPdfPage) {
            PrintEachPageAsImage(index + 1, filename);
        }
        else {
            hiddenSpinner();
            logSuccessActivity('Download Image Catalog', 0, "");
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
            Webpage : 'Deals.WatchList',
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
            Webpage : 'Deals.WatchList',
            Status : 'Error',
            Error : ErrorMsg
        },
        success : function () {
            websocket.send(JSON.stringify({ 'msg': 'activity', 'poster': $('#usernameInput').val() }));
        }
    });
}