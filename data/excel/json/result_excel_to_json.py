#!/usr/bin/env python
# coding: utf-8

# 导入必要的库
import pandas as pd
import json
import os

# 获取脚本所在目录的绝对路径
script_dir = os.path.dirname(os.path.abspath(__file__))

# 定义 Excel 文件的完整路径
excel_file_path = os.path.join(script_dir, '30PE_Results_ALL.xlsx')

print(f"查找Excel文件: {excel_file_path}")

# 读取一次能源数据
try:
    # 读取Excel文件
    pe_df = pd.read_excel(excel_file_path, sheet_name='PE')
    
    # 创建数据结构
    pe_data = {}
    
    # 遍历DataFrame处理数据
    for _, row in pe_df.iterrows():
        province = row['Province']
        year = str(int(row['Year']))
        
        # 确保省份存在于数据结构中
        if province not in pe_data:
            pe_data[province] = {
                'Coal': {}, 'Coal CCS': {}, 'Oil': {}, 'Oil CCS': {},
                'Gas': {}, 'Gas CCS': {}, 'Nuclear': {}, 'Hydro': {},
                'Biomass': {}, 'Biomass CCS': {}, 'Wind': {}, 'PV': {}
            }
        
        # 添加各种能源数据
        for fuel_type in ['Coal', 'Coal CCS', 'Oil', 'Oil CCS', 'Gas', 'Gas CCS', 
                          'Nuclear', 'Hydro', 'Biomass', 'Biomass CCS', 'Wind', 'PV']:
            if not pd.isna(row[fuel_type]):
                pe_data[province][fuel_type][year] = round(float(row[fuel_type]), 1)
    
    # 将数据保存到当前目录下的pe.json文件
    output_path = os.path.join(script_dir, 'pe.json')
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(pe_data, f, ensure_ascii=False, indent=4)
    
    print(f"\n一次能源数据已成功保存到 {output_path}")
    
except FileNotFoundError:
    print(f"未找到文件 '{excel_file_path}'，请确保文件存在。")
except Exception as e:
    print(f"处理一次能源数据时发生错误: {e}")


# 保存发电量
try:
    # 读取Excel文件中的Generation sheet
    elec_pro_tech_sheets = pd.read_excel(excel_file_path, sheet_name='Generation')
    
    print(f"\n读取 {excel_file_path} 文件中的 Generation sheet内容:")
    
    # 设置显示选项，确保不省略任何内容
    with pd.option_context('display.max_rows', None, 'display.max_columns', None, 'display.width', None):
        print(elec_pro_tech_sheets)
    
    # 创建数据结构来存储发电结构数据
    elc_mix_data = {}
    
    # 处理Generation sheet中的数据
    sheet_data = elec_pro_tech_sheets
    current_year = None
    
    for _, row in sheet_data.iterrows():
        # 获取年份和省份
        if not pd.isna(row['Unnamed: 0']):
            current_year = str(int(row['Unnamed: 0']))
        
        province = row['Unnamed: 1']
        
        # 确保省份存在于数据结构中
        if province not in elc_mix_data:
            elc_mix_data[province] = {
                'coal': {}, 'coal ccs': {}, 'oil': {}, 'gas': {}, 'gas ccs': {},
                'nuclear': {}, 'hydro': {}, 'biomass': {}, 'biomass ccs': {}, 
                'co-firing beccs': {}, 'wind': {}, 'pv': {}
            }
        
        # 添加各种发电技术数据
        for tech in ['coal', 'coal ccs', 'oil', 'gas', 'gas ccs', 'nuclear', 'hydro', 
                     'biomass', 'biomass ccs', 'co-firing beccs', 'wind', 'pv']:
            if not pd.isna(row[tech]):
                elc_mix_data[province][tech][current_year] = round(float(row[tech]), 1)
    
    # 将数据保存到当前目录的 elc_mix.json 文件
    output_path = os.path.join(script_dir, 'elc_mix.json')
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(elc_mix_data, f, ensure_ascii=False, indent=4)
    
    print(f"\n发电结构数据已成功保存到 {output_path}")
    
