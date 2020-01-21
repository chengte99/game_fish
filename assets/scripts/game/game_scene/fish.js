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

        cannon_path: "Canvas/cannon_root/fort_0",
        health: 100,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.game_scene = cc.find("Canvas").getComponent("game_scene");

        this.cannon = cc.find(this.cannon_path);
        this.cannon_m = this.cannon.getComponent("cannon");

        this.node.on(cc.Node.EventType.TOUCH_START, function(e){
            this.cannon_m.target = this.node;    
        }, this);

        //因初始在中間位置，會閃一下，修改初始縮放為0，配合nav_agent 設定位置後再縮放回正常
        this.node.scaleX = 0;
        this.node.scaleY = 0;
        //end
    },

    remove_cannon_target: function(){
        if(this.cannon_m.target == this.node){
            this.cannon_m.target = null;
            this.cannon_m.node.rotation = 0;
            console.log("remove_cannon_target ...");
        }
    },

    fish_dead: function(bullet_com){
        console.log("fish Dead ...");
        this.game_scene.gold += this.health;

        this.state = STATE.DEAD;
        this.remove_cannon_target();

        var nav_agent = this.node.getComponent("nav_agent");
        nav_agent.is_walking = false;

        this.health_progress.node.active = false
        this.node.active = false;
        this.node.removeFromParent();
    },

    on_hit_from_bullet: function(other){
        if(this.state == STATE.DEAD){
            return;
        }

        var bullet_com = other.getComponent("bullet");
        this.now_health -= bullet_com.demange;
        this.health_progress.progress = this.now_health / this.health;
        bullet_com.hit_finished();

        if(this.now_health <= 0){
            this.fish_dead(bullet_com);
        }
    },

    onCollisionEnter: function(other, self){
        // console.log("on collision enter...", other, self);

        if(this.state == STATE.DEAD){
            return;
        }

        this.on_hit_from_bullet(other);
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

    // update (dt) {},
});
