/*
@@ LEAD-MANAGEMENT.JS
@@ By Zheng
@@ 2020-02-19
*/

var managementTB;
var expirationTimes = [];
var statuses = [];
var closingDates = [];
var assignedDates = [];
var contactsArray = [];
var contactDateArray = [];
var tagArray = [];
var rows = [];

// History Data;
var contact_history = [];
var history_index = 0;

var ChannelsName = {
    "PhoneCall" : "Phone Call",
    "Whatsapp" : "Whatsapp",
    "VideoCall" : "Video Call",
    "Email" : "Email",
    "Other" : "Other Contact",
    "Catalog" : "Catalog",
    "AuctionResults" : "Auction Results",
    "Multimedia" : "Multimedia",
    "CompanyInfo" : "Company Info",
    "NoContact" : "No Contact",
};

// column data
var columnData = [
    {
        "title": "",
        sortable: false,    
        "render": function (data, type, full, meta) {   

            var contact = '<button  class="col-lg-4 btn btn-sm btn-default btn-action"  data-toggle="tooltip" data-placement="top" title="' + getLocalizationWord('Contact') + '" onclick="onContact(' + full.ID +')"><i class="fa fa-phone"></i></button>';
            var contactLog = '<button  class="col-lg-4 btn btn-sm btn-default btn-action"  data-toggle="tooltip" data-placement="top" title="' + getLocalizationWord('Assignment Stats') + '" onclick="onContactLog(\'' + full.ID + '\')"><i class="icon-list"></i></button>';
            var note = '<button  class="col-lg-4 btn btn-sm btn-default btn-action"  data-toggle="tooltip" data-placement="top" title="' + getLocalizationWord('Tag') + '" onclick="onTag(' + full.ID +')"><i class="icon-tag"></i></button>';
            var proposal = '<button  class="col-lg-4 btn btn-sm btn-default btn-action bottom-button"  data-toggle="tooltip" data-placement="top" title="' + getLocalizationWord('Proposal') + '" onclick="onProposal(' + full.ID + ', \'' + full.Stage + '\')"><i class="icon-flag"></i></button>'
            var history = '<button  class="col-lg-4 btn btn-sm btn-default btn-action bottom-button"  data-toggle="tooltip" data-placement="top" title="' + getLocalizationWord('History') + '" onclick="onHistory(' + full.OpportunityID + ')"><i class="icon-notebook"></i></button>';
            var sale = '';
            var cancel = '';
            var info = '';
            var edit = '';
            var searchHelp = '';

            if (full.AdditionalInfo !='' || full.LeadAdditionalInfo != '') {
                info = '<button  class="col-lg-4 btn btn-sm btn-default btn-action"  data-toggle="tooltip" data-placement="top" title="' + getLocalizationWord('Info') + '" onclick="onInfo(\'' + replaceNR2Br(full.AdditionalInfo) + '\', \'' + replaceNR2Br(full.LeadAdditionalInfo) + '\')"><i class="icon-info"></i></button>';
            }

            if (full.Status == 'Open')
                cancel = '<button  class="col-lg-4 btn btn-sm btn-default btn-action bottom-button"  data-toggle="tooltip" data-placement="top" title="' + getLocalizationWord('Cancel') + '" onclick="onCancel(' + full.OpportunityID + ')"><i class="icon-action-undo"></i></button>';
            
            if (full.Status == 'Open' && (full.Stage == 'Contact' || full.Stage == 'Proposal')) {
                edit = '<button  class="col-lg-4 btn btn-sm btn-default btn-action bottom-button"  data-toggle="tooltip" data-placement="top" title="' + getLocalizationWord('Edit') + '" onclick="onEdit(' + full.OpportunityID + ')"><i class="icon-note"></i></button>'
            }

            if (full.Status == 'Open' && full.Stage == 'Proposal') {
                sale = '<button  class="col-lg-4 btn btn-sm btn-default btn-action bottom-button"  data-toggle="tooltip" data-placement="top" title="' + getLocalizationWord('Sale') + '" onclick="onSale(' + full.ID + ')"><i class="icon-basket"></i></button>';
            }

            if (full.Stage == 'Contact' || full.Stage == 'Proposal') {
                if (full.SearchHelp == 'NO')
                    searchHelp = '<button  class="col-lg-4 btn btn-sm btn-default btn-action bottom-button"  data-toggle="tooltip" data-placement="top" title="' + getLocalizationWord('Search Help') + '" onclick="onSearchHelp(' + full.ID + ')"><i class="icon-magnifier"></i></button>';
                else
                    searchHelp = '<button  class="col-lg-4 btn btn-sm btn-default btn-action bottom-button"  data-toggle="tooltip" data-placement="top" title="' + getLocalizationWord('Remove Search Help') + '" onclick="onRemoveSearchHelp(' + full.ID + ')"><i class="icon-refresh"></i></button>';
            }

            if (full.Status == 'Closed')
            {
                proposal = '';
                edit = '';
                contact = '';
                note = '';
                searchHelp = '';
            }

            

            return  '<div class="row" style = "width : 120px;">' + 
                    contact + contactLog + note + info + proposal + sale + edit + history + searchHelp + cancel +
                    '</div>';
        }
    }, {
        'title' : getLocalizationWord('Status'),
        sortable : false,
        'render' : function(data, type, full, meta) {
            var status = getLocalizationWord(full.Status) + '<br>';
            var stage = getLocalizationWord('Stage') + ': ' + getBadgetForEachStatusOnMyOpp(full.Stage) + '<br>';
            var assignedBy = '';
            var canceledBy = '';
            if (full.assignedBy != '')
                assignedBy = getLocalizationWord('Assigned By') + ': ' + full.AssignedBy + '<br>';
            if (full.CancelBy != '')
                canceledBy = getLocalizationWord('Canceled By') + ': ' + full.CancelBy + '<br>';

            return status + stage + assignedBy + canceledBy;
        }
    }, {
        "title": getLocalizationWord("Date"),
        sortable: true,
        "render": function (data, type, full, meta) {

            console.log("meta.row = " + meta.row);
            console.log('rows = ' + rows);

            var row_index = rows.indexOf(meta.row);
            console.log('row_index = ' + row_index);

            if (row_index < 0) {
                expirationTimes.push(full.ExpirationDate);
                statuses.push(full.Status);
                closingDates.push(full.ClosingDate);                
                assignedDates.push(full.AssignDate);
                contactsArray.push(full.Contacts);
                contactDateArray.push(full.ToContactDate);
                tagArray.push(full.Tag);
                rows.push(meta.row);
            } else {                
                expirationTimes[row_index] = full.ExpirationDate;
                statuses[row_index] = full.Status;
                closingDates[row_index] = full.ClosingDate;                
                assignedDates[row_index] = full.AssignDate;
                contactsArray[row_index] = full.Contacts;
                contactDateArray[row_index] = full.ToContactDate;
                tagArray[row_index] = full.Tag;
            }

            var assignDate = getLocalizationWord('Start') + ': ' + getSecondRemovedDateTime(full.AssignDate) + '<br>';
            var workingTime = '';
            var closingDate = '';

            if (full.Status == 'Closed') {
                closingDate = getSecondRemovedDateTime(full.ClosingDate);
            }

            var today = new Date().toLocaleString("en-US", {timeZone: "America/Phoenix"});
            today = new Date(today);
            
            var assignedDay = new Date(full.AssignDate.replace(/\s/, 'T'));

            workingTimeStamp = today.getTime() - assignedDay.getTime(); 
            
            workingTime = getDateStringFromTimestamp(workingTimeStamp);
        
            
            return assignDate + workingTime + '<br>' + closingDate;
        }
    }, {
        "title": getLocalizationWord("Contact"),
        sortable: true,
        "render": function (data, type, full, meta) {

            var contact = '';
            var timeleft = '';
            var tag_html = '';

            var tagText = full.Tag;
            var tags = tagText.split('&');

            for (var i = 1; i < tags.length; i++) {
                var tag = tags[i];
                var tagInfo = tag.split(';');
                tag_html += "<span class='tag badge badge-" + tagInfo[1] + "'>" + tagInfo[0] + "</span>" + '<br>';                
            }

            if (full.Contacts > 0 && full.ToContactDate != '0000-00-00 00:00:00') 
            {
                var contactDay = new Date(full.ToContactDate.replace(/\s/, 'T'));
                var today = new Date().toLocaleString("en-US", {timeZone: "America/Phoenix"});
                today = new Date(today);  
                today.setHours(0, 0, 0, 0);
                contactDay.setHours(0, 0, 0, 0);
                var contact = '';

                if (today.getTime() == contactDay.getTime()) {
                    contact = '<span class="badge badge-warning">' + getDatefromDateTime(full.ToContactDate) + '</span>';
                }
                else if (contactDay < today){
                    contact = '<span class="badge badge-danger">' + getDatefromDateTime(full.ToContactDate) + '</span>';
                }
                else
                    contact = getDatefromDateTime(full.ToContactDate);

                contact = full.Contacts + '<br>' + getLocalizationWord('Next') + ": " + contact;
            }
            else
                contact = full.Contacts;
            
            if (full.Status == 'Open' && ExpirationStatus == true) {
                expiresDate = getLocalizationWord('Expires') + ': ' + getSecondRemovedDateTime(full.ExpirationDate) + '<br>';
                //var endDate = 'End: ' + full.ClosingDate;                

                var today = new Date().toLocaleString("en-US", {timeZone: "America/Phoenix"});
                today = new Date(today);            
                
                var expirationDay = new Date(full.ExpirationDate.replace(/\s/, 'T'));
                var contactDay = new Date(full.ToContactDate.replace(/\s/, 'T'));

                expriationTimestamp = expirationDay.getTime() - today.getTime(); 

                expiration = getDateStringFromTimestamp(expriationTimestamp);
                
                var expirationString = expiration;

                if (full.Contacts > 0) {
                    today.setHours(0, 0, 0, 0);
                    expirationDay.setHours(0, 0, 0, 0);
                    if (today >=  expirationDay)
                        expirationString = '<span class="badge badge-warning">' + expiration + '</span>';
                }                
                if (expriationTimestamp < 36000000)
                    expirationString = '<span class="badge badge-danger">' + expiration + '</span>';
                
                timeleft = getLocalizationWord('Time Left') + ': ' + expirationString + '<br>';
            }

            return contact + '<br>' + timeleft + tag_html;
        }
    }, {
        "title": getLocalizationWord("Client Info"),
        sortable: false,
        "render": function (data, type, full, meta) {

            var whatsapp_link = '';
            if(full.Phone) {                
                whatsapp_link = '<a class="contact-link" href="javascript:void(0);" onclick="SendViaWhatsapp(\'' + full.Phone + '\');"><img class="publish-icon" src="/assets/images/publish_icon/WhatsApp_icon.png"></a>';
            }

            var google_contact = '<a class="contact-link" href="javascript:void(0);" onclick="AddGoogleContact(' + full.CustomerID + ');"><img class="publish-icon" src="/assets/images/publish_icon/google_contact.png"></a>';

            return  full.Name + ' ' + 
                    full.LastName + google_contact + '<br>' + 
                    getStyledPhoneNumber(full.Phone) + whatsapp_link + '<br>' +
                    getCheckedValue(full.Email, 'mail') +
                    getCheckedValue(full.CompanyName) + 
                    getCheckedValue(full.Source) ;
        }
    }, {
        'title' : 'Equipment Info',
        sortable : false,
        render: function (data, type, full, meta) {
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
                    getCheckedValue(full.EqModelCap) + 
                    getCheckedValue((full.MinYear == '0' ? "" : full.MinYear));
        }
    }, {
        'title' : 'Deal Info',
        sortable : false,
        render : function (data, type, full, meta) {
            return  getLocalizationWord(full.LeadType) + '<br>' + 
                    (full.MaxPrice == 0 ? "" : numberWithCommas(full.MaxPrice) + ' ' + full.Unit + '<br>') +
                    getLocalizationWord(full.TimeFrame) + '<br>' + 
                    full.Rate;
        }
    }
];

