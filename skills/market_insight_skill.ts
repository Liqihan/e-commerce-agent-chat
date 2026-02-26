import { tool } from "@anthropic-ai/claude-agent-sdk";

export const marketInsightSkill = tool({
  name: "market_insight",
  description: "市场洞察工具，分析产品在市场中的定位和竞争情况",
  inputSchema: {
    type: "object",
    properties: {
      productName: {
        type: "string",
        description: "产品名称"
      },
      productCategory: {
        type: "string",
        description: "产品类别"
      },
      competitors: {
        type: "array",
        items: {
          type: "string"
        },
        description: "主要竞争对手"
      },
      marketRegion: {
        type: "string",
        description: "目标市场区域"
      }
    },
    required: ["productName", "productCategory", "competitors", "marketRegion"]
  },
  execute: async (input) => {
    const {
      productName,
      productCategory,
      competitors,
      marketRegion
    } = input;

    // 生成市场洞察报告
    const insight = {
      title: `${productName}市场洞察报告`,
      productInfo: {
        name: productName,
        category: productCategory,
        marketRegion
      },
      competitorAnalysis: competitors.map(competitor => ({
        name: competitor,
        strengths: generateCompetitorStrengths(competitor),
        weaknesses: generateCompetitorWeaknesses(competitor)
      })),
      marketTrends: generateMarketTrends(productCategory),
      opportunities: generateOpportunities(productCategory),
      threats: generateThreats(productCategory),
      recommendations: [
        "差异化定位",
        "加强品牌建设",
        "优化产品功能",
        "提升客户服务",
        "制定合理定价策略"
      ]
    };

    return {
      result: "市场洞察报告已生成",
      insight
    };
  }
});

function generateCompetitorStrengths(competitor: string): string[] {
  // 模拟生成竞争对手优势
  const strengths = [
    "品牌知名度高",
    "产品质量可靠",
    "价格具有竞争力",
    "渠道网络完善",
    "售后服务优秀"
  ];
  
  // 随机选择3个优势
  return strengths.sort(() => 0.5 - Math.random()).slice(0, 3);
}

function generateCompetitorWeaknesses(competitor: string): string[] {
  // 模拟生成竞争对手劣势
  const weaknesses = [
    "产品更新速度慢",
    "客户反馈响应不及时",
    "产品线不够丰富",
    "营销投入不足",
    "技术创新能力弱"
  ];
  
  // 随机选择2个劣势
  return weaknesses.sort(() => 0.5 - Math.random()).slice(0, 2);
}

function generateMarketTrends(category: string): string[] {
  const trendsMap: Record<string, string[]> = {
    "服装": [
      "可持续时尚成为趋势",
      "线上线下融合销售",
      "个性化定制需求增长"
    ],
    "电子产品": [
      "智能化程度不断提高",
      "续航能力成为关注焦点",
      "环保材料应用增加"
    ],
    "食品": [
      "健康有机食品需求上升",
      "方便速食产品受欢迎",
      "植物基产品市场扩大"
    ],
    "家居用品": [
      "智能家居产品普及",
      "多功能空间利用",
      "简约风格流行"
    ],
    "美妆": [
      "天然成分产品受欢迎",
      "个性化美妆方案",
      "男士美妆市场增长"
    ]
  };

  return trendsMap[category] || [
    "数字化转型加速",
    "消费者需求多样化",
    "线上购物比例增加"
  ];
}

function generateOpportunities(category: string): string[] {
  const opportunitiesMap: Record<string, string[]> = {
    "服装": [
      "开拓海外市场",
      "发展自有品牌",
      "与设计师合作推出联名系列"
    ],
    "电子产品": [
      "开发新兴市场",
      "加强与内容平台合作",
      "推出生态系统产品"
    ],
    "食品": [
      "开发功能性食品",
      "拓展电商渠道",
      "推出健康零食系列"
    ],
    "家居用品": [
      "发展智能家居生态",
      "提供个性化定制服务",
      "拓展线下体验店"
    ],
    "美妆": [
      "开发男士美妆产品线",
      "拓展国际市场",
      "推出可持续包装产品"
    ]
  };

  return opportunitiesMap[category] || [
    "利用数字化营销手段",
    "优化供应链管理",
    "加强客户关系管理"
  ];
}

function generateThreats(category: string): string[] {
  const threatsMap: Record<string, string[]> = {
    "服装": [
      "快时尚品牌竞争",
      "原材料价格波动",
      "消费者偏好变化快"
    ],
    "电子产品": [
      "技术更新迭代快",
      "市场竞争激烈",
      "知识产权保护挑战"
    ],
    "食品": [
      "食品安全监管严格",
      "原材料成本上涨",
      "消费者健康意识提高"
    ],
    "家居用品": [
      "房地产市场波动",
      "同质化产品竞争",
      "环保法规日益严格"
    ],
    "美妆": [
      "新品牌不断涌现",
      "监管要求提高",
      "消费者对成分要求严格"
    ]
  };

  return threatsMap[category] || [
    "市场竞争加剧",
    "经济环境不确定性",
    "政策法规变化"
  ];
}