except FileNotFoundError:
    print(f"未找到文件 '{excel_file_path}'，请确保文件存在。")
except Exception as e:
    print(f"处理发电结构数据时发生错误: {e}")


# 电力装机量
try:
    # 读取Excel文件的Capacity表格
    cap_df = pd.read_excel(excel_file_path, sheet_name='Capacity')
    
    # 创建数据结构
    cap_data = {}
    
    # 遍历DataFrame处理数据
    current_year = None
    
    for _, row in cap_df.iterrows():
        # 获取年份和省份
        if not pd.isna(row['Unnamed: 0']):
            current_year = str(int(row['Unnamed: 0']))
        
        province = row['Unnamed: 1']
        
        # 确保省份存在于数据结构中
        if province not in cap_data:
            cap_data[province] = {
                'coal': {}, 'coal ccs': {}, 'oil': {}, 'gas': {}, 'gas ccs': {},
                'nuclear': {}, 'hydro': {}, 'biomass': {}, 'biomass ccs': {}, 
                'co-firing beccs': {}, 'wind': {}, 'pv': {}
            }
        
        # 添加各种电力技术数据
        for tech in ['coal', 'coal ccs', 'oil', 'gas', 'gas ccs', 'nuclear', 'hydro', 
                     'biomass', 'biomass ccs', 'co-firing beccs', 'wind', 'pv']:
            if not pd.isna(row[tech]):
                cap_data[province][tech][current_year] = round(float(row[tech]), 2)
    
    # 将数据保存到当前目录的 cap.json 文件
    output_path = os.path.join(script_dir, 'cap.json')
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(cap_data, f, ensure_ascii=False, indent=4)
    
    print(f"\n电力总装机数据已成功保存到 {output_path}")
    
except FileNotFoundError:
    print(f"未找到文件 '{excel_file_path}'，请确保文件存在。")
except Exception as e:
    print(f"处理电力总装机数据时发生错误: {e}")


# 新增装机量
try:
    # 读取Excel文件的"CAP_new" sheet
    capnew_df = pd.read_excel(excel_file_path, sheet_name='CAP_new')
    
    # 创建数据结构
    capnew_data = {}
    
    # 遍历DataFrame处理数据
    current_year = None
    
    for _, row in capnew_df.iterrows():
        # 获取年份和省份
        if not pd.isna(row['Unnamed: 0']):
            current_year = str(int(row['Unnamed: 0']))
        
        province = row['Unnamed: 1']
        
        # 确保省份存在于数据结构中
        if province not in capnew_data:
            capnew_data[province] = {
                'coal': {}, 'coal ccs': {}, 'oil': {}, 'gas': {}, 'gas ccs': {},
                'nuclear': {}, 'hydro': {}, 'biomass': {}, 'biomass ccs': {}, 
                'co-firing beccs': {}, 'wind': {}, 'pv': {}
            }
        
        # 添加各种电力技术数据
        for tech in ['coal', 'coal ccs', 'oil', 'gas', 'gas ccs', 'nuclear', 'hydro', 
                     'biomass', 'biomass ccs', 'co-firing beccs', 'wind', 'pv']:
            if not pd.isna(row[tech]):
                capnew_data[province][tech][current_year] = round(float(row[tech]), 2)
    
    # 将数据保存到当前目录的 newcap.json 文件
    output_path = os.path.join(script_dir, 'newcap.json')
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(capnew_data, f, ensure_ascii=False, indent=4)
    
    print(f"\n电力新增装机数据已成功保存到 {output_path}")
    
except FileNotFoundError:
    print(f"未找到文件 '{excel_file_path}'，请确保文件存在。")
except Exception as e:
    print(f"处理电力新增装机数据时发生错误: {e}")


