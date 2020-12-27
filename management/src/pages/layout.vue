<template>
	<div class="layout">
		<a-layout id="components-layout-demo-custom-trigger">
			<a-layout-sider v-model:collapsed="collapsed" :trigger="null" collapsible>
				<div class="logo">
          <span v-if="!collapsed">
            一品粮味
          </span>
					<span v-else>
            <PieChartOutlined />
          </span>
        </div>
				<a-menu theme="dark" mode="inline" v-model:selectedKeys="selectedKeys" @click="menuClick">
					<a-menu-item key="/user">
						<PieChartOutlined />
						<span>用户管理</span>
					</a-menu-item>
					<a-menu-item key="/role">
						<DesktopOutlined />
						<span>角色管理</span>
					</a-menu-item>
					<a-menu-item key="/menu">
						<DesktopOutlined />
						<span>菜单管理</span>
					</a-menu-item>
				</a-menu>
			</a-layout-sider>
			<a-layout>
				<a-layout-header style="background: #fff; padding: 0">
					<menu-unfold-outlined
						v-if="collapsed"
						class="trigger"
						@click="() => (collapsed = !collapsed)"
					/>
					<menu-fold-outlined
						v-else
						class="trigger"
						@click="() => (collapsed = !collapsed)"
					/>
          <div class="logout">
            <UserOutlined style="fontSize: 24px" @click="logoutShow = !logoutShow"/>
            <div class="logout_model" v-show="logoutShow">
              <router-link to="/login">退出登录</router-link>
            </div>
          </div>
				</a-layout-header>
				<a-layout-content
					:style="{
						margin: '24px 16px',
						padding: '24px',
						background: '#fff',
						minHeight: '280px',
					}"
				>
					<router-view></router-view>
				</a-layout-content>
			</a-layout>
		</a-layout>
	</div>
</template>
<script>
import {
	UserOutlined,
	PieChartOutlined,
	DesktopOutlined,
	MenuUnfoldOutlined,
	MenuFoldOutlined
} from "@ant-design/icons-vue";
import { message } from 'ant-design-vue';
import { ref, provide, reactive, watch} from 'vue';
import { useRouter } from "vue-router";
export default {
	components: {
		UserOutlined,
		PieChartOutlined,
		DesktopOutlined,
		MenuUnfoldOutlined,
		MenuFoldOutlined
	},
  setup(props, context) {
		//实例化路由
    const router = useRouter();
		let selectedKeys = reactive([router.currentRoute._value.href])
    let collapsed = ref(false)
    let logoutShow = ref(false)
		function menuClick({ item, key, keyPath }) {
			console.log(item,'-----',key,'-----',keyPath)
      // 获取到当前的key,并且跳转
			selectedKeys[0] = key;
      router.push({
        path: key
      })
    }
			
    return {
			selectedKeys,
      collapsed,
      logoutShow,
			menuClick
    }
	},
  methods: {
    
  },
};
</script>
<style lang="scss">
.layout {
  height: 100%;
}

.ant-layout {
  height: 100%;
}

.logout {
  position: relative;
  .logout_model {
    display: inline-block;
    text-align: center;
    position: absolute;
    top: 44px;
    right: -14px;
    width: 70px;
    padding: 5px;
    border: 1px solid black;
    background-color: white;
    line-height: 32px;
  }
}

.ant-layout-header{
  padding: 0 16px!important;
  display: flex;
  justify-content: space-between;
}

#components-layout-demo-custom-trigger .trigger {
	font-size: 18px;
	line-height: 64px;
	cursor: pointer;
	transition: color 0.3s;
}

#components-layout-demo-custom-trigger .trigger:hover {
	color: #1890ff;
}

#components-layout-demo-custom-trigger .logo {
	height: 32px;
	background: rgba(255, 255, 255, 0.2);
  margin: 16px;
  text-align: center;
  line-height: 32px;
  color: rgb(24, 144, 255);
  font-size: 18px;
  font-family:"Times New Roman",Georgia,Serif;
}
</style>