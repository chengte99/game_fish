
const {ccclass, property} = cc._decorator;

@ccclass
export default class enable_collider extends cc.Component {

    @property({tooltip: ""})
    is_enbale: boolean = true;

    @property({tooltip: ""})
    is_debug: boolean = true;

    onLoad () {
        if (this.is_enbale) {
            var manager = cc.director.getCollisionManager();
            manager.enabled = true; // 开启碰撞
            if (this.is_debug) {
                manager.enabledDebugDraw = true; // 调试状态绘制出我们物体的碰撞器的形状
            }
        }
    }

    start () {

    }

    // update (dt) {}
}
