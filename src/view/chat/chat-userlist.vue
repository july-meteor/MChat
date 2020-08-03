<script>
import { mapGetters} from 'vuex'
export default {
  name: "chat-userlist",
  componentName: "chatUserList",
  data() {
    return {
      // 被点击的目标
      selected:1 ,
      
    };
  },
  computed:{
    ...mapGetters(["chat"])
  },
  created() {},
  methods: {},
  render(h) {

    let {chat} = this;
    

    let html = (
      <div 
       class={{
            "im-chat-userlist":true ,
            "listActive": chat.userlistShow}}
      >
    
        <div class="im-chat-list-title">
        <div class="im-chat-list-count">
           <span>
         成员(24/30)
        </span>
        </div>
     
        <div class="im-chat-input ">
        <input class="im-chat-search" placeholder="搜索成员"> </input>
        <span class="im-chat-search-prefix">
        <i class="im-icon el-icon-search"> </i>
        </span>
        </div>

        </div>

        <ul>
          <li>
            <div class="im-user-name">
              <span>大哥1</span>
            </div>
          </li>
          <li class="active">
            <div class="im-user-name">
              <span>大哥1</span>
            </div>
          </li>
          <li>
            <div class="im-user-name">
              <span>大哥1</span>
            </div>
          </li>
        </ul>
      </div>
    );

    return html;
  }
};
</script>