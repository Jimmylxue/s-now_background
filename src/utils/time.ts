import dayjs from 'dayjs';

export function baseFormatTime(timeString: number | string) {
  const _time = new Date(Number(timeString));
  return dayjs(_time).format('YYYY-MM-DD HH:mm:ss');
}

export function convertLondonToBeijing(londonTime: string) {
  console.log('ccddee');
  // 创建一个 Date 对象
  const date = new Date(londonTime);

  // 将伦敦时间转换为北京时间（伦敦时间 + 8 小时）
  const beijingTime = new Date(date.getTime() + 8 * 60 * 60 * 1000);

  // 返回格式化的北京时间
  return beijingTime.toISOString();
}
