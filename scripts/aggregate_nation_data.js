const fs = require('fs');
const path = require('path');

const jsonDir = path.join(__dirname, '../data/excel/json');
const outputFilePath = path.join(jsonDir, 'nation.json');

const filesToAggregate = [
  'resource.json',
  'elc_mix.json',
  'cap.json',
  'elc_trans.json',
  'emissions.json',
  'pe.json',
  'newcap.json',
  'h2n.json',
  'inv.json'  // 添加inv.json
];

const nationData = {};

function aggregateData(data) {
  const national = {};
  const provinces = Object.keys(data);

  for (const province of provinces) {
    const provinceData = data[province];
    for (const category in provinceData) {
      if (!national[category]) {
        national[category] = {};
      }
      const categoryData = provinceData[category];
      for (const year in categoryData) {
        if (!national[category][year]) {
          national[category][year] = 0;
        }
        const value = parseFloat(categoryData[year]);
        if (!isNaN(value)) {
          national[category][year] += value;
        }
      }
    }
  }
  return national;
}


function aggregateEmissionData(data) {
  const national = {};
  const provinces = Object.keys(data);

  for (const province of provinces) {
    const provinceData = data[province];
    for (const category in provinceData) {
      if (!national[category]) {
        national[category] = {};
      }
      const categoryData = provinceData[category];
      for (const year in categoryData) {
        if (!national[category][year]) {
          national[category][year] = 0;
        }
        const value = parseFloat(categoryData[year]);
        if (!isNaN(value)) {
          national[category][year] += value;
        }
      }
    }
  }
  return national;
}

filesToAggregate.forEach(file => {
  const filePath = path.join(jsonDir, file);
  if (fs.existsSync(filePath)) {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const jsonData = JSON.parse(fileContent);
    const dataKey = path.basename(file, '.json');

    if (dataKey === 'emissions') {
       nationData[dataKey] = aggregateEmissionData(jsonData);
    } else {
       nationData[dataKey] = aggregateData(jsonData);
    }
  } else {
    console.warn(`File not found: ${file}`);
  }
});

// 将所有数值保留一位小数
function roundToOneDecimal(obj) {
  for (const key in obj) {
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      roundToOneDecimal(obj[key]);
    } else if (typeof obj[key] === 'number') {
      obj[key] = parseFloat(obj[key].toFixed(1));
    }
  }
  return obj;
}

const finalData = roundToOneDecimal({ "NATION": nationData });
fs.writeFileSync(outputFilePath, JSON.stringify(finalData, null, 4));

console.log('National data aggregated and saved to nation.json'); 