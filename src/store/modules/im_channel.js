
import { setCache, getCache, removeCache } from '../cache'

import { constant, protoConst, controlConst } from '../../const'

// import eventHub from '../../utils/eventHub'
import { protoChannelSwitch } from './proto'

import { notEnabledAlert } from './tool'

const default_channels = [{
    //频道Id  
    id: undefined,
    // 频道名称
    name: undefined,
    //用户
    list: [{
        tid: undefined,
        username: undefined,
        avatar: undefined,//头像
        status: constant.OFFLINE,     //在线状态 online：在线、hide：隐身 offline :离线

    }]
}]



/**
 * cache key
 */
const KEY_CHANNEL_LIST = 'CHANNEL_LIST'


const channels = {
    state: {
        list: getCache(KEY_CHANNEL_LIST) || [],
    },
    mutations: {
        SET_CHANNELS(state, channels) {
            state.list = channels
            setCache(KEY_CHANNEL_LIST, channels)
        },
    },
    actions: {
        
        // 频道增加
        channelAdd({ dispatch, commit, getters, state }, { id, name }) {
            let isEnabled = getters.chat.enabled;
            if (!isEnabled ||  !getters.chat.update) {
                notEnabledAlert(getters.chat.update)
                return
            }

            //判断下是否已经有这个频道了
            let channels = state.list;
            let len = channels.length;
            if (len < 1) {
                // 添加群组后要发送一个切换群组的命令

                channels.push({ id, name });
                commit('SET_CHANNELS', channels)
                dispatch("channelSwitch",{ id, name })
                return
            }
            let flag = true;
            for (let i = 0; i < len; i++) {
                let model = channels[i]
                if (model.id === id) {
                    flag = false;
                }
            }
            if (flag) {
                channels.push({ id, name });
                commit('SET_CHANNELS', channels)
                dispatch("channelSwitch",{ id, name })
            }
        },
        // 频道删除
        channelDel({ commit, state }, id) {
            let channels = state.list;
            let len = channels.length;
            if (len < 1) return
            let ary = [];
            for (let i = 0; i < len; i++) {
                let model = channels[i]
                if (model.id != id) {
                    ary.push(model);
                }
            }
            commit('SET_CHANNELS', ary)
        },
    }
}






export default channels