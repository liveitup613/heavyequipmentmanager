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
        "title" : "",
        sortable : false,
        render : function(data, type, full, meta) {
            var btnEdit = '<button  class="col-lg-4 btn btn-sm btn-default btn-action"  data-toggle="tooltip" data-placement="top" title="' + getLocalizationWord('Edit') +'" onclick="onEdit(' + full.ID + ')"><i class="icon-pencil"></i></button>';
            var btnInvoice = '<button  class="col-lg-4 btn btn-sm btn-default btn-action"  data-toggle="tooltip" data-placement="top" title="' + getLocalizationWord('Invoice Data') +'" onclick="onInvoiceData(' + full.ID + ')"><i class="icon-user"></i></button>';
            var btnDelete = '';
            var btnStat = '<button  class="col-lg-4 btn btn-sm btn-default btn-action"  data-toggle="tooltip" data-placement="top" title="' + getLocalizationWord('Activity') +'" onclick="onActivity(' + full.ID + ')"><i class="fa fa-bar-chart-o"></i></button>';
            var btnContact = '';
            if (permission == 'admin')
                btnDelete = '<button  class="col-lg-4 btn btn-sm btn-default btn-action"  data-toggle="tooltip" data-placement="top" title="' + getLocalizationWord('Delete') + '" onclick="onDelete(\'' + full.ID + '\')"><i class="icon-trash"></i></button>';
            
            return  '<div class="row" style = "width : 120px;">' + 
                btnEdit + btnStat + btnInvoice + btnContact + btnDelete + 
                '</div>';
        }
    },  {
        "title": getLocalizationWord("Phone"),
        sortable: false,    
        "render": function (data, type, full, meta) {           
            return getStyledPhoneNumber(full.Phone);
        }
    },
    {
        "title": getLocalizationWord("Name"),
        sortable: false,
        "render": function (data, type, full, meta) {            
            return full.Name + ' ' + full.LastName;
        }
    }, {
        'title' : getLocalizationWord('Email'),
        sortable : false,
        render: function (data, type, full, meta) {
            return full.Email;
        }
    }, {
        "title": getLocalizationWord("Location"),
        sortable: false,
        render: function (data, type, full, meta) {
            return  getCheckedValue(full.City) + 
                    getCheckedValue(full.State)+ 
                    getCheckedValue(full.Country); 
        }
    }, {
        "title": getLocalizationWord("Company"),
        sortable: false,
        render: function (data, type, full, meta) {
            return full.CompanyName;
        }
    }, {
        "title": getLocalizationWord('Date Added'),
        sortable: false,
        render: function(data, type, full, meta) {
            return full.DateAdded;
        }
    }, {
        "title": getLocalizationWord('Last Opportunity'),
        sortable: false,
        render: function(data, type, full, meta) {
            if (full.LastOpportunity != '0000-00-00 00:00:00')
                return full.LastOpportunity;
            return '';
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

    document.getElementById("Phone").addEventListener('countrychange', phoneCountryCodeChange);
    document.getElementById("PhoneEdit").addEventListener('countrychange', phoneCountryCodeChange);    
    
    $('#Phone').mask('999 999 9999');
    $('#PhoneEdit').mask('999 999 9999');    

    $('#State').html(get_state_options_elements('Mexico'));
    $('#StateEdit').html(get_state_options_elements('Mexico'));    
    $('#Estado').html(get_state_options_elements('Mexico'));

    $('#minStartDateInput').datepicker().on('changeDate', function (selected) {
        var startDate = new Date(selected.date.valueOf());
        var endDate = new Date($('#maxStartDateInput').val());
        if (startDate.getTime() > endDate.getTime()) {

            $('#maxStartDateInput').datepicker('setDate', startDate);
        }
        $('#maxStartDateInput').datepicker('setStartDate', startDate);
    }); 

    $('#minLastOppDateInput').datepicker().on('changeDate', function (selected) {
        var startDate = new Date(selected.date.valueOf());
        var endDate = new Date($('#maxLastOppDateInput').val());
        if (startDate.getTime() > endDate.getTime()) {

            $('#maxLastOppDateInput').datepicker('setDate', startDate);
        }
        $('#maxLastOppDateInput').datepicker('setStartDate', startDate);
    }); 
    
});


