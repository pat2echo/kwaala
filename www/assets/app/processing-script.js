(function($) {
    $.fn.pSignIn = {
        submit: function( options ) {
            // Establish our default settings
            var settings = $.extend({
                form : $('form[name="sign-in-form"]'),
                form_image : $('form[name="image-form"]'),
                back_button : $('#back-to-signin'),
                recent_activity: $('#chats').find('.chats'),
            }, options );
            
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
            
            $.fn.cProcessForm.handleSubmission( settings.form );
            $.fn.cProcessForm.populateRecentActivities( settings.recent_activity );
        }
    }
}(jQuery));