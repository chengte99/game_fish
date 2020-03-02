var ugame = require("ugame");
var fish_game = require("fish_game");

var STATE = {
    ALIVE: 0,
    DEAD: 1,
};

cc.Class({
    extends: cc.Component,

    properties: {
        anim_sp: {
            default: [],
            type: cc.SpriteFrame
        },

        anim_duration: 0.1,

        health_progress: {
            default: null,
            type: cc.ProgressBar
        },

        seat_A_path: "Canvas/seat_A",
        seat_B_path: "Canvas/seat_B",
        cannon_A_path: "Canvas/cannon_root/fort_0",
        cannon_B_path: "Canvas/cannon_root/fort_1",
        health: 100,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.game_scene = cc.find("Canvas").getComponent("game_scene");

        this.seat_A = cc.find(this.seat_A_path);
        this.seat_B = cc.find(this.seat_B_path);
        this.cannon_A = cc.find(this.cannon_A_path);
        this.cannon_B = cc.find(this.cannon_B_path);
        this.cannon_A_m = this.cannon_A.getComponent("cannon");
        this.cannon_B_m = this.cannon_B.getComponent("cannon");

        this.node.on(cc.Node.EventType.TOUCH_START, function(e){
            if(this.game_scene.do_ready){
                this.cannon_A_m.target = this.node;
            }
        }, this);

        //因初始在中間位置，會閃一下，修改初始縮放為0，配合nav_agent 設定位置後再縮放回正常
        this.node.scaleX = 0;
        this.node.scaleY = 0;
        //end
    },

    start () {
        this.frame_anim = this.node.addComponent("frame_anim");
        this.frame_anim.sprite_frames = this.anim_sp;
        this.frame_anim.duration = this.anim_duration;
        this.frame_anim.play_loop();

        this.state = STATE.ALIVE;
        this.now_health = this.health;
        this.health_progress.progress = this.now_health / this.health;
    },

    init_data: function(body){
        this.fish_id = body[0];
        this.health = body[1];
        this.speed = body[2];
        this.road_index = body[3];
        this.inroom_uid = body[4];
        
        this.nav_agent = this.node.addComponent("nav_agent");
        this.nav_agent.prepare_run_road(body);
    },

    remove_cannon_target: function(){
        // 自己砲塔歸位
        if(this.cannon_A_m.target == this.node){
            this.cannon_A_m.target = null;
            this.cannon_A_m.node.rotation = 0;
            // console.log("remove_cannon_target ...");
        }
    
        // 對方砲塔歸位
        if(this.cannon_B_m.target == this.node){
            this.cannon_B_m.target = null;
            this.cannon_B_m.node.rotation = 180;
            // console.log("remove_cannon_target ...");
        }
    },

    fish_dead: function(body){
        if(body.seat_id != -1){
            // 非系統死亡
            if(body.seat_id == ugame.seat_id){
                this.seat_A.getComponent("game_seat").update_uchip(body.uchip);
            }else{
                this.seat_B.getComponent("game_seat").update_uchip(body.uchip);
            }
        }
        
        this.state = STATE.DEAD;
        this.remove_cannon_target();

        var nav_agent = this.node.getComponent("nav_agent");
        nav_agent.is_walking = false;

        this.health_progress.node.active = false
        this.node.active = false;
        this.node.removeFromParent();
    },

    send_dead_msg: function(sv_seat){
        var body = {
            0: this.fish_id,
            1: this.health,
            2: this.road_index,
            3: this.inroom_uid,
            4: sv_seat
        }
        fish_game.recover_fish(body);
    },

    on_hit_from_bullet: function(other){
        if(this.state == STATE.DEAD){
            return;
        }

        var bullet_com = other.getComponent("bullet");
        var bullet_info = bullet_com.get_bullet_info();
        // console.log("bullet_info ...", bullet_info);

        if(bullet_info.sv_seat == ugame.seat_id){
            this.now_health -= bullet_info.damage;
            this.health_progress.progress = this.now_health / this.health;
        }
        bullet_com.hit_finished();

        if(this.now_health <= 0){
            // 通知server該魚已死
            this.send_dead_msg(bullet_info.sv_seat);
            
            // this.fish_dead(bullet_info);
        }
    },

    onCollisionEnter: function(other, self){
        // console.log("on collision enter...", other, self);

        if(this.state == STATE.DEAD){
            var bullet_com = other.getComponent("bullet");
            bullet_com.hit_finished();
            return;
        }

        this.on_hit_from_bullet(other);
    },

    // update (dt) {},
});
