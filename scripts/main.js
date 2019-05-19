var game;

$(document).ready(function(){
    game = new RPSLSGame();

    // called when players selects a piece
    $(".option").click(function(){
        let opt = $(this).attr("value");

        game.playersTurn(opt);
    })

    // used to show/hide sections in welcome section/main-menu
    $(".info_header").click(function(){
        let p_tag = $(this).next();

        $(p_tag).toggle();
        $(this).toggleClass("open")
    })

    $(".game_butn").click(function(){
        let mode = $(this).attr("value");

        // starts new game using selected game mode
        game.newGame(mode);
    })

    // shows main-menu (welcome screen)
    $(".main_menu_butn").click(game.showMenu);

    // triggered when key is pressed and released
    $("body").keyup(function(){keyPress(event)});
})

/**
 * handles keypresses on body, allows the user to select an option
 * using the keys 1 to 5, during selectin of option in normal mode or in
 * arcade mode
 *
 * @param {Object} event object containning info of key pressed
 */
function keyPress(event){
    // only allow when in arcade mode or selecting option in normal mode
    if(!game.selectingOptions && game.mode == "normal") return 0;

    let value = event.key;

    // call game.playersTurn if option selected is valid
    if(Object.keys(game.playerOptions).indexOf(value) != -1){
        game.playersTurn(value);
    }
}
