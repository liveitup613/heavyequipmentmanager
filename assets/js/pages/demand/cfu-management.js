/*
@@ LEAD-MANAGEMENT.JS
@@ By Zheng
@@ 2020-03-09
*/

var managementTB;
var expirationTimes = [];
var rows = [];
var phone;

// History Data;
var contact_history = [];
var history_index = 0;
var salesRep_show = false;
var selectedSalesRep;

// column data
var columnData = [
    {
        "title": '',
        sortable: false,    
        "render": function (data, type, full, meta) {      
            
            var btnAttContact = '';
            var btnContact = '';
            var btnHistory = '';
            var btnClose = '';
            var btnOpp = '';
            var btnVerify = '';
            var btnInfo = '';

            if (full.Status != 'Opportunity' && full.Status != 'Closed')
                btnAttContact = '<button  class="btn btn-sm btn-default btn-action"  data-toggle="tooltip" data-placement="top" title="' + getLocalizationWord('Attempted Contact') +'" onclick="onAttemptedContact(' + full.ID + ', \''+ full.Status + '\')"><i class="icon-call-out"></i></button>';            
            if (full.Status != 'Opportunity' && full.Status != 'Closed')
                btnContact = '<button  class="btn btn-sm btn-default btn-action"  data-toggle="tooltip" data-placement="top" title="' + getLocalizationWord('Contact') + '" onclick="onContact(\'' + full.ID + '\', \'' + full.Status + '\', \'' + full.LastSalesRep + '\')"><i class="fa fa-phone"></i></button>';
            btnHistory = '<button  class="btn btn-sm btn-default btn-action"  data-toggle="tooltip" data-placement="top" title="' + getLocalizationWord('History') + '" onclick="onHistory(\'' + full.OpportunityID + '\', \'' + full.SurveyDate +'\')"><i class="icon-notebook"></i></button>';
            if (full.Status != 'Closed' && full.Status != 'Opportunity')
                btnClose = '<button  class="btn btn-sm btn-default btn-action"  data-toggle="tooltip" data-placement="top" title="' + getLocalizationWord('Close') + '" onclick="closeDirectly(\'' + full.ID + '\')"><i class="icon-close"></i></button>';            
            if (full.ShouldVerify == 'true' && isVerify == 'ON') 
                btnVerify = '<button  class="btn btn-sm btn-default btn-action"  data-toggle="tooltip" data-placement="top" title="' + getLocalizationWord('Verify') + '" onclick="onVerify(\'' + full.ID + '\')"><i class="icon-check"></i></button>';
            btnAttContactLog = '<button  class="btn btn-sm btn-default btn-action"  data-toggle="tooltip" data-placement="top" title="' + getLocalizationWord('Attempted Contact Info') + '" onclick="onContactInfo(\'' + full.ID + '\')"><i class="icon-list"></i></button>';
            if (full.SurveyDate != '0000-00-00 00:00:00' || full.VerifyDate != '0000-00-00 00:00:00')            
                btnInfo = '<button  class="btn btn-sm btn-default btn-action"  data-toggle="tooltip" data-placement="top" title="' + getLocalizationWord('Info') + '" onclick="onInfo(\'' + full.ID + '\')"><i class="icon-info"></i></button>';
            return  '<div class="row" style = "width : 120px;">' + 
                    btnAttContact + btnAttContactLog + btnContact + btnHistory + btnInfo + btnOpp + btnVerify + btnClose +
                    '</div>';
        }
    },
    {
        "title": getLocalizationWord("Opportunity Info"),
        sortable: false,
        "render": function (data, type, full, meta) {   
            var stage = getLocalizationWord('Stage') + ': ' + getLocalizationWord(full.Stage) + '<br>';
            var interest = getLocalizationWord('Interest') + ': ' + getLocalizationWord(full.NegativeInterestLevel) + '<br>';
            var start = getLocalizationWord('Start') + ': ' + getSecondRemovedDateTime(full.DateAdded) + '<br>';
            var end = getLocalizationWord('End') + ': ' + getSecondRemovedDateTime(full.OppClosingDate) + '<br>';
            var lastSalesRep = '';
            if (full.SurveyDate != '0000-00-00 00:00:00')
                lastSalesRep = full.LastSalesRep;

            return stage +  interest + start + end + lastSalesRep;                    
        }
    }, {
        "title": getLocalizationWord("Client Info"),
        sortable: false,
        "render": function (data, type, full, meta) {
            
            return  full.Name + ' ' + full.LastName + '<br>' + 
                    getStyledPhoneNumber(full.Phone) + '<br>' +
                    getCheckedValue(full.Email) + 
                    getCheckedValue(full.CompanyName);
        }
    }, {
        "title": getLocalizationWord("Location Info"),
        sortable: false,
        "render": function (data, type, full, meta) {

            return  getCheckedValue(full.City) + 
                    getCheckedValue(full.State) + 
                    getCheckedValue(full.Country);
        }
    }, {
        'title' : getLocalizationWord('Equipment Info'),
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
        'title' : getLocalizationWord('Deal Info'),
        sortable : false,
        render : function (data, type, full, meta) {
            return  getLocalizationWord(full.LeadType) + '<br>' + 
                    (full.MaxPrice == 0 ? "" : numberWithCommas(full.MaxPrice) + ' ' + full.Unit + '<br>') +
                    getLocalizationWord(full.TimeFrame) + '<br>' + 
                    full.Rate;
        }
    }, {
        "title": getLocalizationWord("Status"),
        sortable: false,
        render: function (data, type, full, meta) {
            
            if (full.Status == 'Scheduled')
            {
                var status = getBadgetForEachStatusOnCFU(full.Status) + '<br>';
                var today = new Date().toLocaleString("en-US", {timeZone: "America/Phoenix"});
                today = new Date(today);
                var contactDate = '';
                var toContactDate = getDatefromDateTime(full.ToContactDate);

                var today = formatDate(today);

                if (toContactDate == today)
                    contactDate = '<span class="badge badge-warning" style="margin-left: 0px;">' + today + '</span>';
                else if (toContactDate < today)
                    contactDate = '<span class="badge badge-danger" style="margin-left: 0px;">' + toContactDate + '</span>';
                else   
                    contactDate = toContactDate;
                return  status + contactDate;
                
            }

            if (full.Status == 'Closed')
            {
                return  getBadgetForEachStatusOnCFU(full.Status) + '<br>' + 
                    getSecondRemovedDateTime(full.ClosingDate) + '<br>';
            }

            return getBadgetForEachStatusOnCFU(full.Status);
        }
    }, {
        "title": getLocalizationWord("Att. Contacts"),
        sortable: false,
        render: function (data, type, full, meta) {
            
            if (full.AttContact > 0)
                var contacts = full.AttContact + '<br>' + getSecondRemovedDateTime(full.LastAttContact);
            else 
                var contacts = full.AttContact;

            return contacts;
        }
    }, {
        "title": getLocalizationWord("Survey"),
        sortable: false,
        render: function (data, type, full, meta) {
            if (full.SurveyDate != '0000-00-00 00:00:00') {
                var SurveySalesRep = '';
                if (full.SurveySalesRep == null)
                    SurveySalesRep = '';
                else
                    SurveySalesRep = getLocalizationWord(full.SurveySalesRep) + '<br>';      

                var SurveyOffer = '';
                    if (full.SurveyOffer == null)
                        SurveyOffer = '';
                    else
                        SurveyOffer = getLocalizationWord(full.SurveyOffer) + '<br>'; 
                
                var BoughtOutside = full.BoughtOutside;

                return  getSecondRemovedDateTime(full.SurveyDate) + '<br>' + 
                    getCheckedValue(full.SurveySup) + 
                    SurveySalesRep + 
                    SurveyOffer + 
                    (BoughtOutside == 'true' ? getLocalizationWord('Bought OutSide') + '<br>' + full.OutsideCompany + '<br>' : '');
            }
            return "";            
        }
    }, {
        'title' : getLocalizationWord('Verify'),
        sortable : false,
        render : function(data, type, full, meta) {
            if (full.VerifyDate != '0000-00-00 00:00:00')
            {
                return  getSecondRemovedDateTime(full.VerifyDate) + '<br>' + 
                    getCheckedValue(full.VerifySup)+ 
                    getCheckedValue(full.VerifyResult);
            }
            else if (full.ShouldVerify == 'true'){
                return "<span class='badge badge-danger'>" + getLocalizationWord('YES') + "</span>";
            }
            return '';
        }
    }
];



