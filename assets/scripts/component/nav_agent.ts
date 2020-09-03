
const {ccclass, property} = cc._decorator;

@ccclass
export default class nav_agent extends cc.Component {

    @property({tooltip: ""})
    map_path: string = "Canvas/fish_map";

    @property()
    speed: number = 100;

    // onLoad () {}

    prepare_run_road(body){
        // console.log("prepare_run_road ...");

        var fish_map = cc.find(this.map_path);
        this.map = fish_map.getComponent("fish_map");

        this.speed = body[2];
        this.run_road(body[3]);
    }

    run_road(index) {
        var road_set = this.map.get_road_set();
        // var index = Math.random() * road_set.length;
        // index = Math.floor(index);
        // if(index >= road_set.length){
        //     index = road_set.length - 1;
        // }
        this.road_data = road_set[index]; // 假设从第0条;

        if (this.road_data.length < 2) {
            return;
        }
        this.is_walking = false;
        this.node.setPosition(this.road_data[0]);
        //設定完初始位置後在縮放正常
        this.node.scaleX = 1;
        this.node.scaleY = 1;
        //end
        this.next_step = 1; // 下一个要走的路径点;
        if (this.road_data[0].x < this.road_data[this.road_data.length - 1].x) {
            this.node.scaleX = 1;
        }
        else {
            this.node.scaleX = -1;
        }
        this.walk_to_next();
    }

    get_next_point() {
        if (this.next_step + 3 >= this.road_data.length) {
            return this.road_data[this.road_data.length - 1];
        }

        return this.road_data[this.next_step + 3];
    }

    walk_to_next() {
        if (this.next_step >= this.road_data.length) {
            this.is_walking = false;
            //修改為超過屏幕就移除
            this.over_winsize();
            //end

            // this.run_road();
            return;
        }

        this.is_walking = true;
        var src = this.node.getPosition();
        var dst = this.road_data[this.next_step];
        var dir = dst.sub(src);
        var len = dir.mag();

        this.total_time = len / this.speed;
        this.now_time = 0;
        this.vx = this.speed * dir.x / len;
        this.vy = this.speed * dir.y / len;

        // 旋转鱼头
        var r = Math.atan2(dir.y, dir.x); // 弧度
        var degree = r * 180 / Math.PI;
        // degree = degree - 90; // 逆时针--> 顺时针
        // this.node.angle = degree;

        this.node.rotation = 180 - (degree + 90);
        // this.node.runAction(cc.rotateTo(0.5, degree));
        // end
    }

    over_winsize(){
        var fish = this.node.getComponent("fish");
        fish.send_dead_msg(-1); // 系統死亡
        // fish.remove_cannon_target();
        // this.node.removeFromParent();
    }

    position_after_time(dt){
        var prev_pos = this.node.getPosition();
        var next_step = this.next_step;
        while(dt > 0 && next_step < this.road_data.length){
            var now_pos = this.road_data[next_step];
            // var dir = cc.pSub(now_pos, prev_pos);
            // var len = cc.pLength(dir);

            var dir = now_pos.sub(prev_pos);
            var len = dir.mag();
            var t = len / this.speed;

            if(dt > t){
                dt -= t;
                prev_pos = now_pos;
                next_step ++;
            }else{
                var vx = this.speed * dir.x / len;
                var vy = this.speed * dir.y / len;

                var sx = vx * dt;
                var sy = vy * dt;

                prev_pos.x += sx;
                prev_pos.y += sy;
                return prev_pos;
            }
        }

        return this.road_data[next_step - 1];
    }

    start () {

    }

    // update (dt) {}
}
