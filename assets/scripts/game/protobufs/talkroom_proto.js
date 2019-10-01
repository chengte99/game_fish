var proto_man = require("proto_man");
var proto_tools = require("proto_tools");
/*
Enter
客戶端發送
1, 1, body = {
    uname: "xxx",
    usex: 1 or 0
}
服務端返回:
1, 1, response

Exit
客戶端發送
1, 2, null
服務端返回:
1, 2, response

UserArrived
服務端發送:
1, 3, body = {
    uname: "xxx",
    usex: 1 or 0
}

UserExit
服務端發送:
1, 4, body = {
    uname: "xxx",
    usex: 1 or 0
}

SendMsg
客戶端發送
1, 5, body = msg
服務端返回:
1, 5, body = {
    0: response,
    1: uname,
    2: usex,
    3: msg
}

UserMsg
服務端發送:
1, 6, body = {
    0: uname,
    1: usex,
    2: msg
}
*/

function encode_enter_talkroom(stype, ctype, body){
    var uname_len = body.uname.utf8_byte_len();
    var total_len = proto_tools.header_size + 2 + uname_len + 2;
    var dataview = proto_tools.allocBuffer(total_len);
    var offset = proto_tools.write_head_inbuf(dataview, stype, ctype);
    offset = proto_tools.write_str_inbuf(dataview, offset, body.uname, uname_len);
    proto_tools.write_int16(dataview, offset, body.usex);
    offset += 2;

    return dataview;
}

function decode_user_enter_talkroom(dataview){
    var cmd = {};
    cmd[0] = proto_tools.read_int16(dataview, 0);
    cmd[1] = proto_tools.read_int16(dataview, 2);
    var body = {};
    cmd[2] = body;

    var ret = proto_tools.read_str_inbuf(dataview, proto_tools.header_size);
    body.uname = ret[0];
    var offset = ret[1];
    body.usex = proto_tools.read_int16(dataview, offset);
    offset += 2;

    return cmd;
}

function decode_user_exit_talkroom(dataview){
    var cmd = {};
    cmd[0] = proto_tools.read_int16(dataview, 0);
    cmd[1] = proto_tools.read_int16(dataview, 2);
    var body = {};
    cmd[2] = body;

    var ret = proto_tools.read_str_inbuf(dataview, proto_tools.header_size);
    body.uname = ret[0];
    var offset = ret[1];
    body.usex = proto_tools.read_int16(dataview, offset);
    offset += 2;

    return cmd;
}

function decode_send_msg(dataview){
    var cmd = {};
    cmd[0] = proto_tools.read_int16(dataview, 0);
    cmd[1] = proto_tools.read_int16(dataview, 2);
    var body = {};
    cmd[2] = body;

    var offset = proto_tools.header_size;
    body[0] = proto_tools.read_int16(dataview, offset);
    offset += 2;
    var ret = proto_tools.read_str_inbuf(dataview, offset);
    body[1] = ret[0];
    offset = ret[1];
    body[2] = proto_tools.read_int16(dataview, offset);
    offset += 2;
    ret = proto_tools.read_str_inbuf(dataview, offset);
    body[3] = ret[0];
    offset = ret[1];

    return cmd;
}

function decode_user_msg(dataview){
    var cmd = {};
    cmd[0] = proto_tools.read_int16(dataview, 0);
    cmd[1] = proto_tools.read_int16(dataview, 2);
    var body = {};
    cmd[2] = body;

    var offset = proto_tools.header_size;
    var ret = proto_tools.read_str_inbuf(dataview, offset);
    body[0] = ret[0];
    offset = ret[1];
    body[1] = proto_tools.read_int16(dataview, offset);
    offset += 2;
    ret = proto_tools.read_str_inbuf(dataview, offset);
    body[2] = ret[0];
    offset = ret[1];

    return cmd;
}

proto_man.reg_buf_encoder(1, 1, encode_enter_talkroom);
proto_man.reg_buf_decoder(1, 1, proto_tools.decode_status_cmd);

proto_man.reg_buf_encoder(1, 2, proto_tools.encode_empty_cmd);
proto_man.reg_buf_decoder(1, 2, proto_tools.decode_status_cmd);

proto_man.reg_buf_decoder(1, 3, decode_user_enter_talkroom);
proto_man.reg_buf_decoder(1, 4, decode_user_exit_talkroom);

proto_man.reg_buf_encoder(1, 5, proto_tools.encode_str_cmd);
proto_man.reg_buf_decoder(1, 5, decode_send_msg);

proto_man.reg_buf_decoder(1, 6, decode_user_msg);