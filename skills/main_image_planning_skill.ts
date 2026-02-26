import { tool } from "@anthropic-ai/claude-agent-sdk";

export const mainImagePlanningSkill = tool({
  name: "main_image_planning",
  description: "电商主图策划工具，根据产品信息生成主图策划方案",
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
      mainFeatures: {
        type: "array",
        items: {
          type: "string"
        },
        description: "产品主要特点"
      },
      targetAudience: {
        type: "string",
        description: "目标受众"
      },
      stylePreference: {
        type: "string",
        description: "风格偏好"
      }
    },
    required: ["productName", "productCategory", "mainFeatures", "targetAudience", "stylePreference"]
  },
  execute: async (input) => {
    const {
      productName,
      productCategory,
      mainFeatures,
      targetAudience,
      stylePreference
    } = input;

    // 生成主图策划方案
    const plan = {
      title: `${productName}主图策划方案`,
      productInfo: {
        name: productName,
        category: productCategory,
        features: mainFeatures,
        targetAudience
      },
      styleGuidelines: {
        mainStyle: stylePreference,
        colorScheme: generateColorScheme(stylePreference),
        composition: generateComposition(productCategory),
        textPlacement: generateTextPlacement(productCategory)
      },
      shotIdeas: generateShotIdeas(productCategory, mainFeatures),
      tips: [
        "突出产品核心卖点",
        "使用高质量图片",
        "考虑移动端展示效果",
        "添加适当的文字说明",
        "保持简洁明了"
      ]
    };

    return {
      result: "主图策划方案已生成",
      plan
    };
  }
});

function generateColorScheme(style: string): string[] {
  const schemes: Record<string, string[]> = {
    "简约现代": ["#FFFFFF", "#F5F5F5", "#333333"],
    "活力青春": ["#FF6B6B", "#4ECDC4", "#45B7D1"],
    "高端奢华": ["#D4AF37", "#2F2F2F", "#FFFFFF"],
    "自然清新": ["#88D8B0", "#FFEAA7", "#FF7675"],
    "科技感": ["#00C6FF", "#0072FF", "#1A237E"]
  };

  return schemes[style] || ["#FFFFFF", "#333333", "#666666"];
}

function generateComposition(category: string): string {
  const compositions: Record<string, string> = {
    "服装": "模特展示 + 细节特写",
    "电子产品": "产品正面 + 功能展示",
    "食品": "成品展示 + 食材特写",
    "家居用品": "场景展示 + 产品细节",
    "美妆": "产品集合 + 效果展示"
  };

  return compositions[category] || "产品主体 + 相关元素";
}

function generateTextPlacement(category: string): string {
  const placements: Record<string, string> = {
    "服装": "顶部或底部",
    "电子产品": "侧面或底部",
    "食品": "顶部或右下角",
    "家居用品": "顶部或左侧",
    "美妆": "底部或右侧"
  };

  return placements[category] || "底部居中";
}

function generateShotIdeas(category: string, features: string[]): string[] {
  const baseIdeas: string[] = [
    "产品整体展示",
    "核心功能特写",
    "使用场景展示"
  ];

  // 根据产品特点添加特定的拍摄创意
  if (features.includes("防水")) {
    baseIdeas.push("防水测试场景");
  }
  if (features.includes("轻便")) {
    baseIdeas.push("便携性展示");
  }
  if (features.includes("耐用")) {
    baseIdeas.push("耐用性测试");
  }

  return baseIdeas;
}