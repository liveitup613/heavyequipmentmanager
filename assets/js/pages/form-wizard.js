

$(function () {

    // init websocket  
    websocket = new WebSocket(WS_URL);

    // data display from websocket
    websocket.onmessage = function (evt) {
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

        if (msg == 'save_contact') {
            toastr.warning(LocalizationMessage('New Opportunity Added'));
        }
    }


    $('.loading-box').css('width', $(window).width());
    $('.loading-box').css('height', $(window).height());
    $('#inputEqCategory').html(get_translated_equipment_category_element());

    //Horizontal form basic
    $('#wizard_horizontal_icon').steps({
        headerTag: 'h2',
        bodyTag: 'section',
        transitionEffect: 'slideLeft',
        onInit: function (event, currentIndex) {
            setButtonWavesEffect(event);
        },
        onStepChanged: function (event, currentIndex, priorIndex) {
            setButtonWavesEffect(event);
        }
    });

    //Horizontal form basic
    $('#wizard_horizontal').steps({
        headerTag: 'h2',
        bodyTag: 'section',
        transitionEffect: 'slideLeft',
        onInit: function (event, currentIndex) {
            setButtonWavesEffect(event);
        },
        onStepChanged: function (event, currentIndex, priorIndex) {
            setButtonWavesEffect(event);
        }
    });



    //Vertical form basic
    $('#wizard_vertical').steps({
        headerTag: 'h2',
        bodyTag: 'section',
        transitionEffect: 'slideLeft',
        stepsOrientation: 'vertical',
        onInit: function (event, currentIndex) {
            setButtonWavesEffect(event);
        },
        onStepChanged: function (event, currentIndex, priorIndex) {
            setButtonWavesEffect(event);
        }
    });

    var defaultTotal = 2500;

    $('#Total').val(defaultTotal);
    $('#NumTotal').html(numberWithCommas(defaultTotal));

    //Advanced form with validation
    var form = $('#wizard_with_validation').show();

    form.steps({
        headerTag: 'h3',
        bodyTag: 'fieldset',
        transitionEffect: 'slideLeft',
        labels: {
            current: "current step:",
            pagination: "Pagination",
            finish: getLocalizationWord("Finish"),
            next: getLocalizationWord("Next"),
            previous: getLocalizationWord("Prev"),
            loading: "Loading ..."
        },
        onStepChanging: function (event, currentIndex, newIndex) {

            if (currentIndex == 0 && newIndex == 1) {    
                $validate = true;            
                link = $('#inputSubmitLink').val();
                if (link != '') {
                    $.ajax({
                        url : base_url + '/Deals/checkHasLinkOnDatabase',
                        method : 'POST',
                        async: false,
                        cache: false,
                        timeout: 30000,
                        data : {
                            'link' : $('#inputSubmitLink').val()
                        },
                        success : function(res) {                            
                            if (res == true) {
                                $('.linkExistedMessage').show();
                                $validate = false;
                            }
                        }
                    });                    
                }

                // SN = $('#inputSubmitSN').val();
                // if (SN != '') {
                //     $.ajax({
                //         url : base_url + '/Deals/checkHasSNDatabase',
                //         method : 'POST',
                //         async: false,
                //         cache: false,
                //         timeout: 30000,
                //         data : {
                //             'SN' : $('#inputSubmitSN').val()
                //         },
                //         success : function(res) {       
                //             if (res == true) {
                //                 $('.snDuplicateMessage').show();   
                //                 $validate = false;
                //             }
                //         }
                //     });                     
                // }

                return $validate;
            }

            if (currentIndex == 1 && newIndex == 2) {
                var selected = $('#primaryImageUrl').val();
                if (selected == "") {
                    $('.imageSelecionMessage').html(LocalizationMessage('Please Select an Primary Image') + '!');
                    return false;
                }
            }

            if (currentIndex > newIndex) { return true; }

            if (currentIndex < newIndex) {
                form.find('.body:eq(' + newIndex + ') label.error').remove();
                form.find('.body:eq(' + newIndex + ') .error').removeClass('error');
            }

            form.validate().settings.ignore = ':disabled,:hidden';
            return form.valid();
        },
        onStepChanged: function (event, currentIndex, priorIndex) {

            var dealType = $('#inputDealType').val();

            if (currentIndex == 1 && priorIndex == 0) {

                // setting filter with number integer
                $('#EqYear').inputFilter(function (value) {
                    return /^\d*$/.test(value) && (value === "" || parseInt(value) <= 9999);
                });
                $('#TruckYear').inputFilter(function (value) {
                    return /^\d*$/.test(value) && (value === "" || parseInt(value) <= 9999);
                });

                $('#BuyPremium').inputFilter(function (value) {
                    return /^-?\d*[.]?\d*$/.test(value) && (value === "" || parseInt(value) <= 100);
                });

                $('#Margin').inputFilter(function (value) {
                    return /^-?\d*[.]?\d*$/.test(value);
                });

                $('#Length').inputFilter(function (value) {
                    return /^\d*$/.test(value) && (value === "" || parseInt(value) <= 1000000);
                });
                $('#Capacity').inputFilter(function (value) {
                    return /^-?\d*[.]?\d*$/.test(value) && (value === "" || parseInt(value) < 1000000);
                });


                $('#StartDate').datepicker({
                    startDate: new Date()
                }).on('changeDate', function (selected) {
                    var startDate = new Date(selected.date.valueOf());
                    var endDate = new Date($('#EndDate').val());
                    if (startDate.getTime() > endDate.getTime()) {

                        $('#EndDate').datepicker('setDate', startDate);
                    }
                    $('#EndDate').datepicker('setStartDate', startDate);
                });

                $('#EndDate').datepicker('setStartDate', new Date);


                showSpinner();

                $.ajax({
                    url: base_url + 'Deals/ScrapeWebsite',
                    type: 'post',
                    data: {
                        "EqCategory": $('#inputEqCategory').val(),
                        "EqAuctioneer": $('#inputAuctioneer').val(),
                        "DealType": dealType,
                        "Link": $('#inputSubmitLink').val()
                    },
                    success: function (res) {

                        hiddenSpinner();

                        // initElementControlInput();

                        if (res == "failed") {
                            console.log('scrap result-> failed result');
                        } else {
                            set_common_value_from_scrapdata(res);

                            ///////// special fields /////////////////
                            set_special_fields_value_from_scrapdata(res);   
                        }
                    }
                });
            }

            if (currentIndex == 3 && priorIndex == 2 /*&& 
                ($('#usernameInput').val() == 'Rodolfo' || $('#usernameInput').val() == 'm@cHunter')*/) {                            
                showSpinner();
                var EqCategory = $('#inputEqCategory').val();
                var DealType = $('#inputDealType').val();
                var Year = '';
                var Model = '';
                var Make = '';
                var _4WD = '';
                var Ext = '';
                var AuxHyd = '';
                var Cabin = '';
                var Country = '';
                var State = '';


                if ($('#EqYear').length)
                    Year = $('#EqYear').val();
                else if ($('#TruckYear').length)
                    Year = $('#TruckYear').val();

                if ($('#EqMake').length)
                    Make = $('#EqMake').val();
                else ($('#TruckMake').length)
                    Make = $('#TruckMake').val();

                if ($('#EqModel').length)
                    Model = $('#EqModel').val();
                else if ($('#TruckModel').length)
                    Model = $('#TruckModel').val();
                    
                if ($('#4WD').length)
                    _4WD = $('#4WD').val();
                if ($('#Ext').length)
                    Ext = $('#Ext').val();
                if ($('#AuxHyd').length)
                    AuxHyd = $('#AuxHyd').val();
                if ($('#Cab').length)
                    Cabin = $('#Cab').val();
                if ($('#Country').length)
                    Country = $('#Country').val();
                if ($('#State').length)
                    State = $('#State').val();
                
                $.ajax({
                    url : base_url + 'Deals/estimatePrice',
                    type : 'post' ,
                    data : {
                        'EqCategory': EqCategory,
                        'DealType': DealType,
                        'Year': Year,
                        'Make': Make,
                        'Model': Model,
                        '4WD': _4WD,
                        'Ext': Ext,
                        'AuxHyd': AuxHyd,
                        'Cabin': Cabin,
                        'Country' : Country,
                        'State': State
                    },
                    success : function(res) {
                        hiddenSpinner();
                        var data = JSON.parse(res);

                        if (data.success == false) {
                            console.log('Estimate Price -> failed');
                            return;
                        }
                        data = data.data;
                        console.log();
                        $('#Price').val(Math.round((data.Price) / 500) * 500);
                        $('#Customs').val(Math.round((data.Customs) / 500) * 500);
                        $('#Shipping').val(Math.round((data.Shipping) / 500) * 500)

                        Calculate();
                    },
                    error : function()
                    {
                        hiddenSpinner();
                    }
                });
            }

            if (currentIndex == 4 && priorIndex == 3) {

                /////// common preview fields ///////////////////
                set_preview_common_value_from_input_element();

                ////// special preview fields ////////////////////
                var category = $('#inputEqCategory').val();
                set_preview_value_from_input_element(category);

            }
            setButtonWavesEffect(event);
        },
        onFinishing: function (event, currentIndex) {
            form.validate().settings.ignore = ':disabled';

            var date = new Date();
            var y = date.getFullYear();
            var m = date.getMonth() + 1;
            var d = date.getDate();
            if (m < 10) {
                m = '0' + m;
            }
            if (d < 10) {
                d = '0' + d;
            }
            var uploadDate = y + '-' + m + '-' + d;

            var h = date.getHours();
            if (h < 10) {
                h = '0' + h;
            }

            var min = date.getMinutes();
            if (min < 10) {
                min = '0' + min;
            }

            var s = date.getSeconds();
            if (s < 10) {
                s = '0' + s;
            }

            var uploadTime = h + ':' + min + ':' + s;
            var uploadDateTime = uploadDate + ' ' + uploadTime;
            $('#uploadTime').val(uploadDateTime);

            // set title into mkTitle input
            setTitleIntoInput($('#inputEqCategory').val()); 

            showSpinner();          
            $.ajax({
                url: base_url + "Deals/AddNewTruck",
                method: "POST",
                data: new FormData($('#wizard_with_validation').get(0)),
                contentType: false,
                cache: false,
                processData: false,
                dataType: "json",
                success: function (result) {

                    if (result.success == true) {
                        logSuccessActivity("Add New Deal", result.picture.ID);
                        hiddenSpinner();
                        if (websocket != null) {
                            websocket.send(JSON.stringify({ 'msg': 'new_truck', 'poster': $('#usernameInput').val() }));
                        }
                        
                        location.href = base_url + "Deals";

                    } else {
                        logErrorActivity("Add New Deal Error", 0, result.message);
                        hiddenSpinner();
                    }
                }
            });



        },
        onFinished: function (event, currentIndex) {
            swal("Good job!", "Submitted!", "success");
        }
    });

    form.validate({
        highlight: function (input) {
            $(input).parents('.form-line').addClass('error');
        },
        unhighlight: function (input) {
            $(input).parents('.form-line').removeClass('error');
        },
        errorPlacement: function (error, element) {
            $(element).parents('.form-group').append(error);
        },
        rules: {
            'confirm': {
                equalTo: '#password'
            }
        }
    });


    // init setting  
    initializeControlElement();
  
});

