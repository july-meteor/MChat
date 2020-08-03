/**
 * 历史记录
 * 包含聊天记录控制事件
 * 及历史聊天记录
 */

import { controlConst } from '../../const'
import { setCache, getCache, removeCache } from '../cache'
import { findUserNameById} from './tool'


import eventHub from '../../utils/eventHub'



/**
 *  页面销毁前的数据都会
 */
const default_history_channel = [
    {
        id: undefined,
        list: [],
    }
]
// 聊天记录
const default_chat_record = {

}

const KEY_HISTOTY = 'channels_history'


const history = {
    state: {
        channels: getCache(KEY_HISTOTY) || []

    },
    mutations: {
        ADD_CHANNEL_RECORD(state, logs) {
            for (let log of logs) {
                state.channels.push(log)
            }
            setCache(KEY_HISTOTY, state.channels)
        }

    },
    actions: {
        //监听 文字语音路径消息
        onChannleMessag({ commit,  getters, state }, backCall) {
            eventHub.on(controlConst.MEDIA_MSG, (data) => {
                let userList = getters.chat.userInfoList
                data = messageConvert(data, userList);
                //记录历史
                commit("ADD_CHANNEL_RECORD", data)
                backCall(data);
            })
        },
        emitChannleMessage({ commit, getters, state }, data) {
            let userList = getters.chat.userInfoList
            data = messageConvert(data, userList);
            //协议欠缺

        }
    }
}



function messageConvert(data, userList) {
    let messages = [];
    if (data instanceof Array) {
        messages = data.map(item => {
            let { fromid, index, username, avatar, channel, type,
                mine, content, timestamp
            } = item
            if (!username) {
                username = findUserNameById(userList, fromid);
                return {
                    index: index,
                    username: username,
                    avatar: "http://www.qsfj.com/data/upload/201805/f_b68ccc238a400550805c6b7ed1df9d6c.jpg", //头像
                    id: channel, // chat的id // 如果当前chat是私聊则为私聊目标的id
                    fromid,  //发起人id
                    type: 1,  // 消息类型
                    mine: mine,  //是不是自己发的
                    content: msgTypeConvert(type, content), // 内容
                    timestamp: timestamp //发起的时间戳
                }
            }
        })
    } else {
        let { fromid, index, username, avatar, channel, type,
            mine, content, timestamp
        } = data
        if (!username) {
            username = findUserNameById(userList, fromid);
        }
        let temp = {
            index: index,
            username: username,
            avatar: avatar, //头像
            id: channel, // chat的id // 如果当前chat是私聊则为私聊目标的id
            fromid,  //发起人id
            type: type,  // 消息类型
            mine: mine,  //是不是自己发的
            content: msgTypeConvert(type, content), // 内容
            timestamp: timestamp //发起的时间戳
        }
        messages.push(temp)
    }
    return messages;

}




function msgTypeConvert(type, content) {

    switch (type) {
        case 0:
            content = `audio[${content}]`

            break;

        default:
            break;
    }
    return content
}


export default history