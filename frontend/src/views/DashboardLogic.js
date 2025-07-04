// src/composables/DashboardLogic.js
import { ref, computed, onMounted, onUnmounted, reactive, watchEffect } from 'vue'
import axios from 'axios'
import AirConditioner from '@/components/AirConditioner.vue'
import LivingRoomControl from '@/components/LivingRoomControl.vue'
import KitchenControl from '@/components/KitchenControl.vue'
import BedroomControl from '@/components/BedroomControl.vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import aircondition from '@/assets/images/aircondition.png'
import bedroom from '@/assets/images/bedroom.png'
import doorlock from '@/assets/images/doorlock.png'
import kitchen from '@/assets/images/kitchen.png'
import livingroom from '@/assets/images/livingroom.png'
import security from '@/assets/images/security.png'
import switchImg from '@/assets/images/switch.png'
import wifi from '@/assets/images/wifi.png'
import {
  faFan,
  faHouse,
  faUtensils,
  faBed,
  faPowerOff,
  faLock,
  faShieldAlt,
  faExclamationTriangle,
  faWifi,
} from '@fortawesome/free-solid-svg-icons'


// 主题状态
const theme = ref(localStorage.getItem('theme') || 'light')

// 立即设置初始主题（模块加载时执行）
document.documentElement.setAttribute('data-theme', theme.value);
console.log('Initial theme set:', theme.value);

const toggleTheme = () => {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
  localStorage.setItem('theme', theme.value)
  document.documentElement.setAttribute('data-theme', theme.value)
}

// 读取角色
const role = ref('')
// 读取用户名
const username = ref('')

const roleName = ref('')

// 读取邀请码
const inviteCode = ref('')


// // 用户数据
// const username = ref('管理员')
const activeArea = ref(null)

// 区域配置
const areas = ref([
  { id: 'ac', name: '空调', icon: aircondition, component: 'AirConditioner' },
  { id: 'living', name: '客厅', icon: livingroom, component: 'LivingRoomControl' },
  { id: 'kitchen', name: '厨房', icon: kitchen, component: 'KitchenControl' },
  { id: 'bedroom', name: '卧室', icon: bedroom, component: 'BedroomControl' },
])


// 时间相关 - 修复版本
const currentTime = ref('')

// 创建一个组合函数来处理时间更新
// 创建组合函数：处理时间更新 + 请求家庭成员数据
export const useTimeUpdater = () => {
  const updateTime = () => {
    const now = new Date()
    currentTime.value = now.toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    })
  }

  const getCurrentRole = () => {
    const role = localStorage.getItem('role')
    return role || 'admin' // 默认角色为 admin
  }
  role.value = getCurrentRole()
  // 计算角色中文
  roleName.value = computed(() => {
    console.log('role.value的值是', role.value)
    if (role.value === 'admin') return '管理员'
    if (role.value === 'member') return '普通用户'
    return '未知身份'
  })

  const getCurrentAccount = () => {
    //const account = localStorage.getItem('account')
    const account = localStorage.getItem('username')
    if (!account) {
      console.warn('未在 localStorage 中找到 account，使用默认值 admin')
    }
    return account || 'admin'
  }

  username.value = getCurrentAccount()

  const getCurrentInviteCode = () => {
    //const account = localStorage.getItem('account')
    const inviteCode = localStorage.getItem('inviteCode')
    console.log('获取当前邀请码:', inviteCode)
    if (!inviteCode) {
      console.warn('未在 localStorage 中找到 inviteCode，使用默认值 admin')
    }
    return inviteCode
  }
  inviteCode.value = getCurrentInviteCode()

  onMounted(() => {
    console.log('Dashboard 组件已挂载，启动时间更新与数据加载')
    updateTime()
    const timer = setInterval(updateTime, 1000)
    onUnmounted(() => {
      console.log('清除时间更新定时器')
      clearInterval(timer)
    })
  })

  return { currentTime, familyMembers }
}
// 环境数据
export const environmentData = reactive({
  time: { label: '时间', value: currentTime },
  people: { label: '屋内有', value: '' },
  temperature: { label: '温度', value: '22°C' },
  humidity: { label: '湿度', value: '57%' },
  pm25: { label: 'PM2.5', value: '32 μg/m³' },
  co2: { label: '二氧化碳', value: '450 ppm' },
})


// 场景模式
const scenes = ref([
  { id: 'home', name: '回家模式', icon: '🏠' },
  { id: 'away', name: '离家模式', icon: '🚪' },
  { id: 'sleep', name: '睡眠模式', icon: '🛌' },
])

// 所有设备
const allDevices = ref([
  { id: 'LK002', name: '智能门锁', state: false, details: '已锁定' },
  { id: 'SF003', name: '安防系统', state: true, details: '布防中' },
])

// 家庭成员

export const familyMembers = ref([])
export const toggleHomeStatus = (member) => {
  member.isHome = !member.isHome
  localStorage.setItem('familyMembers', JSON.stringify(familyMembers.value))
}
// 示例：从本地存储或状态管理中获取当前账号
const getCurrentAccount = () => {
  // 假设你登录后保存了账号
  return localStorage.getItem('account') || 'admin'
}

// 自动监听在家人数
watchEffect(() => {
  const count = familyMembers.value.filter(m => m.isHome).length
  environmentData.people.value = `${count}人`
})