// set up  truck management table
$(function () {
    getActiveCFU();
    getScheduledCFU();
    getUpdatedCFU();
    
    $('.loading-box').css('width', $(window).width());
    $('.loading-box').css('height', $(window).height());

    $('.socket-loading-box').css('width', $(window).width());
    $('.socket-loading-box').css('height', $(window).height());

    $('.progress-box-layer').css('width', $(window).width());
    $('.progress-box-layer').css('height', $(window).height());

    $.ajax({
        url : base_url + 'Leads/updateStatus',
        type : 'post',
        success : function(data) {
            renderTB();
        }
    });

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

        if (msg == 'refresh_cfu') {
            getActiveCFU();
            getScheduledCFU();
            getUpdatedCFU();
            refreshDatatable();
        }
        if (msg == 'update_cfu') {
            getActiveCFU();
            getScheduledCFU();
            getUpdatedCFU();
            refreshDatatable(false);
        }
        else if (msg == 'save_contact') {
            refreshDatatable();            
            toastr.warning(LocalizationMessage("New Opportunity Added"));
        }
    }


    var today = new Date();
    $('#whenToContact').datepicker('setStartDate', today);       

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

    $('#minAucYearInput').datepicker().on('changeDate', function (selected) {
        var startDate = new Date(selected.date.valueOf());
        var endDate = new Date($('#maxAucYearInput').val());
        if (startDate.getTime() > endDate.getTime()) {

            $('#maxAucYearInput').datepicker('setDate', startDate);
        }
        $('#maxAucYearInput').datepicker('setStartDate', startDate);
    });   
    
    $('#phoneEdit').intlTelInput(phoneConfig);        
    $('#contactPhone').intlTelInput(phoneConfig);    
    
    document.getElementById("phoneEdit").addEventListener('countrychange', phoneCountryCodeChange);
    document.getElementById("contactPhone").addEventListener('countrychange', phoneCountryCodeChange);        
    
    $('#phoneEdit').mask('999 999 9999');
    $('#contactPhone').mask('999 999 9999');

    //Show Scheduled CFU Notification
    if (scheduledCount != 0) {
        if (lang == 'english')
            toastr.warning('You have ' + scheduledCount + ' scheduled follow ups waiting for contact');
        else
            toastr.warning('Tienes ' + scheduledCount + ' seguimientos agendados esperando contacto');
    }

    // Set Users

    $.ajax({
        url : base_url + 'User/getAllUserName',
        type : 'post',
        success : function(data) {
            result = JSON.parse(data);

            var users = "";
            var assigned = "<option value=''></option>";
            for (var i = 0; i < result.length ; i++) {
                users += '<option value="' + result[i].USERNAME +'">' + result[i].USERNAME + '</option>';
                if (result[i].SALESREP == 'ON')
                    assigned += '<option value="' + result[i].USERNAME +'">' + result[i].USERNAME + '</option>';
            }

            $('#users').html(users);
            $('#usersEdit').html(users);
            $('#contactAssignTo').html(assigned);
        }
    });    
});

