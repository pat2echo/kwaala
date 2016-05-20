(function($) {
    $.fn.pHost = {
		getLicenseKey: function(){
			var key = amplify.store( "license" );
			if( key ){
				$.fn.cProcessForm.ajax_data = {
					ajax_data: { license: key },
					form_method: 'post',
					ajax_data_type: 'json',
					ajax_action: 'request_function_output',
					ajax_container: '',
					ajax_get_url: "?action=mobile_app&todo=authenticate_license",
				};
				$.fn.cProcessForm.ajax_send();
			}
		},
		storeLicenseKey: function(){
			if( $('input[name="license"]').val() )amplify.store( "license", $('input[name="license"]').val() );
			
			setTimeout( function(){
				document.location = "mobile.html";
			}, 1000 );
		},
		loadShoppingCart: function(){
			
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
        showMobileMainView: function() {
			$(".mobile-settings-view").hide();
			$(".mobile-main-view").show();
        },
        showMobileSettingsView: function() {
			if( $(".mobile-settings-view").is(":visible") ){
				$(".mobile-settings-view").hide();
				$(".mobile-main-view").show();
			}else{
				$(".mobile-settings-view").show();
				$(".mobile-main-view").hide();
			}
			
        },
	}
}(jQuery));