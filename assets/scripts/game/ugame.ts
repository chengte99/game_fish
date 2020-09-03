// var utils = require("utils");
import {utils} from "../utils/utils";

export var ugame = {
    unick: "",
    usex: -1,
    uface: 0,
    uvip: 0,

    is_guest: false,
    guest_key: null,

    zid: -1,
    room_id: -1,
    seat_id: -1,

    user_game_info: null,

    guest_login_success: function (unick, usex, uface, uvip, guest_key) {
        this.unick = unick;
        this.usex = usex;
        this.uface = uface;
        this.uvip = uvip;

        this.is_guest = true;

        if(this.guest_key != guest_key){
            this.guest_key = guest_key;
            cc.sys.localStorage.setItem("guest_key", guest_key);
        }
    },

    get_game_info_success: function(uexp, uchip, udata, uvip){
        this.user_game_info = {
            uexp: uexp,
            uchip: uchip,
            udata: udata,
            uvip: uvip,
        };
    },

    save_zid: function(zid){
        this.zid = zid;
    }
}

ugame.guest_key = cc.sys.localStorage.getItem("guest_key");
if(!ugame.guest_key){
    ugame.guest_key = utils.random_string(32);
    cc.sys.localStorage.setItem("guest_key", ugame.guest_key);
}

// module.exports = ugame;
