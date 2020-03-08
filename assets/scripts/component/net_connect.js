// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
var websocket = require("websocket");
var http = require("http");
var proto_man = require("proto_man");

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
        is_proto_json: false,
        is_release: true,
        release_url: "http://www.yuhaolu.cn:10001",
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.server_info = null;
        if(this.is_release){
            this.host_ip = this.release_url;
        }else{
            this.host_ip = "http://127.0.0.1:10001";
        }
    },

    get_server_info: function(){
        http.get(this.host_ip, "/server_info", null, function(err, ret){
            if(err){
                console.log("connect_server get fail");
                console.log(err);

                this.scheduleOnce(this.get_server_info.bind(this), 3);
                return;
            }

            var json = JSON.parse(ret);
            console.log(json);
            this.server_info = json;

            this.connect_server();

        }.bind(this));
    },

    connect_server: function(){
        if(this.is_proto_json){
            websocket.connect("ws://" + this.server_info.host + ":" + this.server_info.ws_port + "/ws", proto_man.PROTO_JSON);
            // websocket.connect("ws://127.0.0.1:6081/ws", proto_man.PROTO_JSON);
        }else{
            websocket.connect("ws://" + this.server_info.host + ":" + this.server_info.ws_port + "/ws", proto_man.PROTO_BUF);
            // websocket.connect("ws://127.0.0.1:6081/ws", proto_man.PROTO_BUF);
        }
    },

    start () {
        this.get_server_info();
    },

    // update (dt) {},
});
