// var utils = require("utils");
// var ws = require("websocket");
// var Stype = require("Stype");
// var Cmd = require("Cmd");

import {utils} from "../../utils/utils";
import {websocket as ws} from "../../module/websocket";
import {Stype} from "../Stype";
import {Cmd} from "../Cmd";

function get_game_info() {
    ws.send_cmd(Stype.GameSystem, Cmd.GameSystem.GET_GAME_INFO, null);
}

const numberRegexp = /^[0-9]+$/;

// module.exports = {
//     get_game_info: get_game_info,
// };
export {get_game_info, numberRegexp}