///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
function initializeControlElement() {
    var EqCategory = $('#inputEqCategory').val();
    $('#deal-area-container').html(get_deal_area_elements('Auction'));
    $('#location-area-container').html(get_location_area_elements('Auction'));
    $('#equipment-area-container').html(get_equipment_area_elements(EqCategory));
    $('#truck-area-container').html(get_truck_area_elements(EqCategory));

    $('#preview-deal-area-container').html(get_deal_area_preview_elements('Auction'));
    $('#preview-location-area-container').html(get_location_area_preview_elements('Auction'));
    $('#preview-equipment-area-container').html(get_equipment_area_preview_elements(EqCategory));
    $('#preview-truck-area-container').html(get_truck_area_preview_elements(EqCategory));

    // $('#preview-input-field-container').html(get_common_field_preview_elements('Auction'));    
    // $('#special-fields-preview-container').html(get_special_field_preview_elements('Boom Truck'));
   
    $('.price-group').html(get_add_price_element('Auction'));    
    $('.preview-price-group').html( get_add_price_preview_element('Auction'));
}


////////////////////////////////////////////////////////
////////////////////////////////////////////////////////



function setButtonWavesEffect(event) {
    $(event.currentTarget).find('[role="menu"] li a').removeClass('');
    $(event.currentTarget).find('[role="menu"] li:not(.disabled) a').addClass('');
}

