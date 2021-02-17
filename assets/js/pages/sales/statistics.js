

var websocket = null;


$(function () {
 
    updateSalesPanel();
    updateSalesByDealStatusPanel();
    updateSalesByDealTypePanel();
    updateSalesByEqCategory();
    updateNonInventoryByUploadedUsers();
    updateSalesBySourcePanel();
    updateDepositsPanel();

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
        }
    }

    $('#SalesDateSelector').change(function(){ 
        updateSalesPanel();
    });

    $('#SalesByDealStatusDateSelector').change(function(){ 
        updateSalesByDealStatusPanel();
    });

    $('#SalesByDealTypeDateSelector').change(function(){ 
        updateSalesByDealTypePanel();
    });

    $('#SalesByEqCategoryDateSelector').change(function(){ 
        updateSalesByEqCategory();
    });

    $('#NonInventoryDateSelector').change(function(){ 
       updateNonInventoryByUploadedUsers();
    }); 

    $('#SalesBySourceDateSelector').change(function(){ 
        updateSalesBySourcePanel();
     }); 

    $('#DepositsDateSelector').change(function(){ 
        updateDepositsPanel();
    }); 
    

    
    // Sales Selector

    $('#SalesStartDate').datepicker('setStartDate', new Date('2020-01-06'));
    $('#SalesEndDate').datepicker('setEndDate', new Date);  
    $('#SalesEndDate').datepicker('setDate', new Date); 
    $('#SalesStartDate').datepicker('setEndDate', new Date)
        .on('changeDate', function(selected) {            
            var startDate = new Date(selected.date.valueOf());
            var endDate = new Date($('#SalesEndDate').val());

            if (startDate.getTime() > endDate.getTime())
                $('#SalesEndDate').datepicker('setDate', startDate);
            $('#SalesEndDate').datepicker('setStartDate', startDate);
            updateSalesPanel();
        });

        
    $('#SalesEndDate').datepicker({
        setDate: new Date()
    }).on('changeDate', function (selected) {
        
        var endDate = new Date(selected.date.valueOf());
        var startDate = new Date($('#SalesStartDate').val());
        if (startDate.getTime() > endDate.getTime()) {
            $('#SalesStartDate').datepicker('setDate', endDate);
        }
        $('#SalesStartDate').datepicker('setEndDate', endDate);
        updateSalesPanel();
    });   


    // SAles By Equipment Category

    $('#SalesByEqCategoryStartDate').datepicker('setStartDate', new Date('2020-01-06'));
    $('#SalesByEqCategoryEndDate').datepicker('setEndDate', new Date);  
    $('#SalesByEqCategoryEndDate').datepicker('setDate', new Date); 
    $('#SalesByEqCategoryStartDate').datepicker('setEndDate', new Date)
        .on('changeDate', function(selected) {            
            var startDate = new Date(selected.date.valueOf());
            var endDate = new Date($('#SalesByEqCategoryEndDate').val());

            if (startDate.getTime() > endDate.getTime())
                $('#SalesByEqCategoryEndDate').datepicker('setDate', startDate);
            $('#SalesByEqCategoryEndDate').datepicker('setStartDate', startDate);
            updateSalesByEqCategory();
        });

        
    $('#SalesByEqCategoryEndDate').datepicker({
        setDate: new Date()
    }).on('changeDate', function (selected) {
        
        var endDate = new Date(selected.date.valueOf());
        var startDate = new Date($('#SalesByEqCategoryStartDate').val());
        if (startDate.getTime() > endDate.getTime()) {
            $('#SalesByEqCategoryStartDate').datepicker('setDate', endDate);
        }
        $('#SalesByEqCategoryStartDate').datepicker('setEndDate', endDate);
        updateSalesByEqCategory();
    });
    
    // Sales By Deal Status

    $('#SalesByDealStatusStartDate').datepicker('setStartDate', new Date('2020-01-06'));
    $('#SalesByDealStatusEndDate').datepicker('setEndDate', new Date);  
    $('#SalesByDealStatusEndDate').datepicker('setDate', new Date); 
    $('#SalesByDealStatusStartDate').datepicker('setEndDate', new Date)
        .on('changeDate', function(selected) {            
            var startDate = new Date(selected.date.valueOf());
            var endDate = new Date($('#SalesByDealStatusEndDate').val());

            if (startDate.getTime() > endDate.getTime())
                $('#SalesByDealStatusEndDate').datepicker('setDate', startDate);
            $('#SalesByDealStatusEndDate').datepicker('setStartDate', startDate);
            updateSalesByDealStatusPanel();
        });

        
    $('#SalesByDealStatusEndDate').datepicker({
        setDate: new Date()
    }).on('changeDate', function (selected) {
        
        var endDate = new Date(selected.date.valueOf());
        var startDate = new Date($('#SalesByDealStatusStartDate').val());
        if (startDate.getTime() > endDate.getTime()) {
            $('#SalesByDealStatusStartDate').datepicker('setDate', endDate);
        }
        $('#SalesByDealStatusStartDate').datepicker('setEndDate', endDate);
        updateSalesByDealStatusPanel();
    }); 


    // Sales By Deal Type

    $('#SalesByDealTypeStartDate').datepicker('setStartDate', new Date('2020-01-06'));
    $('#SalesByDealTypeEndDate').datepicker('setEndDate', new Date);  
    $('#SalesByDealTypeEndDate').datepicker('setDate', new Date); 
    $('#SalesByDealTypeStartDate').datepicker('setEndDate', new Date)
        .on('changeDate', function(selected) {            
            var startDate = new Date(selected.date.valueOf());
            var endDate = new Date($('#SalesByDealTypeEndDate').val());

            if (startDate.getTime() > endDate.getTime())
                $('#SalesByDealTypeEndDate').datepicker('setDate', startDate);
            $('#SalesByDealTypeEndDate').datepicker('setStartDate', startDate);
            updateSalesByDealTypePanel();
        });

        
    $('#SalesByDealTypeEndDate').datepicker({
        setDate: new Date()
    }).on('changeDate', function (selected) {
        
        var endDate = new Date(selected.date.valueOf());
        var startDate = new Date($('#SalesByDealTypeStartDate').val());
        if (startDate.getTime() > endDate.getTime()) {
            $('#SalesByDealTypeStartDate').datepicker('setDate', endDate);
        }
        $('#SalesByDealTypeStartDate').datepicker('setEndDate', endDate);
        updateSalesByDealTypePanel();
    }); 


    // No Inventory

    $('#NonInventoryStartDate').datepicker('setStartDate', new Date('2020-01-06'));
    $('#NonInventoryEndDate').datepicker('setEndDate', new Date);  
    $('#NonInventoryEndDate').datepicker('setDate', new Date); 
    $('#NonInventoryStartDate').datepicker('setEndDate', new Date)
        .on('changeDate', function(selected) {            
            var startDate = new Date(selected.date.valueOf());
            var endDate = new Date($('#NonInventoryEndDate').val());

            if (startDate.getTime() > endDate.getTime())
                $('#NonInventoryEndDate').datepicker('setDate', startDate);
            $('#NonInventoryEndDate').datepicker('setStartDate', startDate);
            updateNonInventoryByUploadedUsers();
        });

        
    $('#NonInventoryEndDate').datepicker({
        setDate: new Date()
    }).on('changeDate', function (selected) {
        
        var endDate = new Date(selected.date.valueOf());
        var startDate = new Date($('#NonInventoryStartDate').val());
        if (startDate.getTime() > endDate.getTime()) {
            $('#NonInventoryStartDate').datepicker('setDate', endDate);
        }
        $('#NonInventoryStartDate').datepicker('setEndDate', endDate);
        updateNonInventoryByUploadedUsers();
    }); 

    // Sales By Source

    $('#SalesBySourceStartDate').datepicker('setStartDate', new Date('2020-01-06'));
    $('#SalesBySourceEndDate').datepicker('setEndDate', new Date);  
    $('#SalesBySourceEndDate').datepicker('setDate', new Date); 
    $('#SalesBySourceStartDate').datepicker('setEndDate', new Date)
        .on('changeDate', function(selected) {            
            var startDate = new Date(selected.date.valueOf());
            var endDate = new Date($('#SalesBySourceEndDate').val());

            if (startDate.getTime() > endDate.getTime())
                $('#SalesBySourceEndDate').datepicker('setDate', startDate);
            $('#SalesBySourceEndDate').datepicker('setStartDate', startDate);
            updateSalesBySourcePanel();
        });

        
    $('#SalesBySourceEndDate').datepicker({
        setDate: new Date()
    }).on('changeDate', function (selected) {
        
        var endDate = new Date(selected.date.valueOf());
        var startDate = new Date($('#SalesBySourceStartDate').val());
        if (startDate.getTime() > endDate.getTime()) {
            $('#SalesBySourceStartDate').datepicker('setDate', endDate);
        }
        $('#SalesBySourceStartDate').datepicker('setEndDate', endDate);
        updateSalesBySourcePanel();
    }); 

    // Deposits

    $('#DepositsStartDate').datepicker('setStartDate', new Date('2020-01-06'));
    $('#DepositsEndDate').datepicker('setEndDate', new Date);  
    $('#DepositsEndDate').datepicker('setDate', new Date); 
    $('#DepositsStartDate').datepicker('setEndDate', new Date)
        .on('changeDate', function(selected) {            
            var startDate = new Date(selected.date.valueOf());
            var endDate = new Date($('#DepositsEndDate').val());

            if (startDate.getTime() > endDate.getTime())
                $('#DepositsEndDate').datepicker('setDate', startDate);
            $('#DepositsEndDate').datepicker('setStartDate', startDate);
            updateDepositsPanel();
        });

        
    $('#DepositsEndDate').datepicker({
        setDate: new Date()
    }).on('changeDate', function (selected) {
        
        var endDate = new Date(selected.date.valueOf());
        var startDate = new Date($('#DepositsStartDate').val());
        if (startDate.getTime() > endDate.getTime()) {
            $('#DepositsStartDate').datepicker('setDate', endDate);
        }
        $('#DepositsStartDate').datepicker('setEndDate', endDate);
        updateDepositsPanel();
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

function updateSalesPanel() {

    var interval = $('#SalesDateSelector').val();    
    
    if (interval == '-2')
        $('#SalesDatePickerBox').show();
    else
        $('#SalesDatePickerBox').hide();

    var startDate = new Date();
    var endDate = new Date();


    if (interval == '30')    
        startDate.setDate(endDate.getDate() - 30);        
    else if (interval == '7')
        startDate.setDate(endDate.getDate() - 7);
    else if (interval == '0')
        startDate = new Date('2020-01-06');
    else {
        startDate = $('#SalesStartDate').datepicker('getDate');
        endDate = $('#SalesEndDate').datepicker('getDate');
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
        url : base_url + 'Sales/getSalesStat', 
        method : 'POST',
        data : {
            Interval : interval,
            startDate : formatDate(startDate),
            endDate: formatDate(endDate)
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
                var SalesData = result[i]['data'];
                var completeSale = 0;
                var usdTotal = 0, usdDepost = 0;
                var mxnTotal = 0, mxnDepost = 0;

                for (var index = 0; index < SalesData.length; index++) {
                    if (Number(SalesData[index]['Total']).toFixed(0) == Number(SalesData[index]['TotalDeposit']))
                        completeSale++;
                    if (SalesData[index]['SalesCurrency'] == 'USD') {
                        usdTotal += Number(SalesData[index]['Total']);
                        usdDepost += Number(SalesData[index]['TotalDeposit']);
                    }
                    else {
                        mxnTotal += Number(SalesData[index]['Total']);
                        mxnDepost += Number(SalesData[index]['TotalDeposit']);
                    }
                }

                var percent = Math.round(completeSale / result[i]['num'] * 100);

                html += '<div class="form-group">';
                html += '<label class="d-block">' + result[i]['name'] + '<span class="float-right text-info">' + result[i]['num'] + '&nbsp<span style="font-size:12px; color: #a5a8ad;">(' + completeSale +')</span></span></label>';                
                html += '</div>';
                html += '<hr>';
                html += '<div style="margin-left : 32px;">';                

                // USD
                if (usdTotal != 0) {
                    percent = Math.round(usdDepost / usdTotal * 100);
                    html += '<div class="form-group mb-4">';
                    html += '<label class="d-block">USD<span class="float-right" style="color: #9367b4;">' + percent + '%&nbsp<span style="font-size:12px; color: #a5a8ad;">(' + numberWithCommas(usdTotal.toFixed(0)) + ')</span></span></label>';
                    html += '<div class="progress progress-xxs">';
                    html += '<div class="progress-bar bg-indigo" role="progressbar" aria-valuenow="' + percent + '" aria-valuemin="0" aria-valuemax="100" style="width: ' + percent + '%;"></div>';
                    html += '</div>';
                    html += '</div>';
                }               

                // MXN
                if (mxnTotal != 0) {
                    percent = Math.round(mxnDepost / mxnTotal * 100);
                    html += '<div class="form-group mb-4">';
                    html += '<label class="d-block">MXN<span class="float-right" style="color: #9367b4;">' + percent + '%&nbsp<span style="font-size:12px; color: #a5a8ad;">(' + numberWithCommas(mxnTotal.toFixed(0)) + ')</span></span></label>';
                    html += '<div class="progress progress-xxs">';
                    html += '<div class="progress-bar bg-indigo" role="progressbar" aria-valuenow="' + percent + '" aria-valuemin="0" aria-valuemax="100" style="width: ' + percent + '%;"></div>';
                    html += '</div>';
                    html += '</div>';
                }
                html += '</div>';
            }

            $('#TotalSalesCount').html(totalValue);
            $('#SalesDetailPanel').html(html);
        }
    });
}

