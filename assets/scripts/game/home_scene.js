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
var game_system = require("game_system");
var fish_game = require("fish_game");
var Cmd = require("Cmd");
var Response = require("Response");
var ugame = require("ugame");
var sound_manager = require("sound_manager");

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
        user_nick: {
            default: null,
            type: cc.Label
        },

        user_gold: {
            default: null,
            type: cc.Label
        },

        waitConnection: {
            default: null,
            type: cc.Node
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {

        // 播放背景音乐;
        sound_manager.play_music("res/sounds/music_bgm01.mp3", true);
        // end
    },

    start () {
        console.log(cc.winSize.width, cc.winSize.height);

        this.waitConnection.active = false;
        this.user_nick.string = "" + ugame.unick;
        this.user_gold.string = "" + ugame.user_game_info.uchip;
    },

    junior_enter: function(){
        console.log("junior_enter");
        sound_manager.play_effect("res/sounds/touch_effects01.mp3");
        this.waitConnection.active = true;

        ugame.save_zid(1);
        cc.director.loadScene("game_scene");
    },

    senior_enter: function(){
        console.log("senior_enter");
        sound_manager.play_effect("res/sounds/touch_effects01.mp3");
        this.waitConnection.active = true;

        ugame.save_zid(2);
        cc.director.loadScene("game_scene");
    },

    // update (dt) {},
});
