export const IS_AUTH = localStorage.getItem('token') !== null;
export const SERVER_URL = 'http://92.255.79.135:8000';
export const IMAGE_TYPES = ['jpg', 'jpeg', 'png'];
export const VIDEO_TYPES = ['mp4', 'avi', 'mkv', 'mov',];

export function convertToMonth(str) {
  switch (str) {
    case '01': return 'января'
    case '02': return 'февраля'
    case '03': return 'марта'
    case '04': return 'апреля'
    case '05': return 'мая'
    case '06': return 'июня'
    case '07': return 'июля'
    case '08': return 'августа'
    case '09': return 'сентября'
    case '10': return 'октября'
    case '11': return 'ноября'
    case '12': return 'декабря'
    default: return 'месяца'
  }
}

export function setLastPage() {
  localStorage.setItem('lastPage', window.location.href)
}

export function removeLastPage() {
  window.location.href = localStorage.getItem('lastPage') !== null
    ? localStorage.getItem('lastPage')
    : '..';
  localStorage.removeItem('lastPage');
}