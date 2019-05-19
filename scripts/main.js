var game, win, lose, draw;

$(document).ready(function(){
    game = new RPSLSGame();

    $(".option").click(function(){
        let opt = $(this).attr("value");

        game.playersTurn(opt);
    })

    $(".info_header").click(function(){
        let p_tag = $(this).next();

        $(p_tag).toggle();
        $(this).toggleClass("open")
    })

    $(".game_butn").click(function(){
        let mode = $(this).attr("value");

        game.newGame(mode);
    })

    $(".main_menu_butn").click(game.showMenu);

    $("body").keyup(function(){keyPress(event)});

    //test();
})

function keyPress(event){
    if(!game.selectingOptions && game.mode == "normal") return 0;

    let value = event.key;

    if(Object.keys(game.playerOptions).indexOf(value) != -1){
        game.playersTurn(value);
    }
}