$(function () {

    getAssignedOppWaitingContact();
    getOpenOpps();
    getClosedOppsToday();
    getUpdatedOppsToday();

    $('.loading-box').css('width', $(window).width());
    $('.loading-box').css('height', $(window).height());

    $('.socket-loading-box').css('width', $(window).width());
    $('.socket-loading-box').css('height', $(window).height());

    $('.progress-box-layer').css('width', $(window).width());
    $('.progress-box-layer').css('height', $(window).height());
    

    if (ExpirationStatus == true) {
        showSpinner();
        $.ajax({
            url : base_url + 'Opportunities/AutoCancelAssignments',
            type : 'post',
            success : function(data) {
                hiddenSpinner();
                result = JSON.parse(data);
                if (result.success == false) {
                    toastr.error(result.message);                
                }
                else {
                    renderTB();
                }
            },
            error : function() {
                hiddenSpinner();
            }
        });
    }
    else
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

        if (msg == 'assign') {
            getAssignedOppWaitingContact();
            getOpenOpps();
            getClosedOppsToday();
            getUpdatedOppsToday();
            refreshDatatable();
        }
        else if (msg == 'cancel_assign') {
            getAssignedOppWaitingContact();
            getOpenOpps();
            getClosedOppsToday();
            getUpdatedOppsToday();
            refreshDatatable();
        }
        else if (msg == "save_contact") {
            getAssignedOppWaitingContact();
            getOpenOpps();
            getClosedOppsToday();
            getUpdatedOppsToday();
            toastr.warning("New Opportunity Added");
        }
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

    $('#contactPhone').intlTelInput(phoneConfig);        
    $('#contactPhoneEdit').intlTelInput(phoneConfig);        

    document.getElementById("contactPhone").addEventListener('countrychange', phoneCountryCodeChange);
    document.getElementById("contactPhoneEdit").addEventListener('countrychange', phoneCountryCodeChange);

    $('#contactPhone').mask('999 999 9999');
    $('#contactPhoneEdit').mask('999 999 9999');

    var today = new Date();
    var endDate = new Date();
    endDate.setDate(today.getDate() + 10);
    $('#whenToContact').datepicker('setStartDate', today);    
    $('#whenToContact').datepicker('setEndDate', endDate);

    if (PendingOpps != 0)
    {
        if (lang == 'english')
            toastr.warning('You have ' + PendingOpps + ' Pending Opportunities');
        else   
            toastr.warning('Tienes ' + PendingOpps + ' Oportunidades Pendientes');
    }

    if (SearchHelpCount > 0) {
        toastr.warning(SearchHelpCount + ' ' + LocalizationMessage('Opportunities Need Search Help'));
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

            var users = "";
            var assigned = "<option value=''></option>";
            for (var i = 0; i < result.length ; i++) {
                if (result[i].SALESREP == 'ON')
                    assigned += '<option value="' + result[i].USERNAME +'">' + result[i].USERNAME + '</option>';
            }

            $('#contactAssignTo').html(assigned);
        }
    });     
});