function updateAssignTo() {    
    $('#contactAssignToPanel').show();
    var SurveySalesrep = $('#SurveySalesRep').val();
    var SurveyOffer = $('#SurveyOffer').val();
    var banned = false;
    var greatContact = false;

    if (SurveySalesrep == 'No Contact' || SurveySalesrep == 'Bad' || SurveyOffer == 'No Offer') {
        banned = true;
    }

    console.log(banned);
    console.log(selectedSalesRep);

    if (SurveySalesrep == 'Great' && SurveyOffer != 'No Offer')
    {
        var assigned = "<option value='" + selectedSalesRep + "'>aaa</option>" ;
        $('#contactAssignTo').html(assigned);
        $('#contactAssignTo').val(selectedSalesRep);
        $('#contactAssignToPanel').hide();
        return;
    }

    $.ajax({
        url : base_url + 'User/getAllUserName',
        type : 'post',
        success : function(res) {
            var result = JSON.parse(res);
            var assigned = "<option value=''></option>";
            for (var i = 0; i < result.length ; i++) {                
                if (result[i].SALESREP == 'ON'){                    
                    if (selectedSalesRep == result[i].USERNAME && banned == true)
                    {
                        console.log('removed');
                    }
                    else {
                        assigned += '<option value="' + result[i].USERNAME +'">' + result[i].USERNAME + '</option>';
                    }
                }
            }

            $('#contactAssignTo').html(assigned);
        }
    })
}

