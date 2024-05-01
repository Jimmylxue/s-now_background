import dayjs from 'dayjs';

export function baseFormatTime(timeString: number | string) {
  const _time = new Date(Number(timeString));
  return dayjs(_time).format('YYYY-MM-DD HH:mm:ss');
}
