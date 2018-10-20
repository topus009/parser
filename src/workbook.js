const _ = require('lodash');
const Excel = require('exceljs');

const workbook = new Excel.Workbook();
const date = new Date().toLocaleString().slice(0, 10);
const title = `Отчет по кэшбэкам (${date})`;

const range = r => _.range(1, r, 1);

function addHeader(sheet, title, colsCount) {
    _.each(range(colsCount + 2), index => {
        if(index === 1) sheet.getColumn(index).width = 30;
        else sheet.getColumn(index).width = 18;
    });
    mergeCells(sheet, [
        ['A1', 'F1'],
    ]);
    const A1 = sheet.getCell('A1');
    A1.value = title;
    A1.alignment = {horizontal: 'center', vertical: 'middle'};
    sheet.getRow(1).height = 30;
    sheet.getRow(1).eachCell(cell => {
        cell.font = {
            ...cell.font,
            bold: true
        };
    });
    sheet.addRow(['']);
}

function addTableHeader(sheet, lists) {
    const sites = _.map(lists, 'fileName');
    sheet.addRow(['', ...sites]);
    const currentRow = sheet.getRow(sheet.rowCount);

    currentRow.alignment = {horizontal: 'center', vertical: 'middle'};
    currentRow.height = 30;
    currentRow.eachCell(cell => {
        cell.font = {
            ...cell.font,
            bold: true
        };
    });
}

function addTable(sheet, data, maxValueIndexes) {
    const firstRow = sheet.lastRow.number + 1;
    firstRow.height = 50;
    _.each(data, shop => {
        const {title, value} = shop;
        sheet.addRow([title, ...value]);
    });
    // const lastRow = firstRow + maxValueIndexes.length - 1;
    const lastRow = sheet.lastRow.number;

    sheet.eachRow({includeEmpty: true}, (row, rowNumber) => {
        if(rowNumber >= firstRow && rowNumber <= lastRow) {
            row.eachCell((cell, colIndex) => {
                // cell.font = {
                //     ...cell.font,
                //     color: {argb: '008009'}
                // };
                if(colIndex > 1) {
                    const target = maxValueIndexes[rowNumber];
                    if(_.isNumber(target) && colIndex === target) {
                        cell.font = {color: {argb: '008009'}};
                    } else {
                        cell.font = {color: {argb: 'ff0000'}};
                    }
                }
            });
        }
    });

    // if(maxValueIndexes[shopIndex]) {
    //     cell.font = {color: {argb: '#008009'}};
    // } else {
    //     cell.font = {color: {argb: '#ff0000'}};
    // }
}

const buildReport = (data, lists, maxValueIndexes) => {
    const sheet = workbook.addWorksheet('Отчет');
    const colsCount = lists.length;
    addHeader(sheet, title, colsCount);
    addTableHeader(sheet, lists);
    addTable(sheet, data, maxValueIndexes);
    workbook.xlsx.writeFile(`${title}.xlsx`);
}
//================== heplers =================
function mergeCells(sheet, cellsRangeMap) {
    _.each(cellsRangeMap, range => {
        sheet.mergeCells(range[0], range[1]);
    });
}

function fillCelsBG(sheet, cells, colors) {
    const baseFillOptions = {
        type: 'pattern',
        pattern: 'solid'
    };
    eachCell(sheet, cells, (cell, cellIndex) => {
        const color = colors[cellIndex];
        cell.fill = {
            ...baseFillOptions,
            fgColor: {argb: color}
        };
    });
}

function setCellBorder(sheet, cells, style, sides) {
    const obj = {};
    _.each(sides, side => {
        obj[side] = {style};
    });
    eachCell(sheet, cells, cell => {
        cell.border = obj;
    });
}

function eachCell(sheet, cells, impl) {
    if(_.isObject(cells)) {
        impl(cells);
    }
    if(_.isString(cells)) {
        impl(sheet.getCell(cells));
    }
    if(_.isArray(cells)) {
        _.each(cells, cell => {
            if(_.isObject(cell)) {
                impl(cell);
            }
            if(_.isString(cell)) {
                impl(sheet.getCell(cell));
            }
        });
    }
}

module.exports = buildReport;
