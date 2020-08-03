import Cookies from 'js-cookie'

/**
 *  chat自身带有缓存
 * 
 *  chatLog  key为 type + channelId 数据结构为数组类型
 */

//  数据示例
 const chatLogVO ={
      id: undefined,//频道ID 单呼为对方的Id
      fromId: undefined,//谁发的 
      type: undefined,
      content: undefined,
      mine:undefined, //是不是自己发的
      username: undefined,
      historyTime: undefined, //历史事件
 }




 var ChatLog = function(id,type){
     this.key = id + "_" + type;
 }

 ChatLog.prototype.getLog =()=>{
    return  Cookies.get(this.key)
 }

 ChatLog.prototype.push=(data)=>{
    let logs = this.getLog;
    if(!logs){
        logs = [];
    }
    logs.push(data);
    Cookies.set(logs);
 }
 ChatLog.prototype.clean=()=>{
    Cookies.remove(this.key);
 }



 const local ={
    ChatLog, 
     history
 }

 export default local

