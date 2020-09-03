import { sound_manager } from "../module/sound_manager";
import { websocket as ws } from "../module/websocket";
import { Cmd } from "./Cmd";
import { cannon } from "./game_scene/cannon";
import { game_seat } from './game_scene/game_seat';
import * as fish_game from "./protobufs/fish_game";
import { Response } from './Response';
import { ugame } from './ugame';

// var ws = require("websocket");
// var ugame = require("ugame");
// var fish_game = require("fish_game");
// var Cmd = require("Cmd");
// var Response = require("Response");
// var game_seat = require("game_seat");
// var cannon = require("cannon");
// var sound_manager = require("sound_manager");

const {ccclass, property} = cc._decorator;

@ccclass
export default class game_scene extends cc.Component {
    
    @property({type: cc.Node, tooltip: "魚組件原始節點"})
    fish_root: cc.Node = null;

    @property({type: cc.Node, tooltip: "魚Prefab"})
    fish_prefabs: cc.Prefab = null;

    @property({type: game_seat, tooltip: "座位A"})
    seat_A: game_seat = null;

    @property({type: game_seat, tooltip: "座位B"})
    seat_B: game_seat = null;

    @property({type: cannon, tooltip: "座位A砲塔"})
    seat_A_cannon: cannon = null;

    @property({type: cannon, tooltip: "座位B砲塔"})
    seat_B_cannon: cannon = null;

    @property({type: cc.AudioClip, tooltip: "背景音樂"})
    bg_music: cc.AudioClip = null;

    now_time: number = 0;
    do_ready: boolean = false;
    fish_on_road_set: cc.Node[] = [];

    onLoad () {
        ws.register_serivces_handler({
            4: this.on_game_service_handler.bind(this),
        });

        sound_manager.play_music(this.bg_music, true);
    }

    start () {
        fish_game.enter_zone(ugame.zid);

        this.now_time = 0;
        this.do_ready = false;

        // 初始化每條路上的陣列
        this.fish_on_road_set = [];
        for(var i = 0; i < 16; i ++){
            this.fish_on_road_set.push(null);
        }
    }

    enter_zone_return(status){
        if(status != Response.OK){
            console.log("enter_zone_return fail ...", status);
            return;
        }

        console.log("enter_zone_return success ...");
    }

    user_quit_return(status){
        if(status != Response.OK){
            console.log("user_quit_return fail ...", status);
            return;
        }

        console.log("user_quit_return success ...");
        ugame.zid = -1;

        cc.director.loadScene("home_scene");

    }

    enter_room_return(ret){
        if(ret[0] != Response.OK){
            console.log("enter_room_return fail ...", ret[0]);
            return;
        }

        console.log("enter_room_return success, room_id ...", ret[2]);
        ugame.room_id = ret[2];
    }

    exit_room_return(status){
        if(status != Response.OK){
            console.log("exit_room_return fail ...", status);
            return;
        }

        console.log("exit_room_return success ...");
        ugame.room_id = -1;
    }

