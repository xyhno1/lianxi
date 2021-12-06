<template>
  <div>
    <div>
      <span>数据库：</span>
      <el-select v-model="selectedDatabase" placeholder="请选择数据库" @change="getTableList" size="mini">
        <el-option
          v-for="item in databases"
          :key="item"
          :label="item"
          :value="item">
        </el-option>
      </el-select>
      <span style="margin-left:40px">表：</span>
      <el-select v-model="selectedTable" placeholder="请选择表" @change="getTable" size="mini">
        <el-option
          v-for="item in tables"
          :key="item"
          :label="item"
          :value="item">
        </el-option>
      </el-select>
    </div>
    <el-table :data="tableSlice" v-if="tableData && tableData.length" style="width: 100%" :height="bodyHeight - 156">
      <el-table-column label="操作" fixed="right" width="80">
        <template slot-scope="{row,$index}">
          <div v-show="showType[$index] === 0">
            <el-row style="text-align: center">
              <el-col :span="12">
                <el-button
                  :disabled="disable"
                  class="textbtn"
                  type="text"
                  @click="handleEdit($index, row)"
                >
                  <i class="el-icon-edit"></i>
                </el-button>
              </el-col>
              <el-col :span="12">
                <el-button
                  :disabled="disable"
                  class="textbtn"
                  type="text"
                  @click="handleDelete($index)"
                >
                  <i class="el-icon-delete dan"></i>
                </el-button>
              </el-col>
            </el-row>
          </div>
          <div v-show="showType[$index] === 1">
            <el-row style="text-align:center">
              <el-col :span="12">
                <el-button class="textbtn" type="text"  @click="handleConfirm($index, row)">
                  <i class="el-icon-check suc"></i>
                </el-button>
              </el-col>
              <el-col :span="12">
                <el-button class="textbtn" type="text"  @click="handleCancel($index, row)">
                  <i class="el-icon-close dan"></i>
                </el-button>
              </el-col>
            </el-row>        
          </div>
          <div v-show="showType[$index] === 2" style="text-align:center">
            <i class="el-icon-loading"></i>
          </div>     
          <div v-show="showType[$index] === 3" style="text-align:center">
            <el-button :disabled="disable" class="textbtn" type="text" @click="handleAdd($index, row)"><i class="el-icon-plus"></i></el-button>
          </div>            
        </template>
      </el-table-column>      
      <el-table-column v-for="(item, index) in columns" :key="index" :prop="item.column_name" :label="item.column_name" min-width="150">
        <template slot-scope="{row,$index}">
          <div v-if="showEdit[$index]">
            <el-input v-if="item.column_type === 'string'" v-model="row[item.column_name]" size="small"/>
            <el-input-number v-if="item.column_type === 'number'" v-model="row[item.column_name]" :controls="false" size="small"></el-input-number>
            <el-select v-if="item.column_type === 'boolean'" v-model="row[item.column_name]" placeholder="请选择">
              <el-option key="1" label="true" :value="true"> </el-option>
              <el-option key="2" label="false" :value="false"> </el-option>
              <el-option key="3" label="null" :value="null"> </el-option>
            </el-select>                  
          </div>
          <span v-else>{{row[item.column_name]}}</span>            
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-if="tableData"
      :disabled="disablePage"
      layout="prev, pager, next, jumper"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-size="pageSize"
      :total="tableData ? tableData.length : 0"
      style="padding:15px 10px">
    </el-pagination>
  </div>
</template>

