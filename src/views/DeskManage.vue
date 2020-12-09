<template>
  <div>
    <el-table
        :data="desks.filter(data => !search || data.number.toLowerCase().includes(search.toLowerCase()))"
        style="width: 100%">
      <el-table-column
          label="桌号"
          prop="number">
      </el-table-column>

      <el-table-column
          label="大小"
          sortable
          prop="size">
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
          <template v-if="scope.row.free===1">
            <!--     餐桌没有被占用-->
            <el-button size="small" icon="el-icon-edit-outline" @click="edit(scope.row)">编辑</el-button>
            <el-button size="small" icon="el-icon-delete" type="danger" @click="remove(scope.row)">删除</el-button>
          </template>
          <template v-else>
            <!--        餐桌被占用-->
            <el-button size="small" icon="el-icon-edit-outline" disabled>编辑</el-button>
            <el-button size="small" icon="el-icon-delete" type="danger" disabled>删除</el-button>
          </template>
        </template>
      </el-table-column>
    </el-table>
    <div class="btn-group" style="text-align: center">
      <el-button @click="addDesk">添加餐桌</el-button>
    </div>
    <el-dialog
        title="请输入餐桌信息"
        :visible.sync="infoVisible"
        center>
      <el-form :model="info">
        <el-form-item label="桌号">
          <el-input v-model="info.number"></el-input>
        </el-form-item>

        <el-form-item label="餐桌大小">
          <el-input v-model="info.size"></el-input>
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
  name: "DeskManage",
  data() {
    return {
      desks: [],
      search: '',
      desk_id: '',
      infoVisible: false,
      info: {
        number: '',
        size: '',
      },
      mode: 1,//0:修改 1:删除
    }
  },
  created() {
    this.refresh();
  },
  methods: {
    refresh() {
      //加载餐桌
      let url = "http://localhost:8081/desk/allDesks"
      let formData = new FormData();
      const that = this
      axios.get(url).then(function (res) {
        that.desks = res.data;
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
          const url = "http://localhost:8081/desk/changeDeskInfo"
          let formData = new FormData();
          formData.append("number", this.info.number);
          formData.append("size", this.info.size);
          formData.append("id", this.desk_id);
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
          const url = "http://localhost:8081/desk/addDesk"
          let formData = new FormData();
          formData.append("number", this.info.number);
          formData.append("size", this.info.size);

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
          message: "请输入正确的餐桌信息"
        })
      }

    },
    edit(row) {
      this.mode = 0;
      this.infoVisible = true;
      this.info.number = row.number;
      this.info.size = row.size;
      this.desk_id = row.desk_id;
    },
    remove(row) {
      const url = "http://localhost:8081/desk/delete"
      let formData = new FormData();
      formData.append("id", row.desk_id);
      const that = this

      this.$confirm('是否确认删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: "warning",
        center: true,
      }).then(() => {

        axios.post(url, formData).then(function (res) {
          that.refresh();
          that.$message("餐桌已经删除")
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
    addDesk() {
      this.mode = 1;
      this.infoVisible = true;
      this.info.number = '';
      this.info.size = '';
    },
    judge() {//判断输入是否符合条件
      if (!/^[0-9]*[1-9][0-9]*$/.test(this.info.size)) return false
      if (this.info.number === '' || this.info.size === '')
        return false;
      return true;
    }
  }
}
</script>

<style scoped>

</style>