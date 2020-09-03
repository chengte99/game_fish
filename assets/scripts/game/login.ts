import { sound_manager } from "../module/sound_manager";
import { websocket as ws } from "../module/websocket";
import { Cmd } from "./Cmd";
import * as auth from "./protobufs/auth";
import * as game_system from "./protobufs/game_system";
import { Response } from './Response';
import { ugame } from './ugame';

// var ws = require("websocket");
// var auth = require("auth");
// var game_system = require("game_system");
// var Cmd = require("Cmd");
// var Response = require("Response");
// var ugame = require("ugame");
// var sound_manager = require("sound_manager");

const {ccclass, property} = cc._decorator;

@ccclass
export default class login extends cc.Component {

    @property({type: cc.Node, tooltip: "等待視窗組件"})
    wait_windos: cc.Node = null;

    @property({type: cc.AudioClip, tooltip: "背景音樂"})
    bg_music: cc.AudioClip = null;

    @property({type: cc.AudioClip, tooltip: "按鍵音效"})
    btn_effect: cc.AudioClip = null;

    onLoad () {
        ws.register_serivces_handler({
            2: this.on_auth_service_handler.bind(this),
            3: this.on_game_system_service_handler.bind(this),
        });

        // 播放背景音乐;
        sound_manager.play_music(this.bg_music, true);
        // end
    }

    start () {
        console.log(cc.winSize.width, cc.winSize.height);
        
        this.wait_windos.active = false;
        // var data = {
        //     uname: "大凱文",
        //     upwd: "asd123",
        // };

        // this.scheduleOnce(function(){
        //     websocket.send_cmd(1,1, data);
        // }, 3)
    }

    on_get_game_info(){
        game_system.get_game_info();
    }

    guest_login_return(ret) {
        if(ret.status != Response.OK){
            console.log("遊客登入失敗 ...");
            return;
        }

        console.log("遊客登入成功 ...", ret.unick);
        ugame.guest_login_success(ret.unick, ret.usex, ret.uface, ret.uvip, ret.guest_key);
        this.on_get_game_info();
    }

    on_auth_service_handler(stype, ctype, body){
        console.log("body = ", body);
        switch(ctype){
            case Cmd.Auth.GUEST_LOGIN:
                this.guest_login_return(body);
                break;
            case Cmd.Auth.RELOGIN:
                console.log("已重複登入 ...");
                break;
        }
    }

    get_game_info_return(ret) {
        if(ret.status != Response.OK){
            console.log("獲取遊戲信息失敗 ...");
            return;
        }
        
        console.log("獲取遊戲信息成功 ...金幣 = ", ret.uchip);
        ugame.get_game_info_success(ret.uexp, ret.uchip, ret.udata, ret.uvip);
        cc.director.loadScene("home_scene");
    }

    on_game_system_service_handler(stype, ctype, body){
        console.log("body = ", body);
        switch(ctype){
            case Cmd.GameSystem.GET_GAME_INFO:
                this.get_game_info_return(body);
                break;
        }
    }

    on_click_quest_login(){
        sound_manager.play_effect(this.btn_effect);

        this.wait_windos.active = true;
        auth.quest_login();
    }

    on_click_weixin_login(){
        sound_manager.play_effect(this.btn_effect);
    }

    // update (dt) {}
}
