

var websocket = null;


$(function () {
 
    getLeadsPerSource();
    updateBuyingOppsPerCateogry();
    updateOppsPerStatus();
    getAssignedOppPerUser();
    updateDirectOppsPerUser();
    updateSurveyPanel();


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
            websocket.send(JSON.stringify({'msg':'maintain', 'poster': $('#usernameInput').val()})); 
        }, 100000);
    };

    function onMessage(evt) {
        var message = JSON.parse(evt.data);
        var msg = message.msg;
        var poster = message.poster; 

        if (msg == 'new_lead') {        
            getLeadsPerSource();                        
        } else if (msg == 'delete_lead') {         
            getLeadsPerSource();
        } else if (msg == 'save_contact') {
            getLeadsPerSource();
            updateOppsPerStatus();
            updateBuyingOppsPerCateogry();
            updateDirectOppsPerUser();
        } else if (msg == 'assign') {
            getAssignedOppPerUser();
            updateOppsPerStatus();
            updateBuyingOppsPerCateogry();
        } else if (msg == 'save_survey') {
            updateSurveyPanel();
        }
    }


    $('#leadsDateSelector').change(function(){ 
        getLeadsPerSource();
    });

    $('#oppsDateSelector').change(function(){ 
         updateBuyingOppsPerCateogry();
    });

    $('#oppsStatusDateSelector').change(function(){ 
        updateOppsPerStatus();
    });

    $('#userDateSelector').change(function(){ 
        getAssignedOppPerUser();
    });

    $('#directOppDateSelector').change(function() {
        updateDirectOppsPerUser();
    });

    $('#SurveyDateSelector').change(function(){ 
        updateSurveyPanel();
    });

    $('#startDate').datepicker('setStartDate', new Date('2020-01-06'));
    $('#endDate').datepicker('setEndDate', new Date);  
    $('#endDate').datepicker('setDate', new Date); 
    $('#startDate').datepicker('setEndDate', new Date)
        .on('changeDate', function(selected) {            
            var startDate = new Date(selected.date.valueOf());
            var endDate = new Date($('#endDate').val());

            if (startDate.getTime() > endDate.getTime())
                $('#endDate').datepicker('setDate', startDate);
            $('#endDate').datepicker('setStartDate', startDate);
            updateBuyingOppsPerCateogry();
        });

        
    $('#endDate').datepicker({
        setDate: new Date()
    }).on('changeDate', function (selected) {
        
        var endDate = new Date(selected.date.valueOf());
        var startDate = new Date($('#startDate').val());
        if (startDate.getTime() > endDate.getTime()) {
            $('#startDate').datepicker('setDate', endDate);
        }
        $('#startDate').datepicker('setEndDate', endDate);
        updateBuyingOppsPerCateogry();
    });    

    $('#startLeadsDate').datepicker('setStartDate', new Date('2020-01-06'));
    $('#endLeadsDate').datepicker('setEndDate', new Date);  
    $('#endLeadsDate').datepicker('setDate', new Date); 
    $('#startLeadsDate').datepicker('setEndDate', new Date)
        .on('changeDate', function(selected) {            
            var startDate = new Date(selected.date.valueOf());
            var endDate = new Date($('#endLeadsDate').val());

            if (startDate.getTime() > endDate.getTime())
                $('#endLeadsDate').datepicker('setDate', startDate);
            $('#endLeadsDate').datepicker('setStartDate', startDate);
            getLeadsPerSource();
        });

        
    $('#endLeadsDate').datepicker({
        setDate: new Date()
    }).on('changeDate', function (selected) {
        
        var endDate = new Date(selected.date.valueOf());
        var startDate = new Date($('#startLeadsDate').val());
        if (startDate.getTime() > endDate.getTime()) {
            $('#startLeadsDate').datepicker('setDate', endDate);
        }
        $('#startLeadsDate').datepicker('setEndDate', endDate);
        getLeadsPerSource();
    });    

    $('#oppStatusStartDate').datepicker('setStartDate', new Date('2020-01-06'));
    $('#oppStatusEndDate').datepicker('setEndDate', new Date);  
    $('#oppStatusEndDate').datepicker('setDate', new Date); 
    $('#oppStatusStartDate').datepicker('setEndDate', new Date)
        .on('changeDate', function(selected) {            
            var startDate = new Date(selected.date.valueOf());
            var endDate = new Date($('#oppStatusEndDate').val());

            if (startDate.getTime() > endDate.getTime())
                $('#oppStatusEndDate').datepicker('setDate', startDate);
            $('#oppStatusEndDate').datepicker('setStartDate', startDate);
            updateOppsPerStatus();
        });

        
    $('#oppStatusEndDate').datepicker({
        setDate: new Date()
    }).on('changeDate', function (selected) {
        
        var endDate = new Date(selected.date.valueOf());
        var startDate = new Date($('#oppStatusStartDate').val());
        if (startDate.getTime() > endDate.getTime()) {
            $('#oppStatusStartDate').datepicker('setDate', endDate);
        }
        $('#oppStatusStartDate').datepicker('setEndDate', endDate);
        updateOppsPerStatus();
    });    

    $('#userStartDate').datepicker('setStartDate', new Date('2020-01-06'));
    $('#userEndDate').datepicker('setEndDate', new Date);  
    $('#userEndDate').datepicker('setDate', new Date); 
    $('#userStartDate').datepicker('setEndDate', new Date)
        .on('changeDate', function(selected) {            
            var startDate = new Date(selected.date.valueOf());
            var endDate = new Date($('#userEndDate').val());

            if (startDate.getTime() > endDate.getTime())
                $('#userEndDate').datepicker('setDate', startDate);
            $('#userEndDate').datepicker('setStartDate', startDate);
            getAssignedOppPerUser();
        });

        
    $('#userEndDate').datepicker({
        setDate: new Date()
    }).on('changeDate', function (selected) {
        
        var endDate = new Date(selected.date.valueOf());
        var startDate = new Date($('#userStartDate').val());
        if (startDate.getTime() > endDate.getTime()) {
            $('#userStartDate').datepicker('setDate', endDate);
        }
        $('#userStartDate').datepicker('setEndDate', endDate);
        getAssignedOppPerUser();
    });    

    $('#directOppStartDate').datepicker('setStartDate', new Date('2020-01-06'));
    $('#directOppEndDate').datepicker('setEndDate', new Date);  
    $('#directOppEndDate').datepicker('setDate', new Date); 
    $('#directOppStartDate').datepicker('setEndDate', new Date)
        .on('changeDate', function(selected) {            
            var startDate = new Date(selected.date.valueOf());
            var endDate = new Date($('#directOppEndDate').val());

            if (startDate.getTime() > endDate.getTime())
                $('#directOppEndDate').datepicker('setDate', startDate);
            $('#directOppEndDate').datepicker('setStartDate', startDate);
            updateDirectOppsPerUser();
        });

        
    $('#directOppEndDate').datepicker({
        setDate: new Date()
    }).on('changeDate', function (selected) {
        
        var endDate = new Date(selected.date.valueOf());
        var startDate = new Date($('#directOppStartDate').val());
        if (startDate.getTime() > endDate.getTime()) {
            $('#directOppStartDate').datepicker('setDate', endDate);
        }
        $('#directOppStartDate').datepicker('setEndDate', endDate);
        updateDirectOppsPerUser();
    });  

    // Survey Category
    $('#SurveyStartDate').datepicker('setStartDate', new Date('2020-01-06'));
    $('#SurveyEndDate').datepicker('setEndDate', new Date);  
    $('#SurveyEndDate').datepicker('setDate', new Date); 
    $('#SurveyStartDate').datepicker('setEndDate', new Date)
        .on('changeDate', function(selected) {           
           if (!selected.date)
           return; 
            var startDate = new Date(selected.date.valueOf());
            var endDate = new Date($('#SurveyEndDate').val());

            if (startDate.getTime() > endDate.getTime())
                $('#SurveyEndDate').datepicker('setDate', startDate);
            $('#SurveyEndDate').datepicker('setStartDate', startDate);
            updateSurveyPanel();
        });

        
    $('#SurveyEndDate').datepicker({
        setDate: new Date()
    }).on('changeDate', function (selected) {
       if (!selected.date)
       return;
        var endDate = new Date(selected.date.valueOf());
        var startDate = new Date($('#SurveyStartDate').val());
        if (startDate.getTime() > endDate.getTime()) {
            $('#SurveyStartDate').datepicker('setDate', endDate);
        }
        $('#SurveyStartDate').datepicker('setEndDate', endDate);
        updateSurveyPanel();
    });
});

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}

