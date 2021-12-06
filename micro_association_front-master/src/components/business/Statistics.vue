<template>
<div> 
    <div class="container">
        <div class="schart-box">
            <div id="myChart" :style="{width: '500px', height: '400px'}"></div>
        </div>
        <div class="schart-box">
            <div id="myChart2" :style="{width: '500px', height: '400px'}"></div>
        </div>
        <div class="schart-box">
            <div id="myChart3" :style="{width: '500px', height: '400px'}"></div>
        </div>
        <div class="schart-box">
            <div id="myChart4" :style="{width: '500px', height: '400px'}"></div>
        </div>
    </div>
</div>
</template>

<script>
export default {
    data () {
    return {
        data: {},
        option: {},
        chart: null
    }
  },
  mounted(){
    this.drawLine();
  },
  methods:{
    drawLine(){
        // 基于准备好的dom，初始化echarts实例
        let myChart = this.$echarts.init(document.getElementById('myChart'))
        // 绘制图表
        myChart.setOption({
            title: { 
                text: '近七天登录人数', 
                left:"center" 
            },
            tooltip: {},
            xAxis: {
                type:"category",
                "axisLabel":{interval: 0}
            },
            yAxis: {},
            series: [{
                type: 'bar',
            }]
        });
        let myChart2 = this.$echarts.init(document.getElementById('myChart2'))
        // 绘制图表
        myChart2.setOption({
            title: { 
                text: '最活跃时间段',
                left:"center" 
            },
            tooltip: {},
            xAxis: {
                type:"category"
            },
            yAxis: {},
            series: [{
                itemStyle: {
                    color: '#489199'
                },
                type: 'line',
            }]
        });
         let myChart4 = this.$echarts.init(document.getElementById('myChart4'))
        // // 绘制图表4
         myChart4.setOption({
             title: {
                 text: '暂无异常',
                 left: 'center'
             },
         });
        // myChart4.resize()
        
        // 绘制图表
        //let myChart4 = this.$echarts.init(document.getElementById('myChart4'))
        //myChart4.setOption();
        //myChart4.resize()  //自适应
    }
    },
    //获取后端数据
    created() {
      //graph1
      this.$axios.post('statistics/dau',{
          fromTs: Date.now()- 60000*60*24*7,
          toTs: Date.now()   
      }
      ).then(res=> {
           let myChart = this.$echarts.init(document.getElementById('myChart'))
           //console.log(res.data.data)
           myChart.setOption({
               
            title: { 
                text: '近七天登录人数',
                left: 'center' 
            },
            tooltip: {},
            xAxis: {
                type: 'category',
                "axisLabel":{
                    interval: 0,
                    rotate:45
                    }
                },
            yAxis: {},
            series: {
                itemStyle: {
                    color: '#489199'
                },
                data: [105, 220, 36, 20]
            }
         })
        let option = myChart.getOption()
        option.xAxis = {data: res.data.dates}
        option.series = {data: res.data.daus}
        myChart.setOption(option)
        myChart.resize()  //自适应
       }).catch(err=>{console.log(err);})
        //graph2
        this.$axios.post('statistics/api_frequency',{
          fromTs: Date.now()- 60000*60*24*7,
          toTs: Date.now(),
          granularity:2
      }).then(res=>{
           let myChart2 = this.$echarts.init(document.getElementById('myChart2'))
           //console.log(res.data.data)
           myChart2.setOption({
            title: { 
                text: '最活跃时间段',
                left: 'center' 
                },
            tooltip: {},
            xAxis: {
                "axisLabel":{
                    interval: 0,
                    rotate:45
                    },
                    data:[],
            },
            yAxis: {},
            series: {
                type:'line'
            }
        })
        let option = myChart2.getOption()
        option.xAxis = {data: res.data.periods}
        option.series = {data: res.data.calls}
        myChart2.setOption(option)
        myChart2.resize()  
       }).catch(err=>{console.log(err);})
       //graph3
        this.$axios.post('statistics/page_frequency',{
          fromTs: Date.now()- 60000*60*24*7,
          toTs: Date.now()
        }).then(res=>{
           let myChart3 = this.$echarts.init(document.getElementById('myChart3'))
           //console.log(res.data.data)
           var data=[]
           for(var i=0;i<res.data.scenes.length;i++){
               data.push({value:res.data.frequencies[i],name:res.data.scenes[i]})
           }
           myChart3.setOption({
            title: { 
                text: '页面访问频率',
                left: 'center'
            },
            tooltip: {trigger: 'item',
                 formatter: '{a} <br/>{b} : {c} ({d}%)'
            },
            legend:{
                orient: 'vertical',
                left: 'left',
            },
            series: {
                name:"访问频率",
                type:'pie',
                radius: '55%',
                center: ['50%', '60%'],
                data: data,
            }
        })
        let option3 = myChart3.getOption()
        option3.legend = {data: res.data.scenes}
        option3.series = {
            type: 'pie',
                radius: '55%',
                center: ['50%', '60%'],
                data: data,
            }
        //myChart3.setOption(option3)
        myChart3.resize()  //自适应
        // console.log(data)
       }).catch(err=>{console.log(err);})
       //graph4
        this.$axios.post('statistics/service_errors',{
          startTs: Date.now()- 60000*60*24*7,
          endTs: Date.now()
          }).then(res=>{
            let myChart4 = this.$echarts.init(document.getElementById('myChart4'))
            //console.log(res.data.data)
            var data = []
            for(var i = 0; i < res.data.counts.length; i++) {
                data.push({value:res.data.counts[i], name: res.data.services[i]})
            }
            myChart4.setOption({
            title: { 
                text: '异常数',
                left: 'center'
            },
            tooltip: {trigger: 'item',
                 formatter: '{a} <br/>{b} : {c} ({d}%)'
            },
            legend:{
                orient: 'vertical',
                left: 'left',
            },
            series: {
                name: '异常数',
                type: 'pie',
                radius: '55%',
                center: ['50%', '60%'],
            },
        })
        let option4 = myChart4.getOption()
        option4.legend = {data: res.data.services}
        option4.series = {
            type: 'pie',
                radius: '55%',
                center: ['50%', '60%'],
                data: data,
            }
        myChart4.setOption(option4)
        myChart4.resize()  //自适应
        //console.log(res.data)
       }).catch(err=>{console.log(err);})
      
    }//created
}//method
</script>

<style scoped>
.schart-box {
    display: inline-block;
    margin: 20px;
}
.schart {
    width: 600px;
    height: 400px;
}
.content-title {
    clear: both;
    font-weight: 400;
    line-height: 50px;
    margin: 10px 0;
    font-size: 22px;
    color: #1f2f3d;
}
</style>