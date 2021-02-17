
var autoIntervalValue = 0;
var autoVal = null;


function showSpinner() {
    $('.loading-box').css('display', 'flex');
}

function hiddenSpinner() {
    $('.loading-box').css('display', 'none');
}

$(document).ready(function () {
    $('.loading-box').css('width', $(window).width());
    $('.loading-box').css('height', $(window).height());

    getTVModeDealData();
});



///////
function setAutoFlow() {
    if (autoIntervalValue != 0) {
        autoVal = setInterval(function () {
            var id = $('.main-tv-mode-image').data('id');
            getTVModeDealData(id, 0);

        }, autoIntervalValue);
    }
}



/*
*  parameter
*     first : current data's ID
*      second: direction [if 0 , next.  else 1, pre]
*
*/

function getTVModeDealData(id = 0, direction = 0) {
    showSpinner();
    $.ajax({
        url: base_url + 'Deals/getTvModeData',
        type: 'POST',
        data: {
            'ID': id,
            'direction': direction
        },
        success: function (res) {
            hiddenSpinner();
            var result = JSON.parse(res);
            if (result.success == true) {
                var data = result.data;
                var contentItem = '';
                contentItem += '<div class="main-tv-mode-image-box" style="background-image: url(\'' + base_url + 'assets/images/primaryImages/' + data.PrimaryImage + '\')" >';
                contentItem += '<img class="main-tv-mode-image"  data-id="' + data.ID + '" src="' + base_url + 'assets/images/primaryImages/' + data.PrimaryImage + '" />';
                contentItem += '</div>';
                var footerImage = '';
                if (data.DealType == 'Auction') {
                    footerImage = 'auction-banner-footer.png';
                } else if (data.DealType == 'Supplier') {
                    footerImage = 'supplier-banner-footer.png';
                } else if (data.DealType == 'Consignment') {
                    footerImage = 'consignment-banner-footer.png';
                } else if (data.DealType == 'Inventory') {
                    footerImage = 'inventory-banner-footer.png';
                }

                contentItem += '<img class="flex-caption" src="' + base_url + 'assets/images/ribbon/' + footerImage + '" />';


                $('#image-box').html(contentItem);

                var title = getTitleFromDatabase(data);
                title = title.substring(0, 32);
                $('.tvmode-title').html(title.toLocaleUpperCase());
                $('.tvmode-translate').html(get_translated_word(data.EqCategory).toUpperCase());

                var item1 = getSpecialFieldForTVMode(data);
                $('#tvmode-detail-box1').html(item1);

                var item2 = getPriceForTvMode(data);
                $('#tvmode-detail-price').html(item2);

            } else {
                $('#image-box').html('<span class="tvmode-title">No Data</span>');
            }
        }
    });
}

/////////////
$('#nextBtn').click(function () {
    var id = $('.main-tv-mode-image').data('id');
    getTVModeDealData(id, 0);
});

$('#prevBtn').click(function () {
    var id = $('.main-tv-mode-image').data('id');
    getTVModeDealData(id, 1);
});


//////////////////////

$('#auto-setting').change(function () {
    var val = parseInt($(this).val());
    autoIntervalValue = val * 1000 * 60;
    if (autoVal) {
        clearInterval(autoVal);
    }
    setAutoFlow();

});
////////////////////////
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


////////////////////////
function getCommonFieldForTVMode(data) {

    for (var i = 0; i <= Common_field_array.length; i++) {
        if (data.DealType == Common_field_array[i].name) {
            var input_array = Common_field_array[i].common_input_element;
            var result = '';
            result += "<li class='tvmode-item'><div>Tipo de trato:&nbsp;</div> " + get_translated_word(data.DealType) + '</li>';

            for (item of input_array) {

                if (item == 'StartDate') {
                    result += "<li class='tvmode-item'><div>Start Date:&nbsp;</div> " + data.StartDate + '</li>';
                }
                if (item == 'EndDate') {
                    result += "<li class='tvmode-item'><div>End Date:&nbsp;</div> " + data.EndDate + '</li>';
                }

                if (item == 'EqYear') {
                    result += "<li class='tvmode-item'><div>Year:&nbsp;</div> " + data.EqYear + '</li>';
                }
                if (item == 'EqMake') {
                    result += "<li class='tvmode-item'><div>Make:&nbsp;</div> " + data.EqMake + '</li>';
                }
                if (item == 'EqModel') {
                    result += "<li class='tvmode-item'><div>Model:&nbsp;</div> " + data.EqModel + '</li>';
                }
                if (item == 'EqSN') {
                    result += "<li class='tvmode-item'><div>SN:&nbsp;</div> " + data.EqSN + '</li>';
                }
                if (item == 'Contact') {
                    result += "<li class='tvmode-item'><div>Contact:&nbsp;</div> " + data.Contact + '</li>';
                }
                if (item == 'ContactPhone') {
                    result += "<li class='tvmode-item'><div>Contact Phone:&nbsp;</div> " + data.ContactPhone + '</li>';
                }
                if (item == 'Warehouse') {
                    result += "<li class='tvmode-item'><div>Warehouse:&nbsp;</div> " + data.Warehouse + '</li>';
                }
                if (item == 'Country') {
                    var city = data.City;
                    var state = data.State + ', ';
                    var country = data.Country;
                    if (city) {
                        city = city + ', ';
                    }
                    result += "<li class='tvmode-item'><div>Location:&nbsp;</div> " + city + state + country + '</li>';
                }
            }

            return result;
        }
    }
}




function getSpecialFieldForTVMode(data) {

    var itemList = get_detail_data_for_deal(data);
    var result = "";

    for (var i = 1; i < itemList.length; i++) {
        result += "<div class='tvmode-item'>- " + itemList[i] + '</div>';
    }

    return result;    
}


function getPriceForTvMode(data) {

    var result = '';
    result += "<div class='tvmode-price-item'><div  class='tvmode-detail-label'><h1 class='tvmode-price-label'>TOTAL:&nbsp;</h1></div><h1 class='tvmode-price-data'> " + numberWithCommas(data.Total) + '</h1></div>';
    if(data.DealType == 'Auction'){
        result += "<div class='tvmode-price-item'><div  class='tvmode-detail-label'><h1 class='tvmode-price-label'>PUJA MÁXIMA:&nbsp;</h1></div><h1 class='tvmode-price-data'> " + numberWithCommas(data.Price) + '</h1></div>';
    }
    

    return result;

}