function updateSalesByDealStatusPanel() {
    var interval = $('#SalesByDealStatusDateSelector').val();

    if (interval == '-2')
        $('#SalesByDealStatusDatePickerBox').show();
    else
        $('#SalesByDealStatusDatePickerBox').hide();

    var startDate = new Date();
    var endDate = new Date();


    if (interval == '30')    
        startDate.setDate(endDate.getDate() - 30);        
    else if (interval == '7')
        startDate.setDate(endDate.getDate() - 7);
    else if (interval == '0')
        startDate = new Date('2020-01-06');
    else {
        startDate = $('#SalesByDealStatusStartDate').datepicker('getDate');
        endDate = $('#SalesByDealStatusEndDate').datepicker('getDate');
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
        url : base_url + 'Sales/getSalesStatByDealStatus',
        type : 'post',
        data : {
            Interval : interval,
            startDate: formatDate(startDate),
            endDate: formatDate(endDate)
        },
        success : function (res) {
            var result =  JSON.parse(res);

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

            $('#TotalSalesByDealStatusCount').html(totalValue);
            $('#SalesByDealStatusDetailPanel').html(html);
        }
    });
}

function updateSalesByDealTypePanel() {
    var interval = $('#SalesByDealTypeDateSelector').val();

    if (interval == '-2')
        $('#SalesByDealTypeDatePickerBox').show();
    else
        $('#SalesByDealTypeDatePickerBox').hide();

    var startDate = new Date();
    var endDate = new Date();


    if (interval == '30')    
        startDate.setDate(endDate.getDate() - 30);        
    else if (interval == '7')
        startDate.setDate(endDate.getDate() - 7);
    else if (interval == '0')
        startDate = new Date('2020-01-06');
    else {
        startDate = $('#SalesByDealTypeStartDate').datepicker('getDate');
        endDate = $('#SalesByDealTypeEndDate').datepicker('getDate');
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
        url : base_url + 'Sales/getSalesStatByDealType',
        type : 'post',
        data : {
            Interval : interval,
            startDate: formatDate(startDate),
            endDate: formatDate(endDate)
        },
        success : function (res) {
            var result =  JSON.parse(res);

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

            $('#TotalSalesByDealTypeCount').html(totalValue);
            $('#SalesByDealTypeDetailPanel').html(html);
        }
    });
}

