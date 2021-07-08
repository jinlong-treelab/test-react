// 使用 importScripts 导入 js 文件

importScripts("./shim.min.js");
importScripts("./treelab.shim.js");
importScripts("./cpexcel.js");
importScripts("./jszip.js");
importScripts("./xlsx.js");

// postMessage({ initState: true });

function renderFile(evt) {
  let wb = XLSX.read(evt.data.d, { type: evt.data.b });
  return wb;
}

function getSheetRows(arr) {
  if (!Array.isArray(arr) || arr.length === 0) {
    return 0;
  }
  return arr.filter((row) => {
    return row.some((cell) => new String(cell).trim().length > 0);
  }).length;
}

function getSheetColumns(arr) {
  let columns = 0;
  arr.forEach((row) => {
    if (row.length > columns) {
      columns = row.length;
    }
  });
  let emptyColumns = 0;
  for (let j = 0; j < columns; j += 1) {
    let isEmptyColumn = true;
    for (let i = 0, rows = arr.length; i < rows && isEmptyColumn; i += 1) {
      let cell = arr[i][j];
      if (typeof cell === "string") {
        if (cell.trim().length > 0) {
          isEmptyColumn = false;
        }
      } else if (typeof cell === "number") {
        isEmptyColumn = false;
      }
    }
    if (isEmptyColumn) {
      emptyColumns += 1;
    }
  }
  return columns - emptyColumns;
}

function getSheetRowsAndColumns(wb) {
  const sheetsArr = Object.values(wb.Sheets);

  const resultList = sheetsArr.map((sheet) => {
    if (!sheet["!ref"]) {
      return { rows: 0, columns: 0 };
    }

    const sheetList = XLSX.utils.sheet_to_json(sheet, {
      header: 1,
      raw: false,
    });

    const rows = getSheetRows(sheetList);
    const columns = getSheetColumns(sheetList);
    return {
      rows,
      columns,
    };
  });
  return resultList;
}

onmessage = function (evt) {
  var v;
  try {
    const wb = renderFile(evt);
    const resultList = getSheetRowsAndColumns(wb);
    postMessage({ t: "xlsx", d: resultList });
  } catch (e) {
    postMessage({ t: "e", d: e.stack || e });
  }
};
