/**
 *  监听
 * 
 * 获取监听列表
 * 添加监听 
 * 删除监听
 * 锁定监听 
 * 监听优先级
 * 

 */

import { setCache, getCache, removeCache } from '../cache'
import { listAll, addMonitor, delMonitor } from '@/api/MonitorVoiceController'
import { Notification } from 'element-ui'




const KEY_LIST = 'monitor_list',
    KEY_MIN = 'monitor_min',
    KEY_OPEN = 'monitor_open',
    KEY_LOCK = 'monitor_lock';

const default_model = {
    // 监听对象列表
    list: getCache(KEY_LIST) || [],
    //最小化
    min: false,
    // 显示
    display: false,
    // 锁定
    lock: {},
    // 监听box 是否打开状态
    open: getCache(KEY_OPEN) || false,
}

const im_monitor = {
    state: default_model,
    mutations: {
        SET_LSIT(state, list) {
            state.list = list
            setCache(KEY_LIST, list)
        },
        SET_MIN(state, min) {
            state.min = min
            setCache(KEY_MIN, min)
        },
        SET_LOCK(state, lock) {
            state.lock = lock
            setCache(KEY_LOCK, lock)
        },
        SET_OPEN(state, open) {
            state.open = open
            setCache(KEY_OPEN, open)
        }
    },
    actions: {
        monitorListInit({ state, getters, commit }) {
            listAll(getters.user.terminalId).then(res => {
                const { data } = res.data
                if (data) {
                    commit("SET_LSIT", data)
                } else {
                    commit("SET_LSIT", [])
                }
            })
        },
        // 添加 监控
        addMonitor({ state, dispatch }, model) {
            addMonitor(model).then(res => {
                const { data } = res.data;
                if (data) {
                    dispatch('monitorListInit')
                } else {
                    let title = '监听操作',
                        message = '该目标已存在！';
                    Notification.warning({ title, message });
                }
            })
        },
        delMonitor({ state, dispatch }, id) {
            delMonitor(id).then(res => {
                const { data } = res.data
                if (data) {
                    let title = '监听操作',
                        message = '删除成功！';
                    Notification.success({ title, message });
                    dispatch('monitorListInit')
                } else {
                    console.log("已经存在")
                }
            })
        },
        monitorBoxOpen({ state, commit }) {
            commit("SET_OPEN", !state.open)
        },
        lockMonitor({ state, dispatch }, id) {


        }

    }

}


export default im_monitor;