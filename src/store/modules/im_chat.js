
import { setCache, getCache, clearCache } from '../cache'

import { constant, provideConst, controlConst, eventConst } from '../../const'

import eventHub from '../../utils/eventHub'

import { protoChannelSwitch, protoSendGroupVoice } from './proto'

import { findUserNameById, playTipSound } from './tool'
import { Message, MessageBox } from 'element-ui';


/**
 *   这个其实应该就是一个带耦合的service了
 */




const KEY_STATUS = 'chat_status',
    KEY_CHANNEL = 'cur_channel',
    KEY_SHOW = 'chat_show',
    KEY_CONTENT_SHOW = 'chat_content_show',
    KEY_MIN = 'chat_min',
    KEY_USERLIST_SHOW = 'chat_userlist_show',
    KEY_ENABLED = 'chat_enabled',
    KEY_UPDATE = 'chat_update',
    KEY_USER_INFO_LIST = 'chat_user_info_list';

let Alert;

const chat = {
    state: {
        // 是否启动 enabled 只有启动需要远程的功能才能使用   false
        enabled: getCache(KEY_ENABLED) || false,
        update: getCache(KEY_UPDATE) || false, // server是否需要更新
        //最小化
        min: getCache(KEY_MIN) || false,
        //整个组件是否显示
        show: true,
        notice: false, //声音提醒
        //发送快捷键
        sendHotKey: '',
        // 聊天室是否显示
        contentShow: getCache(KEY_CONTENT_SHOW) || true,
        //发送的快捷键
        sendHotKey: "",
        //选中的对话
        selected: "0",
        // 麦克风是否占用 
        mike: false,
        //当前管道
        channel: getCache(KEY_CHANNEL) || {},
        // box 头部分的 消息文字全局公用， 多此一举 
        titleMsg: '',
        userlistShow: getCache(KEY_USERLIST_SHOW) || false,
        // 全部成员 主要为了获取 终端名称 
        userInfoList: getCache(KEY_USER_INFO_LIST) || []
    },
    mutations: {
        SET_SELECTED(state, val) {
            state.selected = val
        },
        SET_CHANNEL(state, model = {}) {
            state.channel = model
            setCache(KEY_CHANNEL, model)
        },
        SET_CONTENT_SHOW(state, flag) {
            state.contentShow = flag

            setCache(KEY_SHOW, flag)
        },
        SET_CHAT_SHOW(state, flag) {
            state.show = flag
            setCache(KEY_CONTENT_SHOW, flag)
        },
        SET_MIKE(state, flag) {
            state.mike = flag
        },
        SET_MIN(state, flag) {
            state.min = flag
            setCache(KEY_MIN, flag)
        },
        SET_USERLIST_SHOW(state, flag) {
            state.userlistShow = flag;
            setCache(KEY_USERLIST_SHOW, flag)
        },
        SET_ENABLED(state, flag) {
            state.enabled = flag;
            setCache(KEY_ENABLED, flag)
        },
        SET_UPDATE(state, flag) {
            state.update = flag
            setCache(KEY_UPDATE, flag)
        },
        SET_USER_INFO_LIST(state, list) {
            state.userInfoList = list;
            setCache(KEY_USER_INFO_LIST, list)
        },
        SET_titleMsg(state, msg) {
            state.titleMsg = msg;
        }

    },
    actions: {
        // 聊天器销毁 退出的时候会调用主要目的是销毁一切缓存
        destroyChat() {
            clearCache()
        },
        // 初始化
        chatInitializaiton({ dispatch }) {
            //接收语音
            dispatch('receiveVoice');
            //  ws 关闭事件  则强制退出
            eventHub.on(eventConst.WS_CLOSE, function () {
                dispatch('enabledChat', false)
                MessageBox.alert("代理服务崩溃，请检查下代理服务是否正常运行！", "服务器崩溃", {
                    confirmButtonText: "确定",
                    type: 'errir',
                    callback: action => {
                    }
                });
                // dispatch("LogOut").then(()=>{
                //     dispatch('provideEvent',{ key: provideConst.WS_CLOSE , value:''})
                //     location.reload();
                // })
                // 提示 websocket 断掉问题
            })
        },
        updateUserList({ state, commit }, list) {
            commit("SET_USER_INFO_LIST", list)
        },
        //发送语音
        sendVoice({ dispatch, getters, commit, state }, { channel, mike }) {
            if (state.mike == mike) {
                playTipSound();
                commit("SET_MIKE", !mike)
                //看看需不需要切换频道,返回后开始发送语音
                let channelId = state.channel.id;
                if (channel) {
                    channelId = channel.id;
                }
                if (Alert) {
                    Alert.close()
                }
                let message = "   我正在说话！！！！！"
                dispatch("voiceMessage", { message, mike: state.mike })
                protoSendGroupVoice({ getters, channelId, type: state.mike })
            }
        },
        /**
         * 接受到语音 需要注册到 初始化事件中
         * */
        receiveVoice({ dispatch, getters, commit, state }) {
            eventHub.on(controlConst.CHANNEL_MSG, function ({ type, channelId, fromId }) {
                let userList = state.userInfoList;
                let name = findUserNameById(userList, fromId)
                let message = `${name}正在说话！！！！！`
                if (Alert) {
                    Alert.close()
                }
                dispatch("voiceMessage", { message, mike: type == 1 ? true : false })
            });
        },
        // 如果在群呼中则强制中断
        stopVoice({ dispatch, getters, commit, state }) {
         
            if (state.mike != true) return
            dispatch("voiceMessage", { mike: false })
            let channelId = state.channel.id;
          
            protoSendGroupVoice({ getters, channelId, type: false })
        },
        voiceMessage({ dispatch, getters, commit, state }, { message, mike }) {
            if (mike) {
                // 窗口最小化不弹出提示框
                if (!state.min) {
                    Alert = Message({
                        type: 'error',
                        message,
                        duration: 0,
                        iconClass: 'el-icon-microphone',
                        offset: 80
                    })
                }
                commit("SET_titleMsg", message);
            } else {
                if (Alert) {
                    Alert.close()
                }
                commit("SET_titleMsg", '');
            }
        },
        //最小化
        miniOrMaxmize({ commit, state }) {
            commit("SET_MIN", !state.min);
        },
        contentShow({ commit, state }) {
            commit("SET_CONTENT_SHOW", !state.contentShow);
        },
        // 频道切换 提供一个回调
        channelSwitch({ getters, commit, state }, channel) {
            return new Promise((resolve,) => {
                // 说话状态下是不能切群组的
                if (!channel || state.mike) {
                    return
                } else if (state.channel.id == channel.id) {
                    return
                }
                let temp = {
                    id: channel.id,
                    name: channel.name,
                    label: channel.label
                };
                commit("SET_CHANNEL", temp)
                protoChannelSwitch({
                    getters,
                    channelId: channel.id
                })
                resolve();
            })
        },
        channelSelected({ commit }, value) {
            commit('SET_SELECTED', value + "")
        },
        openUserlist({ commit, state }) {

            commit("SET_USERLIST_SHOW", !state.userlistShow)
        },
        //点击群组头像及信息事件 
        setChannelInfo({ commit, state }, channleId) {
            eventHub.emit(controlConst.SET_CHANNEL_EVENT, channleId);
        },
        //是否启动
        isEnabled({ commit, state }) {
            let flag = state.enabled
            if (flag) {
                return flag
            }
            return flag;
        },
        /**
         *  版本校验后可启动
         */
        enabledChat({ commit }, flag) {
            commit('SET_ENABLED', flag)
            commit('SET_UPDATE', flag)
        },
    }
}


export default chat