(function($) {
    $.fn.pHost = {
        loadGuests: function( options ) {
			
		    //Establish our default settings
            var settings = $.extend({
                form : $('form[name="sign-in-form"]'),
                back_button : $('#back-to-signin'),
                recent_activity: $('#chats').find('.chats'),
            }, options );
            
			//event binding
            settings.form.on('submit', function(e){
                $('.pass-code-auth').hide();
                $('.successful-pass-code-auth').hide();
                $('.processing-pass-code-auth').slideDown();
            });
            
            settings.back_button.on('click', function(e){
                e.preventDefault();
                $('.successful-pass-code-auth').hide();
                $('.processing-pass-code-auth').hide();
                $('.pass-code-auth').slideDown();
            });
        },
        loadShoppingCart: function( options ) {
			//populate guest list
			$( "#active-menu-text" ).html( $(".loadShoppingCart").attr("function-id") );
			$.fn.cProcessForm.ajax_data = {
                ajax_data: { filter: "my-calendar" },
                form_method: 'post',
                ajax_data_type: 'json',
                ajax_action: 'request_function_output',
                ajax_container: '',
                ajax_get_url: "?action=cart&todo=display_shopping_cart&store="+nwCurrentStore.currentStore.id,
				//ajax_get_url: "?action=cart&todo=display_production_cart&store="+nwCurrentStore.currentStore.id,
            };
            $.fn.cProcessForm.ajax_send();
        },
        loadStock: function() {
			$( "#active-menu-text" ).html( $(".loadStock").attr("function-id") );
			
			$.fn.cProcessForm.ajax_data = {
                ajax_data: { filter: "my-calendar" },
                form_method: 'post',
                ajax_data_type: 'json',
                ajax_action: 'request_function_output',
                ajax_container: '',
                ajax_get_url: "?action=inventory&todo=display_app_inventory&store="+nwCurrentStore.currentStore.id,
            };
            $.fn.cProcessForm.ajax_send();
        },
        loadExpenses: function() {
			$( "#active-menu-text" ).html( $(".loadExpenses").attr("function-id") );
			
			$.fn.cProcessForm.ajax_data = {
                ajax_data: { filter: "my-calendar" },
                form_method: 'post',
                ajax_data_type: 'json',
                ajax_action: 'request_function_output',
                ajax_container: '',
                ajax_get_url: "?action=expenditure&todo=display_app_expenditure&store="+nwCurrentStore.currentStore.id,
            };
            $.fn.cProcessForm.ajax_send();
        },
        loadMoreOptions: function() {
			$( "#active-menu-text" ).html( $(".loadMoreOptions").attr("function-id") );
			
			$.fn.cProcessForm.ajax_data = {
                ajax_data: { filter: "my-calendar" },
                form_method: 'post',
                ajax_data_type: 'json',
                ajax_action: 'request_function_output',
                ajax_container: '',
                ajax_get_url: "?action=dashboard&todo=display_app_more_menu&store="+nwCurrentStore.currentStore.id,
            };
            $.fn.cProcessForm.ajax_send();
        },
       getStores: function() {
			//populate guest list
			$.fn.cProcessForm.ajax_data = {
                ajax_data: { filter: "my-calendar" },
                form_method: 'post',
                ajax_data_type: 'json',
                ajax_action: 'request_function_output',
                ajax_container: '',
                ajax_get_url: "?action=stores&todo=get_stores_list", //agenda view
            };
            $.fn.cProcessForm.ajax_send();
        },
       loadProductionManifest: function() {
			//populate guest list
			$( "#active-menu-text" ).html( $(".loadProductionManifest").attr("function-id") );
			
			$.fn.cProcessForm.ajax_data = {
                ajax_data: { filter: "my-calendar" },
                form_method: 'post',
                ajax_data_type: 'json',
                ajax_action: 'request_function_output',
                ajax_container: '',
                ajax_get_url: "?action=cart&todo=display_production_cart&store="+nwCurrentStore.currentStore.id, //agenda view
            };
            $.fn.cProcessForm.ajax_send();
        },
        displayUserDetails: function() {
			var tmp_data = $.fn.cProcessForm.returned_ajax_data;
			if( tmp_data && tmp_data.user_details && tmp_data.user_details.email ){
				$("#connection").text( tmp_data.user_details.email );
				$.fn.pHost.getStores();
			}
        },
        checkLoggedInUser: function( options ) {
			$.fn.cProcessForm.ajax_data = {
                ajax_data: { filter: "my-calendar" },
                form_method: 'post',
                ajax_data_type: 'json',
                ajax_action: 'request_function_output',
                ajax_container: '',
				ajax_get_url: "?action=users&todo=app_check_logged_in_user",
            };
            $.fn.cProcessForm.ajax_send();
			
        },
        activateDateRangePicker: function() {
			$('#reportrange').daterangepicker({
                opens: 'left', //(App.isRTL() ? 'left' : 'right'),
                startDate: moment().subtract('days', 29),
                endDate: moment(),
                minDate: '01/01/2014',
                maxDate: '12/31/2016',
                dateLimit: {
                    days: 60
                },
                showDropdowns: true,
                showWeekNumbers: true,
                timePicker: false,
                timePickerIncrement: 1,
                timePicker12Hour: true,
                ranges: {
                    'Today': [moment(), moment()],
                    'Yesterday': [moment().subtract('days', 1), moment().subtract('days', 1)],
                    'Last 7 Days': [moment().subtract('days', 6), moment()],
                    'Last 30 Days': [moment().subtract('days', 29), moment()],
                    'This Month': [moment().startOf('month'), moment().endOf('month')],
                    'Last Month': [moment().subtract('month', 1).startOf('month'), moment().subtract('month', 1).endOf('month')]
                },
                buttonClasses: ['btn'],
                applyClass: 'green',
                cancelClass: 'default',
                format: 'MM/DD/YYYY',
                separator: ' to ',
                locale: {
                    applyLabel: 'Apply',
                    fromLabel: 'From',
                    toLabel: 'To',
                    customRangeLabel: 'Custom Range',
                    daysOfWeek: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
                    monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                    firstDay: 1
                }
            },
            function (start, end) {
                console.log("Callback has been called!");
                $('#reportrange span').html(start.format('MM D, YYYY') + ' - ' + end.format('MM D, YYYY'));
            }
			);
			//Set the initial state of the picker label
			$('#reportrange span').html(moment().subtract('days', 29).format('MM D, YYYY') + ' - ' + moment().format('MM D, YYYY'));
        },
    }
}(jQuery));