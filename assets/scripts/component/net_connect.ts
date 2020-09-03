
import {websocket} from "../module/websocket";
import {http} from "../module/http";
import {proto_man} from "../module/proto_man";

interface ServerObj {
    host: string;
    tcp_port: number;
    ws_port: number;
}

const {ccclass, property} = cc._decorator;

@ccclass
export default class net_connect extends cc.Component {

    @property({tooltip: ""})
    is_proto_json: boolean = false;

    @property({tooltip: "是否為正式版本"})
    is_release: boolean = true;

    @property({tooltip: ""})
    release_url: string = "http://www.yuhaolu.cn:10001";

    host_ip: string = null;
    server_info: ServerObj = null;

    onLoad () {
        this.server_info = null;
        if(this.is_release){
            this.host_ip = this.release_url;
        }else{
            this.host_ip = "http://127.0.0.1:10001";
        }
    }

    get_server_info(){
        http.get(this.host_ip, "/server_info", null, function(err, ret){
            if(err){
                console.log("connect_server get fail");
                console.log(err);

                this.scheduleOnce(this.get_server_info.bind(this), 3);
                return;
            }

            var json = JSON.parse(ret);
            console.log(json);
            this.server_info = json;

            this.connect_server();

        }.bind(this));
    }

    connect_server(){
        if(this.is_proto_json){
            websocket.connect("ws://" + this.server_info.host + ":" + this.server_info.ws_port + "/ws", proto_man.PROTO_JSON);
            // websocket.connect("ws://127.0.0.1:6081/ws", proto_man.PROTO_JSON);
        }else{
            websocket.connect("ws://" + this.server_info.host + ":" + this.server_info.ws_port + "/ws", proto_man.PROTO_BUF);
            // websocket.connect("ws://127.0.0.1:6081/ws", proto_man.PROTO_BUF);
        }
    }

    start () {
        this.get_server_info();
    }

    // update (dt) {}
}