function updateSalesByEqCategory() {
    var interval = $('#SalesByEqCategoryDateSelector').val();

    if (interval == '-2')
        $('#SalesByEqCategoryDatePickerBox').show();
    else
        $('#SalesByEqCategoryDatePickerBox').hide();

    var startDate = new Date();
    var endDate = new Date();


    if (interval == '30')    
        startDate.setDate(endDate.getDate() - 30);        
    else if (interval == '7')
        startDate.setDate(endDate.getDate() - 7);
    else if (interval == '0')
        startDate = new Date('2020-01-06');
    else {
        startDate = $('#SalesByEqCategoryStartDate').datepicker('getDate');
        endDate = $('#SalesByEqCategoryEndDate').datepicker('getDate');
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
        url : base_url + 'Sales/getSalesStatByEqCategory',
        type : 'post',
        data: {
            Interval : interval,
            startDate: formatDate(startDate),
            endDate: formatDate(endDate)
        },
        success: function (res) {
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
                html += '<label class="d-block">' + ( lang == 'english' ? result[i]['name'] : get_translated_word( result[i]['name'] ))+ '<span class="float-right" style="color: #9367b4;">' + result[i]['num'] + '&nbsp<span style="font-size:12px; color: #a5a8ad;">(' + percent + '%)</span></span></label>';
                html += '<div class="progress progress-xxs">';
                html += '<div class="progress-bar bg-indigo" role="progressbar" aria-valuenow="' + percent + '" aria-valuemin="0" aria-valuemax="100" style="width: ' + percent + '%;"></div>';
                html += '</div>';
                html += '</div>';
            }

            $('#TotalSalesByEqCategoryCount').html(totalValue);
            $('#SalesByEqCategoryDetailPanel').html(html);
        }
    })
}

