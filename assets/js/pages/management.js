
var managementTB;
var modalTB;
var postingStatsTB;

var totalPdfPage = 0;
var totalPdfImageData = [];

var Glo_Category = "All Equipments";
var Glo_DealType = "All Deals";

var Glo_RecordSelectedList = [0];

var id_selected_for_publish = 0;
var site_name = '';

var OgLink = '';
var OgImage = '';
var ShareDealID = 0;
var PostID = 0;
var Glo_DealID = 0;
var FirstLoad = 0;
var IsSamePost = 0;
var ShareSubject = '';

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

            // var watchButton;
            // if (full.watch == 0) {
            //     watchButton = '<button  class="col-lg-4 btn btn-sm btn-default btn-action"  data-toggle="tooltip" data-placement="top" title="' + getLocalizationWord('Add to Watch List') + '" onclick="onAddWatchList(' + full.ID + ', this)"><i class="icon-star"></i></button>';
            // } else {
            //     watchButton = '';
            // }

            // var tvButton;
            // if (full.TvMode == 'no') {
            //     tvButton = '<button  class="col-lg-4 btn btn-sm btn-default btn-action"  data-toggle="tooltip" data-placement="top" data-tvmode="no" title="' + getLocalizationWord('Add to TV Mode') + '" onclick="onSetTVMode(' + full.ID + ', this)"><i class="icon-screen-desktop"></i></button>';
            // } else {
            //     tvButton = '<button  class="btn btn-sm btn-default btn-action"  data-toggle="tooltip" data-placement="top"  data-tvmode="yes"  title="' + getLocalizationWord('Remove from TV Mode') + '" onclick="onSetTVMode(' + full.ID + ', this)"><i class="icon-share-alt"></i></button>';
            // }

            var publishButton;            
            publishButton = '<button  class="col-lg-4 btn btn-sm btn-default btn-action"  data-toggle="tooltip" data-placement="top" title="' + getLocalizationWord('Publish') + '"  onclick="onPublishModal(' + full.ID + ', \'' + full.EqCategory + '\')"><i class="icon-cloud-upload"></i></button>';
            

            var closeButton = '';
            var endDate = full.EndDate;
            //var today = new Date().toLocaleString("en-US", {timeZone: "America/Phoenix"});
            //today = new Date(today);
            var today = new Date();

            var todayStr = formatDate(today);

            if (todayStr == endDate)
                closeButton = '<button type="button" class="col-lg-4 btn btn-sm btn-default btn-action" data-toggle="tooltip" data-placement="top" title="' + getLocalizationWord('Close Auction') + '" onclick="onCloseAuction(' + full.ID + ')"  ' + action + '><i class="icon-close"></i></button>';
            
            var deleteButton = '';
            if (($('#permission').val() == 'admin' || $('#usernameInput').val() == full.USERNAME || $('#usernameInput').val() == 'Alvaro') && full.DealStatus == '')
                deleteButton = '<button  class="col-lg-4 btn btn-sm btn-default btn-action"  data-toggle="tooltip" data-placement="top" title="' + getLocalizationWord('Delete') + '"  onclick="onDeleteModal(' + full.ID + ')"  ' + action + '><i class="icon-trash"></i></button>';

            var infoButton = '<button  class="col-lg-4 btn btn-sm btn-default btn-action"  data-toggle="tooltip" data-placement="top" title="' + getLocalizationWord('Info') + '" onclick="onDetailInfo(' + full.ID + ')"><i class="icon-info"></i></button>';
            var linkButton = '<button  class="col-lg-4 btn btn-sm btn-default btn-action"  data-toggle="tooltip" data-placement="top" style="padding: 4px 0px;" title="' + getLocalizationWord('Post Statistics') + '"  onclick="onPostingStatsModal(' + full.ID + ')"><img src="' + base_url + 'assets/images/publish_icon/publishing_icon.png" style="width: 20px;"></button>';
            var mediaButton = '<button  class="col-lg-4 btn btn-sm btn-default btn-action"  data-toggle="tooltip" data-placement="top" title="' + getLocalizationWord('Media') + '" onclick="onMediaView(' + full.ID + ')"><i class="fa fa-picture-o"></i></button>';
            var editButton = '<button  class="col-lg-4 btn btn-sm btn-default btn-action"  data-toggle="tooltip" data-placement="top" title="' + getLocalizationWord('Edit') + '" onclick="onEditInfo(' + full.ID + ')"  ' + action + '><i class="icon-note"></i></button>';            
            var dealBan = '<button  class="col-lg-4 btn btn-sm btn-default btn-action"  data-toggle="tooltip" data-placement="top" title="' + getLocalizationWord('Alert Broken Link') + '" onclick="onMarkDeal(' + full.ID + ')"><i class="icon-check"></i></button>';            
            var procurement = '';
            
            // if ($('#permission').val() == 'admin' || $('#accounting').val() == 'ON')
            //     procurement = '<button  class="col-lg-4 btn btn-sm btn-default btn-action"  data-toggle="tooltip" data-placement="top" title="' + getLocalizationWord('Buy') + '" onclick="onProcurement(' + full.ID + ')"><i class="icon-basket"></i></button>';            
            
            // if (full.DealStatus == 'PendingProcurement' || full.DealType == 'Inventory')
            //     procurement = '';

            if (full.MarkForExit == 'YES')
                dealBan = '<button  class="col-lg-4 btn btn-sm btn-default btn-action"  data-toggle="tooltip" data-placement="top" title="' + getLocalizationWord('Remove Alert') + '" onclick="onUnmarkDeal(' + full.ID + ')"><i class="icon-ban"></i></button>';            

            return '<div class="row" style = "width : 125px; padding-left : 5px;">' +
                infoButton + linkButton + mediaButton + editButton + deleteButton + publishButton + closeButton + dealBan + procurement + 
            '</div>';
        }

    },
    {
        "title": getLocalizationWord("Photo"),
        sortable: false,
        "render": function (data, type, full, meta) {
            $imgUrl = base_url + "assets/images/thumbImages/" + full.PrimaryImage;
            var photoElement = '<div class="photo-cell" onclick="gotoLink(\'' + full.Link + '\')" style="background-image: url(\'' + $imgUrl + '\')">' +
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
            addedDay.setDate(addedDay.getDate() + (ActiveDealTime - 2));

            var addDateTime = full.DateAdded.split(' ');
            var addDate = addDateTime[0];

            if (addedDay.getTime() < today.getTime() && (full.DealType == 'Consignment' || full.DealType == 'For Sale')) {
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
            var publishButtons = '';
            var Platforms = full.PostedPlatforms;
            if(Platforms.length) {
                var i;
                var first = 0;
                for(i = 0; i < Platforms.length; i++) {
                    var Platform = Platforms[i]['Platform'];
                    if(Platform != 'Facebook' && Platform != 'WhatsApp' && Platform != 'Gmail') {
                        if(first == 0) {
                            publishButtons += '<button class="col-lg-4 btn btn-sm btn-default" style="padding:4px 0px; margin:0;" data-toggle="tooltip" data-placement="top" title="' + Platform + '"><img class="publish-icon" src="assets/images/publish_icon/General_circle_icon.png"></button>';
                            first = 1;
                        }
                    }else {
                        publishButtons += '<button class="col-lg-4 btn btn-sm btn-default" style="padding:4px 0px; margin:0;" data-toggle="tooltip" data-placement="top" title="' + Platform + '"><img class="publish-icon" src="assets/images/publish_icon/'+ Platform +'_icon.png"></button>';
                    }
                }

            }

            return '<div class="row" style = "width : 125px; padding-left : 5px;">' +
                    publishButtons +
                '</div>';
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
                                
                capacity = full.Capacity + ' ' + getLocalizationWord(unit) + '<br>';                
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

// posting db column data
var postingTBColumnData = [
    {
        "title": getLocalizationWord("PostDate"),
        sortable: true,
        "render": function (data, type, full, meta) {
            var postDate = full.Date;

            return postDate;
        }
    }, {
        "title": getLocalizationWord("PostedBy"),
        sortable: true,
        "render": function (data, type, full, meta) {
            var username = full.UserName;
            return username;
        }
    }, {
        "title": getLocalizationWord("Target"),
        sortable: true,
        "render": function (data, type, full, meta) {
            var target = full.Platform;

            return target;
        }
    }, {
        "title": getLocalizationWord("Views"),
        sortable: true,
        "render": function (data, type, full, meta) {
            var views = full.Redirects;
            return views;
        }
    },
    // {
    //     "title": getLocalizationWord("Likes"),
    //     sortable: true,
    //     "render": function (data, type, full, meta) {
    //
    //         var likes = full.Likes;
    //
    //         return likes;
    //     }
    // }, {
    //     "title": getLocalizationWord("Comments"),
    //     sortable: true,
    //     render: function (data, type, full, meta) {
    //         var comments = full.Comments;
    //
    //         return comments;
    //     }
    // }

];



// set up  truck management table
$(function () {

    if (OutDatedCount  > 0) {
        if (lang == 'english')
            toastr.warning("You have " + OutDatedCount + " deals that will be deleted in two days.");
        else if (lang == 'spanish')
            toastr.warning("Tienes " + OutDatedCount + " tratos que serán eliminados en dos días");
    }

    if (LessPhotoCount > 0) {
        if (lang == 'english')
            toastr.warning("You have " + LessPhotoCount + " deals that need more pictures");
        else if (lang == 'spanish')
            toastr.warning("Tienes " + LessPhotoCount + " tratos que necesitan más fotos");
    }

    if (SearchHelpCount > 0) {
        toastr.warning(SearchHelpCount + ' ' + LocalizationMessage('Opportunities Need Search Help'));
    }

    if (DealAlertCount > 0) {
        if (lang == 'english')
            toastr.warning('You have ' + DealAlertCount + ' Deals on Alert');
        else if (lang == 'spanish')
            toastr.warning('Tienes ' + DealAlertCount + ' Tratos en Alerta');
    }

    getActiveDealsStatus();
    getAuctionStatus();
    getTodayAddedDealStatus();
    getSearchHelpDealsStatus();

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
            managementTB.ajax.reload(null, false);  
            getActiveDealsStatus();
            getAuctionStatus();
            getTodayAddedDealStatus();

        } else if (msg == 'delete_truck') {

            managementTB.ajax.reload(null, false);  
            getActiveDealsStatus();
            getAuctionStatus();
            getTodayAddedDealStatus();

        } else if (msg == 'save_truck') {
            getActiveDealsStatus();
            getAuctionStatus();
            getTodayAddedDealStatus();

            managementTB.ajax.reload(null, false);  

        } else if (msg == 'unpublish_truck') {
            managementTB.ajax.reload(null, false);
        } else if (msg == 'publish_truck') {
            managementTB.ajax.reload(null, false);
        } else if (msg == 'save_contact') {
            toastr.warning(LocalizationMessage('New Opportunity Added'));
        } else if (msg == 'mark') {
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

    updateEquipmentCategory();
});

function renderTB() {

    managementTB = $('#auction-management-table').DataTable({
        'processing': true,
        'serverSide': true,
        // "bStateSave": true,
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
                d.searchText = getTranslatedWordForSearch($('#searchInput').val());
                console.log(d.searchText);                
                d.published = $('#inputPublished').val();
                d.marked = $('#inputMarked').val();
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
          //  $('[data-toggle="tooltip"]').tooltip({boundary: 'window'});
          

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

            if (aData.MarkForExit == 'YES') {
                $td = $('td', nRow);
                console.log($td);
                $td[3].style.backgroundColor =  '#dc3545';
                $td[3].style.color =  'white';
            }
                
        }

    });
}

function renderPostingStatsTB() {

    postingStatsTB = $('#postingStatsTable').DataTable({
        'processing': true,
        'serverSide': true,
        // "bStateSave": true,
        'ajax': {
            url: base_url + 'Publish/getPostingDataByDealID',
            type: 'POST',
            data: function (d) {
                d.DealID = Glo_DealID;
            }
        },
        "columns": postingTBColumnData,
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
        'order': [[0, 'desc']],
        'autoWidth': true,
        'drawCallback': function (setting) {
            var modalData = setting.json;
            var firstPostDate = modalData.firstPostDate;
            var truckData = modalData.truckData;
            var totalViews = modalData.totalViews;
            console.log('trucData======');
            console.log(truckData);
            $('#posting-modal-title').html(" - "+truckData.mkTitle+ " - "+truckData.DealID);
            $('#first-post-date').html(firstPostDate.MinDate);
            $('#number-of-posts').html(modalData.recordsTotal);
            $('#total-views').html(totalViews.TotalViews);
            // posting-modal-title
        },
        'fnRowCallback' :  function (nRow, aData, iDisplayInex, iDisplayIndexFull) {
        }
    });
}

////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////

function renderModalTB() {
    showSpinner();

    $('.table-pdf').html('');

    var userName = '';
    var userEmail = '';
    var userPhone = '';
    $.ajax({
        url: base_url + 'User/GetUserInfo',
        type: 'get',
        data: {
            ID: $('#userIDInput').val()
        },
        async: false,
        timeout: 3000,
        success: function(res) {
            var result = JSON.parse(res);
            if (result.success == false) {
                return;
            }

            var userData = result.user;
            userName = userData.NAME + ' ' + userData.LASTNAME;
            userEmail = userData.EMAIL;
            userPhone = userData.PHONE;
        }
    });

    if (userName == ' ' && userPhone == '' && userEmail == '') {
        toastr.error("Get User Data Error", 'HEM');
        $('#pdfModal').modal('hide');
        hiddenSpinner;
        return;
    }

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

                }
                else if (result.length == 1) {
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
                                    contentItem += '<div class="pdf-header-desc-box"><div class="header-arrow"></div><div class="desc"><p class="heading">OFERTAS DE COMPRA</p><p><strong>VENDEDOR:</strong> ' + userName + '</p><p><strong>Tel:</strong> ' + getStyledPhoneNumber(userPhone) + '</p><p><strong>Mail:</strong> ' + userEmail + '</p></div></div>';
                                    contentItem += '<div class="cross-bar"><img src="' + base_url + 'assets/images/icon/header-cross.png' + '"></div>'
                                    contentItem += '</div>';
                                    contentItem += '<div class="pdfPage-content">';

                                    if (i == 0) {   // first page

                                        contentItem += '<div class="pageCell">';
                                        contentItem += '<div class="pageCell-arrow"></div>';

                                        // image section cell

                                        var $imgUrl = base_url + "assets/images/primaryImages/" + full.PrimaryImage;
                                        var height = 224;
                                        var width = parseInt(full.pmW * height / full.pmH);

                                        contentItem += '<div id="share-image" class="imageCell">' +
                                            '<div class="modal-photo-cell" style="background-image: url(\'' + $imgUrl + '\')">' +
                                            '<img  src="' + $imgUrl + '" style="width: ' + width + 'px; height: ' + height + 'px; position:absolute; top:0; left: 50%; margin-left:' + (-1 * width / 2) + 'px;" >' +
                                            '</div>' +
                                            '</div>';

                                        // detail cell2 

                                        contentItem += '<div class="contentCell">';

                                        var title = getTitleFromDatabase(full);                                
                                        var city = full.City.trim();
                                        var state = full.State.trim();
                                        var country = full.Country.trim();
                                        var location = '';

                                        if (city != '')
                                            location = city + ', ';
                                        if (state != '')
                                            location += state + ', ';
                                        location += country;

                                        contentItem += "<h3 class='pdf-title'>" + title + "</h3>";
                                        contentItem += '<p class="pdf-location">' + location + '</p>';

                                        contentItem += '<div class="pdf-info-box">';

                                        if (full.DealType == 'Auction') {

                                            contentItem += '<div class="auction-info-box">';
                                            contentItem += '<div class="auction-arrow"></div><div class="auction-name"><img src="' + base_url + 'assets/images/icon/auction_icon.png">Subasta</div>';
                                            contentItem += '<div class="auction-date">' + full.EndDate + '</div>';
                                            contentItem += '<span class="auctioneer-title">Subastadora:</span><span class="auctioneer-value">' + full.Auctioneer + '</span>';
                                            contentItem += '</div>';

                                            if (Number(full.Price) != 0) {
                                                var price_unit = 'USD';
                                                var price = '$' + numberWithCommas(full.Total);
                                                
                                                contentItem += '<div class="pdf-price-box">';
                                                contentItem += '<div class="pdf-total-price"><span class="price-unit">' + price_unit + '</span><span class="price">' + price + '</span></div>';
                                                contentItem += '<div class="pdf-price-arrow"></div><div class="deal_buy_type">¡Con Puja Máxima!</div>';
                                                contentItem += '</div>';
                                                contentItem += '<span style="font-size: 7px;color: black;font-weight: bold; display: block; margin-top: 4px;">*Total aproximado incluyendo servicios</span><br>';
                                                contentItem += '<span style="font-size: 7px;color: black;font-weight: bold; display: block; margin-top: -20px;">*Precio no Incluye I.V.A.</span>';
                                            }

                                        } else if (full.DealType == 'For Sale') {
                                        
                                            var price_unit = 'USD';
                                            var price = '$' + numberWithCommas(full.Total);
                                            
                                            contentItem += '<div class="pdf-price-box">';
                                            contentItem += '<div class="pdf-total-price"><span class="price-unit">' + price_unit + '</span><span class="price">' + price + '</span></div>';
                                            contentItem += '<div class="pdf-price-arrow"></div><div class="deal_buy_type">$ Venta</div>';
                                            contentItem += '</div>';
                                            contentItem += '<span style="font-size: 7px;color: black;font-weight: bold; display: block; margin-top: 4px;">*Total aproximado incluyendo servicios</span><br>';
                                            contentItem += '<span style="font-size: 7px;color: black;font-weight: bold; display: block; margin-top: -20px;">*Precio no Incluye I.V.A.</span>';
                                            
                                            
                                        }

                                        contentItem += '</div>';
                                        contentItem += '<div class="pdf-description-box">';
                                        contentItem += '<div class="pdf-description-arrow"></div>';
                                        contentItem += '<div class="pdf-label5">Detalles</div>'
                                        contentItem += '<div class="pdf-description-content-box">';
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
                                            height = 224;
                                            width = parseInt(imageItem.Width * height / imageItem.Height);

                                            contentItem += '<div id="share-image" class="galleryCell">' +
                                                '<div class="modal-photo-cell" style="background-image: url(\'' + $imgUrl + '\')">' +
                                                '<img  src="' + $imgUrl + '" style="width: ' + width + 'px; height: ' + height + 'px; position:absolute; top:0; left: 50%; margin-left:' + (-1 * width / 2) + 'px;" >' +                                                
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
                                            height = 224;
                                            width = parseInt(imageItem.Width * height / imageItem.Height);

                                            contentItem += '<div id="share-image" class="galleryCell">' +
                                                '<div class="modal-photo-cell" style="background-image: url(\'' + $imgUrl + '\')">' +
                                                '<img  src="' + $imgUrl + '" style="width: ' + width + 'px; height: ' + height + 'px; position:absolute; top:0; left: 50%; margin-left:' + (-1 * width / 2) + 'px;" >' +                                                
                                                '</div>' +
                                                '</div>';
                                        }
                                        contentItem += '</div>';

                                    }
                                    contentItem += '</div>';
                                    contentItem += '<div class="pdfPage-footer">';
                                    contentItem += '<div class="left-desc"><p><strong>Machinery Hawkers |</strong> Blvd. Abelardo R. Rodriguez 2292 col. alamitos C.P.21210, Mexicali B.C. | (+52) 686 172 1838 | ventas@machineryhawkers.com</p><p><strong>https://www.facebook.com/machinery.hawkers</strong></p></div><div class="right-desc"><p><strong>Machiney Hawkers, dedicados a la comercialización de Maquinaria Pesada, construcción y agrícola, nuestro objetivo principal es ubicar la maquinaria que mas de adapte a sus necesidades en todo USA, Canadá y México</strong></p></div>';
                                    contentItem += '</div>';
                                    contentItem += '</div>';

                                }

                                $('.table-pdf').html(contentItem);
                                hiddenSpinner();

                            }
                        });


                }
                else {
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
                        contentItem += '<div class="pdf-header-desc-box"><div class="header-arrow"></div><div class="desc"><p class="heading">OFERTAS DE COMPRA</p><p><strong>VENDEDOR:</strong> ' + userName + '</p><p><strong>Tel:</strong> ' + getStyledPhoneNumber(userPhone) + '</p><p><strong>Mail:</strong> ' + userEmail + '</p></div></div>';
                        contentItem += '<div class="cross-bar"><img src="' + base_url + 'assets/images/icon/header-cross.png' + '"></div>'
                        contentItem += '</div>';
                        contentItem += '<div class="pdfPage-content">';

                        for (var k = 0; k < 3; k++) {

                            if (k + i * 3 >= result.length)
                                break;

                            var full = result[k + i * 3];

                            contentItem += '<div class="pageCell">';
                            contentItem += '<div class="pageCell-arrow"></div>';

                            // image section cell

                            var $imgUrl = base_url + "assets/images/primaryImages/" + full.PrimaryImage;
                            var height = 224;
                            var width = parseInt(full.pmW * height / full.pmH);

                            contentItem += '<div id="share-image" class="imageCell">' +
                                '<div class="modal-photo-cell" style="background-image: url(\'' + $imgUrl + '\')">' +
                                '<img  src="' + $imgUrl + '" style="width: ' + width + 'px; height: ' + height + 'px; position:absolute; top:0; left: 50%; margin-left:' + (-1 * width / 2) + 'px;" >' +
                                '</div>' +
                                '</div>';

                            // detail cell2 

                            contentItem += '<div class="contentCell">';

                            var title = getTitleFromDatabase(full);                                
                            var city = full.City.trim();
                            var state = full.State.trim();
                            var country = full.Country.trim();
                            var location = '';

                            if (city != '')
                                location = city + ', ';
                            if (state != '')
                                location += state + ', ';
                            location += country;

                            contentItem += "<h3 class='pdf-title'>" + title + "</h3>";
                            contentItem += '<p class="pdf-location">' + location + '</p>';

                            contentItem += '<div class="pdf-info-box">';

                            if (full.DealType == 'Auction') {

                                contentItem += '<div class="auction-info-box">';
                                contentItem += '<div class="auction-arrow"></div><div class="auction-name"><img src="' + base_url + 'assets/images/icon/auction_icon.png">Subasta</div>';
                                contentItem += '<div class="auction-date">' + full.EndDate + '</div>';
                                contentItem += '<span class="auctioneer-title">Subastadora:</span><span class="auctioneer-value">' + full.Auctioneer + '</span>';
                                contentItem += '</div>';

                                if (Number(full.Price) != 0) {
                                    var price_unit = 'USD';
                                    var price = '$' + numberWithCommas(full.Total);
                                    
                                    contentItem += '<div class="pdf-price-box">';
                                    contentItem += '<div class="pdf-total-price"><span class="price-unit">' + price_unit + '</span><span class="price">' + price + '</span></div>';
                                    contentItem += '<div class="pdf-price-arrow"></div><div class="deal_buy_type">¡Con Puja Máxima!</div>';
                                    contentItem += '</div>';
                                    contentItem += '<span style="font-size: 7px;color: black;font-weight: bold; display: block; margin-top: 4px;">*Total aproximado incluyendo servicios</span><br>';
                                    contentItem += '<span style="font-size: 7px;color: black;font-weight: bold; display: block; margin-top: -20px;">*Precio no Incluye I.V.A.</span>';
                                }

                            } else if (full.DealType == 'For Sale') {
                            
                                var price_unit = 'USD';
                                var price = '$' + numberWithCommas(full.Total);
                                
                                contentItem += '<div class="pdf-price-box">';
                                contentItem += '<div class="pdf-total-price"><span class="price-unit">' + price_unit + '</span><span class="price">' + price + '</span></div>';
                                contentItem += '<div class="pdf-price-arrow"></div><div class="deal_buy_type">$ Venta</div>';
                                contentItem += '</div>';
                                contentItem += '<span style="font-size: 7px;color: black;font-weight: bold; display: block; margin-top: 4px;">*Total aproximado incluyendo servicios</span><br>';
                                contentItem += '<span style="font-size: 7px;color: black;font-weight: bold; display: block; margin-top: -20px;">*Precio no Incluye I.V.A.</span>';
                                
                                
                            }

                            contentItem += '</div>';
                            contentItem += '<div class="pdf-description-box">';
                            contentItem += '<div class="pdf-description-arrow"></div>';
                            contentItem += '<div class="pdf-label5">Detalles</div>'
                            contentItem += '<div class="pdf-description-content-box">';
                            ///////////// special fields //////////////////////////////////////////////
                            contentItem += get_detail_data_for_pdf(full);

                            contentItem += '</div>';
                            contentItem += '</div>';
                            contentItem += '</div>';
                            contentItem += '</div>';

                        }
                        contentItem += '</div>';
                        contentItem += '<div class="pdfPage-footer">';
                        contentItem += '<div class="left-desc"><p><strong>Machinery Hawkers |</strong> Blvd. Abelardo R. Rodriguez 2292 col. alamitos C.P.21210, Mexicali B.C. | (+52) 686 172 1838 | ventas@machineryhawkers.com</p><p><strong>https://www.facebook.com/machinery.hawkers</strong></p></div><div class="right-desc"><p><strong>Machiney Hawkers, dedicados a la comercialización de Maquinaria Pesada, construcción y agrícola, nuestro objetivo principal es ubicar la maquinaria que mas de adapte a sus necesidades en todo USA, Canadá y México</strong></p></div>';
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


function exportTableToExcel( filename = '') {

    showSpinner();

    $.ajax({
        url: base_url + 'Deals/getDealDataForExcel',
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

            logSuccessActivity('Excel Extraction', 0, '');
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
        url : base_url + 'Deals/getEquipmentCategory',
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

        var eqCategory = rows[i].EqCategory;
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
    showSpinner();

    $.ajax({
        url: base_url + 'Deals/getTruckById',
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

            } else if (result.DealType == 'For Sale') {

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
                item += "<span class='item-info-index'>" + getLocalizationWord('Price') + ":&nbsp; </span> <span class='item-info-content'>" + numberWithCommas(result.Price) + '</span><br>';
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

///////////////////////////////////////////////////////
//////////////////////////////////////////////////////////

function onAddWatchList(id, element) {
    $.ajax({
        url: base_url + 'Deals/AddTruckToWatchlist',
        type: 'POST',
        data: {
            'ID': id
        },
        success: function (data) {
            var result = JSON.parse(data);
            if (result.success == true) {
                toastr.success(LocalizationMessage('Add Deal to Watchlist'));
                $(element).remove();

                logSuccessActivity('Add Deal to Watchlist', id, 'tblDeals');
            } else {
                toastr.error(LocalizationMessage('Add Deal to Watchlist') + ' Error');

                logErrorActivity('Add Deal to Watchlist', id, 'tblDeals', 'Add Deal to WatchList Error');
            }
        }
    });
}


function onSetTVMode(id, element){

    var currentTvMode = $(element).data('tvmode');
    var wantTvMode = 'no';
    if(currentTvMode == 'no'){
        wantTvMode = 'yes';
    }
    $.ajax({
        url: base_url + 'Deals/setTvMode',
        type: 'POST',
        data: {
            'ID': id,
            'TvMode': wantTvMode
        },
        success: function (data) {
            var result = JSON.parse(data);
            var toastMsg = wantTvMode == 'yes' ? LocalizationMessage('Add Deal to TVMode') : LocalizationMessage('Remove Deal from TV Mode');
            if (result.success == true) {                
                toastr.success(toastMsg);   

                logSuccessActivity(toastMsg, id, 'tblDeals');
                
                managementTB.ajax.reload();  
               
            } else {
                logErrorActivity(toastMsg, id, 'tblDeals', 'No Deal');
                
                toastr.error(toastMsg + ' Error');
            }
        }
    });
}

///////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////

function onEditInfo(id) {

    showSpinner();

    $.ajax({
        url: base_url + 'Deals/getTruckById',
        type: 'POST',
        data: {
            id: id
        },
        success: function (data) {
            hiddenSpinner();
            
            result = JSON.parse(data);

            $('#editModal').modal('show');
            $('#edit-item-id').val(id);
            $('#edit-item-dealType').val(result.DealType);

            var $imgUrl = base_url + "assets/images/thumbImages/" + result.PrimaryImage;
            var captainStr = '<img  id="primaryImageEditController" onclick="onClickPrimaryEditImage()" src="' + $imgUrl + '" style="width: auto; height: auto;  cursor: pointer; max-width : 250px; max-height : 190px;">';
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

            } else if (result.DealType == 'For Sale') {

                item += "<div class='item-edit-item-box'><span class='item-edit-index'>" + getLocalizationWord('Price') + "Price:&nbsp; </span> <input class='item-edit-content' type='number' id='item-price' name='Price'  onkeyup='calculateTotalValue(\"" + result.DealType + "\")'  value='" + result.Price + "'></div>";
                item += "<div class='item-edit-item-box'><span class='item-edit-index'>" + getLocalizationWord('Shipping') + ":&nbsp; </span> <input class='item-edit-content' type='number' id='item-shipping' name='Shipping' onkeyup='calculateTotalValue(\"" + result.DealType + "\")' value='" + result.Shipping + "'></div>";
                item += "<div class='item-edit-item-box'><span class='item-edit-index'>" + getLocalizationWord('Customs') + ":&nbsp; </span> <input class='item-edit-content' type='number' id='item-customs' name='Customs' onkeyup='calculateTotalValue(\"" + result.DealType + "\")' value='" + result.Customs + "'></div>";
                item += "<div class='item-edit-item-box'><span class='item-edit-index'>" + getLocalizationWord('Commission') + ":&nbsp; </span> <input class='item-edit-content' type='number' id='item-commission' name='Commission' onkeyup='calculateTotalValue(\"" + result.DealType + "\")' value='" + result.Commission + "'></div>";
                item += "<div class='item-edit-item-box'><span class='item-edit-index'>" + getLocalizationWord('Margin') + ":&nbsp; </span> <input class='item-edit-content' id='item-margin' name='Margin' value='" + result.Margin + "'></div>";
                item += "<div class='item-edit-item-box'><span class='item-edit-index'>" + getLocalizationWord('Total') + ":&nbsp; </span> <input class='item-edit-content' type='number'  id='item-total' name='Total' value='" + result.Total + "' readonly></div>";
                item += "<div class='item-edit-item-box'><span class='item-edit-index'>" + getLocalizationWord('Additional Info') + ":&nbsp; </span> <textarea class='item-edit-content' id='item-note' name='Note'>" + result.Note + "</textarea></div>";


                $('.edit-info-box').html(item);

                $('#item-margin').inputFilter(function (value) {
                    return /^-?\d*[.]?\d*$/.test(value);
                });
            } else if (result.DealType == 'Consignment') {

                item += "<div class='item-edit-item-box'><span class='item-edit-index'>" + getLocalizationWord('Price') + ":&nbsp; </span> <input class='item-edit-content' type='number' id='item-price' name='Price'  onkeyup='calculateTotalValue(\"" + result.DealType + "\")'  value='" + result.Price + "'></div>";
                item += "<div class='item-edit-item-box'><span class='item-edit-index'>" + getLocalizationWord('Commission') + ":&nbsp; </span> <input class='item-edit-content' type='number' id='item-commission' name='Commission' onkeyup='calculateTotalValue(\"" + result.DealType + "\")' value='" + result.Commission + "'></div>";
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

    } else if (dealType == 'For Sale') {

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

function checkEnterkey(e) {
    if (e.keyCode == 13) {
        $('#searchbtn').trigger('click');
    }
}


function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


function onPublishModal(id) {
    showSpinner();

    ShareDealID = id;
    id_selected_for_publish = id;
    IsSamePost = 0;

    clearGeneralLink();
    renderPublishModal(ShareDealID);
}

function generateLink() {
    var target = $("#target-box").val();
    var OgTitle = $("#title-box").val();
    var OgDescription = $("#des-box").val();
    if(!target) {
        toastr.error(LocalizationMessage('Enter the target') + ' Error');
    }else {
        showSpinner();
        var element = document.getElementById('share-image');
        var options = {
            backgroundColor: '#ffffff',
            scale: 5
        };

        html2canvas(element, options).then(function (canvas) {
            var ImageData = canvas.toDataURL('image/jpeg');
            $.ajax({
                url: base_url + 'Publish/generateLink',
                type: 'POST',
                data: {
                    DealID: ShareDealID,
                    OgTitle: OgTitle,
                    OgDescription: OgDescription,
                    ImageData: ImageData,
                    Target: target,
                },
                success: function (res) {
                    var data = JSON.parse(res);
                    if(data.success) {
                        toastr.success(LocalizationMessage('Url is generated successfully'));
                        logSuccessActivity('Sharing. General Link', ShareDealID, 'tblDeals');
                        $("#url-box").val(data.Post.OgLink);
                        hiddenSpinner();
                        refreshDatatable(true);
                    } else {

                    }
                }
            });
        });
    }
}

function initPublishModal() {
    $('.table-publish').html('');
    $("input#title-box").val('');
    $("textarea#des-box").val('');
}

function clearGeneralLink() {
    $("input#target-box").val('');
    $("input#url-box").val('');
}

function renderPublishModal(DealID) {

    $.ajax({
        url: base_url + 'Publish/preview',
        type: 'POST',
        data: {
            DealID: DealID
        },
        success: function (res){
            var data = JSON.parse(res);

            var EqCategory = data.detail.EqCategory;

            var is_maq_active = (data.detail.MaquinariaJRLink) ? 'maquinaria_active' : 'maquinaria_deactive';            
            $("input#title-box").val(data.OgTitle); // set value of title input
            $("textarea#des-box").val(data.OgDescription); // set value of description textbox

            OgLink = data.OgLink;
            PostID = data.PostID;
            OgImage = data.OgImage;

            var RecordSelectedList = [];
            RecordSelectedList.push(DealID);

            $('.table-publish').html('');

            var userName = '';
            var userEmail = '';
            var userPhone = '';
            $.ajax({
                url: base_url + 'User/GetUserInfo',
                type: 'get',
                data: {
                    ID: $('#userIDInput').val()
                },
                async: false,
                timeout: 3000,
                success: function(res) {
                    var result = JSON.parse(res);
                    if (result.success == false) {
                        return;
                    }

                    var userData = result.user;
                    userName = userData.NAME + ' ' + userData.LASTNAME;
                    userEmail = userData.EMAIL;
                    userPhone = userData.PHONE;
                }
            });

            $.ajax({
                url: base_url + 'Deals/getTruckDataForPdf',
                type: 'POST',
                data: {
                    recordSelectedList: RecordSelectedList
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
                                    contentItem += '<div class="pdf-header-desc-box"><div class="header-arrow"></div><div class="desc"><p class="heading">OFERTAS DE COMPRA</p><p><strong>VENDEDOR:</strong> ' + userName + '</p><p><strong>Tel:</strong> ' + getStyledPhoneNumber(userPhone) + '</p><p><strong>Mail:</strong> ' + userEmail + '</p></div></div>';
                                    contentItem += '<div class="cross-bar"><img src="' + base_url + 'assets/images/icon/header-cross.png' + '"></div>'
                                    contentItem += '</div>';
                                    contentItem += '<div class="pdfPage-content">';

                                    contentItem += '<div class="pageCell">';
                                    contentItem += '<div class="pageCell-arrow"></div>';

                                    // image section cell

                                    var $imgUrl = base_url + "assets/images/primaryImages/" + full.PrimaryImage;
                                    var height = 224;
                                    var width = parseInt(full.pmW * height / full.pmH);
        
                                    contentItem += '<div id="share-image" class="imageCell">' +
                                        '<div class="modal-photo-cell" style="background-image: url(\'' + $imgUrl + '\')">' +
                                        '<img  src="' + $imgUrl + '" style="width: ' + width + 'px; height: ' + height + 'px; position:absolute; top:0; left: 50%; margin-left:' + (-1 * width / 2) + 'px;" >' +
                                        '</div>' +
                                        '</div>';

                                    // detail cell2
                                    contentItem += '<div class="contentCell">';

                                    var title = getTitleFromDatabase(full);                                
                                    var location = full.City.trim() + ', '+ full.State.trim() + ', ' + full.Country.trim();

                                    contentItem += "<h3 class='pdf-title'>" + title + "</h3>";
                                    contentItem += '<p class="pdf-location">' + location + '</p>';

                                    contentItem += '<div class="pdf-info-box">';

                                    if (full.DealType == 'Auction') {

                                        contentItem += '<div class="auction-info-box">';
                                        contentItem += '<div class="auction-arrow"></div><div class="auction-name"><img src="' + base_url + 'assets/images/icon/auction_icon.png">Subasta</div>';
                                        contentItem += '<div class="auction-date">' + full.EndDate + '</div>';
                                        contentItem += '<span class="auctioneer-title">Subastadora:</span><span class="auctioneer-value">' + full.Auctioneer + '</span>';
                                        contentItem += '</div>';

                                        if (Number(full.Price) != 0) {
                                            var price_unit = 'USD';
                                            var price = '$' + numberWithCommas(full.Total);
                                            
                                            contentItem += '<div class="pdf-price-box">';
                                            contentItem += '<div class="pdf-total-price"><span class="price-unit">' + price_unit + '</span><span class="price">' + price + '</span></div>';
                                            contentItem += '<div class="pdf-price-arrow"></div><div class="deal_buy_type">¡Con Puja Máxima!</div>';
                                            contentItem += '</div>';
                                            contentItem += '<span style="font-size: 7px;color: black;font-weight: bold; display: block; margin-top: 4px;">*Total aproximado incluyendo servicios</span><br>';
                                            contentItem += '<span style="font-size: 7px;color: black;font-weight: bold; display: block; margin-top: -20px;">*Precio no Incluye I.V.A.</span>';  
                                        }

                                    } else if (full.DealType == 'For Sale') {
                                    
                                        var price_unit = 'USD';
                                        var price = '$' + numberWithCommas(full.Total);
                                        
                                        contentItem += '<div class="pdf-price-box">';
                                        contentItem += '<div class="pdf-total-price"><span class="price-unit">' + price_unit + '</span><span class="price">' + price + '</span></div>';
                                        contentItem += '<div class="pdf-price-arrow"></div><div class="deal_buy_type">$ Venta</div>';
                                        contentItem += '</div>';
                                        contentItem += '<span style="font-size: 7px;color: black;font-weight: bold; display: block; margin-top: 4px;">*Total aproximado incluyendo servicios</span><br>';
                                        contentItem += '<span style="font-size: 7px;color: black;font-weight: bold; display: block; margin-top: -20px;">*Precio no Incluye I.V.A.</span>';
                                        
                                    }

                                    contentItem += '</div>';
                                    contentItem += '<div class="pdf-description-box">';
                                    contentItem += '<div class="pdf-description-arrow"></div>';
                                    contentItem += '<div class="pdf-label5">Detalles</div>'
                                    contentItem += '<div class="pdf-description-content-box">';
                                    ///////////// special fields //////////////////////////////////////////////
                                    contentItem += get_detail_data_for_pdf(full);

                                    contentItem += '</div>';
                                    contentItem += '</div>';
                                    contentItem += '</div>';
                                    contentItem += '</div>';

                                    contentItem += '</div>';
                                    contentItem += '</div>';

                                    $('.table-publish').html(contentItem);
                                    hiddenSpinner();
                                    $('#publishModal').modal('show');
                                }
                            });
                    }
                }
            });
        }
    });
}

function fb_share() {
    showSpinner();
    var element = document.getElementById('share-image');
    var options = {
        backgroundColor: '#ffffff',
        scale: 5
    };

    var OgTitle = $('#title-box').val();
    var OgDescription = $("#des-box").val();

    html2canvas(element, options).then(function (canvas) {

        var imgdata = canvas.toDataURL('image/jpeg');

        $.ajax({
            url : base_url + 'Publish/updatePublishment',
            type : 'post',
            data : {
                PostID : PostID,
                imgdata : imgdata,
                Platform : 'Facebook',
                IsSamePost : IsSamePost,
                DealID : ShareDealID,
                OgTitle : OgTitle,
                OgDescription : OgDescription,
            },
            success : function(res) {
                var re = JSON.parse(res);
                if(re.success){
                    hiddenSpinner();
                    IsSamePost = 1;
                    FB.ui({
                        method: 'share',
                        display: 'popup',
                        href: re.data.OgLink,
                    }, function(response){
                        if (typeof response != 'undefined'){

                            toastr.success(LocalizationMessage('Publish To Facebook'));
                            logSuccessActivity('Sharing. Facebook', ShareDealID, 'tblDeals');

                            refreshDatatable(true);
                        }else{
                            deletePostItem(PostID);
                        }
                    });
                }
            }
        });
    });
}

function wa_share() {
    showSpinner();
    var element = document.getElementById('share-image');
    var options = {
        backgroundColor: '#ffffff',
        scale: 5
    };

    var OgTitle = $('#title-box').val();
    var OgDescription = $("#des-box").val();

    html2canvas(element, options).then(function (canvas) {

        var imgdata = canvas.toDataURL('image/jpeg');

        $.ajax({
            url : base_url + 'Publish/updatePublishment',
            type : 'post',
            data : {
                PostID : PostID,
                imgdata : imgdata,
                Platform: 'WhatsApp',
                IsSamePost: IsSamePost,
                DealID : ShareDealID,
                OgTitle : OgTitle,
                OgDescription : OgDescription,
            },
            success : function(res) {
                var re = JSON.parse(res);
                if(re.success){
                    logSuccessActivity('Sharing. Whatsapp', ShareDealID, 'tblDeals');
                    hiddenSpinner();
                    IsSamePost = 1;
                    var URL = encodeURI("https://api.whatsapp.com://send?text="+re.data.OgLink);
                    window.open(URL);
                    refreshDatatable(true);
                }
            }
        });
    });
}

function google_share() {
    showSpinner();
    var element = document.getElementById('share-image');
    var options = {
        backgroundColor: '#ffffff',
        scale: 5
    };

    var OgTitle = $('#title-box').val();
    var OgDescription = $("#des-box").val();

    // var accessToken = 'ya29.a0AfH6SMBAwovDL861cz6c40pJm0b4PE54Sn3qiEfVgUEiUnRqHroyQ6_ENMKi7Zw-jaGwpmkolLGzCemW6iDyXmZnSFwPHhcME_4y5NrpQlbZdqD3kvKv73npSxfZBMFZDhd55faqYLT9mKvOpV1jhocjxbzaEMfRLCg';

    html2canvas(element, options).then(function (canvas) {

        var imgdata = canvas.toDataURL('image/jpeg');

        $.ajax({
            url : base_url + 'Publish/updatePublishment',
            type : 'post',
            data : {
                PostID : PostID,
                imgdata : imgdata,
                Platform: 'Gmail',
                IsSamePost: IsSamePost,
                DealID : ShareDealID,
                OgTitle : OgTitle,
                OgDescription : OgDescription,
            },
            success : function(res) {
                var re = JSON.parse(res);
                if(re.success){
                    logSuccessActivity('Sharing. Gmail', ShareDealID, 'tblDeals');
                    hiddenSpinner();
                    IsSamePost = 1;
                    var msgBody = '';
                    var subject = 'Testing';
                    msgBody += re.data.OgLink + '\r\n';
                    msgBody += re.data.OgTitle + '\r\n';
                    msgBody += re.data.OgDescription;
                    var URL = encodeURI("https://mail.google.com/mail/?view=cm&fs=1&tf=1&body="+msgBody+"&su="+ShareSubject);
                    window.open(URL);
                    refreshDatatable(true);
                }
            }
        });
        // Get the canvas from the DOM and turn it into base64-encoded png data.

        // var pngData = imgdata.split('base64,')[1];
        //
        // var mail = [
        //     'Content-Type: multipart/mixed; boundary="foo_bar_baz"\r\n',
        //     'MIME-Version: 1.0\r\n',
        //     'From: dreamcomes0704@gmail.com\r\n',
        //     'To: mdmsig20@protonmail.com\r\n',
        //     'Subject: Testing\r\n\r\n',
        //
        //     '--foo_bar_baz\r\n',
        //     'Content-Type: text/plain; charset="UTF-8"\r\n',
        //     'MIME-Version: 1.0\r\n',
        //     'Content-Transfer-Encoding: 7bit\r\n\r\n',
        //
        //     'This is test message!AAAAAA\r\n\r\n',
        //
        //     '--foo_bar_baz\r\n',
        //     'Content-Type: image/png\r\n',
        //     'MIME-Version: 1.0\r\n',
        //     'Content-Transfer-Encoding: base64\r\n',
        //     'Content-Disposition: attachment; filename="example.png"\r\n\r\n',
        //
        //     pngData, '\r\n\r\n',
        //
        //     '--foo_bar_baz--'
        // ].join('');
        //
        // $.ajax({
        //     type: "POST",
        //     url: "https://www.googleapis.com/upload/gmail/v1/users/bluesky715.dev@gmail.com/messages/send?uploadType=multipart",
        //     contentType: "message/rfc822",
        //     beforeSend: function(xhr, settings) {
        //         xhr.setRequestHeader('Authorization','Bearer '+accessToken);
        //     },
        //     data: mail
        // });
    });
}

function deletePostItem(id) {
    $.ajax({
        url: base_url + 'Publish/deletePostItem',
        type: 'post',
        data: {
            PostID : id,
        },
        success : function(res) {
        }
    });
}

function onPostingStatsModal(DealID) {
    Glo_DealID = DealID;
    if(FirstLoad == 1) {
        postingStatsTB.ajax.reload(null, false);
    } else {
        FirstLoad = 1;
        renderPostingStatsTB();
    }

    $('#postingStatsModal').modal('show');
}

function publish(site) {

    var siteName = site;

    showSpinner();

    if (siteName == 'MaquinariaJr') {

        if ($('#btnPublishToMaqui').hasClass('maquinaria_active')) {
            $.ajax({
                url : base_url + 'Deals/unPublishDealtoMachinary',
                type : 'post',
                data : {
                    id : id_selected_for_publish
                },
                success : function(res) {
                    var result = JSON.parse(res);
                    hiddenSpinner();

                    $('#publishModal').modal('hide');
                    if (result.success == false) {
                        toastr.error(LocalizationMessage('Unpublish Deal from MaquinariaJR') + ' Error');

                        logErrorActivity('Unpublish Deal from MaquinariaJR', id_selected_for_publish, 'tblDeals', result.message);
                    } 
                    else if (result.success == true) {
                        toastr.success(LocalizationMessage('Unpublish Deal from MaquinariaJR'));
                        logSuccessActivity('Unpublish Deal from MaquinariaJR', id_selected_for_publish, 'tblDeals');
                        managementTB.ajax.reload(null, false);  
                        websocket.send(JSON.stringify({ 'msg': 'unpublish_truck', 'poster': $('#usernameInput').val() }));
                    }  
                }
            });
        }
        else {
            
            var publish_title = '';
            var publish_price = '';
            var publish_SaleMode = '';
            var publish_Description = '';

            $.ajax(
            {
                url: base_url + 'Deals/getTruckById',
                type: 'POST',
                async : false,
                timeout : 30000,
                cache : false,
                data: {
                    id: id_selected_for_publish
                },
                success: function (res) {
                    var full = JSON.parse(res);

                    var title = getTitleFromDatabase(full);
                    title = title.substring(0, 32);
                    publish_title = title;
                    publish_price = numberWithCommas(full.Total);
                    publish_SaleMode = get_translated_word(full.DealType);              
                    publish_Description = get_detail_data_for_maquinaria(full);                    
                },
                error : function() {
                    return false;
                }
            });

            $.ajax({
                url : base_url + 'Deals/publishDealtoMachinary',
                type : 'post',
                data : {
                    id : id_selected_for_publish,
                    title : publish_title,
                    price : publish_price,                   
                    sale_mode : publish_SaleMode,
                    description : publish_Description                    
                },
                success : function(data) {
                    hiddenSpinner();
                    var result = JSON.parse(data);                    
                    $('#publishModal').modal('hide');
                    if (result.success == false) {
                        toastr.error(LocalizationMessage('Publish Deal at MaquinariaJR') + ' Error');

                        logErrorActivity('Publish Deal at MaquinariaJR', id_selected_for_publish, 'tblDeals', result.message);                        
                    } 
                    else if (result.success == true) {
                        toastr.success(LocalizationMessage('Publish Deal at MaquinariaJR'));
                        logSuccessActivity('Publish Deal at MaquinariaJR', id_selected_for_publish, 'tblDeals');

                        websocket.send(JSON.stringify({ 'msg': 'publish_truck', 'poster': $('#usernameInput').val() }));
                        gotoLink(result.message);                        
                        managementTB.ajax.reload(null, false);                        
                    }                    
                }
            });
        }        
    }
    else {
        hiddenSpinner();
    }
    
    return;
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

///////////////////////update information in publish modal/////////////////////////////////

$("input#title-box").keyup(function(){ // change content of title meta tag whenever user type text on the title input
    if(IsSamePost == 0) {
        var OgTitle = $(this).val();
        $.ajax({
            url : base_url + 'Publish/updateOgTitle',
            type : 'post',
            data : {
                PostID : PostID,
                OgTitle : OgTitle,
            },
            success : function(res) {
            }
        });
    }
});

$("textarea#des-box").keyup(function(){ // change content of description meta tag whenever user type text on the description textarea
    if(IsSamePost == 0) {
        var OgDescription = $(this).val();
        $.ajax({
            url : base_url + 'Publish/updateOgDescription',
            type : 'post',
            data : {
                PostID : PostID,
                OgDescription : OgDescription,
            },
            success : function(res) {
            }
        });
    }
});
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

$('#fb_share').click(function(){
    fb_share();
});

$('#wa_share').click(function(){
    wa_share();
});

$('#google_share').click(function(){
    google_share();
});

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
            picElements += '<img class="slider-picture-control-item-image"  src="' + url + '" >';
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
        } else if (data.DealType == 'For Sale') {
            bannerImage = 'For Sale-banner-footer.png';
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

function onCloseAuction(id) {
    showSpinner();

    $.ajax({
        url: base_url + 'Deals/getTruckById',
        type: 'POST',
        data: {
            id: id
        },
        success: function (data) {
            hiddenSpinner();
            
            result = JSON.parse(data);

            $('#closeAuctionModal').modal('show');
            $('#edit-item-id').val(id);


            var $imgUrl = base_url + "assets/images/thumbImages/" + result.PrimaryImage;
            var captainStr = '<img    src="' + $imgUrl + '" style="width: auto; height: auto;  cursor: pointer; max-width : 250px; max-height : 270px;">';
            $('.edit-photo-close').html(captainStr);

            var item = '';


            var item = "<div class='item-edit-item-box'><span class='item-edit-index'>" + getLocalizationWord('Final Price') + ":&nbsp; </span> <input class='item-edit-content' type='number' id='item-finalPrice'  value='" + result.FinalPrice + "'></div>";

            $('.edit-info-box-close').html(item);

            $('#item-buy-premium').inputFilter(function (value) {
                return /^-?\d*[.]?\d*$/.test(value);
            });



        }
    });
}

function saveFinalPrice() {
    showSpinner();

    var ID = $('#edit-item-id').val();

    $.ajax({
        url: base_url + 'Deals/updateFianlPrice',
        type: 'POST',
        data: {
            ID: ID,
            FinalPrice: $('#item-finalPrice').val()
        },
        success: function (data) {
            var result = JSON.parse(data);
            if (result.success == true) {
                toastr.success(LocalizationMessage('Close Auction'));
                logSuccessActivity('Close Auction', ID, 'tblDeals');
                
                managementTB.ajax.reload(null, false);  

            } else {
                toastr.error(LocalizationMessage('Close Auction') + ' Error');
                logErrorActivity('Close Auction', ID, 'tblDeals', result.message);                
            }
            $('#closeAuctionModal').modal('hide');
            hiddenSpinner();
        }
    });
}

function getActiveDealsStatus() {
    console.log('Active Deals Status');

    $.ajax({
        url : base_url + 'Deals/getActiveDealsStatus',
        type : 'post',
        success : function (res) {
            var data = JSON.parse(res);

            var total = data.Auction + data.ForSale + data.Consignment + data.Inventory;

            $('#AuctionCount').html(data.Auction);
            $('#ForSaleCount').html(data.ForSale);
            $('#ConsignmentCount').html(data.Consignment);
            $('#InventoryCount').html(data.Inventory);

            $('#ActiveDealsCount').html(total);
        }
    });
}

function getAuctionStatus() {
    console.log('Auction Today');

    $.ajax({
        url : base_url + 'Deals/getAuctionStatus',
        type : 'post',
        success: function (res) {
            var data = JSON.parse(res);            

            $('#TodayCount').html(data.Today);
            $('#Within7DaysCount').html(data.Seven);
            $('#Within30DaysCount').html(data.Thirty);            

            $('#AuctionsTotalCount').html(data.auction);
        }
    });
}

function getTodayAddedDealStatus() {
    $.ajax({
        url : base_url + 'Deals/getTodayAddedDealStatus',
        type : 'post',
        success: function (res) {
            var data = JSON.parse(res);

            var total = data.Auction + data.ForSale + data.Consignment + data.Inventory;

            $('#AddedAuctionCount').html(data.Auction);
            $('#AddedForSaleCount').html(data.ForSale);
            $('#AddedConsignmentCount').html(data.Consignment);
            $('#AddedInventoryCount').html(data.Inventory);

            $('#AddedDealsCount').html(total);
        }
    });
}

function getSearchHelpDealsStatus() {
    $.ajax({
        url : base_url + 'Deals/getSearchHelpDealsStatus',
        type : 'post',
        success : function (res) {
            var data = JSON.parse(res);

            // $('#DepositWithNoDealCount').html(data.NoDeal);
            // $('#DepositPendingAuctionCount').html(data.Pending);
            $('#SearchHelpActiveCount').html(data.SearchHelp);

            $('#SearchHelpCount').html(data.SearchHelp);
        }
    })
}

function onMarkDeal(ID) {
    $.ajax({
        url : base_url + 'Deals/markDealForExit',
        type : 'post',
        data : {
            'Mark' : 'YES',
            'ID' : ID
        },
        success : function() {
            managementTB.ajax.reload(null, false);
            websocket.send(JSON.stringify({ 'msg': 'mark', 'poster': $('#usernameInput').val() }));
            logSuccessActivity('Mark a Deal', ID, 'tblDeals');
        }
    });
}

function onUnmarkDeal(ID) {
    $.ajax({
        url : base_url + 'Deals/markDealForExit',
        type : 'post',
        data : {
            'Mark' : 'NO',
            'ID' : ID
        },
        success : function() {
            managementTB.ajax.reload(null, false);
            websocket.send(JSON.stringify({ 'msg': 'mark', 'poster': $('#usernameInput').val() }));
            logSuccessActivity('Unmark a Deal', ID, 'tblDeals');
        }
    })
}

function refreshDatatable(refreshable = true) {
    if (refreshable == true) {
        managementTB.ajax.reload();
    }
    else 
        managementTB.ajax.reload(null, false);
}

function onProcurement(ID) {
    showSpinner();

    $.ajax({
        url: base_url + 'Procurement/add',
        type: 'post',
        data: {
            DealID: ID,
            AddedFrom: 'Deal'
        },
        success: function(res) {
            hiddenSpinner();

            var data = JSON.parse(res);

            if (data.success == false) {
                toastr.warning(LocalizationMessage("Buy Deal"));
                logErrorActivity('Buy Deal', ID, 'tblDeal', 'Buy Deal Error');
                return;
            }

            toastr.success(LocalizationMessage("Buy Deal"));
            logSuccessActivity('Buy Deal', ID, 'tblDeal');
            refreshDatatable(false);
        },
        error: function(res) {
            toastr.warning(LocalizationMessage('Buy Deal'));
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
            Webpage : 'Deals.Management',
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
            Webpage : 'Deals.Management',
            Status : 'Error',
            Error : ErrorMsg
        },
        success : function() {
            websocket.send(JSON.stringify({ 'msg': 'activity', 'poster': $('#usernameInput').val() }));
        }
    });
}

function copyGeneratedUrl() {
    var copyText = document.getElementById("url-box");
    copyText.select();
    copyText.setSelectionRange(0, 99999)
    document.execCommand("copy");
}

