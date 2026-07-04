import fs from 'fs';
import { OFFICIAL_HOLIDAYS } from './constants/holidays';
import { SALARY_DATES } from './constants/salaryDates';

let holidaysCsv = 'Year,Month,Day,Name\n';
OFFICIAL_HOLIDAYS.forEach(h => {
    holidaysCsv += `${h.year},${h.month},${h.day},${h.name}\n`;
});
fs.writeFileSync('holidays.csv', holidaysCsv);

let salariesCsv = 'Year,Month,Day,Message\n';
SALARY_DATES.forEach(s => {
    salariesCsv += `${s.year},${s.month},${s.day},${s.message}\n`;
});
fs.writeFileSync('salaries.csv', salariesCsv);
console.log('CSV files generated!');
