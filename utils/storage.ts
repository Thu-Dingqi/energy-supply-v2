// 新建 utils/storage.ts
// 用于保存和加载结果数据

export function saveResultData(scenario: string, province: string, nodeId: string, data: any) {
  try {
    const key = `result_${scenario}_${province}_${nodeId}`;
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error("保存结果数据失败", error);
    return false;
  }
}

export function loadResultData(scenario: string, province: string, nodeId: string) {
  try {
    const key = `result_${scenario}_${province}_${nodeId}`;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("加载结果数据失败", error);
    return null;
  }
}

// 可以扩展为支持导出/导入JSON文件，或连接到后端API
