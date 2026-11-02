/* 日期处理函数 */
// 转换今天的UTC时间戳
export function todayTimeStamp() {
    const today = new Date();
    const timeStamp = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());

    return timeStamp;
}
// 转换指定日期文本为UTC时间戳
export function parseDateTextToUTC(dateText) {
    // 日期必须为字符串
    if (typeof dateText !== "string") {
        return null;
    }
    // 以横杆分割年月日数组 
    const dateArray = dateText.split("-");
    // 日期数组长度判断
    if (dateArray.length !== 3 || dateArray[0].length !== 4 || dateArray[1].length !== 2
        || dateArray[2].length !== 2) {
        return null;
    }
    // 年月日变量对应数组三位, 转换为number型
    const year = Number(dateArray[0]);
    const month = Number(dateArray[1]);
    const day = Number(dateArray[2]);
    // 三个变量应为整数
    if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) {
        return null;
    }
    // 转换时间戳
    const timeStamp = Date.UTC(year, month - 1, day)
    // 反向验证时间戳
    const date = new Date(timeStamp);

    if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1
        || date.getUTCDate() !== day
    ) {
        return null;
    }
    return timeStamp;
}
//计算时间差导出
export function calculateDateSpan(beginningDate, endingDate) {
    // 定义一天毫秒数
    const dateMilliseconds = 24 * 60 * 60 * 1000;
    // 转换起始结束日期为UTC时间戳
    const beginningDateTimeStamp = parseDateTextToUTC(beginningDate);
    const endingDateTimeStamp = parseDateTextToUTC(endingDate);
    // 时间戳为null时返回null
    if (beginningDateTimeStamp === null || endingDateTimeStamp === null) {
        return null;
    }
    // 起始日不晚于结束日 
    if (beginningDateTimeStamp > endingDateTimeStamp) {
        return null;
    }
    // 计算日期数并返回 
    const dateSpan = (endingDateTimeStamp - beginningDateTimeStamp) / dateMilliseconds + 1;
    return dateSpan;
}
// 显示日本格式日期时间
export function formatDateTime(isoUtc) {
    if (!isoUtc) return '-'

    return new Intl.DateTimeFormat('ja-JP', {
        dateStyle: 'middle',
        timeStyle: 'short',
        timeZone: 'Asia/Tokyo'
    }).format(new Date(isoUtc))
}
// 显示日本格式日期
export function formatDate(isoUtc) {
    if (!isoUtc) return '-'

    return new Intl.DateTimeFormat('ja-JP', {
        dateStyle: 'long',
        timeZone: 'Asia/Tokyo'
    }).format(new Date(isoUtc))
}