# 氢能制备
try:
    # 读取氢能制备技术数据
    h2n_pro_tech_df = pd.read_excel(excel_file_path, sheet_name="H2N")
    
    # 打印整个表格
    print("氢能制备技术数据:")
    print(h2n_pro_tech_df.to_string())
    
    # 打印表格的基本信息
    print("\n表格信息:")
    print(f"行数: {h2n_pro_tech_df.shape[0]}")
    print(f"列数: {h2n_pro_tech_df.shape[1]}")
    print("\n列名:")
    print(h2n_pro_tech_df.columns.tolist())
    
    # 创建氢能制备数据的JSON结构
    h2n_data = {}
    
    # 初始化省份列表
    provinces = []
    for i in range(1, 270):
        if not pd.isna(h2n_pro_tech_df.iloc[i, 1]):  # 'Unnamed: 1'列不为空
            province = h2n_pro_tech_df.iloc[i, 1]
            if province not in provinces:
                provinces.append(province)
                h2n_data[province] = {
                    "ELC": {},      # 电解水制氢
                    "solar": {},    # 太阳能制氢
                    "onshore": {},  # 陆上风电制氢
                    "offshore": {}  # 海上风电制氢
                }
    
    # 年份列表
    years = []
    for i in range(0, 270, 30):
        if not pd.isna(h2n_pro_tech_df.iloc[i, 0]):  # 'Unnamed: 0'列不为空
            year = int(h2n_pro_tech_df.iloc[i, 0])
            years.append(year)
    
    # 填充数据
    for year_idx, year in enumerate(years):
        start_row = year_idx * 30
        for i in range(30):
            if start_row + i >= len(h2n_pro_tech_df):
                break
            
            row = h2n_pro_tech_df.iloc[start_row + i]
            if not pd.isna(row['Unnamed: 1']):  # 确保省份不为空
                province = row['Unnamed: 1']
                year_str = str(year)
                
                # 直接读取各列的值
                elc_value = row['ELC']
                solar_value = row['solar']
                onshore_value = row['onshore']
                offshore_value = row['offshore']
                
                # 添加到对应省份的数据结构中，保留一位小数
                if not pd.isna(elc_value):
                    h2n_data[province]["ELC"][year_str] = round(float(elc_value), 2)
                if not pd.isna(solar_value):
                    h2n_data[province]["solar"][year_str] = round(float(solar_value), 2)
                if not pd.isna(onshore_value):
                    h2n_data[province]["onshore"][year_str] = round(float(onshore_value), 2)
                if not pd.isna(offshore_value):
                    h2n_data[province]["offshore"][year_str] = round(float(offshore_value), 2)
    
    # 将数据保存到当前目录的 h2n.json 文件
    output_path = os.path.join(script_dir, 'h2n.json')
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(h2n_data, f, ensure_ascii=False, indent=4)
    
    print(f"\n氢能制备数据已成功保存到 {output_path}")
    
except FileNotFoundError:
    print(f"未找到文件 '{excel_file_path}'，请确保文件在当前目录下。")
except Exception as e:
    print(f"处理氢能制备技术数据时发生错误: {e}")


# 电力投资
try:
    # 读取Excel文件的Investment sheet
    inv_df = pd.read_excel(excel_file_path, sheet_name='Investment')
    
    # 创建数据结构
    inv_data = {}
    
    # 遍历DataFrame处理数据
    current_year = None
    
    for _, row in inv_df.iterrows():
        # 获取年份和省份
        if not pd.isna(row['Unnamed: 0']):
            current_year = str(int(row['Unnamed: 0']))
        
        province = row['Unnamed: 1']
        
        # 确保省份存在于数据结构中
        if province not in inv_data:
            inv_data[province] = {
                'fossil': {}, 'fossil ccs': {}, 'nuclear': {}, 'hydro': {}, 
                'biomass': {}, 'biomass ccs': {}, 'wind': {}, 'pv': {}
            }
        
        # 添加各种电力技术数据
        for tech in ['fossil', 'fossil ccs', 'nuclear', 'hydro', 
                     'biomass', 'biomass ccs', 'wind', 'pv']:
            if not pd.isna(row[tech]):
                inv_data[province][tech][current_year] = round(float(row[tech]), 3)
    
    # 将数据保存到当前目录的 inv.json 文件
    output_path = os.path.join(script_dir, 'inv.json')
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(inv_data, f, ensure_ascii=False, indent=4)
    
    print(f"\n电力投资数据已成功保存到 {output_path}")
    
