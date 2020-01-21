
cc.Class({
    extends: cc.Component,

    properties: {
        anim_sp: {
            default: [],
            type: cc.SpriteFrame
        },

        anim_duration: 0.1,

        boom_anim_sp: {
            default: [],
            type: cc.SpriteFrame
        },

        boom_anim_duration: 0.1,

        degree: 45,
        speed: 400,
        demange: 2,
        cost: 10,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.game_scene = cc.find("Canvas").getComponent("game_scene");
        this.is_shoot = false;
    },

    shoot_to: function(target){
        this.shoot_enemy = target;
        if(this.shoot_enemy != null){
            var nav_agent = this.shoot_enemy.getComponent("nav_agent");
        }

        var dst = this.shoot_enemy.getPosition();
        var src = this.node.getPosition();
        var dir = dst.sub(src);
        var len = dir.mag();
        var time = len / this.speed;

        dst = nav_agent.position_after_time(time);
        dir = dst.sub(src);

        this.vx = this.speed * dir.x / len;
        this.vy = this.speed * dir.y / len;

        var r = Math.atan2(dir.y, dir.x);
        var degree = r * 180 / Math.PI;
        this.degree = degree;
        this.node.rotation = 180 - (this.degree + 90);

        this.is_shoot = true;
        this.game_scene.gold -= this.cost;
    },

    hit_finished: function(){
        // this.node.removeFromParent();

        this.node.active = true;
        this.node.scaleX = 0.3;
        this.node.scaleY = 0.3;
        this.frame_anim.sprite_frames = this.boom_anim_sp;
        this.frame_anim.duration = this.boom_anim_duration;
        this.frame_anim.play_once(function(){
            this.node.active = false;
            this.node.removeFromParent();
        });
    },

    onCollisionEnter: function(other, self){
        // console.log("bullet hit fish ...", other, self);

        this.is_shoot = false;
        this.node.active = false;
        this.frame_anim.stop_anim();
    },

    start () {
        this.frame_anim = this.node.addComponent("frame_anim");
        this.frame_anim.sprite_frames = this.anim_sp;
        this.frame_anim.duration = this.anim_duration;
        this.frame_anim.play_loop();

        // this.shoot_to(45);
    },

    update (dt) {
        if(!this.is_shoot){
            return;
        }
        
        var sx = this.vx * dt;
        var sy = this.vy * dt;

        this.node.x += sx;
        this.node.y += sy;
        
        (cc.winSize.width * 0.5)
        if(this.node.x > (cc.winSize.width * 0.5) || 
        this.node.x < -(cc.winSize.width * 0.5) || 
        this.node.y > (cc.winSize.height * 0.5) || 
        this.node.y < -(cc.winSize.height * 0.5)){
            this.node.removeFromParent();
        }
    },
});
