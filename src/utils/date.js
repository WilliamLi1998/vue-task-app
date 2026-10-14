/* 日期处理函数 */
export function todayTimeStamp() {
    const today = new Date();
    const timeStamp = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());

    return timeStamp;
}

export function parseDateTextToUTC(dateText) {
    if (typeof dateText !== "string") {
        return null;
    }

    const dateArray = dateText.split("-");
    // console.log(dateArray);

    if (dateArray.length !== 3 || dateArray[0].length !== 4 || dateArray[1].length !== 2
        || dateArray[2].length !== 2) {
        // console.log(2);
        return null;
    }

    const year = Number(dateArray[0]);
    const month = Number(dateArray[1]);
    const day = Number(dateArray[2]);
    // console.log(year, month, day);

    if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) {
        // console.log(1);
        return null;
    }

    const timeStamp = Date.UTC(year, month - 1, day)
    const date = new Date(timeStamp);
    // console.log(date);

    if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1
        || date.getUTCDate() !== day
    ) {
        console.log(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
        console.log(3);
        return null;
    }
    console.log(timeStamp);
    return timeStamp;
}
//计算时间差导出
export function calculateDateSpan(beginningDate, endingDate) {
    const dateMilliseconds = 24 * 60 * 60 * 1000;

    const beginningDateTimeStamp = parseDateTextToUTC(beginningDate);
    const endingDateTimeStamp = parseDateTextToUTC(endingDate);

    if (beginningDateTimeStamp === null || endingDateTimeStamp === null) {
        return null;
    }

    if (beginningDateTimeStamp > endingDateTimeStamp) {
        return null;
    }

    const dateSpan = (endingDateTimeStamp - beginningDateTimeStamp) / dateMilliseconds + 1;
    // console.log(dateSpan);
    return dateSpan;
}

export function formatDateTime(isoUtc) {
    if (!isoUtc) return '-'

    return new Intl.DateTimeFormat('ja-JP', {
        dateStyle: 'medium',
        timeStyle: 'short',
        timeZone: 'Asia/Tokyo'
    }).format(new Date(isoUtc))
}