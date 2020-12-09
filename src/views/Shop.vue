<template>
  <div>
    <el-table
        :data="dishes.filter(data => !search || data.dish_name.toLowerCase().includes(search.toLowerCase()))"
        style="width: 100%">
      <el-table-column
          label="名称"
          prop="dish_name">
      </el-table-column>

      <el-table-column
          label="价格"
          sortable
          prop="price">
      </el-table-column>

      <el-table-column
          label="销量"
          sortable
          prop="sales">
      </el-table-column>

      <el-table-column
          align="right">
        <template slot="header" slot-scope="scope">
          <el-input
              v-model="search"
              size="mini"
              placeholder="输入关键字搜索"/>
        </template>
        <template slot-scope="scope">
          <el-input-number size="small" v-model="scope.row.index" @change="handleChange(scope.$index,scope.row)"
                           :min="0" :max="10"
                           :step="1"
                           step-strictly
                           label="描述文字"></el-input-number>
        </template>
      </el-table-column>
    </el-table>
    <el-row>
      <el-col :span="19">
        <div class="btn-group" style="text-align: center">
          <el-button @click="tangShi">{{ btnView }}</el-button>
          <el-button @click="takeaway">外卖</el-button>
        </div>
      </el-col>
      <el-col :span="5">
        <div class="grid-content bg-purple-light">
          ￥{{ total_price }}
        </div>
      </el-col>
    </el-row>

    <el-dialog
        title="请选择餐桌"
        :visible.sync="deskVisible"
        fullscreen
        center>
      <template v-for="(desk,index) in desks">
        <template v-if="desk.free===1">
          <template v-if="index===deskIndex">
            <el-tooltip :content="desk.size+'人桌'" placement="top">
              <el-button @click="chooseDesk(index,desk.desk_id)" type="primary"
                         :style="{width:Math.sqrt(desk.size>10?10:desk.size)*50+'px',height:Math.sqrt(desk.size>10?10:desk.size)*50+'px'}">
                {{ desk.number }}
              </el-button>
            </el-tooltip>
          </template>
          <template v-else>
            <el-tooltip :content="desk.size+'人桌'" placement="top">
              <el-button @click="chooseDesk(index,desk.desk_id)"
                         :style="{width:Math.sqrt(desk.size>10?10:desk.size)*50+'px',height:Math.sqrt(desk.size>10?10:desk.size)*50+'px'}">
                {{ desk.number }}
              </el-button>
            </el-tooltip>
          </template>
        </template>
        <template v-else>
          <el-tooltip :content="desk.size+'人桌(占用)'" effect="light" placement="top">
            <el-button disabled
                       :style="{width:Math.sqrt(desk.size>10?10:desk.size)*50+'px',height:Math.sqrt(desk.size>10?10:desk.size)*50+'px'}">
              {{ desk.number }}
            </el-button>
          </el-tooltip>
        </template>
      </template>
      <span slot="footer" class="dialog-footer">
    <el-button @click="deskVisible = false">取 消</el-button>
    <el-button type="primary" @click="confirm(1)">确 定</el-button></span>
    </el-dialog>

    <el-dialog
        title="请输入您的信息"
        :visible.sync="infoVisible"
        center>
      <el-form :model="info">
        <el-form-item label="姓名">
          <el-input v-model="info.realname"></el-input>
        </el-form-item>

        <el-form-item label="电话">
          <el-input v-model="info.phone"></el-input>
        </el-form-item>

        <el-form-item label="地址">
          <el-input v-model="info.address"></el-input>
        </el-form-item>
      </el-form>
      <div class="btn-group" style="text-align: center">
        <el-button @click="completeInfo">填入用户信息</el-button>
      </div>
      <span slot="footer" class="dialog-footer">
    <el-button @click="infoVisible = false">取 消</el-button>
    <el-button type="primary" @click="confirm(0)">确认下单</el-button></span>
    </el-dialog>
  </div>
</template>
<script>
import Utils from '../plugins/util.js'

