export function getTemplateTimeByDate(date, template) {
    date = new Date(date)

    let TimeObj = {
        'Y+': date.getFullYear(),
        '(M+)': date.getMonth() + 1,
        '(d+)': date.getDate(),
        '(h+)': date.getHours(),
        '(m+)': date.getMinutes(),
        '(s+)': date.getSeconds()
    }

    for (let key in TimeObj) {
        let reg = new RegExp(key)
        if (reg.test(template)) {
            // console.log(RegExp.$1)
            let time = TimeObj[key]
            // 判断当前模板时间是 两位 还是 一位的
            // 如果是两位 个位数时间需要前面加零, 1 -> 01 
            // 如果是一位 不用加零操作
            if (RegExp.$1.length > 1) {
                time = time >= 10 ? time : '0' + time
            }
            template = template.replace(reg, time)
        }
    }
    return template
}
export function formatUpdatedTime(time) {
    let minute = 1000 * 60;
    let hour = minute * 60;
    let day = hour * 24;
    let month = day * 30;

    let date = new Date().getTime() - new Date(time);
    let monthDate = date / month;
    let weekDate = date / (7 * day);
    let dayDate = date / day;
    let hourDate = date / hour;
    let minuteDate = date / minute;

    if (monthDate >= 1) {
        time = parseInt(monthDate) + "个月前";
    } else if (weekDate >= 1) {
        time = parseInt(weekDate) + "周前";
    } else if (dayDate >= 1) {
        time = parseInt(dayDate) + "天前";
    } else if (hourDate >= 1) {
        time = parseInt(hourDate) + "小时前";
    } else if (minuteDate >= 1) {
        time = +parseInt(minuteDate) + "分钟前";
    } else {
        time = "刚刚";
    }
    return time;
}