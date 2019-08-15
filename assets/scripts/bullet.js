
cc.Class({
    extends: cc.Component,

    properties: {
        anim_sp: {
            default: [],
            type: cc.SpriteFrame
        },

        anim_duration: 0.1,

        degree: 45,
        speed: 400,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.is_shoot = false;
    },

    shoot_to: function(degree){
        console.log("degree = ", degree);
        this.degree = degree;

        var r = degree * Math.PI / 180;
        this.vx = this.speed * Math.cos(r);
        this.vy = this.speed * Math.sin(r);

        this.node.rotation = 180 - (this.degree + 90);
        this.is_shoot = true;
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

        
    },
});