except FileNotFoundError:
    print(f"未找到文件 '{excel_file_path}'，请确保文件在当前目录下。")
except Exception as e:
    print(f"处理电力投资数据时发生错误: {e}")


# 排放
try:
    # 定义输出 JSON 文件路径
    output_json_file = os.path.join(script_dir, "emissions.json")

    # 对应表格和 JSON 中的键
    sheet_map = {
        'FinalEmission': 'FE',
        'SupplyEmission': 'SUPPLY',
        'TotalEmission': 'TOTAL'
    }

    # 要保留的年份：从 2025 到 2060，每 5 年一个
    years_to_keep = list(range(2025, 2061, 5))

    # 载入每个表格到 pandas DataFrame
    df_fe = pd.read_excel(excel_file_path, sheet_name='FinalEmission', index_col=0)
    df_supply = pd.read_excel(excel_file_path, sheet_name='SupplyEmission', index_col=0)
    df_total = pd.read_excel(excel_file_path, sheet_name='TotalEmission', index_col=0)

    # 创建字典以方便访问 DataFrame
    dataframes = {
        'FE': df_fe,
        'SUPPLY': df_supply,
        'TOTAL': df_total
    }

    # 获取所有省份列表（取三个表格共有的列）
    provinces = list(set(df_fe.columns) & set(df_supply.columns) & set(df_total.columns))
    provinces.sort()  # 按字母顺序排序

    # 构建 JSON 数据结构
    final_data = {}

    for province in provinces:
        final_data[province] = {}
        for key, df in dataframes.items():
            # 按照指定年份过滤，选择省份列，并四舍五入到 3 位小数
            province_year_data = df.loc[years_to_keep, province].round(3).to_dict()
            # 转为 float 并保留 3 位小数
            province_year_data = {str(year): float(f"{value:.3f}") if pd.notnull(value) else None 
                                for year, value in province_year_data.items()}
            final_data[province][key] = province_year_data

    # 写入 JSON 文件
    with open(output_json_file, 'w', encoding='utf-8') as f:
        json.dump(final_data, f, ensure_ascii=False, indent=4)

    print(f"\n排放数据已成功保存到 {output_json_file}")

    # 输出一个样本以验证结构
    print("\n--- 'ANHU' 省的数据样本 ---")
    print(json.dumps({'ANHU': final_data.get('ANHU', {})}, indent=4, ensure_ascii=False))
    
except FileNotFoundError:
    print(f"未找到文件 '{excel_file_path}'。请确保文件存在。")
except Exception as e:
    print(f"处理排放数据时发生错误: {e}")


