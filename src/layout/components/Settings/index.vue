<template>
  <div class="drawer-container">
    任务列表
    <el-button :style="{'float':'right'}" @click="handleEmpty">清空日志</el-button>
    <el-table
      :style="{'width': '100%'}"
      :data="events"
      height="650"
      :max-height="1200"
    >
      <el-table-column
        prop="taskName"
        label="任务名称"
        width="100px"
      />
      <el-table-column
        prop="startTime"
        label="开始时间"
        width="140px"
      />
      <el-table-column
        prop="endTime"
        label="结束时间"
        width="140px"
      />
      <el-table-column
        prop="taskState"
        label="任务状态"
        width="80px"
      >
        <template v-slot="scope">
          <el-tag>{{ scope.row.taskState }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="info"
        label="说明"
      >
        <template v-slot="scope">
          <p>{{ scope.row.info }}</p>
        </template>
      </el-table-column>
      <!-- <el-table-column
        label="操作"
      >
        <template slot-scope="scope">
          <el-button type="text" size="small" icon="el-icon-delete" title="删除" circle @click="handleDelete(scope)" />
        </template>
      </el-table-column> -->
    </el-table>
  </div>
</template>

<script>
// import ThemePicker from '@/components/ThemePicker'
import { mapState } from 'vuex'

export default {
  components: { },
  data() {
    return {}
  },
  computed: {
    fixedHeader: {
      get() {
        return this.$store.state.settings.fixedHeader
      },
      set(val) {
        this.$store.dispatch('settings/changeSetting', {
          key: 'fixedHeader',
          value: val
        })
      }
    },
    tagsView: {
      get() {
        return this.$store.state.settings.tagsView
      },
      set(val) {
        this.$store.dispatch('settings/changeSetting', {
          key: 'tagsView',
          value: val
        })
      }
    },
    sidebarLogo: {
      get() {
        return this.$store.state.settings.sidebarLogo
      },
      set(val) {
        this.$store.dispatch('settings/changeSetting', {
          key: 'sidebarLogo',
          value: val
        })
      }
    },
    ...mapState({
      events: state => state.app.events
    })
  },
  methods: {
    themeChange(val) {
      this.$store.dispatch('settings/changeSetting', {
        key: 'theme',
        value: val
      })
    },
    handleDelete(scope) {
      this.$store.commit('app/DEL_EVENT', scope.row.taskID)
    },
    handleEmpty() {
      this.$store.commit('app/EMPTY_EVENT')
    }
  }
}
</script>

<style lang="scss" scoped>
.drawer-container {
  padding: 24px;
  font-size: 14px;
  line-height: 1.5;
  word-wrap: break-word;
  .drawer-title {
    margin-bottom: 12px;
    color: rgba(0, 0, 0, .85);
    font-size: 14px;
    line-height: 22px;
  }

  .drawer-item {
    color: rgba(0, 0, 0, .65);
    font-size: 14px;
    padding: 12px 0;
  }

  .drawer-switch {
    float: right
  }
}
</style>
