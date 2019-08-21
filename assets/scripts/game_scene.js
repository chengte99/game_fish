
cc.Class({
    extends: cc.Component,

    properties: {
        cannon: {
            default: null,
            type: cc.Node
        },

        fish_root: {
            default: null,
            type: cc.Node
        },

        fish_prefabs: {
            default: [],
            type: cc.Prefab
        },

        gold: 50000,
        gold_label: {
            default: null,
            type: cc.Label
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

    upgrade_cannon: function(){
        this.cannon_com._upgrade();
    },

    downgrade_cannon: function(){
        this.cannon_com._downgrade();
    },

    create_fish: function(){
        var index = Math.floor(Math.random() * this.fish_prefabs.length);
        if(index >= this.fish_prefabs.length){
            index = this.fish_prefabs.length - 1;
        }

        var fish = cc.instantiate(this.fish_prefabs[index]);
        this.fish_root.addChild(fish);

        this.scheduleOnce(function(){
            this.create_fish();
        }, Math.random() * 2 + 2);
    },

    start () {
        this.gold_label.string = "" + this.gold;

        this.scheduleOnce(function(){
            this.create_fish();
        }, Math.random() * 2 + 2);
    },

    update (dt) {
        this.gold_label.string = "" + this.gold;
    },
});
