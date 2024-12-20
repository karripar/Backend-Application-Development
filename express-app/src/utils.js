// utils.js
const formatTimestamp = () => { // format the timestamp to be in the format 'YYYY-MM-DD HH:MM:SS'
    return new Date().toLocaleString('fi-FI', {
        year: 'numeric',
        month: '2-digit',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
        timeZone: 'Europe/Helsinki'
    })
}

export {formatTimestamp};