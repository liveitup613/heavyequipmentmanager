

var websocket = null;


$(function () {
 
    getStatisticDataByUser();
    update_chart_data();
    updateStaticsDataByCategory();
    updateStaticsDataByDealType();


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
            getStatisticDataByUser();
            update_chart_data();
            updateStaticsDataByCategory();
            updateStaticsDataByDealType();
        } else if (msg == 'delete_truck') {         
            getStatisticDataByUser();
            update_chart_data();
            updateStaticsDataByCategory();
            updateStaticsDataByDealType();
        }
    }


    $('#dateSelector').change(function(){ 
        getStatisticDataByUser();
    });

    $('#chartDateSelector').change(function(){ 
         update_chart_data();
    });

    $('#DealsByDealTypeDateSelector').change(function() {
        updateStaticsDataByDealType();
    });

    $('#DealsByEquipmentCategoryDateSelector').change(function() {
        updateStaticsDataByCategory();
    })

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
            update_chart_data();
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
        update_chart_data();
    });    

    $('#startUserDate').datepicker('setStartDate', new Date('2020-01-06'));
    $('#endUserDate').datepicker('setEndDate', new Date);  
    $('#endUserDate').datepicker('setDate', new Date); 
    $('#startUserDate').datepicker('setEndDate', new Date)
        .on('changeDate', function(selected) {            
            var startDate = new Date(selected.date.valueOf());
            var endDate = new Date($('#endUserDate').val());

            if (startDate.getTime() > endDate.getTime())
                $('#endUserDate').datepicker('setDate', startDate);
            $('#endUserDate').datepicker('setStartDate', startDate);
            getStatisticDataByUser();
        });

        
    $('#endUserDate').datepicker({
        setDate: new Date()
    }).on('changeDate', function (selected) {
        
        var endDate = new Date(selected.date.valueOf());
        var startDate = new Date($('#startUserDate').val());
        if (startDate.getTime() > endDate.getTime()) {
            $('#startUserDate').datepicker('setDate', endDate);
        }
        $('#startUserDate').datepicker('setEndDate', endDate);
        getStatisticDataByUser();
    }); 
    
    $('#DealsByDealTypeStartDate').datepicker('setStartDate', new Date('2020-01-06'));
    $('#DealsByDealTypeEndDate').datepicker('setEndDate', new Date);  
    $('#DealsByDealTypeEndDate').datepicker('setDate', new Date); 
    $('#DealsByDealTypeStartDate').datepicker('setEndDate', new Date)
        .on('changeDate', function(selected) {            
            var startDate = new Date(selected.date.valueOf());
            var endDate = new Date($('#DealsByDealTypeEndDate').val());

            if (startDate.getTime() > endDate.getTime())
                $('#DealsByDealTypeEndDate').datepicker('setDate', startDate);
            $('#DealsByDealTypeEndDate').datepicker('setStartDate', startDate);
            getStatisticDataByUser();
        });

        
    $('#DealsByDealTypeEndDate').datepicker({
        setDate: new Date()
    }).on('changeDate', function (selected) {
        
        var endDate = new Date(selected.date.valueOf());
        var startDate = new Date($('#DealsByDealTypeStartDate').val());
        if (startDate.getTime() > endDate.getTime()) {
            $('#DealsByDealTypeStartDate').datepicker('setDate', endDate);
        }
        $('#DealsByDealTypeStartDate').datepicker('setEndDate', endDate);
        getStatisticDataByUser();
    });    

    $('#DealsByEquipmentCategoryStartDate').datepicker('setStartDate', new Date('2020-01-06'));
    $('#DealsByEquipmentCategoryEndDate').datepicker('setEndDate', new Date);  
    $('#DealsByEquipmentCategoryEndDate').datepicker('setDate', new Date); 
    $('#DealsByEquipmentCategoryStartDate').datepicker('setEndDate', new Date)
        .on('changeDate', function(selected) {            
            var startDate = new Date(selected.date.valueOf());
            var endDate = new Date($('#DealsByEquipmentCategoryEndDate').val());

            if (startDate.getTime() > endDate.getTime())
                $('#DealsByEquipmentCategoryEndDate').datepicker('setDate', startDate);
            $('#DealsByEquipmentCategoryEndDate').datepicker('setStartDate', startDate);
            getStatisticDataByUser();
        });

        
    $('#DealsByEquipmentCategoryEndDate').datepicker({
        setDate: new Date()
    }).on('changeDate', function (selected) {
        
        var endDate = new Date(selected.date.valueOf());
        var startDate = new Date($('#DealsByEquipmentCategoryStartDate').val());
        if (startDate.getTime() > endDate.getTime()) {
            $('#DealsByEquipmentCategoryStartDate').datepicker('setDate', endDate);
        }
        $('#DealsByEquipmentCategoryStartDate').datepicker('setEndDate', endDate);
        getStatisticDataByUser();
    });    

    $('#chartDatePickerBox').hide();
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

