


import MChat from './Chat'
import MChatPage from './ChatInterface'
import EventHub from '../utils/eventHub'
import MChatRightBox from './RightBox'
import MChatRightList from './RightList'



const components = [MChat, MChatPage, MChatRightBox, MChatRightList]



// 初始化  函数  ，需要将 mcaht组件 自动挂载到 app 下
const install = function (Vue, opts = {}) {
    if (install.installed) return
    install.installed = true
    components.forEach(component => {
        Vue.component(component.name, component);
        //自动挂载
    });
    // 
    //观察者
    Vue.prototype.$im = EventHub
};


if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue)
}


export default {
    version: '1.0.0',
    install,
    ...components
}