function renderTB() {
    managementTB = $('#lead-management-table').DataTable({
        'processing': true,
        'serverSide': true,
        'ajax': {
            url: base_url + 'Customers/getCustomerData',
            type: 'POST',
            data: function (d) {                                
                d.minStartDate = $('#minStartDateInput').val();
                d.maxStartDate = $('#maxStartDateInput').val();
                d.minLastOppDate = $('#minLastOppDateInput').val();
                d.maxLastOppDate = $('#maxLastOppDateInput').val();
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

$('#btnAddCustomer').click(function(event) {
    if (!$('#AddNewCustomerForm').valid())
        return;  

    $('#AddNewCustomer').modal('hide');
    showSpinner();
    console.log('Add New Customer');
    
    $.ajax({
        url : base_url + 'Customers/AddNewCustomer',
        type : 'post',
        data : {            
            Name : $('#Name').val(),
            LastName : $('#LastName').val(),
            Phone : $('#Phone').intlTelInput('getNumber'),            
            Email : $('#Email').val(),
            CompanyName : $('#Company').val(),
            Country : $('#Country').val(),
            State : $('#State').val(),
            City : $('#City').val()
        },
        success : function(data) {
            result = JSON.parse(data);
            hiddenSpinner();

            if (result.success == false) {         
                if (result.message == 'Already')       
                    toastr.error(LocalizationMessage('Phone number is already existed'));
                else
                    toastr.error(LocalizationMessage('Add New Customer') + ' Error');
                logErrorActivity('Add New Customer', 0, 'tblCustomer', result.message);
            } 
            else {                
                $('#Name').val('');
                $('#LastName').val('');
                $('#Phone').val('');
                $('#Email').val('');
                $('#Company').val('');
                $('#State').val('');
                $('#City').val('');
                websocket.send(JSON.stringify({ 'msg': 'new_customer', 'poster': $('#usernameInput').val() }));
                toastr.success(LocalizationMessage('Add New Customer'));
                logSuccessActivity('Add New Customer', result.ID, 'tblCustomer');
                refreshDatatable();
            }
        }
    });
});

$('#btnUpdateCustomer').click(function() {
    console.log('Edit Customer');

    if (!$('#editCusomterForm').valid())
        return;  

    $('#editCusomterModal').modal('hide');
    showSpinner();
    $id = $('#edit-item-id').val();

    $.ajax({
        url : base_url + 'Customers/UpdateCustomer',
        type : 'post',
        data : {
            ID : $id,
            Name : $('#NameEdit').val(),
            LastName : $('#LastNameEdit').val(),
            Phone : $('#PhoneEdit').intlTelInput('getNumber'),
            Email : $('#EmailEdit').val(),
            CompanyName : $('#CompanyEdit').val(),
            Country : $('#CountryEdit').val(),
            State : $('#StateEdit').val(),
            City : $('#CityEdit').val()
        },
        success : function(data) {
            result = JSON.parse(data);
            hiddenSpinner();

            if (result.success == false) {                
                toastr.error(LocalizationMessage('Edit Customer') + ' Error');
                logErrorActivity('Edit Customer', $id, 'tblCustomer', result.message);
            }
            else {            
                $('#NameEdit').val('');
                $('#LastNameEdit').val('');
                $('#PhoneEdit').val('');
                $('#EmailEdit').val('');
                $('#CompanyEdit').val('');                
                $('#StateEdit').val('');
                $('#CityEdit').val('');
                toastr.success(LocalizationMessage('Edit Customer'));
                logSuccessActivity('Edit Customer', $id, 'tblCustomer');
                websocket.send(JSON.stringify({ 'msg': 'edit_customer', 'poster': $('#usernameInput').val() }));
                refreshDatatable();
            }
        }
    })
});

function onEdit(id) {
    console.log('Edit Clicked');       

    showSpinner();
    
    $.ajax({
        url : base_url + 'Customers/getCustomerByID',
        type : 'POST',
        data : {
            ID : id
        },
        success : function(data) {
            console.log(data);
            result = JSON.parse(data);
            

            $('#edit-item-id').val(id);            
            $('#NameEdit').val(result.Name);
            $('#LastNameEdit').val(result.LastName);
            $('#PhoneEdit').intlTelInput('setNumber', result.Phone);
            $('#EmailEdit').val(result.Email);    
            $('#CompanyEdit').val(result.Company);
            $('#CountryEdit').val(result.Country);
            $('#StateEdit').val(result.State);
            $('#CityEdit').val(result.City);

            hiddenSpinner();

            $('#editCusomterModal').modal('show');
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
        url : base_url + 'Customers/deleteCustomer',
        type : 'post',
        data : {
            ID : $id
        },
        success : function(data) {
            result = JSON.parse(data);

            hiddenSpinner();

            if (result.success == false) {
                toastr.error(LocalizationMessage('Delete Customer') + ' Error');
                logErrorActivity('Delete Customer', $id, 'tblCustomer', result.message);
            }
            else {
                toastr.success(LocalizationMessage('Delete Customer'));
                logSuccessActivity('Delete Customer', $id, 'tblCustomer');
                websocket.send(JSON.stringify({ 'msg': 'delete_customer', 'poster': $('#usernameInput').val() }));
                refreshDatatable();
            }
        }
    })
}

function onInvoiceData(ID) {
    showSpinner();

    $('#edit-item-id').val(ID);

    $.ajax({
        url : base_url + 'Customers/getInvoiceData',
        type : 'post',
        data : {
            ID : ID
        },
        success : function (res) {
            var data = JSON.parse(res);
            hiddenSpinner();

            if (data.success == false) {
                toastr.error(LocalizationMessage('Get Invoice Data') + ' Error');
                return;
            }

            data = data.invoice;

            $('#RFC').val(data.RFC);
            $('#NombreSocial').val(data.NombreSocial);
            $('#NombreComercial').val(data.NombreComercial);
            $('#Telefono').val(data.Telefono);
            $('#CorreoElectronico').val(data.CorreoElectronico);
            $('#Calle').val(data.Calle);
            $('#NumExt').val(data.NumExt);
            $('#NumInt').val(data.NumInt);
            $('#Colonia').val(data.Colonia);
            $('#CP').val(data.CP);
            $('#Estado').val(data.Estado);
            $('#Ciudad').val(data.Ciudad);

            $('#invoiceModal').modal('show');
        }
    });
}

$('#btnUpdateInvoice').click(function() {
    showSpinner();

    var  ID = $("#edit-item-id").val();

    $.ajax({
        url : base_url + 'Customers/updateInvoiceData',
        type : 'post',
        data : {
            ID : ID,
            RFC : $('#RFC').val(),
            NombreSocial : $('#NombreSocial').val(),
            NombreComercial : $('#NombreComercial').val(),
            Telefono : $('#Telefono').val(),
            CorreoElectronico : $('#CorreoElectronico').val(),
            Calle : $('#Calle').val(),
            NumExt : $('#NumExt').val(),
            NumInt : $('#NumInt').val(),
            Colonia : $('#Colonia').val(),
            CP : $('#CP').val(),
            Estado : $('#Estado').val(),
            Ciudad : $('#Ciudad').val()
        },
        success : function(res) {
            hiddenSpinner();
            var data = JSON.parse(res);

            if (data.success == false) {
                toastr.error(LocalizationMessage('Set Invoice Data') + ' Error');
                return;
            }

            toastr.success(LocalizationMessage('Set Invoice Data'));
            $('#invoiceModal').modal('hide');
        }
    })
});

function refreshDatatable(refresh = false) {
    console.log('refresh');
    if (refresh == false)
        managementTB.ajax.reload(null, false);
    else
        managementTB.ajax.reload();
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

$('#excelbtn').click(function () {
    var d = new Date();

    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    exportTableToExcel('Customer:' + year+ '-' + month + '-' + day);
});

function exportTableToExcel( filename = '') {

    showSpinner();

    $.ajax({
        url: base_url + 'Customers/getCustomerDataForExcel',
        type: 'POST',
        data:  {                
            minStartDate: $('#minStartDateInput').val(),
            maxStartDate: $('#maxStartDateInput').val(),
            minLastOppDate: $('#minLastOppDateInput').val(),
            maxLastOppDate: $('#maxLastOppDateInput').val(),
            searchText:getTranslatedWordForSearch($('#searchInput').val())            
        },
        success: function (result) {

            hiddenSpinner();         

            var downloadLink;
            var csv = [];

            for (var i = 0; i < result.length; i++) {
                var row = [];

                var cols = result[i];

                for (var j = 0; j < cols.length; j++) {
                    if (j == 0)
                        cols[j] = getStyledPhoneNumber(cols[j]);
                    
                    if (cols[j] != null) {
                        if (cols[j] == '0000-00-00 00:00:00')
                            row.push('"None"');
                        else
                            row.push('"'+cols[j].trim() + '"');                        
                    }
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

function onActivity(ID) {
    showSpinner();
    $.ajax({
        url : base_url + 'Customers/getActivity',
        type : 'post',
        data : {
            ID : ID
        },
        success: function(res) {
            hiddenSpinner();

            var result = JSON.parse(res);

            if (result.success == false) {
                toastr.error('Get Customer Activity Error');
                return;
            }

            data = result.data;
            var html = '';

            for (var i = 0; i < data.length; i++) {
                if (data[i].stage == 'Lead' || data[i].stage == 'My Opportunity') {
                    if (html != '') {
                        html += '<li class="timeline-item period">' + 
                                    '<div class="timeline-info"></div>' + 
                                    '<div class="timeline-marker"></div>' +
                                    '<div class="timeline-content"></div>' +
                                '</li>';
                    }
                }
                html += '<li class="timeline-item">' +
                            '<div class="timeline-info">' + 
                                '<span>' + data[i].date +'</span>' +
                            '</div>' +
                            '<div class="timeline-marker"></div>' + 
                            '<div class="timeline-content">' +
                                '<h3 class="timeline-title">' + data[i].stage + '</h3>';
                                if (data[i].stage == 'Assignment') {
                                    html += '<p class="text-muted mt-0 mb-0">' + data[i].salesRep + '</p>' + 
                                            '<p class="text-muted mt-0 mb-0">Assigned By: ' + (data[i].username == null ? 'None' : data[i].username) + '</p>' + 
                                            '<p class="text-muted mt-0 mb-0">Stage: ' + data[i].assginStage + '</p>' + 
                                            '<p class="text-muted mt-0 mb-0">Closed On: ' + (data[i].endDate == '0000-00-00 00:00:00' ? '------' : data[i].endDate) + '</p>';                                    
                                }
                                else if (data[i].stage == 'Opportunity') {                                    
                                    html += '<p class="text-muted mt-0 mb-0">Source: ' + data[i].source + '</p>' +                                             
                                            '<p class="text-muted mt-0 mb-0">Closed On: ' + (data[i].endDate == '0000-00-00 00:00:00' ? '------' : data[i].endDate) + '</p>';                                    
                                }
                                else if (data[i].stage == 'My Opportunity') {
                                    html += '<p class="text-muted mt-0 mb-0">Source: ' + data[i].source + '</p>' + 
                                            '<p class="text-muted mt-0 mb-0">Added By: ' + (data[i].username  == null ? 'None' : data[i].username) + '</p>' + 
                                            '<p class="text-muted mt-0 mb-0">Closed On: ' + (data[i].endDate == '0000-00-00 00:00:00' ? '------' : data[i].endDate) + '</p>';                                    
                                }
                                else if (data[i].stage == 'CFU') {
                                    if (data[i].surveyUser != '') {
                                        html += '<p class="text-muted mt-0 mb-0">Surveyed By: ' + data[i].surveyUser + '</p>' + 
                                                '<p class="text-muted mt-0 mb-0">On: ' + data[i].surveyDate + '</p>';
                                    }
                                    if (data[i].closedUser != '') {
                                        html += '<p class="text-muted mt-0 mb-0">Closed By: ' + data[i].closedUser + '</p>' + 
                                                '<p class="text-muted mt-0 mb-0">On: ' + data[i].closedDate + '</p>';
                                    }
                                }
                                else if (data[i].stage == 'Sales') {
                                    html += '<p class="text-muted mt-0 mb-0">Sale By: ' + (data[i].username == null ? 'None' : data[i].username) + '</p>' +
                                                '<p class="text-muted mt-0 mb-0">On: ' + data[i].date + '</p>';  
                                }
                                else if (data[i].stage == 'Lead') {                                    
                                    html += '<p class="text-muted mt-0 mb-0">Source: ' + data[i].source + '</p>';
                                    html += '<p class="text-muted mt-0 mb-0">Contact By: ' + (data[i].username == null ? "None" : data[i].username) + '</p>';                                    
                                }
                                
                html +=     '</div>' + 
                        '</li>';
            }

            $('#activity-content').html(html);

            $('#activityModalLabel').html(getLocalizationWord('Customer Activity') + ' - ' +  result.name + ' - ' + getStyledPhoneNumber(result.phone));
            $('#activityModal').modal('show');
        }
    });    
}

function onAddContact(ID) {    
    $('#edit-item-id').val(ID);
    // var URL = encodeURI("https://contacts.google.com/new");
    // window.open(URL);
    checkAuth(ID);
};

// gapi.load('client', function() { // Loads the client library interface with Discovery Document URL or JSON object.
// //console.log('gapi.client loaded.');
// });
    


function logSuccessActivity(Activity, ID, Table) {
    $.ajax({
        url : base_url + 'Activity/addActivity',
        type : 'post',
        data : {
            Activity : Activity,
            ObjectiveTable : Table,
            ObjectiveID : ID,
            Webpage : 'Demand.Customers',
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
            Webpage : 'Demand.Customers',
            Status : 'Error',
            Error : ErrorMsg
        },
        success : function() {
            websocket.send(JSON.stringify({ 'msg': 'activity', 'poster': $('#usernameInput').val() }));
        }
    });
}