function update_chart_data() {

    var interval =   $('#chartDateSelector').val();        
        if (interval == '-1')
            $('#chartDatePickerBox').show();
        else
            $('#chartDatePickerBox').hide();
            
    var startDate = new Date();
    var endDate = new Date();

    if (interval == '30')    
        startDate.setDate(endDate.getDate() - 30);        
    else if (interval == '7')
        startDate.setDate(endDate.getDate() - 7);
    else {
        startDate = $('#startDate').datepicker('getDate');
        endDate = $('#endDate').datepicker('getDate');
    }

    if (startDate == null)
        startDate =  new Date();
    
    if (endDate == null) {
        endDate = new Date();
    }

    endDate.setDate(endDate.getDate() +  1);

    $.ajax({
        url : base_url + 'Deals/getStatisticDataByDateRange', 
        method : 'POST',
        data : {
            startDate : formatDate(startDate),
            endDate : formatDate(endDate)
        },
        success : function (res) {
            var result = JSON.parse(res);
            
            var dates = result['date'];
            var counts  = result['counts'];
            var total_counts = result['total_counts'];

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

function getStatisticDataByUser() {

    var interval =   $('#dateSelector').val();
     
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
        startDate = $('#startUserDate').datepicker('getDate');
        endDate = $('#endUserDate').datepicker('getDate');
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
        url: base_url + "Deals/getStatisticDataByUser",
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

            $('#total_Count_by_user').html(totalValue);
            $('#detail_statistic_user_box').html(html);
        }
    });
}

function updateStaticsDataByDealType() {

    var interval =   $('#DealsByDealTypeDateSelector').val();        
    if (interval == '-2')
        $('#DealsByDealTypeDatePickerBox').show();
    else
        $('#DealsByDealTypeDatePickerBox').hide();
            
    var startDate = new Date();
    var endDate = new Date();


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
        url: base_url + "Deals/getStatisticDataByDealType",
        method: "POST",
        data : {
            interval : interval,
            startDate : formatDate(startDate),
            endDate : formatDate(endDate)
        },
        success: function (res) {

            var result = JSON.parse(res);
            var totalValue = 0;
            for (var i = 0; i < result.length - 2; i++) {
                if (!result[i]['name'].includes("Expir"))
                    totalValue += parseInt(result[i]['num']);
            }

            var html = '';
            for (var i = 0; i < result.length - 2; i++) {                
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

                var auctionCount = result[i]['num'];
                if (result[i]['name'] == getLocalizationWord('Auction')) {
                    html += '<div style="margin-left : 30px;">'
                    i++;
                    var expired_percent = Math.round(result[i]['num'] / auctionCount * 100);
                    html += '<div class="form-group mb-4">';
                    html += '<label class="d-block">' + result[i]['name'] + '<span class="float-right" style="color: #9367b4;">' + result[i]['num'] + '&nbsp<span style="font-size:12px; color: #a5a8ad;">(' + expired_percent + '%)</span></span></label>';
                    html += '<div class="progress progress-xxs">';
                    html += '<div class="progress-bar bg-indigo" role="progressbar" aria-valuenow="' + expired_percent + '" aria-valuemin="0" aria-valuemax="100" style="width: ' + expired_percent + '%;"></div>';
                    html += '</div>';
                    html += '</div>';

                    i++;
                    var expiring = Math.round(result[i]['num'] / auctionCount * 100);
                    html += '<div class="form-group mb-4">';
                    html += '<label class="d-block">' + result[i]['name'] + '<span class="float-right" style="color: #9367b4;">' + result[i]['num'] + '&nbsp<span style="font-size:12px; color: #a5a8ad;">(' + expiring + '%)</span></span></label>';
                    html += '<div class="progress progress-xxs">';
                    html += '<div class="progress-bar bg-indigo" role="progressbar" aria-valuenow="' + expiring + '" aria-valuemin="0" aria-valuemax="100" style="width: ' + expiring + '%;"></div>';
                    html += '</div>';
                    html += '</div>';
                    html += '</div>'
                }
            }

            //if (result[i]['num'] != 0) {
                var percent = Math.round(result[i]['num'] / totalValue * 100);
                if (totalValue == 0)
                    percent = 0;
    
                html += '<div class="form-group mb-4">';
                html += '<label class="d-block">' + result[i]['name'] + '<span class="float-right" style="color: #9367b4;">' + result[i]['num'] + '&nbsp<span style="font-size:12px; color: #a5a8ad;">(' + percent + '%)</span></span></label>';
                html += '<div class="progress progress-xxs">';
                html += '<div class="progress-bar bg-indigo" role="progressbar" aria-valuenow="' + percent + '" aria-valuemin="0" aria-valuemax="100" style="width: ' + percent + '%;"></div>';
                html += '</div>';
                html += '</div>';
            //}        
            i++;    

            html += '<div class="form-group mb-4">';
            html += '<label class="d-block">' + result[i]['name'] + '<span class="float-right" style="color: #9367b4;">' + result[i]['num'] + '</span></label>';            
            html += '<div class="progress progress-xxs">';
            html += '<div class="progress-bar bg-indigo" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="width: 100%;"></div>';
            html += '</div>';
            html += '</div>';

            $('#total_Count_by_category').html(totalValue);
            $('#detail_statistic_category_box').html(html);
        }
    });
}

