var ugame = require("ugame");
var fish_game = require("fish_game");

cc.Class({
    extends: cc.Component,

    properties: {
        unick: {
            default: null,
            type: cc.Label,
        },

        uchip: {
            default: null,
            type: cc.Label,
        },

        uvip: {
            default: null,
            type: cc.Label
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        
    },

    sitdown_seat: function(uinfo, is_self){
        this.unick.string = "" + uinfo.unick;
        this.uvip.string = "LV: " + uinfo.uvip;
        
        if(is_self){
            this.uchip.string = "" + uinfo.uchip;
        }

        fish_game.do_ready();
    },

    standup_seat: function(is_self){
        this.unick.string = "";
        this.uvip.string = "LV: ";
        
        if(is_self){
            this.uchip.string = "";
        }
    },

    update_uchip: function(coin){
        // console.log("update_uchip ...", coin);
        ugame.user_game_info.uchip += coin;
        this.uchip.string = "" + ugame.user_game_info.uchip;
    },

    // update (dt) {},
});