export default {
  name: "Shop",
  data() {
    return {
      dishes: [],
      search: '',
      btnView: '堂食',
      num: [],
      desks: [],
      desk_id: '',
      deskIndex: '',
      total_price: 0,
      deskVisible: false,
      infoVisible: false,
      info: {
        realname: '',
        phone: '',
        address: ''
      },
      time: '',
      timer: '',
    }
  },
  created() {
    this.refresh();
  },
  mounted() {
    const that = this
    Utils.$on('refresh', function (msg) {
      that.refresh();
    })
    this.timer = setInterval(function () {
      that.refreshBtn()
    }, 1000);
  },
  beforeDestroy() {
    clearInterval(this.timer);
    this.timer = null;
  },
  methods: {
    refreshBtn() {
      //确定是否为加餐
      let url = "http://localhost:8081/order/checkBill"
      let formData = new FormData();
      formData.append("user_id", localStorage.getItem("id"));
      const that = this
      axios.post(url, formData).then(function (res) {
        if (res.data === 0) that.btnView = "堂食"
        else that.btnView = "加餐"
      }).catch(function (error) {
        console.log(error)
      })
    },
    refresh() {
      this.refreshBtn();
      let url = '';
      let formData = new FormData();
      const that = this
      //加载菜品
      url = "http://localhost:8081/dish/allDishes"
      axios.get(url).then(function (res) {
        that.dishes = res.data;
        //input-number重置为0
        that.num = new Map();
        for (let i = 0; i < that.dishes.length; i++) {
          that.num.set(that.dishes[i].dish_id, 0)
        }
        console.log(res)
      }).catch(function (error) {
        console.log(error)
      })
      //加载餐桌信息
      url = "http://localhost:8081/desk/allDesks"
      axios.get(url).then(function (res) {
        that.desks = res.data;
        console.log(res)
      }).catch(function (error) {
        console.log(error)
      })
      this.deskIndex = ''
      this.desk_id = '';


      //
      this.total_price = 0;
      this.info.realname = '';
      this.info.phone = '';
      this.info.address = '';

      //dialogVisible
      this.deskVisible = false;
      this.infoVisible = false;
    },
    handleChange(index, row) {
      if (row.index === "" || row.index == null) {
        this.total_price = 0;
        this.num.set(row.dish_id, 0)
        return
      }
      let history = this.num.get(row.dish_id)
      console.log(history);
      if (history > row.index) {//变小
        let size = history - row.index
        for (let i = 0; i < size; i++)
          this.total_price -= row.price;
      } else {
        let size = row.index - history
        for (let i = 0; i < size; i++)
          this.total_price += row.price;
      }
      this.num.set(row.dish_id, Math.ceil(row.index))
      console.log(index, row.index)
    },
    tangShi() {
      let flag = false;
      this.num.forEach(function (key) {
        if (key !== 0) flag = true;
      });
      const that = this;
      if (flag) {//已经选过菜品
        if (this.btnView === '加餐') {
          this.$confirm('是否加餐？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            center: true,
          }).then(() => {
            that.confirm(1);
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消加餐'
            });
          });
        } else {
          this.deskVisible = true;
        }
      } else {//没有选择菜品
        this.$message({
          message: "请选择菜品",
          type: "error",
        })
      }
    },
    takeaway() {
      let flag = false;
      this.num.forEach(function (key) {
        if (key !== 0) flag = true;
      });
      if (flag)
        this.infoVisible = true;
      else {
        this.$message({
          message: "请选择菜品",
          type: "error",
        })
      }
    }
    ,
    chooseDesk(index, id) {
      if (index !== this.deskIndex) {
        this.deskIndex = index;
        this.desk_id = id;
      } else {
        this.deskIndex = '';
        this.desk_id = '';
      }
    },
    completeInfo() {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      setTimeout(() => {
        loading.close();
        const url = "http://localhost:8081/user/userInfo"
        let formData = new FormData();
        formData.append("id", localStorage.getItem("id"));
        const that = this;
        axios.post(url, formData).then(function (res) {
          that.info.realname = res.data[0].realname
          that.info.phone = res.data[0].phone
          that.info.address = res.data[0].address
          console.log(res.data[0].username)
        }).catch(function (error) {
          console.log(error)
        })
      }, 500);
    },
    judge() {//判断输入是否符合条件
      if (!/^[1][2,3,4,5,7,8,9][0-9]{9}$/.test(this.info.phone)) return false
      if (this.info.realname === '' || this.info.address === '')
        return false;
      return true;
    },
    confirm(flag) {
      let url = "http://localhost:8081/"
      let formData = new FormData();
      const that = this
      let obj = {};
      for (let [k, v] of this.num) {
        obj[k] = v;
      }

      if (flag === 1) {//堂食或加餐
        if (this.btnView === '加餐') {
          url = url.concat("order/addBill")
          formData.append("user_id", localStorage.getItem("id"));
          formData.append("addPrice", this.total_price);
          formData.append("map", JSON.stringify(obj));
          axios.post(url, formData).then(function (res) {
            that.$message({
              type: "success",
              message: "加餐成功！"
            })
            that.refresh();
            console.log(res)
          }).catch(function (error) {
            console.log(error)
          });
        } else {//堂食
          if (this.deskIndex == null || this.deskIndex === '') {
            this.$message("请选择餐桌")
            return;
          }
          url = url.concat("order/bill")
          formData.append("user_id", localStorage.getItem("id"));
          formData.append("desk_id", this.desk_id);
          formData.append("total_price", this.total_price);
          formData.append("map", JSON.stringify(obj));
          axios.post(url, formData).then(function (res) {
            that.$message({
              type: "success",
              message: "下单成功，订单号:" + res.data
            })
            that.refresh();
            console.log(res)
          }).catch(function (error) {
            console.log(error)
          });
        }
      } else {//外卖
        const that = this
        if (!this.judge()) {
          that.$message({
            type: "error",
            message: "请输入正确的订单信息"
          })
          return;
        }
        url = url.concat("order/takeaway")
        formData.append("user_id", localStorage.getItem("id"));
        formData.append("realname", this.info.realname);
        formData.append("phone", this.info.phone);
        formData.append("address", this.info.address);
        formData.append("total_price", this.total_price);
        formData.append("map", JSON.stringify(obj));
        axios.post(url, formData).then(function (res) {
          that.$message({
            type: "success",
            message: "下单成功，订单号:" + res.data
          })
          that.refresh();
          console.log(res)
        }).catch(function (error) {
          console.log(error)
        })
      }
    }
  }
}
</script>

<style scoped>
.bg-purple-light {
  background: #e5e9f2;
  font-size: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>