function updateNonInventoryByUploadedUsers() {
    var interval = $('#NonInventoryDateSelector').val();

    if (interval == '-2')
        $('#NonInventoryDatePickerBox').show();
    else
        $('#NonInventoryDatePickerBox').hide();

    var startDate = new Date();
    var endDate = new Date();


    if (interval == '30')    
        startDate.setDate(endDate.getDate() - 30);        
    else if (interval == '7')
        startDate.setDate(endDate.getDate() - 7);
    else if (interval == '0')
        startDate = new Date('2020-01-06');
    else {
        startDate = $('#NonInventoryStartDate').datepicker('getDate');
        endDate = $('#NonInventoryEndDate').datepicker('getDate');
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
        url : base_url + 'Sales/getNonInventoryByUploadedUser',
        type : 'post',
        data : {
            Interval : interval,
            startDate: formatDate(startDate),
            endDate: formatDate(endDate)
        },
        success : function(res) {
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

            $('#TotalNonInventoryCount').html(totalValue);
            $('#NonInventoryDetailPanel').html(html);
        }
    });
}

function updateSalesBySourcePanel() {
    var interval = $('#SalesBySourceDateSelector').val();

    if (interval == '-2')
        $('#SalesBySourceDatePickerBox').show();
    else
        $('#SalesBySourceDatePickerBox').hide();

    var startDate = new Date();
    var endDate = new Date();


    if (interval == '30')    
        startDate.setDate(endDate.getDate() - 30);        
    else if (interval == '7')
        startDate.setDate(endDate.getDate() - 7);
    else if (interval == '0')
        startDate = new Date('2020-01-06');
    else {
        startDate = $('#SalesBySourceStartDate').datepicker('getDate');
        endDate = $('#SalesBySourceEndDate').datepicker('getDate');
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
        url : base_url + 'Sales/getSalesBySourceData',
        type : 'post',
        data : {
            Interval : interval,
            startDate: formatDate(startDate),
            endDate: formatDate(endDate)
        },
        success : function(res) {
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

            $('#TotalSalesBySourceCount').html(totalValue);
            $('#SalesBySourceDetailPanel').html(html);
        }
    });
}

