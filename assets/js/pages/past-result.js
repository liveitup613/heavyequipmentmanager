

var managementTB;
var modalTB;

var totalPdfPage = 0;
var totalPdfImageData = [];

var Glo_Category = "All Equipments";


var Glo_RecordSelectedList = [0];

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

            var unpublishButton = "";
            var btnDelete = "";
            
            if (full.MaquinariaJRLink != '') {
                unpublishButton = '<button  class="col-lg-4 btn btn-sm btn-default btn-action"  data-toggle="tooltip" data-placement="top" title="' + getLocalizationWord('Remove From Maquinaria JR') + '"  onclick="unpublish(' + full.ID + ', \'MaquinariaJR\')"><i class="icon-share-alt"></i></button>';
            }

            if (full.FinalPrice == 0)
            {
                if ((full.USERNAME == $('#usernameInput').val() || $('#permission').val() == 'admin') && full.DealStatus == '')
                    btnDelete = '<button  class="col-lg-4 btn btn-sm btn-default btn-action"  data-toggle="tooltip" data-placement="top" title="' + getLocalizationWord('Delete') + '"  onclick="onDelete(' + full.ID + ')"><i class="icon-trash"></i></button>';
            }

            var infoButton = '<button  class="col-lg-4 btn btn-sm btn-default btn-action"  data-toggle="tooltip" data-placement="top" title="' + getLocalizationWord('Info') + '" onclick="onDetailInfo(' + full.ID + ')"><i class="icon-info"></i></button>';
            var linkButton = '<button  class="col-lg-4 btn btn-sm btn-default btn-action"  data-toggle="tooltip" data-placement="top" title="' + getLocalizationWord('Link') + '" onclick="gotoLink(\'' + full.Link + '\')"><i class="icon-link"></i></button>';
            var editButton = '<button  class="col-lg-4 btn btn-sm btn-default btn-action"  data-toggle="tooltip" data-placement="top" title="' + getLocalizationWord('Edit') + '" onclick="onEditInfo(' + full.ID + ')"  ' + action + '><i class="icon-note"></i></button>';            
            var editEndDateButton = '<button  class="col-lg-4 btn btn-sm btn-default btn-action"  data-toggle="tooltip" data-placement="top" title="' + getLocalizationWord('Edit End Date') + '" onclick="onEditEndDateInfo(' + full.ID + ')"  ' + action + '><i class="icon-settings"></i></button>';            
                
            return '<div class="row" style = "width : 125px; padding-left : 5px;">' +
                infoButton + linkButton + editButton + editEndDateButton + btnDelete + unpublishButton + 
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

            var model = '';

            if (full.EqModel)
                model = full.EqModel + '<br>';

            return full.DealID + '<br>' + EqCategory + year + make + model;  
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

            var price = getLocalizationWord('Price') + ': ' + numberWithCommas(full.Price) + '<br>';

            var total = getLocalizationWord('Total') + ': ' + numberWithCommas(full.Total) + '<br>';

            var finalPrice = getLocalizationWord('Final Price') + ': ' + numberWithCommas(full.FinalPrice) + '<br>';

            var different = getLocalizationWord('Difference') + ': '+numberWithCommas(parseFloat(full.Price) - parseFloat(full.FinalPrice)) ;

            return price + total + finalPrice + different;
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
                maquinariaJR = '<button  class="btn btn-sm btn-default"  style="padding:4px 7px;" data-toggle="tooltip" data-placement="top" title="LINK TO MAQUINARIA JR" onclick="gotoLink(\'' + full.MaquinariaJRLink + '\')"><img class="publish-icon" src="assets/images/publish_icon/maquinaria_active_icon.png"></button>';
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

    $('.loading-box').css('width', $(window).width());
    $('.loading-box').css('height', $(window).height());

    $('.socket-loading-box').css('width', $(window).width());
    $('.socket-loading-box').css('height', $(window).height());



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
        exportTableToExcel('AuctionResultData');
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
        
       if (msg == 'save_contact') {
            toastr.warning('New Opportunity Added');
        }
        else if (msg == 'edit_final_price') {
            managementTB.ajax.reload(null, false);
        }
    }

    

    $('#maxAucYearInput').datepicker('setEndDate', new Date);   
    $('#minAucYearInput').datepicker('setEndDate', new Date);
    $('#maxAucYearInput').datepicker({
        setDate: new Date()
    }).on('changeDate', function (selected) {
        
        var endDate = new Date(selected.date.valueOf());
        var startDate = new Date($('#minAucYearInput').val());
        if (startDate.getTime() > endDate.getTime()) {

            $('#minAucYearInput').datepicker('setDate', endDate);
        }
        $('#minAucYearInput').datepicker('setEndDate', endDate);
    });

    updateEquipmentCategory();

});

