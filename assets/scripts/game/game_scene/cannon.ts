// import game_scene from '../game_scene';
import frame_anim from "../../component/frame_anim";

const {ccclass, property} = cc._decorator;

@ccclass("shoot_anim")
class shoot_anim {
    @property({
        type: [cc.SpriteFrame], 
        tooltip: "砲塔射擊動畫",
    })
    shoot_anim_frame: cc.SpriteFrame[] = [];
}

@ccclass
export class cannon extends cc.Component {

    @property({type: [shoot_anim], tooltip: "砲塔射擊圖示"})
    anim_sp: shoot_anim[] = [];

    @property({tooltip: "砲塔射擊間隔"})
    anim_duration: number = 0.1;

    @property({type: cc.Node, tooltip: "目標魚節點"})
    target: cc.Node = null;

    @property({tooltip: "砲塔等級"})
    level: number = 1
    
    @property({type: [cc.SpriteFrame], tooltip: "砲塔圖示"})
    idle_sp: cc.SpriteFrame[] = [];

    @property({type: [cc.Prefab], tooltip: "子彈Prefab"})
    bullet_prefab: cc.Prefab[] = [];
    
    @property({type: cc.Node, tooltip: "子彈原始節點"})
    bullet_root: cc.Node = null;
    
    @property({tooltip: "子彈發射間隔"})
    shoot_duration: number = 0.5;


    // game_scene: game_scene = null
    frame_anim: frame_anim = null;
    now_time: number = 0;

    onLoad () {
        // this.game_scene = cc.find("Canvas").getComponent("game_scene");
    }

    start () {
        this.frame_anim = this.node.addComponent("frame_anim");

        this.now_time = 0;
    }

    upgrade(){
        if(this.level == 2){
            return;
        }

        this.level += 1;
        this.node.getComponent(cc.Sprite).spriteFrame = this.idle_sp[this.level - 1];
        this.node.scaleX = 0.8;
        this.node.scaleY = 0.8;
    }

    downgrade(){
        if(this.level == 1){
            return;
        }

        this.level -= 1;
        this.node.getComponent(cc.Sprite).spriteFrame = this.idle_sp[this.level - 1];
        this.node.scaleX = 1;
        this.node.scaleY = 1;
    }

    shoot_target(body){
        this.frame_anim.sprite_frames = this.anim_sp[this.level - 1].shoot_anim_frame;
        this.frame_anim.duration = this.anim_duration;
        this.frame_anim.play_once(null);

        var src = this.node.getPosition();
        var b = cc.instantiate(this.bullet_prefab[this.level - 1]);
        var b_com = b.getComponent("bullet");
        b_com.init_content(body);

        this.bullet_root.addChild(b);
        b.setPosition(src);
        b_com.shoot_to(this.target);
    }

    prepare_to_shoot(body){
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
    }

    // update (dt) {}
}