<script>
  export default {
    name:'Database',
    data() {
      return {
        bodyHeight: document.body.clientHeight,
        databases : null,
        selectedDatabase: null,
        tables : null,
        selectedTable: null,
        tableKey: null,
        columns: null,
        // tableHead: null,
        tableData: null,
        // nullable: null,
        showEdit: [],
        showType: [],
        disable: false,
        preRow: null,
        currentPage: 1,
        pageSize: 5,
        disablePage: false,
        tableSlice: []
      }
    },
    methods: {
      showEditInit() {
        this.showEdit.length = this.pageSize + 1
        this.showType.length = this.pageSize + 1
        this.showType.fill(0)
        this.showEdit.fill(false)
        this.preRow = null
        this.disable = false
        this.disablePage = false
        this.showType[this.tableSlice.length - 1] = 3
      },
      getTableList() {
        this.tableData = null
        this.disable=false
        this.disablePage=false
        this.$axios.post('database/getTableList', {
          dbName: this.selectedDatabase
        }).then(res => {
          this.selectedTable = null
          this.tables = res.data.tableName
        }).catch(err => {this.$message.error(err)})
      },
      getTable() {
        this.$axios.post('database/listByTableName', {
          dbName: this.selectedDatabase,
          tableName: this.selectedTable
        }).then(res => {
          for (var i = 0; i < res.data.columns.length; ++i) {
            switch (res.data.columns[i].column_type) {
              case 'int':
              case 'bigint': res.data.columns[i].column_type = 'number';break;
              case 'varchar': res.data.columns[i].column_type = 'string';break;
              default: break;
            }
          }
          this.tableKey = res.data.key
          this.columns = res.data.columns
          this.tableData = JSON.parse(res.data.data)
          this.currentPage = 1
          this.getSclice()
          this.showEditInit() 
        }).catch(err => {this.$message.error(err)})
      },
      getSclice() {
        var slice = this.tableData.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize)
        var temp = {}
        for (let item of this.columns) {
          temp[item.column_name] = undefined
        }
        slice.push(temp)
        this.tableSlice = slice
      },
      handleEdit(index, row) {
        this.preRow = JSON.parse(JSON.stringify(row))
        this.showEdit.splice(index, 1, true)
        this.showType.splice(index, 1, 1)
        this.disable = true
        this.disablePage=true
      },
      handleDelete(index) {
        this.showType.splice(index, 1, 1)
        this.disable = true
        this.disablePage=true
      },
      handleAdd(index, row) {
        this.preRow = 'add'
        this.showEdit.splice(index, 1, true)
        this.showType.splice(index, 1, 1)
        this.disable = true
        this.disablePage=true        
      },
      handleConfirm(index, row) {
        if (this.preRow) {
          var invalidKey = ''

          for (let item of this.columns) {
            if ((row[item.column_name] == undefined || row[item.column_name] == null) && !item.column_isnull) {
              invalidKey += item.column_name + ' '
            }
          } 
          
          if (invalidKey.length) {
            this.$message({
              message: invalidKey + '不能为空',
              type: 'warning'
            })          
            return  
          }

          for (let item of this.columns) {
            if (row[item.column_name] == undefined) {
              row[item.column_name] = null
            }
          }           
          this.showType.splice(index, 1, 2)
          if (this.preRow === 'add') {
            this.$axios.post('database/addData', {
              dbName: this.selectedDatabase,
              tableName: this.selectedTable,
              data: JSON.stringify(row)
            }).then(res => {
              if (res.data.success) {
                this.getTable()
                this.disable = false
                this.disablePage=false
                this.showType.splice(index, 1, 3)
              }
              else {
                this.$message.error(res.data.err_message)
                this.showType.splice(index, 1, 1)
              }
            }).catch(err => {this.$message.error(err)})             
          }
          else {
            this.$axios.post('database/updateData', {
              dbName: this.selectedDatabase,
              tableName: this.selectedTable,
              data: JSON.stringify(row)
            }).then(res => {
              if (res.data.success) {
                this.getTable()
                this.disable = false
                this.disablePage=false
                this.showType.splice(index, 1, 0)
              }
              else {
                this.$message.error(res.data.err_message)
                this.showType.splice(index, 1, 1)
              }
            }).catch(err => {this.$message.error(err)})        
          }
        }
        else {
          this.showType.splice(index, 1, 2)
          this.$axios.post('database/deleteById', {
            dbName: this.selectedDatabase,
            tableName: this.selectedTable,
            idName: this.tableKey,
            idValue: row[this.tableKey]
          }).then(res => {
            if (res.data.success) {
              this.getTable()
              this.disable = false
              this.disablePage=false
              this.showType.splice(index, 1, 0)
            }
            else {
              this.$message.error(res.data.err_message)
            }
          }).catch(err => {this.$message.error(err)})
        }
      },
      handleCancel(index, row) {
        if (this.preRow) {
          if (this.preRow === 'add') {
            this.showEdit.splice(index, 1, false)
            this.showType.splice(index, 1, 3)
            for (let key in row) {
              row[key] = undefined
            }
          }
          else {
            this.showEdit.splice(index, 1, false)
            this.showType.splice(index, 1, 0)
            for (let key in this.preRow) {
              row[key] = this.preRow[key]
            }            
          }
          this.preRow = null
        }
        else {
          this.showType.splice(index, 1, 0)
        }
        
        this.disable = false
        this.disablePage=false
      },
      handleCurrentChange(page) {
        this.currentPage = page
        this.getSclice()
        this.showEditInit()
      }
    },
    created() {
      this.$axios.get('database/getDBList').then(res => {
        this.databases = res.data.database
      }).catch(err => {this.$message.error(err)})
    },
    mounted() {
      window.onresize = () => {
        this.bodyHeight =  document.body.clientHeight
      }
    }
  }
</script>