function updateStaticsDataByCategory() {    

    var interval =   $('#DealsByEquipmentCategoryDateSelector').val();        
    if (interval == '-2')
        $('#DealsByEquipmentCategoryDatePickerBox').show();
    else
        $('#DealsByEquipmentCategoryDatePickerBox').hide();
            
    var startDate = new Date();
    var endDate = new Date();


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
        url: base_url + "Deals/getStatisticDataByCategory",
        method: "POST",
        data : {
            interval : interval,
            startDate : formatDate(startDate),
            endDate : formatDate(endDate)
        },
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
                
                var percent = Math.round(result[i]['num'] / totalValue * 100);
                if (totalValue == 0) {
                    percent = 0;
                }
                var EqCategory = '';
                if (lang == 'spanish')
                    EqCategory = get_translated_word(result[i]['name'])
                else 
                    EqCategory = result[i]['name'];

                html += '<div class="form-group mb-4">';
                html += '<label class="d-block">' + EqCategory + '<span class="float-right" style="color: #9367b4;">' + result[i]['num'] + '&nbsp<span style="font-size:12px; color: #a5a8ad;">(' + percent + '%)</span></span></label>';
                html += '<div class="progress progress-xxs">';
                html += '<div class="progress-bar bg-indigo" role="progressbar" aria-valuenow="' + percent + '" aria-valuemin="0" aria-valuemax="100" style="width: ' + percent + '%;"></div>';
                html += '</div>';
                html += '</div>';
            }

            $('#detail_statistic_deal_tye_box').html(html);
        }
    });
}
