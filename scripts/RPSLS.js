/* Rock, Paper, Scissors, Lizard, Spock game. */
var timerInterval;

class RPSLSGame {
    constructor(){

        this.playerValue = 0;
        this.opponentValue = 0;
        this.winner = 0;

        this.mode = "arcade";
        this.score = 0;

        this.timerVal = 0;
        this.timerMax = 10;

        // used to decrease timer everytime user guesses right i.e. new timer = old timer * this.timerConstant
        this.timerConstant = 0.95;

        this.selectingOptions = false;

        this.playerOptions = {1: {name: "rock", beats: [3, 4], winMsgs: {3: "Rock crushes Scissors ", 4: "Rock crushes Lizard "}},
                              2: {name: "paper", beats: [1, 5], winMsgs: {1: "Paper covers Rock", 5: "Paper disproves Spock"}},
                              3: {name: "scissors", beats: [2, 4], winMsgs: {2: "Scissors cuts Paper", 4: "Scissors decapitates Lizard"}},
                              4: {name: "lizard", beats: [5, 2], winMsgs: {5: "Lizard poisons Spock", 2: "Lizard eats Paper"}},
                              5: {name: "spock", beats: [4, 1], winMsgs: {3: "Spock smashes Scissors", 1: "Spock vaporizes Rock"}}}

        this.totalOptions = Object.keys(this.playerOptions).length
    }

    newGame(mode){
        console.log(mode);
        this.mode = mode;

        if(mode == "normal"){
            this.showOptions();
        } else if(mode == "arcade"){
            $("#welcome_section").addClass("hidden");
            $("#game_results").addClass("hidden");
            $("#playerOptions").addClass("hidden");
            $("#arcade_mode").removeClass("hidden");

            this.score = 0;


            $("#score").text("Score: 0");
            $("#arcade_timer").val(0);

            this.setTimerbar(1);
        }
    }

    playersTurn(p){
        if(Object.keys(this.playerOptions).indexOf(p) == -1){
            throw "[Player] Invalid value for player option: " + p.toString()
        }

        this.playerValue = p;

        if(this.mode == "normal"){
            this.generateOpponent();
            this.winner = this.getWinner();

            game.selectingOptions = false;

            console.log(this.winner)

            // load opponent loading screen


            // load results
            this.showResults();

            this.ResultsSoundManager(this.winner);
        } else {
            this.winner = this.getWinner();
            this.generateOpponent();

            if(this.winner != 1){
                clearInterval(timerInterval);
                this.showResults();
            }

            let name = this.playerOptions[this.opponentValue].name;

            this.winner = this.getWinner();

            // update current peice to new piece
            $("#current_piece .option .img").attr("id", name);
            $("#current_piece .option .title").text(name);

            // reset timer and update speed
            $("#arcade_timer").val(0);

            clearInterval(timerInterval);
            this.setTimerbar(0.95);

            // update score
            this.score += 1;

            $("#score").text("Score: " + this.score);
        }
    }

    getWinner(){
        let pOpt = this.playerOptions[this.playerValue];
        let oOpt = this.playerOptions[this.opponentValue];

        console.log(this.playerValue, this.opponentValue)

        if(pOpt == oOpt){
            return 3;
        } else if(pOpt.beats.indexOf(this.opponentValue) != -1){
            return 1;
        } else{
            return 2;
        }
    }

    generateOpponent(){
        /* randomly selects piece for opponent */
        let randomInt = Math.floor((Math.random() * this.totalOptions) + 1);
        let opnValue = randomInt
        //let oppon = this.playerOptions[randomInt];

        this.opponentValue = opnValue;
    }

    showResults(){
        if(this.mode == "normal"){
            let p = this.playerOptions[this.playerValue];
            let o = this.playerOptions[this.opponentValue];

            $("#game_results #player .img").attr("id", p.name);
            $("#game_results #opponent .img").attr("id", o.name);

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

            $("#game_results").removeClass("arcade_mode");
        } else {
            this.ResultsSoundManager(4);

            $("#game_results").addClass("arcade_mode");

            $("#game_results #title").text("Game Over")
            $("#results").text("You Scored " + this.score + " Points!");
        }

        $("#arcade_mode").addClass("hidden");
        $("#welcome_section").addClass("hidden");
        $("#game_results").removeClass("hidden");
        $("#player_options").addClass("hidden");
    }

    showOptions(){
        game.selectingOptions = true;

        $("#welcome_section").addClass("hidden");
        $("#game_results").addClass("hidden");
        $("#player_options").removeClass("hidden");
    }

    showMenu(){
        $("#welcome_section").removeClass("hidden");
        $("#game_results").addClass("hidden");
        $("#player_options").addClass("hidden");
    }

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

    setTimerbar(constant){
        timerInterval = setInterval(function(){
            let value = $("#arcade_timer").val();
            let nv = parseInt(value) + 1;

            $("#arcade_timer").val(nv);

            if(nv == 100){
                clearInterval(timerInterval);

                game.showResults();
            }
        }, 1000 / (100 / this.timerMax * constant));
    }
}