# 电力传输
try:
    # 输出 JSON 路径
    json_path = os.path.join(script_dir, 'elc_matrix.json')
    
    # 需要保存的年份
    years = ['2020', '2030', '2040', '2050', '2060']
    # 每个年份的起始行号
    year_start_rows = {
        '2020': 0,
        '2030': 33,
        '2040': 66,
        '2050': 99,
        '2060': 132
    }
    # 每个年份的省份名在第几行
    province_row_offset = 0  # 省份名在起始行
    data_row_start_offset = 1  # 数据从起始行+1开始
    n_province = 30  # 省份数量

    # 读取数据
    df = pd.read_excel(excel_file_path, sheet_name='TransElc', header=None)
    
    elc_matrix = {}

    for year in years:
        start_row = year_start_rows[year]
        # 省份名
        provinces = df.iloc[start_row + province_row_offset, 1:1 + n_province].tolist()
        # 去除空值和nan
        provinces = [str(p).strip() for p in provinces if pd.notna(p)]
        # 读取矩阵数据
        matrix = df.iloc[start_row + data_row_start_offset : start_row + data_row_start_offset + n_province, 0:1 + n_province]
        matrix = matrix.reset_index(drop=True)
        # 行省份
        row_provinces = matrix.iloc[:,0].tolist()
        row_provinces = [str(p).strip() for p in row_provinces if pd.notna(p)]
        # 只保留有效的行
        matrix = matrix.iloc[:len(provinces), 1:1 + len(provinces)]
        # 构建嵌套字典
        elc_matrix[year] = {}
        for i, from_prov in enumerate(provinces):
            elc_matrix[year][from_prov] = {}
            for j, to_prov in enumerate(provinces):
                val = matrix.iloc[i, j]
                # 处理无效值
                if isinstance(val, str) and ('#' in val or val.strip() == ''):
                    elc_matrix[year][from_prov][to_prov] = 0
                elif pd.isna(val):
                    elc_matrix[year][from_prov][to_prov] = 0
                else:
                    try:
                        # 保留3位小数
                        elc_matrix[year][from_prov][to_prov] = round(float(val), 3)
                    except:
                        elc_matrix[year][from_prov][to_prov] = 0

    # 保存为json
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(elc_matrix, f, ensure_ascii=False, indent=4)
    print(f"\n电力传输矩阵已保存到 {json_path}")

except FileNotFoundError:
    print(f"未找到文件 '{excel_file_path}'，请确保文件路径正确。")
except Exception as e:
    print(f"读取电网矩阵时发生错误: {e}")


# 煤、油、气的开采量
try:
    # 输出 JSON 文件路径
    json_file_path = os.path.join(script_dir, '2020_pe_fossil.json')
    
    # 读取文件中的"Mine_ImExport"sheet
    extraction_data = pd.read_excel(excel_file_path, sheet_name='Mine_ImExport')
    
    # 创建用于存储数据的字典
    fossil_data = {}
    
    # 遍历数据框中的每一行
    for index, row in extraction_data.iterrows():
        province = row['Unnamed: 0']
        
        # 为每个省份创建数据结构
        fossil_data[province] = {
            "coal": {
                "extraction": round(float(row['coal-extract']), 1),
                "import": round(float(row['coal-in']), 1),
                "export": round(float(row['coal-out']), 1)
            },
            "oil": {
                "extraction": round(float(row['oil-extract']), 1),
                "import": round(float(row['oil-in']), 1),
                "export": round(float(row['oil-out']), 1)
            },
            "gas": {
                "extraction": round(float(row['gas-extract']), 1),
                "import": round(float(row['gas-in']), 1),
                "export": round(float(row['gas-out']), 1)
            }
        }
    
    # 将数据保存为json文件
    with open(json_file_path, 'w', encoding='utf-8') as f:
        json.dump(fossil_data, f, ensure_ascii=False, indent=4)
    
    print(f"\n煤、油、气开采-调入-调出数据已成功保存到 {json_file_path}")
    
except FileNotFoundError:
    print(f"未找到文件 '{excel_file_path}'，请确保文件在当前目录下。")
except Exception as e:
    print(f"处理煤、油、气开采量数据时发生错误: {e}")

