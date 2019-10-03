//cmd_buf -> dataview
function read_int8(cmd_buf, offset){
    // return cmd_buf.readInt8(offset);
    return cmd_buf.getInt8(offset);
}

function write_int8(cmd_buf, offset, value){
    // cmd_buf.writeInt8(value, offset);
    cmd_buf.setInt8(offset, value);
}

function read_int16(cmd_buf, offset){
    // return cmd_buf.readInt16LE(offset);
    return cmd_buf.getInt16(offset, true);
}

function write_int16(cmd_buf, offset, value){
    // cmd_buf.writeInt16LE(value, offset);
    cmd_buf.setInt16(offset, value, true);
}

function read_int32(cmd_buf, offset){
    // return cmd_buf.readInt32LE(offset);
    return cmd_buf.getInt32(offset, true);
}

function write_int32(cmd_buf, offset, value){
    // cmd_buf.writeInt32LE(value, offset);
    cmd_buf.setInt32(offset, value, true);
}

function read_uint32(cmd_buf, offset){
    // return cmd_buf.readUInt32LE(offset);
    return cmd_buf.getUint32(offset, true);
}

function write_uint32(cmd_buf, offset, value){
    // cmd_buf.writeUInt32LE(value, offset);
    cmd_buf.setUint32(offset, value, true);
}

function read_str(cmd_buf, offset, byte_len){
    // return cmd_buf.toString("utf8", offset, offset + byte_len);
    return cmd_buf.read_utf8(offset, byte_len);
}

function write_str(cmd_buf, offset, str){
    // cmd_buf.write(str, offset);
    cmd_buf.write_utf8(offset, str);
}

function read_float(cmd_buf, offset){
    // return cmd_buf.readFloatLE(offset);
    return cmd_buf.getFloat32(offset, true);
}

function write_float(cmd_buf, offset, value){
    // cmd_buf.writeFloatLE(value, offset);
    cmd_buf.setFloat32(offset, value, true);
}

function allocBuffer(total_len){
    // return Buffer.allocUnsafe(total_len);
    var buf = new ArrayBuffer(total_len);
    var dataview = new DataView(buf);
    return dataview;
}

function write_head_inbuf(cmd_buf, stype, ctype){
    write_int16(cmd_buf, 0, stype);
    write_int16(cmd_buf, 2, ctype);
    write_uint32(cmd_buf, 4, 0);
    return proto_tools.header_size;
}

function write_proto_type_inbuf(cmd_buf, proto_type){
    write_int16(cmd_buf, 8, proto_type);
}

function write_utag_inbuf(cmd_buf, utag){
    write_uint32(cmd_buf, 4, utag);
}

function clear_utag_inbuf(cmd_buf){
    write_uint32(cmd_buf, 4, 0);
}

function write_str_inbuf(cmd_buf, offset, str, byte_len){
    write_int16(cmd_buf, offset, byte_len);
    offset += 2;
    write_str(cmd_buf, offset, str);
    offset += byte_len;
    return offset;
}

function read_str_inbuf(cmd_buf, offset){
    var byte_len = read_int16(cmd_buf, offset);
    offset += 2;
    var str = read_str(cmd_buf, offset, byte_len);
    offset += byte_len;

    return [str, offset];
}

function encode_empty_cmd(stype, ctype, body){
    var total_len = proto_tools.header_size;
    var cmd_buf = allocBuffer(total_len);
    write_head_inbuf(cmd_buf, stype, ctype);
    return cmd_buf;
}

function decode_empty_cmd(cmd_buf){
    var cmd = {};
    cmd[0] = read_int16(cmd_buf, 0);
    cmd[1] = read_int16(cmd_buf, 2);
    cmd[2] = null;
    return cmd;
}

function encode_status_cmd(stype, ctype, body){
    var total_len = proto_tools.header_size + 2;
    var cmd_buf = allocBuffer(total_len);
    var offset = write_head_inbuf(cmd_buf, stype, ctype);
    write_int16(cmd_buf, offset, body);
    return cmd_buf;
}

function decode_status_cmd(cmd_buf){
    var cmd = {};
    cmd[0] = read_int16(cmd_buf, 0);
    cmd[1] = read_int16(cmd_buf, 2);
    cmd[2] = read_int16(cmd_buf, proto_tools.header_size);
    return cmd;
}

function encode_str_cmd(stype, ctype, body){
    var byte_len = body.utf8_byte_len();
    var total_len = proto_tools.header_size + 2 + byte_len;
    var cmd_buf = allocBuffer(total_len);
    var offset = write_head_inbuf(cmd_buf, stype, ctype);
    write_str_inbuf(cmd_buf, offset, body, byte_len);
    return cmd_buf;
}

function decode_str_cmd(cmd_buf){
    var cmd = {};
    cmd[0] = read_int16(cmd_buf, 0);
    cmd[1] = read_int16(cmd_buf, 2);
    var ret = read_str_inbuf(cmd_buf, proto_tools.header_size);
    cmd[2] = ret[0];
    return cmd;
}

var proto_tools = {
    header_size: 10, // 2 + 2 + 4 + 2
    //源操作
    read_int8: read_int8,
    read_int16: read_int16,
    read_int32: read_int32,
    read_float: read_float,

    write_int8: write_int8,
    write_int16: write_int16,
    write_int32: write_int32,
    write_float: write_float,

    read_uint32: read_uint32,
    write_uint32: write_uint32,

    read_str: read_str,
    write_str: write_str,

    allocBuffer: allocBuffer,

    //通用
    write_head_inbuf: write_head_inbuf,

    write_proto_type_inbuf: write_proto_type_inbuf,
    write_utag_inbuf: write_utag_inbuf,
    clear_utag_inbuf: clear_utag_inbuf,
    
    write_str_inbuf: write_str_inbuf,
    read_str_inbuf: read_str_inbuf,

    //編碼解碼
    encode_empty_cmd: encode_empty_cmd,
    decode_empty_cmd: decode_empty_cmd,

    encode_status_cmd: encode_status_cmd,
    decode_status_cmd: decode_status_cmd,

    encode_str_cmd: encode_str_cmd,
    decode_str_cmd: decode_str_cmd,
};

module.exports = proto_tools;