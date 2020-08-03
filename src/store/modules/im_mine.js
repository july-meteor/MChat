
import { setCache, getCache, removeCache } from '../cache'

import {constant} from '../../const'

const default_avatar = "http://www.qsfj.com/data/upload/201805/f_b68ccc238a400550805c6b7ed1df9d6c.jpg";

const default_mine ={
    // 当前用户Id
     id:1 , 
     //用户名
     username:'Meteor',
     //头像
     avatar:  default_avatar,
     //在线状态 online：在线、hide：隐身 offline :离线
     status: constant.OFFLINE,  
}
  

const KEY_MINE = 'MINE'


const mine = {
    state: getCache(KEY_MINE) || default_mine,
    mutations: {
        SET_MIEN(state, {id, username, avatar =default_avatar ,status =  constant.OFFLINE,}) {
            state.id = id
            state.username =  username
            state.status =  status
            state.avatar =  avatar
            setCache(KEY_MINE, {id,username,avatar,status })
        },
    },
    actions: {
        initMine({ commit, state }, info ){
            commit('SET_MIEN', info)
        }
    }
}

export default mine