function updateBuyingOppsPerCateogry() {

    var interval =   $('#oppsDateSelector').val();        
    if (interval == '-2')
        $('#oppsDatePickerBox').show();
    else
        $('#oppsDatePickerBox').hide();
            
    var startDate = new Date();
    var endDate = new Date();
    var beginDate = new Date('2020-01-06');


    if (interval == '30')    
        startDate.setDate(endDate.getDate() - 30);        
    else if (interval == '7')
        startDate.setDate(endDate.getDate() - 7);
    else if (interval == '-1')
        startDate = new Date('2020-01-06');
    else if (interval == '0')
        startDate.setDate(endDate.getDate());
    else if (interval == '1')
    {
        startDate.setDate(endDate.getDate() - 1);
        endDate = startDate;
    }
    else {
        startDate = $('#startDate').datepicker('getDate');
        endDate = $('#endDate').datepicker('getDate');
    }

    if (startDate == null)
        startDate =  new Date();
    
    if (endDate == null) {
        endDate = new Date();
    }   

    startDate = startDate.toLocaleString("en-US", {timeZone: "America/Phoenix"});
    endDate = endDate.toLocaleString("en-US", {timeZone: "America/Phoenix"});
    startDate = new Date(startDate);
    endDate = new Date(endDate);

    $.ajax({
        url : base_url + 'Opportunities/getBuyingOppsPerCategory', 
        method : 'POST',
        data : {
            interval : interval,
            startDate : formatDate(startDate),
            endDate : formatDate(endDate)
        },
        success : function (res) {
            var result = JSON.parse(res);
            var totalValue = 0;
            for (var i = 0; i < result.length; i++) {
                totalValue += parseInt(result[i]['num']);
            }

            var html = '';
            for (var i = 0; i < result.length; i++) {
                if (result[i]['num'] == 0)
                    continue;
                var percent = Math.round(result[i]['num'] / totalValue * 100);
                if (totalValue == 0) {
                    percent = 0;
                }
                html += '<div class="form-group mb-4">';
                html += '<label class="d-block">' + (lang == 'spanish' ? get_translated_word(result[i]['name']) : result[i]['name']) + '<span class="float-right" style="color: #9367b4;">' + result[i]['num'] + '&nbsp<span style="font-size:12px; color: #a5a8ad;">(' + percent + '%)</span></span></label>';
                html += '<div class="progress progress-xxs">';
                html += '<div class="progress-bar bg-indigo" role="progressbar" aria-valuenow="' + percent + '" aria-valuemin="0" aria-valuemax="100" style="width: ' + percent + '%;"></div>';
                html += '</div>';
                html += '</div>';
            }

            $('#total_Opps_Count').html(totalValue);
            $('#detail_statistic_opps_box').html(html);
        }
    });
}