function renderTB() {

    managementTB = $('#auction-management-table').DataTable({
        'processing': true,
        'serverSide': true,
        'ajax': {
            url: base_url + 'AuctionResults/getPastAuctionData',
            type: 'POST',
            data: function (d) {
                d.minYear = $('#minYearInput').val();
                d.maxYear = $('#maxYearInput').val();
                d.minAucYear = $('#minAucYearInput').val();
                d.maxAucYear = $('#maxAucYearInput').val();
                d.minTotal = $('#minTotalInput').val();
                d.maxTotal = $('#maxTotalInput').val();
                d.minFinal = $('#minFinalInput').val();
                d.maxFinal = $('#maxFinalInput').val();
                d.minLiftCapacity = $('#minLiftCapacity').val();
                d.maxLiftCapacity = $('#maxLiftCapacity').val();
                d.searchText = getTranslatedWordForSearch($('#searchInput').val());
                d.categoryName = Glo_Category;
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
        'order': [[5, 'desc']],
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

            $('#selected-label-total').html(setting._iRecordsDisplay);
            var average = setting.json.average;
            var median =  setting.json.median;
            if (average != 'No Data')
                average = Number(average).toFixed(0) + ' USD';
            if (median != 'No Data')
                median = Number(median).toFixed(0) + ' USD';

             $('#selected-label-average').html(average);
             $('#selected-label-median').html(median);    

             $('#allCheck').prop('checked', false);
        },

    });
}

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
                                    contentItem += '<div class="header-title">RESULTADOS DE SUBASTA</div>';
                                    contentItem += '</div>';
                                    contentItem += '<div class="pdfPage-content">';

                                    if (i == 0) {   // first page

                                        contentItem += '<div class="pageCell">';

                                        // image section cell

                                        var $banner1Url = base_url + "assets/images/ribbon/com_mark.png";
                                        var $banner2url = base_url + "assets/images/ribbon/auction-banner-footer.png";

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
                                            contentItem += "<div class='pdf-total-price'>USD $" + numberWithCommas(full.FinalPrice) + "</div>";                                            
                                            contentItem += "</div>";

                                            contentItem += '<div class="sold-mark">';
                                            contentItem += '<div class="mark-english">SOLD</div>';
                                            contentItem += '<div class="mark-spanish">VENDIDO</div>';
                                            contentItem += '</div>'

                                            contentItem += "<div style='display:flex; justify-content:flex-start; margin-top: 16px;'>";

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
                        contentItem += '<div class="header-title">RESULTADOS DE SUBASTA</div>';
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
                                contentItem += "<div class='pdf-total-price'>USD $" + numberWithCommas(full.FinalPrice) + "</div>";                                
                                contentItem += "</div>";                                

                                contentItem += '<div class="sold-mark">';
                                contentItem += '<div class="mark-english">SOLD</div>';
                                contentItem += '<div class="mark-spanish">VENDIDO</div>';
                                contentItem += '</div>'

                                contentItem += "<div style='display:flex; justify-content:flex-start; margin-top: 16px;'>";

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

                            } 


                            ///////////// special fields //////////////////////////////////////////////
                            contentItem += get_detail_data_for_pdf(full);

                            contentItem += '</div>';
                            contentItem += '</div>';
                            contentItem += '</div>';
                            contentItem += '</div>';

                        }
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

