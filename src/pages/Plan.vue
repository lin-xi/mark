<template>
  <div class="page-plan">
    <div class="body-box">
      <div class="list">
        <Tab>
          <TabPanel title="计划">
            <PlanDay @showContent="showContent"></PlanDay>
          </TabPanel>
          <TabPanel title="完成">
            <PlanDayDone @showContent="showContent"></PlanDayDone>
          </TabPanel>
        </Tab>
      </div>
      <div class="detail">
        <component :is="compo"></component>
      </div>
    </div>
  </div>
</template>

<script>
import { Tab } from 'w-ui/lib/tab'
import { TabPanel } from 'w-ui/lib/tab-panel'
import PlanDay from '../components/plan/Day.vue'
import PlanDayDone from '../components/plan/DayDone.vue'
import PlanMonth from '../components/plan/Month.vue'
import Welcome from '../components/plan/Welcome.vue'
import DayDetail from '../components/plan/DayDetail.vue'

import './plan.less'

export default {
  name: 'plan',
  data() {
    return {
      compo: Welcome,
      currentTask: {}
    }
  },
  components: {
    Tab,
    TabPanel,
    PlanDay,
    PlanDayDone,
    PlanMonth,
    Welcome,
    DayDetail
  },
  methods: {
    showContent(task) {
      this.currentTask = task
      this.compo = DayDetail
    }
  },
  mounted() {
    this.$eventHub.$on('task-delete', () => {
      this.compo = Welcome
    })
  },
  unmount() {
    this.$eventHub.$off('task-delete')
  }
}
</script>
