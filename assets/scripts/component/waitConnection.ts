
const {ccclass, property} = cc._decorator;

@ccclass
export default class waitConnection extends cc.Component {

    @property({type: cc.Node, tooltip: "讀取圖示"})
    loading_img: cc.Node = null;
    
    onLoad () {
        
    }

    start () {
        
    }

    update (dt) {
        this.loading_img.angle = this.loading_img.angle + dt * 45;
    }
}
