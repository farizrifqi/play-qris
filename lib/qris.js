const infoTag = {
    qris: {
        "00": {
            name: "ver",
            deskripsi: "Versi QRIS"
        },
        "01": {
            name: "method",
            deskripsi: "Method"
        },
        "26": {
            name: "merchant",
            deskripsi: "Informasi Merchant"
        },
        "51": {
            name: "merchant51",
            deskripsi: "Informasi Merchant"
        },
        "52": {
            name: "categoryMerchant",
            deskripsi: "Kategory merchant"
        },
        "53": {
            name: "currency",
            deskripsi: "Kode mata uang transaksi"
        },
        "54": {
            name: "transactionAmount",
            deskripsi: "Nominal transaksi"
        },
        "55": {
            name: "tipOrConvenienceIndicator",
            deskripsi: "tipOrConvenienceIndicator"
        },
        "56": {
            name: "fixedFee",
            deskripsi: "Nominal angka pajak"
        },
        "57": {
            name: "percentFee",
            deskripsi: "Persen pajak"
        },
        "58": {
            name: "countryCode",
            deskripsi: "Kode negara merchant"
        },
        "59": {
            name: "merchantName",
            deskripsi: "nama merchant"
        },
        "60": {
            name: "merchantCity",
            deskripsi: "Kota merchant"
        },
        "61": {
            name: "postalCode",
            deskripsi: "Kode pos merchant"
        },
        "63": {
            name: "checksum",
            deskripsi: "Checksum data"
        },

    },
    merchant: {
        "00": {
            name: "globallyUniqueIdentifier",
            deskripsi: "identifier"
        },
        "01": {
            name: "merchantPan",
            deskripsi: "merchant pan"
        },
        "02": {
            name: "merchantId",
            deskripsi: "merchant id"
        },
        "03": {
            name: "merchantCriteria",
            deskripsi: "merchant criteria"
        }
    },
    additional: {
        "01": {
            name: "billnumber",
            deskripsi: "billnumber"
        },
        "02": {
            name: "mobileNumber",
            deskripsi: "mobileNumber"
        },
        "03": {
            name: "storeLabel",
            deskripsi: "storeLabel"
        },
        "04": {
            name: "loyaltyNumber",
            deskripsi: "loyaltyNumber"
        },
        "05": {
            name: "referenceLabel",
            deskripsi: "referenceLabel"
        },
        "06": {
            name: "customerLabel",
            deskripsi: "customerLabel"
        },
        "07": {
            name: "terminalLabel",
            deskripsi: "terminalLabel"
        },
        "08": {
            name: "purposeOfTransaction",
            deskripsi: "purposeOfTransaction"
        },
        "09": {
            name: "additionalConsumerData",
            deskripsi: "additionalConsumerData"
        },
    }

}
const checkQRIS = (result, str) => {
    try {
        if (str.length <= 2) return result
        let tag = str.substr(0, 2)
        let panjang = parseInt(str.substr(2, 2))
        if (tag == '26') {
            result.merchant = checkMerchant({}, str.substring(4, panjang + 4))
        } else if (tag == '51') {
            result.merchant51 = checkMerchant({}, str.substring(4, panjang + 4))
        } else if (tag == '62') {
            result.additional = checkAdditional({}, str.substring(4, panjang + 4))
        } else {
            if (infoTag['qris'][tag]) {
                let name = infoTag['qris'][tag].name
                result[name] = {
                    value: str.substring(4, panjang + 4),
                    tags: tag,
                    desc: infoTag['qris'][tag].deskripsi
                }
            }
        }
        if (str.length <= panjang + 4) return result
        return checkQRIS(result, str.substr(panjang + 4))
    } catch (err) {
        result.invalid = true
        return result
    }
}
const checkMerchant = (result, str) => {
    try {
        if (str.length <= 2) return result

        let tag = str.substr(0, 2)
        let panjang = parseInt(str.substr(2, 2))
        if (infoTag['merchant'][tag]) {
            let name = infoTag['merchant'][tag].name
            result[name] = {
                value: str.substring(4, panjang + 4),
                tags: tag,
                desc: infoTag['merchant'][tag].deskripsi
            }
        }
        if (str.length <= panjang + 4) return result
        return checkMerchant(result, str.substr(panjang + 4))
    } catch (err) {
        return result
    }
}
const checkAdditional = (result, str) => {
    try {
        if (str.length <= 2) return result

        let tag = str.substr(0, 2)
        let panjang = parseInt(str.substr(2, 2))
        if (infoTag['additional'][tag]) {
            let name = infoTag['additional'][tag].name
            result[name] = {
                value: str.substring(4, panjang + 4),
                tags: tag,
                desc: infoTag['additional'][tag].deskripsi
            }
        }
        if (str.length <= panjang + 4) return result
        return checkAdditional(result, str.substr(panjang + 4))
    } catch (err) {
        return result
    }
}
const validate = (str) => {
    if (!str.includes("000201") && !str.includes("000202")) return false;
    if (!str.includes("6304")) return false;
    // let data = str.split("6304")[str.split("6304").length - 2] + "6304"
    // let checkSum = str.split("6304")[str.split("6304").length - 1]
    // return (crc(data).toString(16).toUpperCase() == checkSum) ? true : false
    return true
}


module.exports = { checkQRIS, validate }