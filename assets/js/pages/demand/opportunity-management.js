/*
@@ OPPORTUNITY-MANAGEMENT.JS
@@ By Zheng
@@ 2020-02-19
*/

var managementTB;
var expirationTimes = [];
var startDates = [];
var statuses = [];
var stages = [];
var closingDates = [];
var lastSalesRepes = [];
var assignedDates = [];
var rows = [];
var contactDates = [];
var tagArray = [];

// History Data;
var contact_history = [];
var history_index = 0;


// column data
var columnData = [
    {
        "title": "",
        sortable: false,    
        "render": function (data, type, full, meta) {           

            $user = $('#usernameInput').val();

            var btnAssignToMe = '';    
            var btnAssignTo = '';
            var btnClose = '';
            var btnGoBack = '';
            var btnCancelAssign = '';
            var btnMasterDelete = '';

            if (full.Status != 'Pending') 
            {
                if (isSalesRep == 'ON' && NoAutoAssignment == 'OFF') {
                    if (full.BannedSalesRep.includes($user)) {
                        btnAssignToMe = '<button  class="col-lg-4 btn btn-sm btn-default btn-action"  data-toggle="tooltip" data-placement="top" title="' + getLocalizationWord('Assign To Me') + '" onclick="onBannedUser()"><i class="icon-user"></i></button>';
                    }
                    else {                        
                        btnAssignToMe = '<button  class="col-lg-4 btn btn-sm btn-default btn-action"  data-toggle="tooltip" data-placement="top" title="' + getLocalizationWord('Assign To Me') + '" onclick="onAssignToMe(' + full.ID + ')"><i class="icon-user"></i></button>';
                    }                
                }                
            }    
            else {
                if (isSupervisor == 'ON')
                    btnClose = '<button  class="col-lg-4 btn btn-sm btn-default btn-action"  data-toggle="tooltip" data-placement="top" title="' + getLocalizationWord('Close') + '" onclick="onClose(' + full.ID + ')"><i class="icon-control-pause"></i></button>';
            } 

            if (full.Status == 'Canceled' && isSupervisor == 'ON') {
                btnGoBack = '<button  class="col-lg-4 btn btn-sm btn-default btn-action"  data-toggle="tooltip" data-placement="top" title="' + getLocalizationWord('Go Back') + '" onclick="onGoBack(' + full.ID + ')"><i class="icon-control-play"></i></button>';
            }

            if (isSupervisor == 'ON')
            {
                var btnAssignTo = '<button  class="col-lg-4 btn btn-sm btn-default btn-action"  data-toggle="tooltip" data-placement="top" title="' + getLocalizationWord('Assign To') + '" onclick="onAssignTo(\'' + full.ID + '\')"><img style="height : 14px; vertical-align : top; margin-top : 2px;" src="' + base_url +'assets/images/icon/assign_to.png"></img></button>';            
                var btnCancelAssign = '<button  class="col-lg-4 btn btn-sm btn-default btn-action"  data-toggle="tooltip" data-placement="top" title="' + getLocalizationWord('Cancel Assignment') + '" onclick="onCancelAssign(\'' + full.ID + '\')"><i class="icon-action-undo"></i></button>';
            }      
                     
            var btnInfo = '<button  class="col-lg-4 btn btn-sm btn-default btn-action bottom-button"  data-toggle="tooltip" data-placement="top" title="' + getLocalizationWord('Info') + '" onclick="onInfo(' + full.ID + ')"><i class="icon-info"></i></button>';
            var btnHistory = '<button  class="col-lg-4 btn btn-sm btn-default btn-action bottom-button"  data-toggle="tooltip" data-placement="top" title="' + getLocalizationWord('History') + '" onclick="onHistory(' + full.ID + ')"><i class="icon-notebook"></i></button>';
            var btnMasterDelete = '';
            if ($('#permission').val() == 'admin')
                btnMasterDelete= '<button  class="col-lg-4 btn btn-sm btn-default btn-action bottom-button"  data-toggle="tooltip" data-placement="top" title="' + getLocalizationWord('Master Delete') + '" onclick="onMasterDelete(' + full.ID + ')"><i class="icon-trash"></i></button>';

            if (full.AdditionalInfo == '')
                btnInfo = '';
                
            if (full.Status != 'Assigned')            
                btnCancelAssign = '';

            if (full.Status == 'Assigned' || full.Status == 'Closed' || full.Status == 'Canceled') {
                btnAssignTo = '';
                btnAssignToMe = '';                
            }       
            
            return '<div class="row" style = "width : 120px;">' + 
                    btnAssignToMe + btnAssignTo + btnInfo + btnHistory + btnCancelAssign + btnClose + btnGoBack + btnMasterDelete +
                    '</div>';
        }
    },   {
        "title": getLocalizationWord("Status"),
        sortable: false,
        "render": function (data, type, full, meta) {            

            var canceledBy = '';

            if (full.ClosedBy != '') {
                if (full.Status == 'Closed') {
                    canceledBy = getLocalizationWord('Closed By') + ': ' + full.ClosedBy + '<br>';
                }
                else if (full.Status == 'Canceled') {
                    canceledBy = getLocalizationWord('Canceled By') + ': ' + full.ClosedBy + '<br>';
                }
            }            

            return getBadgetForEachStatusOnOpp(full.Status) + '<br>' + 
                    getLocalizationWord('Stage') + ': ' + getLocalizationWord(full.Stage) + '<br>' + 
                    canceledBy;
        }
    }, {
        "title": getLocalizationWord("Date"),
        sortable: false,
        "render": function (data, type, full, meta) {

            var row_index = rows.indexOf(meta.row);
            if (row_index < 0) {
                expirationTimes.push(full.ExpirationDate);
                statuses.push(full.Status);
                closingDates.push(full.ClosingDate);
                contactDates.push(full.ContactDate);
                startDates.push(full.DateAdded);
                lastSalesRepes.push(full.LastSalesRep);
                assignedDates.push(full.AssignDate);
                stages.push(full.Stage);                
                rows.push(meta.row);
                tagArray.push(full.Tag);
            } else {                
                expirationTimes[row_index] = full.ExpirationDate;
                contactDates[row_index] = full.ContactDate;
                statuses[row_index] = full.Status;
                closingDates[row_index] = full.ClosingDate;
                startDates[row_index] = full.DateAdded;
                lastSalesRepes[row_index] = full.LastSalesRep;
                assignedDates[row_index] = full.AssignDate;
                stages[row_index] = full.Stage;
                tagArray[row_index] = full.Tag;
            }
            
            var startDate = getLocalizationWord('Start') + ': ' + getSecondRemovedDateTime(full.DateAdded) + '<br>';
            var expiresDate = '';
            var timeleft = '';
            var endDate = '';
            var contactDate = "";            

            if (full.Status == '') {
                // will write code  here in the future
                ;
            } else if (full.Status == 'Assigned') {
                expiresDate = getLocalizationWord('Expires') + ': ' + getSecondRemovedDateTime(full.ExpirationDate) + '<br>';                
                    
                //var endDate = 'End: ' + full.ClosingDate;                

                var today = new Date().toLocaleString("en-US", {timeZone: "America/Phoenix"});
                today = new Date(today);
                
                var expirationDay = new Date(full.ExpirationDate.replace(/\s/, 'T'));

                expriationTimestamp = expirationDay.getTime() - today.getTime(); 
                expiration = getDateStringFromTimestamp(expriationTimestamp);
                
                if (expriationTimestamp < 3600000 * Number(10))
                    expiration = '<span class="badge badge-danger">' + expiration + '</span>';
                
                timeleft = getLocalizationWord('Time Left') + ': ' + expiration + '<br>';

                //if (full.Stage == 'Contact') {
                today.setHours(0, 0, 0, 0);
                var contactDay = new Date(full.ContactDate.replace(/\s/, 'T'));                
                contactDay.setHours(0, 0, 0, 0);

                console.log("Compare two : " + (contactDay < today) + contactDay);
                
                if (today.getTime() ==  contactDay.getTime())
                    contactDate = getLocalizationWord('Contact') + ':<span class="badge badge-warning">' + getDatefromDateTime(full.ContactDate) + '</span><br>';
                else if (contactDay < today)
                    contactDate = getLocalizationWord('Contact') + ':<span class="badge badge-danger">' + getDatefromDateTime(full.ContactDate) + '</span><br>';
                else              
                {
                    ContactDate =  getDatefromDateTime(full.ContactDate);
                    if (ContactDate != '0000-00-00')
                        contactDate = getLocalizationWord('Contact') + ': ' + getDatefromDateTime(full.ContactDate) + '<br>';
                    else
                        ContactDate = '';
                }
                //}
            
            } else if (full.Status == 'Closed' || full.Status == 'Canceled') {
                var endDate = getLocalizationWord('End') + ': ' + getSecondRemovedDateTime(full.ClosingDate);
            } 

            if (ExpirationStatus == false) {
                timeleft = '';
                expiresDate = '';
            }

            return startDate + contactDate + expiresDate + timeleft + endDate;
        }
    }, {
        "title": getLocalizationWord("Sales Rep"),
        sortable: false,
        "render": function (data, type, full, meta) {
            
            if (full.Status == 'Assigned') {
                var lastSalesRep = full.LastSalesRep + '<br>';
                var assignedDate = getSecondRemovedDateTime(full.AssignDate) + '<br>';               
                var tag_html = '';

                var tagText = full.Tag;
                var tags = tagText.split('&');

                for (var i = 1; i < tags.length; i++) {
                    var tag = tags[i];
                    var tagInfo = tag.split(';');
                    tag_html += "<span class='tag badge badge-" + tagInfo[1] + "'>" + tagInfo[0] + "</span>" + '<br>';
                }
                
                var today = new Date().toLocaleString("en-US", {timeZone: "America/Phoenix"});
                today = new Date(today);
                
                var assignedDay = new Date(full.AssignDate.replace(/\s/, 'T'));

                workingTimeStamp = today.getTime() - assignedDay.getTime(); 
                
                workingTime = getDateStringFromTimestamp(workingTimeStamp) + '<br>';

                return lastSalesRep + assignedDate + workingTime + tag_html;
            }
            else if (full.Status == 'Pending' || full.Status == 'Canceled') {
                return full.LastSalesRep;
            }
            else if (full.Status == 'Closed' && full.LastSalesRep != '') {
                return full.LastSalesRep;
            }
             
            return '';
            
        }
    }, {
        "title": getLocalizationWord("Client Info"),
        sortable: false,
        "render": function (data, type, full, meta) {

            return  full.Name + ' ' + 
                    full.LastName + '<br>' + 
                    getStyledPhoneNumber(full.Phone) + '<br>' + 
                    getCheckedValue(full.Email) + 
                    getCheckedValue(full.Source);
                        
        }
    }, {
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
    else {
        renderTB();
    }
    
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

        console.log(msg);
        
        if (msg == 'assign') {
            getAssignedOppWaitingContact();
            getClosedOppsToday();
            getOpenOpps();
            getUpdatedOppsToday();
            refreshDatatable();            
        }
        else if (msg == 'cancel_assign') {
            getAssignedOppWaitingContact();
            refreshDatatable();
        }
        else if (msg == 'save_contact') {
            refreshDatatable();            
            getOpenOpps();
            toastr.warning(LocalizationMessage("New Opportunity Added"));
        }
        else if (msg == 'close_opp') {
            getOpenOpps();
            refreshDatatable();
        }
        else if (msg == 'go_back_opp') {
            getOpenOpps();
            refreshDatatable();
        }
    }

    $('#minStartDateInput').datepicker().on('changeDate', function (selected) {
        var startDate = new Date(selected.date.valueOf());
        var endDate = new Date($('#maxStartDateInput').val());
        if (startDate.getTime() > endDate.getTime()) {

            $('#maxStartDateInput').datepicker('setDate', startDate);
        }
        $('#maxStartDateInput').datepicker('setStartDate', startDate);
    });  

    if (SearchHelpCount > 0) {
        toastr.warning(SearchHelpCount + ' ' + LocalizationMessage('Opportunities Need Search Help'));
    }

    $.ajax({
        url : base_url + 'User/getAllUserName',
        type : 'post',
        success : function(data) {
            result = JSON.parse(data);

            var salesReps = "";
            var assigned = "<option value='All'>" + getLocalizationWord("All") + "</option>";
            for (var i = 0; i < result.length ; i++) {              
                if (result[i].SALESREP == 'ON')  
                {
                    salesReps += '<option value="' + result[i].USERNAME +'">' + result[i].USERNAME + '</option>';
                    assigned += '<option value="' + result[i].USERNAME +'">' + result[i].USERNAME + '</option>';
                }
            }
            $('#inputSalesRep').html(assigned);
            $('#salesRep').html(salesReps);
        }
    });         
   
});

