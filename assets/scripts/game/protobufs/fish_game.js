var utils = require("utils");
var ws = require("websocket");
var Stype = require("Stype");
var Cmd = require("Cmd");

function enter_zone(zid) {
    ws.send_cmd(Stype.FishGame, Cmd.FishGame.ENTER_ZONE, zid);
}

function quit_zone(){
    ws.send_cmd(Stype.FishGame, Cmd.FishGame.USER_QUIT, null);
}

module.exports = {
    enter_zone: enter_zone,
    quit_zone: quit_zone,
};