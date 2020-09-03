import game_scene from "../game_scene";

const {ccclass, property} = cc._decorator;

@ccclass
export default class bullet extends cc.Component {

    @property({type: [cc.SpriteFrame], tooltip: "子彈動畫"})
    anim_sp: cc.SpriteFrame[] = [];

    @property({tooltip: "子彈動畫間隔"})
    anim_duration: number = 0.1;

    @property({type: [cc.SpriteFrame], tooltip: "爆炸動畫"})
    boom_anim_sp: cc.SpriteFrame[] = [];

    @property({tooltip: "爆炸動畫間隔"})
    boom_anim_duration: number = 0.1;

    @property({tooltip: "角度"})
    degree: number = 45;
    // speed: 400,
    // damage: 2,
    // cost: 10,

    game_scene: game_scene = null;
    is_shoot: boolean = false;

    onLoad () {
        this.game_scene = cc.find("Canvas").getComponent("game_scene");
        this.is_shoot = false;
    }

    init_content(body){
        this.sv_seat = body.sv_seat;
        this.level = body.level;
        this.cost = body.cost;
        this.damage = body.damage;
        this.speed = body.speed;
    }

    shoot_to(target){
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
        // this.degree = degree;
        this.node.rotation = 180 - (degree + 90);

        this.is_shoot = true;
        // this.game_scene.gold -= this.cost;
    }

    get_bullet_info(){
        return {
            sv_seat: this.sv_seat,
            level: this.level,
            cost: this.cost,
            damage: this.damage,
            speed: this.speed
        }
    }

    hit_finished(pos){
        // this.node.removeFromParent();

        // this.node.active = true;
        
        this.node.x = pos.x;
        this.node.y = pos.y;        

        this.node.scaleX = 0.3;
        this.node.scaleY = 0.3;
        this.frame_anim.sprite_frames = this.boom_anim_sp;
        this.frame_anim.duration = this.boom_anim_duration;
        this.frame_anim.play_once(function(){
            this.node.active = false;
            this.node.removeFromParent();
        });
    }

    onCollisionEnter(other, self){
        // console.log("bullet hit fish ...", other, self);

        this.node.getComponent(cc.PolygonCollider).active = false;

        this.is_shoot = false;
        // this.node.active = false;
        this.frame_anim.stop_anim();
    }

    start () {
        this.frame_anim = this.node.addComponent("frame_anim");
        this.frame_anim.sprite_frames = this.anim_sp;
        this.frame_anim.duration = this.anim_duration;
        this.frame_anim.play_loop();

        // this.shoot_to(45);
    }

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
    }
}
