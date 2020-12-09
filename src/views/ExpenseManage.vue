<template>
  <div>
    <el-table
        :data="expenses.filter(data => !search || data.e_name.toLowerCase().includes(search.toLowerCase()))"
        style="width: 100%">
      <el-table-column
          label="名称"
          prop="e_name">
      </el-table-column>

      <el-table-column
          label="金额(￥)"
          sortable
          prop="amount">
      </el-table-column>

      <el-table-column
          label="时间"
          sortable
          prop="time">
      </el-table-column>

      <el-table-column
          align="right">
        <template slot="header" slot-scope="scope">
          <el-input
              v-model="search"
              amount="mini"
              placeholder="输入关键字搜索"/>
        </template>
        <template slot-scope="scope">
          <el-button amount="small" icon="el-icon-edit-outline" @click="edit(scope.row)">编辑</el-button>
          <el-button amount="small" icon="el-icon-delete" type="danger" @click="remove(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="btn-group" style="text-align: center">
      <el-button @click="addExpense">添加账单</el-button>
    </div>
    <el-dialog
        title="请输入费用信息"
        :visible.sync="infoVisible"
        center>
      <el-form :model="info">
        <el-form-item label="名称">
          <el-input v-model="info.name"></el-input>
        </el-form-item>

        <el-form-item label="数额">
          <el-input v-model="info.amount"></el-input>
        </el-form-item>

        <el-form-item class="time-picker" :style="timePickerVisible" label="时间">
          <el-date-picker v-model="info.time" type="date">
          </el-date-picker>
          <el-time-picker v-model="info.time"></el-time-picker>
        </el-form-item>
        <el-form-item>

        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="infoVisible = false">取 消</el-button>
    <el-button type="primary" @click="confirm()">确认</el-button></span>
    </el-dialog>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  name: "ExpenseManage",
  data() {
    return {
      expenses: [],
      search: '',
      expense_id: '',
      infoVisible: false,
      info: {
        name: '',
        amount: '',
        time: ''
      },
      mode: 1,//0:修改 1:删除
      timePickerVisible: {
        display: "none",
      }
    }
  },
  created() {
    this.refresh();
  },
  methods: {
    refresh() {
      //加载餐桌
      let url = "http://localhost:8081/expense/allExpenses"
      let formData = new FormData();
      const that = this
      axios.get(url).then(function (res) {
        that.expenses = res.data;
        console.log(res)
      }).catch(function (error) {
        console.log(error)
      })
      //关闭dialog
      this.infoVisible = false;
      this.timePickerVisible.display = "none";
    },
    confirm() {
      let flag = this.judge();
      const that = this
      if (flag) {
        if (this.mode === 0) {//修改
          const url = "http://localhost:8081/expense/changeExpenseInfo"
          let formData = new FormData();
          formData.append("name", this.info.name);
          formData.append("amount", this.info.amount);
          formData.append("time", moment(new Date(this.info.time)).format('YYYY-MM-DD HH:mm:ss'));
          // console.log( moment(new Date(this.info.time)).format('YYYY-MM-DD HH:mm:ss'))
          formData.append("id", this.expense_id);
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
          const url = "http://localhost:8081/expense/addExpense"
          let formData = new FormData();
          formData.append("name", this.info.name);
          formData.append("amount", this.info.amount);

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
          message: "请输入正确的账单信息"
        })
      }

    },
    edit(row) {
      this.mode = 0;
      this.infoVisible = true;
      this.timePickerVisible.display = "inline";
      this.info.name = row.e_name;
      this.info.amount = row.amount;
      this.info.time = row.time;
      this.expense_id = row.e_id;
    },
    remove(row) {
      const url = "http://localhost:8081/expense/delete"
      let formData = new FormData();
      formData.append("id", row.e_id);
      const that = this

      this.$confirm('是否确认删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: "warning",
        center: true,
      }).then(() => {

        axios.post(url, formData).then(function (res) {
          that.refresh();
          that.$message("费用已经删除")
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
    addExpense() {
      this.mode = 1;
      this.infoVisible = true;
      this.timePickerVisible.display = "none";
      this.info.name = '';
      this.info.amount = '';
    },
    judge() {//判断输入是否符合条件
      if (!/^[1-9][0-9]*([\.][0-9]{1,2})?$/.test(this.info.amount)) return false
      if (this.info.name === '' || this.info.amount === '')
        return false;
      return true;
    }
  }
}
</script>

<style scoped>
.time-picker {
  text-align: center
}
</style>