function updateDepositsPanel() {
    var interval = $('#DepositsDateSelector').val();

    if (interval == '-2')
        $('#DepositsDatePickerBox').show();
    else
        $('#DepositsDatePickerBox').hide();

    var startDate = new Date();
    var endDate = new Date();


    if (interval == '30')    
        startDate.setDate(endDate.getDate() - 30);        
    else if (interval == '7')
        startDate.setDate(endDate.getDate() - 7);
    else if (interval == '0')
        startDate = new Date('2020-01-06');
    else if (interval  == '1')
        startDate.setDate(endDate.getDate());
    else {
        startDate = $('#DepositsStartDate').datepicker('getDate');
        endDate = $('#DepositsEndDate').datepicker('getDate');
    }

    if (startDate == null)
        startDate =  new Date();
    
    if (endDate == null) 
        endDate = new Date();

    startDate = startDate.toLocaleString("en-US", {timeZone: "America/Phoenix"});
    endDate = endDate.toLocaleString("en-US", {timeZone: "America/Phoenix"});
    startDate = new Date(startDate);
    endDate = new Date(endDate);

    $.ajax({
        url : base_url + 'Sales/getDepositsDetail',
        type : 'post',
        data : {
            Interval : interval,
            startDate: formatDate(startDate),
            endDate: formatDate(endDate)
        },
        success : function(res) {
            var result = JSON.parse(res);
            var deposits = result.deposits;
           
            var html = '';
            
            for (var i = 0; i < deposits.length; i++) {
                html += '<div class="form-group mb-4">';
                html += '<label class="d-block">' + deposits[i]['Currency'] + '<span class="float-right" style="color: #9367b4;">' + numberWithCommas(Number(deposits[i]['TotalDeposit']).toFixed(2)) + " " + deposits[i]['Currency'] + '</span></label>';               
                html += '</div>';
            }

            $('#TotalDepositsCount').html(result.count);
            $('#DepositsDetailPanel').html(html);
        }
    });
}