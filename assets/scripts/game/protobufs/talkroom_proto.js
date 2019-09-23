
var proto_man = require("proto_man");

function buf_encode1_1(body){
    var total_len = 2 + 2 + 2 + body.uname.utf8_byte_len() + 2 + body.upwd.utf8_byte_len();
    var buf = new ArrayBuffer(total_len);
    var dataview = new DataView(buf);
    var stype = 1;
    var ctype = 1;

    dataview.setUint16(0, stype, true);
    dataview.setUint16(2, ctype, true);
    dataview.setUint16(4, body.uname.utf8_byte_len(), true);
    dataview.write_utf8(6, body.uname);

    // buf.writeUInt16LE(stype, 0);
    // buf.writeUInt16LE(ctype, 2);
    // buf.writeUInt16LE(body.uname.length, 4);
    // buf.write(body.uname, 6, body.uname.length, "utf8");

    var offset = 6 + body.uname.utf8_byte_len();

    dataview.setUint16(offset, body.upwd.utf8_byte_len(), true);
    dataview.write_utf8(offset + 2, body.upwd);

    // buf.writeUInt16LE(body.upwd.length, offset);
    // buf.write(body.upwd, offset + 2, body.upwd.length, "utf8");

    return dataview.buffer;
}

function buf_decode1_1(cmd_buf){
    var cmd = {};
    cmd[0] = cmd_buf.readUInt16LE(0);
    cmd[1] = cmd_buf.readUInt16LE(2);
    var body = {};
    cmd[2] = body;

    var uname_len = cmd_buf.readUInt16LE(4);
    if((2 + 2 + 2 + uname_len) > cmd_buf.length){
        log.error("buf decode failed !");
        return null;
    }

    var uname = cmd_buf.toString("utf8", 6, 6 + uname_len);

    var offset = 6 + uname_len;
    var upwd_len = cmd_buf.readUInt16LE(offset);
    if((2 + 2 + 2 + uname_len + 2 + upwd_len) > cmd_buf.length){
        log.error("buf decode failed !");
        return null;
    }

    var upwd = cmd_buf.toString("utf8", offset + 2, offset + 2 + upwd_len);
    body.uname = uname;
    body.upwd = upwd;

    return cmd;
}

proto_man.reg_buf_encoder(1, 1, buf_encode1_1);
// proto_man.reg_buf_decoder(1, 1, buf_decode1_1);