/////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////

function UserImageUpload() {
    $('#inputNewPrimayImage').click();
}

function uploadImageButtonSelected(element) {
    showSpinner();
    $.ajax({
        url: base_url + "Deals/UploadPrimaryImage",
        method: "POST",
        data: new FormData($('#upload-user-image-form').get(0)),
        contentType: false,
        cache: false,
        processData: false,
        dataType: "json",
        success: function (res) {
            hiddenSpinner();
            if (res.success == true) {
                $('#slide4').attr('src', res.url);
                $('#slide4').trigger('click');
            }
        }
    });
}

function readURL(input, avatar) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $(avatar)
                .attr('src', e.target.result);
        };

        reader.readAsDataURL(input.files[0]);
    }
}

function PrimaryImageSelected(image) {
    var images = $('.primary-image-gallery').find('img');

    for (var i = 0; i < images.length; i++) {
        $(images[i]).removeClass('img-thumbnail');
        $(images[i]).addClass('img-fluid');
    }
    $(image).removeClass('img-fluid');
    $(image).addClass('img-thumbnail');
    $('#primaryImageUrl').val($(image).attr('src'));

    $('.imageSelecionMessage').html('');

}

//////////////////////////////////////////////////
//////////////////////////////////////////////////

function Calculate() {

    var dealtype = $('#inputDealType').val();
    var total ;
    if (dealtype == 'Auction') {

        var valPrice = Number($('#Price').val());
        var valShipping = Number($('#Shipping').val());
        var valCustoms = Number($('#Customs').val());
        var valComm = Number($('#Commission').val());
        var valBuyPremium = Number($('#BuyPremium').val());

         total = (valBuyPremium * valPrice) / 100 + valPrice + valShipping + valCustoms + valComm;

    } else if (dealtype == 'Supplier') {

        var valPrice = Number($('#Price').val());
        var valShipping = Number($('#Shipping').val());
        var valCustoms = Number($('#Customs').val());
        var valComm = Number($('#Commission').val());
        total = valPrice + valShipping + valCustoms + valComm;

    } else if (dealtype == 'Consignment') {
        var valPrice = Number($('#Price').val());      
        var valComm = Number($('#Commission').val());
        total = valPrice + valComm;

    } else if (dealtype == 'Inventory') {
        var valPrice = Number($('#Price').val());  
        total = valPrice;

    }
   
    var decimal = total - Math.floor(total);
    if (decimal.toString().length > 2) {
        total = total.toFixed(2);
    }

    $('#Total').val(total);
    $('#NumTotal').html(numberWithCommas(total));
}



