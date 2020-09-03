import { sound_manager } from "../module/sound_manager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class audio_switch extends cc.Component {

    @property({tooltip: "類型。0音樂、1音效"})
    type: number = 0;

    @property({type: [cc.SpriteFrame], tooltip: "圖片資源"})
    sp_frames: cc.SpriteFrame[] = [];

    sp: cc.Sprite = null;

    onLoad () {
        this.sp = this.node.getComponent(cc.Sprite);
    }

    start () {
        if (this.type === 0) { // 表示是music的开关；
            this.sp.spriteFrame = (sound_manager.b_music_mute) ? this.sp_frames[1] : this.sp_frames[0];
        }
        else if(this.type === 1) {
            this.sp.spriteFrame = (sound_manager.b_effect_mute) ? this.sp_frames[1] : this.sp_frames[0];
        }
    }

    on_switch_click() {
        var b_mute = 0;
        if (this.type === 0) { // music 的switch;
            b_mute = (sound_manager.b_music_mute) ? 0 : 1;
            sound_manager.set_music_mute(b_mute);
        }
        else if(this.type === 1) {
            b_mute = (sound_manager.b_effect_mute) ? 0 : 1;
            sound_manager.set_effect_mute(b_mute);
        }

        this.sp.spriteFrame = (b_mute) ? this.sp_frames[1] : this.sp_frames[0];
    }

    // update (dt) {}
}
