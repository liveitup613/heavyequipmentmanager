$(function () {

    getTodayAddedDealStatus();
    getTodayAddedLead();
    getUpdatedLead();
    getAssignedOppWaitingContact();
    getUpdatedOppsToday();
    getScheduledCFU();
    getUpdatedCFU();
    getSalesStatus();
    getReadySalesStatus();
    renderGraph();
    getOpenOppsStatus();
    getActiveBuys();


    $('.loading-box').css('width', $(window).width());
    $('.loading-box').css('height', $(window).height());
    

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
        
        if (msg == 'new_truck' || msg == 'delete_truck' || msg == 'save_truck') {
            getTodayAddedDealStatus();
        }
        if (msg == 'new_lead'){
            getTodayAddedLead();
        }
        if (msg == 'save_contact' || msg == 'delete_lead') {
            getUpdatedLead();
        }
        if (msg == 'assign' || msg == 'cancel_assign') {
            getAssignedOppWaitingContact();
        }
        if (msg == 'assign') {
            getUpdatedOppsToday();
        }
        if (msg == 'refresh_cfu' || msg == 'update_cfu') {
            getScheduledCFU();
            getUpdatedCFU();
        }        
        if (msg == 'sales') {
            getSalesStatus();
            getReadySalesStatus();
        }
        if (msg == 'assign' || msg=='save_contact' || msg == 'close_opp' || msg == 'go_back_opp') 
        {
            getOpenOppsStatus();
        }
    }
});

function showSpinner() {
    $('.loading-box').css('display', 'flex');
}

function hiddenSpinner() {
    $('.loading-box').css('display', 'none');
}


function getTodayAddedDealStatus() {
    $.ajax({
        url : base_url + 'Deals/getTodayAddedDealStatus',
        type : 'post',
        success: function (res) {
            var data = JSON.parse(res);

            var total = data.Auction + data.For Sale + data.Consignment + data.Inventory;

            $('#AddedAuctionCount').html(data.Auction);
            $('#AddedFor SaleCount').html(data.For Sale);
            $('#AddedConsignmentCount').html(data.Consignment);
            $('#AddedInventoryCount').html(data.Inventory);

            $('#AddedDealsCount').html(total);
        }
    });
}

function getUpdatedLead() {
    $.ajax({
        url : base_url + 'Leads/getUpdatedLeadStatus',
        type : 'post',
        success : function (res) {
            var data = JSON.parse(res);
            
            $('#OpportunityCount').html(data.opportunity);
            $('#InfoCount').html(data.info);
            $('#NoLeadCount').html(data.noLead - data.info);

            updateUpdatedLeadTotal();
        }
    });
}

function updateUpdatedLeadTotal() {
    var opportunity = $('#OpportunityCount').html();
    var info = $('#InfoCount').html();
    var noLead = $('#NoLeadCount').html();
    var lead = $('#TodayAddedLeads').html();

    $('#UpdatedLead').html(Number(opportunity) + Number(info) + Number(noLead) + Number(lead));
}

function getTodayAddedLead() {
    $.ajax({
        url : base_url + 'Leads/getTodayAddedLeadStatus',
        type : 'post',
        success : function(res) {
            var data = JSON.parse(res);

            $('#TodayAddedLeads').html(data.count);

            updateUpdatedLeadTotal();
        }
    });
}

function getAssignedOppWaitingContact() {
    $.ajax({
        url : base_url + 'Opportunities/getAssignedOppsWaitingContact',
        type : 'post',
        data : {
            SalesRep : 'All'
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
            SalesRep : 'All'
        },
        success : function(res) {
            var data = JSON.parse(res);

            $('#UpdatedOppsCount').html(data.count);
            $('#StillInterestedOppCount').html(Number(data.count) - Number(data.closed));
            $('#ClosedOppsCount').html(data.closed);
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

function getSalesStatus() {
    $.ajax({
        url : base_url + 'Sales/getMonthlySalesByUserStatus',
        type : 'post',
        success : function(res) {
            var data = JSON.parse(res);
            $('#SalesCountForMonth').html(data.month);

            var totalValue = data.month;
            var users = data.users;
            var html = '';

            for (var i = 0; i < users.length; i++) {
                if (users[i]['num'] == 0)
                    continue;
                var percent = Math.round(users[i]['num'] / totalValue * 100);
                if (totalValue == 0) {
                    percent = 0;
                }
                html += '<div class="form-group mb-4">';
                html += '<label class="d-block">' +get_translated_word(users[i]['name']) + '<span class="float-right" style="color: #5CB65F;">' + users[i]['num'] + '&nbsp<span style="font-size:12px; color: #a5a8ad;">(' + percent + '%)</span></span></label>';
                html += '<div class="progress progress-xxs">';
                html += '<div class="progress-bar bg-green" role="progressbar" aria-valuenow="' + percent + '" aria-valuemin="0" aria-valuemax="100" style="width: ' + percent + '%;"></div>';
                html += '</div>';
                html += '</div>';
            }

            $('#SalesByUser').html(html);
        }
    })
}

function getReadySalesStatus() {
    $.ajax({
        url : base_url + 'Sales/getReadySalesStatus',
        type : 'post',
        data : {
            SalesRep : 'All'
        },
        success : function(res) {
            var data = JSON.parse(res);

            $('#ReadyStatusSalesCount').html(data.ready);
            
            $('#USDRemainingAmount').html(numberWithCommas(Number(data.usd).toFixed(0)) + ' USD');
            $('#MXNRemainingAmount').html(numberWithCommas(Number(data.mxn).toFixed(0)) + ' MXN');
        }
    });
}

function getOpenOppsStatus() {
    $.ajax({
        url : base_url + 'Opportunities/getOpenOpps',
        type : 'post',
        data : {
            SalesRep : 'All'
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

function getActiveBuys() {
    $.ajax({
        url: base_url + 'Procurement/getActiveBuyStatus',
        type: 'post',
        success: function(res) {
            var data = JSON.parse(res);

            $('#ActiveBuyCount').html(data.Total);
        }
    });

    $.ajax({
        url: base_url + 'Procurement/getRemainingDepositStatus',
        type: 'post',
        success: function(res) {
            var data =  JSON.parse(res);

            $('#USDRemainingAmountForBuy').html(numberWithCommas(data.USD) + ' USD');
        }
    })
}

function renderGraph() {
    showSpinner();
    
    $.ajax({
        url : base_url + 'Activity/getGraphDataForToday',
        type : 'post',        
        success : function(res) {
            hiddenSpinner();
            data = JSON.parse(res);

            var activityGraph = $.plot('#flotChart', [{
                data: data.data,         
                color: '#77797c',
                lines: {
                    fillColor: { colors: [{ opacity: 0 }, { opacity: 0.4 }]}
                }
                }],{
                series: {
                    shadowSize: 0,
                    lines: {
                        show: true,
                        lineWidth: 2,
                        fill: true
                    }                   
                },
                grid: {
                    borderWidth: 0,
                    labelMargin: 8,
                },
                yaxis: {
                    show: true,
                    min: 0,
                    max: (parseInt(data.max_cnt / 20) + 1) * 20,                    
                },
                xaxis: {
                    show: true,
                    ticks: data.trick
                }        
            });
        }
    });    
}