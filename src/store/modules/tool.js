import { Message, MessageBox } from 'element-ui';
import {playMedia} from '../../utils/play'
import {constant} from '../../const'
import vue from 'vue'



/**
 * 服务没有启动的警告框
 * 
 * */
export function notEnabledAlert(isUpdate = false) {

    let title = '对讲服务警告',

        message = !isUpdate ? '请先安装驱动服务!!': '驱动服务已升级请先更新！';
        message = message+ "驱动安装完成后请【重新登录】！！"

    MessageBox.confirm(message, title, {
        confirmButtonText: '下载',
        cancelButtonText: '取消',
        callback: action => { 
        }
    });
}

/**
 *  获取 用户名称
 */
export function findUserNameById(userInfoList,id){
    let label = "未知用户";
    for( let user of userInfoList){
        if(user.terminalId === id){
            label = user.userName
        }
    }
    return label
}


/**
 *   提升音
 */
export function playTipSound(){
    playMedia(constant.tipsSound)
}




