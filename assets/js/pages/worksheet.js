

var websocket = null;


$(function () {

    $('.loading-box').css('width', $(window).width());
    $('.loading-box').css('height', $(window).height());
 
    udpateAllPanel();

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

        if (msg == 'new_truck') {        
            update_deal_chart();
            updatePointsByUser();
        } else if (msg == 'delete_truck') {       
            update_deal_chart();
            updatePointsByUser();
        } else if (msg == 'assign') {
            update_opp_chart();
            updateOppEqCategoryPanel();
        } else if (msg == 'save_survey') {
            updateSurveyPanel();
        }
    }

    $('#chartOppDateSelector').change(function(){ 
        update_opp_chart();
    });

    $('#chartDateSelector').change(function(){ 
         update_deal_chart();
    });

    $('#DealsTypeDateSelector').change(function(){ 
        updateDealTypePanel();
    });

    $('#EqCategoryDateSelector').change(function(){ 
         updateEquipmentCategoryPanel();
    });

    $('#OppEqCategoryDateSelector').change(function(){ 
        updateOppEqCategoryPanel();
    });

    $('#SurveyDateSelector').change(function(){ 
        updateSurveyPanel();
    });
    
    $('#MasterDateSelector').change(function(){ 
        udpateAllPanel();
    });

    $('#AssignDetailDateSelector').change(function(){ 
        updateAssignmentDetails();
    });

    $('#PointsDateSelector').change(function(){ 
        updatePointsByUser();
    });

    $('#startDate').datepicker('setStartDate', new Date('2020-01-06'));
    $('#endDate').datepicker('setEndDate', new Date);  
    $('#endDate').datepicker('setDate', new Date); 
    $('#startDate').datepicker('setEndDate', new Date)
        .on('changeDate', function(selected) {            
            if (!selected.date)
                return;
            var startDate = new Date(selected.date.valueOf());
            var endDate = new Date($('#endDate').val());

            if (startDate.getTime() > endDate.getTime())
                $('#endDate').datepicker('setDate', startDate);
            $('#endDate').datepicker('setStartDate', startDate);
            update_deal_chart();
        });

        
    $('#endDate').datepicker({
        setDate: new Date()
    }).on('changeDate', function (selected) {
        if (!selected.date)
                return;
        var endDate = new Date(selected.date.valueOf());
        var startDate = new Date($('#startDate').val());
        if (startDate.getTime() > endDate.getTime()) {
            $('#startDate').datepicker('setDate', endDate);
        }
        $('#startDate').datepicker('setEndDate', endDate);
        update_deal_chart();
    });    

    $('#startOppDate').datepicker('setStartDate', new Date('2020-01-06'));
    $('#endOppDate').datepicker('setEndDate', new Date);  
    $('#endOppDate').datepicker('setDate', new Date); 
    $('#startOppDate').datepicker('setEndDate', new Date)
        .on('changeDate', function(selected) {    
            if (!selected.date)
                return;        
            var startDate = new Date(selected.date.valueOf());
            var endDate = new Date($('#endOppDate').val());

            if (startDate.getTime() > endDate.getTime())
                $('#endOppDate').datepicker('setDate', startDate);
            $('#endOppDate').datepicker('setStartDate', startDate);
            update_opp_chart();
        });

        
    $('#endOppDate').datepicker({
        setDate: new Date()
    }).on('changeDate', function (selected) {
        if (!selected.date)
                return;
        var endDate = new Date(selected.date.valueOf());
        var startDate = new Date($('#startOppDate').val());
        if (startDate.getTime() > endDate.getTime()) {
            $('#startOppDate').datepicker('setDate', endDate);
        }
        $('#startOppDate').datepicker('setEndDate', endDate);
        update_opp_chart();
    });        


    // Deal Type
    $('#DealsTypeStartDate').datepicker('setStartDate', new Date('2020-01-06'));
    $('#DealsTypeEndDate').datepicker('setEndDate', new Date);  
    $('#DealsTypeEndDate').datepicker('setDate', new Date); 
    $('#DealsTypeStartDate').datepicker('setEndDate', new Date)
        .on('changeDate', function(selected) {            
            if (!selected.date)
                return;
            var startDate = new Date(selected.date.valueOf());
            var endDate = new Date($('#DealsTypeEndDate').val());

            if (startDate.getTime() > endDate.getTime())
                $('#DealsTypeEndDate').datepicker('setDate', startDate);
            $('#DealsTypeEndDate').datepicker('setStartDate', startDate);
            updateDealTypePanel();
        });

        
    $('#DealsTypeEndDate').datepicker({
        setDate: new Date()
    }).on('changeDate', function (selected) {
        if (!selected.date)
                return;
        var endDate = new Date(selected.date.valueOf());
        var startDate = new Date($('#DealsTypeStartDate').val());
        if (startDate.getTime() > endDate.getTime()) {
            $('#DealsTypeStartDate').datepicker('setDate', endDate);
        }
        $('#DealsTypeStartDate').datepicker('setEndDate', endDate);
        updateDealTypePanel();
    });

    // Equipment Category
    $('#EqCategoryStartDate').datepicker('setStartDate', new Date('2020-01-06'));
    $('#EqCategoryEndDate').datepicker('setEndDate', new Date);  
    $('#EqCategoryEndDate').datepicker('setDate', new Date); 
    $('#EqCategoryStartDate').datepicker('setEndDate', new Date)
        .on('changeDate', function(selected) {      
            if (!selected.date)
                return;      
            var startDate = new Date(selected.date.valueOf());
            var endDate = new Date($('#EqCategoryEndDate').val());

            if (startDate.getTime() > endDate.getTime())
                $('#EqCategoryEndDate').datepicker('setDate', startDate);
            $('#EqCategoryEndDate').datepicker('setStartDate', startDate);
            updateEquipmentCategoryPanel();
        });

        
    $('#EqCategoryEndDate').datepicker({
        setDate: new Date()
    }).on('changeDate', function (selected) {
        if (!selected.date)
                return;
        var endDate = new Date(selected.date.valueOf());
        var startDate = new Date($('#EqCategoryStartDate').val());
        if (startDate.getTime() > endDate.getTime()) {
            $('#EqCategoryStartDate').datepicker('setDate', endDate);
        }
        $('#EqCategoryStartDate').datepicker('setEndDate', endDate);
        updateEquipmentCategoryPanel();
    });

     // Opp Equipment Category
     $('#OppEqCategoryStartDate').datepicker('setStartDate', new Date('2020-01-06'));
     $('#OppEqCategoryEndDate').datepicker('setEndDate', new Date);  
     $('#OppEqCategoryEndDate').datepicker('setDate', new Date); 
     $('#OppEqCategoryStartDate').datepicker('setEndDate', new Date)
         .on('changeDate', function(selected) {            
            if (!selected.date)
            return;
             var startDate = new Date(selected.date.valueOf());
             var endDate = new Date($('#OppEqCategoryEndDate').val());
 
             if (startDate.getTime() > endDate.getTime())
                 $('#OppEqCategoryEndDate').datepicker('setDate', startDate);
             $('#OppEqCategoryEndDate').datepicker('setStartDate', startDate);
             updateOppEqCategoryPanel();
         });
 
         
     $('#OppEqCategoryEndDate').datepicker({
         setDate: new Date()
     }).on('changeDate', function (selected) {
        if (!selected.date)
        return;
         var endDate = new Date(selected.date.valueOf());
         var startDate = new Date($('#OppEqCategoryStartDate').val());
         if (startDate.getTime() > endDate.getTime()) {
             $('#OppEqCategoryStartDate').datepicker('setDate', endDate);
         }
         $('#OppEqCategoryStartDate').datepicker('setEndDate', endDate);
         updateOppEqCategoryPanel();
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

     // Master
     $('#MasterStartDate').datepicker('setStartDate', new Date('2020-01-06'));
     $('#MasterEndDate').datepicker('setEndDate', new Date);  
     $('#MasterEndDate').datepicker('setDate', new Date); 
     $('#MasterStartDate').datepicker('setEndDate', new Date)
         .on('changeDate', function(selected) {       
            if (!selected.date)
            return;     
             var startDate = new Date(selected.date.valueOf());
             var endDate = new Date($('#MasterEndDate').val());
 
             if (startDate.getTime() > endDate.getTime())
                 $('#MasterEndDate').datepicker('setDate', startDate);
             $('#MasterEndDate').datepicker('setStartDate', startDate);
             udpateAllPanel();
         });
 
         
     $('#MasterEndDate').datepicker({
         setDate: new Date()
     }).on('changeDate', function (selected) {
        if (!selected.date)
        return;     
         var endDate = new Date(selected.date.valueOf());
         var startDate = new Date($('#MasterStartDate').val());
         if (startDate.getTime() > endDate.getTime()) {
             $('#MasterStartDate').datepicker('setDate', endDate);
         }
         $('#MasterStartDate').datepicker('setEndDate', endDate);
         udpateAllPanel();
     });

     // Master
     $('#AssignDetailStartDate').datepicker('setStartDate', new Date('2020-01-06'));
     $('#AssignDetailEndDate').datepicker('setEndDate', new Date);  
     $('#AssignDetailEndDate').datepicker('setDate', new Date); 
     $('#AssignDetailStartDate').datepicker('setEndDate', new Date)
         .on('changeDate', function(selected) {       
            if (!selected.date)
            return;     
             var startDate = new Date(selected.date.valueOf());
             var endDate = new Date($('#AssignDetailEndDate').val());
 
             if (startDate.getTime() > endDate.getTime())
                 $('#AssignDetailEndDate').datepicker('setDate', startDate);
             $('#AssignDetailEndDate').datepicker('setStartDate', startDate);
             updateAssignmentDetails();
         });
 
         
     $('#AssignDetailEndDate').datepicker({
         setDate: new Date()
     }).on('changeDate', function (selected) {
        if (!selected.date)
        return;     
         var endDate = new Date(selected.date.valueOf());
         var startDate = new Date($('#AssignDetailStartDate').val());
         if (startDate.getTime() > endDate.getTime()) {
             $('#AssignDetailStartDate').datepicker('setDate', endDate);
         }
         $('#AssignDetailStartDate').datepicker('setEndDate', endDate);
         updateAssignmentDetails();
     });

     // Points By User

     $('#PointsStartDate').datepicker('setStartDate', new Date('2020-01-06'));
     $('#PointsEndDate').datepicker('setEndDate', new Date);  
     $('#PointsEndDate').datepicker('setDate', new Date); 
     $('#PointsStartDate').datepicker('setEndDate', new Date)
         .on('changeDate', function(selected) {       
            if (!selected.date)
            return;     
             var startDate = new Date(selected.date.valueOf());
             var endDate = new Date($('#PointsEndDate').val());
 
             if (startDate.getTime() > endDate.getTime())
                 $('#PointsEndDate').datepicker('setDate', startDate);
             $('#PointsEndDate').datepicker('setStartDate', startDate);
             updatePointsByUser();
         });
 
         
     $('#PointsEndDate').datepicker({
         setDate: new Date()
     }).on('changeDate', function (selected) {
        if (!selected.date)
        return;     
         var endDate = new Date(selected.date.valueOf());
         var startDate = new Date($('#PointsStartDate').val());
         if (startDate.getTime() > endDate.getTime()) {
             $('#PointsStartDate').datepicker('setDate', endDate);
         }
         $('#PointsStartDate').datepicker('setEndDate', endDate);
         updatePointsByUser();
     });


    $.ajax({
        url : base_url + 'User/getAllUserName',
        type : 'post',
        success : function(data) {
            result = JSON.parse(data);

            var currentUser = $('#userSelected').val();
            var users = "";
            for (var i = 0; i < result.length ; i++) {
                if (currentUser == result[i].ID)
                    users += '<option value="' + result[i].ID +'" selected>' + result[i].USERNAME + '</option>';
                else
                    users += '<option value="' + result[i].ID +'">' + result[i].USERNAME + '</option>';
            }

            $('#userSelection').html(users);
        }
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

function update_deal_chart() {

    var interval =   $('#chartDateSelector').val();        
        if (interval == '-1')
            $('#chartDatePickerBox').show();
        else
            $('#chartDatePickerBox').hide();
            
    var startDate = new Date();
    var endDate = new Date();
    var user = $('#userSelected').val();

    if (interval == '30')    
        startDate.setDate(endDate.getDate() - 30);        
    else if (interval == '7')
        startDate.setDate(endDate.getDate() - 7);
    else if (interval == '3')
        startDate.setDate(endDate.getDate() - 3);
    else if (interval == '-2')
        startDate = new Date('2020-01-06');        
    else if (interval == '0')
        startDate.setDate(endDate.getDate());
    else if (interval == '1')
    {
        startDate.setDate(endDate.getDate() - 1);
        endDate.setDate(startDate.getDate());
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

    endDate.setDate(endDate.getDate() + 1);

    startDate = startDate.toLocaleString("en-US", {timeZone: "America/Phoenix"});
    endDate = endDate.toLocaleString("en-US", {timeZone: "America/Phoenix"});
    startDate = new Date(startDate);
    endDate = new Date(endDate);

    $('#DealsGraphLoading').show();

    $.ajax({
        url : base_url + 'Worksheet/getUploadedDealsByUser_Date', 
        method : 'POST',
        data : {
            user : user,
            startDate : formatDate(startDate),
            endDate : formatDate(endDate)
        },
        success : function (res) {
            $('#DealsGraphLoading').hide();            
            var result = JSON.parse(res);
            
            var dates = result['date'];
            var counts  = result['counts'];
            var total_counts = result['total_count'];

            $('#total_count').html(total_counts);

            // chart 
            var options;
            var data = {
                labels: dates,
                series: [
                    counts
                ]
            };

            // line chart
            options = {
                height: "300px",
                showPoint: true,

                axisX: {
                    showGrid: false
                },

                axisY : {
                    onlyInteger : true
                },

                lineSmooth: true,

                plugins: [
                    Chartist.plugins.tooltip({
                        appendToBody: true
                    }),
                ]
            };

            new Chartist.Line('#line-chart', data, options);
        }
    });
}

function update_opp_chart() {
    var interval =   $('#chartOppDateSelector').val();        

    if (interval == '-1')
        $('#chartOppDatePickerBox').show();
    else
        $('#chartOppDatePickerBox').hide();
            
    var startDate = new Date();
    var endDate = new Date();
    var user = $('#userSelected').val();

    if (interval == '30')    
        startDate.setDate(endDate.getDate() - 30);        
    else if (interval == '7')
        startDate.setDate(endDate.getDate() - 7);
    else if (interval == '3')
        startDate.setDate(endDate.getDate() - 3);
    else if (interval == '-2')
        startDate = new Date('2020-01-06');        
    else if (interval == '0')
        startDate.setDate(endDate.getDate());
    else if (interval == '1')
    {
        startDate.setDate(endDate.getDate() - 1);
        endDate.setDate(startDate.getDate());
    }
    else {
        startDate = $('#startOppDate').datepicker('getDate');
        endDate = $('#endOppDate').datepicker('getDate');
    }

    if (startDate == null)
        startDate =  new Date();

    if (endDate == null) {
        endDate = new Date();
    }

    endDate.setDate(endDate.getDate() + 1);

    startDate = startDate.toLocaleString("en-US", {timeZone: "America/Phoenix"});
    endDate = endDate.toLocaleString("en-US", {timeZone: "America/Phoenix"});
    startDate = new Date(startDate);
    endDate = new Date(endDate);

    $('#AutoAssignOppsLoading').show();

    $.ajax({
        url : base_url + 'Worksheet/getAssignedOppByUser_Date', 
        method : 'POST',
        data : {
            user : user,
            startDate : formatDate(startDate),
            endDate : formatDate(endDate)
        },
        success : function (res) {
            $('#AutoAssignOppsLoading').hide();
            var result = JSON.parse(res);
            
            var dates = result['date'];
            var counts  = result['counts'];
            var total_counts = result['total_counts'];

            $('#total_opp_count').html(total_counts);

            // chart 
            var options;
            var data = {
                labels: dates,
                series: [
                    counts
                ]
            };

            // line chart
            options = {
                height: "300px",
                showPoint: true,

                axisX: {
                    showGrid: false
                },

                axisY : {
                    onlyInteger : true
                },

                lineSmooth: true,

                plugins: [
                    Chartist.plugins.tooltip({
                        appendToBody: true
                    }),
                ]
            };

            new Chartist.Line('#line-opp-chart', data, options);
        }
    });
}

function updateDealTypePanel() {
    var interval =   $('#DealsTypeDateSelector').val();        

    if (interval == '-1')
        $('#DealsTypeDatePickerBox').show();
    else
        $('#DealsTypeDatePickerBox').hide();
            
    var startDate = new Date();
    var endDate = new Date();
    var user = $('#userSelected').val();

    if (interval == '30')    
        startDate.setDate(endDate.getDate() - 30);        
    else if (interval == '7')
        startDate.setDate(endDate.getDate() - 7);
    else if (interval == '3')
        startDate.setDate(endDate.getDate() - 3);
    else if (interval == '-2')
        startDate = new Date('2020-01-06');
    else if (interval == '0')
        startDate.setDate(endDate.getDate());
    else if (interval == '1')
    {
        startDate.setDate(endDate.getDate() - 1);
        endDate.setDate(startDate.getDate());
    }
    else {
        startDate = $('#DealsTypeStartDate').datepicker('getDate');
        endDate = $('#DealsTypeEndDate').datepicker('getDate');
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

    $('#UploadedDealsGraphLoading').show();
    $.ajax({
        url : base_url + 'Worksheet/getStatusByDealType', 
        method : 'POST',
        data : {
            user : user,
            startDate : formatDate(startDate),
            endDate : formatDate(endDate)
        },
        success : function (res) {
            $('#UploadedDealsGraphLoading').hide();
            var result = JSON.parse(res);
            var totalValue = 0;
            for (var i = 1; i < result.length - 5; i++) {
                if (!result[i]['name'].includes("Expir"))
                    totalValue += parseInt(result[i]['num']);
            }

            var html = '';

            html += '<div class="form-group mb-4">';
            html += '<label class="d-block">' + result[0]['name'] + '<span class="float-right" style="color: #9367b4;">' + result[0]['num'] + '</span></label>';            
            html += '<div class="progress progress-xxs">';
            html += '<div class="progress-bar bg-indigo" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="width: 100%;"></div>';
            html += '</div>';
            html += '</div>';

            for (var i = 1; i < result.length - 5; i++) {
                if (result[i]['num'] == 0)
                    continue;
                var percent = Math.round(result[i]['num'] / totalValue * 100);
                if (totalValue == 0) {
                    percent = 0;
                }
                html += '<div class="form-group mb-4">';
                html += '<label class="d-block">' + getLocalizationWord(result[i]['name']) + '<span class="float-right" style="color: #9367b4;">' + result[i]['num'] + '&nbsp<span style="font-size:12px; color: #a5a8ad;">(' + percent + '%)</span></span></label>';
                html += '<div class="progress progress-xxs">';
                html += '<div class="progress-bar bg-indigo" role="progressbar" aria-valuenow="' + percent + '" aria-valuemin="0" aria-valuemax="100" style="width: ' + percent + '%;"></div>';
                html += '</div>';
                html += '</div>';

                var auctionCount = result[i]['num'];
                if (result[i]['name'] == 'Auction') {
                    html += '<div style="margin-left : 30px;">'
                    i++;
                    var expired_percent = Math.round(result[i]['num'] / auctionCount * 100);
                    html += '<div class="form-group mb-4">';
                    html += '<label class="d-block">' + getLocalizationWord(result[i]['name']) + '<span class="float-right" style="color: #9367b4;">' + result[i]['num'] + '&nbsp<span style="font-size:12px; color: #a5a8ad;">(' + expired_percent + '%)</span></span></label>';
                    html += '<div class="progress progress-xxs">';
                    html += '<div class="progress-bar bg-indigo" role="progressbar" aria-valuenow="' + expired_percent + '" aria-valuemin="0" aria-valuemax="100" style="width: ' + expired_percent + '%;"></div>';
                    html += '</div>';
                    html += '</div>';

                    i++;
                    var expiring = Math.round(result[i]['num'] / auctionCount * 100);
                    html += '<div class="form-group mb-4">';
                    html += '<label class="d-block">' + getLocalizationWord(result[i]['name']) + '<span class="float-right" style="color: #9367b4;">' + result[i]['num'] + '&nbsp<span style="font-size:12px; color: #a5a8ad;">(' + expiring + '%)</span></span></label>';
                    html += '<div class="progress progress-xxs">';
                    html += '<div class="progress-bar bg-indigo" role="progressbar" aria-valuenow="' + expiring + '" aria-valuemin="0" aria-valuemax="100" style="width: ' + expiring + '%;"></div>';
                    html += '</div>';
                    html += '</div>';
                    html += '</div>'
                }
                
            }

            if (result[i]['num'] != 0) {
                var percent = Math.round(result[i]['num'] / totalValue * 100);
    
                html += '<div class="form-group mb-4">';
                html += '<label class="d-block">' + result[i]['name'] + '<span class="float-right" style="color: #9367b4;">' + result[i]['num'] + '&nbsp<span style="font-size:12px; color: #a5a8ad;">(' + percent + '%)</span></span></label>';
                html += '<div class="progress progress-xxs">';
                html += '<div class="progress-bar bg-indigo" role="progressbar" aria-valuenow="' + percent + '" aria-valuemin="0" aria-valuemax="100" style="width: ' + percent + '%;"></div>';
                html += '</div>';
                html += '</div>';
            }        
            i++;    

            if (result[i]['num'] != 0) {
                var percent = Math.round(result[i]['num'] / totalValue * 100);
    
                html += '<div class="form-group mb-4">';
                html += '<label class="d-block">' + result[i]['name'] + '<span class="float-right" style="color: #9367b4;">' + result[i]['num'] + '&nbsp<span style="font-size:12px; color: #a5a8ad;">(' + percent + '%)</span></span></label>';
                html += '<div class="progress progress-xxs">';
                html += '<div class="progress-bar bg-indigo" role="progressbar" aria-valuenow="' + percent + '" aria-valuemin="0" aria-valuemax="100" style="width: ' + percent + '%;"></div>';
                html += '</div>';
                html += '</div>';
            }        
            i++; 

            html += '<div class="form-group mb-4">';
            html += '<label class="d-block">' + result[i]['name'] + '<span class="float-right" style="color: #9367b4;">' + result[i]['num'] + '</span></label>';            
            html += '<div class="progress progress-xxs">';
            html += '<div class="progress-bar bg-indigo" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="width: 100%;"></div>';
            html += '</div>';
            html += '</div>';

            i++;            
            var percent = Math.round((result[i + 1]['num'] - result[i]['num']) / result[i + 1]['num'] * 100);
            if (result[i]['num'] == 0)
                percent = 0;
            html += '<div class="form-group mb-4">';
            html += '<label class="d-block">' + result[i]['name'] + '<span class="float-right" style="color: #9367b4;">' + result[i]['num'] + '&nbsp<span style="font-size:12px; color: #a5a8ad;">(' + percent + '%)</span></span></label>';            
            html += '<div class="progress progress-xxs">';
            html += '<div class="progress-bar bg-indigo" role="progressbar" aria-valuenow="' + percent + '" aria-valuemin="0" aria-valuemax="100" style="width:  ' + percent + '%;"></div>';
            html += '</div>';
            html += '</div>';

            $('#DealTypeTotalCount').html(totalValue);
            $('#DealTypeStatusPanel').html(html);
        }
    });
}

function updateEquipmentCategoryPanel() {
    var interval =   $('#EqCategoryDateSelector').val();        

    if (interval == '-1')
        $('#EqCategoryDatePickerBox').show();
    else
        $('#EqCategoryDatePickerBox').hide();
            
    var startDate = new Date();
    var endDate = new Date();
    var user = $('#userSelected').val();

    if (interval == '30')    
        startDate.setDate(endDate.getDate() - 30);        
    else if (interval == '7')
        startDate.setDate(endDate.getDate() - 7);
    else if (interval == '3')
        startDate.setDate(endDate.getDate() - 3);
    else if (interval == '-2')
        startDate = new Date('2020-01-06');
    else if (interval == '0')
        startDate.setDate(endDate.getDate());
    else if (interval == '1')
    {
        startDate.setDate(endDate.getDate() - 1);
        endDate.setDate(startDate.getDate());
    }
    else {
        startDate = $('#EqCategoryStartDate').datepicker('getDate');
        endDate = $('#EqCategoryEndDate').datepicker('getDate');
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

    $('#UploadedEquipmentCategoryLoading').show();
    $.ajax({
        url : base_url + 'Worksheet/getStatusByEqCategory', 
        method : 'POST',
        data : {
            user : user,
            startDate : formatDate(startDate),
            endDate : formatDate(endDate)
        },
        success : function (res) {
            $('#UploadedEquipmentCategoryLoading').hide();
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

            $('#EqCategoryTotalCount').html(totalValue);
            $('#EqCategoryStatusPanel').html(html);
        }
    });
}

function updateOppEqCategoryPanel() {
    var interval =   $('#OppEqCategoryDateSelector').val();        

    if (interval == '-1')
        $('#OppEqCategoryDatePickerBox').show();
    else
        $('#OppEqCategoryDatePickerBox').hide();
            
    var startDate = new Date();
    var endDate = new Date();
    var user = $('#userSelected').val();

    if (interval == '30')    
        startDate.setDate(endDate.getDate() - 30);        
    else if (interval == '7')
        startDate.setDate(endDate.getDate() - 7);
    else if (interval == '3')
        startDate.setDate(endDate.getDate() - 3);
    else if (interval == '-2')
        startDate = new Date('2020-01-06');
    else if (interval == '0')
        startDate.setDate(endDate.getDate());
    else if (interval == '1')
    {
        startDate.setDate(endDate.getDate() - 1);
        endDate.setDate(startDate.getDate());
    }
    else {
        startDate = $('#OppEqCategoryStartDate').datepicker('getDate');
        endDate = $('#OppEqCategoryEndDate').datepicker('getDate');
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

    $('#AssignOppsByEqCategoryLoading').show();

    $.ajax({
        url : base_url + 'Worksheet/getAssignedOppsByEqCategory', 
        method : 'POST',
        data : {
            user : user,
            startDate : formatDate(startDate),
            endDate : formatDate(endDate)
        },
        success : function (res) {
            $('#AssignOppsByEqCategoryLoading').hide();

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

            $('#OppEqCategoryTotalCount').html(totalValue);
            $('#OppEqCategoryStatusPanel').html(html);
        }
    });
}

function updateSurveyPanel() {
    var interval =   $('#SurveyDateSelector').val();        

    if (interval == '-1')
        $('#SurveyDatePickerBox').show();
    else
        $('#SurveyDatePickerBox').hide();
            
    var startDate = new Date();
    var endDate = new Date();
    var user = $('#userSelected').val();

    if (interval == '30')    
        startDate.setDate(endDate.getDate() - 30);        
    else if (interval == '7')
        startDate.setDate(endDate.getDate() - 7);
    else if (interval == '3')
        startDate.setDate(endDate.getDate() - 3);
    else if (interval == '-2')
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

    $('#SurveyLoading').show();

    $.ajax({
        url : base_url + 'Worksheet/getSurveyResult', 
        method : 'POST',
        data : {
            user : user,
            startDate : formatDate(startDate),
            endDate : formatDate(endDate)
        },
        success : function (res) {
            $('#SurveyLoading').hide();

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
            $('#SurveyStatusPanel').html(html);
        }
    });
}

function updatePointsByUser() {
    var interval =   $('#PointsDateSelector').val();        

    if (interval == '-1')
        $('#PointsDatePickerBox').show();
    else
        $('#PointsDatePickerBox').hide();
            
    var startDate = new Date();
    var endDate = new Date();
    var user = $('#userSelected').val();

    if (interval == '30')    
        startDate.setDate(endDate.getDate() - 30);        
    else if (interval == '7')
        startDate.setDate(endDate.getDate() - 7);
    else if (interval == '3')
        startDate.setDate(endDate.getDate() - 3);
    else if (interval == '-2')
        startDate = new Date('2020-01-06');
    else if (interval == '0')
        startDate.setDate(endDate.getDate());
    else if (interval == '1')
    {
        startDate.setDate(endDate.getDate() - 1);
        endDate.setDate(startDate.getDate());
    }
    else {
        startDate = $('#PointsStartDate').datepicker('getDate');
        endDate = $('#PointsEndDate').datepicker('getDate');
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

    $('#PointsLoading').show();

    $.ajax({
        url : base_url + 'Worksheet/getPointsByUser', 
        method : 'POST',
        data : {
            user : user,
            startDate : formatDate(startDate),
            endDate : formatDate(endDate)
        },
        success : function (res) {
            $('#PointsLoading').hide();

            var result = JSON.parse(res);
            var totalValue = 0.0;
            for (var i = 0; i < result.length; i++) {
                if (result[i]['name'] == 'Sale' || result[i]['name'] == 'Venta')
                    totalValue += parseFloat(result[i]['point']);
                else
                    totalValue += parseFloat(result[i]['num'] * result[i]['point']);
            }
            var html = '';

            for (var i = 0; i < result.length; i++) {                
                html += '<div class="form-group mb-4">';
                if (result[i]['name'] == 'Sale' || result[i]['name'] == 'Venta')                
                    html += '<label class="d-block">' + result[i]['name'] + '<span class="float-right" style="color: #9367b4;">' + numberWithCommas(result[i]['point']) + '&nbsp<span style="font-size:12px; color: #a5a8ad;">(' + numberWithCommas(result[i]['num']) + ')</span></span></label>';                
                else
                html += '<label class="d-block">' + result[i]['name'] + '<span class="float-right" style="color: #9367b4;">' + numberWithCommas(result[i]['num'] * result[i]['point']) + '&nbsp<span style="font-size:12px; color: #a5a8ad;">(' + numberWithCommas(result[i]['num']) + ')</span></span></label>';                
                html += '</div>';
            }
            $('#PointsTotalCount').html(numberWithCommas(totalValue));
            $('#PointsStatusPanel').html(html);
        }
    });
}

function updatePointByUserOnHeader() {
    var interval =   $('#MasterDateSelector').val();        
 
            
    var startDate = new Date();
    var endDate = new Date();
    var user = $('#userSelected').val();

    if (interval == '30')    
        startDate.setDate(endDate.getDate() - 30);        
    else if (interval == '7')
        startDate.setDate(endDate.getDate() - 7);
    else if (interval == '3')
        startDate.setDate(endDate.getDate() - 3);
    else if (interval == '-2')
        startDate = new Date('2020-01-06');
    else if (interval == '0')
        startDate.setDate(endDate.getDate());
    else if (interval == '1')
    {
        startDate.setDate(endDate.getDate() - 1);
        endDate.setDate(startDate.getDate());
    }
    else {
        startDate = $('#MasterStartDate').datepicker('getDate');
        endDate = $('#MasterEndDate').datepicker('getDate');
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
        url : base_url + 'Worksheet/getPointsByUser', 
        method : 'POST',
        data : {
            user : user,
            startDate : formatDate(startDate),
            endDate : formatDate(endDate)
        },
        success : function (res) {            

            var result = JSON.parse(res);
            var totalValue = 0.0;
            for (var i = 0; i < result.length; i++) {
                if (result[i]['name'] == 'Sale' || result[i]['name'] == 'Venta')
                    totalValue += parseFloat(result[i]['point']);
                else
                    totalValue += parseFloat(result[i]['num'] * result[i]['point']);
            }

            $('#MasterPointsTotalCount').html(numberWithCommas(totalValue));
        }
    });
}

function updateAssignmentDetails() {
    var interval =   $('#AssignDetailDateSelector').val();        

    if (interval == '-1')
        $('#AssignDetailDatePickerBox').show();
    else
        $('#AssignDetailDatePickerBox').hide();
            
    var startDate = new Date();
    var endDate = new Date();
    var user = $('#userSelected').val();

    if (interval == '30')    
        startDate.setDate(endDate.getDate() - 30);        
    else if (interval == '7')
        startDate.setDate(endDate.getDate() - 7);
    else if (interval == '3')
        startDate.setDate(endDate.getDate() - 3);
    else if (interval == '-2')
        startDate = new Date('2020-01-06');
    else if (interval == '0')
        startDate.setDate(endDate.getDate());
    else if (interval == '1')
    {
        startDate.setDate(endDate.getDate() - 1);
        endDate.setDate(startDate.getDate());
    }
    else {
        startDate = $('#AssignDetailStartDate').datepicker('getDate');
        endDate = $('#AssignDetailEndDate').datepicker('getDate');
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

    $('#AssignmentDetailLoading').show();

    $.ajax({
        url : base_url + 'Worksheet/getAssignmentDetails', 
        method : 'POST',
        data : {
            user : user,
            startDate : formatDate(startDate),
            endDate : formatDate(endDate),
            interval : interval
        },
        success : function (res) {
            $('#AssignmentDetailLoading').hide();

            var data = JSON.parse(res);
            var result = data['stage'];
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

            if (totalValue != 0 )
            {
                var systemCanceled = data['systemCanceled'];
                var percent = Math.round(systemCanceled['num'] / totalValue * 100);
                html += '<div class="form-group mb-4">';
                html += '<label class="d-block">' + systemCanceled['name'] + '<span class="float-right" style="color: #9367b4;">' + systemCanceled['num'] + '&nbsp<span style="font-size:12px; color: #a5a8ad;">(' + percent + '%)</span></span></label>';
                html += '<div class="progress progress-xxs">';
                html += '<div class="progress-bar bg-indigo" role="progressbar" aria-valuenow="' + percent + '" aria-valuemin="0" aria-valuemax="100" style="width: ' + percent + '%;"></div>';
                html += '</div>';
                html += '</div>';

                var opened = data['open'];
                percent = Math.round(opened['num'] / totalValue * 100);
                html += '<div class="form-group mb-4">';
                html += '<label class="d-block">' + opened['name'] + '<span class="float-right" style="color: #9367b4;">' + opened['num'] + '&nbsp<span style="font-size:12px; color: #a5a8ad;">(' + percent + '%)</span></span></label>';
                html += '<div class="progress progress-xxs">';
                html += '<div class="progress-bar bg-indigo" role="progressbar" aria-valuenow="' + percent + '" aria-valuemin="0" aria-valuemax="100" style="width: ' + percent + '%;"></div>';
                html += '</div>';
                html += '</div>';

                var closed = data['closed'];
                percent = Math.round(closed['num'] / totalValue * 100);
                html += '<div class="form-group mb-4">';
                html += '<label class="d-block">' + closed['name'] + '<span class="float-right" style="color: #9367b4;">' + closed['num'] + '&nbsp<span style="font-size:12px; color: #a5a8ad;">(' + percent + '%)</span></span></label>';
                html += '<div class="progress progress-xxs">';
                html += '<div class="progress-bar bg-indigo" role="progressbar" aria-valuenow="' + percent + '" aria-valuemin="0" aria-valuemax="100" style="width: ' + percent + '%;"></div>';
                html += '</div>';
                html += '</div>';
            }

            var contactedAssign = data['contacted'];
            if (contactedAssign['num'] != -1) {
                html += '<div class="form-group mb-4">';
                html += '<label class="d-block">' + contactedAssign['name'] + '<span class="float-right" style="color: #9367b4;">' + contactedAssign['num'] + '</span></label>';
                html += '<div class="progress progress-xxs">';
                html += '<div class="progress-bar bg-indigo" role="progressbar" aria-valuenow="' + 100 + '" aria-valuemin="0" aria-valuemax="100" style="width: ' + 100 + '%;"></div>';
                html += '</div>';
                html += '</div>';
            }
            $('#AssignDetailTotalCount').html(totalValue);
            $('#AssignDetailStatusPanel').html(html);
        }
    });
}

function udpateAllPanel() {
    var interval =   $('#MasterDateSelector').val();        

    if (interval == '-1')
        $('#MasterDatePickerBox').show();
    else
        $('#MasterDatePickerBox').hide();

    $('#chartOppDateSelector').val(interval);
    $('#chartDateSelector').val(interval);
    $('#DealsTypeDateSelector').val(interval);
    $('#EqCategoryDateSelector').val(interval);
    $('#OppEqCategoryDateSelector').val(interval);
    $('#SurveyDateSelector').val(interval);
    $('#AssignDetailDateSelector').val(interval);
    $('#PointsDateSelector').val(interval);

    update_deal_chart();
    update_opp_chart();
    updateDealTypePanel();
    updateEquipmentCategoryPanel();
    updateOppEqCategoryPanel();
    updateSurveyPanel();
    updateAssignmentDetails();
    updatePointsByUser();
    updatePointByUserOnHeader();

    var startDate = $('#MasterStartDate').datepicker('getDate');
    console.log(startDate);

    if (startDate == null) 
        startDate = new Date;    
   
    var endDate = $('#MasterEndDate').datepicker('getDate');
    if (endDate == null) 
        endDate = new Date;    

    $('#startDate').datepicker('setDate', startDate);
    $('#endDate').datepicker('setDate', endDate);

    $('#startOppDate').datepicker('setDate', startDate);
    $('#endOppDate').datepicker('setDate', endDate);

    $('#DealsTypeStartDate').datepicker('setDate', startDate);
    $('#DealsTypeEndDate').datepicker('setDate', endDate);

    $('#EqCategoryStartDate').datepicker('setDate', startDate);
    $('#EqCategoryEndDate').datepicker('setDate', endDate);

    $('#OppEqCategoryStartDate').datepicker('setDate', startDate);
    $('#OppEqCategoryEndDate').datepicker('setDate', endDate);

    $('#SurveyStartDate').datepicker('setDate', startDate);
    $('#SurveyEndDate').datepicker('setDate', endDate);      

    $('#AssignDetailStartDate').datepicker('setDate', startDate);
    $('#AssignDetailEndDate').datepicker('setDate', endDate);      

    $('#PointsStartDate').datepicker('setDate', startDate);
    $('#PointsEndDate').datepicker('setDate', endDate);   
}

$('#userSelection').change(function() {
    $('#userSelected').val($('#userSelection').val());
    udpateAllPanel();
});

function showSpinner() {
    $('.loading-box').css('display', 'flex');
}

function hiddenSpinner() {
    $('.loading-box').css('display', 'none');
}