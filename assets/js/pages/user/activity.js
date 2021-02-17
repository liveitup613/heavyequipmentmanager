/*
@@ LEAD-MANAGEMENT.JS
@@ By Zheng
@@ 2020-02-15
*/

var managementTB;
var activityGraph;

// column data
var columnData = [
    // {
    //     "title": "ACTION",
    //     sortable: false,    
    //     "render": function (data, type, full, meta) {           
    //         var contact = '<button  class="col-lg-4 btn btn-sm btn-default btn-action"  data-toggle="tooltip" data-placement="top" title="INFO" onclick="onInfo(' + full.ID + ')"><i class="icon-info"></i></button>';

    //         return  '<div class="row" style = "width : 120px;">' + 
    //                 contact + contact + contact
    //                 '</div>';
    //     }
    // },
    {
        "title": "Date",
        sortable: true,
        "render": function (data, type, full, meta) {            

            return getSecondRemovedDateTime(full.Date);
        }
    },{
        "title": "User",
        sortable: false,
        "render": function (data, type, full, meta) {

            return full.Username;
        }
    }, {
        "title": "Activity",
        sortable: false,
        render: function (data, type, full, meta) {            
            
            return full.Activity;
        }
    // }, {
    //     "title": "Objective Table",
    //     sortable: true,
    //     render: function (data, type, full, meta) {
            
    //         return full.ObjectiveTable;
    //     }
    // },  {
    //     "title": "Objective ID",
    //     sortable: false,
    //     render: function (data, type, full, meta) {
    //         if (full.ObjectiveID != 0)                
    //             return full.ObjectiveID;
    //         return '';
    //     }
    }, {
        'title' : 'Webpage',
        sortable : false,
        render: function (data, type, full, meta) {
            return full.Webpage;
        }
    }, {
        'title' : 'IP',
        sortable : false,
        render : function (data, type, full, meta) {
            return full.IP;
        }
    }, {
        "title": "Status",
        sortable: true,
        render: function (data, type, full, meta) {
            if (full.Status == 'Success')
                return '<span class="badge badge-success">Success</span>';            
            return '<span class="badge badge-danger">Error</span>';
        }
    // }, {
    //     "title": "Error Msg",
    //     sortable: true,
    //     render: function (data, type, full, meta) {
    //         return full.Error;
    //     }
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

        if (msg == 'activity') {
            updateUserDropDown();
            updateActivityDropDown();
            rmanagementTB.ajax.reload(null, false);
        }
    }    

    // Set Users

    updateUserDropDown();

    // Set Activities

    updateActivityDropDown();


    $('#minDateInput').datepicker().on('changeDate', function (selected) {
        var startDate = new Date(selected.date.valueOf());
        var endDate = new Date($('#maxDateInput').val());
        if (startDate.getTime() > endDate.getTime()) {

            $('#maxDateInput').datepicker('setDate', startDate);
        }
        $('#maxDateInput').datepicker('setStartDate', startDate);
    });

    var today = new Date().toLocaleString("en-US", {timeZone: "America/Phoenix"});
    today = new Date(today);
    var minDate = new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000);    

    $('#minDateInput').datepicker('setDate', minDate);

    renderTB();

    renderGraph();
    
});

function updateActivityDropDown() {
    var currentVal = $('#activityInput').val();
    $.ajax({
        url : base_url + 'Activity/getAllActivities',
        type : 'post',
        success : function(data) {
            result  = JSON.parse(data);

            var activities = "<option value='all'>All Activity</option>";
            
            for (var i = 0; i < result.length ; i++) {
                activities += '<option value="' + result[i].Activity +'">' + result[i].Activity + '</option>';
            }

            $('#activityInput').html(activities);
            $('#activityInput').val(currentVal);
        } 
    });
}

function updateUserDropDown() {
    var currentVal = $('#userInput').val();
    $.ajax({
        url : base_url + 'Activity/getAllUserName',
        type : 'post',
        success : function(data) {
            result = JSON.parse(data);

            var users = "<option value='all'>All User</option>";
            
            for (var i = 0; i < result.length ; i++) {
                users += '<option value="' + result[i].Username +'">' + result[i].Username + '</option>';
            }

            $('#userInput').html(users);
            $('#userInput').val(currentVal);
        }
    });   
}


function renderTB() {
    managementTB = $('#management-table').DataTable({
        'processing': true,
        'serverSide': true,
        'ajax': {
            url: base_url + 'Activity/getActivityData',
            type: 'POST',
            data: function (d) {                
                d.user = $('#userInput').val();
                d.minDate = $('#minDateInput').val();
                d.maxDate = $('#maxDateInput').val();
                d.activity = $('#activityInput').val();
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
        'order': [[5, 'asc']],
        'autoWidth': true,
        'pageLength' : 50
    });
}

function renderGraph() {
    showSpinner();
    
    $.ajax({
        url : base_url + 'Activity/getGraphData',
        type : 'post',
        data : {
            'user': $('#userInput').val(),
            'minDate': $('#minDateInput').val(),
            'maxDate': $('#maxDateInput').val(),
            'activity': $('#activityInput').val(),
        },
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
                        lineWidth: 1,
                        fill: true
                    }                   
                },
                grid: {
                    borderWidth: 0,
                    labelMargin: 8
                },
                yaxis: {
                    show: true,
                    min: 0,
                    max: (parseInt(data.max_cnt / 50) + 1) * 50                    
                },
                xaxis: {
                    show: true,
                    ticks: data.trick
                }                
            });
        }
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
    renderGraph();
    
    if (refresh == false)
        managementTB.ajax.reload(null, false);
    else
        managementTB.ajax.reload();
}