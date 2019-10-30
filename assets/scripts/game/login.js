// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
var ws = require("websocket");
var auth = require("auth");
var game_system = require("game_system");
var Cmd = require("Cmd");
var Response = require("Response");
var ugame = require("ugame");

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        ws.register_serivces_handler({
            2: this.on_auth_service_handler.bind(this),
            3: this.on_game_system_service_handler.bind(this),
        });
    },

    start () {
        // var data = {
        //     uname: "大凱文",
        //     upwd: "asd123",
        // };

        // this.scheduleOnce(function(){
        //     websocket.send_cmd(1,1, data);
        // }, 3)
    },

    on_get_game_info: function(){
        game_system.get_game_info();
    },

    guest_login_return: function(ret) {
        if(ret.status != Response.OK){
            console.log("遊客登入失敗 ...");
            return;
        }

        console.log("遊客登入成功 ...", ret.unick);
        ugame.guest_login_success(ret.unick, ret.usex, ret.uface, ret.uvip, ret.guest_key);
        this.on_get_game_info();
    },

    on_auth_service_handler: function(stype, ctype, body){
        console.log("body = ", body);
        switch(ctype){
            case Cmd.Auth.GUEST_LOGIN:
                this.guest_login_return(body);
                break;
            case Cmd.Auth.RELOGIN:
                console.log("已重複登入 ...");
                break;
        }
    },

    get_game_info_return: function(ret) {
        if(ret.status != Response.OK){
            console.log("獲取遊戲信息失敗 ...");
            return;
        }
        
        console.log("獲取遊戲信息成功 ...金幣 = ", ret.uchip);
        ugame.get_game_info_success(ret.uexp, ret.uchip, ret.udata);
        // cc.director.loadScene("home_scene");
    },

    on_game_system_service_handler: function(stype, ctype, body){
        console.log("body = ", body);
        switch(ctype){
            case Cmd.GameSystem.GET_GAME_INFO:
                this.get_game_info_return(body);
                break;
        }
    },

    on_click_quest_login: function(){
        auth.quest_login();
    },

    on_click_weixin_login: function(){

    },

    // update (dt) {},
});
