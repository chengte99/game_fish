import { sound_manager } from "../module/sound_manager";
import { ugame } from './ugame';

// var ws = require("websocket");
// var game_system = require("game_system");
// var fish_game = require("fish_game");
// var Cmd = require("Cmd");
// var Response = require("Response");
// var ugame = require("ugame");
// var sound_manager = require("sound_manager");

const {ccclass, property} = cc._decorator;

@ccclass
export default class home_scene extends cc.Component {

    @property({type: cc.Label, tooltip: "用戶名稱"})
    user_nick: cc.Label = null;

    @property({type: cc.Label, tooltip: "用戶餘額"})
    user_gold: cc.Label = null;

    @property({type: cc.Node, tooltip: "等待視窗組件"})
    waitConnection: cc.Node = null;

    @property({type: cc.AudioClip, tooltip: "背景音樂"})
    bg_music: cc.AudioClip = null;

    @property({type: cc.AudioClip, tooltip: "按鍵音效"})
    btn_effect: cc.AudioClip = null;

    onLoad () {
        // 播放背景音乐;
        sound_manager.play_music(this.bg_music, true);
        // end
    }

    start () {
        console.log(cc.winSize.width, cc.winSize.height);

        this.waitConnection.active = false;
        this.user_nick.string = "" + ugame.unick;
        this.user_gold.string = "" + ugame.user_game_info.uchip;
    }

    junior_enter(){
        console.log("junior_enter");
        sound_manager.play_effect(this.btn_effect);
        this.waitConnection.active = true;

        ugame.save_zid(1);
        cc.director.loadScene("game_scene");
    }

    senior_enter(){
        console.log("senior_enter");
        sound_manager.play_effect(this.btn_effect);
        this.waitConnection.active = true;

        ugame.save_zid(2);
        cc.director.loadScene("game_scene");
    }

    // update (dt) {}
}
