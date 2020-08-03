/**
 *  协议文件
 */

import { protoConst, } from '../../const'

import eventHub from '../../utils/eventHub'





export function protoChannelSwitch({ getters, channelId }) {
    let proto = {
        proto: protoConst.CHANNEL_SWITCH,
        data: {
            type: 1, //群组类型1普通群组 2.终端群组 
            channelId
        },
        id: getters.mine.id
    }
    eventHub.send(proto)
}

// 发送群组语音
export function protoSendGroupVoice({ getters, channelId, type }) {

    let proto = {
        proto: protoConst.CHANNEL_VOICE,
        data: {
            //1、开始语音发送 2、结束语音发送
            type: type ? 1 : 2,
            channelId
        },
        id: getters.mine.id
    }
    eventHub.send(proto)
}


export function protoSingleCall({ getters, type = 0, model }) {
    let proto = {
        proto: protoConst.SINGLE_CALL,
        data: {
            //申请状态 1 开始 2结束
            type,
            fromId: model.terminalId,
            username: model.name,
        },
        id: getters.mine.id
    }
    eventHub.send(proto)
}

export function protoSinglecallVoice({ getters, state }) {
    let proto = {
        proto: protoConst.SINGLE_CALL_VOICE,
        data: {
            //申请状态
            type: state.mike ? 1 : 2,
            fromId: state.fromId,
        },
        id: getters.mine.id
    }
    eventHub.send(proto)
}


// 接入协议
export function protoCheckin({getters,state}, account, pwd){
     let proto = {
        proto: protoConst.CHECKIN,
        data: {
            acct: account,
            pwd: pwd,
        },
        id: getters.mine.id
    }
    eventHub.send(proto)
}

// 登出协议
export function protoLogOut({getters,state}){
    let proto = {
        proto: protoConst.REQUEST_MESSAGE,
        data: {
            a:1
        },
        childPtc:0x06,
        id: getters.mine.id
    }
    eventHub.send(proto)
}


export function protoChannelMessage({getters,state},data){
    

}