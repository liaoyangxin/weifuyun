export function axisLabelInterval(axLength) { // axLength x坐标的数组长度
    // 1-8：每天/个
    // 9-19：2天/个
    // 20-29：4天/个
    // 30-49：6天/个
    // 50-69：8天/个
    // 70-90：10天/个
    let axisLableNumber = 0
    if (8 < axLength && 19 >= axLength) {
        console.log('2222222222222222')
        axisLableNumber = 2
    } else if (19 < axLength && 29 >= axLength) {
        axisLableNumber = 4
    } else if (29 < axLength && 49 >= axLength) {
        axisLableNumber = 6
    } else if (49 < axLength && 69 >= axLength) {
        axisLableNumber = 8
    } else if (69 < axLength) {
        axisLableNumber = 10
    }
    return axisLableNumber
}