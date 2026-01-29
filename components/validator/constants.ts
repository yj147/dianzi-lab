import type { Dimension } from './types'

// 9 个评估维度
export const DIMENSIONS: Dimension[] = [
  { key: 'targetUser', label: '目标用户', description: '痛点紧迫性、可验证性' },
  { key: 'channel', label: '渠道', description: '获客渠道清晰度' },
  { key: 'market', label: '市场', description: '规模、增长、竞争' },
  { key: 'tech', label: '技术', description: '可行性、复杂度' },
  { key: 'budget', label: '预算', description: '资源充足度' },
  {
    key: 'businessModel',
    label: '商业模式',
    description: '收入、定价、毛利',
  },
  { key: 'team', label: '团队', description: '执行力、经验' },
  { key: 'risk', label: '风险', description: '政策、合规、供应链' },
  { key: 'traffic', label: '流量', description: '需求信号、种子用户' },
]

// 滑块默认值
export const DEFAULT_SCORE = 0

// 滑块范围
export const MIN_SCORE = 0
export const MAX_SCORE = 10