// 区域切换
const toggleArea = (areaId) => {
  activeArea.value = activeArea.value === areaId ? null : areaId
}

// 获取区域组件
const getAreaComponent = (areaId) => {
  const componentMap = {
    ac: AirConditioner,
    living: LivingRoomControl,
    kitchen: KitchenControl,
    bedroom: BedroomControl,
  }
  return componentMap[areaId]
}

// 快捷设备
const quickDevices = ref([
  { id: 1, name: '总控开关', state: true, status: '系统在线', icon: switchImg, type: 'master' },
  { id: 2, name: '智能门锁', state: false, status: '已锁定', icon: doorlock, type: 'lock' },
  { id: 3, name: '安防系统', state: true, status: '布防中', icon: security, type: 'security' },
  { id: 5, name: '网络状态', state: true, status: '', icon: wifi, type: 'network', signalStrength: 80 },
])

const handleDeviceAction = (device) => {
  if (!device || !device.name) {
    console.error('Invalid device:', device)
    return
  }

  // 找 quickDevices 中对应设备的索引
  const quickIndex = quickDevices.value.findIndex(d => d.name === device.name)
  if (quickIndex === -1) {
    console.error('Device not found in quickDevices:', device.name)
    return
  }

  // 状态取反
  const newState = !quickDevices.value[quickIndex].state

  // 更新 quickDevices
  quickDevices.value[quickIndex].state = newState

  switch (device.type) {
    case 'master':
      quickDevices.value[quickIndex].status = newState ? '系统在线' : '系统离线'
      break
    case 'lock':
      quickDevices.value[quickIndex].status = newState
        ? '大门锁定'
        : '大门解锁'
      break
    case 'security':
      quickDevices.value[quickIndex].status = newState ? '布防中' : '撤防中'
      break
    case 'network':
      quickDevices.value[quickIndex].status = newState ? '' : '网络断开'
      quickDevices.value[quickIndex].signalStrength = newState ? 80 : 0
      break
    default:
      console.warn('Unknown device type:', device.type)
      break
  }

  // 同步更新 allDevices 里的状态和 details （这里我的想法是只有安防系统以及智能门锁有展示，所以就仅靠name属性来更新不走数据库后端）
  const allIndex = allDevices.value.findIndex(d => d.name === device.name)
  if (allIndex !== -1) {
    allDevices.value[allIndex].state = newState
    allDevices.value[allIndex].details = quickDevices.value[quickIndex].status
  }
}

// 网络弹窗
const networkModalVisible = ref(false)
const showNetworkModal = () => {
  networkModalVisible.value = true
}

// 退出登录
const logout = () => {
  localStorage.removeItem('authToken')
  window.location.href = '/login'
  localStorage.removeItem('username')
}

// 粒子效果
const activeParticle = ref(null)
const triggerParticleEffect = (event, deviceId) => {
  activeParticle.value = deviceId
  setTimeout(() => {
    activeParticle.value = null
  }, 800)
}

const bgMusic = ref(null)
const isMusicReady = ref(false)

export const useMusicPlayer = () => {
  const initMusic = (audioElement) => {
    console.log('initMusic被调用，audioElement:', audioElement)
    if (!audioElement) {
      console.error('音频元素不存在')
      return
    }

    bgMusic.value = audioElement

    console.log('开始设置音频事件监听器')
    console.log('音频文件 URL:', audioElement.src)

    // 监听元数据加载
    bgMusic.value.addEventListener('loadedmetadata', () => {
      console.log('音频元数据加载完成，持续时间:', bgMusic.value.duration, '秒')
    })

    // 监听音频加载完成
    bgMusic.value.addEventListener('canplaythrough', () => {
      console.log('音频加载完成')
      isMusicReady.value = true
      bgMusic.value.volume = 0.5 // 提高音量，测试是否可闻
      console.log('尝试恢复音量到 0.5')
      bgMusic.value.play().then(() => {
        console.log('播放尝试成功')
      }).catch(err => {
        console.error('播放失败:', err)
      })
    })

    // 监听加载开始
    bgMusic.value.addEventListener('loadstart', () => {
      console.log('音频开始加载')
    })

    // 监听可以播放
    bgMusic.value.addEventListener('canplay', () => {
      console.log('音频可以播放')
    })

    // 监听错误
    bgMusic.value.addEventListener('error', (e) => {
      console.error('音频加载错误:', e)
      console.error('错误代码:', bgMusic.value.error?.code, '错误信息:', bgMusic.value.error?.message)
    })

    console.log('强制加载音频')
    bgMusic.value.load()
  }

  return { initMusic, bgMusic }
}




// 导出所有逻辑
export {
  theme,
  toggleTheme,
  username,
  inviteCode,
  roleName,
  activeArea,
  areas,
  quickDevices,
  currentTime,
  scenes,
  allDevices,
  toggleArea,
  getAreaComponent,
  handleDeviceAction,
  networkModalVisible,
  showNetworkModal,
  logout,
  activeParticle,
  triggerParticleEffect,
  // useTimeUpdater, // 导出时间更新组合函数
  FontAwesomeIcon,
  faFan,
  faHouse,
  faUtensils,
  faBed,
  faPowerOff,
  faLock,
  faShieldAlt,
  faExclamationTriangle,
  faWifi,
}
