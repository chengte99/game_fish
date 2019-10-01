var proto_tools = require("proto_tools");
/*
1. 服務號、命令號、數據
2. 服務號、命令號，都以兩個字節存放
*/
var log = {
    info: console.log,
    warn: console.log,
    error: console.log,
}

var proto_man = {
    PROTO_JSON: 1,
    PROTO_BUF: 2,
    
    encrypt_cmd: encrypt_cmd,
    decrypt_cmd: decrypt_cmd,
    encode_cmd: encode_cmd,
    decode_cmd: decode_cmd,

    reg_buf_encoder: reg_buf_encoder,
    reg_buf_decoder: reg_buf_decoder,
}

function encrypt_cmd(str_or_buf){
    return str_or_buf;
}

function decrypt_cmd(str_or_buf){
    return str_or_buf;
}

function _json_encode(stype, ctype, body){
    var cmd = {};
    cmd[0] = body;

    var json_str = JSON.stringify(cmd);

    var cmd_buf = proto_tools.encode_str_cmd(stype, ctype, json_str);
    return cmd_buf
}

function _json_decode(cmd_buf){
    var cmd = proto_tools.decode_str_cmd(cmd_buf);
    var json_str = cmd[2];

    try{
        var body = JSON.parse(json_str);
        cmd[2] = body[0];
    }catch(e){
        return null;
    }

    if(!cmd || 
        typeof(cmd[0])=="undefined" || 
        typeof(cmd[1])=="undefined" || 
        typeof(cmd[2])=="undefined"){
        return null;
    }

    return cmd;
}

//
function encode_cmd(proto_type, stype, ctype, body){
    var str_or_buf = null;
    var dataview;

    if(proto_type == proto_man.PROTO_JSON){
        dataview = _json_encode(stype, ctype, body);
    }else{
        var key = get_key(stype, ctype);
        if(!encoders[key]){
            log.error("encoders encode_func is empty, stype: " + stype + ", ctype: " + ctype);
            return null;
        }

        // str_or_buf = encoders[key](body);
        dataview = encoders[key](stype, ctype, body);
    }

    str_or_buf = dataview.buffer;
    if(str_or_buf){
        str_or_buf = encrypt_cmd(str_or_buf);
    }
    
    return str_or_buf;
}

//
function decode_cmd(proto_type, cmd_buf){
    cmd_buf = decrypt_cmd(cmd_buf);
    var dataview = new DataView(cmd_buf);
    if(dataview.byteLength < proto_tools.header_size){
        return null;
    }
    var cmd = null;

    if(proto_type == proto_man.PROTO_JSON){
        cmd = _json_decode(dataview);
    }else{
        var stype = proto_tools.read_int16(dataview, 0);
        var ctype = proto_tools.read_int16(dataview, 2);
        var key = get_key(stype, ctype);
        if(!decoders[key]){
            log.error("decoders decode_func is empty, stype: " + stype + ", ctype: " + ctype);
            return null;
        }

        // cmd = decoders[key](cmd_buf);
        cmd = decoders[key](dataview);
    }

    return cmd;
}

var encoders = {};
var decoders = {};

function get_key(stype, ctype){
    return stype * 65536 + ctype;
}

// encode_func = (body)
function reg_buf_encoder(stype, ctype, encode_func){
    var key = get_key(stype, ctype);
    if(encoders[key]){
        log.warn("encoders stype: " + stype + ", ctype: " + ctype + " is reged !");
        return null;
    }

    encoders[key] = encode_func;
}

// decode_func = (buf)
function reg_buf_decoder(stype, ctype, decode_func){
    var key = get_key(stype, ctype);
    if(decoders[key]){
        log.warn("decoders stype: " + stype + ", ctype: " + ctype + " is reged !");
        return null;
    }

    decoders[key] = decode_func;
}


module.exports = proto_man;