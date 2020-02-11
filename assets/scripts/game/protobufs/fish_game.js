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

function send_bullet(body){
    ws.send_cmd(Stype.FishGame, Cmd.FishGame.SEND_BULLET, body);
}

function do_ready(){
    ws.send_cmd(Stype.FishGame, Cmd.FishGame.DO_READY, null);
}

function recover_fish(body){
    ws.send_cmd(Stype.FishGame, Cmd.FishGame.RECOVER_FISH, body);
}

module.exports = {
    enter_zone: enter_zone,
    quit_zone: quit_zone,
    send_bullet: send_bullet,
    do_ready: do_ready,
    recover_fish: recover_fish,
};