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
    merchantInformation: {
        "00": {
            name: "language",
            deskripsi: "lang preference"
        },
        "01": {
            name: "name",
            deskripsi: "merchant name"
        },
        "02": {
            name: "city",
            deskripsi: "merchant city"
        },
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
        "10": {
            name: "merchantTaxId",
            deskripsi: "merchantTaxId"
        },
        "11": {
            name: "merchantChannel",
            deskripsi: "merchantChannel"
        },
    }

}
const isMerchant = (tag) => {
    if (tag == "00" || tag == "01") return false
    let temp = parseInt(tag)
    if (temp <= 51) {
        if (temp <= 9) {
            return tag.substring(0, 1) == '0'
        }
        return true
    }
}

const checkQRIS = (result, str) => {
    try {
        result.lengthData = result.lengthData || 0;

        if (str.length <= 2) return result
        let tag = str.substr(0, 2)
        let panjang = parseInt(str.substr(2, 2))
        if (parseInt(tag) >= 2 && parseInt(tag) <= 51) {
            if (!result.merchantAccount) result.merchantAccount = {}
            let value = checkMerchant({}, str.substring(4, panjang + 4))
            result["merchantAccount"][tag] = value
            result.lengthData = result.lengthData + 4 + value.lengthData
        } else if (tag == '62') {
            let value = checkAdditional({}, str.substring(4, panjang + 4))
            result.additional = value
            result.lengthData = result.lengthData + 4 + value.lengthData
        } else {
            if (infoTag['qris'][tag]) {
                let value = str.substring(4, panjang + 4)
                let name = infoTag['qris'][tag].name
                result[name] = {
                    value,
                    tags: tag,
                    desc: infoTag['qris'][tag].deskripsi
                }
                result.lengthData = result.lengthData + 4 + value.length
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
        result.lengthData = result.lengthData ?? 0
        if (str.length <= 2) return result
        let tag = str.substr(0, 2)
        let panjang = parseInt(str.substr(2, 2))
        if (infoTag['merchant'][tag]) {
            let name = infoTag['merchant'][tag].name
            let value = str.substring(4, panjang + 4)
            result[name] = {
                value,
                tags: tag,
                desc: infoTag['merchant'][tag].deskripsi
            }
            result.lengthData = result.lengthData + value.length + 4

        }
        if (str.length <= panjang + 4) return result
        return checkMerchant(result, str.substr(panjang + 4))
    } catch (err) {
        return result
    }
}
const checkAdditional = (result, str) => {
    try {
        result.lengthData = result.lengthData ?? 0
        if (str.length <= 2) return result
        let tag = str.substr(0, 2)
        let panjang = parseInt(str.substr(2, 2))
        if (infoTag['additional'][tag]) {
            let name = infoTag['additional'][tag].name
            let value = str.substring(4, panjang + 4)
            result[name] = {
                value,
                tags: tag,
                desc: infoTag['additional'][tag].deskripsi

            }
            result.lengthData = result.lengthData + value.length + 4

        }
        if (str.length <= panjang + 4) return result
        return checkAdditional(result, str.substr(panjang + 4))
    } catch (err) {
        return result
    }
}

const validate = (str) => {
    return (str.includes("000201") || str.includes("000202"))
}


module.exports = { checkQRIS, validate }