
cc.Class({
    extends: cc.Component,

    properties: {
        cannon: {
            default: null,
            type: cc.Node
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.cannon_com = this.cannon.getComponent("cannon");

    },

    cancel_auto_foucs: function(){
        this.cannon_com.target = null;
        this.cannon_com.node.rotation = 0;
    },

    start () {

    },

    // update (dt) {},
});
