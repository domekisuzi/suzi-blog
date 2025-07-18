export  function formatForSQL(datetime: string): string {
    return datetime.slice(0, 19).replace('T', ' ')
}