var Cmd = {
    USER_DISCONNECT: 10000,

    Auth: {
        GUEST_LOGIN: 1,
        RELOGIN: 2,
    },

    GameSystem: {
        GET_GAME_INFO: 1,
    },

    FishGame: {
        ENTER_ZONE: 1,
        USER_QUIT: 2,
        ENTER_ROOM: 3,
        EXIT_ROOM: 4,
        USER_SITDOWN: 5,
        USER_STANDUP: 6,
        USER_ARRIVED: 7,
    }
}

module.exports = Cmd;