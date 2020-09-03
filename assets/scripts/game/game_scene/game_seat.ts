import {ugame} from '../ugame';
import * as fish_game from "../protobufs/fish_game"

// var ugame = require("ugame");
// var fish_game = require("fish_game");

const {ccclass, property} = cc._decorator;

@ccclass
export class game_seat extends cc.Component {

    @property({type: cc.Label, tooltip: "玩家暱稱"})
    unick: cc.Label = null;

    @property({type: cc.Label, tooltip: "玩家餘額"})
    uchip: cc.Label = null;

    @property({type: cc.Label, tooltip: "玩家vip等級"})
    uvip: cc.Label = null;

    // onLoad () {}

    start () {

    }

    sitdown_seat(uinfo, is_self, is_reconnect){
        this.unick.string = "" + uinfo.unick;
        this.uvip.string = "LV: " + uinfo.uvip;
        this.uchip.string = "" + uinfo.uchip;

        if(is_self && !is_reconnect){
            fish_game.do_ready();
        }
    }

    standup_seat(is_self){
        this.unick.string = "";
        this.uvip.string = "LV: ";
        this.uchip.string = "";
    }

    update_uchip(uchip, is_self){
        if(is_self){
            ugame.user_game_info.uchip = uchip;
        }
        this.uchip.string = "" + uchip;
    }

    // update (dt) {}
}
