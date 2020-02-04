var ws = require("websocket");
var ugame = require("ugame");
var fish_game = require("fish_game");
var Cmd = require("Cmd");
var Response = require("Response");

cc.Class({
    extends: cc.Component,

    properties: {
        cannon_nodes: {
            default: [],
            type: cc.Node,
        },

        fish_root: {
            default: null,
            type: cc.Node,
        },

        fish_prefabs: {
            default: [],
            type: cc.Prefab,
        },

        gold_label: {
            default: null,
            type: cc.Label,
        },

        unick_label: {
            default: null,
            type: cc.Label,
        },

        player2: {
            default: null,
            type: cc.Node,
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        ws.register_serivces_handler({
            4: this.on_game_service_handler.bind(this),
        });

        this.cannon_com_1 = this.cannon_nodes[0].getComponent("cannon");
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

        console.log("sitdown_return success, seat_id ...", ret[1]);
        ugame.seat_id = ret[1];

        this.scheduleOnce(function(){
            this.create_fish();
        }, Math.random() * 2 + 2);
    },

    standup_return: function(ret){
        if(ret[0] != Response.OK){
            console.log("standup_return fail ...");
            return;
        }

        console.log("standup_return success, seat_id ...", ret[1]);
        ugame.seat_id = -1;
    },

    user_arrived_return: function(ret){
        if(ret[0] < 0 || ret[0] >= 2){
            console.log("user_arrived_return fail ...");
            return;
        }

        console.log("user_arrived_return success, ret ...", ret);
        
        this.cannon_nodes[1].active = true;
        this.player2.active = true;

        this.player2_com = this.player2.getComponent("player2");
        this.player2_com.init_info(ret);

        this.cannon_com_2 = this.cannon_nodes[1].getComponent("cannon");
    },

    send_bullet_return: function(ret){
        if(ret[0] != Response.OK){
            console.log("send_bullet_return fail ...");
            return;
        }

        console.log("send_bullet_return success, ret ...", ret);
        ugame.user_game_info.uchip += ret[3];
        this.gold_label.string = "" + ugame.user_game_info.uchip;

        // 產生子彈發射
        var bullet_body = {
            level: ret[2],
            cost: ret[3],
            damage: ret[4],
            speed: ret[5],
        }
        this.cannon_com_1.prepare_to_shoot(bullet_body);
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

        // this.gold = ugame.user_game_info.uchip;
        this.unick_label.string = "" + ugame.unick;
        this.gold_label.string = "" + ugame.user_game_info.uchip;

        this.now_time = 0;
    },

    on_click_quit_room: function(){
        fish_game.quit_zone();
    },

    cancel_auto_foucs: function(){
        this.cannon_com_1.target = null;
        this.cannon_com_1.node.rotation = 0;
    },

    upgrade_cannon: function(){
        this.cannon_com_1._upgrade();
    },

    downgrade_cannon: function(){
        this.cannon_com_1._downgrade();
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
        if(this.cannon_com_1.target == null){
            return;
        }

        if(this.cannon_com_1.level == 1 && ugame.user_game_info.uchip < 10){
            return;
        }else if(this.cannon_com_1.level == 2 && ugame.user_game_info.uchip < 30){
            return;
        }

        this.now_time += dt;
        if(this.now_time >= this.cannon_com_1.shoot_duration){
            this.now_time = 0;
            fish_game.send_bullet({
                0: ugame.seat_id,
                1: this.cannon_com_1.level
            });
        }
    },
});