function updateOppsPerStatus() {

    var interval =   $('#oppsStatusDateSelector').val();        
    if (interval == '-2')
        $('#oppsStatusDatePickerBox').show();
    else
        $('#oppsStatusDatePickerBox').hide();
            
    var startDate = new Date();
    var endDate = new Date();
    var beginDate = new Date('2020-01-06');


    if (interval == '30')    
        startDate.setDate(endDate.getDate() - 30);        
    else if (interval == '7')
        startDate.setDate(endDate.getDate() - 7);
    else if (interval == '-1')
        startDate = new Date('2020-01-06');
    else if (interval == '0')
        startDate.setDate(endDate.getDate());
    else if (interval == '1')
    {
        startDate.setDate(endDate.getDate() - 1);
        endDate = startDate;
    }
    else {
        startDate = $('#oppStatusStartDate').datepicker('getDate');
        endDate = $('#oppStatusEndDate').datepicker('getDate');
    }

    if (startDate == null)
        startDate =  new Date();
    
    if (endDate == null) {
        endDate = new Date();
    }   

    startDate = startDate.toLocaleString("en-US", {timeZone: "America/Phoenix"});
    endDate = endDate.toLocaleString("en-US", {timeZone: "America/Phoenix"});
    startDate = new Date(startDate);
    endDate = new Date(endDate);

    $.ajax({
        url : base_url + 'Opportunities/getOppsPerStatus', 
        method : 'POST',
        data : {
            interval : interval,
            startDate : formatDate(startDate),
            endDate : formatDate(endDate)
        },
        success : function (res) {
            var result = JSON.parse(res);
            var totalValue = 0;
            for (var i = 0; i < result.length; i++) {
                totalValue += parseInt(result[i]['num']);
            }

            var html = '';
            for (var i = 0; i < result.length; i++) {
                if (result[i]['num'] == 0)
                    continue;
                var percent = Math.round(result[i]['num'] / totalValue * 100);
                if (totalValue == 0) {
                    percent = 0;
                }
                html += '<div class="form-group mb-4">';
                html += '<label class="d-block">' + result[i]['name'] + '<span class="float-right" style="color: #9367b4;">' + result[i]['num'] + '&nbsp<span style="font-size:12px; color: #a5a8ad;">(' + percent + '%)</span></span></label>';
                html += '<div class="progress progress-xxs">';
                html += '<div class="progress-bar bg-indigo" role="progressbar" aria-valuenow="' + percent + '" aria-valuemin="0" aria-valuemax="100" style="width: ' + percent + '%;"></div>';
                html += '</div>';
                html += '</div>';
            }

            $('#total_Opps_Status_Count').html(totalValue);
            $('#detail_statistic_opps_status_box').html(html);
        }
    });
}



