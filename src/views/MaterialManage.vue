<template>
  <div>
    <el-table
        :data="materials.filter(data => !search || data.m_name.toLowerCase().includes(search.toLowerCase()))"
        style="width: 100%">
      <el-table-column
          label="名称"
          prop="m_name">
      </el-table-column>

      <el-table-column
          label="剩余(斤)"
          sortable
          prop="remainder">
      </el-table-column>

      <el-table-column
          align="right">
        <template slot="header" slot-scope="scope">
          <el-input
              v-model="search"
              remainder="mini"
              placeholder="输入关键字搜索"/>
        </template>
        <template slot-scope="scope">
          <el-button remainder="small" icon="el-icon-edit-outline" @click="edit(scope.row)">编辑</el-button>
          <el-button remainder="small" icon="el-icon-delete" type="danger" @click="remove(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="btn-group" style="text-align: center">
      <el-button @click="addMaterial">添加原料</el-button>
    </div>
    <el-dialog
        title="请输入原料信息"
        :visible.sync="infoVisible"
        center>
      <el-form :model="info">
        <el-form-item label="名称">
          <el-input v-model="info.name"></el-input>
        </el-form-item>

        <el-form-item label="剩余">
          <el-input v-model="info.remainder"></el-input>
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
  name: "MaterialManage",
  data() {
    return {
      materials: [],
      search: '',
      material_id: '',
      infoVisible: false,
      info: {
        name: '',
        remainder: '',
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
      let url = "http://localhost:8081/material/allMaterials"
      let formData = new FormData();
      const that = this
      axios.get(url).then(function (res) {
        that.materials = res.data;
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
          const url = "http://localhost:8081/material/changeMaterialInfo"
          let formData = new FormData();
          formData.append("name", this.info.name);
          formData.append("remainder", this.info.remainder);
          formData.append("id", this.material_id);
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
          const url = "http://localhost:8081/material/addMaterial"
          let formData = new FormData();
          formData.append("name", this.info.name);
          formData.append("remainder", this.info.remainder);

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
          message: "请输入正确的原料信息"
        })
      }

    },
    edit(row) {
      this.mode = 0;
      this.infoVisible = true;
      this.info.name = row.m_name;
      this.info.remainder = row.remainder;
      this.material_id = row.m_id;
    },
    remove(row) {
      const url = "http://localhost:8081/material/delete"
      let formData = new FormData();
      formData.append("id", row.m_id);
      const that = this

      this.$confirm('是否确认删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: "warning",
        center: true,
      }).then(() => {

        axios.post(url, formData).then(function (res) {
          that.refresh();
          that.$message("原料已经删除")
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
    addMaterial() {
      this.mode = 1;
      this.infoVisible = true;
      this.info.name = '';
      this.info.remainder = '';
    },
    judge() {//判断输入是否符合条件
      if (!/^[1-9][0-9]*([\.][0-9]{1,2})?$/.test(this.info.remainder)) return false
      if (this.info.name === '' || this.info.remainder === '')
        return false;
      return true;
    }
  }
}
</script>

<style scoped>

</style>