<template>
  <div class="dashboard-container">
    <h2 class="page-title">平台数据概览</h2>

    <!-- 数据卡片 -->
    <el-row :gutter="20" class="stat-row">
      <el-col :span="6" v-for="card in statCards" :key="card.key">
        <div class="stat-card" :style="{ borderColor: card.color }">
          <div class="stat-value" :style="{ color: card.color }">{{ stats[card.key] || 0 }}</div>
          <div class="stat-label">{{ card.label }}</div>
        </div>
      </el-col>
    </el-row>

    <!-- 待处理事项 -->
    <el-row :gutter="20" style="margin-top:20px">
      <el-col :span="8">
        <el-card class="pending-card">
          <div slot="header"><span>待审核摄影师认证</span></div>
          <div class="pending-num" style="color:#E6A23C">{{ stats.pendingPhotographers || 0 }} 人</div>
          <el-button type="warning" size="small" @click="$router.push('/photographers')"查看列表</el-button>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="pending-card">
          <div slot="header"><span>待审核提现</span></div>
          <div class="pending-num" style="color:#F56C6C">{{ stats.pendingWithdrawals || 0 }} 笔</div>
          <el-button type="danger" size="small" @click="$router.push('/finance')">查看列表</el-button>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="pending-card">
          <div slot="header"><span>待审核作品</span></div>
          <div class="pending-num" style="color:#409EFF">{{ stats.pendingPortfolios || 0 }} 件</div>
          <el-button type="primary" size="small" @click="$router.push('/content')">查看列表</el-button>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getDashboard } from '@/api/admin'

export default {
  name: 'Dashboard',
  data() {
    return {
      stats: {},
      statCards: [
        { key: 'totalUsers', label: '总用户数', color: '#409EFF' },
        { key: 'totalPhotographers', label: '摄影师数', color: '#67C23A' },
        { key: 'totalOrders', label: '总订单数', color: '#E6A23C' },
        { key: 'totalAmount', label: '总交易额(元)', color: '#F56C6C' }
      ]
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    async fetchData() {
      const res = await getDashboard().catch(() => {})
      if (res) this.stats = res.data || {}
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-container {
  margin: 30px;
  .page-title { font-size: 22px; margin-bottom: 20px; color: #303133; }
  .stat-card {
    background: #fff;
    border-radius: 8px;
    padding: 24px;
    border-left: 4px solid;
    box-shadow: 0 2px 12px rgba(0,0,0,0.08);
    .stat-value { font-size: 36px; font-weight: bold; }
    .stat-label { font-size: 14px; color: #909399; margin-top: 8px; }
  }
  .pending-card { .pending-num { font-size: 32px; font-weight: bold; margin: 12px 0; } }
}
</style>