# 读取资源潜力数据
try:
    # 输出 JSON 文件路径
    json_file_path = os.path.join(script_dir, 'resource.json')
    
    # 读取文件中的"Resource"sheet
    resource_data_df = pd.read_excel(excel_file_path, sheet_name="Resource")
    
    # 创建用于存储数据的字典
    resource_data = {}
    
    # 遍历数据框中的每一行
    for index, row in resource_data_df.iterrows():
        # 跳过最后两行说明文字
        if pd.isna(row['Unnamed: 0']) or index > 29:
            continue
            
        province_code = row['Unnamed: 0']  # 省份代码
        
        # 创建省份数据结构
        resource_data[province_code] = {
            "coal": {
                "2025": round(float(row['coal']) / 1000, 2),
                "2030": round(float(row['coal']) / 1000, 2),
                "2035": round(float(row['coal']) / 1000, 2),
                "2040": round(float(row['coal']) / 1000, 2),
                "2045": round(float(row['coal']) / 1000, 2),
                "2050": round(float(row['coal']) / 1000, 2),
                "2055": round(float(row['coal']) / 1000, 2),
                "2060": round(float(row['coal']) / 1000, 2)
            },
            "oil": {
                "2025": round(float(row['oil']), 2),
                "2030": round(float(row['oil']), 2),
                "2035": round(float(row['oil']), 2),
                "2040": round(float(row['oil']), 2),
                "2045": round(float(row['oil']), 2),
                "2050": round(float(row['oil']), 2),
                "2055": round(float(row['oil']), 2),
                "2060": round(float(row['oil']), 2)
            },
            "gas": {
                "2025": round(float(row['gas']), 2),
                "2030": round(float(row['gas']), 2),
                "2035": round(float(row['gas']), 2),
                "2040": round(float(row['gas']), 2),
                "2045": round(float(row['gas']), 2),
                "2050": round(float(row['gas']), 2),
                "2055": round(float(row['gas']), 2),
                "2060": round(float(row['gas']), 2)
            },
            "nuclear": {
                "2025": round(float(row['nuclear']), 2),
                "2030": round(float(row['nuclear']), 2),
                "2035": round(float(row['nuclear']), 2),
                "2040": round(float(row['nuclear']), 2),
                "2045": round(float(row['nuclear']), 2),
                "2050": round(float(row['nuclear']), 2),
                "2055": round(float(row['nuclear']), 2),
                "2060": round(float(row['nuclear']), 2)
            },
            "biomass": {
                "2025": round(float(row['biomass']), 2),
                "2030": round(float(row['biomass']), 2),
                "2035": round(float(row['biomass']), 2),
                "2040": round(float(row['biomass']), 2),
                "2045": round(float(row['biomass']), 2),
                "2050": round(float(row['biomass']), 2),
                "2055": round(float(row['biomass']), 2),
                "2060": round(float(row['biomass']), 2)
            },
            "hydro": {
                "2025": round(float(row['hydro']), 2),
                "2030": round(float(row['hydro']), 2),
                "2035": round(float(row['hydro']), 2),
                "2040": round(float(row['hydro']), 2),
                "2045": round(float(row['hydro']), 2),
                "2050": round(float(row['hydro']), 2),
                "2055": round(float(row['hydro']), 2),
                "2060": round(float(row['hydro']), 2)
            },
            "wind": {
                "2025": round(float(row['onwind']) + float(row['offwind']), 2),
                "2030": round(float(row['onwind']) + float(row['offwind']), 2),
                "2035": round(float(row['onwind']) + float(row['offwind']), 2),
                "2040": round(float(row['onwind']) + float(row['offwind']), 2),
                "2045": round(float(row['onwind']) + float(row['offwind']), 2),
                "2050": round(float(row['onwind']) + float(row['offwind']), 2),
                "2055": round(float(row['onwind']) + float(row['offwind']), 2),
                "2060": round(float(row['onwind']) + float(row['offwind']), 2)
            },
            "solar": {
                "2025": round(float(row['pv']), 2),
                "2030": round(float(row['pv']), 2),
                "2035": round(float(row['pv']), 2),
                "2040": round(float(row['pv']), 2),
                "2045": round(float(row['pv']), 2),
                "2050": round(float(row['pv']), 2),
                "2055": round(float(row['pv']), 2),
                "2060": round(float(row['pv']), 2)
            }
        }
    
    # 将数据保存为json文件
    with open(json_file_path, 'w', encoding='utf-8') as f:
        json.dump(resource_data, f, ensure_ascii=False, indent=4)
    
    print(f"\n资源潜力数据已成功保存到 {json_file_path}")
    
except FileNotFoundError:
    print(f"未找到文件 '{excel_file_path}'，请确保文件在当前目录下。")
except Exception as e:
    print(f"处理资源潜力数据时发生错误: {e}")