function renderTB() {
    managementTB = $('#lead-management-table').DataTable({
        'processing': true,
        'serverSide': true,
        'ajax': {
            url: base_url + 'Opportunities/getOpportunityData',
            type: 'POST',
            data: function (d) {               
                d.status = $('#inputStatus').val();
                d.stage = $('#inputStage').val();
                d.leadType = $('#inputLeadType').val();
                d.contactDate = $('#ContactDate').val();
                d.minStartDate = $('#minStartDateInput').val();
                d.maxStartDate = $('#maxStartDateInput').val();
                d.searchHelp = $('#inputSearchHelp').val();
                d.salesRep = $('#inputSalesRep').val();
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
        // 'order': [[5, 'asc']],
        'autoWidth': true,
        'pageLength' : 50,
        'fnRowCallback' :  function (nRow, aData, iDisplayInex, iDisplayIndexFull) {
            var today = new Date();
            var tomorrow = new Date();
            tomorrow.setDate(today.getDate() + 1);
            var startDate = new Date(aData.EndDate);
            
            if (aData.SearchHelp == 'YES') {                
                $td = $('td', nRow);
                console.log($td);   
                $td[7].style.backgroundColor =  'rgb(128, 128, 128)';
                $td[7].style.color =  'black';
                $td[7].style.fontWeight =  'bolder';
            }
                
        }
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


///////////////////////////// ASSIGN PART //////////////////////////////////
////////////////////////////////////////////////////////////////////////////

function onAssignToMe(ID) {
    userName = $('#usernameInput').val();
    var isLimited = false;

    showSpinner();

    $.ajax({
        url : base_url + 'Opportunities/CheckUserIfLimited',
        type : 'post',
        async: false,
        cache: false,
        timeout: 30000,
        data : {
            User : userName
        },
        success : function(data) {
            hiddenSpinner();
            var result = JSON.parse(data);

            if (result.success == false) {
                isLimited = true;
                toastr.error(result.message);
                return;
            }
            
        },
        error : function() {
            hiddenSpinner();
            isLimited = true;
        }
    })

    if (!isLimited) {
        showSpinner();
        $.ajax({
            url : base_url + 'Opportunities/AssignUserToOpportunity',
            type : 'post',
            data : {
                ID : ID,
                user : userName,
                salesRep : userName,
                AdditionalInfo : ""
            },
            success : function(data) {
                hiddenSpinner();
                result = JSON.parse(data);
    
                if (result.success == false) {
                    toastr.error(LocalizationMessage('Assign Opportunity To Me') + ' Error');
                    logErrorActivity('Assign Opportunity To Me', 0, '', result.message);
                }
                else {
                    toastr.success(LocalizationMessage('Assign Opportunity To Me'));
                    logSuccessActivity('Assign Opportunity To Me', result.ID, 'tblAssignments');
                    websocket.send(JSON.stringify({ 'msg': 'assign', 'poster': $('#usernameInput').val() }));
                    refreshDatatable();
                }
            },
            error : function() {
                hiddenSpinner();
            }
        });
    }    
}

function onAssignTo(ID) {
    $('#edit-item-id').val(ID);
    $('#AdditionalInfo').val('');
    $('#assignToModal').modal('show');
}

$('#btnAssignTo').click(function() {
    showSpinner();

    $('#assignToModal').modal('hide');

    ID =  $('#edit-item-id').val();
    userName = $('#usernameInput').val();
    salesRep = $('#salesRep').val();
    AdditionalInfo = $('#AdditionalInfo').val();
    $.ajax({
        url : base_url + 'Opportunities/AssignUserToOpportunity',
        type : 'post',
        data : { 
            ID : ID,
            user : userName,
            salesRep : salesRep,
            AdditionalInfo : AdditionalInfo
        },
        success : function(data) {
            hiddenSpinner();
            result = JSON.parse(data);

            if (result.success == false) {
                toastr.error(LocalizationMessage('Assign Opportunity to SalesRep') + ' Error');
                logErrorActivity('Assign Opportunity to SalesRep', 0, '', result.message);
                
            }
            else {
                toastr.success(LocalizationMessage('Assign Opportunity to SalesRep'));
                logSuccessActivity('Assign Opportunity to SalesRep', result.ID, 'tblAssginments');
                websocket.send(JSON.stringify({ 'msg': 'assign', 'poster': $('#usernameInput').val() }));
                refreshDatatable();
            }
        },
        error : function() {
            hiddenSpinner();
        }
    });
});

function onCancelAssign(ID) {
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
                toastr.error(LocalizationMessage('Cancel Assignment') + ' Error');
                logErrorActivity('Cancel Assignment', ID, 'tblOpportunities', result.message);                
            }
            else {
                toastr.success(LocalizationMessage('Cancel Assignment'));
                logSuccessActivity('Cancel Assginment', result.ID, 'tblAssignments');
                websocket.send(JSON.stringify({ 'msg': 'cancel_assign', 'poster': $('#usernameInput').val() }));
                refreshDatatable();
            }
        },
        error : function() {
            hiddenSpinner();
        }
    });
}

function onInfo(ID) {
    showSpinner();

    $.ajax({
        url : base_url + 'Opportunities/GetLeadAdditionalInfo',
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
                $('#LeadAdditionalInfo').html(restoreSpecificCharacter(result.AdditionalInfo));
                $('#InfoModal').modal('show');
            }

        },
        error: function() {
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

    for (var i = logs.length - 2; i >= 0 ; i--) {
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


function onBannedUser(){
    toastr.error('Please contact supervisor');
}

function onClose(ID) {
    showSpinner();

    $.ajax({
        url : base_url + 'Opportunities/CloseOpp',
        type : 'post',
        data : {
            ID : ID
        },
        success : function (data) {
            hiddenSpinner();
            var result = JSON.parse(data);

            if (result.success == false) {
                toastr.error(LocalizationMessage('Close Opportunity') + ' Error');
                logErrorActivity('Close Opportunity', ID, 'tblOpportunities', result.message);                
            }
            else {
                toastr.success(LocalizationMessage('Close Opportunity'));
                logSuccessActivity('Close Opportunity', ID, 'tblOpportunities');
                websocket.send(JSON.stringify({ 'msg': 'close_opp', 'poster': $('#usernameInput').val() }));
                refreshDatatable();
            }
        }
    });
}

function onGoBack(ID) {
    showSpinner();

    $.ajax({
        url : base_url + 'Opportunities/GoBackOpp',
        type : 'post',
        data : {
            ID : ID
        },
        success : function (data) {
            hiddenSpinner();
            var result = JSON.parse(data);

            if (result.success == false) {
                toastr.error(LocalizationMessage('Reopen Opporunity') + ' Error');
                logErrorActivity('Reopen Opportunity', ID, 'tblOpportunities', result.message);
            }
            else {
                toastr.success(LocalizationMessage('Reopen Opportunity'));
                logSuccessActivity('Reopen Opportunity', ID, 'tblOpportunities');
                websocket.send(JSON.stringify({ 'msg': 'go_back_opp', 'poster': $('#usernameInput').val() }));
                refreshDatatable();
            }
        }
    });
}

function onMasterDelete(ID) {
    showSpinner();

    $.ajax({
        url : base_url + 'Opportunities/MasterDelete',
        type : 'post',
        data : {
            ID : ID
        },
        success : function(data) {
            hiddenSpinner();
            var result = JSON.parse(data);

            if (result.success == false) {
                toastr.error(LocalizationMessage('Master Delete') + ' Error');
                logErrorActivity('Master Delete', ID, 'tblOpportunities', result.message);
                return;
            }

            toastr.success(LocalizationMessage('Master Delete'));
            logSuccessActivity('Master Delete', ID, 'tblOpportunities');
            websocket.send(JSON.stringify({ 'msg': 'go_back_opp', 'poster': $('#usernameInput').val() }));
            refreshDatatable();
        }
    });
}

function getAssignedOppWaitingContact() {
    $.ajax({
        url : base_url + 'Opportunities/getAssignedOppsWaitingContact',
        type : 'post',
        data : {
            SalesRep : $('#inputSalesRep').val()
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
            SalesRep : $('#inputSalesRep').val()
        },
        success : function(res) {
            var data = JSON.parse(res);

            $('#UpdatedOppsCount').html(data.count);
        }
    });
}


function getOpenOpps() {
    $.ajax({
        url : base_url + 'Opportunities/getOpenOpps',
        type : 'post',
        data : {
            SalesRep : $('#inputSalesRep').val()
        },
        success : function(res) {
            var data = JSON.parse(res);

            $('#NewOppsCount').html(data.new);
            $('#AssignedOppsCount').html(data.assigned);
            $('#PendingOppsCount').html(data.pending);

            var total = data.new + data.assigned + data.pending;

            $('#OppOppsCount').html(total);
        }
    });
}


function getClosedOppsToday() {
    $.ajax({
        url : base_url + 'Opportunities/getClosedOpps',
        type : 'post',
        data : {
            SalesRep : $('#inputSalesRep').val()
        },
        success : function(res) {
            var data = JSON.parse(res);

            $('#ClosedOppsCount').html(data.count);
        }
    });
}

function salesRepChanged() {
    getAssignedOppWaitingContact();
    getOpenOpps();
    getClosedOppsToday();
    getUpdatedOppsToday();
    refreshDatatable();
}





///////////////////////////// SET TIMER /////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
var myVar = setInterval(myTimer, 1000);

function myTimer() {
    var trs = $('#lead-management-table > tbody > tr');

    for (var i = 0; i < trs.length; i++) {        

        var DatesColumn = $(trs[i]).find('td')[2];   
        var SalesRepColumn = $(trs[i]).find('td')[3];       
        
        if (DatesColumn == null)
            break;

        var startDate = getLocalizationWord('Start') + ': ' + getSecondRemovedDateTime(startDates[i]) + '<br>';
        var contactDate = '';
        var expiresDate = '';
        var timeleft = '';
        var endDate = '';

        if (statuses[i] == '') {
            // will write code  here in the future
            ;
        } else if (statuses[i] == 'Assigned') {
            expiresDate = getLocalizationWord('Expires') + ': ' + getSecondRemovedDateTime(expirationTimes[i]) + '<br>';
            if (stages[i] == 'Contact')
                contactDate = getLocalizationWord('Contact') + ': ' + getDatefromDateTime(contactDates[i]) + '<br>'; 
            var timeleft = '12:00:00' + '<br>';                

            var today = new Date().toLocaleString("en-US", {timeZone: "America/Phoenix"});
            today = new Date(today);
            
            var expirationDay = new Date(expirationTimes[i].replace(/\s/, 'T'));

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

            if (Number(expriationTimestamp) < 3600000 * Number(10))
                    expiration = '<span class="badge badge-danger">' + expiration + '</span>';

            if (stages[i] == 'Contact' || stages[i] == 'Proposal') {
                today.setHours(0, 0, 0, 0); 
                var contactDay = new Date(contactDates[i].replace(/\s/, 'T'));
                contactDay.setHours(0, 0, 0, 0);
                if (today.getTime() ==  contactDay.getTime())
                    contactDate = getLocalizationWord('Contact') + ':<span class="badge badge-warning">' + getDatefromDateTime(contactDates[i]) + '</span><br>';
                else if (contactDay < today)
                    contactDate = getLocalizationWord('Contact') + ':<span class="badge badge-danger">' + getDatefromDateTime(contactDates[i]) + '</span><br>';
                else          
                {
                    contactDate = getDatefromDateTime(contactDates[i]);
                    if (contactDate != '0000-00-00')
                        contactDate = getLocalizationWord('Contact') + ': ' + getDatefromDateTime(contactDates[i]) + '<br>';  
                    else
                        contactDate = '';
                }             
                    
            }
                
            timeleft = getLocalizationWord('Time Left') + ': ' + expiration + '<br>';
        
        } else if (statuses[i] == 'Closed' || statuses[i] == 'Canceled') {
            var endDate = getLocalizationWord('End') + ': ' + getSecondRemovedDateTime(closingDates[i]);
        }

        if (ExpirationStatus == false) {
            timeleft = '';
            expiresDate = '';
        }
        
        DatesColumn.innerHTML =  startDate + contactDate + expiresDate + timeleft + endDate;


        if (statuses[i] == 'Assigned') {    
            var lastSalesRep = lastSalesRepes[i] + '<br>';
            var assignedDate = getSecondRemovedDateTime(assignedDates[i]) + '<br>';
            var tag_html = '';

            var tagText = tagArray[i];
            var tags = tagText.split('&');

            for (var j = 1; j < tags.length; j++) {
                var tag = tags[j];
                var tagInfo = tag.split(';');
                tag_html += "<span class='tag badge badge-" + tagInfo[1] + "'>" + tagInfo[0] + "</span>" + '<br>';                
            }
            
            var today = new Date().toLocaleString("en-US", {timeZone: "America/Phoenix"});
            today = new Date(today);
            
            var assignedDay = new Date(assignedDates[i].replace(/\s/, 'T'));

            workingTimeStamp = today.getTime() - assignedDay.getTime(); 
            
            workingTime = getDateStringFromTimestamp(workingTimeStamp) + '<br>';

            SalesRepColumn.innerHTML =  lastSalesRep + assignedDate + workingTime + tag_html;
        }
        else if (statuses[i] == 'Pending') {
            SalesRepColumn.innerHTML = lastSalesRepes[i];
        }
        else if (statuses[i] == 'Closed' && lastSalesRepes[i] != '') {
            SalesRepColumn.innerHTML = lastSalesRepes[i];
        }        
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

    exportTableToExcel('Opportunities' + year + month + day);
});

function exportTableToExcel( filename = '') {

    showSpinner();

    $.ajax({
        url: base_url + 'Opportunities/getOpportunityDataForExcel',
        type: 'POST',
        data:  {                
            status : $('#inputStatus').val(),
            stage : $('#inputStage').val(),
            leadType : $('#inputLeadType').val(),
            contactDate : $('#ContactDate').val(),
            minStartDate : $('#minStartDateInput').val(),
            maxStartDate : $('#maxStartDateInput').val(),
            searchHelp : $('#inputSearchHelp').val(),
            salesRep : $('#inputSalesRep').val(),
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
                    if (j == 8)
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
            Webpage : 'Demand.Opportunity',
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
            Webpage : 'Demand.Opportunity',
            Status : 'Error',
            Error : ErrorMsg
        },
        success : function() {
            websocket.send(JSON.stringify({ 'msg': 'activity', 'poster': $('#usernameInput').val() }));
        }
    });
}