function renderTB() {
    managementTB = $('#lead-management-table').DataTable({
        'processing': true,
        'serverSide': true,
        'ajax': {
            url: base_url + 'CFU/getCFUData',
            type: 'POST',
            data: function (d) {                                
                d.minAucYear = $('#minAucYearInput').val();
                d.maxAucYear = $('#maxAucYearInput').val();
                d.status = $('#inputStatus').val();
                d.shouldVerify = $('#verifySwitch').prop('checked');
                d.verified = $('#inputVerified').val();
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
        //'order': [[0, 'asc']],
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


///////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////

function onAttemptedContact(id, status) {
    console.log('Attempted Contact Clicked');

    showSpinner();

    if (status == 'New')
        status = 'Pending';

    $.ajax({
        url : base_url + 'CFU/attemptContact',
        type : 'post',
        data : {
            ID : id,
            Status : status
        },
        success : function(data) {
            result = JSON.parse(data);
            hiddenSpinner();
            if (result.success == false) {
                toastr.error(LocalizationMessage('Attempted Contact') + ' Error');
                logErrorActivity('Attempted Contact', id, 'tblCfu', result.message);
            }
            else {
                toastr.success(LocalizationMessage('Attempted Contact'));
                logSuccessActivity('Attempted Contact', id, 'tblCfu');
                websocket.send(JSON.stringify({ 'msg': 'update_cfu', 'poster': $('#usernameInput').val() }));
                refreshDatatable(false);
            }
        }
    });
}

function onContactInfo(id) {
    console.log('Contact Info');    

    showSpinner();

    $.ajax({
        url : base_url + 'CFU/getCFUById',
        type : 'POST',
        data : {
            ID : id
        },
        success : function(data) {
            console.log(data);
            result = JSON.parse(data);          

            var attContacts = result.AttContactDates;
            var attContactsList = attContacts.split(';');
            var strHtml = '';

            for (var i = 0; i < attContactsList.length - 1; i++) {        
                var contact = attContactsList[i];
                var contactInfo = contact.split('&');
                strHtml += "<div class='contact'><div style='width : 30px;'>" + (i + 1) + ". </div><div style='margin-left : 20px; width : 200px;' >" + getLocalizationWord('Date') + ": " + contactInfo[0] + '</div><span style="margin-left : 15px;">' + getLocalizationWord('User') + ': ' + contactInfo[1] + '</span></div>';
            }

            $('#contact-modal-body').html(strHtml);
            
            hiddenSpinner();
            $('#contactInfoModal').modal('show');            
        }
    });
}

function onContact(ID, Status, LastSalesRep) {
    $('#edit-item-id').val(ID);
    $('#SurveyComm').val('');
    $('#SurveySalesRep').val('No Contact');
    $('#SurveyOffer').val('No Offer');
    $('#SurveyOpportunity').val('Yes');
    $('#SurveyOpportunitySchedule').val('Yes');
    $('#BoughtOutside').prop('checked', false);
    $('#OutsideCompany').hide();

    selectedSalesRep = LastSalesRep;

    if (Status != 'Scheduled')
        $('#ContactSurveyModal').modal('show');
    else
        $('#ContactSurveyOppModal').modal('show');
}

$('#btnSaveSurveyOpp').click(function() {
    var ID = $('#edit-item-id').val();
    $.ajax({
        url : base_url + 'CFU/getOppIDByCFU',
        type : 'post',
        data : {
            ID : ID
        },
        success : function (data) {
            var result = JSON.parse(data);
            hiddenSpinner();

            if (result.success == false) {
                toastr.error(result.message);
                return;
            }

            switch ($('#SurveyOpportunitySchedule').val()) {
                case 'Yes':
                    showOpportunityContact(result.OppID); 
                    break;
                case 'Later':  
                    showScheduleContact(ID);
                    break;
                case 'No':
                    onClose(ID);
                    break;
            }
        },
        error : function() {
            hiddenSpinner();
        }
    });
});

$('#btnSaveSurvey').click(function() {

    var ID = $('#edit-item-id').val();
    $.ajax({
        url : base_url + 'CFU/getOppIDByCFU',
        type : 'post',
        data : {
            ID : ID
        },
        success : function (data) {
            var result = JSON.parse(data);
            hiddenSpinner();

            if (result.success == false) {
                toastr.error(result.message);
                return;
            }

            switch ($('#SurveyOpportunity').val()) {
                case 'Yes':
                    showOpportunityContact(result.OppID); 
                    break;
                case 'Later':  
                    showScheduleContact(ID);
                    break;
                case 'No':
                    onClose(ID);
                    break;
            }
        },
        error : function() {
            hiddenSpinner();
        }
    });
});

function saveSurvey() {
    showSpinner();
    var ID = $('#edit-item-id').val();
    
    $.ajax({
        url : base_url + 'CFU/saveSurvey',
        type : 'post',
        data : {
            ID : ID,
            SurveySup : $('#usernameInput').val(),
            SurveySalesRep : $('#SurveySalesRep').val(),
            SurveyOffer : $('#SurveyOffer').val(),
            SurveyComm : replaceNR2Br($('#SurveyComm').val()),
            BoughtOutside: $('#BoughtOutside').prop('checked'),
            OutsideCompany : $('#OutsideCompany').val()
        },
        success : function (data) {
            var result = JSON.parse(data);
            hiddenSpinner();

            if (result.success == false) {
                toastr.error(LocalizationMessage('Survey CFU') + ' Error');
                logErrorActivity('Survey CFU', ID, 'tblCfu', result.message);
                return;
            }
            
            logSuccessActivity('Survey CFU', ID, 'tblCfu');
            websocket.send(JSON.stringify({ 'msg': 'save_survey', 'poster': $('#usernameInput').val() })); 
        },
        error : function() {
            hiddenSpinner();
        }
    });
}

function showOpportunityContact(ID) {

    console.log('Contact Clicked');

    $('#contactState').html(get_state_options_elements('Mexico'));
    $('#contactEquipmentCategory').html(get_translated_equipment_category_element());
    updateAssignTo();

    showSpinner();    

    console.log(ID);

    $.ajax({
        url : base_url + 'Opportunities/getOpportunityByID',
        type : 'post',
        data : {
            ID : ID
        },
        success : function(data) {
            console.log(data);
            result = JSON.parse(data);
            hiddenSpinner();

            result = result.data;
            $('#edit-lead-id').val(result.LeadID);            
            $('#contactName').val(result.Name);
            $('#contactLastName').val(result.LastName);
            $('#contactPhone').intlTelInput('setNumber', result.Phone);
            $('#contactEmail').val(result.Email);    
            $('#contactCompany').val(result.CompanyName);
            $('#contactCountry').val(result.Country);
            $('#contactState').val(result.State);
            $('#contactCity').val(result.City);
            $('#contactEquipmentCategory').val(result.EqCategory);
            $('#contactMake').val(result.EqMake);
            $('#contactModel').val(result.EqModelCap);
            $('#contactMinYear').val(result.MinYear);
            $("#contactMaxPrice").val(result.MaxPrice);
            $('#contactPriceUnit').val(result.Unit);
            $('#contactTimeFrame').val(result.TimeFrame);
            $('#contactRate').val(result.Rate);

            $('#contactOppModal').modal('show');
        },
        error : function() {
            hiddenSpinner();
        }
    });    
}

$('#btnContacOpptSave').click(function() {   

    if (!$('#ContactForm').valid())
        return;

    saveSurvey();

    $('#contactOppModal').modal('hide');    

    var user = $('#usernameInput').val();
    var leadType = $("#contactLeadType").val();
    var id = $('#edit-lead-id').val();
    var ID = $('#edit-item-id').val();
    var status = '';

    showSpinner();

    console.log(id);
   
    status = 'Opportunity';
    $.ajax({
        url : base_url + 'Opportunities/addNewOpportunity',
        type : 'post',
        data : {
            LeadID : id,
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
            Source : 'CFU ' + user,
            TimeFrame : $('#contactTimeFrame').val(),
            Rate : $('#contactRate').val(),
            AdditionalInfo : replaceNR2Br($('#contactAdditionalInfo').val()),
            LastSalesRep : $('#contactAssignTo').val()
        },
        success : function(data) {
            result = JSON.parse(data);

            if (result.success == false) {
                if (result.message == 'Phone number is an Active Opportunity ERROR')
                    toastr.error(result.message);
                else
                    toastr.error(LocalizationMessage('Add New Opportunity') + ' Error');
                                                
                logErrorActivity('Add New Opportunity', 0, '', result.message);
            }
            else {
                $('#contactCompany').val('');
                $('#contactCity').val('');
                $('#contactEquipmentCategory').val('');
                $('#contactMake').val('');
                $('#contactModel').val('');
                $('#contactMinYear').val('');
                $("#contactMaxPrice").val('');
                $('#contactPriceUnit').val('USD');
                $('#contactTimeFrame').val('NOW');
                $('#contactRate').val('A+');
                $('#contactAdditionalInfo').val('');
                $('#contactAssignTo').val('');
                
                toastr.success(LocalizationMessage('Add New Opportunity'));
                logSuccessActivity('Add New Opportunity', result.OppID, 'tblCfu');
                websocket.send(JSON.stringify({ 'msg': 'refresh_cfu', 'poster': $('#usernameInput').val() }));
                websocket.send(JSON.stringify({ 'msg': 'save_contact', 'poster': $('#usernameInput').val() })); 
                
                var OppID = result.OppID;

                var SurveySalesrep = $('#SurveySalesRep').val();
                var SurveyOffer = $('#SurveyOffer').val();

                if (SurveySalesrep == 'No Contact' || SurveySalesrep == 'Bad' || SurveyOffer == 'No Offer') {
                    $.ajax({
                        url : base_url + 'Opportunities/addBannedUser',
                        type : 'post',
                        data : {
                            OppID : OppID,
                            SalesRep : selectedSalesRep
                        },
                        success : function(data) {
                            var result = JSON.parse(data);

                            if (result.success == false) {
                                toastr.error(result.message);
                                return;
                            }            
                        }
                    });
                }
            }
        }
    });    

    $.ajax({
        url : base_url + 'CFU/updateStatusByID',
        type : 'post',
        data : {
            ID : ID,
            Status : status
        },
        success : function(data) {
            hiddenSpinner();
            result = JSON.parse(data);

            if (result.success == false) {
                toastr.error(result.message);
            }
            else {                
                websocket.send(JSON.stringify({ 'msg': 'refresh_cfu', 'poster': $('#usernameInput').val() }));
                refreshDatatable();
            }
        },
        error : function() {
            hiddenSpinner();
        }
    });
});

function showScheduleContact(ID) {
    $('#note').val('');
    $('#whenToContact').val('');
    $('#contactScheduleModal').modal('show');
}

$('#btnContactScheduleSave').click(function() {
    if (!$('#ContactScheduleForm').valid())
        return;

    saveSurvey();

    $('#contactScheduleModal').modal('hide');

    showSpinner();

    var ID = $('#edit-item-id').val();

    console.log(replaceNR2Br($('#note').val()));

    $.ajax({
        url : base_url + 'CFU/updateStatusByID',
        type : 'post',
        data : {
            ID : ID,
            Status : 'Scheduled',
            ToContactDate : $('#whenToContact').val(),
            Note : replaceNR2Br($('#note').val())
        },
        success : function(data) {
            hiddenSpinner();
            var result = JSON.parse(data);

            if (result.success == false) {
                toastr.error(LocalizationMessage('Schedule CFU') + ' Error');
                logErrorActivity('Schedule CFU', ID, 'tblCfu', result.message);
                return;
            }

            toastr.success(LocalizationMessage('Schedule CFU'));
            logSuccessActivity('Schedule CFU', ID, 'tblCfu');
            websocket.send(JSON.stringify({ 'msg': 'refresh_cfu', 'poster': $('#usernameInput').val() }));
            refreshDatatable();
        }
    });
});

function closeDirectly(ID) {
    showSpinner();

    $.ajax({
        url : base_url + 'CFU/updateStatusByID',
        type : 'post',
        data : {
            ID : ID,
            Status : 'Closed',
            Uesr : $('#usernameInput').val()
        },
        success : function(data) {
            hiddenSpinner();
            var result = JSON.parse(data);

            if (result.success == false) {
                toastr.error(LocalizationMessage('Close CFU') + ' Error');
                logErrorActivity('Close CFU', ID, 'tblCfu', result.message);
                return;
            }

            toastr.success(LocalizationMessage('Close CFU'));
            logSuccessActivity('Close CFU', ID, 'tblCfu');
            websocket.send(JSON.stringify({ 'msg': 'refresh_cfu', 'poster': $('#usernameInput').val() }));
            refreshDatatable();
        }
    });
}

function onClose(ID) {
    saveSurvey();
    closeDirectly(ID);
}

function onVerifySwitch() {
    if ($('#verifySwitch').prop('checked')) {
        $('#inputStatus').val('Closed');
    }
    else {
        $('#inputStatus').val('Open');        
    }

    refreshDatatable();
}

function onVerify(ID) {
    $('#edit-item-id').val(ID);
    $('#VerifySalesRep').val('No Contact');
    $('#VerifyOffer').val('No Offer');
    $('#VerifyComm').val('');

    $('#VerifyModal').modal('show'); 
}

$('#btnSaveVerify').click(function() {
    showSpinner();

    var ID = $('#edit-item-id').val();
    $.ajax({
        url : base_url + 'CFU/verify',
        type : 'post',
        data : {
            ID : ID,
            VerifySup : $('#usernameInput').val(),
            VerifySales : $('#VerifySalesRep').val(),
            VerifyOffers : $('#VerifyOffer').val(),
            VerifyComm : replaceNR2Br($('#VerifyComm').val())
        },
        success : function(data) {
            hiddenSpinner();
            var result = JSON.parse(data);

            if (result.success == false) {
                toastr.error(LocalizationMessage('Verify CFU') + ' Error');
                logErrorActivity('Verify CFU', ID, 'tblCfu', result.message);
                return;
            }

            toastr.success(LocalizationMessage('Verify CFU'));
            logSuccessActivity('Verify CFU', ID, 'tblCfu');
            websocket.send(JSON.stringify({ 'msg': 'refresh_cfu', 'poster': $('#usernameInput').val() }));
            refreshDatatable();
        },
        error : function() {
            hiddenSpinner();            
        }
    })
});

function onInfo(ID) {
    showSpinner();

    $.ajax({
        url : base_url + 'CFU/GetSurveyVerifyComment',
        type : 'post',
        data : {
            ID : ID
        },
        success : function(data) {
            hiddenSpinner();
            result = JSON.parse(data);

            $('#SurveyComment').html(restoreSpecificCharacter(result.SurveyComm));
            $('#VerifyComment').html(restoreSpecificCharacter(result.VerifyComm));
            $('#InfoModal').modal('show');
        },
        error: function() {
            hiddenSpinner();
        }
    });
}

function onHistory(ID, SurveyDate) {
    showSpinner();
    if (SurveyDate != '0000-00-00 00:00:00')
        salesRep_show = true;
    else 
        salesRep_show = false;

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
                toastr.error(LocalizationMessage('No History Data'));
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
        "NoContact" : "No Contact"
    };
    
    $('#historyStatus').html(getLocalizationWord(contact_history[index]['Status']));
    $('#historyStage').html(getLocalizationWord(contact_history[index]['Stage']));
    $('#historyAssignedDate').html(contact_history[index]['AssignDate']);
    $('#historyClosingDate').html(contact_history[index]['ClosingDate']);
    if (salesRep_show == true)
    {
        $('#historySalesRep').html(contact_history[index]['SalesRep']);
        $('#historyAssignedBy').html(contact_history[index]['AssignedBy']);
    }
    else 
    {
        $('#historySalesRep').html(getLocalizationWord("Unknown"));
        $('#historyAssignedBy').html(getLocalizationWord("Unknown"));
    }
    
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

function getActiveCFU() {
    $.ajax({
        url : base_url + 'CFU/getActiveCFUStatus',
        type : 'post',
        success : function (res) {
            var data = JSON.parse(res);

            var total = data.new + data.pending + data.scheduled;
            $('#ActiveCFUCount').html(total);
            $('#NewCFUCount').html(data.new);
            $('#PendingCFUCount').html(data.pending);
            $('#ScheduledCount').html(data.scheduled);
        }
    });
}

function getScheduledCFU() {
    $.ajax({
        url : base_url + 'CFU/getScheduledCFUStatus',
        type : 'post',
        success : function (res) {
            var data = JSON.parse(res);

            var total = data.today + data.expired;
            $('#ScheduledCFUCount').html(total);
            $('#ScheduledForTodayCount').html(data.today);
            $('#ScheduledExpiredCount').html(data.expired);
        }
    });
}

function getUpdatedCFU() {
    $.ajax({
        url : base_url + 'CFU/getUpdatedCFUStatus',
        type : 'post',
        success : function (res) {
            var data = JSON.parse(res);

            var total = data.scheduled + data.opportunity + data.closed;
            $('#UpdatedCFUCount').html(total);
            $('#ScheduledCFUTodayCount').html(data.scheduled);
            $('#OpportunityCFUTodayCount').html(data.opportunity);
            $('#ClosedCFUTodayCount').html(data.closed);
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

$('#excelbtn').click(function () {
    var d = new Date();

    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    exportTableToExcel('CFU' + year + month + day);
});

function exportTableToExcel( filename = '') {

    showSpinner();

    $.ajax({
        url: base_url + 'CFU/getCFUDataForExcel',
        type: 'POST',
        data:  {                
            minAucYear : $('#minAucYearInput').val(),
            maxAucYear : $('#maxAucYearInput').val(),
            status : $('#inputStatus').val(),
            shouldVerify : $('#verifySwitch').prop('checked'),
            verified : $('#inputVerified').val(),
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
                    if (j == 5)
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

function boughtOutsideClicked() {
    if ($('#BoughtOutside').prop('checked') == true)
        $('#OutsideCompany').show();    
    else 
        $('#OutsideCompany').hide();
}

function logSuccessActivity(Activity, ID, Table) {
    $.ajax({
        url : base_url + 'Activity/addActivity',
        type : 'post',
        data : {
            Activity : Activity,
            ObjectiveTable : Table,
            ObjectiveID : ID,
            Webpage : 'Demand.CFU',
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
            Webpage : 'Demand.CFU',
            Status : 'Error',
            Error : ErrorMsg
        },
        success : function() {
            websocket.send(JSON.stringify({ 'msg': 'activity', 'poster': $('#usernameInput').val() }));
        }
    });
}