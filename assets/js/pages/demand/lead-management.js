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
var rows = [];
var phone;

// column data
var columnData = [
    {
        "title": "",
        sortable: false,    
        "render": function (data, type, full, meta) {           

            if (full.Status == 'New')
            {
                return '<button  class="btn btn-sm btn-default"  data-toggle="tooltip" data-placement="top" title="' + getLocalizationWord('Attempted Contact') +'" onclick="onAttemptedContact(' + full.ID + ')"><i class="icon-call-out"></i></button>&nbsp;' +
                '<button  class="btn btn-sm btn-default"  data-toggle="tooltip" data-placement="top" title="' + getLocalizationWord('Contact') + '" onclick="onContact(\'' + full.ID + '\')"><i class="fa fa-phone"></i></button>&nbsp;' +
                '<button  class="btn btn-sm btn-default"  data-toggle="tooltip" data-placement="top" title="' + getLocalizationWord('Edit') + '" onclick="onEdit(' + full.ID + ')"><i class="icon-note"></i></button><br>' +
                '<button  class="btn btn-sm btn-default bottom-button"  data-toggle="tooltip" data-placement="top" title="' + getLocalizationWord('Attempted Contact Info') + '" onclick="onContactInfo(' + full.ID + ')"><i class="icon-notebook"></i></button>&nbsp;' + 
                '<button  class="btn btn-sm btn-default bottom-button"  data-toggle="tooltip" data-placement="top" title="' + getLocalizationWord('Delete') + '" onclick="onDelete(' + full.ID + ')"><i class="icon-trash"></i></button>&nbsp;';
            }
            else if (full.Status == 'Pending') {
                return '<button  class="btn btn-sm btn-default"  data-toggle="tooltip" data-placement="top" title="' + getLocalizationWord('Attempted Contact') +'" onclick="onAttemptedContact(' + full.ID + ')"><i class="icon-call-out"></i></button>&nbsp;' +
                '<button  class="btn btn-sm btn-default"  data-toggle="tooltip" data-placement="top" title="' + getLocalizationWord('Contact') + '" onclick="onContact(\'' + full.ID + '\')"><i class="fa fa-phone"></i></button>&nbsp;' +
                '<button  class="btn btn-sm btn-default"  data-toggle="tooltip" data-placement="top" title="' + getLocalizationWord('Edit') + '" onclick="onEdit(' + full.ID + ')"><i class="icon-note"></i></button><br>' +
                '<button  class="btn btn-sm btn-default bottom-button"  data-toggle="tooltip" data-placement="top" title="' + getLocalizationWord('Attempted Contact Info') + '" onclick="onContactInfo(' + full.ID + ')"><i class="icon-notebook"></i></button>&nbsp;';
            }
            
            return '<button  class="btn btn-sm btn-default bottom-button"  data-toggle="tooltip" data-placement="top" title="' + getLocalizationWord('Attempted Contact Info') + '" onclick="onContactInfo(' + full.ID + ')"><i class="icon-notebook"></i></button>&nbsp;';
        }
    },
    {
        "title": getLocalizationWord("Status"),
        sortable: false,
        "render": function (data, type, full, meta) {            

            return getBadgetForEachStatusOnLead(full.Status);
        }
    },{
        "title": getLocalizationWord("Client Info"),
        sortable: false,
        "render": function (data, type, full, meta) {
            var whatsapp_link = '';
            if(full.Phone) {
                whatsapp_link = '<a class="contact-link" href="javascript:void(0);" onclick="SendViaWhatsapp(\'' + full.Phone + '\');"><img class="publish-icon" src="/assets/images/publish_icon/WhatsApp_icon.png"></a>';
            }
            return full.Name + ' ' + full.LastName + '<br>' + getStyledPhoneNumber(full.Phone) + whatsapp_link + '<br>' + getCheckedValue(full.Email, 'mail') + getCheckedValue(full.CompanyName);
        }
    }, {
        "title": getLocalizationWord("Date"),
        sortable: false,
        render: function (data, type, full, meta) {            
            
            var closedBy = full.ClosedBy;
            var expriationDate = full.ExpirationDate;
            if (full.Status != 'New' && full.Status != 'Pending') {
                expriationDate = full.ClosingDate;
            } 

            var row_index = rows.indexOf(meta.row);
            if (row_index < 0) {                
                expirationTimes.push(expriationDate);    
                startTimes.push(full.DateAdded);
                closedByUsers.push(full.ClosedBy);
                statuses.push(full.Status);
                rows.push(meta.row);
            }
            else {
                expirationTimes[row_index] = expriationDate;
                startTimes[row_index] = full.DateAdded;
                closedByUsers[row_index] = full.ClosedBy;
                statuses[row_index] = full.Status;
            }

            if (full.Status != 'New' && full.Status != 'Pending'){
                return getLocalizationWord('Start') + ': ' + getSecondRemovedDateTime(full.DateAdded) + '<br>' + getLocalizationWord('Closed') + ': ' + getSecondRemovedDateTime(expriationDate) + '<br>' + closedBy;
            }            
            
            var today = new Date().toLocaleString("en-US", {timeZone: "America/Phoenix"});
            today = new Date(today);
            
            var expirationDay = new Date(expriationDate.replace(/\s/, 'T'));
            //alert(full.ExpirationDate);
            expriationTimestamp = expirationDay.getTime() - today.getTime(); 

            var remainingTime = getDateStringFromTimestamp(expriationTimestamp)

            if (expriationTimestamp < 36000000)
                remainingTime = '<span class="badge badge-danger">' + remainingTime + '</span>';
            
            
            return getLocalizationWord('Start') + ': ' + getSecondRemovedDateTime(full.DateAdded) + '<br>' + 
                    remainingTime + '<br>' + 
                    getLocalizationWord('Expires') + ': ' + getSecondRemovedDateTime(expriationDate) + '<br>' + 
                    closedBy;
        }
    }, {
        "title": getLocalizationWord("Attempted Contact"),
        sortable: false,
        render: function (data, type, full, meta) {
            
            if (full.AttContact > 0)
                var contacts = full.AttContact + '<br>' + getSecondRemovedDateTime(full.LastAttContact);
            else 
                var contacts = full.AttContact;

            return contacts;
        }
    },  {
        "title": getLocalizationWord("Location Info"),
        sortable: false,
        render: function (data, type, full, meta) {
            return  getCheckedValue(full.City) + 
                    getCheckedValue(full.State)+ 
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
        "title": getLocalizationWord("Source"),
        sortable: false,
        render: function (data, type, full, meta) {
            return getLocalizationWord(full.Source);
        }
    }
];



// set up  truck management table
$(function () {

    getActiveLead();
    getUpdatedLead();
    getTodayAddedLead();

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

        if (msg == 'new_lead') {
            refreshDatatable();
            getActiveLead();
            getTodayAddedLead();
        }
        else if (msg == 'edit_lead') {
            refreshDatatable();            
        }
        else if (msg == 'attemped_contact') {
            refreshDatatable();
        }
        else if (msg == 'save_contact') {
            refreshDatatable();
            getActiveLead();
            getUpdatedLead();
        }
        else if (msg == 'delete_lead') {
            refreshDatatable();
            getActiveLead();
            getUpdatedLead();
        }
        else if (msg == 'close_lead') {
            refreshDatatable();
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

    $('#Phone').intlTelInput(phoneConfig);        
    $('#PhoneEdit').intlTelInput(phoneConfig);        
    $('#contactPhone').intlTelInput(phoneConfig);        

    document.getElementById("Phone").addEventListener('countrychange', phoneCountryCodeChange);
    document.getElementById("PhoneEdit").addEventListener('countrychange', phoneCountryCodeChange);
    document.getElementById("contactPhone").addEventListener('countrychange', phoneCountryCodeChange);
    
    $('#Phone').mask('999 999 9999');
    $('#PhoneEdit').mask('999 999 9999');
    $('#contactPhone').mask('999 999 9999');

    $('#State').html(get_state_options_elements('Mexico'));
    $('#EquipmentCategory').html(get_translated_equipment_category_element());

    $('#StateEdit').html(get_state_options_elements('Mexico'));
    $('#EquipmentCategoryEdit').html(get_translated_equipment_category_element());

    $('#contactState').html(get_state_options_elements('Mexico'));
    $('#contactEquipmentCategory').html(get_translated_equipment_category_element());

    $('#minStartDateInput').datepicker().on('changeDate', function (selected) {
        var startDate = new Date(selected.date.valueOf());
        var endDate = new Date($('#maxStartDateInput').val());
        if (startDate.getTime() > endDate.getTime()) {

            $('#maxStartDateInput').datepicker('setDate', startDate);
        }
        $('#maxStartDateInput').datepicker('setStartDate', startDate);
    });  

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


function renderTB() {
    managementTB = $('#lead-management-table').DataTable({
        'processing': true,
        'serverSide': true,
        'ajax': {
            url: base_url + 'Leads/getLeadData',
            type: 'POST',
            data: function (d) {                
                d.status = $('#inputStatus').val();
                d.minStart = $('#minStartDateInput').val();
                d.maxStart = $('#maxStartDateInput').val();
                d.rate = $('#inputRate').val();
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

$('#btnAddLead').click(function(event) {
    if (!$('#AddNewLeadForm').valid())
        return;  

    $('#AddNewLead').modal('hide');
    showSpinner();
    console.log('Add New Lead');

    var source = $('#source').val();
    console.log($('#phone').intlTelInput('getNumber'));

    if (source == 'User')
        source = source + ': ' + $('#users').val();
    else if (source == 'Other')
        source = source + ': ' + $('#otherSource').val();

    $.ajax({
        url : base_url + 'Leads/AddNewLead',
        type : 'post',
        data : {
            LeadType : $('#LeadType').val(),
            Name : $('#Name').val(),
            LastName : $('#LastName').val(),
            Phone : $('#Phone').intlTelInput('getNumber'),            
            Email : $('#Email').val(),
            CompanyName : $('#Company').val(),
            Country : $('#Country').val(),
            State : $('#State').val(),
            City : $('#City').val(),
            EqCategory : $('#EquipmentCategory').val(),
            EqMake : $('#Make').val(),
            EqModelCap : $('#Model').val(),
            MinYear : $('#MinYear').val(),
            MaxPrice : $("#MaxPrice").val(),
            Unit: $('#PriceUnit').val(),
            TimeFrame : $('#TimeFrame').val(),
            Rate: $('#Rate').val(),
            AdditionalInfo : replaceNR2Br($('#AdditionalInfo').val()),
            Source : source,
        },
        success : function(data) {
            result = JSON.parse(data);
            hiddenSpinner();

            if (result.success == false) {         
                if (result.message == 'Phone number is an Active Opportunity ERROR')       
                    toastr.error(LocalizationMessage('Phone number is an Active Opportunity ERROR'));
                else
                    toastr.error(LocalizationMessage('Add New Lead') + ' Error');
                logErrorActivity('Add New Lead', 0, 'tblLeads', result.message);
            } 
            else {
                $('#LeadType').val('Buying');
                $('#Name').val('');
                $('#LastName').val('');
                $('#Phone').val('');
                $('#Email').val('');
                $('#Company').val('');
                $('#source').val('Call');
                $('#State').val('');
                $('#City').val('');
                $('#EquipmentCategory').val('');
                $('#tMake').val('');
                $('#Model').val('');
                $('#MinYear').val('');
                $("#MaxPrice").val('');
                $('#PriceUnit').val('USD');
                $('#TimeFrame').val('NOW');
                $('#Rate').val('A+');
                $('#AdditionalInfo').val('');
                $('#usourceEdit').hide();
                $('#other-source-panel').hide();
                websocket.send(JSON.stringify({ 'msg': 'new_lead', 'poster': $('#usernameInput').val() }));
                toastr.success(LocalizationMessage('Add New Lead'));
                logSuccessActivity('Add New Lead', result.ID, 'tblLeads');
                refreshDatatable();
            }
        }
    });
});

$('#btnUpdateLead').click(function() {
    console.log('Edit Lead');

    if (!$('#EditLeadForm').valid())
        return;  

    $('#editLeadModal').modal('hide');
    showSpinner();
    $id = $('#edit-item-id').val();

    var source = $('#sourceEdit').val();

    if (source == 'User')
        source = source + ': ' + $('#usersEdit').val();
    else if (source == 'Other')
        source = source + ': ' + $('#otherSourceEdit').val();

    $.ajax({
        url : base_url + 'Leads/UpdateLead',
        type : 'post',
        data : {
            ID : $id,
            LeadType : $('#LeadTypeEdit').val(),
            Name : $('#NameEdit').val(),
            LastName : $('#LastNameEdit').val(),
            Phone : $('#PhoneEdit').intlTelInput('getNumber'),
            Email : $('#EmailEdit').val(),
            CompanyName : $('#CompanyEdit').val(),
            Country : $('#CountryEdit').val(),
            State : $('#StateEdit').val(),
            City : $('#CityEdit').val(),
            EqCategory : $('#EquipmentCategoryEdit').val(),
            EqMake : $('#MakeEdit').val(),
            EqModelCap : $('#ModelEdit').val(),
            MinYear : $('#MinYearEdit').val(),
            MaxPrice : $("#MaxPriceEdit").val(),
            Unit: $('#PriceUnitEdit').val(),
            TimeFrame : $('#TimeFrameEdit').val(),
            Rate : $('#RateEdit').val(),
            AdditionalInfo : replaceNR2Br($('#AdditionalInfoEdit').val()),
            Source : source
        },
        success : function(data) {
            result = JSON.parse(data);
            hiddenSpinner();

            if (result.success == false) {                
                toastr.error(LocalizationMessage('Edit Lead') + ' Error');
                logErrorActivity('Edit Lead', $id, 'tblLeads', result.message);
            }
            else {
                $('#LeadTypeEdit').val("Buying");
                $('#NameEdit').val('');
                $('#LastNameEdit').val('');
                $('#PhoneEdit').val('');
                $('#EmailEdit').val('');
                $('#CompanyEdit').val('');
                $('#sourceEdit').val('Call');
                $('#StateEdit').val('');
                $('#CityEdit').val('');
                $('#EquipmentCategoryEdit').val('');
                $('#tMakeEdit').val('');
                $('#ModelEdit').val('');
                $('#MinYearEdit').val('');
                $("#MaxPriceEdit").val('');
                $('#PriceUnitEdit').val('USD');
                $('#TimeFrameEdit').val('NOW');
                $("#RateEdit").val('A+');
                $('#AdditionalInfoEdit').val('');
                toastr.success(LocalizationMessage('Edit Lead'));
                logSuccessActivity('Edit Lead', $id, 'tblLeads');
                websocket.send(JSON.stringify({ 'msg': 'edit_lead', 'poster': $('#usernameInput').val() }));
                refreshDatatable();
            }
        }
    })
});

$('#source').change(function() {
    console.log($('#source').val());

    var source = $('#source').val();

    if (source == 'User'){
        $('#user-panel').show();
        $('#other-source-panel').hide();
    }
    else if (source == 'Other'){
        $('#other-source-panel').show();
        $('#user-panel').hide();
    }
    else {
        $('#other-source-panel').hide();
        $('#user-panel').hide();
    }
})

$('#sourceEdit').change(function() {
    console.log($('#sourceEdit').val());

    var source = $('#sourceEdit').val();

    if (source == 'User'){
        $('#user-panel-edit').show();
        $('#other-source-panel-edit').hide();
    }
    else if (source == 'Other'){
        $('#other-source-panel-edit').show();
        $('#user-panel-edit').hide();
    }
    else {
        $('#other-source-panel-edit').hide();
        $('#user-panel-edit').hide();
    }
});

$('#btnContactSave').click(function() {   

    if (!$('#ContactForm').valid())
        return;

    $('#contactModal').modal('hide');    

    var leadType = $("#contactLeadType").val();
    var id = $('#edit-item-id').val();
    var status = '';
    showSpinner();

    console.log(id);

    if (leadType == 'Info' || leadType == 'No Lead') {
        status = leadType;  
        $.ajax({
            url : base_url + 'Leads/updateStatusByID',
            type : 'post',
            async: false,
            cache: false,
            timeout: 30000,
            data : {
                ID : id,
                Status : status
            },
            success : function(data) {
                hiddenSpinner();
                result = JSON.parse(data);
    
                if (result.success == false) {
                    toastr.error(LocalizationMessage('Lead Contact') + ' Error');
                    logErrorActivity('Lead Contact', id, 'tblLeads', resutl.message);
                }
                else {
                    toastr.success(LocalizationMessage('Lead Contact'));
                    logSuccessActivity('Lead Contact', id, 'tblLeads');
                    websocket.send(JSON.stringify({ 'msg': 'save_contact', 'poster': $('#usernameInput').val() }));
                    refreshDatatable();
                }
            },
            error : function() {
                hiddenSpinner();
            }
        });   
        
        $.ajax({
            url : base_url + 'Leads/setClosedUser',
            type : 'post',
            data : {
                ID : id,
                User : $('#usernameInput').val()
            }
        });
        console.log(status);
    }
    else {
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
                Source : $('#contactSource').val(),
                TimeFrame : $('#contactTimeFrame').val(),
                Rate : $('#contactRate').val(),
                AdditionalInfo : replaceNR2Br($('#contactAdditionalInfo').val()),
                LastSalesRep : $('#contactAssignTo').val()
            },
            success : function(data) {
                result = JSON.parse(data);
                hiddenSpinner();

                if (result.success == false) {
                    if (result.message == 'Phone number is an Active Opportunity ERROR') {
                        $.ajax({
                            url : base_url + 'Leads/updateStatusByID',
                            type : 'post',
                            data : {
                                ID: id,
                                Status: 'Closed'
                            }
                        });

                        $.ajax({
                            url : base_url + 'Leads/setClosedUser',
                            type : 'post',
                            data : {
                                ID: id,
                                User: 'System'
                            }
                        });

                        toastr.error(LocalizationMessage(result.message));
                        websocket.send(JSON.stringify({ 'msg': 'close_lead', 'poster': $('#usernameInput').val() }));
                    }
                    else
                        toastr.error(LocalizationMessage('Lead Contact') + ' Error');
                    logErrorActivity(LocalizationMessage('Lead Contact'), id, 'tblLeads', result.message);
                }
                else {                    
                    $('#contactName').val("");
                    $('#contactLastName').val("");
                    $('#contactPhone').val("");
                    $('#contactEmail').val("");
                    $('#contactCompany').val("");
                    $('#contactCity').val('');
                    $('#contactState').val('');
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
                    toastr.success(LocalizationMessage('Lead Contact'));                    
                    logSuccessActivity('Lead Contact', id, 'tblLeads');
                    websocket.send(JSON.stringify({ 'msg': 'save_contact', 'poster': $('#usernameInput').val() }));
                    
                    showSpinner();
                    $.ajax({
                        url : base_url + 'Leads/updateStatusByID',
                        type : 'post',
                        async: false,
                        timeout : 30000,
                        cache: false,
                        data : {
                            ID : id,
                            Status : status
                        },
                        success : function(data) {
                            hiddenSpinner();
                            result = JSON.parse(data);
                
                            if (result.success == false) {
                                toastr.error(result.message);
                            }
                        },
                        error : function() {
                            hiddenSpinner();
                        }
                    });

                    $.ajax({
                        url : base_url + 'Leads/setClosedUser',
                        type : 'post',
                        data : {
                            ID : id,
                            User : $('#usernameInput').val()
                        }
                    });
                    refreshDatatable();
                }
            }
        });
    }  
    
});

function onAttemptedContact(id) {
    console.log('Attempted Contact Clicked');

    showSpinner();

    $.ajax({
        url : base_url + 'Leads/attemptContact',
        type : 'post',
        data : {
            ID : id
        },
        success : function(data) {
            result = JSON.parse(data);
            hiddenSpinner();
            if (result.success == false) {                
                toastr.error(LocalizationMessage("Lead Attempted Contact") + " Error");
                logErrorActivity('Lead Attempted Contact', id, 'tblLeads', result.message);
            }
            else {
                toastr.success(LocalizationMessage('Lead Attempted Contact'));
                logSuccessActivity('Lead Attempted Contact', id, 'tblLeads');
                websocket.send(JSON.stringify({ 'msg': 'attempt_lead', 'poster': $('#usernameInput').val() }));
                refreshDatatable();
            }
        }
    })
}

function onContact(id) {
    console.log('Contact Clicked');    

    showSpinner();

    $('#edit-item-id').val(id);

    console.log(id);

    $.ajax({
        url : base_url + 'Leads/getLeadById',
        type : 'post',
        data : {
            ID : id
        },
        success : function(data) {
            console.log(data);
            result = JSON.parse(data);
            hiddenSpinner();

            $('#contactLeadType').val(result.LeadType);
            $('#contactName').val(result.Name);
            $('#contactLastName').val(result.LastName);
            $('#contactPhone').intlTelInput('setNumber', result.Phone);
            $('#contactEmail').val(result.Email);
            $('#contactCountry').val(result.Country);
            $('#contactCompany').val(result.CompanyName);
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
            $('#contactSource').val(result.Source);
            $('#contactAdditionalInfo').val(result.AdditionalInfo);
            $('#contactModal').modal('show');
        },
        error : function() {
            hiddenSpinner();
        }
    });    
}

function onEdit(id) {
    console.log('Edit Clicked');       

    showSpinner();
    
    $.ajax({
        url : base_url + 'Leads/getLeadById',
        type : 'POST',
        data : {
            ID : id
        },
        success : function(data) {
            console.log(data);
            result = JSON.parse(data);

            $('#other-source-panel-edit').hide();
            $('#user-panel-edit').hide();

            var source = result.Source;

            if (source.includes('User: ')) {
                $('#sourceEdit').val('User');
                users = source.split(': ');
                $('#usersEdit').val(users[1]);
                $('#user-panel-edit').show();
            }
            else if (source.includes('Other: ')) {
                $('#sourcEdit').val('Other');
                otherSouce = source.split(': ');
                $('#otherSourceEdit').val(otherSouce[1]);
                $('#other-source-panel-edit').show();
            }
            else {
                $('#sourceEdit').val(source);
            }

            $('#edit-item-id').val(id);
            $('#LeadTypeEdit').val(result.LeadType);
            $('#NameEdit').val(result.Name);
            $('#LastNameEdit').val(result.LastName);
            $('#PhoneEdit').intlTelInput('setNumber', result.Phone);
            $('#EmailEdit').val(result.Email);    
            $('#CompanyEdit').val(result.CompanyName);
            $('#CountryEdit').val(result.Country);
            $('#StateEdit').val(result.State);
            $('#CityEdit').val(result.City);
            $('#EquipmentCategoryEdit').val(result.EqCategory);
            $('#MakeEdit').val(result.EqMake);
            $('#ModelEdit').val(result.EqModelCap);
            $('#MinYearEdit').val(result.MinYear);
            $("#MaxPriceEdit").val(result.MaxPrice);
            $("#PriceUnitEdit").val(result.Unit);
            $('#TimeFrameEdit').val(result.TimeFrame);
            $('#RateEdit').val(result.Rate);
            $('#AdditionalInfoEdit').val(result.AdditionalInfo);

            hiddenSpinner();

            $('#editLeadModal').modal('show');
        }
    });
}

function onDelete(id) {
    console.log('Delete Clicked');

    $('#edit-item-id').val(id);
    $('#deleteModal').modal('show');    
}

function deleteLead() {
    $id = $('#edit-item-id').val();

    showSpinner();
    $.ajax({
        url : base_url + 'Leads/deleteLead',
        type : 'post',
        data : {
            ID : $id
        },
        success : function(data) {
            result = JSON.parse(data);

            hiddenSpinner();

            if (result.success == false) {
                toastr.error(LocalizationMessage('Delete Lead') + ' Error');
                logErrorActivity('Delete Lead', $id, 'tblLeads', result.message);
            }
            else {
                toastr.success(LocalizationMessage('Delete Lead'));
                logSuccessActivity('Delete Lead', $id, 'tblLeads');
                websocket.send(JSON.stringify({ 'msg': 'delete_lead', 'poster': $('#usernameInput').val() }));
                refreshDatatable();
            }
        }
    })
}

function onContactInfo(id) {
    console.log('Contact Info');    

    showSpinner();

    $.ajax({
        url : base_url + 'Leads/getLeadById',
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

function refreshCustomerData() {
    var phone = $('#Phone').intlTelInput('getNumber');
    var customerData = getCustomerData(phone);

    if (customerData != null) {
        $('#Name').val(customerData.Name);
        $('#LastName').val(customerData.LastName);
        $('#Email').val(customerData.Email);
        $('#Company').val(customerData.CompanyName);
        $('#Country').val(customerData.Country);
        $('#State').val(customerData.State);
        $('#City').val(customerData.City);
    }
    else {
        $('#Name').val('');
        $('#LastName').val('');
        $('#Email').val('');
        $('#Company').val('');
        $('#Country').val('');
        $('#State').val('');
        $('#City').val('');
    }
}

function refreshCustomerDataOnEdit() {
    var phone = $('#PhoneEdit').intlTelInput('getNumber');
    var customerData = getCustomerData(phone);

    if (customerData != null) {
        $('#NameEdit').val(customerData.Name);
        $('#LastNameEdit').val(customerData.LastName);
        $('#EmailEdit').val(customerData.Email);
        $('#CompanyEdit').val(customerData.CompanyName);
        $('#CountryEdit').val(customerData.Country);
        $('#StateEdit').val(customerData.State);
        $('#CityEdit').val(customerData.City);
    }
    else {
        $('#NameEdit').val('');
        $('#LastNameEdit').val('');
        $('#EmailEdit').val('');
        $('#CompanyEdit').val('');
        $('#CountryEdit').val('');
        $('#StateEdit').val('');
        $('#CityEdit').val('');
    }
}

function refreshDatatable(refresh = false) {
    console.log('refresh');
    if (refresh == false)
        managementTB.ajax.reload(null, false);
    else
        managementTB.ajax.reload();
}

var myVar = setInterval(myTimer, 1000);

function myTimer() {
    var trs = $('#lead-management-table > tbody > tr');

    for (var i = 0; i < trs.length; i++) {        

        var closedBy = closedByUsers[i];
        var remainingColumn = $(trs[i]).find('td')[3];
        var statusColumnn = $(trs[i]).find('td')[1];
        if (statusColumnn == null)
            break;
        var status = statuses[i];

        if (status != 'New' && status != 'Pending'){
            remainingColumn.innerHTML = getLocalizationWord('Start') + ': ' + getSecondRemovedDateTime(startTimes[i]) + '<br>' + getLocalizationWord('Closed') + ': ' + getSecondRemovedDateTime(expirationTimes[i]) + '<br>' + closedBy;
            continue;            
        }

        var today = new Date().toLocaleString("en-US", {timeZone: "America/Phoenix"});
        today = new Date(today);
        
        var expirationDay = new Date(expirationTimes[i].replace(/\s/, 'T'));

        expriationTimestamp = expirationDay.getTime() - today.getTime(); 

        remainingTime = getDateStringFromTimestamp(expriationTimestamp);  
        

        if (remainingTime == '00:00:00') {
            statusColumnn.innerHTML = getLocalizationWord('No Contact');
            $.ajax({
                url : base_url + 'Leads/updateStatus',
                type : 'post',
                success : function(data) {
                    refreshDatatable();
                }
            });
        }       
        
        if (expriationTimestamp < 36000000)
            remainingTime = '<span class="badge badge-danger">' + remainingTime + '</span>';
        
        remainingColumn.innerHTML =  getLocalizationWord('Start') + ': ' + getSecondRemovedDateTime(startTimes[i]) + '<br>' + remainingTime + '<br>' + getLocalizationWord('Expires') + ': ' + getSecondRemovedDateTime(expirationTimes[i]) + '<br>' + closedBy;
    }
}

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

function onCountryChange(element) {
    var country = $(element).val();
    if (country != 'Other') {
        var options = get_state_options_elements(country);
        $('#State').html(options);
    }
    else {
        $('#State').html('<option value=""></option>');
    }
}

function onCountryEditChange(element) {
    var country = $(element).val();
    if (country != 'Other') {
        var options = get_state_options_elements(country);
        $('#StateEdit').html(options);
    }
    else {
        $('#StateEdit').html('<option value=""></option>');
    }
}

function getActiveLead() {
    $.ajax({
        url : base_url + 'Leads/getActiveLeadStatus',
        type : 'post',
        success : function (res) {
            var data = JSON.parse(res);

            var total = data.new + data.pending;
            $('#ActiveLeadCount').html(total);
            $('#NewLeadCount').html(data.new);
            $('#PendingLeadCount').html(data.pending);
        }
    });
}

function getUpdatedLead() {
    $.ajax({
        url : base_url + 'Leads/getUpdatedLeadStatus',
        type : 'post',
        success : function (res) {
            var data = JSON.parse(res);

            var total = data.opportunity + data.noLead;
            $('#UpdatedLead').html(total);
            $('#OpportunityCount').html(data.opportunity);
            $('#InfoNoLeadCount').html(data.noLead);
        }
    });
}

function getTodayAddedLead() {
    $.ajax({
        url : base_url + 'Leads/getTodayAddedLeadStatus',
        type : 'post',
        success : function(res) {
            var data = JSON.parse(res);

            $('#TodayAddedLEads').html(data.count);
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

    exportTableToExcel('Leads' + year + month + day);
});

function exportTableToExcel( filename = '') {

    showSpinner();

    $.ajax({
        url: base_url + 'Leads/getLeadDataForExcel',
        type: 'POST',
        data:  {                
            status: $('#inputStatus').val(),
            minStart : $('#minStartDateInput').val(),
            maxStart : $('#maxStartDateInput').val(),
            rate : $('#inputRate').val(),
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
                    if (j == 3)
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
            Webpage : 'Demand.Leads',
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
            Webpage : 'Demand.Leads',
            Status : 'Error',
            Error : ErrorMsg
        },
        success : function() {
            websocket.send(JSON.stringify({ 'msg': 'activity', 'poster': $('#usernameInput').val() }));
        }
    });
}