/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////

function onChangeCategory() {
    var category = $('#inputEqCategory').val();

    $('#equipment-area-container').html(get_equipment_area_elements(category));
    $('#truck-area-container').html(get_truck_area_elements(category));
    
    $('#preview-equipment-area-container').html(get_equipment_area_preview_elements(category));
    $('#preview-truck-area-container').html(get_truck_area_preview_elements(category));

    // var preview_special_elements = get_special_field_preview_elements(category);
    // $('#special-fields-preview-container').html(preview_special_elements);
}


function onChangeDealType() {

    $('#inputSubmitLink').val('');    

    var val = $('#inputDealType').val();
    $('#DealType').html(getLocalizationWord(val));
    $('#PreviewDealType').html(getLocalizationWord(val));

    $('#deal-area-container').html(get_deal_area_elements(val));
    if (val == 'For Sale' || val == 'Consignment') {
        var phoneConfig = {            
            onlyCountries : phoneCountries,
            preferredCountries : ["mx"],
            separateDialCode : true,
            nationalMode : false,
            utilsScript : base_url + 'assets/vendor/intlTelInput/js/utils.js',
            formatOnDisplay : true,
            autoPlaceholder : ''
        };

        if (val == 'For Sale')
            phoneConfig.preferredCountries = ["us"];
    
        $('#ContactPhone').intlTelInput(phoneConfig);
        document.getElementById("ContactPhone").addEventListener('countrychange', phoneCountryCodeChange);
        $('#ContactPhone').mask('999 999 9999');
    }
    $('#location-area-container').html(get_location_area_elements(val));

    $('#preview-deal-area-container').html(get_deal_area_preview_elements(val));
    $('#preview-location-area-container').html(get_location_area_preview_elements(val));

    $('.price-group').html(get_add_price_element(val));    
    $('.preview-price-group').html( get_add_price_preview_element(val));

    if (val == "Auction") {

        $('#inputAuctioneer-box').css('display', 'block');
        $('#inputSubmitLink-box').css('display', 'block');
        $('#inputSubmitLink').attr('required', true);

    } else if (val == "For Sale") {
        $('#inputAuctioneer-box').css('display', 'none');
        $('#inputSubmitLink-box').css('display', 'block');
        $('#inputSubmitLink').attr('required', false);       

    } else if (val == "Inventory") {

        $('#inputAuctioneer-box').css('display', 'none');
        $('#inputSubmitLink-box').css('display', 'none');
        $('#inputSubmitLink').attr('required', false);

    } else if (val == "Consignment") {

        $('#inputAuctioneer-box').css('display', 'none');
        $('#inputSubmitLink-box').css('display', 'none');
        $('#inputSubmitLink').attr('required', false);        

    }
}


