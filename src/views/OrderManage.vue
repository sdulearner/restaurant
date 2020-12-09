<template>
  <el-table
      :data="orders"
      style="width: 100%">
    <el-table-column type="expand">
      <template slot-scope="props">
        <!--          堂食-->
        <template v-if="props.row.takeaway===0">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="用户名">
              <span>{{ props.row.username }}</span>
            </el-form-item>
            <el-form-item label="桌号">
              <span>{{ props.row.number }} ({{ props.row.size }}人桌)</span>
            </el-form-item>
            <el-form-item label="菜品">
              <template v-for="(value, key) in props.row.dish">
                {{ key }}：{{ value }}份<br>
              </template>
            </el-form-item>
          </el-form>
        </template>
        <!--          外卖-->
        <template v-else>
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="姓名">
              <span>{{ props.row.realname }}</span>
            </el-form-item>
            <el-form-item label="电话">
              <span>{{ props.row.phone }}</span>
            </el-form-item>
            <el-form-item label="地址">
              <span>{{ props.row.address }}</span>
            </el-form-item>
            <el-form-item label="菜品">
              <template v-for="(value, key) in props.row.dish">
                {{ key }}：{{ value }}份<br>
              </template>
            </el-form-item>
          </el-form>
        </template>
      </template>
    </el-table-column>
    <el-table-column
        label="订单号"
        prop="no">
    </el-table-column>
    <el-table-column
        prop="takeaway"
        label="类型"
        width="100"
        :filters="[{ text: '堂食', value: '堂食' }, { text: '外卖', value: '外卖' }]"
        :filter-method="filterTag"
        filter-placement="bottom-end">
      <template slot-scope="scope">
        <el-tag
            :type="scope.row.takeaway=== 0 ? 'primary' : 'success'"
            disable-transitions>
          <template v-if="scope.row.takeaway===0">
            堂食
          </template>
          <template v-else>
            外卖
          </template>
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column
        label="时间"
        sortable
        prop="time">
    </el-table-column>
    <el-table-column
        label="总价(￥)"
        sortable
        prop="total_price">
    </el-table-column>

    <el-table-column
        prop="takeaway"
        label="顾客">
      <template slot-scope="scope">
        <template v-if="scope.row.takeaway===0">
          {{ scope.row.username }}
        </template>
        <template v-else>
          {{ scope.row.realname }}
        </template>
      </template>
    </el-table-column>
    <el-table-column label="状态">
      <template slot-scope="scope">
        <template v-if="scope.row.finished===0">
          <template v-if="scope.row.takeaway===0">
            <el-button
                type="primary"
                size="mini"
                @click="finish(scope.row.no)">结账
            </el-button>
          </template>
          <template v-else>
            <el-button
                size="mini"
                @click="finish(scope.row.no)">完成订单
            </el-button>
          </template>
        </template>
        <template v-else>
          已完成
        </template>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import Utils from "@/plugins/util";

export default {
  name: "OrderManage",
  data() {
    return {
      orders: [],
    }
  },
  created() {
    this.refresh();
  },
  methods: {
    refresh() {
      const url = "http://localhost:8081/order/allOrders"
      const that = this
      axios.get(url).then(function (res) {
        that.orders = res.data;
        console.log(res)
      }).catch(function (error) {
        console.log(error)
      })
    },
    filterTag(value, row) {
      // console.log(value, row)
      return (value === '堂食' && row.takeaway === 0) || (value === '外卖' && row.takeaway === 1);
    },
    finish(no) {
      this.$confirm('是否确定？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        center: true,
      }).then(() => {
        const url = "http://localhost:8081/order/finish"
        let formData = new FormData();
        formData.append("no", no);
        const that = this
        axios.post(url, formData).then(function (res) {
          that.$message({
            type: "success",
            message: "操作成功！"
          })
          //若完成堂食订单则调用Shop页面的refresh()方法
          if (no.startsWith("00")) {
            Utils.$emit('refresh', 'msg')
          }
          //刷新本页面
          that.refresh();
          console.log(res)
        }).catch(function (error) {
          console.log(error)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        });
      });
    }
  }
}
</script>

<style scoped>

</style>