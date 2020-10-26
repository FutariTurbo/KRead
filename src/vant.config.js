import { 
    Toast, 
    Button, 
    NavBar,
    Field,
    Form,
    Tab,
    Tabs,
    Tabbar,
    TabbarItem,
    Icon,
    Checkbox,
    CheckboxGroup,
    Search,
    Swipe,
    SwipeItem,
    Tag,
    GoodsAction,
    GoodsActionIcon,
    GoodsActionButton,
    Cell,
    CellGroup,
    Sticky,
    Popup,
    Divider,
    Dialog,
    SwipeCell,
    Empty,
    PullRefresh,
    Lazyload
} from 'vant'

const vants = [
    Toast, 
    Button, 
    NavBar,
    Field,
    Form,
    Tab,
    Tabs,
    Tabbar,
    TabbarItem,
    Icon,
    Checkbox,
    CheckboxGroup,
    Search,
    Swipe,
    SwipeItem,
    Tag,
    GoodsAction,
    GoodsActionIcon,
    GoodsActionButton,
    Cell,
    CellGroup,
    Sticky,
    Popup,
    Divider,
    Dialog,
    SwipeCell,
    Empty,
    PullRefresh,
    Lazyload
]

export default {
    /**
     * Vue.use 方法会自动调用install函数
     * Install Vant Component plugin
     * @param Vue
     */
    install(Vue) {
        vants.forEach(Component => {
            Vue.use(Component)
        })
    }

}