function renderTB() {
    managementTB = $('#lead-management-table').DataTable({
        'processing': true,
        'serverSide': true,
        'ajax': {
            url: base_url + 'Opportunities/getMyOpportunityData',
            type: 'POST',
            data: function (d) {               
                d.status = $('#inputStatus').val();
                d.stage = $('#inputStage').val();
                d.leadType = $('#inputLeadType').val();
                d.searchText = getTranslatedWordForSearch($('#searchInput').val());
                d.salesRep = $('#usernameInput').val();
                d.rate = $('#inputRate').val();
                d.minContactDate = $('#minStartDateInput').val();
                d.maxContactDate = $('#maxStartDateInput').val();
                d.ToContact = $('#ToContactCheckBox').prop('checked');
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
        'sorting' : true,
        'lengthMenu': [[10, 25, 50, -1], [10, 25, 50, getLocalizationWord('All')]],
        'order': [[2, 'asc']],
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

///////////////////////////// ACTION PART ///////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

function onInfo(additionalInfo, LeadAdditionalInfo) {    
    $('#LeadAdditionalInfo').html(LeadAdditionalInfo);
    $('#AdditionalInfo').html(additionalInfo);

    if (LeadAdditionalInfo == '') {
        $('#leadAdditionalInfoPanel').hide();
    }

    if (additionalInfo == '') {
        $('#additionalInfoPanel').hide();
    }
    
    $('#InfoModal').modal('show');
}

function onCancel(ID) {
    showSpinner();
    userName = $('#usernameInput').val();

    $.ajax({
        url : base_url + 'Opportunities/CancelAssignment',
        type : 'post',
        data : {
            ID : ID,
            user : userName
        },
        success : function(data) {
            hiddenSpinner();
            result = JSON.parse(data);

            if (result.success == false) {
                toastr.error(LocalizationMessage('Cancel Assginment') + ' Error');
                logErrorActivity('Cancel Assignment', ID, 'tblOpportunities', result.message);
            }
            else {
                toastr.success(LocalizationMessage('Cancel Assignment'));
                logSuccessActivity('Cancel Assignment', result.ID, 'tblAssignments');
                websocket.send(JSON.stringify({ 'msg': 'cancel_assign', 'poster': $('#usernameInput').val() }));
                refreshDatatable();
            }
        },
        error : function() {
            hiddenSpinner();
        }
    });
}

function onContact(ID) {
    $('#edit-item-id').val(ID);
    $('#note').val('');
    $('#stillInterested').val('YES');
    $('#contactDatePanel').show();
    $('#whenToContact').val('');

    $('#NoContact').prop('checked', false);
    $('#ContactChannelPhoneCall').prop('checked', false);
    $('#ContactChannelWhatsapp').prop('checked', false);
    $('#ContactChannelVideoCall').prop('checked', false);
    $('#ContactChannelEmail').prop('checked', false);
    $('#ContactChannelOther').prop('checked', false);
    $('#SendItemsCatalog').prop('checked', false);
    $('#SendItemsAuctionResults').prop('checked', false);
    $('#SendItemsMultimedia').prop('checked', false);
    $('#SendItemsCompanyInfo').prop('checked', false);

    $('#contactModal').modal('show');
}

$('#stillInterested').change(function() {
    if ($('#stillInterested').val() == 'YES')
        $('#contactDatePanel').show();
    else
        $('#contactDatePanel').hide();
})

$('#btnContact').click(function() {    

    var ID = $('#edit-item-id').val();
    
    if ($('#whenToContact').val() == '' && $('#stillInterested').val() == 'YES') {
        alert( "Please provide Contact Date" );        
        $('#whenToContact').focus();
        return false;
    }

    showSpinner();

    $('#contactModal').modal('hide');

    if ($('#stillInterested').val() == 'YES') {
        $.ajax({
            url : base_url + 'Opportunities/contactOpp',
            type : 'post',
            data : {
                ID : ID,
                NoContact: $('#NoContact').prop('checked'),
                ToContactDate : $('#whenToContact').val(),
                StillInterested : $('#stillInterested').val(),
                Note : replaceNR2Br($('#note').val()),
                PhoneCall : $('#ContactChannelPhoneCall').prop('checked'),
                Whatsapp : $('#ContactChannelWhatsapp').prop('checked'),
                VideoCall : $('#ContactChannelVideoCall').prop('checked'),
                Email : $('#ContactChannelEmail').prop('checked'),
                Other : $('#ContactChannelOther').prop('checked'),
                Catalog : $('#SendItemsCatalog').prop('checked'),
                AuctionResults : $('#SendItemsAuctionResults').prop('checked'),
                Multimedia : $('#SendItemsMultimedia').prop('checked'),
                CompanyInfo : $('#SendItemsCompanyInfo').prop('checked')
            },
            success : function (data) {
                hiddenSpinner();
                result = JSON.parse(data);
    
                if (result.success == false) {                    
                    toastr.error(LocalizationMessage('Add New Contact Date') + ' Error');
                    logErrorActivity('Add New Contact Date', ID, 'tblAssginments', result.message);
                }
                else {
                    toastr.success(LocalizationMessage('Add New Contact Date'));
                    logSuccessActivity('Add New Contact Date', ID, 'tblAssignments');
                    websocket.send(JSON.stringify({ 'msg': 'assign', 'poster': $('#usernameInput').val() }));
                    refreshDatatable();
                }
            },
            error : function() {
                hiddenSpinner();
            }
        });
    }
    else {
        $.ajax({
            url : base_url + 'Opportunities/CloseAssignment',
            type : 'post',
            data : {
                ID : ID,
                ToContactDate : $('#whenToContact').val(),
                StillInterested : $('#stillInterested').val(),
                Note : replaceNR2Br($('#note').val())
            },
            success : function (data) {
                hiddenSpinner();
                result = JSON.parse(data);
    
                if (result.success == false) {
                    toastr.error(LocalizationMessage('Close Assignment') + ' Error');
                    logErrorActivity('Close Assignment', ID, 'tblAssignments', result.message);
                }
                else {
                    toastr.success(LocalizationMessage('Close Assignment'));
                    logSuccessActivity('Close Assignment', ID, 'tblAssignments');
                    websocket.send(JSON.stringify({ 'msg': 'assign', 'poster': $('#usernameInput').val() }));
                    refreshDatatable();
                }
            },
            error : function() {
                hiddenSpinner();
            }
        });
    }

});

function onTag(ID) {
    $('#edit-item-id').val(ID);
    $('#TagText').val('');
    $('#TagColor').val('danger');

    showSpinner();
    $.ajax({
        url : base_url + 'Opportunities/getTag',
        type : 'post',
        data : {
            AssignID : ID
        },
        success : function (res) {
            var data = JSON.parse(res);
            hiddenSpinner();

            setTagContent(data.tag);

            $('#tagModal').modal('show');
        }
    });
}

function setTagContent(tagText) {

    var ID = $('#edit-item-id').val();

    $('#tagContent').html('');
    var tags = tagText.split("&");
    console.log(tags);

    var tag_html = '';

    for (var i = 1; i < tags.length;  i++) {
        var tag = tags[i];
        var tagInfo = tag.split(';');
        tag_html += "<span class='tag badge badge-" + tagInfo[1] + "'>" + tagInfo[0] + "<span class='tag-remove' onclick='tagRemove(" + ID + ", " + i + ");'></span></span>";
    }

    $('#tagContent').html(tag_html);

    refreshDatatable(false);
}

$('#btnAddTag').click(function() {

    console.log('Note Save Btn Clicked');

    var tags = $('#tagContent .tag');
    if (tags.length == 5)
    {
        toastr.error(LocalizationMessage('5 Tags Allowed'));
        return;
    }

    var ID = $('#edit-item-id').val();
    
    if (!$('#tagForm').valid())
        return;

    showSpinner();
    $.ajax({
        url : base_url + 'Opportunities/addTag',
        type : 'post',
        data : {
            AssignID : ID,
            TagText : $('#TagText').val(),
            TagColor : $('#TagColor').val()
        },
        success : function(res) {
            hiddenSpinner();
            var data = JSON.parse(res);

            if (data.success == false) {                
                toastr.error(LocalizationMessage('Add Tag') + ' Error');
                logErrorActivity('Add Tag', ID, 'tblAssignments', result.message);                
            }
            else {                
                setTagContent(data.tag);
                $('#TagText').val('');

                logSuccessActivity('Add Tag', ID, 'tblAssignments');
            }
        },
        error : function() {
            hiddenSpinner();
        }
    })
});

function onContactLog(ID) {
    showSpinner();

    $.ajax({
        url : base_url + 'Opportunities/getAssignmentChannelCount',
        type : 'post',
        data : {
            ID : ID
        },
        success : function(data) {
            hiddenSpinner();
            result = JSON.parse(data);

            if (result.success == false) {
                toastr.error(result.message);
            }
            else {
                contactLog = result.ContactLog;

                contactNumber = JSON.parse(contactLog);
                var html = '';

                for (var k in contactNumber) {
                    html += "<span style='font-weight: bolder;'>" + ChannelsName[k] + "</span>: " + contactNumber[k] + '<br>';
                }
                
                $('#contactLogPanel').html(html);
                $('#contactLogModal').modal('show');
            }
        },
        error : function() {
            hiddenSpinner();
        }
    });
}

function onHistory(ID) {
    showSpinner();
    history = [];
    history_index = 0;
    $('#btnHistoryPrev').prop('disabled', true);
    $('#btnHistoryNext').prop('disabled', false);

    $.ajax({
        url : base_url + 'Opportunities/getOpportunityHistory',
        type : 'post',
        data : {
            ID : ID
        },
        success : function(data) {  
            hiddenSpinner();

            contact_history = JSON.parse(data);

            console.log(contact_history);
            
            if (contact_history.length == 0)
            {                
                toastr.error('No History Data');
            }
            else {
                if (contact_history.length == 1)
                    $('#btnHistoryNext').prop('disabled', true);
                showHistoryData(history_index);
                $('#HistoryModal').modal('show');
            }
            
        },
        error : function() {
            hiddenSpinner();
        }
    });
}

$('#btnHistoryNext').click(function() {
    history_index++;
    if (history_index == contact_history.length - 1)
        $('#btnHistoryNext').prop('disabled', true);    

    $('#btnHistoryPrev').prop('disabled', false);
    showHistoryData(history_index);
});

$('#btnHistoryPrev').click(function() {
    history_index--;
    if (history_index == 0)
        $('#btnHistoryPrev').prop('disabled', true);
    $('#btnHistoryNext').prop('disabled', false);
    showHistoryData(history_index);
});

function showHistoryData(index) {

    $('#historyStatus').html(contact_history[index]['Status']);
    $('#historyStage').html(contact_history[index]['Stage']);
    $('#historyAssignedDate').html(contact_history[index]['AssignDate']);
    $('#historyClosingDate').html(contact_history[index]['ClosingDate']);
    $('#historySalesRep').html(contact_history[index]['SalesRep']);
    $('#historyAssignedBy').html(contact_history[index]['AssignedBy']);
    $('#historyCanceledBy').html(contact_history[index]['CancelBy']);
    $('#historyAdditionalInfo').html(contact_history[index]['AdditionalInfo']);

    if (contact_history[index]['Status'] == 'Open') {
        $('#historyCloseExpiration').html(getLocalizationWord('Expiration Date') + ': ');
        $('#historyClosingDate').html(contact_history[index]['ExpirationDate']);        
        $('#historyCanceledByPanel').hide();
    }
    else {
        $('#historyCloseExpiration').html(getLocalizationWord('Closing Date') + ': ');
        if (contact_history[index]['CancelBy'] == '')
            $('#historyCanceledByPanel').hide();
        else
            $('#historyCanceledByPanel').show();
    }

    if (contact_history[index]['AdditionalInfo'] == '')
        $('#historyAdditionalInfoPanel').hide();
    else
        $('#historyAdditionalInfoPanel').show();

    contactLog = contact_history[index]['ContactsLog'];
    var logs = contactLog.split('&&&');
    var html_logs_panel = '';

    for (var i = logs.length - 2; i >= 0; i--) {
        console.log(logs[i]);
        var log = JSON.parse(logs[i]);

        html_logs_panel += 
            "<div class='contact'><div style='width : 30px;'><label style='width : 30px;'>" + (logs.length - i - 1) + ".</label></div>" +
            "<div style='margin-left : 20px;'>"+
            "<div ><span style='font-weight: bolder'>" + getLocalizationWord('Date') + ": </span>" + log.Date + "</div>";
        if (log.StillIntersted != '')
            html_logs_panel += "<div ><span style='font-weight: bolder'>" + getLocalizationWord('Open Opportunity') + ": </span>" + getLocalizationWord(log.StillIntersted) + "</div>";
        if (log.StillIntersted == 'YES')
            html_logs_panel += "<div ><span style='font-weight: bolder'>" + getLocalizationWord('Scheduled Contact') + ": </span>" + log.ToContactDate.substr(0, 10) + "</div>";
        if (log.NoContact == 'true')
            html_logs_panel += "<div ><span style='font-weight: bolder'>" + getLocalizationWord('No Contact') + "</span></div>";        

        var ChannelText = '';
        var ContactChannels = log.ContactChannel;
        if (ContactChannels != null) {
            for (var j = 0; j < ContactChannels.length; j++)
                ChannelText += getLocalizationWord(ChannelsName[ContactChannels[j]]) + ' - ';
        }

        var SendItems = log.SendItems;
        if (SendItems != null) {
            for (var j = 0; j < SendItems.length; j++)
                ChannelText += getLocalizationWord(ChannelsName[SendItems[j]]) + ' - ';
        }

        html_logs_panel += "<div ><span style='font-weight: bolder'>" + getLocalizationWord('Note') + ":<br></span>";
        if (ChannelText != '')
            html_logs_panel += ChannelText.substr(0, ChannelText.length - 2) + '<br><br>';

        html_logs_panel += restoreSpecificCharacter(log.Note) + "</div>" +        
        "</div></div>";
    }

    if (logs.length == 1)
        $('#historyContactLogsPanel').hide();
    else
        $('#historyContactLogsPanel').show();
    

    $('#contactHistoryPanel').html(html_logs_panel);
}

function onEdit(ID) {
    showSpinner();    

    
    $('#contactEquipmentCategoryEdit').html(get_equipment_category_element());

    $.ajax({
        url : base_url + 'Opportunities/getOpportunityByID',
        type : 'post',
        data : {
            ID : ID
        },
        success : function(data) {
            hiddenSpinner();
            var result = JSON.parse(data);
            
            if (result.success == false) {
                toastr.error(result.message);
            }
            else {
                var data = result.data;
                $('#edit-item-id').val(data.ID);
                $('#contactNameEdit').val(data.Name);
                $('#contactLastNameEdit').val(data.LastName);
                $('#contactPhoneEdit').intlTelInput('setNumber', data.Phone);
                $('#contactEmailEdit').val(data.Email);
                $('#contactCompanyEdit').val(data.CompanyName);
                $('#contactCountryEdit').val(data.Country);
                $('#contactStateEdit').html(get_state_options_elements(data.Country));
                $('#contactStateEdit').val(data.State);
                $('#contactCityEdit').val(data.City);
                $('#contactEquipmentCategoryEdit').val(data.EqCategory);
                $('#contactMakeEdit').val(data.EqMake);
                $('#contactModelEdit').val(data.EqModelCap);
                $('#contactMinYearEdit').val(data.MinYear);
                $('#contactMaxPriceEdit').val(data.MaxPrice);
                $('#contactPriceUnitEdit').val(data.Unit);
                $('#contactTimeFrameEdit').val(data.TimeFrame);
                $('#contactRateEdit').val(data.Rate);
                $('#contactAdditionalInfoEdit').val(data.AdditionalInfo);

                $('#editModal').modal('show');
            }
        }
    })
}


$('#btnContactSave').click(function() {    
    var id = $('#edit-item-id').val();    
    showSpinner();

    console.log(id);
    
    $.ajax({
        url : base_url + 'Opportunities/editOpportunity',
        type : 'post',
        data : {               
            ID : $('#edit-item-id').val(),
            Name : $('#contactNameEdit').val(),
            LastName : $('#contactLastNameEdit').val(),
            Phone : $('#contactPhoneEdit').intlTelInput('getNumber'),
            Email : $('#contactEmailEdit').val(),
            CompanyName : $('#contactCompanyEdit').val(),            
            Country : $('#contactCountryEdit').val(),
            State : $('#contactStateEdit').val(),
            City : $('#contactCityEdit').val(),
            EqCategory : $('#contactEquipmentCategoryEdit').val(),
            EqMake : $('#contactMakeEdit').val(),
            EqModelCap : $('#contactModelEdit').val(),
            MinYear : $('#contactMinYearEdit').val(),
            MaxPrice : $("#contactMaxPriceEdit").val(),
            Unit: $('#contactPriceUnitEdit').val(),
            TimeFrame : $('#contactTimeFrameEdit').val(),
            Rate: $('#contactRateEdit').val(),
            AdditionalInfo : $('#contactAdditionalInfoEdit').val()            
        },
        success : function(data) {
            hiddenSpinner();
            result = JSON.parse(data);

            if (result.success == false) {
                toastr.error(LocalizationMessage('Edit Opportunity Info') + ' Error');
                logErrorActivity('Edit Opportunity Info', id, 'tblOpportunities', result.message);
            }
            else {                    
                toastr.success(LocalizationMessage('Edit Opportunity Info'));
                logSuccessActivity('Edit Opportunity Info', id, 'tblOpportunities');
                websocket.send(JSON.stringify({ 'msg': 'assign', 'poster': $('#usernameInput').val() }));
                refreshDatatable();
            }
        }
    });     
});

function onContactCountryChange(element) {
    var country = $(element).val();
    if (country != 'Other') {
        var options = get_state_options_elements(country);
        $('#contactState').html(options);
    }
    else {
        $('#contactState').html('<option value=""></option>');
    }
}

function onProposal(ID, Stage) {
    var assignmentID = ID; 
    $('#edit-item-id').val(assignmentID);

    if (Stage == 'Proposal') {
        showSpinner();

        $.ajax({
            url : base_url + 'Opportunities/getProposals',
            type : 'post',
            data : {
                ID : ID
            },
            success : function(data) {
                hiddenSpinner();
                var result = JSON.parse(data);

                if (result.success == false) {
                    toastr.error(result.message);
                    document.location.href = base_url + 'Opportunities/proposal/' +  ID;
                }
                else {
                    var proposals = result.proposals;
                    $('.picture-control-main-box').html('');
                    $('.video-control-box').html('');

                    var proposal_html = '';

                    for (proposal of proposals) {
                        var image = proposal.Image;
                        var images = image.split(';');
                        var url = base_url + 'assets/images/proposals/' + images[0];
                        var pro_ID = proposal.ID;

                        proposal_html += '<div>'
                        proposal_html += '<div class="slider-picture-control-item" data-id="' + pro_ID + '" onclick="setBorder(this)">';
                        proposal_html += '<img class="slider-picture-control-item-image"  src="' + url + '" >';
                        proposal_html += '<div class="picture-item-check-box"><i class="fa  fa-check"></i></div>';                                                               
                        proposal_html += '</div>';
                        proposal_html += '<div style="display:flex; align-items:center; justify-content : center;">';
                        proposal_html += '<button class="btn btn-default btn-round" data-id="'+ pro_ID +'" onclick="onPreview(this)">' + getLocalizationWord('Preview') + '</button> &nbsp;';
                        proposal_html += '<button class="btn btn-default btn-round" data-id="'+ pro_ID +'" onclick="onDownload(this)">' + getLocalizationWord('Download') + '</button>';
                        proposal_html += '</div>';
                        proposal_html += '</div>';
                    }

                    $('.picture-control-main-box').html(proposal_html);
                    $('#proposalModal').modal('show');
                }
            },
            error : function(data) {
                hiddenSpinner();
            }
        })
        
    }
    else {
        $('#btnNewProposal').click();
    }
}

function onSale(ID) {
    showSpinner();

    $.ajax({
        url : base_url + 'Opportunities/gotoSalesCycle',
        type : 'post',
        data : {
            ID : ID
        },
        success : function(res) {
            hiddenSpinner();
            var data = JSON.parse(res);

            if (data.success == false) {                
                toastr.error(LocalizationMessage('Sale') + ' Error');
                logErrorActivity('Sale', ID, 'tblAssignments', result.message);
            }
            else {
                logSuccessActivity('Sale', ID, 'tblAssignments');
                document.location.href = base_url + 'Sales/mine';
            }
        }
    })
}

$('#btnNewProposal').click(function() {
    $('#proposalModal').modal('hide');
    $('#ProposalTypeModal').modal('show');
});

$('#btnProposalEquipmentSelect').click(function() {
    var Type = $('#ProposalEquipmentType').val();
    var ID = $('#edit-item-id').val();
    document.location.href = base_url + 'Opportunities/proposal/' + ID + '/' + Type;
})

///////////////////////////// SET TIMER /////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

var myVar = setInterval(myTimer, 1000);

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

function onPreview(element) {
    var proposalID = $(element).data('id');

    showSpinner();

    $.ajax({
        url : base_url + 'Opportunities/getProposalByID',
        type : 'post',
        data : {
            ID : proposalID
        },
        success : function(data) {
            var result = JSON.parse(data);
            hiddenSpinner();

            if (result.success == false) {                
                toastr.error(result.message);
            }
            else {                

                var data = result.proposal;
                var image = data.Image;
                var images = image.split(';');
                var previewHTML = "";

                for (var page = 0; page < images.length - 1; page++) {                    
                    var temp = base_url + 'assets/images/proposals/' + images[page];
                    
                    previewHTML += '<img src = "' + temp + '" style="width: 100%; height : auto;">';
                    if (page < images.length - 2)
                        previewHTML += '<div style="height:10px;"></div>';
                }

                $('.prview-content').html(previewHTML);

                showPreviewTab();
            }
        },
        error : function() {
            hiddenSpinner();
        }
    });

}

function onSearchHelp(ID) {
    showSpinner();

    $.ajax({
        url : base_url + 'Opportunities/setSearchHelp',
        type : 'post',
        data : {
            ID : ID,
            SearchHelp : 'YES'
        },
        success : function (res) {
            hiddenSpinner();
            var data = JSON.parse(res);

            if (data.success == false) {
                toastr.error(LocalizationMessage('Active Search Help') + ' Error');
                logErrorActivity('Active Search Help', ID, 'tblAssignments', result.message);
                return;
            }

            toastr.success(LocalizationMessage('Active Search Help'));
            logSuccessActivity('Active Search Help', ID, 'tblAssignments');
            refreshDatatable();
        },
        error : function() {
            hiddenSpinner();
        }
    });
}

function onRemoveSearchHelp(ID) {
    showSpinner();

    $.ajax({
        url : base_url + 'Opportunities/setSearchHelp',
        type : 'post',
        data : {
            ID : ID,
            SearchHelp : 'NO'
        },
        success : function (res) {
            hiddenSpinner();
            var data = JSON.parse(res);

            if (data.success == false) {
                toastr.error(LocalizationMessage('Deactivate Search Help') + ' Error');
                logErrorActivity('Deactivate Search Help', ID, 'tblAssignments', result.message);
                return;
            }

            toastr.success(LocalizationMessage('Deactivate Search Help'));
            logSuccessActivity('Deactivate Search Help', ID, 'tblAssignments');
            refreshDatatable();
        },
        error : function() {
            hiddenSpinner();
        }
    });
}

function showPreviewTab() {
    $('#preview-tab').addClass('show');
    $('#preview-tab').addClass('active');

    $('#preview-control-box').addClass('show');
    $('#preview-control-box').addClass('active');

    $('#proposal-tab').removeClass('show');
    $('#proposal-tab').removeClass('active');

    $('#proposal-control-box').removeClass('show');
    $('#proposal-control-box').removeClass('active');
}

function getBase64Image(img) {
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    var dataURL = canvas.toDataURL("image/jpeg");
    return dataURL;
  }

function onDownload(element) {
    showSpinner();
    var proposalID = $(element).data('id');

    $.ajax({
        url : base_url + 'Opportunities/getProposalByID',
        type : 'post',
        data : {
            ID : proposalID
        },
        success : function(data) {
            var result = JSON.parse(data);

            if (result.success == false) {
                hiddenSpinner();
                toastr.error(LocalizationMessage('Download Proposal') + ' Error');
                logErrorActivity('Download Proposal', proposalID, 'tblProposals', result.message);
            }
            else {
                var wid = 800;
                var hei = 1131;
                var doc = new jsPDF('p', 'mm', 'a4');
                var pdfWidth = doc.internal.pageSize.width;
                var pdfHeight = doc.internal.pageSize.height;
                var topMargin = 0;
                var leftMargin = 0;
                var contentWidth = pdfWidth - 2 * leftMargin;
                var contentHeight = contentWidth / wid * hei;

                var data = result.proposal;
                var image = data.Image;
                var images = image.split(';');

                for (var page = 0; page < images.length - 1; page++) {                    
                    var temp = base_url + 'assets/images/proposals/' + images[page];
                    $('#temp_image').prop('src', temp);
                    var image_Data = getBase64Image(document.getElementById('temp_image'));
                    doc.addImage(image_Data, 'JPEG', leftMargin, topMargin, contentWidth, contentHeight);
                    if (page + 1 < images.length - 2) {
                        doc.addPage();

                    } else {
                        doc.save('proposal.pdf');
                        logSuccessActivity('Download Proposal', proposalID, 'tblProposals');
                        hiddenSpinner();
                    }
                }
            }
        },
        error : function() {
            hiddenSpinner();
        }
    });
}

$('#btnAddNewOpp').click(function() {
    $('#contactState').html(get_state_options_elements('Mexico'));
    $('#contactEquipmentCategory').html(get_equipment_category_element());

    $('#contactAssignTo').val($('#usernameInput').val());
    $("#NewOppModal").modal('show');
});

$('#btnNewOppSave').click(function() {
    if (!$('#AddNewOppForm').valid())
        return;

    $('#NewOppModal').modal('hide');    

    var leadType = $("#contactLeadType").val();
    var id = $('#edit-item-id').val();
    var user = $('#usernameInput').val();

    var source = $('#source').val();
    if (source == 'Other')
        source = 'MyOpp ' + ' ' +  user + ' Other ' + $('#otherSource').val();
    else
        source = 'MyOpp ' + user + ' ' + source;

    showSpinner();

    console.log(id);
    
    status = 'Opportunity';
    $.ajax({
        url : base_url + 'Opportunities/addNewOpportunity',
        type : 'post',
        data : {
            LeadID : 0,
            LeadType : leadType,
            Name : $('#contactName').val(),
            LastName : $('#contactLastName').val(),
            Phone : $('#contactPhone').intlTelInput('getNumber'),
            Email : $('#contactEmail').val(),
            CompanyName : $('#contactCompany').val(),            
            Country : $('#contactCountry').val(),
            State : $('#contactState').val(),
            City : $('#contactCity').val(),
            EqCategory : $('#contactEquipmentCategory').val(),
            EqMake : $('#contactMake').val(),
            EqModelCap : $('#contactModel').val(),
            MinYear : $('#contactMinYear').val(),
            MaxPrice : $("#contactMaxPrice").val(),
            Unit: $('#contactPriceUnit').val(),
            TimeFrame : $('#contactTimeFrame').val(),
            Rate : $('#contactRate').val(),
            AdditionalInfo : replaceNR2Br($('#contactAdditionalInfo').val()),
            LastSalesRep : $('#contactAssignTo').val(),
            Source : source
        },
        success : function(data) {
            hiddenSpinner();
            result = JSON.parse(data);

            if (result.success == false) {
                if (result.message == 'Phone number is an Active Opportunity ERROR')
                    toastr.error(LocalizationMessage(result.message));
                else
                    toastr.error(LocalizationMessage('Add New MyOpp') + ' Error');                
                logErrorActivity('Add New MyOpp', 0, '', result.message);
            }
            else {
                $('#contactName').val("");
                $('#contactLastName').val("");
                $('#contactPhone').val("");
                $('#contactEmail').val("");
                $('#contactCompany').val('');                
                $('#contactCity').val('');
                $('#contactEquipmentCategory').val('');
                $('#contactMake').val('');
                $('#contactModel').val('');
                $('#contactMinYear').val('');
                $("#contactMaxPrice").val('');
                $('#contactPriceUnit').val('USD');
                $('#contactTimeFrame').val('NOW');
                $('#contatRate').val('A+');
                $('#contactAdditionalInfo').val('');
                $('#contactAssignTo').val('');
                $('#source').val("Old Customer");
                $('#other-source-panel').hide();
                $('#otherSource').val('');
                toastr.success(LocalizationMessage('Add New MyOpp'));
                logSuccessActivity('Add New MyOpp', result.OppID, 'tblOpportunities');
                websocket.send(JSON.stringify({ 'msg': 'assign', 'poster': $('#usernameInput').val() }));
                refreshDatatable();
            }
        }
    });
});

function deleteSelectedPictureListConfirm() {
    $('#deleteProposalModal').modal('show');
}

function deleteProposals() {
    showSpinner();

    var list = getCheckedElementIdList();
    var ID = $('#edit-item-id').val(); 

    if (list.length > 0) {
        $.ajax({
            url : base_url + 'Opportunities/deleteProposals',
            type : 'post',
            data : {
                IDs : list,
                AssignmentID : ID
            },
            success : function(data) {
                var result = JSON.parse(data);
                hiddenSpinner();

                if (result.success == false) {
                    toastr.error(LocalizationMessage('Delete Proposals') + ': Error');
                    logErrorActivity('Delete Proposals', ID, 'tblAssignments', result.message);
                }
                else  {                    
                    logSuccessActivity('Delete Proposals', ID, 'tblAssignments');
                    onProposal(ID, "Proposal");
                }
            },
            error : function(){
                hiddenSpinner();
            }
        })
    }
}


function getAssignedOppWaitingContact() {
    $.ajax({
        url : base_url + 'Opportunities/getAssignedOppsWaitingContact',
        type : 'post',
        data : {
            SalesRep : $('#usernameInput').val()
        },
        success : function(res) {
            var data = JSON.parse(res);

            var total = data.noContact + data.today + data.expired;
            $('#WaitingContactCount').html(total);
            $('#NoContactCount').html(data.noContact);
            $('#TodayContactCount').html(data.today);
            $('#ExpiredContactCount').html(data.expired);
        }
    });
}

function getUpdatedOppsToday() {
    $.ajax({
        url : base_url + 'Opportunities/getUpdatedOpps',
        type : 'post',
        data : {
            SalesRep : $('#usernameInput').val()
        },
        success : function(res) {
            var data = JSON.parse(res);

            $('#UpdatedOppsCount').html(data.count);
        }
    });
}


function getOpenOpps() {
    $.ajax({
        url : base_url + 'Opportunities/getOpenAssignments',
        type : 'post',
        data : {
            SalesRep : $('#usernameInput').val()
        },
        success : function(res) {
            var data = JSON.parse(res);

            $('#NoContactOppCount').html(data.noContact);
            $('#ContactOppCount').html(data.contact);
            $('#ProposalOppCount').html(data.proposal);

            var total = data.noContact + data.contact + data.proposal;

            $('#OppOppsCount').html(total);
        }
    });
}


function getClosedOppsToday() {
    $.ajax({
        url : base_url + 'Opportunities/getClosedOpps',
        type : 'post',
        data : {
            SalesRep : $('#usernameInput').val()
        },
        success : function(res) {
            var data = JSON.parse(res);

            $('#ClosedOppsCount').html(data.count);
        }
    });
}

function refreshCustomerData() {
    var phone = $('#contactPhone').intlTelInput('getNumber');
    var customerData = getCustomerData(phone);

    if (customerData != null) {
        $('#contactName').val(customerData.Name);
        $('#contactLastName').val(customerData.LastName);
        $('#contactEmail').val(customerData.Email);
        $('#contactCompany').val(customerData.CompanyName);
        $('#contactCountry').val(customerData.Country);
        $('#contactState').val(customerData.State);
        $('#contactCity').val(customerData.City);        
    }
    else {
        $('#contactName').val('');
        $('#contactLastName').val('');
        $('#contactEmail').val('');
        $('#contactCompany').val('');
        $('#contactCountry').val('');
        $('#contactState').val('');
        $('#contactCity').val('');        
    }
}

function refreshCustomerDataOnEdit() {
    var phone = $('#contactPhoneEdit').intlTelInput('getNumber');
    var customerData = getCustomerData(phone);

    if (customerData != null) {
        $('#contactNameEdit').val(customerData.Name);
        $('#contactLastNameEdit').val(customerData.LastName);
        $('#contactEmailEdit').val(customerData.Email);
        $('#contactCompanyEdit').val(customerData.CompanyName);
        $('#contactCountryEdit').val(customerData.Country);
        $('#contactStateEdit').val(customerData.State);
        $('#contactCityEdit').val(customerData.City);        
    }
    else {
        $('#contactNameEdit').val('');
        $('#contactLastNameEdit').val('');
        $('#contactEmailEdit').val('');
        $('#contactCompanyEdit').val('');
        $('#contactCountryEdit').val('');
        $('#contactStateEdit').val('');
        $('#contactCityEdit').val('');        
    }
}



function myTimer() {
    var trs = $('#lead-management-table > tbody > tr');

    for (var i = 0; i < trs.length; i++) {        

        var DatesColumn = $(trs[i]).find('td')[2];   
        var ContactColumn = $(trs[i]).find('td')[3];       
        
        if (DatesColumn == null)
            break;

        var timeleft = '';

        if (statuses[i] == 'Open') {                
            var assignedDate = getLocalizationWord('Start') + ': ' + getSecondRemovedDateTime(assignedDates[i]) + '<br>';
            
            var today = new Date().toLocaleString("en-US", {timeZone: "America/Phoenix"});
            today = new Date(today);
            
            var assignedDay = new Date(assignedDates[i].replace(/\s/, 'T'));

            workingTimeStamp = today.getTime() - assignedDay.getTime(); 
            
            workingTime = getDateStringFromTimestamp(workingTimeStamp);

            DatesColumn.innerHTML =  assignedDate + workingTime;

            var contact = '';
            var timeleft = '';
            var tag_html = '';

            var tagText = tagArray[i];
            var tags = tagText.split('&');

            for (var j = 1; j < tags.length; j++) {
                var tag = tags[j];
                var tagInfo = tag.split(';');
                tag_html += "<span class='tag badge badge-" + tagInfo[1] + "'>" + tagInfo[0] + "</span>" + '<br>';
            }

            if (contactsArray[i] > 0) 
            {
                var contactDay = new Date(contactDateArray[i].replace(/\s/, 'T'));
                var today = new Date().toLocaleString("en-US", {timeZone: "America/Phoenix"});
                today = new Date(today);  
                today.setHours(0, 0, 0, 0);
                contactDay.setHours(0, 0, 0, 0);
                var contact = '';

                console.log(today.getTime());

                if (today.getTime() == contactDay.getTime()) {
                    contact = '<span class="badge badge-warning">' + getDatefromDateTime(contactDateArray[i]) + '</span>';
                }
                else if (contactDay < today){
                    contact = '<span class="badge badge-danger">' + getDatefromDateTime(contactDateArray[i]) + '</span>';
                }
                else
                    contact = getDatefromDateTime(contactDateArray[i]);

                contact = contactsArray[i] + '<br>' + getLocalizationWord("Next") + ": "+ contact;
            }                   
            else
                contact = contactsArray[i]
            
            
            today = new Date().toLocaleString("en-US", {timeZone: "America/Phoenix"});
            today = new Date(today);

            expiresDate = getLocalizationWord('Expires') + ': ' + getSecondRemovedDateTime(expirationTimes[i]) + '<br>';
            //var endDate = 'End: ' + full.ClosingDate;                
            
            var expirationDay = new Date(expirationTimes[i].replace(/\s/, 'T'));
            var contactDay = new Date(contactDateArray[i].replace(/\s/, 'T'));

            expriationTimestamp = expirationDay.getTime() - today.getTime(); 
            var expiration = getDateStringFromTimestamp(expriationTimestamp);

            if (expiration == '00:00:00' && ExpirationStatus == true)
            {
                showSpinner();
                $.ajax({
                    url : base_url + 'Opportunities/AutoCancelAssignments',
                    type : 'post',
                    success : function(data) {
                        hiddenSpinner();
                        result = JSON.parse(data);
                        if (result.success == false) {
                            toastr.error(result.message);                
                        }
                        else {
                            refreshDatatable();
                        }
                    },
                    error : function() {
                        hiddenSpinner();
                    }
                });
            }

            var expirationString = expiration;
                
            if (contactsArray[i] > 0) {
                today.setHours(0, 0, 0, 0);
                expirationDay.setHours(0, 0, 0, 0);
                if (today >=  expirationDay)
                    expirationString = '<span class="badge badge-warning">' + expiration + '</span>';
            }

            if (expriationTimestamp < 36000000)
                expirationString = '<span class="badge badge-danger">' + expiration + '</span>';

            timeleft = getLocalizationWord('Time Left') + ': ' + expirationString + '<br>';        
            
            if (ExpirationStatus == false)
                timeleft = '';

            ContactColumn.innerHTML = contact + '<br>' + timeleft + tag_html;
        }
              
    }
}

function onContactCountryChange(element) {
    var country = $(element).val();
    if (country != 'Other') {
        var options = get_state_options_elements(country);
        $('#contactState').html(options);
        $('#contactStateEdit').html(options);
    }
    else {
        $('#contactState').html('<option value=""></option>');
        $('#contactStateEdit').html('<option value=""></option>');
    }
}

$('#source').change(function() {
    console.log($('#source').val());

    var source = $('#source').val();

    if (source == 'Other'){
        $('#other-source-panel').show();
    }
    else {
        $('#other-source-panel').hide();
    }
});

function onToContactChecked() {
    if ($('#ToContactCheckBox').prop('checked'))
        $('#inputStatus').val('Open');    

    refreshDatatable();
}

$('#TagColor').change(function() {
    var tagColor = $('#TagColor').val();
});


function tagRemove(ID, TagNum) {
    console.log(ID + ' ' + TagNum);
    showSpinner();

    $.ajax({
        url : base_url + 'Opportunities/removeTag',
        type : 'post',
        data : {
            'AssignID' : ID,
            'TagNum' : TagNum
        },
        success : function(res) {
            var data = JSON.parse(res);
            hiddenSpinner();

            if (data.success == false) {                
                toastr.error(LocalizationMessage('Remove Tag') + ': Error');
                logErrorActivity('Remove Tag', ID, 'tblAssignments', result.message);                
            }
            else {                
                setTagContent(data.tag);
                logSuccessActivity('Remove Tag', ID, 'tblAssignments');
            }
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

    exportTableToExcel('MyOpp' + $('#usernameInput').val() + year + month + day);
});

function AddGoogleContact(ID) {    
    // var URL = encodeURI("https://contacts.google.com/new");
    // window.open(URL);    
    checkAuth(ID);
}

function exportTableToExcel( filename = '') {

    showSpinner();

    $.ajax({
        url: base_url + 'Opportunities/getMyOpportunityDataForExcel',
        type: 'POST',
        data:  {                
            status: $('#inputStatus').val(),
            stage : $('#inputStage').val(),
            leadType : $('#inputLeadType').val(),
            salesRep : $('#usernameInput').val(),
            minContactDate : $('#minStartDateInput').val(),
            maxContactDate : $('#maxStartDateInput').val(),
            ToContact : $('#ToContactCheckBox').prop('checked'),
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
                    if (j == 9)
                        cols[j] = getStyledPhoneNumber(cols[j]);
                    
                    if (cols[j] != null)
                        row.push('"'+cols[j].trim() + '"');
                    else
                        row.push('""')
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