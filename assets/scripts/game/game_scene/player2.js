
cc.Class({
    extends: cc.Component,

    properties: {
        nick_name: {
            default: null,
            type: cc.Label
        },

        uvip: {
            default: null,
            type: cc.Label
        }
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    init_info: function(ret){
        this.nick_name.string = "" + ret[1];
        this.uvip.string = "" + ret[6];
    },

    // update (dt) {},
});
