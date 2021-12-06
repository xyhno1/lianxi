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
    name: 'hello',
    data () {
    return {
        data: { 
        },
        option: {
            color:['#c23531','#2f4554', '#61a0a8', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3'],
            title: { text: '最活跃的社团' },
            tooltip: {},
            xAxis: {},
            yAxis: {},
            series: [{
                name: '人数',
                type: 'bar',
            }]
        },
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
                text: '最活跃的社团排行榜',
                left:"center" 
                },
            tooltip: {},
            xAxis: {
                type: 'category',
                data: [],
                "axisLabel":{
                    interval: 0,
                    rotate:40
                    }
            },
            yAxis: {
                
            },
            series: [{
                name: '协会名称',
                type: 'line',
                data: [],
                color:'#309100'
            }]
        });

        let myChart2 = this.$echarts.init(document.getElementById('myChart2'))
        // 绘制图表
        myChart2.setOption({
            title: { 
                text: '社团人数排行榜',
                left: 'center' 
                },
            tooltip: {},
            xAxis: {
                type: 'category',
                data: [],
                "axisLabel":{
                    interval: 0,
                    rotate:40
                    }
            },
            yAxis: {},
            series: [{
                name: '人数',
                type: 'bar',
                data: [],
                color:"#089dca"
            }]
        });

        let myChart3 = this.$echarts.init(document.getElementById('myChart3'))
        // 绘制图表
        myChart3.setOption({
            title: { 
                text: '最受欢迎的社团',
                left: 'center' 
            },
            tooltip: {},
            xAxis: {
                 "axisLabel":{
                    show:true,
                    interval: 0,
                    rotate:40
                    },
                 data: []
            },
            yAxis: {},
            series: [{
                name: '社团名称',
                type: 'bar',
                 data: [],
                itemStyle: {
                    color: '#BA8824'
                },
            }]
        });


        let myChart4 = this.$echarts.init(document.getElementById('myChart4'))
        // 绘制图表
        myChart4.setOption({
            title: { 
                text: '最活跃的学生',
                left: 'center' 
            },
            tooltip: {},
            xAxis: {
                 "axisLabel":{
                    show:true,
                    interval: 0,
                    rotate:40
                    },
                 data: []
            },
            yAxis: {},
            series: [{
                name: '参加活动数',
                type: 'bar',
                itemStyle: {
                    color: '#489199'
                },
                barGap: '-100%',
                barCategoryGap: '40%',
                animation: false,
                 data: []
            }]
        });
    }
  },

    //获取后端数据
    created() {
      //图表一 活跃的社团
      this.$axios.get('activity/associationCounts',{
          //fromTs: Date.now()- 60000*60*24*7,
          //toTs: Date.now()
      }
      ).then(res=> {
           let myChart = this.$echarts.init(document.getElementById('myChart'))
           myChart.setOption({
            title: { 
                text: '社团举办活动排行榜',
                left: 'center' 
            },
            tooltip: {},
            xAxis: {
                axisLabel : {
                    show:true,
                    interval: 0
                    }
            },
            yAxis: {},
            series: {
                type: 'line',
                // data: [105, 220, 36]
            }
         })
         let option = myChart.getOption()
        option.xAxis = {data: res.data.association_name}
        console.log(res.data.association_name)
        option.series = {data: res.data.times}
        myChart.setOption(option)
        myChart.resize()  //自适应
        //console.log(Date.now() + "aaa")
       }).catch(err=>{console.log(err);})

        //图表二--已完成
        this.$axios.get('getMemberNumber',{
          //fromTs: Date.now()- 60000*60*24,
          //toTs: Date.now(),
          //granularity:8
      }).then(res=>{
           let myChart2 = this.$echarts.init(document.getElementById('myChart2'))
           console.log(res.data.data)
           myChart2.setOption({
            title: { 
                text: '社团人数排行榜',
                left: 'center' 
                },
            tooltip: {},
            xAxis: {
                // grid: {  
                //     left: '10%',  
                //     bottom:'35%'  
                // }, 
                axisLabel : {
                    show:true,
                    interval: 0
                    }
            },  
            yAxis: {
                color:['#62d1de','#54d6b6','#a6db69','#ffd454','#ffa361','#d1d1d1'],
            },
            series: {
                type:'bar',
                //data: [105, 220, 36, 10, 10, 20]
            }
        })
        let option = myChart2.getOption()
        option.xAxis = {data: res.data.association_names}
        option.series = {data: res.data.association_numbers}
        myChart2.setOption(option)
        myChart2.resize()  //自适应
        //console.log(option)
       }).catch(err=>{console.log(err);})

       //图表三--已完成
        this.$axios.get('getApplyNumber',{
          //fromTs: Date.now()- 60000*60*24*7,
          //toTs: Date.now()
        }
          ).then(res=>{
           let myChart3 = this.$echarts.init(document.getElementById('myChart3'))
           console.log(res.data.data)
           myChart3.setOption({
            title: { 
                text: '最受欢迎社团',
                left: 'center'
            },
            tooltip: {},
            xAxis: {
                "axisLabel":{
                    show:true,
                    interval: 0,
                    rotate:40
                    }
            },
            yAxis: {},
            series: {
                type:'bar',
                //data: [105, 220, 36, 10, 10, 20]
            }
        })
        let option = myChart3.getOption()
        option.xAxis = {data: res.data.association_names.slice(0,7)}
        option.series = {data: res.data.association_numbers.slice(0,7)}
        myChart3.setOption(option)
        myChart3.resize()  //自适应
        //console.log(option)
       }).catch(err=>{console.log(err);})

       //图表四 活动参加人数统计
        this.$axios.get('activity/userCounts',{}
        ).then(res=>{
           let myChart4 = this.$echarts.init(document.getElementById('myChart4'))
           console.log(res.data.data)
           myChart4.setOption({
            title: { 
                text: '最活跃的学生',
                left: 'center'
            },
            tooltip: {},
            xAxis: {

            },
            yAxis: {},
            series: {
                type:'line',
                //data: [105, 220, 36, 10, 10, 20]
            }
        })
        let option = myChart4.getOption()
        option.xAxis = {data: res.data.user_name}
        console.log(res.data.user_name)
        option.series = {data: res.data.times}
        console.log(res.data.times)
        myChart4.setOption(option)
        myChart4.resize()  //自适应
        //console.log(option)
       }).catch(err=>{console.log(err);})
    }//created  使用created获取后端数据，该方法在method中
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