import ArrayQueue from '../../utils/ArrayQueue'
import { provideConst } from '../../const'
import { MessageBox } from 'element-ui'

/**
 *  这个功能虽然 方法名 是provide  和 consume 但是实际上 是提供给遇到需要刷新 消费的实践
 *  挂载到vuex 上
 */

const defalut_model = {
    key: undefined,
    value: {

    }
}


const consume = {
    actions: {
        // 添加事件
        provideEvent({ }, event) {
            ArrayQueue.push(event)

        },
        // 消费事件
        consumeEvent() {
            while (ArrayQueue.size() > 0) {
                let { key, value } = ArrayQueue.get();
                switch (key) {
                    case provideConst.OTHER_TERMINAL_LONGIN:
                        otherTerminalLogin(value)
                        break
                    case provideConst.WS_CLOSE:
                        webSocketClose(value)
                        break
                }
            }
        }
    }
}


//  告诉网页终端登录事件
function otherTerminalLogin(value) {
        MessageBox.alert("其他终端登录！", "服务器消息", {
            confirmButtonText: "确定",
            callback: action => {

            }
        });
}

function webSocketClose(){
    MessageBox.alert("代理服务崩溃，请检查下代理服务是否正常运行！", "服务器崩溃", {
        confirmButtonText: "确定",
        type: 'errir',
        callback: action => {

        }
    });

}



export default consume 
