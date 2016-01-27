var quiz_quote = function() {
	
	var that = this;
	
	// the provided data put into local scope
	var quiz_data = null;
	
	// app state variables
		// the order for this game
		var shuffled_quote_order;
		// where we are in the game
		var current_position = 0;
		// how many total quotes (set when the quiz_data is run)
		var total_quotes;
		// the current state on whether the user can go to the next question
		var proceed = false;
	
	// local scope for element access
	var elements = {
		container : null,
		quote_area : null,
		button_area : null,
		message_area : null
	}
	
	// invoke each time you want a new quiz
	this.run = function(_quiz_data, parent) {
		
		// its an object
		if(typeof(_quiz_data) === 'object') {
			
			// update local scope
			quiz_data = _quiz_data;
			
			// get on with building
			
			// this is the html skeletcon
			build_html_skeleton(parent);
			
			// set up the interface
			build_players();
			
		} else {
			// something went wrong, no quiz data
			$("body").text("No quiz data");
		}
	}
	
	
	/*
		build_html_skeleton()
		Invoked in the run statement, this builds the elements that the rest of the page uses
	
	*/
	var build_html_skeleton = function(parent) {
		
		// the main wrapper for the application
		elements.container = $("<div />", {
			"class" : "qq-container"
		}).appendTo(parent);
		
		// where the current quote appears
		elements.quote_area = $("<div />", {
			"class" : "qq-quote-area"
		}).appendTo(elements.container);
		
		// where the player buttons will appear
		elements.button_area = $("<div />", {
			"class" : "qq-button-area"
		}).appendTo(elements.container);
		
		// where the correct/wrong and next message appears
		elements.message_area = $("<div />", {
			"class" : "qq-message-area"
		}).appendTo(elements.container);
		
	}
	
	/*
		build_player_buttons()
		Invoked in the run statement
		This assembles the UI buttons and sets up the game
	*/
	var build_players = function() {
		
		// temporary object, with the merged quote and player ids
		var new_quiz_data = {}, count = 0;
		// clean out the button area
		elements.button_area.empty();
		
		// go through the provided quiz data
		_.each(quiz_data, function(player,a){
			
			// go through each quote and combine into an object with the player id	
			_.each(player.quotes, function(quote,b){
				new_quiz_data[count] = {
					"quote" : quote,
					"player" : player.id
				}
				count++;			
			});
			
			// add a button for each player
			var button_container = $("<div />", {
				"class" : "qq-player-button"
			})
			.on('click', function(evt){
				
				// they can't keep checking
				if(proceed===false) {
					// message template
					var message = '';
					// its the right player
					if(player.id === shuffled_quote_order[current_position].player) {
						
						message = "Success ! " + get_player_name(shuffled_quote_order[current_position].player) + " said that";
					
					} else {
						
						// its the wrong player
						message =  "Fail ! " + get_player_name(shuffled_quote_order[current_position].player) + " said that";
						
						
					}
					
					// allow the user to proceed to the next question
					proceed = true;
					elements.message_area.addClass('show-message').text(message);
					
					setTimeout(function(){
						elements.message_area.removeClass('show-message')
						attempt_next_question();
					}, 700);
				}
			})
			.appendTo(elements.button_area);
			
				// where the image appears
				var button_asset = $("<div />", {
					"class" : "qq-player-asset"
				}).appendTo(button_container);
					
					//image 
					var button_image = $("<img />", { 
						"src": player.button_asset
					}).appendTo(button_asset);
				
				// where the label appears
				var button_asset = $("<div />", {
					"class" : "qq-player-label",
					"text" : player.label
				}).appendTo(button_container);
			
		});
		
		// shuffle the order
		shuffled_quote_order = _.shuffle(new_quiz_data);
		total_quotes = _.size(shuffled_quote_order);
		
		// invoke the current message
		game_on();
				
	}
	
	// shows the current message
	var game_on = function() {
		
		// stop the user from skipping
		proceed = false;
		elements.message_area.text('');
		
		// update the quote area with the current quote
		elements.quote_area.text(shuffled_quote_order[current_position].quote);
	}
	
	// can we move on
	var attempt_next_question = function() {
		// user is allowed to move on
		if(proceed) {
			// update the counter
			current_position++;
			
			// we have reached the end of the game, so show an end message
			if(current_position>=total_quotes) {
				
				// hide the game
				elements.quote_area.hide();
				elements.button_area.hide();
				elements.message_area.hide();
				
				// build an end slate
				var end_slate = $("<div />", {
					"class" : "qq-end-slate"
				}).appendTo(elements.container);
				
					// thank you message
					var thank_you_message = $("<div />", {
						"class" : "qq-thank-you",
						"text" : "Thanks for playing."
					}).appendTo(end_slate); 
					// restart message
					var restart_message = $("<div />", {
						"class" : "qq-restart",
						"text" : "Restart"
					})
					.on('click', function(evt){
						
						// rmeove this
						end_slate.remove();
						
						// reshuffle the game
						shuffled_quote_order = null;
						total_quotes = 0;
						current_position = 0;
						build_players();
						
						// show elements again
						elements.message_area.text('');
						elements.quote_area.show();
						elements.button_area.show();
						elements.message_area.show();
					})
					.appendTo(end_slate); 
					
					// social message
					var social_message = $("<div />", {
						"class" : "qq-social-message"
					}).appendTo(end_slate); 
				
			} else {
				// show the next quote
				game_on();
			}
		}	
	}
	
	// gets the player name from the id
	var get_player_name = function(id) {
		
		var player_name = '';
		_.each(quiz_data, function(player){
			if(player.id === id) {
				player_name = player.label;
			}
		});
		
		return player_name;
	}
	
}