function getLeadsPerSource() {

    var interval =   $('#leadsDateSelector').val();
     
    if (interval == '-2')
        $('#leadsDatePickerBox').show();
    else
        $('#leadsDatePickerBox').hide();
            
    var startDate = new Date();
    var endDate = new Date();
    var beginDate = new Date('2020-01-06');


    if (interval == '30')    
        startDate.setDate(endDate.getDate() - 30);        
    else if (interval == '7')
        startDate.setDate(endDate.getDate() - 7);
    else if (interval == '-1')
        startDate = new Date('2020-01-06');
    else if (interval == '0')
        startDate.setDate(endDate.getDate());
    else if (interval == '1')
    {
        startDate.setDate(endDate.getDate() - 1);
        endDate = startDate;
    }
    else {
        startDate = $('#startLeadsDate').datepicker('getDate');
        endDate = $('#endLeadsDate').datepicker('getDate');
    }

    if (startDate == null)
        startDate =  new Date();
    
    if (endDate == null) {
        endDate = new Date();
    }   

    startDate = startDate.toLocaleString("en-US", {timeZone: "America/Phoenix"});
    endDate = endDate.toLocaleString("en-US", {timeZone: "America/Phoenix"});
    startDate = new Date(startDate);
    endDate = new Date(endDate);

    console.log(formatDate(startDate));

    $.ajax({
        url: base_url + "Leads/getLeadsPerSource",
        method: "POST",
        data: { startDate :  formatDate(startDate), endDate : formatDate(endDate)},
        success: function (res) {

            console.log(res);
            var result = JSON.parse(res);
            var totalValue = 0;
            var totalOppValue = 0;
            for (var i = 0; i < result.length; i++) {
                totalValue += parseInt(result[i]['num']);
                totalOppValue += parseInt(result[i]['oppNum']);
            }

            var html = '';
            for (var i = 0; i < result.length; i++) {
                if (result[i]['num'] == 0)
                    continue;
                var percent = 0;
                if (result[i]['num'] != 0)
                    percent = Math.round(result[i]['oppNum'] / result[i]['num'] * 100);                
                html += '<div class="form-group mb-4">';
                html += '<label class="d-block">' + getLocalizationWord(result[i]['name']) + '<span class="float-right" style="color: #9367b4;">' + result[i]['num'] + '&nbsp<span style="font-size:12px; color: #a5a8ad;">('+ result[i]['oppNum'] + ', ' + percent + '%)</span></span></label>';
                html += '<div class="progress progress-xxs">';
                html += '<div class="progress-bar bg-indigo" role="progressbar" aria-valuenow="' + percent + '" aria-valuemin="0" aria-valuemax="100" style="width: ' + percent + '%;"></div>';
                html += '</div>';
                html += '</div>';
            }

            var percent = 0;
            if (totalValue != 0)
                percent = Math.round(totalOppValue / totalValue * 100);            
            
            $('#total_Count_by_user').html(totalValue);
            $('#OppTotalCountByUser').html(' (' + totalOppValue + ', ' + percent + '%)');
            $('#detail_statistic_user_box').html(html);
        }
    });
}

