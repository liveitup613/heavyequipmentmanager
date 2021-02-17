/*
@@ OPPORTUNITY-MANAGEMENT.JS
@@ By Zheng
@@ 2020-02-19
*/

var managementTB;

// column data
var columnData = [
    {
        "title": '#',
        sortable: false,
        width: '20px',
        "render": function (data, type, full, meta) {                      
            return meta.row + 1;
        }
    }, {
        "title": "User",
        sortable: false,    
        "render": function (data, type, full, meta) { 
            var profile = base_url + 'assets/images/avatar/' + (full.PROFILEPICTURE == "" ? "default.png" : full.PROFILEPICTURE);            

            return '<div class="d-flex align-items-center">' + 
                        '<img src="' + profile +'" data-toggle="tooltip" data-placement="top" title="" alt="Avatar" class="w35 h35 rounded" data-original-title="Avatar Name">' + 
                        '<div class="ml-3">' +
                            '<a href="javascript:void(0);" title="">'+ full.USERNAME + '</a>' + 
                        '</div>' +
                    '</div>';
        }
    }, {
        "title": "Supervisor",
        sortable: false,
        "render": function (data, type, full, meta) {      
            var checked = '';

            if (full.SUPERVISOR == 'ON')
                checked = 'checked';
            return '<div class="onoffswitch">' + 
                        '<input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox" id="SupervisorSwitch' + meta.row +'" onchange="onSupervisor(this.checked, ' + full.ID + ')" ' + checked + '>' + 
                        '<label class="onoffswitch-label" for="SupervisorSwitch' + meta.row +'" style="margin-bottom : 0px;">' + 
                            '<span class="onoffswitch-inner"></span>' + 
                            '<span class="onoffswitch-switch"></span>' +
                        '</label>' + 
                    '</div>';
        }
    }, {
        "title": "SalesRep",
        sortable: false,
        "render": function (data, type, full, meta) {   
            var checked = '';

            if (full.SALESREP == 'ON')
                checked = 'checked';

            return '<div class="onoffswitch">' + 
                        '<input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox" id="SalesRepSwitch' + meta.row +'" onchange="onSalesRep(this.checked, ' + full.ID + ')" ' + checked + '>' + 
                        '<label class="onoffswitch-label" for="SalesRepSwitch' + meta.row +'" style="margin-bottom : 0px;">' + 
                            '<span class="onoffswitch-inner"></span>' + 
                            '<span class="onoffswitch-switch"></span>' +
                        '</label>' + 
                    '</div>';         
        }
    }, {
        "title": "Verify",
        sortable: false,
        "render": function (data, type, full, meta) {   
            var checked = '';

            if (full.VERIFY == 'ON')
                checked = 'checked';

            return '<div class="onoffswitch">' + 
                        '<input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox" id="VerifySwitch' + meta.row +'" onchange="onVerify(this.checked, ' + full.ID + ')" ' + checked + '>' + 
                        '<label class="onoffswitch-label" for="VerifySwitch' + meta.row +'" style="margin-bottom : 0px;">' + 
                            '<span class="onoffswitch-inner"></span>' + 
                            '<span class="onoffswitch-switch"></span>' +
                        '</label>' + 
                    '</div>';                   
        }
    }, {
        "title": "Survey",
        sortable: false,
        "render": function (data, type, full, meta) {  
            var checked = '';

            if (full.SURVEY == 'ON')
                checked = 'checked';

            return '<div class="onoffswitch">' + 
                        '<input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox" id="SurveySwitch' + meta.row +'" onchange="onSurvey(this.checked, ' + full.ID + ')" ' + checked + '>' + 
                        '<label class="onoffswitch-label" for="SurveySwitch' + meta.row +'" style="margin-bottom : 0px;">' + 
                            '<span class="onoffswitch-inner"></span>' + 
                            '<span class="onoffswitch-switch"></span>' +
                        '</label>' + 
                    '</div>';              
        }
    }, {
        "title": "Leads",
        sortable: false,
        "render": function (data, type, full, meta) {    
            var checked = '';

            if (full.LEADS == 'ON')
                checked = 'checked';

            return '<div class="onoffswitch">' + 
                        '<input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox" id="LeadsSwitch' + meta.row +'" onchange="onLeads(this.checked, ' + full.ID + ')" ' + checked + '>' + 
                        '<label class="onoffswitch-label" for="LeadsSwitch' + meta.row +'" style="margin-bottom : 0px;">' + 
                            '<span class="onoffswitch-inner"></span>' + 
                            '<span class="onoffswitch-switch"></span>' +
                        '</label>' + 
                    '</div>';                           
        }
    }, {
        "title": "Employee",
        sortable: false,
        "render": function (data, type, full, meta) {    
            var checked = '';

            if (full.EMPLOYEE == 'ON')
                checked = 'checked';

            return '<div class="onoffswitch">' + 
                        '<input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox" id="EmployeeSwitch' + meta.row +'" onchange="onEmployee(this.checked, ' + full.ID + ')" ' + checked + '>' + 
                        '<label class="onoffswitch-label" for="EmployeeSwitch' + meta.row +'" style="margin-bottom : 0px;">' + 
                            '<span class="onoffswitch-inner"></span>' + 
                            '<span class="onoffswitch-switch"></span>' +
                        '</label>' + 
                    '</div>';                           
        }
    }
    , {
        "title": "Accounting",
        sortable: false,
        "render": function (data, type, full, meta) {    
            var checked = '';

            if (full.ACCOUNTING == 'ON')
                checked = 'checked';

            return '<div class="onoffswitch">' + 
                        '<input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox" id="AccountingSwitch' + meta.row +'" onchange="onAccounting(this.checked, ' + full.ID + ')" ' + checked + '>' + 
                        '<label class="onoffswitch-label" for="AccountingSwitch' + meta.row +'" style="margin-bottom : 0px;">' + 
                            '<span class="onoffswitch-inner"></span>' + 
                            '<span class="onoffswitch-switch"></span>' +
                        '</label>' + 
                    '</div>';                           
        }
    }, {
        "title": "No AutoAssign",
        sortable: false,
        "render": function (data, type, full, meta) {    
            var checked = '';

            if (full.NOAUTOASSIGN == 'ON')
                checked = 'checked';

            return '<div class="onoffswitch">' + 
                        '<input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox" id="NoAutoAssignSwitch' + meta.row +'" onchange="onNoAutoAssign(this.checked, ' + full.ID + ')" ' + checked + '>' + 
                        '<label class="onoffswitch-label" for="NoAutoAssignSwitch' + meta.row +'" style="margin-bottom : 0px;">' + 
                            '<span class="onoffswitch-inner"></span>' + 
                            '<span class="onoffswitch-switch"></span>' +
                        '</label>' + 
                    '</div>';                           
        }
    }
];

