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
    cmd[0] = stype;
    cmd[1] = ctype;
    cmd[2] = body;

    var json_str = JSON.stringify(cmd);
    return json_str
}

function _json_decode(str_or_buf){
    var cmd = null;

    try{
        cmd = JSON.parse(str_or_buf);
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
    if(proto_type == proto_man.PROTO_JSON){
        str_or_buf = _json_encode(stype, ctype, body);
    }else{
        var key = get_key(stype, ctype);
        if(!encoders[key]){
            log.error("encoders encode_func is empty, stype: " + stype + ", ctype: " + ctype);
            return null;
        }

        str_or_buf = encoders[key](body);
    }

    str_or_buf = encrypt_cmd(str_or_buf);
    return str_or_buf;
}

//
function decode_cmd(proto_type, cmd_buf){
    cmd_buf = decrypt_cmd(cmd_buf);

    if(cmd_buf.length < 4){
        return null;
    }

    var cmd = null;
    if(proto_type == proto_man.PROTO_JSON){
        cmd = _json_decode(cmd_buf);
    }else{
        var stype = cmd_buf.readUInt16LE(0);
        var ctype = cmd_buf.readUInt16LE(2);
        var key = get_key(stype, ctype);
        if(!decoders[key]){
            log.error("decoders decode_func is empty, stype: " + stype + ", ctype: " + ctype);
            return null;
        }

        cmd = decoders[key](cmd_buf);
    }

    if(cmd){
        return cmd;
    }

    return null;
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