function printAsPdf() {

    var options = {
        backgroundColor: '#ffffff',
        scale: 5
    };

    totalPdfImageData = [];
    PrintPdfEngine(0, options);
    
    // var element = $('.table-pdf').html();
    // console.log(element);
    // const form = document.createElement('form');
    // form.method = 'POST';
    // form.action = base_url + 'Deals/convertPDF';
    // form.target = 'blank';

    // const hiddenField = document.createElement('input');
    // hiddenField.type = 'hidden';
    // hiddenField.name = 'html';
    // hiddenField.value = element;

    // form.appendChild(hiddenField);
  

    // document.body.appendChild(form);
    // form.submit();
    
    // // $.ajax({
    // //     url : base_url + 'Deals/convertPDF',
    // //     method : 'POST',
    // //     data : {
    // //         html : element
    // //     },
    // //     success : function () {

    // //     }
    // // })
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
                    logSuccessActivity('Download PDF Catalog', 0, "");
                    hiddenSpinner();
                }

            }
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

function updateEquipmentCategory() {
    $.ajax({
        url : base_url + 'AuctionResults/getEquipmentCategory',
        type : 'post',
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
    });
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

//////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////

function onEditEndDateInfo(ID) {    
    $('#inputEditDate').val('');
    $('#inputEditDate').datepicker('setStartDate', new Date);
    
    $('#edit-item-id').val(ID);
    $('#EditEndDateModal').modal('show'); 
}

$('#btnEndDateSave').click(function() {
    showSpinner();

    var ID = $('#edit-item-id').val();
    $.ajax({
        url : base_url + 'Deals/updateEndDate',
        type : 'post',
        data : {
            ID : ID,
            EndDate : $('#inputEditDate').val()
        },
        success: function(res) {
            hiddenSpinner();
            var data = JSON.parse(res);            
            $('#EditEndDateModal').modal('hide');  
            
            if (data.success == false) {
                toastr.error(LocalizationMessage('Edit End Date') + ' Error');
                logErrorActivity('Edit End Date', ID, 'tblDeals', data.message);
                return;
            }
            toastr.success(LocalizationMessage('Edit End Date'));
            logSuccessActivity('Edit End Date', ID, 'tblDeals');
            managementTB.ajax.reload(null, false);  
        }
    });
});


function onDetailInfo(id) {
    showSpinner();

    $.ajax({
        url: base_url + 'AuctionResults/getTruckById',
        type: 'POST',
        data: {
            'id': id
        },
        success: function (data) {
            hiddenSpinner();
            result = JSON.parse(data);
            $('#detailModal').modal('show');
            var $imgUrl = base_url + "assets/images/thumbImages/" + result.PrimaryImage;

            var title = getTitleFromDatabase(result);            
            var captainStr = '<img src="' + $imgUrl + '" style="width: auto; height: auto;  max-width : 250px; max-height : 190px; ">';
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
                item += "<span class='item-info-index'>" + getLocalizationWord('Final Price') + ":&nbsp; </span> <span class='item-info-content'>" + numberWithCommas(result.FinalPrice) + '</span><br>';
                item += "<span class='item-info-index'>" + getLocalizationWord('Added By') + ":&nbsp; </span> <span class='item-info-content'>" + result.USERNAME + '</span><br>';
                item += "<span class='item-info-index'>" + getLocalizationWord('Added Date') + ":&nbsp; </span> <span class='item-info-content'>" + result.DateAdded + '</span><br>';
                item += "<span class='item-info-index'>" + getLocalizationWord('Additional Info') + ":&nbsp; </span><br><textarea class='item-info-content' disabled>" + result.Note + '</textarea><br>';

            $('.detail-info-box').html(item);

            $('#allCheck').prop('checked', false);

        }
    });
}

function onEditInfo(id) {

    showSpinner();

    $.ajax({
        url: base_url + 'AuctionResults/getTruckById',
        type: 'POST',
        data: {
            id: id
        },
        success: function (data) {
            hiddenSpinner();
            
            result = JSON.parse(data);

            $('#editModal').modal('show');
            $('#edit-item-id').val(id);


            var $imgUrl = base_url + "assets/images/thumbImages/" + result.PrimaryImage;
            var captainStr = '<img    src="' + $imgUrl + '" style="width: auto; height: auto;  cursor: pointer; max-width : 250px; max-height : 270px;">';
            $('.edit-photo').html(captainStr);

            var item = '';


            var item = "<div class='item-edit-item-box'><span class='item-edit-index'>" + getLocalizationWord('Final Price') + ":&nbsp; </span> <input class='item-edit-content' type='number' id='item-finalPrice'  value='" + result.FinalPrice + "'></div>";

            $('.edit-info-box').html(item);

            $('#item-buy-premium').inputFilter(function (value) {
                return /^-?\d*[.]?\d*$/.test(value);
            });
        }
    });
}

function onDelete(id) {
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
                toastr.success(LocalizationMessage('Delete Deal'));
                setIdToSelectedList(false, id);
                setSelectedCount();
                managementTB.ajax.reload(null, false);  
                websocket.send(JSON.stringify({ 'msg': 'delete_truck', 'poster': $('#usernameInput').val() }));

                logSuccessActivity('Delete Deal',  id, 'tblDeals');                

            } else {
                toastr.error(LocalizationMessage('Delete Deal') + ' Error');
                logErrorActivity('Delete Deal', id, 'tblDeals', result.message);
            }
            $('#deleteModal').modal('hide');
        }
    });
}


