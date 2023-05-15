function dynamicSort(property) {
    var sortOrder = 1;
    if (property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a, b) {
        var result = (a["name"][property] < b["name"][property]) ? -1 : (a["name"][property] > b["name"][property]) ? 1 : 0;
        return result * sortOrder;
    }
}
function zPad(int) {
    return (int < 10 ? "0" + int.toString() : int.toString())
}
module.exports = { dynamicSort, zPad }