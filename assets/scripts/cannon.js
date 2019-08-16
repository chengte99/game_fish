
cc.Class({
    extends: cc.Component,

    properties: {
        anim_sp: {
            default: [],
            type: cc.SpriteFrame
        },

        anim_duration: 0.1,

        target: {
            default: null,
            type: cc.Node
        },

        bullet_prefab: {
            default: null,
            type: cc.Prefab
        },

        bullet_root: {
            default: null,
            type: cc.Node
        },

        shoot_duration: 0.5,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.frame_anim = this.node.addComponent("frame_anim");
        this.frame_anim.sprite_frames = this.anim_sp;
        this.frame_anim.duration = this.anim_duration;
        // this.frame_anim.play_loop();

        this.now_time = 0;
    },

    shoot_target: function(){
        var src = this.node.getPosition();
        var b = cc.instantiate(this.bullet_prefab);
        var b_com = b.getComponent("bullet");
        this.bullet_root.addChild(b);
        b.setPosition(src);
        b_com.shoot_to(this.target);
    },

    update (dt) {
        if(this.target == null){
            return;
        }

        this.now_time += dt;
        if(this.now_time >= this.shoot_duration){
            this.now_time = 0;
            this.shoot_target();
        }

        if(this.target != null){
            var dst = this.target.getPosition();
            var src = this.node.getPosition();
            var dir = dst.sub(src);
            var r = Math.atan2(dir.y, dir.x);
            var degree = r * 180 / Math.PI;
            this.node.rotation = 180 - (degree + 90);
        }

    },
});