$(function () {

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
    }    


    renderTB();
});

function renderTB() {
    managementTB = $('#configuration-management-table').DataTable({
        'processing': true,
        'serverSide': true,
        'ajax': {
            url: base_url + 'User/getConfigurationData',
            type: 'POST',
            data: function (d) {           
                d.supervisor = $('#inputSupervisor').val();
                d.salesRep = $('#inputSalesRep').val();
                d.verify = $('#inputVerify').val();
                d.survey = $('#inputSurvey').val();
                d.leads = $('#inputLeads').val();                
                d.searchText = $('#searchInput').val();
            }
        },
        "columns": columnData,
        'language': {
            processing: ' <img src="' + base_url + 'assets/images/spinner.gif" id="loading">',
            zeroRecords: 'No Data',
            lengthMenu: 'Show _MENU_ records',
            info: "Showing _START_ to _END_ of _TOTAL_ records",
            infoFiltered: '',
            infoEmpty: 'No records'
        },
        'searching': false,
        'searchDelay': 700,
        'lengthChange': true,
        'lengthMenu': [[10, 25, 50, -1], [10, 25, 50, 'All']],
        // 'order': [[5, 'asc']],
        'autoWidth': true,
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

function updateStatus(checked, ID, field) {
    showSpinner();
    var value = '';

    if (checked == true)
        value = 'ON';
    else 
        value = 'OFF';

    $.ajax({
        url : base_url + 'User/updateUserConfig',
        type : 'post',
        data : {
            ID : ID,
            STATUS : value,
            FIELD : field
        },
        success : function(data) {
            hiddenSpinner();
            var result = JSON.parse(data);

            if (result.success == false) {                
                logErrorActivity('Edit User Settings', ID, 'tblUser', result.message);
                toastr.error('Edit User Settings Error');
            }
            else {
                logSuccessActivity('Edit User Settings', ID, 'tblUser');
            }
        },
        error : function() {
            hiddenSpinner();
        }        
    })
}


function onSupervisor(checked, ID) {
    updateStatus(checked, ID, 'SUPERVISOR');
}

function onSalesRep(checked, ID) {
    updateStatus(checked, ID, 'SALESREP');
    console.log(checked);
}

function onVerify(checked, ID) {
    updateStatus(checked, ID, 'VERIFY');
    console.log(checked);
}

function onSurvey(checked, ID) {
    updateStatus(checked, ID, 'SURVEY');
    console.log(checked);
}

function onLeads(checked, ID) {
    updateStatus(checked, ID, 'LEADS');
    console.log(checked);
}

function onEmployee(checked, ID) {
    updateStatus(checked, ID, 'EMPLOYEE');
    console.log(checked);
}

function onAccounting(checked, ID) {
    updateStatus(checked, ID, 'ACCOUNTING');
    console.log(checked);
}

function onNoAutoAssign(checked, ID) {
    updateStatus(checked, ID, 'NOAUTOASSIGN');
    console.log(checked);
}

$('#btnSaveExpiration').click(function() {
    console.log('Expiration Saved');

    $.ajax({
        url : base_url + 'User/saveExpirationConfigData',
        type : 'post',
        data: {
            LeadTime : $('#leadsTime').val(),
            AssignmentTime : $('#assigmentTime').val(),
            ContactTime: $('#contactTime').val(),
            OppTime : $('#oppTime').val(),
            ActiveDealTime : $('#activeDealTime').val(),
            UnpublishAuction : $('#unpublishAuction').val()
        },
        success : function(data) {
            hiddenSpinner();
            var result = JSON.parse(data);

            if (result.success == false) {
                toastr.error('Edit Demand Settings Error');
                logErrorActivity('Edit Demand Settings', 0, '', result.message);
                return;
            }
            toastr.success('Save Expiration Data Successfully');
            logSuccessActivity('Edit Demand Settings', 0, '');
        },
        error : function() {
            hiddenSpinner();
            toastr.error('Save Expiration Data Failed');
        }
    });
});

function onActiveExpiration() {
    showSpinner();

    var status = $('#ExpirationActiveStatus').prop('checked');
    var message = status == true ? 'Activate Expire Opportunities' : 'Deactivate Expire Opportunities';

    $.ajax({
        url : base_url + 'User/ActiveExpiration',
        type : 'post',
        data : {
            'Status' : status
        },
        success : function(data) {
            hiddenSpinner();
            var result = JSON.parse(data);

            if (result.success == false) {
                toastr.error(message + ' Error');
                logErrorActivity(message, 0, '', result.message);
                return;
            }
            toastr.success(message);
            logSuccessActivity(message, 0, '');
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
            Webpage : 'Users.Settings',
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
            Webpage : 'Users.Settings',
            Status : 'Error',
            Error : ErrorMsg
        },
        success : function() {
            websocket.send(JSON.stringify({ 'msg': 'activity', 'poster': $('#usernameInput').val() }));
        }
    });
}