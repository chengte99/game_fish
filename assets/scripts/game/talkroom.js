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
var utils = require("utils");

var STYPE_TALKKROOM = 1;

var TalkCmd = {
    Enter: 1,
    Exit: 2,
    UserArrived: 3,
    UserExit: 4,
    SendMsg: 5,
    UserMsg: 6,
};

var Response = {
    OK: 1,
    INVALID_OPT: -100,
    IN_ROOM: -101,
    NOT_IN_ROOM: -102,
}

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

        scrollView: {
            default: null,
            type: cc.ScrollView,
        },

        editBox: {
            default: null,
            type: cc.EditBox,
        },

        des_tips: {
            default: null,
            type: cc.Prefab
        },

        self_talk: {
            default: null,
            type: cc.Prefab
        },

        other_talk: {
            default: null,
            type: cc.Prefab
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        ws.register_serivces_handler({
            1: this.on_recv_cmd_handler.bind(this),
        });
    },

    show_tips: function(msg){
        var tips = cc.instantiate(this.des_tips);
        tips.getChildByName("msg").getComponent(cc.Label).string = msg;

        this.scrollView.content.addChild(tips);
        this.scrollView.scrollToBottom(0.1);
    },

    show_self_talk: function(user, msg){
        var self_talk = cc.instantiate(this.self_talk);
        self_talk.getChildByName("uname").getComponent(cc.Label).string = user;
        self_talk.getChildByName("msg").getComponent(cc.Label).string = msg;

        this.scrollView.content.addChild(self_talk);
        this.scrollView.scrollToBottom(0.1);
    },

    show_other_talk: function(user, msg){
        var other_talk = cc.instantiate(this.other_talk);
        other_talk.getChildByName("uname").getComponent(cc.Label).string = user;
        other_talk.getChildByName("msg").getComponent(cc.Label).string = msg;

        this.scrollView.content.addChild(other_talk);
        this.scrollView.scrollToBottom(0.1);
    },

    start () {
        this.uname = "遊客" + utils.random_int_str(6);
        this.usex = utils.random_int(0, 1);
    },

    on_recv_cmd_handler: function(stype, ctype, body){
        console.log(body);
        switch(ctype){
            case TalkCmd.Enter:
                if(body == Response.OK){
                    this.show_tips("您已經進入房間");
                }
                break;
            case TalkCmd.Exit:
                if(body == Response.OK){
                    this.show_tips("您已經離開房間");
                }
                break;
            case TalkCmd.UserArrived:
                this.show_tips(body.uname + "已經進入房間");
                break;
            case TalkCmd.UserExit:
                this.show_tips(body.uname + "已經離開房間");
                break;
            case TalkCmd.SendMsg:
                if(body[0] == Response.OK){
                    console.log(body[3]);
                    this.show_self_talk(body[1], body[3]);
                }
                break;
            case TalkCmd.UserMsg:
                this.show_other_talk(body[0], body[2]);
                break;
        }
    },

    enter_talkroom: function(){
        ws.send_cmd(STYPE_TALKKROOM, TalkCmd.Enter, {
            uname: this.uname,
            usex: this.usex,
        });
    },

    exit_talkroom: function(){
        ws.send_cmd(STYPE_TALKKROOM, TalkCmd.Exit, null);
    },

    send_msg: function(){
        var input = this.editBox.string;
        if(!input || input.length < 0){
            return;
        }

        ws.send_cmd(STYPE_TALKKROOM, TalkCmd.SendMsg, input);
        this.editBox.string = "";
    },

    // update (dt) {},
});
