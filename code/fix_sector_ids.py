import json
import random
import os

# 创建部门参数字典
sector_para = {}

# 部门名称列表
sector_names = [
    "1农、林、牧、渔业",
    "2煤炭开采和洗选业",
    "3石油和天然气开采业",
    "4黑色金属矿采选业",
    "5有色金属矿采选业",
    "6非金属矿采选业",
    "7其他采矿业",
    "8农副食品加工业",
    "9食品制造业",
    "10酒.饮料和精制茶制造业",
    "11烟草制品业",
    "12纺织业",
    "13纺织服装.服饰业",
    "14皮革.毛皮.羽毛及其制品和制鞋业",
    "15木材加工和木.竹.藤.棕.草制品业",
    "16家具制造业",
    "17造纸和纸制品业",
    "18印刷和记录媒介复制业",
    "19文教.工美.体育和娱乐用品制造业",
    "20石油.煤炭及其他燃料加工业",
    "21化学原料和化学制品制造业",
    "22医药制造业",
    "23化学纤维制造业",
    "24橡胶和塑料制品业",
    "25非金属矿物制品业",
    "26黑色金属冶炼和压延加工业",
    "27有色金属冶炼和压延加工业",
    "28金属制品业",
    "29通用设备制造业",
    "30专用设备制造业",
    "31汽车制造业",
    "32铁路.船舶.航空航天和其他运输设备制造业",
    "33电气机械和器材制造业",
    "34计算机.通信和其他电子设备制造业",
    "35仪器仪表制造业",
    "36其他制造业",
    "37废弃资利用业",
    "38金属制品.机械和设备修理业",
    "39电力.热力生产和供应业",
    "40燃气生产和供应业",
    "41水的生产和供应业",
    "42建筑业",
    "43交通运输、仓储和邮政业",
    "44批发和零售业、住宿和餐饮业",
    "45其他行业",
    "46城镇居民",
    "47乡村居民"
]

