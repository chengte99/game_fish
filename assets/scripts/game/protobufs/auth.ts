// var utils = require("utils");
// var ws = require("websocket");
// var Stype = require("Stype");
// var Cmd = require("Cmd");
// var ugame = require("ugame");

import {utils} from "../../utils/utils";
import {websocket as ws} from "../../module/websocket";
import {Stype} from "../Stype";
import {Cmd} from "../Cmd";
import {ugame} from "../ugame";

function quest_login(){
    var key = ugame.guest_key; //從本地獲取，若沒有則自動生成一組32位的key;
    if(!key){
        key = utils.random_string(32);
    };
    console.log(key);
 
    ws.send_cmd(Stype.Auth, Cmd.Auth.GUEST_LOGIN, key);
}

const numberRegexp = /^[0-9]+$/;

// module.exports = {
//     quest_login: quest_login,
// };
export {quest_login}