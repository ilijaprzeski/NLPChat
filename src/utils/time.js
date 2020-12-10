
export const getDateString = (date) => {
    weeks = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    curDate = new Date();
    if(curDate.getFullYear() === date.getFullYear() && curDate.getMonth() === date.getMonth() && curDate.getDate() === date.getDate()){
        return 'Today'
    }

    yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1)
    if (yesterday.getFullYear() === date.getFullYear() && yesterday.getMonth() === date.getMonth() && yesterday.getDate() === date.getDate()){
        return 'Yesterday'
    }

    aweek = 604800000
    if ((curDate.getTime() - date.getTime()) < aweek){
        return weeks[date.getDay()]
    }

    return weeks[date.getDay()] + ', ' + months[date.getMonth()] + ', ' + date.getDate().toString() + ', ' + date.getFullYear().toString()
}

export const getTimeString = (date) => {
    return date.getHours().toString() + ':' + date.getMinutes().toString()
}

export const getHour = (date) => {
    return date.getHours()
}