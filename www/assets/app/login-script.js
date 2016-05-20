(function($) {
    $.fn.nwLogin = {
        checkAuthenticationStatus: function() {
			$.fn.cProcessForm.ajax_data = {
                ajax_data: { filter: "my-calendar" },
                form_method: 'post',
                ajax_data_type: 'json',
                ajax_action: 'request_function_output',
                ajax_container: '',
				ajax_get_url: "?action=users&todo=app_check_logged_in_user2",
            };
            $.fn.cProcessForm.ajax_send();
			
        },
    }
}(jQuery));