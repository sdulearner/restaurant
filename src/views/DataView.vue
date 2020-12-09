<template>
  <div>
    <div id="dishChart" :style="{ height: '300px',width:'600px'}"></div>
    <div id="billChart" :style="{ height: '300px',width:'600px'}"></div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      charts: [],
      dishData: [],
      billData: [{
        name: "西红柿鸡蛋",
        value: 50
      }, {
        name: "西红柿炒鸡蛋",
        value: 50
      }],
      timer: '',
    };
  },
  mounted() {
    // const that = this;
    // this.timer = setInterval(function () {
    //   that.drawPie();
    // }, 1000);

  },
  beforeDestroy() {
    this.charts.dispose();
  },
  created() {
    this.request()
  },
  methods: {
    request() {
      const that = this;
      axios.get("http://localhost:8081/data/dishData").then(function (res) {
        // console.log(res.data)
        that.dishData = res.data;
        that.drawPie();
      }).catch(function (error) {
        console.log(error);
      })

      console.log(this.billData)
      // console.log(this.dishData)
      axios.get("http://localhost:8081/data/billData").then(function (res) {
        // console.log(res)
        that.billData = res.data;
        that.drawPie();
      }).catch(function (error) {
        console.log(error);
      })
    },
    drawPie() {
      const echarts = require('echarts');
      const that = this;
      this.charts[0] = echarts.init(document.getElementById("dishChart"));
      this.charts[0].setOption({
        series: [
          {
            type: 'pie',    // 设置图表类型为饼图
            radius: '55%',  // 饼图的半径，外半径为可视区尺寸（容器高宽中较小一项）的 55% 长度。
            data: that.dishData,
            label: {
              normal: {
                show: true,
                formatter: '{b} {d}%'
              },
              labelLine: {show: true}
            },
          }
        ]
      })
      this.charts[1] = echarts.init(document.getElementById("billChart"));
      this.charts[1].setOption({
        series: [
          {
            type: 'pie',    // 设置图表类型为饼图
            radius: '55%',  // 饼图的半径，外半径为可视区尺寸（容器高宽中较小一项）的 55% 长度。
            data: that.billData,
            label: {
              normal: {
                show: true,
                formatter: '{b} {d}%'
              },
              labelLine: {show: true}
            },
          }
        ]
      })
    }
  },
}
</script>