/* Rock, Paper, Scissors, Lizard, Spock game. */
var timerInterval, timerSet;

class RPSLSGame {
    constructor(){
        this.playerValue = 0;
        this.opponentValue = 0;
        this.winner = 0;
        this.mode = "arcade";
        this.score = 0;

        // start (i.e. max) time for timer in arcade mode
        this.timerMax = 15;

        // stores current value of interval used for timerBar in arcade mode
        this.timerIntvValue = 0;

        // state for normal mode, true if player is selecting an option else false
        this.selectingOptions = false;

        // piece options for the game
        this.playerOptions = {1: {name: "rock", beats: [3, 4], winMsgs: {3: "Rock crushes Scissors ", 4: "Rock crushes Lizard "}},
                              2: {name: "paper", beats: [1, 5], winMsgs: {1: "Paper covers Rock", 5: "Paper disproves Spock"}},
                              3: {name: "scissors", beats: [2, 4], winMsgs: {2: "Scissors cuts Paper", 4: "Scissors decapitates Lizard"}},
                              4: {name: "lizard", beats: [5, 2], winMsgs: {5: "Lizard poisons Spock", 2: "Lizard eats Paper"}},
                              5: {name: "spock", beats: [4, 1], winMsgs: {3: "Spock smashes Scissors", 1: "Spock vaporizes Rock"}}}

        this.totalOptions = Object.keys(this.playerOptions).length
    }

    /**
     * starts a new game mode, normal or arcade
     *
     * @param {string} mode the game-mode, normal or arcade
     */
    newGame(mode){
        this.mode = mode;

        if(mode == "normal"){
            this.showOptions();
        } else if(mode == "arcade"){
            $("#welcome_section").addClass("hidden");
            $("#game_results").addClass("hidden");
            $("#playerOptions").addClass("hidden");
            $("#arcade_mode").removeClass("hidden");

            // sets init values
            this.score = 0;
            this.opponentValue = 1;

            $("#score").text("Score: 0");
            $("#arcade_timer").val(0);

            // starts timer bar
            this.setTimerbar();
        }
    }

    /**
     * handles player selecting an option (piece) during a game (arcade and normal)
     *
     * @param {integer} p players selected option (1-5)
     */
    playersTurn(p){
        if(Object.keys(this.playerOptions).indexOf(p) == -1){
            throw "[Player] Invalid value for player option: " + p.toString()
        }

        this.playerValue = p;

        if(this.mode == "normal"){
            this.generateOpponent();
            this.winner = this.getWinner();

            game.selectingOptions = false;

            // load results
            this.showResults();

            this.ResultsSoundManager(this.winner);
        } else {
            this.winner = this.getWinner();
            this.generateOpponent();

            if(this.winner != 1){
                // ends game and shows results if player has not selected an
                // option that defeats opponents
                clearInterval(timerInterval);
                this.showResults();
            }

            let name = this.playerOptions[this.opponentValue].name;

            // update current peice to new piece
            $("#current_piece .option .img").attr("id", name);
            $("#current_piece .option .title").text(name);

            // reset timer
            $("#arcade_timer").val(0);

            clearInterval(timerInterval);
            this.setTimerbar();

            // update score
            this.score += 1;

            $("#score").text("Score: " + this.score);
        }
    }

    /**
     * decides on the winner for the game, using the players and opponents value
     *
     * @return {integer} returns 1 (player wins), 2 (computer wins), 3 (it's a draw)
     */
    getWinner(){
        let pOpt = this.playerOptions[this.playerValue];
        let oOpt = this.playerOptions[this.opponentValue];

        if(pOpt == oOpt){
            return 3;
        } else if(pOpt.beats.indexOf(this.opponentValue) != -1){
            return 1;
        } else{
            return 2;
        }
    }

    /**
     * randomly generates the opponents value by generating random number from 1 to 5,
     * (1-5 corrosponding to the keys used in this.playerOptions)
     */
    generateOpponent(){
        this.opponentValue = Math.floor((Math.random() * this.totalOptions) + 1);;
    }

    /**
     * called when a game ends, displays the results from a game. For an arcade game that is the
     * score, and for a normal game that is the players selected piece, the opponets generated piece
     * and whether the players has won or not.
     */
    showResults(){
        if(this.mode == "normal"){
            let p = this.playerOptions[this.playerValue];
            let o = this.playerOptions[this.opponentValue];

            // updates images on option images in results page
            $("#game_results #player .img").attr("id", p.name);
            $("#game_results #opponent .img").attr("id", o.name);

            // updates winner text and messages based on game result
            if(this.winner == 3){
                $("#game_results #title").text("It's a draw")
                $("#results").text("All things are equal")
            } else if(this.winner == 1){
                $("#game_results #title").text("winner winner chicken...")
                console.log(p.winMsgs[this.opponentValue]);
                $("#results").text(p.winMsgs[this.opponentValue])
            } else {
                $("#game_results #title").text("You Lose")
                $("#results").text(o.winMsgs[this.playerValue])
            }

            // takes results page out of arcade mode
            $("#game_results").removeClass("arcade_mode");
        } else {
            // plays game-over sound
            this.ResultsSoundManager(4);

            // sets results page for arcade mode
            $("#game_results").addClass("arcade_mode");
            $("#game_results #title").text("Game Over")
            $("#results").text("You Scored " + this.score + " Points!");
        }

        $("#arcade_mode").addClass("hidden");
        $("#welcome_section").addClass("hidden");
        $("#game_results").removeClass("hidden");
        $("#player_options").addClass("hidden");
    }

    /**
     * displays options for player to select from, used in normal mode
     */
    showOptions(){
        // states that player is currently selecting an option, ensures they can
        // select using the keyboard
        game.selectingOptions = true;

        $("#welcome_section").addClass("hidden");
        $("#game_results").addClass("hidden");
        $("#player_options").removeClass("hidden");
    }

    /**
     * displays main-menu (welcome page)
     */
    showMenu(){
        $("#welcome_section").removeClass("hidden");
        $("#game_results").addClass("hidden");
        $("#player_options").addClass("hidden");
    }

    /*
     * manager for sounds used in results page. plays a sound
     * based on the results of a game.
     *
     * @param {integer} result results of game 1 (player wins), 2 (player loses), 3 (draw), 4 (arcade game-over)
     */
    ResultsSoundManager(result){
        let audioObjects = {1: document.getElementById("win_sound"),
                            2: document.getElementById("lose_sound"),
                            3: document.getElementById("draw_sound"),
                            4: document.getElementById("game_over_sound")}

        if(result >= 1 && result <= 4){
            audioObjects[result].play();
        } else {
            throw "[SOUND MANAGER] Invalid option for audio. "
        }
    }

    /**
     * creates a setInterval to update the timerBar in arcade mode
     * and uses expon function to decrease timer as players score increases
     */
    setTimerbar(){
        if(timerSet){
            // updates timer interval so decreases as player score increases
            this.timerIntvValue = this.timerIntvValue / Math.exp(this.score * 0.03);
        } else {
            // sets initial value for timer interval
            this.timerIntvValue = 1000 * (this.timerMax / 100);
        }

        timerInterval = setInterval(function(){
            // sets that first timer has been set
            timerSet = 1;

            let value = $("#arcade_timer").val();
            let nv = parseInt(value) + 1;

            $("#arcade_timer").val(nv);

            if(nv == 100){
                // end if progress bar is filled
                clearInterval(timerInterval);

                game.showResults();
            }
        }, this.timerIntvValue
    )}
}