/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////


function showSpinner() {
    $('.loading-box').css('display', 'flex');
}

function hiddenSpinner() {
    $('.loading-box').css('display', 'none');
}

/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////

function getBannerImageElement(data) {
    var regularWidth = 800;
    var regularHeight = 600;
    var contentItem = '';
    var width, height, url;

    var bannername = 'auction-banner-footer.png';
    // if (dealType == 'Auction') {
    //     bannername = 'auction-banner-footer.png';
    // } else if (dealType == 'For Sale') {
    //     bannername = 'For Sale-banner-footer.png';
    // }

    height = regularHeight;
    width = parseInt(data.pmW * height / data.pmH);
    url = data.url;

    contentItem += '<div class="banner-image-container" id="bannerImage"  style="width: ' + regularWidth + 'px; height:' + regularHeight + 'px; background-image: url(\'' + url + '\')" data-id="' + data.ID + '">';
    contentItem += '<img style="width:' + width + 'px; height: ' + height + 'px;  position:absolute; top:0; left: 50%; margin-left:' + (-1 * width / 2) + 'px;"  src="' + url + '">';
    contentItem += '<img class="banner-image-banner1" src="' + base_url + 'assets/images/ribbon/' + bannername + '">';
    contentItem += '<img class="banner-image-banner2" src="' + base_url + 'assets/images/ribbon/com_mark.png">';
    contentItem += '</div>';

    return contentItem;
}

function logSuccessActivity(Activity, ID) {
    $.ajax({
        url : base_url + 'Activity/addActivity',
        type : 'post',
        data : {
            Activity : Activity,
            ObjectiveTable : 'tblDeals',
            ObjectiveID : ID,
            Webpage : 'Deals.AddNewDeal',
            Status : 'Success',
            Error : ''
        },
        success : function () {
            websocket.send(JSON.stringify({ 'msg': 'activity', 'poster': $('#usernameInput').val() }));
        }
    });
}

function logErrorActivity(Activity, ID, ErrorMsg) {
    $.ajax({
        url : base_url + 'Activity/addActivity',
        type : 'post',
        data : {
            Activity : Activity,
            ObjectiveTable : 'tblDeals',
            ObjectiveID : ID,
            Webpage : 'Deals.AddNewDeal',
            Status : 'Error',
            Error : ErrorMsg
        },
        success : function () {
            websocket.send(JSON.stringify({ 'msg': 'activity', 'poster': $('#usernameInput').val() }));
        }
    });
}


