cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        is_enbale: true,
        is_debug: true,
    },

    // use this for initialization
    onLoad: function () {
        if (this.is_enbale) {
            var manager = cc.director.getCollisionManager();
            manager.enabled = true; // 开启碰撞
            if (this.is_debug) {
                manager.enabledDebugDraw = true; // 调试状态绘制出我们物体的碰撞器的形状
            }
        }
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
