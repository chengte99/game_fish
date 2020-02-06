var ws = require("websocket");
var ugame = require("ugame");
var fish_game = require("fish_game");
var Cmd = require("Cmd");
var Response = require("Response");

var game_seat = require("game_seat");
var cannon = require("cannon");

cc.Class({
    extends: cc.Component,

    properties: {
        fish_root: {
            default: null,
            type: cc.Node,
        },

        fish_prefabs: {
            default: [],
            type: cc.Prefab,
        },

        seat_A: {
            default: null,
            type: game_seat,
        },

        seat_B: {
            default: null,
            type: game_seat,
        },

        seat_A_cannon: {
            default: null,
            type: cannon,
        },

        seat_B_cannon: {
            default: null,
            type: cannon,
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        ws.register_serivces_handler({
            4: this.on_game_service_handler.bind(this),
        });
    },

    enter_zone_return: function(status){
        if(status != Response.OK){
            console.log("enter_zone_return fail ...");
            return;
        }

        console.log("enter_zone_return success ...");
    },

    user_quit_return: function(status){
        if(status != Response.OK){
            console.log("user_quit_return fail ...");
            return;
        }

        console.log("user_quit_return success ...");
        ugame.zid = -1;

        cc.director.loadScene("home_scene");
    },

    enter_room_return: function(ret){
        if(ret[0] != Response.OK){
            console.log("enter_room_return fail ...");
            return;
        }

        console.log("enter_room_return success, room_id ...", ret[2]);
        ugame.room_id = ret[2];
    },

    exit_room_return: function(status){
        if(status != Response.OK){
            console.log("exit_room_return fail ...");
            return;
        }

        console.log("exit_room_return success ...");
        ugame.room_id = -1;
    },

    sitdown_return: function(ret){
        if(ret[0] != Response.OK){
            console.log("sitdown_return fail ...");
            return;
        }

        ugame.seat_id = ret[1];

        console.log("sitdown_return success ...");
        var uinfo = {
            sv_seat: ret[1],
            unick: ugame.unick,
            usex: ugame.usex,
            uface: ugame.uface,
            uchip: ugame.user_game_info.uchip,
            uexp: ugame.user_game_info.uexp,
            uvip: ugame.user_game_info.uvip,
        }

        this.seat_A.sitdown_seat(uinfo, true);

        this.scheduleOnce(function(){
            this.create_fish();
        }, Math.random() * 2 + 2);
    },

    standup_return: function(ret){
        if(ret[0] != Response.OK){
            console.log("standup_return fail ...");
            return;
        }

        console.log("standup_return success ...");
        if(ret[1] == ugame.seat_id){
            ugame.seat_id = -1;
            this.seat_A.standup_seat(true);
            this.cancel_auto_foucs();
        }else{
            this.seat_B.standup_seat(false);
        }
        
    },

    user_arrived_return: function(ret){
        console.log("user_arrived_return success ...");
        
        var uinfo = {
            sv_seat: ret[0],
            unick: ret[1],
            usex: ret[2],
            uface: ret[3],
            uchip: ret[4],
            uexp: ret[5],
            uvip: ret[6]
        }

        this.seat_B.sitdown_seat(uinfo, false);
    },

    send_bullet_return: function(ret){
        if(ret[0] != Response.OK){
            console.log("send_bullet_return fail ...");
            return;
        }

        console.log("send_bullet_return success ...");

        var bullet_info = {
            sv_seat: ret[1],
            level: ret[2],
            cost: ret[3],
            damage: ret[4],
            speed: ret[5],
        }

        if(bullet_info.sv_seat == ugame.seat_id){
            // 自己發送的
            this.seat_A.update_uchip(bullet_info.cost);
            this.seat_A_cannon.prepare_to_shoot(bullet_info);
        }else{
            console.log("對手發的");
        }

        // ugame.user_game_info.uchip += ret[3];
        // this.gold_label.string = "" + ugame.user_game_info.uchip;

        // // 產生子彈發射
        
        // this.seat_A_cannon.prepare_to_shoot(bullet_body);
    },

    on_game_service_handler: function(stype, ctype, body){
        console.log("body = ", body);
        switch(ctype){
            case Cmd.FishGame.ENTER_ZONE:
                this.enter_zone_return(body);
                break;
            case Cmd.FishGame.USER_QUIT:
                this.user_quit_return(body);
                break;
            case Cmd.FishGame.ENTER_ROOM:
                this.enter_room_return(body);
                break;
            case Cmd.FishGame.EXIT_ROOM:
                this.exit_room_return(body);
                break;
            case Cmd.FishGame.USER_SITDOWN:
                this.sitdown_return(body);
                break;
            case Cmd.FishGame.USER_STANDUP:
                this.standup_return(body);
                break;
            case Cmd.FishGame.USER_ARRIVED:
                this.user_arrived_return(body);
                break;
            case Cmd.FishGame.SEND_BULLET:
                this.send_bullet_return(body);
                break;
                    
        }
    },

    start () {
        fish_game.enter_zone(ugame.zid);

        this.now_time = 0;
    },

    on_click_quit_room: function(){
        fish_game.quit_zone();
    },

    cancel_auto_foucs: function(){
        this.seat_A_cannon.target = null;
        this.seat_A_cannon.node.rotation = 0;
    },

    reset_seat_B_cannon: function(){
        this.seat_B_cannon.target = null;
        this.seat_B_cannon.node.rotation = 0;
    },

    upgrade_cannon: function(){
        this.seat_A_cannon.upgrade();
    },

    downgrade_cannon: function(){
        this.seat_A_cannon.downgrade();
    },

    create_fish: function(){
        var index = Math.floor(Math.random() * this.fish_prefabs.length);
        if(index >= this.fish_prefabs.length){
            index = this.fish_prefabs.length - 1;
        }

        var fish = cc.instantiate(this.fish_prefabs[index]);
        this.fish_root.addChild(fish);

        this.scheduleOnce(function(){
            this.create_fish();
        }, Math.random() * 2 + 2);
    },

    update (dt) {
        if(this.seat_A_cannon.target == null){
            return;
        }

        if(this.seat_A_cannon.level == 1 && ugame.user_game_info.uchip < 10){
            return;
        }else if(this.seat_A_cannon.level == 2 && ugame.user_game_info.uchip < 30){
            return;
        }

        this.now_time += dt;
        if(this.now_time >= this.seat_A_cannon.shoot_duration){
            this.now_time = 0;
            fish_game.send_bullet({
                0: ugame.seat_id,
                1: this.seat_A_cannon.level
            });
        }
    },
});
