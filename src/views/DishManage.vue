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
          label="价格(￥)"
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
          <el-button size="small" icon="el-icon-edit-outline" @click="edit(scope.row)">编辑</el-button>
          <el-button size="small" icon="el-icon-delete" type="danger" @click="remove(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="btn-group" style="text-align: center">
      <el-button @click="addDish">添加菜品</el-button>
    </div>
    <el-dialog
        title="请输入菜品信息"
        :visible.sync="infoVisible"
        center>
      <el-form :model="info">
        <el-form-item label="名称">
          <el-input v-model="info.name"></el-input>
        </el-form-item>

        <el-form-item label="价格">
          <el-input v-model="info.price"></el-input>
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="infoVisible = false">取 消</el-button>
    <el-button type="primary" @click="confirm()">确认</el-button></span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "DishManage",
  data() {
    return {
      dishes: [],
      search: '',
      dish_id: '',
      infoVisible: false,
      info: {
        name: '',
        price: '',
      },
      mode: 1,//0:修改 1:删除
    }
  },
  created() {
    this.refresh();
  },
  methods: {
    refresh() {
      //加载菜品
      let url = "http://localhost:8081/dish/allDishes"
      let formData = new FormData();
      const that = this
      axios.get(url).then(function (res) {
        that.dishes = res.data;
        console.log(res)
      }).catch(function (error) {
        console.log(error)
      })
      //关闭dialog
      this.infoVisible = false;
    },
    confirm() {
      let flag = this.judge();
      const that = this
      if (flag) {
        if (this.mode === 0) {//修改
          const url = "http://localhost:8081/dish/changeDishInfo"
          let formData = new FormData();
          formData.append("dish_name", this.info.name);
          formData.append("price", this.info.price);
          formData.append("id", this.dish_id);
          axios.post(url, formData).then(function (res) {
            that.$message({
              type: "success",
              message: "修改成功"
            })
            that.refresh()
            console.log(res)
          }).catch(function (error) {
            console.log(error)
          })
        } else if (this.mode === 1) {//增加
          const url = "http://localhost:8081/dish/addDish"
          let formData = new FormData();
          formData.append("dish_name", this.info.name);
          formData.append("price", this.info.price);

          axios.post(url, formData).then(function (res) {
            that.$message({
              type: "success",
              message: "添加成功"
            })
            that.refresh()
            console.log(res)
          }).catch(function (error) {
            console.log(error)
          })
        }
      } else {//输入信息不合法
        that.$message({
          type: "error",
          message: "请输入正确的菜品信息"
        })
      }

    },
    edit(row) {
      this.mode = 0;
      this.infoVisible = true;
      this.info.name = row.dish_name;
      this.info.price = row.price;
      this.dish_id = row.dish_id;
    },
    remove(row) {
      const url = "http://localhost:8081/dish/delete"
      let formData = new FormData();
      formData.append("id", row.dish_id);
      const that = this

      this.$confirm('是否确认删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: "warning",
        center: true,
      }).then(() => {

        axios.post(url, formData).then(function (res) {
          that.refresh();
          that.$message("菜品已经删除")
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

    },
    addDish() {
      this.mode = 1;
      this.infoVisible = true;
      this.info.name = '';
      this.info.price = '';
    },
    judge() {//判断输入是否符合条件
      if (!/^[1-9][0-9]*([\.][0-9]{1,2})?$/.test(this.info.price)) return false;
      if (this.info.name === '' || this.info.price === '')
        return false;
      return true;
    }
  }
}
</script>

<style scoped>

</style>