#!/usr/bin/env python
# coding: utf-8

import json
import os
import pandas as pd

# 获取脚本所在目录
script_dir = os.path.dirname(os.path.abspath(__file__))

# 读取 nation.json 文件
json_path = os.path.join(script_dir, 'nation.json')
excel_output_path = os.path.join(script_dir, 'nation_results.xlsx')

try:
    with open(json_path, 'r', encoding='utf-8') as file:
        data = json.load(file)
    
    # 获取 NATION 数据
    nation_data = data.get('NATION', {})
    
    # 创建 Excel 文件写入器
    with pd.ExcelWriter(excel_output_path, engine='openpyxl') as writer:
        
        # 1. 资源数据处理
        if 'resource' in nation_data:
            resource_data = nation_data['resource']
            df_resource = pd.DataFrame()
            
            for resource_type, years_data in resource_data.items():
                # 将每种资源类型作为一行
                resource_series = pd.Series(years_data, name=resource_type)
                df_resource = pd.concat([df_resource, resource_series.to_frame().T])
            
            # 重置索引并添加资源类型列
            df_resource.reset_index(inplace=True)
            df_resource.rename(columns={'index': '资源类型'}, inplace=True)
            
            # 写入 Excel
            df_resource.to_excel(writer, sheet_name='资源上限', index=False)
            print("资源数据已写入")
        
        # 2. 电力结构数据处理
        if 'elc_mix' in nation_data:
            elc_mix_data = nation_data['elc_mix']
            df_elc_mix = pd.DataFrame()
            
            for tech_type, years_data in elc_mix_data.items():
                # 将每种技术类型作为一行
                tech_series = pd.Series(years_data, name=tech_type)
                df_elc_mix = pd.concat([df_elc_mix, tech_series.to_frame().T])
            
            # 重置索引并添加技术类型列
            df_elc_mix.reset_index(inplace=True)
            df_elc_mix.rename(columns={'index': '发电技术'}, inplace=True)
            
            # 写入 Excel
            df_elc_mix.to_excel(writer, sheet_name='发电结构', index=False)
            print("发电结构数据已写入")
            
        # 3. 电力装机数据处理
        if 'cap' in nation_data:
            cap_data = nation_data['cap']
            df_cap = pd.DataFrame()
            
            for tech_type, years_data in cap_data.items():
                tech_series = pd.Series(years_data, name=tech_type)
                df_cap = pd.concat([df_cap, tech_series.to_frame().T])
            
            df_cap.reset_index(inplace=True)
            df_cap.rename(columns={'index': '电力装机技术'}, inplace=True)
            
            df_cap.to_excel(writer, sheet_name='电力装机', index=False)
            print("电力装机数据已写入")
            
        # 4. 新增装机数据处理
        if 'newcap' in nation_data:
            newcap_data = nation_data['newcap']
            df_newcap = pd.DataFrame()
            
            for tech_type, years_data in newcap_data.items():
                tech_series = pd.Series(years_data, name=tech_type)
                df_newcap = pd.concat([df_newcap, tech_series.to_frame().T])
            
            df_newcap.reset_index(inplace=True)
            df_newcap.rename(columns={'index': '新增装机技术'}, inplace=True)
            
            df_newcap.to_excel(writer, sheet_name='新增装机', index=False)
            print("新增装机数据已写入")
            
        # 5. 一次能源数据处理
        if 'pe' in nation_data:
            pe_data = nation_data['pe']
            df_pe = pd.DataFrame()
            
            for energy_type, years_data in pe_data.items():
                energy_series = pd.Series(years_data, name=energy_type)
                df_pe = pd.concat([df_pe, energy_series.to_frame().T])
            
            df_pe.reset_index(inplace=True)
            df_pe.rename(columns={'index': '能源类型'}, inplace=True)
            
            df_pe.to_excel(writer, sheet_name='一次能源', index=False)
            print("一次能源数据已写入")
            
        # 6. 氢能数据处理
        if 'h2n' in nation_data:
            h2n_data = nation_data['h2n']
            df_h2n = pd.DataFrame()
            
            for h2_type, years_data in h2n_data.items():
                h2_series = pd.Series(years_data, name=h2_type)
                df_h2n = pd.concat([df_h2n, h2_series.to_frame().T])
            
            df_h2n.reset_index(inplace=True)
            df_h2n.rename(columns={'index': '氢能制备技术'}, inplace=True)
            
            df_h2n.to_excel(writer, sheet_name='氢能供应', index=False)
            print("氢能供应数据已写入")
            
        # 7. 投资数据处理
        if 'investment' in nation_data:
            inv_data = nation_data['investment']
            df_inv = pd.DataFrame()
            
            for inv_type, years_data in inv_data.items():
                inv_series = pd.Series(years_data, name=inv_type)
                df_inv = pd.concat([df_inv, inv_series.to_frame().T])
            
            df_inv.reset_index(inplace=True)
            df_inv.rename(columns={'index': '投资技术类型'}, inplace=True)
            
            df_inv.to_excel(writer, sheet_name='电力投资', index=False)
            print("电力投资数据已写入")

            
        # 9. 排放数据处理 (分成3个sheet)
        if 'emissions' in nation_data:
            emissions_data = nation_data['emissions']
            
            # 终端排放
            if 'FE' in emissions_data:
                fe_data = emissions_data['FE']
                df_fe = pd.DataFrame([fe_data])
                df_fe.index = ['终端排放量']
                
                # 转置DataFrame使年份为行，排放指标为列
                df_fe = df_fe.T.reset_index()
                df_fe.columns = ['年份', '终端排放量(亿吨)']
                
                df_fe.to_excel(writer, sheet_name='终端排放', index=False)
                print("终端排放数据已写入")
                
            # 供应排放
            if 'SUPPLY' in emissions_data:
                supply_data = emissions_data['SUPPLY']
                df_supply = pd.DataFrame([supply_data])
                df_supply.index = ['供应排放量']
                
                # 转置DataFrame
                df_supply = df_supply.T.reset_index()
                df_supply.columns = ['年份', '供应排放量(亿吨)']
                
                df_supply.to_excel(writer, sheet_name='供应排放', index=False)
                print("供应排放数据已写入")
                
            # 总排放
            if 'TOTAL' in emissions_data:
                total_data = emissions_data['TOTAL']
                df_total = pd.DataFrame([total_data])
                df_total.index = ['总排放量']
                
                # 转置DataFrame
                df_total = df_total.T.reset_index()
                df_total.columns = ['年份', '总排放量(亿吨)']
                
                df_total.to_excel(writer, sheet_name='总排放', index=False)
                print("总排放数据已写入")
    
    print(f"\n所有数据已成功写入 Excel 文件: {excel_output_path}")

except FileNotFoundError:
    print(f"错误：找不到 {json_path} 文件")
except json.JSONDecodeError:
    print(f"错误：{json_path} 文件不是有效的 JSON 格式")
except Exception as e:
    print(f"发生错误: {str(e)}")
