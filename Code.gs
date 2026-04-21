// Google Apps Script — วางในไฟล์ Code.gs ของ Google Sheet
// Extensions > Apps Script > วางโค้ดนี้ > Deploy as Web App
// Execute as: Me | Who has access: Anyone

const SHEET_NAME = 'ข้อมูลผู้สมัคร';

// ▶ รันฟังก์ชันนี้ครั้งเดียวเพื่อสร้าง Sheet พร้อม Header
function initSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  } else {
    sheet.clearContents();
    sheet.clearFormats();
  }
  writeHeader(sheet);
  SpreadsheetApp.getUi().alert('✅ สร้าง Sheet เรียบร้อยแล้ว!');
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME);

    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      writeHeader(sheet);
    } else if (sheet.getLastRow() === 0) {
      writeHeader(sheet);
    }

    const members = data.members || [];
    const submissionDate = data.submissionDate || new Date().toLocaleString('th-TH');

    members.forEach((member, index) => {
      const row = [
        submissionDate,              // A: วันที่ส่งใบสมัคร
        data.school,                 // B: โรงเรียน
        data.province,               // C: จังหวัด
        data.region,                 // D: ภาค
        data.affiliation,            // E: สังกัด
        data.teamName,               // F: ชื่อทีม
        index + 1,                   // G: ลำดับ
        member.position,             // H: ตำแหน่ง
        member.prefix,               // I: คำนำหน้าชื่อ
        member.fullname,             // J: ชื่อ-นามสกุล
        member.birthdate,            // K: วัน/เดือน/ปี เกิด
        member.age,                  // L: อายุ (ปี)
        member.idcard,               // M: เลขบัตรประชาชน
        member.grade,                // N: กำลังศึกษาชั้น
        member.address,              // O: ที่อยู่
        member.phone,                // P: โทรศัพท์
        member.email,                // Q: อีเมล์
        member.line,                 // R: ไลน์
        '',                          // S: ผลการตรวจสอบ (หลังบ้านกรอกเอง)
        '',                          // T: หมายเหตุ (หลังบ้านกรอกเอง)
      ];
      sheet.appendRow(row);
    });

    sheet.autoResizeColumns(1, 20);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function writeHeader(sheet) {
  const headers = [
    'วันที่ส่งใบสมัคร',     // A
    'โรงเรียน',              // B
    'จังหวัด',               // C
    'ภาค',                   // D
    'สังกัด',                // E
    'ชื่อทีม',               // F
    'ลำดับ',                 // G
    'ตำแหน่ง',               // H
    'คำนำหน้าชื่อ',          // I
    'ชื่อ-นามสกุล',          // J
    'วัน/เดือน/ปี เกิด',    // K
    'อายุ (ปี)',             // L
    'เลขบัตรประชาชน',        // M
    'กำลังศึกษาชั้น',        // N
    'ที่อยู่',               // O
    'โทรศัพท์',              // P
    'อีเมล์',                // Q
    'ไลน์',                  // R
    'ผลการตรวจสอบ',          // S  ← หลังบ้านกรอก
    'หมายเหตุ',              // T  ← หลังบ้านกรอก
  ];

  sheet.appendRow(headers);

  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange
    .setFontWeight('bold')
    .setBackground('#667eea')
    .setFontColor('#ffffff')
    .setHorizontalAlignment('center');

  sheet.setFrozenRows(1);
  sheet.autoResizeColumns(1, headers.length);

  // เน้นคอลัมน์หลังบ้าน S-T สีเหลือง
  sheet.getRange(1, 19, 1, 2)
    .setBackground('#f4b400')
    .setFontColor('#000000');
}
