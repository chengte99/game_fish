var utils = require("utils");
var ws = require("websocket");
var Stype = require("Stype");
var Cmd = require("Cmd");

function get_game_info() {
    ws.send_cmd(Stype.GameSystem, Cmd.GameSystem.GET_GAME_INFO, null);
}

module.exports = {
    get_game_info: get_game_info,
};

