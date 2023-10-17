"use client";
import { dynamicSort, zPad } from "@/lib/others";
import countries from "../lib/countries.json";
import { useState } from "react";
import merchantcategorycode from "../lib/mcc.json";
import crc16ccitt from "@/lib/crc16ccitt";

countries.sort(dynamicSort("common"));

export default function EditData({ newQrisData, newQris, pushNewQrisData }) {
  const [tempData, setTempData] = useState(newQrisData);

  const getFullValue = (tags, value) => {
    return `${tags}${zPad(value.length)}${value}`;
  };
  const indicatorMeaning = {
    "01": "Customer Input",
    "02": "Fixed",
    "03": "In Percent",
  };
  const changeData = (e, key1) => {
    if (!newQrisData[key1]) {
      if (key1 == "transactionAmount") {
        if (e.target.value != "" && e.target.value != 0) {
          //* Add key "transactionAmount" to ObjectData
          let temp = newQrisData;
          temp[key1] = {
            tags: "54",
            value: e.target.value,
          };

          // * Add str to Qris Data
          const countryData = `5802${newQrisData["countryCode"].value}`;

          newQris = newQris.replace(
            countryData,
            `54${zPad(e.target.value.length)}${e.target.value}${countryData}`
          );

          // * Change Method to dynamic
          temp["method"] = {
            tags: "01",
            value: "12",
          };
          // * Change method on QRIS str
          newQris = newQris.replace("010211", `010212`);

          // * Save QRIS ObjectData
          newQrisData[key1] = temp[key1];
        }
      }
    }
    let tempChangeQris = newQris;
    let tempProp = { ...newQrisData[key1] };
    let tempChangeQrisData = { ...newQrisData };
    tempProp.value = e.target.value;
    tempChangeQrisData[key1] = tempProp;
    const oldVal = getFullValue(
      newQrisData[key1].tags,
      newQrisData[key1].value
    );
    const newVal = getFullValue(tempChangeQrisData[key1].tags, e.target.value);
    tempChangeQris = tempChangeQris.replace(oldVal, newVal);
    setTempData(tempChangeQrisData);

    //! Re-checksum

    tempChangeQris = tempChangeQris.replace(
      tempChangeQrisData.checksum.value,
      ""
    );
    const newChecksum =
      crc16ccitt(tempChangeQris).length == 3
        ? `0${crc16ccitt(tempChangeQris)}`.toString(16)
        : crc16ccitt(tempChangeQris).toString(16);
    tempChangeQris = `${tempChangeQris}${newChecksum.toUpperCase()}`;
    pushNewQrisData(tempChangeQris);
  };

  return (
    <div className="flex flex-col gap-2 p-5 bg-slate-900 rounded-lg text-sm">
      <div className="text-lg font-bold border-b border-gray-700 py-1">
        Editable Data
      </div>
      <span>
        Type:{" "}
        {newQrisData.method
          ? parseInt(newQrisData.method.value) == 11
            ? "Static"
            : parseInt(newQrisData.method.value) == 12
            ? "Dynamic"
            : parseInt(newQrisData.method.value)
          : ""}
      </span>
      <div className="font-semibold border-b border-gray-700 py-1">
        Merchant Information
      </div>
      <div className="grid grid-cols-3 gap-2">
        {newQrisData.merchantName ? (
          <div className="flex flex-col gap-1">
            <div className="flex flex-row items-center gap-1">
              <span className="rounded text-xs bg-slate-700 p-0.5">
                {newQrisData.merchantName.tags +
                  zPad(newQrisData.merchantName.value.length)}
              </span>
              Name
            </div>
            <input
              type="text"
              onChange={(e) => changeData(e, "merchantName")}
              value={newQrisData.merchantName.value}
            />
          </div>
        ) : (
          ""
        )}
        {/* 
        // ! BUG
        {tempData.categoryMerchant ? (
          <div className="flex flex-col gap-1">
            <div className="flex flex-row items-center gap-1">
              <span className="rounded text-xs bg-slate-700 p-0.5">
                {newQrisData.categoryMerchant.tags +
                  zPad(newQrisData.categoryMerchant.value.length)}
              </span>
              Category
            </div>
            <select onChange={(e) => changeData(e, "categoryMerchant")}>
              {merchantcategorycode.map((merchCode, i) => {
                return (
                  <option key={i} value={merchCode.id}>
                    {merchCode.description}
                  </option>
                );
              })}
            </select>
          </div>
        ) : (
          ""
        )} */}

        {tempData.merchantCity ? (
          <div className="flex flex-col gap-1">
            <div className="flex flex-row items-center gap-1">
              <span className="rounded text-xs bg-slate-700 p-0.5">
                {newQrisData.merchantCity.tags +
                  zPad(newQrisData.merchantCity.value.length)}
              </span>
              City
            </div>
            <input
              type="text"
              onChange={(e) => changeData(e, "merchantCity")}
              value={newQrisData.merchantCity.value}
            />
          </div>
        ) : (
          ""
        )}
        {tempData.postalCode ? (
          <div className="flex flex-col gap-1">
            <div className="flex flex-row items-center gap-1">
              <span className="rounded text-xs bg-slate-700 p-0.5">
                {newQrisData.postalCode.tags +
                  zPad(newQrisData.postalCode.value.length)}
              </span>
              Postal
            </div>
            <input
              type="text"
              onChange={(e) => changeData(e, "postalCode")}
              value={newQrisData.postalCode.value}
            />
          </div>
        ) : (
          ""
        )}
        {tempData.countryCode ? (
          <div className="flex flex-col gap-1">
            <div className="flex flex-row items-center gap-1">
              <span className="rounded text-xs bg-slate-700 p-0.5">5802</span>
              Country
            </div>
            <select
              onChange={(e) => changeData(e, "countryCode")}
              value={newQrisData.countryCode.value}
            >
              {countries.map((c, i) => (
                <option key={i} value={c.cca2}>
                  {c.name.common}
                </option>
              ))}
            </select>
          </div>
        ) : (
          ""
        )}
      </div>
      <div className="font-semibold border-b border-gray-700 py-1">
        Transaction Information
      </div>
      <div className="grid grid-cols-3 gap-2">
        {tempData.currency ? (
          <div className="flex flex-col gap-1">
            <div className="flex flex-row items-center gap-1">
              <span className="rounded text-xs bg-slate-700 p-0.5">5802</span>
              Country
            </div>
            <select
              className="text-xs"
              onChange={(e) => changeData(e, "currency")}
              value={newQrisData.currency.value}
            >
              {countries.map((c, i) => (
                <option key={i} value={c.ccn3}>
                  ({c.currencies[Object.keys(c.currencies)[0]].symbol}){" "}
                  {Object.keys(c.currencies)[0]} -{" "}
                  {c.currencies[Object.keys(c.currencies)[0]].name}
                </option>
              ))}
            </select>
          </div>
        ) : (
          ""
        )}
        {true ? (
          <div className={`flex flex-col gap-1`}>
            <div className="flex flex-row items-center gap-1">
              <span className="rounded text-xs bg-slate-700 p-0.5">
                54
                {newQrisData.transactionAmount
                  ? zPad(newQrisData.transactionAmount.value.length)
                  : "00"}
              </span>
              Amount
            </div>
            <input
              onChange={(e) => changeData(e, "transactionAmount")}
              type="text"
              value={
                newQrisData.transactionAmount
                  ? newQrisData.transactionAmount.value
                  : 0
              }
            />
          </div>
        ) : (
          ""
        )}

        {newQrisData.tipOrConvenienceIndicator &&
        (newQrisData.tipOrConvenienceIndicator.value >= 1) |
          (newQrisData.tipOrConvenienceIndicator.value <= 3) ? (
          <div className={`flex flex-col gap-1`}>
            <div className="flex flex-row items-center gap-1">
              <span className="rounded text-xs bg-slate-700 p-0.5">
                55{zPad(newQrisData.tipOrConvenienceIndicator.value.length)}
              </span>
              Tax System
            </div>
            <select
              className="text-xs"
              onChange={(e) => changeData(e, "tipOrConvenienceIndicator")}
              value={newQrisData.tipOrConvenienceIndicator.value}
            >
              {Object.keys(indicatorMeaning).map((key) => (
                <option key={key} value={key}>
                  {indicatorMeaning[key]}
                </option>
              ))}
            </select>
          </div>
        ) : (
          ""
        )}
        {/* {newQrisData.tipOrConvenienceIndicator &&
        // todo
        (newQrisData.tipOrConvenienceIndicator.value >= 2) |
          (newQrisData.tipOrConvenienceIndicator.value <= 3) ? (
          <div className={`flex flex-col gap-1`}>
            <div className="flex flex-row items-center gap-1">
              <span className="rounded text-xs bg-slate-700 p-0.5">
                {newQrisData.tipOrConvenienceIndicator.value == "02"
                  ? `56${zPad(newQrisData.fixedFee.value.length)}`
                  : `57${zPad(newQrisData.percentFee.value.length)}`}
              </span>
              Tax System
            </div>
            <select
              className="text-xs"
              onChange={(e) => changeData(e, "tipOrConvenienceIndicator")}
              value={newQrisData.tipOrConvenienceIndicator.value}
            >
              {Object.keys(indicatorMeaning).map((key) => (
                <option key={key} value={key}>
                  {indicatorMeaning[key]}
                </option>
              ))}
            </select>
          </div>
        ) : (
          ""
        )} */}
      </div>
    </div>
  );
}