# 为每个部门生成参数
for sector_name in sector_names:
    # 根据部门类型调整参数范围
    if "居民" in sector_name:
        # 居民部门使用"吨标煤/户"作为能源强度单位
        energy_intensity_unit = "吨标煤/户"
        energy_intensity_values = {
            "2025": round(random.uniform(0.8, 1.3), 2),
            "2030": round(random.uniform(0.7, 1.2), 2),
            "2035": round(random.uniform(0.6, 1.1), 2),
            "2040": round(random.uniform(0.5, 1.0), 2),
            "2045": round(random.uniform(0.4, 0.9), 2),
            "2050": round(random.uniform(0.3, 0.8), 2),
            "2055": round(random.uniform(0.25, 0.7), 2),
            "2060": round(random.uniform(0.2, 0.6), 2)
        }
        electrification_values = {
            "2025": round(random.uniform(30, 40), 1),
            "2030": round(random.uniform(35, 45), 1),
            "2035": round(random.uniform(40, 50), 1),
            "2040": round(random.uniform(45, 55), 1),
            "2045": round(random.uniform(50, 60), 1),
            "2050": round(random.uniform(55, 65), 1),
            "2055": round(random.uniform(60, 70), 1),
            "2060": round(random.uniform(65, 75), 1)
        }
        hydrogen_values = {
            "2025": round(random.uniform(0, 0.5), 1),
            "2030": round(random.uniform(0.5, 1), 1),
            "2035": round(random.uniform(1, 1.5), 1),
            "2040": round(random.uniform(1.5, 2), 1),
            "2045": round(random.uniform(2, 2.5), 1),
            "2050": round(random.uniform(2.5, 3), 1),
            "2055": round(random.uniform(3, 3.5), 1),
            "2060": round(random.uniform(3.5, 4), 1)
        }
    elif any(keyword in sector_name for keyword in ["农", "林", "牧", "渔"]):
        # 农林牧渔业
        energy_intensity_unit = "吨标煤/万元"
        energy_intensity_values = {
            "2025": round(random.uniform(0.3, 0.4), 2),
            "2030": round(random.uniform(0.25, 0.35), 2),
            "2035": round(random.uniform(0.22, 0.32), 2),
            "2040": round(random.uniform(0.2, 0.3), 2),
            "2045": round(random.uniform(0.18, 0.28), 2),
            "2050": round(random.uniform(0.15, 0.25), 2),
            "2055": round(random.uniform(0.13, 0.23), 2),
            "2060": round(random.uniform(0.1, 0.2), 2)
        }
        electrification_values = {
            "2025": round(random.uniform(25, 35), 1),
            "2030": round(random.uniform(30, 40), 1),
            "2035": round(random.uniform(35, 45), 1),
            "2040": round(random.uniform(40, 50), 1),
            "2045": round(random.uniform(45, 55), 1),
            "2050": round(random.uniform(50, 60), 1),
            "2055": round(random.uniform(55, 65), 1),
            "2060": round(random.uniform(60, 70), 1)
        }
        hydrogen_values = {
            "2025": round(random.uniform(0, 0.5), 1),
            "2030": round(random.uniform(0.5, 1.5), 1),
            "2035": round(random.uniform(1.5, 2.5), 1),
            "2040": round(random.uniform(2.5, 3.5), 1),
            "2045": round(random.uniform(3.5, 4.5), 1),
            "2050": round(random.uniform(4.5, 5.5), 1),
            "2055": round(random.uniform(5.5, 6.5), 1),
            "2060": round(random.uniform(6.5, 7.5), 1)
        }
    elif any(keyword in sector_name for keyword in ["煤炭", "石油", "天然气", "矿", "冶炼"]):
        # 采矿和冶炼行业
        energy_intensity_unit = "吨标煤/万元"
        energy_intensity_values = {
            "2025": round(random.uniform(0.6, 0.7), 2),
            "2030": round(random.uniform(0.55, 0.65), 2),
            "2035": round(random.uniform(0.5, 0.6), 2),
            "2040": round(random.uniform(0.45, 0.55), 2),
            "2045": round(random.uniform(0.4, 0.5), 2),
            "2050": round(random.uniform(0.35, 0.45), 2),
            "2055": round(random.uniform(0.3, 0.4), 2),
            "2060": round(random.uniform(0.25, 0.35), 2)
        }
        electrification_values = {
            "2025": round(random.uniform(20, 30), 1),
            "2030": round(random.uniform(25, 35), 1),
            "2035": round(random.uniform(30, 40), 1),
            "2040": round(random.uniform(35, 45), 1),
            "2045": round(random.uniform(40, 50), 1),
            "2050": round(random.uniform(45, 55), 1),
            "2055": round(random.uniform(50, 60), 1),
            "2060": round(random.uniform(55, 65), 1)
        }
        hydrogen_values = {
            "2025": round(random.uniform(0, 1), 1),
            "2030": round(random.uniform(1, 3), 1),
            "2035": round(random.uniform(3, 5), 1),
            "2040": round(random.uniform(5, 7), 1),
            "2045": round(random.uniform(7, 9), 1),
            "2050": round(random.uniform(9, 11), 1),
            "2055": round(random.uniform(11, 13), 1),
            "2060": round(random.uniform(13, 16), 1)
        }
    else:
        # 其他行业使用默认值
        energy_intensity_unit = "吨标煤/万元"
        energy_intensity_values = {
            "2025": round(random.uniform(0.3, 0.5), 2),
            "2030": round(random.uniform(0.28, 0.45), 2),
            "2035": round(random.uniform(0.26, 0.4), 2),
            "2040": round(random.uniform(0.24, 0.35), 2),
            "2045": round(random.uniform(0.22, 0.3), 2),
            "2050": round(random.uniform(0.2, 0.28), 2),
            "2055": round(random.uniform(0.18, 0.26), 2),
            "2060": round(random.uniform(0.16, 0.24), 2)
        }
        electrification_values = {
            "2025": round(random.uniform(25, 35), 1),
            "2030": round(random.uniform(30, 40), 1),
            "2035": round(random.uniform(35, 45), 1),
            "2040": round(random.uniform(40, 50), 1),
            "2045": round(random.uniform(45, 55), 1),
            "2050": round(random.uniform(50, 60), 1),
            "2055": round(random.uniform(55, 65), 1),
            "2060": round(random.uniform(60, 70), 1)
        }
        hydrogen_values = {
            "2025": round(random.uniform(0, 0.5), 1),
            "2030": round(random.uniform(0.5, 1.5), 1),
            "2035": round(random.uniform(1.5, 2.5), 1),
            "2040": round(random.uniform(2.5, 3.5), 1),
            "2045": round(random.uniform(3.5, 4.5), 1),
            "2050": round(random.uniform(4.5, 5.5), 1),
            "2055": round(random.uniform(5.5, 6.5), 1),
            "2060": round(random.uniform(6.5, 7.5), 1)
        }

    # 提取部门编号 - 只保留数字部分
    sector_id = ''.join(filter(str.isdigit, sector_name.split('、')[0].split('.')[0]))
    
    # 创建部门数据结构
    sector_para[f"sector{sector_id}-para"] = {
        "title": sector_name,
        "data": [
            {
                "indicator": "能源强度",
                "unit": energy_intensity_unit,
                "values": energy_intensity_values
            },
            {
                "indicator": "电气化率",
                "unit": "%",
                "values": electrification_values
            },
            {
                "indicator": "氢气化率",
                "unit": "%",
                "values": hydrogen_values
            }
        ]
    }

# 保存到JSON文件
output_file = "sector_para_fixed.json"
with open(output_file, 'w', encoding='utf-8') as f:
    json.dump(sector_para, f, ensure_ascii=False, indent=2)

print(f"已成功生成47个部门的参数数据并保存到 {output_file}") 