function getAssignedOppPerUser() {

    var interval =   $('#userDateSelector').val();
     
    if (interval == '-2')
        $('#userDatePickerBox').show();
    else
        $('#userDatePickerBox').hide();
            
    var startDate = new Date();
    var endDate = new Date();
    var beginDate = new Date('2020-01-06');


    if (interval == '30')    
        startDate.setDate(endDate.getDate() - 30);        
    else if (interval == '7')
        startDate.setDate(endDate.getDate() - 7);
    else if (interval == '-1')
        startDate = new Date('2020-01-06');
    else if (interval == '0')
        startDate.setDate(endDate.getDate());
    else if (interval == '1')
    {
        startDate.setDate(endDate.getDate() - 1);
        endDate = startDate;
    }
    else {
        startDate = $('#userStartDate').datepicker('getDate');
        endDate = $('#userEndDate').datepicker('getDate');
    }

    if (startDate == null)
        startDate =  new Date();
    
    if (endDate == null) {
        endDate = new Date();
    }   

    startDate = startDate.toLocaleString("en-US", {timeZone: "America/Phoenix"});
    endDate = endDate.toLocaleString("en-US", {timeZone: "America/Phoenix"});
    startDate = new Date(startDate);
    endDate = new Date(endDate);

    console.log(formatDate(startDate));

    $.ajax({
        url: base_url + "Opportunities/getAssignedOppPerUser",
        method: "POST",
        data: { interval : interval, startDate :  formatDate(startDate), endDate : formatDate(endDate)},
        success: function (res) {

            console.log(res);
            var result = JSON.parse(res);
            var totalValue = 0;
            for (var i = 0; i < result.length; i++) {
                totalValue += parseInt(result[i]['num']);
            }

            var html = '';
            for (var i = 0; i < result.length; i++) {
                if (result[i]['num'] == 0)
                    continue;
                var percent = 0;
                if (result[i]['num'] != 0)
                    percent = Math.round(result[i]['num'] / totalValue * 100);                
                html += '<div class="form-group mb-4">';
                html += '<label class="d-block">' + result[i]['name'] + '<span class="float-right" style="color: #9367b4;">' + result[i]['num'] + '&nbsp<span style="font-size:12px; color: #a5a8ad;">(' + percent + '%)</span></span></label>';
                html += '<div class="progress progress-xxs">';
                html += '<div class="progress-bar bg-indigo" role="progressbar" aria-valuenow="' + percent + '" aria-valuemin="0" aria-valuemax="100" style="width: ' + percent + '%;"></div>';
                html += '</div>';
                html += '</div>';
            }

            $('#total_Assigned_Opp_User_Count').html(totalValue);
            $('#detail_Assigned_opps_user_box').html(html);
        }
    });
}

function updateDirectOppsPerUser() {

    var interval =   $('#directOppDateSelector').val();
     
    if (interval == '-2')
        $('#directOppDatePickerBox').show();
    else
        $('#directOppDatePickerBox').hide();
            
    var startDate = new Date();
    var endDate = new Date();
    var beginDate = new Date('2020-01-06');


    if (interval == '30')    
        startDate.setDate(endDate.getDate() - 30);        
    else if (interval == '7')
        startDate.setDate(endDate.getDate() - 7);
    else if (interval == '-1')
        startDate = new Date('2020-01-06');
    else if (interval == '0')
        startDate.setDate(endDate.getDate());
    else if (interval == '1')
    {
        startDate.setDate(endDate.getDate() - 1);
        endDate = startDate;
    }
    else {
        startDate = $('#directOppStartDate').datepicker('getDate');
        endDate = $('#directOppEndDate').datepicker('getDate');
    }

    if (startDate == null)
        startDate =  new Date();
    
    if (endDate == null) {
        endDate = new Date();
    }   

    startDate = startDate.toLocaleString("en-US", {timeZone: "America/Phoenix"});
    endDate = endDate.toLocaleString("en-US", {timeZone: "America/Phoenix"});
    startDate = new Date(startDate);
    endDate = new Date(endDate);

    console.log(formatDate(startDate));

    $.ajax({
        url: base_url + "Opportunities/getDirectOppPerUser",
        method: "POST",
        data: { interval : interval, startDate :  formatDate(startDate), endDate : formatDate(endDate)},
        success: function (res) {

            console.log(res);
            var result = JSON.parse(res);
            var totalValue = 0;
            for (var i = 0; i < result.length; i++) {
                totalValue += parseInt(result[i]['num']);
            }

            var html = '';
            for (var i = 0; i < result.length; i++) {
                if (result[i]['num'] == 0)
                    continue;
                var percent = 0;
                if (result[i]['num'] != 0)
                    percent = Math.round(result[i]['num'] / totalValue * 100);                
                html += '<div class="form-group mb-4">';
                html += '<label class="d-block">' + result[i]['name'] + '<span class="float-right" style="color: #9367b4;">' + result[i]['num'] + '&nbsp<span style="font-size:12px; color: #a5a8ad;">(' + percent + '%)</span></span></label>';
                html += '<div class="progress progress-xxs">';
                html += '<div class="progress-bar bg-indigo" role="progressbar" aria-valuenow="' + percent + '" aria-valuemin="0" aria-valuemax="100" style="width: ' + percent + '%;"></div>';
                html += '</div>';
                html += '</div>';
            }

            $('#total_Count_by_direct_opp').html(totalValue);
            $('#detail_statistic_direct_opp_box').html(html);
        }
    });
}

