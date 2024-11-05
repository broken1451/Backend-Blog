export function formatDate(date: Date): string {
    // Convertir la fecha a la zona horaria de Santiago
    const options: Intl.DateTimeFormatOptions = {
        timeZone: 'America/Santiago',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        fractionalSecondDigits: 3, // Para los milisegundos
        hour12: false, // Formato de 24 horas
    };

    const parts = new Intl.DateTimeFormat('en-US', options).formatToParts(date);

    // Reorganizar los componentes a YYYY-MM-DD HH:mm:ss.SSS
    const year = parts.find(p => p.type === 'year')?.value;
    const month = parts.find(p => p.type === 'month')?.value;
    const day = parts.find(p => p.type === 'day')?.value;
    const hour = parts.find(p => p.type === 'hour')?.value;
    const minute = parts.find(p => p.type === 'minute')?.value;
    const second = parts.find(p => p.type === 'second')?.value;
    const millisecond = String(date.getMilliseconds()).padStart(3, '0');

    return `${year}-${month}-${day} ${hour}:${minute}:${second}.${millisecond}`;
}
