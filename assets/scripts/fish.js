
cc.Class({
    extends: cc.Component,

    properties: {
        anim_sp: {
            default: [],
            type: cc.SpriteFrame
        },

        anim_duration: 0.1,

        cannon_path: "Canvas/cannon_root/fort_0",
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        var cannon = cc.find(this.cannon_path);
        var cannon_m = cannon.getComponent("cannon");

        this.node.on(cc.Node.EventType.TOUCH_START, function(e){
            cannon_m.target = this.node;    
        }, this);
        
    },

    onCollisionEnter: function(other, self){
        console.log("on collision enter...", other, self);
    },

    start () {
        this.frame_anim = this.node.addComponent("frame_anim");
        this.frame_anim.sprite_frames = this.anim_sp;
        this.frame_anim.duration = this.anim_duration;
        this.frame_anim.play_loop();
    },

    // update (dt) {},
});
