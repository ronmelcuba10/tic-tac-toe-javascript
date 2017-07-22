$(document).ready(function () {
    // javascript variables    
    var cell = "cell";
    var horizontal_line = "horizontal-line";
    var vertical_line = "vertical-line";
    var leftdiagonal = "left-diagonal";
    var right_diagonal = "right-diagonal";
    var final_message_str = "";
    var computer_first_move = true;
    var computer_second_move = true;
    var left_upper_cell = 0;
    var upper_center_cell = 1;
    var right_upper_cell = 2;
    var left_center_cell = 3;
    var center_cell = 4;
    var right_center_cell = 5;
    var left_lower_cell = 6;
    var lower_center_cell = 7;
    var right_lower_cell = 8;

    //DOM identifiers/elements
    var user_clicked = "userclicked-cell";
    var machine_clicked = "machineclicked-cell";
    var empty_cell = "empty-cell";
    var winning_cell = "wining-cell";
    var cells = document.getElementsByClassName("cell");
    var message_element_id = "#message";
    var cell_elements = ".cell";
    var radio_elements = "input[type=radio][name=complexity]";
    var restart_game_button = "#restart-game-button";
    var easy_radio_element = "#easy";
    var impossible_radio_element = "#impossible";


    // click handler
    $(cell_elements).click(function () {
        if (final_message_str.length != 0) {
            final_message(final_message_str + " . Press OK to reset the game");
            reset_board();
            return;
        }
        if ($(this).hasClass(empty_cell) && final_message_str.length == 0) {
            var index = place_mark($(this), false);
            final_message_str = checkgame(index, user_clicked);
            if (final_message_str.length == 0) {
                index = computer_move();
                final_message_str = checkgame(index, machine_clicked);
            }
        }
        if (final_message_str.length != 0) {
            $(message_element_id).html(final_message_str + ". Please reset the game.");
        }
    });

    // reset the game when change complexity
    $(radio_elements).change( function (){
        reset_board();
    });

    // reset button click
    $(restart_game_button).click(function () {
        reset_board();
    });

    // return a non-empty string msg if the game finished otherwise empty string
    function checkgame(index, cellclass) {
        if (won(index, cellclass)) return cellclass == user_clicked ? "You won!!" : "You lost!!";
        if (tied()) return "Game tied";
        return "";
    }

    // resets the board, all cells are empty now!!!
    function reset_board() {
        $.each(cells, function (i, v) {
            v.className = "";
            $(v).addClass(cell + " " + empty_cell);
        });
        final_message_str = "";
        $(message_element_id).html("Keep playing!!");
        computer_first_move = true;
        computer_second_move = true;
    }

    //player's turn
    function place_mark(element, bymachine) {
        var cell_class = bymachine ? machine_clicked : user_clicked;
        element.removeClass(empty_cell);
        element.addClass(cell_class);
        if (!bymachine) { // if it was the user then returns the element index
            var x = parseInt(element.attr("id").substring(1, 2));
            var y = parseInt(element.attr("id").substring(2));
            return y * 3 + x; // index in the HTMLCollection
        }
    }

    // machine logic
    function computer_move() {
        var index;
        var easy = $(easy_radio_element).is(":checked");
        if (!easy) index = smart_move();
        else index = random_move();
        place_mark($(cells[index]), true);
        return index;
    }

    // makes the computer to play smart
    function smart_move() {
        var index;

        var impossible = $(impossible_radio_element).is(":checked");
        if (impossible && (computer_first_move || computer_second_move)) {
            var i = brilliant_moves()
            return i;
        }

        index = offensive_move();
        if (!isNaN(index)) return index;
        index = defensive_move();
        if (!isNaN(index)) return index;
        return random_move();
    }

    // movements for impossible game
    function brilliant_moves() {
        if (computer_first_move){
            return first_move();
        }
        return second_move();
    }

    // this is the main play to always tie the game
    function first_move(){
        computer_first_move = false;
        // select the center cell in case the player hadn't
        if (!$(cells[center_cell]).hasClass(user_clicked)) return center_cell;
        // otherwise select any corner cell
        else return select_corner_cell_available(); 
    }

    // if the player selected the center cell in the first play
    function second_move() {
        computer_second_move = false;
        // check for any deffensive move
        index = defensive_move();
        if (!isNaN(index)) return index;
        if ($(cells[center_cell]).hasClass(machine_clicked)) return select_non_corner_cell()
        else return select_corner_cell_available(); 
    }

    // select any corner cell available
    function select_corner_cell_available(){
        return select_available_cell_in_array([left_upper_cell, right_upper_cell, left_lower_cell, right_lower_cell]);
    }

    // select any corner cell available
    function select_non_corner_cell(){
        return select_available_cell_in_array([upper_center_cell, right_center_cell, left_center_cell, lower_center_cell]);
    }

    function select_available_cell_in_array(cells_indexes_array) {
        do{
            var index = cells_indexes_array[ Math.floor((Math.random() * 4))] ;
        }
        while (!$(cells[index]).hasClass(empty_cell))
        return index;
    }

    // look for any offensive play
    function offensive_move() {
        
        if ($(cells[left_upper_cell]).hasClass(machine_clicked)) {
            if ($(cells[upper_center_cell]).hasClass(machine_clicked) && $(cells[right_upper_cell]).hasClass(empty_cell)) return right_upper_cell;
            if ($(cells[right_upper_cell]).hasClass(machine_clicked) && $(cells[upper_center_cell]).hasClass(empty_cell)) return upper_center_cell;
            if ($(cells[left_center_cell]).hasClass(machine_clicked) && $(cells[left_lower_cell]).hasClass(empty_cell)) return left_lower_cell;

            
            if ($(cells[left_lower_cell]).hasClass(machine_clicked) && $(cells[left_center_cell]).hasClass(empty_cell)) return left_center_cell;
            if ($(cells[center_cell]).hasClass(machine_clicked) && $(cells[right_lower_cell]).hasClass(empty_cell)) return right_lower_cell;
            if ($(cells[right_lower_cell]).hasClass(machine_clicked) && $(cells[center_cell]).hasClass(empty_cell)) return center_cell;
        }

        if ($(cells[upper_center_cell]).hasClass(machine_clicked)) {
            if ($(cells[center_cell]).hasClass(machine_clicked) && $(cells[lower_center_cell]).hasClass(empty_cell)) return lower_center_cell;
            if ($(cells[lower_center_cell]).hasClass(machine_clicked) && $(cells[center_cell]).hasClass(empty_cell)) return center_cell;
        }

        if ($(cells[left_center_cell]).hasClass(machine_clicked)) {
            if ($(cells[center_cell]).hasClass(machine_clicked) && $(cells[right_center_cell]).hasClass(empty_cell)) return right_center_cell;
            if ($(cells[right_center_cell]).hasClass(machine_clicked) && $(cells[center_cell]).hasClass(empty_cell)) return center_cell;
        }

        if ($(cells[right_upper_cell]).hasClass(machine_clicked)) {
            if ($(cells[center_cell]).hasClass(machine_clicked) && $(cells[left_lower_cell]).hasClass(empty_cell)) return left_lower_cell;
            if ($(cells[left_lower_cell]).hasClass(machine_clicked) && $(cells[center_cell]).hasClass(empty_cell)) return center_cell;
            if ($(cells[right_center_cell]).hasClass(machine_clicked) && $(cells[right_lower_cell]).hasClass(empty_cell)) return right_lower_cell;
            if ($(cells[right_lower_cell]).hasClass(machine_clicked) && $(cells[right_center_cell]).hasClass(empty_cell)) return right_center_cell;
        }

        if ($(cells[left_lower_cell]).hasClass(machine_clicked)) {
            if ($(cells[lower_center_cell]).hasClass(machine_clicked) && $(cells[right_lower_cell]).hasClass(empty_cell)) return right_lower_cell;
            if ($(cells[right_lower_cell]).hasClass(machine_clicked) && $(cells[lower_center_cell]).hasClass(empty_cell)) return lower_center_cell;
        }

        if ($(cells[left_upper_cell]).hasClass(empty_cell)) {
            if ($(cells[upper_center_cell]).hasClass(machine_clicked) && $(cells[right_upper_cell]).hasClass(machine_clicked)) return left_upper_cell;
            if ($(cells[center_cell]).hasClass(machine_clicked) && $(cells[right_lower_cell]).hasClass(machine_clicked)) return left_upper_cell;
            if ($(cells[left_center_cell]).hasClass(machine_clicked) && $(cells[left_lower_cell]).hasClass(machine_clicked)) return left_upper_cell;
        }

        if ($(cells[left_center_cell]).hasClass(empty_cell) &&
            $(cells[center_cell]).hasClass(machine_clicked) &&
            $(cells[right_center_cell]).hasClass(machine_clicked)) return left_center_cell;

        if ($(cells[upper_center_cell]).hasClass(empty_cell) &&
            $(cells[center_cell]).hasClass(machine_clicked) &&
            $(cells[lower_center_cell]).hasClass(machine_clicked)) return upper_center_cell;

        if ($(cells[left_lower_cell]).hasClass(empty_cell) &&
            $(cells[lower_center_cell]).hasClass(machine_clicked) &&
            $(cells[right_lower_cell]).hasClass(machine_clicked)) return left_lower_cell;

        if ($(cells[right_upper_cell]).hasClass(empty_cell)) {
            if ($(cells[right_center_cell]).hasClass(machine_clicked) && $(cells[right_lower_cell]).hasClass(machine_clicked)) return right_upper_cell;
            if ($(cells[center_cell]).hasClass(machine_clicked) && $(cells[left_lower_cell]).hasClass(machine_clicked)) return right_upper_cell;
        }
    }

    // look for any defensive play
    function defensive_move() {
        
        if ($(cells[left_upper_cell]).hasClass(user_clicked)){
            if ($(cells[upper_center_cell]).hasClass(user_clicked) && $(cells[right_upper_cell]).hasClass(empty_cell)) return right_upper_cell;
            if ($(cells[right_upper_cell]).hasClass(user_clicked) && $(cells[upper_center_cell]).hasClass(empty_cell)) return upper_center_cell;
            if ($(cells[left_center_cell]).hasClass(user_clicked) && $(cells[left_lower_cell]).hasClass(empty_cell)) return left_lower_cell;
            if ($(cells[left_lower_cell]).hasClass(user_clicked) && $(cells[left_center_cell]).hasClass(empty_cell)) return left_center_cell;
            if ($(cells[center_cell]).hasClass(user_clicked) && $(cells[right_lower_cell]).hasClass(empty_cell)) return right_lower_cell;
            if ($(cells[right_lower_cell]).hasClass(user_clicked) && $(cells[center_cell]).hasClass(empty_cell)) return center_cell;
        }  

        if ($(cells[upper_center_cell]).hasClass(user_clicked)){
            if ($(cells[center_cell]).hasClass(user_clicked) && $(cells[lower_center_cell]).hasClass(empty_cell)) return lower_center_cell;
            if ($(cells[lower_center_cell]).hasClass(user_clicked) && $(cells[center_cell]).hasClass(empty_cell)) return center_cell;
        }  

        if ($(cells[left_center_cell]).hasClass(user_clicked)){
            if ($(cells[center_cell]).hasClass(user_clicked) && $(cells[right_center_cell]).hasClass(empty_cell)) return right_center_cell;
            if ($(cells[right_center_cell]).hasClass(user_clicked) && $(cells[center_cell]).hasClass(empty_cell)) return center_cell;
        }  

        if ($(cells[left_lower_cell]).hasClass(user_clicked)){
            if ($(cells[lower_center_cell]).hasClass(user_clicked) && $(cells[right_lower_cell]).hasClass(empty_cell)) return right_lower_cell;
            if ($(cells[right_lower_cell]).hasClass(user_clicked) && $(cells[lower_center_cell]).hasClass(empty_cell)) return lower_center_cell;
        }  

        if ($(cells[right_upper_cell]).hasClass(user_clicked)){
            if ($(cells[center_cell]).hasClass(user_clicked) && $(cells[left_lower_cell]).hasClass(empty_cell)) return left_lower_cell;
            if ($(cells[left_lower_cell]).hasClass(user_clicked) && $(cells[center_cell]).hasClass(empty_cell)) return center_cell;
            if ($(cells[right_center_cell]).hasClass(user_clicked) && $(cells[right_lower_cell]).hasClass(empty_cell)) return right_lower_cell;
            if ($(cells[right_lower_cell]).hasClass(user_clicked) && $(cells[right_center_cell]).hasClass(empty_cell)) return right_center_cell;
        }  

        if (($(cells[left_upper_cell]).hasClass(empty_cell) && $(cells[upper_center_cell]).hasClass(user_clicked) && $(cells[right_upper_cell]).hasClass(user_clicked)) || 
            ($(cells[left_upper_cell]).hasClass(empty_cell) && $(cells[left_center_cell]).hasClass(user_clicked) && $(cells[left_lower_cell]).hasClass(user_clicked)) ||
            ($(cells[left_upper_cell]).hasClass(empty_cell) && $(cells[center_cell]).hasClass(user_clicked) && $(cells[right_lower_cell]).hasClass(user_clicked))) return left_upper_cell;
        if ($(cells[upper_center_cell]).hasClass(empty_cell) && $(cells[center_cell]).hasClass(user_clicked) && $(cells[lower_center_cell]).hasClass(user_clicked)) return upper_center_cell;

        if ($(cells[left_center_cell]).hasClass(empty_cell) && $(cells[center_cell]).hasClass(user_clicked) && $(cells[right_center_cell]).hasClass(user_clicked)) return left_center_cell;  

        if ($(cells[left_lower_cell]).hasClass(empty_cell) && $(cells[lower_center_cell]).hasClass(user_clicked) && $(cells[right_lower_cell]).hasClass(user_clicked)) return left_lower_cell;

        if (($(cells[right_upper_cell]).hasClass(empty_cell) && $(cells[center_cell]).hasClass(user_clicked) && $(cells[left_lower_cell]).hasClass(user_clicked)) || 
            ($(cells[right_upper_cell]).hasClass(empty_cell) && $(cells[right_center_cell]).hasClass(user_clicked) && $(cells[right_lower_cell]).hasClass(user_clicked))) return right_upper_cell;
        
    }

    // selects a random cell, basic computer skills
    function random_move() {
        var index;
        do {
            index = Math.floor((Math.random() * 10));
            rnd_cell = cells[index];
        } while (!$(cells[index]).hasClass(empty_cell));
        return index;
    }

    // returns true if player won
    function won(index, cellclass) {
        if (check_horizontal(index, cellclass) ||
            check_vertical(index, cellclass) ||
            check_left_diagonal(index, cellclass) ||
            check_right_diagonal(index, cellclass)) {
            gameisfinished = true;
            return true;
        }
        else return false;
    }

    // returns true if game is tied
    function tied() {
        var i = 0;
        while (i < 9) {
            if ($(cells[i++]).hasClass(empty_cell)) return false;
        }
        gameisfinished = true;
        return true;
    }

    // show message
    function final_message(msg) {
        alert(msg);
    }

    // checks if won horizontally in the last play and marks the winning cells
    function check_horizontal(index, cellclass) {
        var row = Math.floor(index / 3);
        var result = $(cells[row * 3]).hasClass(cellclass) &&
            $(cells[row * 3 + 1]).hasClass(cellclass) &&
            $(cells[row * 3 + 2]).hasClass(cellclass);

        if (result) highlight_cells([row * 3, row * 3 + 1, row * 3 + 2], winning_cell);
        return result;
    }

    // checks if won vertically in the last play and marks the winning cells
    function check_vertical(index, cellclass) {
        var col = index % 3;
        var result = $(cells[col]).hasClass(cellclass) &&
            $(cells[col + 3]).hasClass(cellclass) &&
            $(cells[col + 6]).hasClass(cellclass);
        
        if (result) highlight_cells([col, col + 3, col + 6], winning_cell);
        return result;
    }

    // // checks if won diagonally from left upper corner in the last play and marks the winning cells
    function check_left_diagonal(index, cellclass) {
        if (index % 4 == 0) {
            var result = $(cells[0]).hasClass(cellclass) &&
                $(cells[center_cell]).hasClass(cellclass) &&
                $(cells[right_lower_cell]).hasClass(cellclass);
            
            if (result) highlight_cells([left_upper_cell, center_cell, right_lower_cell], winning_cell);
            return result;
        }
        return false;
    }

    // detects if the right diagonal is owned mark the winning cells
    function check_right_diagonal(index, cellclass) {
        if ([right_upper_cell, center_cell, left_lower_cell].includes(index)) {
            var result = $(cells[right_upper_cell]).hasClass(cellclass) &&
                $(cells[center_cell]).hasClass(cellclass) &&
                $(cells[left_lower_cell]).hasClass(cellclass);

            if (result) highlight_cells([right_upper_cell, center_cell, left_lower_cell], winning_cell);
            return result;
        }
        return false;
    }

    // adds a specific class to the cell in the array
    function highlight_cells(indexes, cellclass) {
        indexes.every( i => $(cells[i]).addClass(cellclass));
    }

});

