export type AuspiceType = 'good' | 'neutral' | 'bad';

export interface TimeSlot {
  startTime: string;
  endTime: string;
  auspice: AuspiceType;
  label: string;
}

// ยามอุบากองแบ่งเป็น 5 ช่วง ช่วงละ 2 ชั่วโมง 24 นาที (144 นาที)
const timeRanges = [
  { start: '06:01', end: '08:24' },
  { start: '08:25', end: '10:48' },
  { start: '10:49', end: '13:12' },
  { start: '13:13', end: '15:36' },
  { start: '15:37', end: '18:00' },
];

const nightTimeRanges = [
  { start: '18:01', end: '20:24' },
  { start: '20:25', end: '22:48' },
  { start: '22:49', end: '01:12' },
  { start: '01:13', end: '03:36' },
  { start: '03:37', end: '06:00' },
];

// ตารางยามอุบากองตามวัน (อาทิตย์ = 0, จันทร์ = 1, ...)
// อ้างอิงแบบง่าย: good (🟢), neutral (🟡), bad (🔴)
const ubakongDayTable: AuspiceType[][] = [
  ['neutral', 'bad', 'good', 'neutral', 'bad'], // 0: อาทิตย์
  ['good', 'neutral', 'bad', 'good', 'neutral'], // 1: จันทร์
  ['bad', 'good', 'neutral', 'bad', 'good'], // 2: อังคาร
  ['neutral', 'bad', 'good', 'neutral', 'bad'], // 3: พุธ
  ['good', 'neutral', 'bad', 'good', 'neutral'], // 4: พฤหัสบดี
  ['neutral', 'bad', 'bad', 'good', 'neutral'], // 5: ศุกร์ (Mockup user: 🟡 🔴 🟢 🟢 🟡) -> neutral, bad, good, good, neutral
  ['bad', 'good', 'neutral', 'bad', 'good'], // 6: เสาร์
];

// ปรับแก้ตารางวันศุกร์ให้ตรงกับ Mockup ของ User
ubakongDayTable[5] = ['neutral', 'bad', 'good', 'good', 'neutral'];

const auspiceLabels = {
  good: 'ฤกษ์ดี',
  neutral: 'ควรระวัง',
  bad: 'ไม่ดี',
};

const auspiceIcons = {
  good: '🟢',
  neutral: '🟡',
  bad: '🔴',
};

export function getUbakongSlots(date: Date, isNight: boolean = false): TimeSlot[] {
  const dayOfWeek = date.getDay();
  const pattern = ubakongDayTable[dayOfWeek];
  const ranges = isNight ? nightTimeRanges : timeRanges;

  return ranges.map((range, index) => {
    const auspice = pattern[index];
    return {
      startTime: range.start,
      endTime: range.end,
      auspice,
      label: auspiceLabels[auspice],
    };
  });
}

export function getCurrentSlot(date: Date): TimeSlot | null {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const totalMinutes = hours * 60 + minutes;

  // Day: 6:01 (361) to 18:00 (1080)
  // Night: 18:01 (1081) to 6:00 (360 - next day)

  const isNight = totalMinutes > 1080 || totalMinutes <= 360;
  const slots = getUbakongSlots(date, isNight);

  for (const slot of slots) {
    const [startH, startM] = slot.startTime.split(':').map(Number);
    const [endH, endM] = slot.endTime.split(':').map(Number);
    const slotStartMin = startH * 60 + startM;
    let slotEndMin = endH * 60 + endM;
    
    if (slotEndMin < slotStartMin) {
        slotEndMin += 24 * 60; // handle cross midnight
    }

    let currentTotalMinutes = totalMinutes;
    if (isNight && totalMinutes <= 360) {
        currentTotalMinutes += 24 * 60; // shift morning hours for night comparison
    }

    let compareStartMin = slotStartMin;
    if (isNight && slotStartMin < 1080) {
        compareStartMin += 24 * 60;
    }

    if (currentTotalMinutes >= compareStartMin && currentTotalMinutes <= slotEndMin) {
      return slot;
    }
  }

  return slots[0]; // fallback
}

export function getAuspiceIcon(auspice: AuspiceType): string {
  return auspiceIcons[auspice];
}

export function getAuspiceDesc(auspice: AuspiceType): string {
  switch (auspice) {
    case 'good': return '"เหมาะสำหรับติดต่อ เจรจา เริ่มงาน และดำเนินกิจกรรมที่วางแผนไว้"';
    case 'neutral': return '"สามารถทำกิจกรรมทั่วไปได้ แต่ควรระมัดระวังรอบคอบเป็นพิเศษ"';
    case 'bad': return '"ควรหลีกเลี่ยงการเริ่มต้นสิ่งใหม่ หรือการเจรจาสำคัญในช่วงเวลานี้"';
  }
}
