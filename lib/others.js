function dynamicSort(property) {
    var sortOrder = 1;
    if (property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a, b) {
        /* next line works with strings and numbers, 
         * and you may want to customize it to your needs
         */
        var result = (a["name"][property] < b["name"][property]) ? -1 : (a["name"][property] > b["name"][property]) ? 1 : 0;
        return result * sortOrder;
    }
}

module.exports = { dynamicSort }