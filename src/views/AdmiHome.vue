  <template>
    <el-container>
      <el-header style="font-size: 20px">小型餐馆管理系统
        <el-dropdown trigger="click" style="float: right">
          <span class="el-dropdown-link">Admi<i class="el-icon-arrow-down el-icon--right"></i></span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="exit()">退出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-header>
      <el-container>
        <el-aside width="200px" style="background-color: rgb(238, 241, 246)">

          <el-menu router>
            <el-menu-item index="dishManage"><i class="el-icon-food"></i>菜品管理</el-menu-item>
            <el-menu-item index="orderManage"><i class="el-icon-s-order"></i>订单管理</el-menu-item>
            <el-menu-item index="deskManage"><i class="el-icon-menu"></i>餐桌管理</el-menu-item>
            <el-menu-item index="expenseManage"><i class="el-icon-s-finance"></i>费用管理</el-menu-item>
            <el-menu-item index="materialManage"><i class="el-icon-chicken"></i>原料管理</el-menu-item>
            <el-menu-item index="dataView"><i class="el-icon-s-data"></i>图表数据</el-menu-item>
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
  name: "AdmiHome",
  data() {
    return {}
  },
  created() {
  },
  methods: {
    exit: function () {
      // localStorage.clear();
      this.$router.push({path: '/'})
    }
  }
}
</script>

<style scoped>

</style>