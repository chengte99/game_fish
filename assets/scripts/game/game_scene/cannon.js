var ugame = require("ugame");

var shoot_anim = cc.Class({
    name: "shoot_anim",
    properties: {
        shoot_anim_frame:{
            default: [],
            type: cc.SpriteFrame
        },
    }
})

cc.Class({
    extends: cc.Component,

    properties: {
        anim_sp: {
            default: [],
            type: shoot_anim
        },

        anim_duration: 0.1,

        target: {
            default: null,
            type: cc.Node
        },

        level: 1,
        
        idle_sp: {
            default: [],
            type: cc.SpriteFrame
        },

        bullet_prefab: {
            default: [],
            type: cc.Prefab
        },

        bullet_root: {
            default: null,
            type: cc.Node
        },

        shoot_duration: 0.5,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.game_scene = cc.find("Canvas").getComponent("game_scene");

    },

    start () {
        this.frame_anim = this.node.addComponent("frame_anim");

        this.now_time = 0;
    },

    upgrade: function(){
        if(this.level == 2){
            return;
        }

        this.level += 1;
        this.node.getComponent(cc.Sprite).spriteFrame = this.idle_sp[this.level - 1];
        this.node.scaleX = 0.8;
        this.node.scaleY = 0.8;
    },

    downgrade: function(){
        if(this.level == 1){
            return;
        }

        this.level -= 1;
        this.node.getComponent(cc.Sprite).spriteFrame = this.idle_sp[this.level - 1];
        this.node.scaleX = 1;
        this.node.scaleY = 1;
    },

    shoot_target: function(body){
        this.frame_anim.sprite_frames = this.anim_sp[this.level - 1].shoot_anim_frame;
        this.frame_anim.duration = this.anim_duration;
        this.frame_anim.play_once();

        var src = this.node.getPosition();
        var b = cc.instantiate(this.bullet_prefab[this.level - 1]);
        var b_com = b.getComponent("bullet");
        b_com.init_content(body);

        this.bullet_root.addChild(b);
        b.setPosition(src);
        b_com.shoot_to(this.target);
    },

    prepare_to_shoot: function(body){
        // console.log("prepare_to_shoot ...", body);
        if(this.target == null || this.target.parent == null){
            return;
        }

        var dst = this.target.getPosition();
        var src = this.node.getPosition();
        var dir = dst.sub(src);
        var r = Math.atan2(dir.y, dir.x);
        var degree = r * 180 / Math.PI;
        this.node.rotation = 180 - (degree + 90);
        this.shoot_target(body);
    },

    update (dt) {
        

    },
});
