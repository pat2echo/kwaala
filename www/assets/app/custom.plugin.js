(function($) {
    $.fn.cProcessForm = {
        //requestURL: $("#pagepointer").text(),
		//requestURL: "http://localhost/feyi/",
		requestURL: "http://192.168.1.8/feyi/",
		activateAjaxRequestButton: function(){
			$.fn.cProcessForm.bind_quick_print_function();
			
			$("body")
			.on( "click", ".ajax-request", function(e){
				e.preventDefault();
				
				if( $(this).hasClass("ajax-request-modals") )
					$(this).attr("href", $(this).attr("data-href") );
				
				var data_id = ( $(this).attr("data-id") )?$(this).attr("data-id"):"";
				var data_filter = ( $(this).attr("data-filter") )?$(this).attr("data-filter"):"";
				var data_internalcard = ( $(this).attr("data-internalcard") )?$(this).attr("data-internalcard"):"";
				
				$.fn.cProcessForm.ajax_data = {
					ajax_data: {filter: data_filter, id:data_id , internalcard:data_internalcard },
					form_method: 'post',
					ajax_data_type: 'json',
					ajax_action: 'request_function_output',
					ajax_container: '',
					ajax_get_url: "?action=" + $(this).attr("action") + "&todo=" + $(this).attr("todo"),
				};
				$.fn.cProcessForm.ajax_send();
				
			});
			
			$("body")
			.on( "click", ".custom-action-button", function(e){
				e.preventDefault();
				var $me = $(this);
				
				var store = "";
				if( $('#current-store-container').find("select") && $('#current-store-container').find("select").val() ){
					store = $('#current-store-container').find("select").val();
				}
				
				var function_id = $me.attr('function-id');
				var function_name = $me.attr('function-name');
				var function_class = $me.attr('function-class');
				
				if( ! $(this).attr("skip-title") )
					$( "#active-menu-text" ).html( function_id );
				
				var budget_id = '';
				var month_id = '';
				var operator_id = '';
				var department_id = '';
				var start_date = '';
				var end_date = '';
				
				if( $me.attr('budget-id') && $me.attr('month-id') ){
					budget_id = $me.attr('budget-id');
					month_id = $me.attr('month-id');
				}
				
				if( $me.attr('department-id') && $me.attr('operator-id') ){
					operator_id = $me.attr('operator-id');
					department_id = $me.attr('department-id');
				}
				
				if( $me.attr('start-date') && $me.attr('end-date') ){
					start_date = $me.attr('start-date');
					end_date = $me.attr('end-date');
				}
				
				var module_id = "";
				$.fn.cProcessForm.ajax_data = {
					ajax_data: {action:function_class, todo:function_name, module:module_id, id:function_id, budget:budget_id, month:month_id, department:department_id, operator:operator_id, store:store, end_date:end_date, start_date:start_date },
					form_method: 'get',
					ajax_data_type: 'json',
					ajax_action: 'request_function_output',
					ajax_container: '',
					ajax_get_url: "?",
				};
				$.fn.cProcessForm.ajax_send();
				
			});
			
			$("body")
			.on( "click", ".custom-single-selected-record-button", function(e){
				e.preventDefault();
				var single_selected_record = "";
				
				var store = "";
				if( $('#current-store-container').find("select") && $('#current-store-container').find("select").val() ){
					store = $('#current-store-container').find("select").val();
				}
				//$.fn.cProcessForm.activateProcessing( $(this) );
				
				if( $(this).attr("override-selected-record") ){
					single_selected_record = $(this).attr("override-selected-record");
				}
				
				if( ( ! single_selected_record  ) && $(this).attr("selected-record") ){
					single_selected_record = $(this).attr("selected-record");
				}
				
				if( single_selected_record ){
					
					var module_id = "";
					$.fn.cProcessForm.ajax_data = {
						ajax_data: {mod:$(this).attr('mod'), id:single_selected_record},
						form_method: 'post',
						ajax_data_type: 'json',
						ajax_action: 'request_function_output',
						ajax_container: '',
						ajax_get_url: $(this).attr('action') + "&store=" + store,
					};
					if( single_selected_record == "json" ){
						$.fn.cProcessForm.ajax_data.ajax_data.json = $("body").data("json");
					}
					$.fn.cProcessForm.ajax_send();

				}else{
					var data = {theme:'alert-info', err:'No Selected Record', msg:'Please select a record by clicking on it', typ:'jsuerror' };
					$.fn.cProcessForm.display_notification( data );
				}
				
			});
		},
        handleSubmission: function( $form ){
            $form.on('submit', function(e){
                e.preventDefault();
                var d = $.fn.cProcessForm.transformData( $(this) );
                
                if( d.error ){
                    var settings = {
                        message_title:d.title,
                        message_message: d.message,
                        auto_close: 'no'
                    };
                    display_popup_notice( settings );
                }else{
                    var local_store = 0;
					internetConnection = true;
					
                    d[ 'object' ] = $(this).attr('name');
                    
                    if( $(this).attr('local-storage') ){
                        local_store = 1;
                        
                        //store data
                        //var stored = store_record( data );
                        //successful_submit_action( stored );
                        
                        alert('local storage');
                    }
             
                    if( ! local_store ){
						$(this).data('do-not-submit', 'submit' )
						$.fn.cProcessForm.post_form_data( $(this) );
						
						tempData = d;
                    }
                    
                    $form
                    .find('input')
                    .not('.do-not-clear')
                    .val('');
                }
                return d;
            });
        },
        transformData: function( $form ){
            
            var data = $form.serializeArray();
            
            var error = {};
            var txData = { error:false };
            var unfocused = true;
            
            $.each( data , function( key , value ){
                var $input = $form.find('#'+value.name+'-field');
                if( $input ){
                    if( $input.attr('data-validate') ){
                        var validated = $.fn.cProcessForm.validate.call( $input , unfocused );
                        
                        if( ! ( error.error ) && validated.error ){
                            //throw error & display message
                            error = validated;
                            unfocused = false;
                        }else{
                            //start storing object
                            txData[ value.name ] = value.value;
                        }
                        
                    }else{
                        txData[ value.name ] = value.value;
                    }
                }
            });
            
            if( error.error ){
                return error;
            }
            
            return txData;
        },
        ajax_data: {},
        returned_ajax_data: {},
		activateProcessing: function( $button ){
			$button
			.addClass("processing-ajax-request");
			
			if( $button.attr("type") && $button.attr("type") == "submit" ){
				$button
				.attr("data-tmp", $button.val() )
				.css( "opacity", 0.3 )
				.val( "Please Wait..." );
			}else{
				$button
				.attr("data-tmp", $button.text() )
				.css( "opacity", 0.3 )
				.text( "Please Wait..." );
			}
		},
		deactivateProcessing: function(){
			if( $(".processing-ajax-request") ){
				$button = $(".processing-ajax-request");
				
				if( $button.attr("type") && $button.attr("type") == "submit" ){
					$button
					.css( "opacity", 1 )
					.val( $button.attr("data-tmp") );
				}else{
					$button
					.css( "opacity", 1 )
					.text( $button.attr("data-tmp") );
				}
				$button.removeClass("processing-ajax-request");
			}
		},
        post_form_data: function( $form ){
			
            if( $form.data('do-not-submit') != 'submit' ){
				return false;
			}
            $.fn.cProcessForm.ajax_data = {
                ajax_data: $form.serialize(),
                form_method: 'post',
                ajax_data_type: 'json',
                ajax_action: 'request_function_output',
                ajax_container: '',
                ajax_get_url: $form.attr('action'),
            };
            $.fn.cProcessForm.ajax_send();
        },
        function_click_process: 1,
        ajax_send: function( settings ){
            //Send Data to Server
            
            if( $.fn.cProcessForm.function_click_process ){
                $.ajax({
                    dataType: $.fn.cProcessForm.ajax_data.ajax_data_type,
                    type:$.fn.cProcessForm.ajax_data.form_method,
                    data:$.fn.cProcessForm.ajax_data.ajax_data,
                    crossDomain:true,
                    url: $.fn.cProcessForm.requestURL + 'engine/php/ajax_request_processing_script.php' + $.fn.cProcessForm.ajax_data.ajax_get_url,
                    timeout:80000,
                    beforeSend:function(){
                        $.fn.cProcessForm.function_click_process = 0;
                        $('div#generate-report-progress-bar')
                        .html('<div class="virtual-progress-bar progress progress-striped"><div class="progress-bar progress-bar-info"></div></div>');
                        
                        $.fn.cProcessForm.progress_bar_change.call();
                    },
                    error: function(event, request, settings, ex) {
                        $.fn.cProcessForm.ajaxError.call( event, request, settings, ex );
						$.fn.cProcessForm.deactivateProcessing();
                    },
                    success: function(data){
                        $.fn.cProcessForm.requestRetryCount = 0;
                        $.fn.cProcessForm.function_click_process = 1;
						$.fn.cProcessForm.deactivateProcessing();
                        if( data && data.status ){
                            switch(data.status){
                            case 'authenticated-visitor':
                                data.url = $.fn.cProcessForm.requestURL;
                                authenticated_visitor( data );
                                return;
                            break;
                            case 'got-recent-activities':
                                data.url = $.fn.cProcessForm.requestURL;
                                got_recent_activities( data );
                                return;
                            break;
							case "new-status":
								if( data ){
									if( data.redirect_url ){
										document.location = data.redirect_url;
									}
									
									if( data.html ){
										$('#main-view')
										.html( data.html );
									}
									
									if( data.html_replacement_selector && data.html_replacement ){
										$(data.html_replacement_selector)
										.html( data.html_replacement );
									}
									
									if( data.html_replacement_selector_one && data.html_replacement_one ){
										$(data.html_replacement_selector_one)
										.html( data.html_replacement_one );
									}
									
									if( data.html_replacement_selector_two && data.html_replacement_two ){
										$(data.html_replacement_selector_two)
										.html( data.html_replacement_two );
									}
									
									if( data.html_replacement_selector_three && data.html_replacement_three ){
										$( data.html_replacement_selector_three )
										.html( data.html_replacement_three );
									}
									
									if( data.html_prepend_selector && data.html_prepend ){
										$(data.html_prepend_selector)
										.prepend( data.html_prepend );
									}
									
									if( data.html_append_selector && data.html_append ){
										$(data.html_append_selector)
										.append( data.html_append );
									}
									
									if( data.html_replace_selector && data.html_replace ){
										$(data.html_replace_selector)
										.replaceWith( $(data.html_replace) );
									}
									
									if( data.html_removal ){
										if( $(data.html_removal) )$(data.html_removal).remove();
									}
									
									if( data.html_removals ){
										$.each( data.html_removals , function( key, value ){
											if( $( value ) )$( value ).remove();
										} );
									}
									
									if( data.javascript_functions ){
										$.fn.cProcessForm.returned_ajax_data = data;
										tmp_data = data;
										$.each( data.javascript_functions , function( key, value ){
											eval( value + "()" );
										} );
									}
									
									if(data.saved_record_id){
										single_selected_record = data.saved_record_id;
									}

								}
							break;
                            }
                        }
                        
                        $.fn.cProcessForm.display_notification( data );
                    }
                });
            }
        },
		cancelAjaxRecursiveFunction:0,
		triggerNewAjaxRequest: function(){
			$.fn.cProcessForm.ajax_data = {
				ajax_data: {mod: $.fn.cProcessForm.returned_ajax_data.mod, id:$.fn.cProcessForm.returned_ajax_data.id },
				form_method: 'post',
				ajax_data_type: 'json',
				ajax_action: 'request_function_output',
				ajax_container: '',
				ajax_get_url: $.fn.cProcessForm.returned_ajax_data.action,
			};
			$.fn.cProcessForm.ajax_send();
		},
        ajaxError: function( event, request, settings, ex ){
            
        },
		activate_highcharts: function(){
			var tmp_data = $.fn.cProcessForm.returned_ajax_data;
			if( tmp_data && Object.getOwnPropertyNames( tmp_data ).length && tmp_data.highchart_data && tmp_data.highchart_container_selector ){
				nwHighCharts.initChart( tmp_data );
			}else{
				alert("Could not Generate Chart, due to invalid data");
			}
		},
		activate_and_export_highcharts: function(){
			var tmp_data = $.fn.cProcessForm.returned_ajax_data;
			if( tmp_data && Object.getOwnPropertyNames( tmp_data ).length && tmp_data.highchart_data && tmp_data.highchart_container_selector ){
				var dataString = nwHighCharts.initChartAndExport( tmp_data );
				
				$.ajax({
					type: 'POST',
					data: dataString,
					url: pagepointer + 'classes/highcharts/exporting-server/php/php-batik/',
					success: function( data ){
						//console.log( data );
						resume_reprocessing();
					}
				});
			}else{
				alert("Could not Generate Chart, due to invalid data");
			}
		},
        activateAjaxForm: function(){
			
			//Bind Html text-editor
			$.fn.cProcessForm.activateFullTextEditor();
			
			//Activate Client Side Validation / Tooltips
			$.fn.cProcessForm.activateTooltip();
			
			//Bind Form Submit Event
			$('form.activate-ajax')
			.not('.ajax-activated')
			.bind('submit', function( e ){
				e.preventDefault();
				
				$.fn.cProcessForm.activateFormValidation( $(this) );
				if( $(this).data('do-not-submit') != 'submit' ){
					return false;
				}
				
				$.fn.cProcessForm.activateProcessing( $(this).find("input[type='submit']") );
				$.fn.cProcessForm.post_form_data( $(this) );
			});
			
			//Activate Ajax file upload
			$.fn.cProcessForm.ajaxFileUploader();
			
			var first = 1;
			var html = "";
			var inline = "";
			$('select.select-checkbox')
			.not('.select-activated')
			.addClass("select-activated")
			.hide()
			.find("option")
			.each( function(){
				if( $(this).attr("value") ){
					inline = ' style="width:47%; font-size:14px; margin-top:10px; " ';
					if( first ){
						first = 0;
						inline = ' style="padding-left:20px; margin-left:10px; width:47%; font-size:14px; margin-top:10px; " ';
					}
					html += '<label class="checkbox-inline" '+inline+'> <div class="checker" ><span><input class="bound-select" parent="'+$(this).parents("select").attr("name")+'" type="checkbox" id="' + $(this).attr('value') + '" value="' + $(this).attr('value') + '"></span></div> ' + $(this).text() + '</label>';
				}
			} )
			.parents(".cell-element")
			.append( '<div class="row" style="padding-left:15px;"><div class="col-md-12"><div class="checkbox-list">'+html+'</div></div></div>' );
			
			$("input.bound-select")
			.not('.bounded-select')
			.on("change", function(){
				var v = $( "select[name='"+$(this).attr("parent")+"']" ).val();
				if( $(this).attr("checked") ){					
					if( v )
						v += "," + $(this).attr("value");
					else
						v = $(this).attr("value");
					
					v = v.split(",");
				}else{
					var i = v.indexOf( $(this).attr("value") );
					if(i != -1) {
						v.splice(i, 1);
					}
				}
				$( "select[name='"+$(this).attr("parent")+"']" ).val( v );
			})
			.addClass("bounded-select");
			
			$('form.activate-ajax').addClass('ajax-activated');
        },
        activateFullTextEditor: function(){
			
			$('textarea')
			.not( '.activated' )
			.bind('keydown', function(e){
			
				switch(e.keyCode){
				case 69:	//E Ctrl [17]
					if(e.ctrlKey){
						e.preventDefault();
						
						editing_textarea = $(this);
						
						//Set Contents
						$('#myModal')
						.modal('show')
						.on('shown', function(){
							tinyMCE.activeEditor.setContent( editing_textarea.val() );
						})
						.on('hidden', function(){
							editing_textarea
							.val( $('#popTextArea').html() );
						});
						
						$(this).attr('tip', '');
						$.fn.cProcessForm.displayTooltip.call($(this), '');
					}
				break;
				}
				
			})
			.bind('focus', function(){
				$(this).attr('tip', 'Press Ctrl+E to display full text editor');
				
				$.fn.cProcessForm.displayTooltip.call($(this), '');
			})
			.bind('blur', function(){
				$(this).attr('tip', '');
				
				$.fn.cProcessForm.displayTooltip.call($(this), '');
			})
			.addClass( 'activated' );
        },
        populateRecentActivities: function( $container ){
            $.fn.cProcessForm.ajax_data = {
                ajax_data: {},
                form_method: 'post',
                ajax_data_type: 'json',
                ajax_action: 'request_function_output',
                ajax_container: '',
                ajax_get_url: '?todo=get_recent_activties&action=entry_exit_log',
            };
            $.fn.cProcessForm.ajax_send.call();
        },
        ajaxFileUploader: function(){
            if($('.upload-box').hasClass('cell-element')){
				
				$('.upload-box').each(function(){
					var id = $(this).attr('id');
					var name = $(this).find('input').attr('name');
					var acceptable_files_format = $(this).find('input').attr('acceptable-files-format');
					var table = $("#"+id).parents('form').find('input[name="table"]').val();
					var form_id = $("#"+id).parents('form').find('input[name="processing"]').val();
					var form_record_id = $("#"+id).parents('form').find('input[name="id"]').val();
					var actual_form_id = $("#"+id).parents('form').attr('id');
					
					//instead of sending processing id | rather send record id
					if( form_record_id && form_record_id.length > 1 )form_id = form_record_id;
					
					$("."+name+"-replace").attr( 'name' , $(this).find('input').attr('name') );
					$("."+name+"-replace").attr( 'id' , $(this).find('input').attr('id') );
					$("."+name+"-replace").attr( 'class' , $(this).find('input').attr('class') );
					$("."+name+"-replace").attr( 'alt' , $(this).find('input').attr('alt') );
					
					var uploader = new qq.FileUploader({
						element: document.getElementById(id),
						listElement: document.getElementById('separate-list'),
						action: $.fn.cProcessForm.requestURL + 'engine/php/upload.php',
						params: {
							tableID: table,
							formID: form_id,
							name:name,
							actualFormID:actual_form_id,
							acceptable_files_format:acceptable_files_format,
						},
						onComplete: function(id, fileName, responseJSON){
							if(responseJSON.success=='true'){
								$('.qq-upload-success')
								.find('.qq-upload-failed-text')
								.text('Success')
								.css('color','#ff6600');
								
								if( responseJSON.stored_name ){
									
									//multiple upload
									//var i = $('input[name="'+responseJSON.element+'"]').val();
									//if( i && i.length > 1 )i = i + ":::" + responseJSON.stored_name;
									//else i = responseJSON.stored_name;
									//$('input[name="'+responseJSON.element+'"]').val( i );
									
									//single upload
									$('input[name="'+responseJSON.element+'"]').val( responseJSON.stored_name );
									
									
									$('img#'+responseJSON.element+'-img')
									.attr( "src", $.fn.cProcessForm.requestURL + responseJSON.dir + responseJSON.filename + "." + responseJSON.ext )
									.slideDown(1000 , function(){
										$('.qq-upload-success').empty();
									});
								}
							}else{
								//alert('failed');
							}
							$(".cell-element").find("input[type='file']").addClass("form-control").css("fontSize", "11px");
						}
					});
					
					$(".cell-element").find("input[type='file']").addClass("form-control").css("fontSize", "11px");
				});
				
			}
        },
		notificationTimerID:"",
		display_notification:function ( data ){
			if( data && data.typ ){
				var theme = 'alert-danger';
				
				if( data.theme ){
					theme = data.theme;
				}
				
				switch(data.typ){
				case "search_cleared":
				case "report_generated":
				case "searched":
				case "saved":
				case "jsuerror":
				case "uerror":
				case "deleted":
				case "serror":
					var html = '<div class="alert ' + theme + ' alert-block1 alert-dismissable">';
					  html += '<button type="button" class="close" id="alert-close-button" data-dismiss="alert"></button>';
					  html += '<h4>' + data.err + '</h4>';
					  html += data.msg;
					html += '</div>';
					
					var $notification_container = $('#notification-container');
					
					if( $.fn.cProcessForm.notificationTimerID )clearTimeout( $.fn.cProcessForm.notificationTimerID );
					
					
					$notification_container
					.html( html );
					
					switch(data.typ){
					case "report_generated":
						set_function_click_event();
					break;
					default:
						$.fn.cProcessForm.notificationTimerID = setTimeout( function(){
							$('#notification-container')
							.empty();
						} , 3000 );
					break;
					}
					
					$('#alert-close-button')
					.bind('click', function(){
						$('#notification-container')
						.empty();
					});
					
				break;
				}
			}
			
			if( data.tok && $('form') ){
				$('form')
				.find('input[name="processing"]')
				.val( data.tok );
			}
			
			if( data.re_process && ! $.fn.cProcessForm.cancelAjaxRecursiveFunction ){
				$.fn.cProcessForm.triggerNewAjaxRequest();
			}
		},
		activateTooltip: function(){
			
			var $form = $('form.activate-ajax').not('.ajax-activated');
			
            $form
			.find('.form-gen-element')
			.bind('focus',function(){
				$.fn.cProcessForm.displayTooltip($(this) , $(this).attr('name'), false);
			});
			
			$form
			.find('.form-gen-element')
			.bind('blur',function(){
				$.fn.cProcessForm.displayTooltip( $(this) , '', true );
			});
			
			$form
			.find('.form-element-required-field')
			.bind('blur',function(){
				$.fn.cProcessForm.validate( $(this) );
			});
			
        },
		activateFormValidation: function( $form ){
			if( ! $form.hasClass('skip-validation') ){
				$.fn.cProcessForm.validate_and_submit_form( $form );
			}
        },
		validate: function( me ){
			
			if( $.fn.cProcessForm.testdata( me.val() , me.attr('alt') ) ){
				if(me.hasClass('invalid-data')){
					me.removeClass('invalid-data').addClass('valid-data');
				}else{
					me.addClass('valid-data');
				}
			}else{
				if(me.hasClass('valid-data')){
					me.addClass('invalid-data').removeClass('valid-data');
				}else{
					me.addClass('invalid-data');
				}
			}
			
		},
		validate_and_submit_form: function( $me ){
			
			$me
			.find('.form-element-required-field')
			.blur();
			
			if( $me.find('.form-element-required-field').hasClass('invalid-data') ){
				$me
				.find('.invalid-data:first')
				.focus();
				
				var html = "<br /><br /><strong>Form Fields with Invalid Data</strong><br />";
				var no = 0;
				$me
				.find('.invalid-data')
				.each(function(){
					++no;
					html += no + ". " + $(this).parents(".input-group").find(".input-group-addon").text() + "<br />";
				});
				
				$me.data('do-not-submit', '');
				
				//display notification to fill all required fields
				var data = {
					typ:'jsuerror',
					err:'Invalid Form Field',
					msg:'Please do ensure to correctly fill all required fields with appropriate values' + html,
				};
				$.fn.cProcessForm.display_notification( data );
				
				return false;
			}
			
			$me.data('do-not-submit', 'submit');		
		},
		testdata: function (data,id){
			
			switch (id){
			case 'text':
			case 'textarea':
			case 'upload':
				if(data.length>0)return 1;
				else return 0;
			break;
			case 'category':
				if(data.length>11)return 1;
				else return 0;
			break;
			case 'number':
			case 'currency':
				/*/[^0-9\-\.]/g*/
				data = ( data.replace( ",", '' ) );
				return (data - 0) == data && data.length > 0;
			break;
			case 'email':
				var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
				if( email.length<1 || !emailReg.test( email ) ) {
					return 0;
				} else {
					return 1;
				}
			break;
			case 'password':
				if($('input[type="password"]:first').val()!=pass){
			pass = 0;
		}
		
		if(!pass){
			//VERIFY PASSWORD
			if( data.length > 6 ){
					/*
					//TEST FOR AT LEAST ONE NUMBER
					var passReg = /[0-9]/;
					if( passReg.test( data ) ) {
						//TEST FOR AT LEAST ONE UPPERCASE ALPHABET
						passReg = /[A-Z]/;
						if( passReg.test( data ) ){
							//TEST FOR AT LEAST ONE LOWERCASE ALPHABET
							passReg = /[a-z]/;
							if( passReg.test( data ) ){
								//STORE FIRST PASSWORD
								pass = data;
								return 1;
							}else{
								//NO LOWERCASE ALPHABET IN PASSWORD
								pass = 0;
								return 0;
							}
						}else{
							//NO UPPERCASE ALPHABET IN PASSWORD
							pass = 0;
							return 0;
						}
					}else{
						//NO NUMBER IN PASSWORD
						pass = 0;
						return 0;
					}
					*/
					pass = data;
					return 1;
				}else{ 
					pass = 0;
					return 0;
				}
				/*
				a.	User ID and password cannot match
				b.	Minimum of 1 upper case alphabetic character required
				c.	Minimum of 1 lower case alphabetic character required
				d.	Minimum of 1 numeric character required
				e.	Minimum of 8 characters will constitute the password
				*/
			}else{
				//CONFIRM SECOND PASSWORD
				if(data==pass)return 1;
				else return 0;
			}
			break;
				if(data.length>6)return 1;
				else return 0;
			break;
			case 'phone':
			case 'tel':
				var phoneReg = /[a-zA-Z]/;
				if( phone.length<5 || phoneReg.test( phone ) ) {
					return 0;
				} else {
					return 1;
				}
			break;
			case 'select':
			case 'multi-select':
				return data;
				break;
			case 'date':
				return data;
				break;
			default:
				return 0;
			}
		},
		g_report_title: '',
		g_all_signatories_html: '',
		bind_quick_print_function: function(){
			$('button#summary-view')
			.live('click', function(){
				$('#example')
				.find('tbody')
				.find('tr')
				.not('.total-row')
				.toggle();
			});
			
			$('body')
			.on('click', 'a.quick-print', function(e){
				e.preventDefault();
				
				var html = $.fn.cProcessForm.get_printable_contents( $(this) );
				
				if( ! g_report_title ){
					$.fn.cProcessForm.g_report_title = $('title').text();
				}
				
				var x=window.open();
				x.document.open();
				x.document.write( '<link href="'+ $('#print-css').attr('href') +'" rel="stylesheet" />' + '<body style="padding:0;">' + $.fn.cProcessForm.g_report_title + html + $.fn.cProcessForm.g_all_signatories_html + '<script type="text/javascript">setTimeout(function(){ window.print(); } , 500 );</script></body>' );
				x.document.close();
				//x.print();
			});
			
			$('body')
			.on('click', 'a.print-report-popup', function(e){
				if( $( "#e-report-title" ) && $( "#e-report-title" ).is(":visible") ){
					$('.popover-content')
					.find('form.report-settings-form')
					.find('input[name="report_title"]').val( $( "#e-report-title" ).text() );
				}
			});
			
			$('input.advance-print-preview, input.advance-print')
			.live('click', function(e){
				e.preventDefault();
				
				var html = $.fn.cProcessForm.get_printable_contents( $(this) );
				
				var report_title = $('title').html();
				
				var $form = $('.popover-content').find('form.report-settings-form');
				
				var r_title = $form.find('input[name="report_title"]').val();
				var r_sub_title = $form.find('input[name="report_sub_title"]').val();
				
				var orientation = $form.find('select[name="orientation"]').val();
				var paper = $form.find('select[name="paper"]').val();
				
				var rfrom = $form.find('input[name="report_from"]').val();
				var rto = $form.find('input[name="report_to"]').val();
				var rref = $form.find('input[name="report_ref"]').val();
				
				var r_type = '';
				var r_user_info = '';
				
				if( $(this).hasClass( 'advance-print' ) ){
					var r_type = $form.find('input[name="report_type"]').filter(':checked').val();
					
					if( $form.find('input[name="report_show_user_info"]').is(':checked') ){
						var r_user_info = 'yes';
					}
				}
				
				var r_signatory = $form.find('input[name="report_signatories"]').val();
				
				var r_template = $form.find('select[name="report_template"]').val();
				var r_ainfo = $form.find('input[name="additional_info"]').val();
				
				$.fn.cProcessForm.g_all_signatories_html = '';
				$.fn.cProcessForm.g_report_title = '';
				
				if( r_title ){
					report_title = '<h3 style="text-align:center;">' + r_title + ' ';
					
					if( r_sub_title ){
						report_title += '<small style="display:block;">' + r_sub_title + '</small>';
					}
					
					report_title += '</h3>';
					
					$.fn.cProcessForm.g_report_title = report_title;
				}
				
				var all_signatories_html = '';
				var signatories_html = '';
				if( r_signatory ){
					if( $form.find('#report-signatory-fields').is(':visible') ){
						
						signatories_html = '<table width="100%">';
						
						$form
						.find('.signatory-fields')
						.each( function(){
							if( $(this).val() ){
								signatories_html += '<tr><td width="20%">' + $(this).val() + '</td><td style="border-bottom:1px solid #dddddd;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td></tr>';
							}
						} );
						
						signatories_html += '</table>';
					}
					
					all_signatories_html = '<div><table width="100%"><tr>';
					
					for( var i = 0; i < r_signatory; i++ ){
						all_signatories_html += '<td style="padding:10px;">';
							all_signatories_html += signatories_html;
						all_signatories_html += '</td>';
					}
					
					all_signatories_html += '</tr></table></div>';
					
					$.fn.cProcessForm.g_all_signatories_html = all_signatories_html;
				}
				
				switch( r_type ){
				case "mypdf":
					$.fn.cProcessForm.ajax_data = {
						ajax_data: {html:report_title + html + all_signatories_html, current_module:$('#active-function-name').attr('function-class'), current_function:$('#active-function-name').attr('function-id'), report_title:report_title, report_show_user_info:r_user_info , orientation:orientation, paper:paper, rfrom:rfrom, rto:rto, rref:rref, report_template:r_template, info:r_ainfo },
						
						form_method: 'post',
						ajax_data_type: 'json',
						ajax_action: 'request_function_output',
						ajax_container: '',
						//ajax_get_url: '?action='+r_type+'&todo=generate_pdf',
						ajax_get_url: '?action='+r_type+'&todo=generate_html_front',
					};
					$.fn.cProcessForm.ajax_send();
				break;
				case "myexcel":
					$.fn.cProcessForm.ajax_data = {
						ajax_data: {html:html, current_module:$('#active-function-name').attr('function-class'), current_function:$('#active-function-name').attr('function-id') , report_title:report_title, rfrom:rfrom, rto:rto, rref:rref, report_template:r_template, info:r_ainfo },
						form_method: 'post',
						ajax_data_type: 'json',
						ajax_action: 'request_function_output',
						ajax_container: '',
						ajax_get_url: '?action='+r_type+'&todo=generate_excel',
					};
					$.fn.cProcessForm.ajax_send();
				break;
				default:
					var x=window.open();
					x.document.open();
					var h = '';
					if( $(this).hasClass( 'advance-print' ) ){
						h = '<script type="text/javascript">setTimeout( function(){ window.print(); }, 500 );</script>';
					}
					x.document.write( '<link href="'+ $('#print-css').attr('href') +'" rel="stylesheet" />' + '<body style="padding:0;"><div id="watermark"></div>' + report_title + html + all_signatories_html + h + '</body>' );
					x.document.close();
					
				break;
				}
			});
		},
		get_printable_contents: function( $printbutton ){
			var html = '';
			
			if( $printbutton.attr('merge-and-clean-data') && $printbutton.attr('merge-and-clean-data') == 'true' ){
				var $content = $( $printbutton.attr('target') ).clone();
				
				//Get Records
				var target_table = $printbutton.attr('target-table');
				var tbody = $content.find(target_table).find('tbody');
				
				//Remove Action Button Column
				tbody.find('.view-port-hidden-table-row').remove();
				tbody.find('.remove-before-export').parents('td').remove();
				
				tbody.find('.hide-custom-view-select-classes').remove();
				
				tbody.find('.line-items-space-row').find("td").html("");
				
				//Get Heading
				var thead = $content.find('.dataTables_scrollHeadInner').find('thead');
				if( thead ){
					thead.find('th').css('width','auto');
					
					//Remove Action Button Column
					thead.find('.remove-before-export').parents('th').remove();
					thead.find('.remove-before-export').remove();
					
					//Adjust Colspan
					thead
					.find('.change-column-span-before-export')
					.attr('colspan', thead.find('.change-column-span-before-export').attr('exportspan') );
				}
				
				//Get Screen Data
				html = '<div id="dynamic"><table class="'+$content.find(target_table).attr('class')+'" width="100%" style="position:relative;" cellspacing="0" cellpadding="0"><thead>'+thead.html()+'</thead><tbody>'+tbody.html()+'</tbody></table></div>';
			}else{
				html = $( $printbutton.attr('target') ).html();
			}
			
			return html;
		},
        displayTooltip: function( me, name, removetip ){
			
			if( removetip ){
				$('#ogbuitepu-tip-con').fadeOut(800);
				return;
			}
			
			//Check if tooltip is set
			if(me.attr('tip') && me.attr('tip').length > 1){
				$('#ogbuitepu-tip-con')
				.find('> div')
				.html(me.attr('tip'));
				
				//Display tooltip
				var offsetY = 8;
				var offsetX = 12;
				
				//var left = me.offset().left - (offsetX + $('#ogbuitepu-tip-con').width() );
				//var top = (me.offset().top + ((me.height() + offsetY)/2)) - ($('#ogbuitepu-tip-con').height()/2);
				
				var left = me.offset().left;
				var top = (me.offset().top + ((me.height() + offsetY)));
				
				if( parseFloat( name ) ){
					top = (name) - ($('#ogbuitepu-tip-con').height()/2);
				}
				
				$('#ogbuitepu-tip-con')
				.find('> div')
				.css({
					padding:me.css('padding'),
				});
				
				$('#ogbuitepu-tip-con')
				.css({
					width:me.width()+'px',
					top:top,
					left:left,
				})
				.fadeIn(800);
			}else{
				//Hide tooltip container
				$('#ogbuitepu-tip-con').fadeOut(800);
			}
        },
        requestRetryCount: 0,
        progress_bar_timer_id: 0,
        progress_bar_change: function(){
            var total = 80;
            var step = 1;
            
            if( $.fn.cProcessForm.progress_bar_timer_id )
                clearTimeout( $.fn.cProcessForm.progress_bar_timer_id );
                
            if( $.fn.cProcessForm.function_click_process == 0 ){
                var $progress = $('.virtual-progress-bar:visible').find('.progress-bar');
                
                if($progress.data('step') && $progress.data('step')!='undefined'){
                    step = $progress.data('step');
                }
                
                var percentage_step = ( step / total ) * 100;
                ++step;
                
                if( percentage_step > 100 ){
                    $progress
                    .css('width', '100%');
                    
                    $('.virtual-progress-bar')
                    .remove();
                    
                    $('.progress-bar-container')
                    .html('');
                    
                    //Refresh Page
                    $.fn.cProcessForm.function_click_process = 1;
                    
                    ++$.fn.cProcessForm.requestRetryCount;
                    
                    //Stop All Processing
                    window.stop();
                    
                    //check retry count
                    if( $.fn.cProcessForm.requestRetryCount > 1 ){
                        //display no network access msg
                        //requestRetryCount = 0;
                        
                        var settings = {
                            message_title:'No Network Access',
                            message_message: 'The request was taking too long!',
                            auto_close: 'no'
                        };
                        display_popup_notice( settings );
                        
                        internetConnection = false;
                    }else{
                        //display retrying msg
                        
                        var settings = {
                            message_title:'Refreshing...',
                            message_message: 'Please Wait.',
                            auto_close: 'yes'
                        };
                        //$.fn.cProcessForm.display_popup_notice.call( settings );
                        
                        //request resources again
                        $.fn.cProcessForm.ajax_send.call();
                        
                    }
                    
                }else{
                    $progress
                    .data('step',step)
                    .css('width', percentage_step+'%');
                    
                    $.fn.cProcessForm.progress_bar_timer_id = setTimeout(function(){
                        $.fn.cProcessForm.progress_bar_change.call();
                    },1000);
                }
            }else{
                $('.virtual-progress-bar')
                .find('.progress-bar')
                .css('width', '100%');
                
                setTimeout(function(){
                    $('.virtual-progress-bar')
                    .remove();
                    
                    $('.progress-bar-container')
                    .html('');
                },800);
            }
        },
    }
}(jQuery));

