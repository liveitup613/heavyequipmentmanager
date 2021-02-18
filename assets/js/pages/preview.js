var Glo_RecordSelectedList = [0];

function showSpinner() {
    $('.loading-box').css('display', 'flex');
}

function hiddenSpinner() {
    $('.loading-box').css('display', 'none');
}

function convertDate(date) {
    var dateList = date.split("-");
    return dateList[2] + "/" + dateList[1] + "/" + dateList[0];
}

function logSuccessActivity(Activity, ID, Table) {
    $.ajax({
        url : base_url + 'Activity/addActivity',
        type : 'post',
        data : {
            Activity : Activity,
            ObjectiveTable : Table,
            ObjectiveID : ID,
            Webpage : 'Publish.Preview',
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
            Webpage : 'Publish.Preview',
            Status : 'Error',
            Error : ErrorMsg
        },
        success : function() {
            websocket.send(JSON.stringify({ 'msg': 'activity', 'poster': $('#usernameInput').val() }));
        }
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

                if (result.length == 1) {
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

                                var contentItem = '';

                                contentItem += '<div class="pdfPage" id="pdfPage">';
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


                                contentItem += '<div class="pageCell">';

                                // image section cell

                                var $banner1Url = base_url + "assets/images/ribbon/com_mark.png";
                                var $banner2url = base_url + "assets/images/ribbon/auction-banner-footer.png";
                                if (full.DealType == 'For Sale') {
                                    $banner2url = base_url + "assets/images/ribbon/For Sale-banner-footer.png";
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

                                } else if (full.DealType == 'For Sale') {

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

                                contentItem += '</div>';
                                contentItem += '</div>';

                                $('.table-pdf').html(contentItem);
                                hiddenSpinner();
                            }
                    });
                }
            }
        }
    );
}

function PrintAsImage(filename) {

    showSpinner();

    var element = document.getElementById('pdfPage');
    var options = {
        backgroundColor: '#ffffff',
        scale: 5
    };

    html2canvas(element, options).then(function (canvas) {

        var imgdata = canvas.toDataURL('image/jpeg');

        $.ajax({
            url : base_url + 'Publish/updateOgImage',
            type : 'post',
            data : {
                PostID : PostID,
                imgdata : imgdata,
            },
            success : function(res) {
            }
        });

        var link = document.createElement("a");

        link.setAttribute("href", imgdata);
        // link.setAttribute("download", filename + ".jpg");
        // link.click();

        hiddenSpinner();

        // if (index + 1< totalPdfPage) {
        //     PrintEachPageAsImage(index + 1, filename);
        // }
        // else {
        //     logSuccessActivity('Download Image Catalog', 0, '');
        // }
    });
}