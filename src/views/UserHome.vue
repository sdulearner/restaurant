<template>
  <el-container>
    <el-header style="font-size: 20px">小型餐馆管理系统
      <el-dropdown trigger="click" style="float: right">
        <span class="el-dropdown-link">{{ username }}<i class="el-icon-arrow-down el-icon--right"></i></span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="exit()">退出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-header>
    <el-container>
      <el-aside width="200px" style="background-color: rgb(238, 241, 246)">

        <el-menu router>
          <el-menu-item index="shop"><i class="el-icon-fork-spoon"></i>订餐页面</el-menu-item>
          <el-menu-item index="orderList"><i class="el-icon-s-order"></i>我的订单</el-menu-item>
          <el-menu-item index="userInfo"><i class="el-icon-user-solid"></i>用户信息</el-menu-item>
        </el-menu>
      </el-aside>
      <el-container>
        <el-main>
          <keep-alive>
            <router-view v-if="$route.meta.keepAlive">
              <!-- 这里是会被缓存的视图组件，比如 Shop！ -->
            </router-view>
          </keep-alive>

          <router-view v-if="!$route.meta.keepAlive">
            <!-- 这里是不被缓存的视图组件，比如 OrderList！ -->
          </router-view>
        </el-main>
      </el-container>
    </el-container>
  </el-container>
</template>
<script>
export default {
  data() {
    return {
      username: '',
      id: '',
    }
  },
  created() {
    this.username = localStorage.getItem("username");
    this.id = localStorage.getItem("id");
  },
  methods: {
    exit: function () {
      localStorage.clear();
      this.$router.push({path: '/'})
    }

  }
}

</script>
<style>
.el-dropdown-link {
  cursor: pointer;
}

.el-icon-arrow-down {
  font-size: 12px;
}


.el-header {
  background-color: #B3C0D1;
  color: #333;
  line-height: 60px;
}

.el-aside {
  color: #333;
}
</style>