function updateSurveyPanel() {
    var interval =   $('#SurveyDateSelector').val();        

    if (interval == '-2')
        $('#SurveyDatePickerBox').show();
    else
        $('#SurveyDatePickerBox').hide();
            
    var startDate = new Date();
    var endDate = new Date();

    if (interval == '30')    
        startDate.setDate(endDate.getDate() - 30);        
    else if (interval == '7')
        startDate.setDate(endDate.getDate() - 7);
    else if (interval == '3')
        startDate.setDate(endDate.getDate() - 3);
    else if (interval == '-1')
        startDate = new Date('2020-01-06');
    else if (interval == '0')
        startDate.setDate(endDate.getDate());
    else if (interval == '1')
    {
        startDate.setDate(endDate.getDate() - 1);
        endDate.setDate(startDate.getDate());
    }
    else {
        startDate = $('#SurveyStartDate').datepicker('getDate');
        endDate = $('#SurveyEndDate').datepicker('getDate');
    }

    if (startDate == null)
        startDate =  new Date();

    if (endDate == null) {
        endDate = new Date();
    }

    startDate = startDate.toLocaleString("en-US", {timeZone: "America/Phoenix"});
    endDate = endDate.toLocaleString("en-US", {timeZone: "America/Phoenix"});
    startDate = new Date(startDate);
    endDate = new Date(endDate);

    $.ajax({
        url : base_url + 'CFU/getSurveyResult', 
        method : 'POST',
        data : {
            startDate : formatDate(startDate),
            endDate : formatDate(endDate)
        },
        success : function (res) {
            var data = JSON.parse(res);
            var result = data['data'];
            var totalValue = result[0]['num'];    
            var html = '';

            if (totalValue != 0) {
                for (var i = 1; i < result.length; i++) {
                    if (result[i]['num'] == 0)
                        continue;
                    var percent = Math.round(result[i]['num'] / totalValue * 100);
                    if (totalValue == 0) {
                        percent = 0;
                    }
                    html += '<div class="form-group mb-4">';
                    html += '<label class="d-block">' + result[i]['name'] + '<span class="float-right" style="color: #9367b4;">' + result[i]['num'] + '&nbsp<span style="font-size:12px; color: #a5a8ad;">(' + percent + '%)</span></span></label>';
                    html += '<div class="progress progress-xxs">';
                    html += '<div class="progress-bar bg-indigo" role="progressbar" aria-valuenow="' + percent + '" aria-valuemin="0" aria-valuemax="100" style="width: ' + percent + '%;"></div>';
                    html += '</div>';
                    html += '</div>';
                }
            }

            var opp = data['Opp'];
            html += '<div class="form-group mb-4">';
            html += '<label class="d-block">' + getLocalizationWord("Opportunities") + '<span class="float-right" style="color: #9367b4;">' + opp + '</span></label>';
            html += '<div class="progress progress-xxs">';
            html += '<div class="progress-bar bg-indigo" role="progressbar" aria-valuenow="' + 100 + '" aria-valuemin="0" aria-valuemax="100" style="width: ' + 100 + '%;"></div>';
            html += '</div>';
            html += '</div>';

            $('#SurveyTotalCount').html(totalValue);
            $('#SurveyResultInDetailPanel').html(html);
        }
    });
}