function display_popup_notice( settings ){
    var theme = 'a';
    var html = settings.message_title + "\n" + settings.message_message;
    alert( html );
	
    /*
    $('.pass-code-auth').slideDown();
    $('.processing-pass-code-auth').hide();
    $('.successful-pass-code-auth').hide();
	*/
};

var gCheck_sum = '';


function set_function_click_event(){
};

function prepare_new_record_form_new(){
	$.fn.cProcessForm.activateAjaxForm();
};

function activate_highcharts(){ $.fn.cProcessForm.activate_highcharts(); };
function activate_and_export_highcharts(){ $.fn.cProcessForm.activate_and_export_highcharts(); };
/*
if (!window.DOMTokenList) {
  Element.prototype.containsClass = function(name) {
    return new RegExp("(?:^|\\s+)" + name + "(?:\\s+|$)").test(this.className);
  };

  Element.prototype.addClass = function(name) {
    if (!this.containsClass(name)) {
      var c = this.className;
      this.className = c ? [c, name].join(' ') : name;
    }
  };

  Element.prototype.removeClass = function(name) {
    if (this.containsClass(name)) {
      var c = this.className;
      this.className = c.replace(
          new RegExp("(?:^|\\s+)" + name + "(?:\\s+|$)", "g"), "");
    }
  };
}

// sse.php sends messages with text/event-stream mimetype.
var source = new EventSource('../engine/php/sse.php');

function closeConnection() {
  source.close();
  updateConnectionStatus('Disconnected', false);
}

function updateConnectionStatus(msg, connected) {
  var el = document.querySelector('#connection');
  if (connected) {
    if (el.classList) {
      el.classList.add('connected');
      el.classList.remove('disconnected');
    } else {
      el.addClass('connected');
      el.removeClass('disconnected');
    }
  } else {
    if (el.classList) {
      el.classList.remove('connected');
      el.classList.add('disconnected');
    } else {
      el.removeClass('connected');
      el.addClass('disconnected');
    }
  }
  el.innerHTML = msg + '<div></div>';
}

source.addEventListener('message', function(event) {
  if( event.data ){
  var data = JSON.parse(event.data);

  var options = {
        iconUrl: data.pic,
        title: data.title,
        body: data.msg+"\n"+data.host,
        timeout: 5000, // close notification in 1 sec
        onclick: function () {
            //console.log('Pewpew');
        }
    };
	if ( $("#push-notification-support") ) {
		var notification = $.notification(options)
		.then(function (notification) {
			//window.focus();
			//console.log('Ok!');
		}, function (error) {
			console.error('Rejected with status ' + error);
		});
		console.log('receive', data.check_sum );
		console.log('receiveG', gCheck_sum );
		
		if( data.check_sum && gCheck_sum != data.check_sum )
			authenticated_visitor( {visitor_data: data, url:$.fn.cProcessForm.requestURL } );
			
		$('.b-level').text('Notifications are ' + $.notification.permissionLevel());
	}
  }
}, false);

source.addEventListener('open', function(event) {
  updateConnectionStatus('Connected', true);
}, false);

source.addEventListener('error', function(event) {
  if (event.eventPhase == 2) { //EventSource.CLOSED
    updateConnectionStatus('Disconnected', false);
  }
}, false);
*/