// import { setCache, getCache, removeCache } from '../cache'

import { constant, controlConst } from '../../const'

import eventHub from '../../utils/eventHub'

// 引入 elementu 的 msg box 来做响应回调
import { MessageBox, Message, Notification } from 'element-ui';

import vue from 'vue'

import { protoSingleCall, protoSinglecallVoice } from './proto'

import { notEnabledAlert,   playTipSound } from './tool'



const default_model = {
    //单呼栏 显现 ，群呼会被隐藏
    show: false,
    //对方的Id
    fromId: '',
    //对方的名称
    username: '',
    // 说话状态
    mike: false,
    // 对方说话状态
    listen: false,
}



const singlecall = {
    state: default_model,
    mutations: {
        //初始化呼叫
        INIT_SINGLE_CALL(state, model) {
            state.show = model.show
            state.fromId = model.fromId
            state.username = model.username
            state.mike = false
        },
        DESTROY_SINGLE_CALL(state) {
            state = default_model
        },
        SINGLE_CALL_SHOW(state, flag) {
            state.show = flag
        },
        SET_SINGLECALL_MIKE(state, flag) {
            state.mike = flag
        },
        SET_SINGLE_LISTEN(state, flag) {
            state.listen = flag
        }
    },
    actions: {
        // 加载监听器初始化
        singleCallListen({ dispatch, getters, commit, state },) {
            eventHub.on(controlConst.SINGLE_CALL_LISTEN, (data) => {
                const { type, fromId, username } = data
                switch (type) {
                    // 被动单呼 由控制台回拨来
                    case constant.singlecall.apply:
                        // 
                        blackSingleCall(username, () => {
                            protoSingleCall({ getters, type: 0, model: { fromId, username } })
                        })
                        break
                    //单呼被接受
                    case constant.singlecall.beConfirm:
                        // 进入单呼界面
                        
                        // 如果有在语音则强制中断
                       
                        
                        commit('SET_CHAT_SHOW', false)
                        commit('INIT_SINGLE_CALL', { show: true, fromId, username })
                        break
                    //  单呼退出 
                    case constant.singlecall.quit:
                        //自己手动退出也会收到退出的指令 
                        if (state.show) {
                            quitNotification(state.username)
                            commit('SINGLE_CALL_SHOW', false)
                            commit('SET_CHAT_SHOW', true)
                            commit('DESTROY_SINGLE_CALL')
                        }
                        break
                    case constant.singlecall.reject:
                        rejectAlert()
                        break
                    //被服务器踢出去
                    case constant.singlecall.beQuit:
                        break
                }
            })

            // 终端语音呼叫过来
            eventHub.on(controlConst.SINGLE_CALL_VOICE, (data) => {
                commit("SET_SINGLE_LISTEN", data.type == 1 ? true : false)
            })
        },
        // 申请单呼 然后发送 协议
        applyForCall({ dispatch, getters, commit, state }, model) {
            let isEnabled = getters.chat.enabled;
          
            if (!isEnabled ||  !getters.chat.update) {
                notEnabledAlert(getters.chat.update)
                return
            }
            applySingleCallConfirm(model.name).then(() => {
                protoSingleCall({ getters, type: 0, model })
            })

        },
        //退出单呼 
        quitForCall({ commit, getters, state }) {
            quitSingleCallConfirm().then(() => {
                let model = { terminalId: state.fromId, name: state.username }
                protoSingleCall({ getters, type: 2, model })
                quitNotification(state.username)
                commit('SINGLE_CALL_SHOW', false)
                commit('SET_CHAT_SHOW', true)
                commit('DESTROY_SINGLE_CALL')
            })
        },
        //收到单呼邀请
        receiveForCall({ commit, state }, model) {


        },
        //单呼语音
        singlecallVoice({ commit, getters, state }) {
            // 由于调度者默认最高优先级，所以这里不做 被占用的考虑
            commit("SET_SINGLECALL_MIKE", !state.mike)
            // 说话的时候都不允许对方打断。
            commit("SET_SINGLE_LISTEN", false)
            playTipSound();
            protoSinglecallVoice({ getters, state })
        },
    }
}


// 回话
function blackSingleCall(name, blakCall) {
    let title = "请求单呼"
    let message = `是否接通终端:${name}的单呼？`
    MessageBox.confirm(message, title, {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
    }).then(() => {
        blakCall();
    }).catch(() => {
        let title = "单呼拒绝",
            message = `拒绝${name}与通话！！`;
        Notification({
            type: 'success',
            title,
            message
        })
    })
}


// 单呼被服务器拒接
function rejectAlert() {
    let title = "单呼失败",
        message = '单呼被拒接,对方可能已经在单呼或者多呼中!!!';

    Notification({
        type: 'warning',
        title,
        message
    })
}


function quitNotification(name) {
    let title = "单呼退出",
        message = `与${name}的通话结束！！`;
    Notification({
        type: 'success',
        title,
        message
    })
}

/**
 * 退出单呼确认
 */
function quitSingleCallConfirm() {
    let title = "退出单呼"
    let message = "是否结束单呼？"

    return MessageBox.confirm(message, title, {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
    })
}

/**
 *  发起单呼确认
 */
function applySingleCallConfirm(name) {
    let title = "单呼确认"
    const h = new vue().$createElement;
    let message = h("p", null, [
        h("span", null, "是否对 "),
        h("b", { style: "color: red" }, name),
        h("span", null, "发起单呼 ")
    ]);
    return MessageBox.confirm(message, title, {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
    })
}



export default singlecall