    sitdown_return(ret){
        if(ret[0] != Response.OK){
            console.log("sitdown_return fail ...", ret[0]);
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

        this.seat_A.sitdown_seat(uinfo, true, false);

        // this.scheduleOnce(function(){
        //     this.create_fish();
        // }, Math.random() * 2 + 2);
    }

    standup_return(ret){
        if(ret[0] != Response.OK){
            console.log("standup_return fail ...", ret[0]);
            return;
        }

        console.log("standup_return success ...");
        if(ret[1] == ugame.seat_id){
            ugame.seat_id = -1;
            this.seat_A.standup_seat(true);
            this.reset_seat_A_cannon();
        }else{
            this.seat_B.standup_seat(false);
            this.reset_seat_B_cannon();
        }
        
    }

    user_arrived_return(ret){
        console.log("user_arrived_return success ...");
        
        var uinfo = {
            sv_seat: ret[0],
            unick: ret[1],
            usex: ret[2],
            uface: ret[3],
            uchip: ret[4],
            uexp: ret[5],
            uvip: ret[6],
            state: ret[7]
        }

        this.seat_B.sitdown_seat(uinfo, false, false);
    }

    send_bullet_return(ret){
        if(ret[0] != Response.OK){
            console.log("send_bullet_return fail ...", ret[0]);
            return;
        }

        console.log("send_bullet_return success ...");

        var bullet_info = {
            sv_seat: ret[1],
            level: ret[2],
            uchip: ret[3],
            damage: ret[4],
            speed: ret[5],
        }

        if(bullet_info.sv_seat == ugame.seat_id){
            // 自己發送的
            this.seat_A.update_uchip(bullet_info.uchip, true);
            this.seat_A_cannon.prepare_to_shoot(bullet_info);
        }else{
            console.log("對手發的 ...", bullet_info);
            var fish_road_index = ret[6];
            if(this.fish_on_road_set[fish_road_index]){
                this.seat_B_cannon.target = this.fish_on_road_set[fish_road_index];
                this.seat_B.update_uchip(bullet_info.uchip, false);
                this.seat_B_cannon.prepare_to_shoot(bullet_info);
            }
        }
    }

    put_fish_return(ret){
        if(ret[0] <= 0){
            console.log("put_fish_return fail ...");
            return;
        }

        console.log("put_fish_return success ...", ret);

        // var fish = cc.instantiate(this.fish_prefabs[ret[0] - 1]);
        // // 將魚node存到陣列內
        // this.fish_on_road_set[ret[3]] = fish;

        // var fish_com = fish.getComponent("fish");
        // this.fish_root.addChild(fish);
        // fish_com.init_data(ret);
    }

    do_ready_return(ret){
        if(ret != Response.OK){
            console.log("do_ready_return fail ...");
            return;
        }

        console.log("do_ready_return success ...");
        this.do_ready = true;
    }

    recover_fish_return(ret){
        if(ret[0] != Response.OK){
            console.log("recover_fish_return fail ...");
            return;
        }

        console.log("recover_fish_return success ...");
        
        var body = {
            seat_id: ret[1],
            road_index: ret[2],
            uchip: ret[3],
        }

        var fish = this.fish_on_road_set[body.road_index];
        if(fish){
            // 如果該畫面上有才執行，因為後來開啟的不會有之前路徑上的魚
            fish.getComponent("fish").fish_dead(body);
        }
    }

    reconnect_return(ret){
        console.log("reconnect_return success ...", ret);

        ugame.seat_id = ret[0];
        ugame.room_id = ret[2];

        var uinfo = {
            sv_seat: ugame.seat_id,
            unick: ugame.unick,
            usex: ugame.usex,
            uface: ugame.uface,
            uchip: ugame.user_game_info.uchip,
            uexp: ugame.user_game_info.uexp,
            uvip: ugame.user_game_info.uvip,
        }

        // 自己坐下
        this.seat_A.sitdown_seat(uinfo, true, true);
        this.do_ready = true;

        // 對方坐下
        // console.log("arrived_data =", ret[1]);
        if(ret[1].length > 0){
            var arrived_data = ret[1][0];
            this.user_arrived_return(arrived_data);
        }
    }

    on_game_service_handler(stype, ctype, body){
        // console.log("body = ", body);
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
            case Cmd.FishGame.PUT_FISH:
                this.put_fish_return(body);
                break;
            // case Cmd.FishGame.DO_READY:
            //     this.do_ready_return(body);
            //     break;
            // case Cmd.FishGame.RECOVER_FISH:
            //     this.recover_fish_return(body);
            //     break;
            // case Cmd.FishGame.RECONNECT:
            //     this.reconnect_return(body);
            //     break;
        }
    }

    on_click_quit_room(){
        fish_game.quit_zone();
    }

    reset_seat_A_cannon(){
        this.seat_A_cannon.target = null;
        this.seat_A_cannon.node.angle = 0;
    }

    reset_seat_B_cannon(){
        this.seat_B_cannon.target = null;
        this.seat_B_cannon.node.angle = 180;
    }

    upgrade_cannon(){
        this.seat_A_cannon.upgrade();
    }

    downgrade_cannon(){
        this.seat_A_cannon.downgrade();
    }

    create_fish(body){
        var fish = cc.instantiate(this.fish_prefabs[body[0] - 1]);
        var fish_com = fish.getComponent("fish");
        this.fish_root.addChild(fish);

        fish_com.init_data(body);

        // this.scheduleOnce(function(){
        //     this.create_fish();
        // }, Math.random() * 2 + 2);
    }

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
                1: this.seat_A_cannon.level,
                2: this.seat_A_cannon.target.getComponent("fish").road_index
            });
        }
    }
}