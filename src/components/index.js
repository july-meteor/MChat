


import MChat from './Chat'
import MChatPage from './ChatInterface'




const components = [MChat,MChatPage]





// 初始化  函数  ，需要将 mcaht组件 自动挂载到 app 下
const install = function (Vue, opts = {}) {
    if (install.installed) return
    install.installed = true
    components.forEach(component => {
        Vue.component(component.name, component);
        //自动挂载
    });
    // 
    // Vue.prototype.$busi = busi
};


if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue)
}


export default {
    version: '1.0.0',
    install,
    ...components
}