/////////////////////////////////////////////////////////////////
//////////////////  export excel file ///////////////////////////


function exportTableToExcel( filename = '') {

    showSpinner();

    $.ajax({
        url: base_url + 'AuctionResults/getAuctionResultDataForExcel',
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
            minFinal : $('#minFinalInput').val(),
            maxFinal : $('#maxFinalInput').val(),
            searchText: $('#searchInput').val(),
            categoryName: Glo_Category           
        },
        success: function (result) {

            hiddenSpinner();
         

            var downloadLink;
            var csv = [];

            for (var i = 0; i < result.length; i++) {
                var row = [];

                var cols = result[i];

                for (var j = 0; j < cols.length; j++) {
                    if (cols[j] != null)
                        row.push('"'+cols[j].trim() + '"');
                    else
                        row.push('"'+cols[j] + '"')
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



//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////


function saveDetailInfo() {
    showSpinner();

    var ID = $('#edit-item-id').val();

    $.ajax({
        url: base_url + 'AuctionResults/updateFianlPrice',
        type: 'POST',
        data: {
            ID: ID,
            FinalPrice: $('#item-finalPrice').val()
        },
        success: function (data) {
            var result = JSON.parse(data);
            if (result.success == true) {
                toastr.success('Edit Final Price');
                logSuccessActivity('Edit Final Price', ID, 'tblDeals');
                websocket.send(JSON.stringify({ 'msg': 'edit_final_price', 'poster': $('#usernameInput').val() }));
                managementTB.ajax.reload(null, false);  

            } else {
                logErrorActivity('Edit Final Price Error', ID, 'tblDeals', 'Unkown ID');
                toastr.error('Edit Final Price Error');
            }
            $('#editModal').modal('hide');
           hiddenSpinner();
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


///////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////

function unpublish(deal_id, site) {
    showSpinner();

    if (site == 'MaquinariaJR') {
        $.ajax({
            url : base_url + 'Deals/unPublishDealtoMachinary',
            type : 'post',
            data : {
                id : deal_id
            },
            success : function(res) {
                var result = JSON.parse(res);
                hiddenSpinner();
                
                if (result.success == false) {
                    toastr.error(LocalizationMessage("Unpublish Deal from MaquinariaJR") + " Error");
                    logErrorActivity('Unpublish Deal from MaquinariaJR', deal_id, 'tblDeals', result.message);
                } 
                else if (result.success = true) {
                    toastr.success(LocalizationMessage('Unpublish Deal from MaquinariaJR'));
                    logSuccessActivity('Unpublish Deal from MaquinariaJR', deal_id, 'tblDeals');
                    managementTB.ajax.reload(null, false);  
                }  
            }
        });
    }
    else 
        hiddenSpinner();
}

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
            logSuccessActivity('Download Image Catalog', 0, '');
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
            Webpage : 'Deals.AuctionResults',
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
            Webpage : 'Deals.AuctionResults',
            Status : 'Error',
            Error : ErrorMsg
        },
        success : function() {
            websocket.send(JSON.stringify({ 'msg': 'activity', 'poster': $('#usernameInput').val() }));
        }
    });
}
