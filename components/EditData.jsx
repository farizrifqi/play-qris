"use client";
import { zPad } from "@/lib/others";
import countries from "../lib/countries.json";
import { useState } from "react";
import crc16ccitt from "@/lib/crc16ccitt";

const TIP_INDICATOR_MEANING = {
  "01": "Customer Input",
  "02": "Fixed",
  "03": "In Percent",
};

function getFieldTag(field) {
  return field.tags + zPad(field.value.length);
}

function rebuildChecksum(qrisStr, checksumValue) {
  const withoutChecksum = qrisStr.replace(checksumValue, "");
  const crc = crc16ccitt(withoutChecksum);
  const hex = crc.toString(16);
  const paddedHex = hex.length === 3 ? `0${hex}` : hex;
  return `${withoutChecksum}${paddedHex.toUpperCase()}`;
}

export default function EditData({ newQrisData, newQris, pushNewQrisData }) {
  const [tempData, setTempData] = useState(newQrisData);

  const changeData = (e, key) => {
    const newValue = e.target.value;

    // Handle adding transactionAmount when it doesn't exist yet
    if (!newQrisData[key] && key === "transactionAmount") {
      if (newValue !== "" && newValue !== "0") {
        const countryData = `5802${newQrisData.countryCode.value}`;
        const updatedQris = newQris.replace(
          countryData,
          `54${zPad(newValue.length)}${newValue}${countryData}`
        );
        newQrisData[key] = { tags: "54", value: newValue };
        newQrisData.method = { tags: "01", value: "12" };
        pushNewQrisData(updatedQris.replace("010211", "010212"));
      }
      return;
    }

    // Standard field update
    const updatedData = { ...newQrisData, [key]: { ...newQrisData[key], value: newValue } };
    const oldFullValue = getFieldTag(newQrisData[key]) + newQrisData[key].value;
    const newFullValue = getFieldTag(updatedData[key]) + newValue;
    let updatedQris = newQris.replace(oldFullValue, newFullValue);

    // Rebuild CRC checksum
    updatedQris = rebuildChecksum(updatedQris, updatedData.checksum.value);

    setTempData(updatedData);
    pushNewQrisData(updatedQris);
  };

  const isStatic = newQrisData.method?.value === "11";
  const isDynamic = newQrisData.method?.value === "12";

  const currencyOptions = countries
    .filter(c => Object.keys(c.currencies).length > 0)
    .map(c => {
      const code = Object.keys(c.currencies)[0];
      return {
        id: c.ccn3,
        symbol: c.currencies[code].symbol,
        code,
        name: c.currencies[code].name,
      };
    });

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3 text-sm">
        <span className="text-slate-400">
          Type: <span className={`font-medium ${isDynamic ? "text-emerald-400" : "text-blue-400"}`}>
            {isStatic ? "Static" : isDynamic ? "Dynamic" : "—"}
          </span>
        </span>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-slate-300 border-b border-slate-700 pb-1 mb-3">
          Merchant Information
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {newQrisData.merchantName && (
            <div className="flex flex-col gap-1">
              <label className="flex items-center gap-1 text-xs text-slate-400">
                <span className="rounded bg-slate-700 px-1 py-0.5 font-mono">
                  {getFieldTag(newQrisData.merchantName)}
                </span>
                Name
              </label>
              <input
                type="text"
                className="bg-slate-800 border border-slate-700 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => changeData(e, "merchantName")}
                value={newQrisData.merchantName.value}
              />
            </div>
          )}

          {newQrisData.merchantCity && (
            <div className="flex flex-col gap-1">
              <label className="flex items-center gap-1 text-xs text-slate-400">
                <span className="rounded bg-slate-700 px-1 py-0.5 font-mono">
                  {getFieldTag(newQrisData.merchantCity)}
                </span>
                City
              </label>
              <input
                type="text"
                className="bg-slate-800 border border-slate-700 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => changeData(e, "merchantCity")}
                value={newQrisData.merchantCity.value}
              />
            </div>
          )}

          {newQrisData.postalCode && (
            <div className="flex flex-col gap-1">
              <label className="flex items-center gap-1 text-xs text-slate-400">
                <span className="rounded bg-slate-700 px-1 py-0.5 font-mono">
                  {getFieldTag(newQrisData.postalCode)}
                </span>
                Postal
              </label>
              <input
                type="text"
                className="bg-slate-800 border border-slate-700 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => changeData(e, "postalCode")}
                value={newQrisData.postalCode.value}
              />
            </div>
          )}

          {newQrisData.countryCode && (
            <div className="flex flex-col gap-1">
              <label className="flex items-center gap-1 text-xs text-slate-400">
                <span className="rounded bg-slate-700 px-1 py-0.5 font-mono">5802</span>
                Country
              </label>
              <select
                className="bg-slate-800 border border-slate-700 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => changeData(e, "countryCode")}
                value={newQrisData.countryCode.value}
              >
                {countries.map((c) => (
                  <option key={c.cca2} value={c.cca2}>
                    {c.name.common}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-slate-300 border-b border-slate-700 pb-1 mb-3">
          Transaction Information
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {newQrisData.currency && (
            <div className="flex flex-col gap-1">
              <label className="flex items-center gap-1 text-xs text-slate-400">
                <span className="rounded bg-slate-700 px-1 py-0.5 font-mono">
                  {getFieldTag(newQrisData.currency)}
                </span>
                Currency
              </label>
              <select
                className="bg-slate-800 border border-slate-700 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => changeData(e, "currency")}
                value={newQrisData.currency.value}
              >
                {currencyOptions.map((c) => (
                  <option key={c.id} value={c.id}>
                    ({c.symbol}) {c.code} - {c.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex flex-col gap-1">
            <label className="flex items-center gap-1 text-xs text-slate-400">
              <span className="rounded bg-slate-700 px-1 py-0.5 font-mono">
                54
                {newQrisData.transactionAmount
                  ? zPad(newQrisData.transactionAmount.value.length)
                  : "00"}
              </span>
              Amount
            </label>
            <input
              type="text"
              className="bg-slate-800 border border-slate-700 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => changeData(e, "transactionAmount")}
              value={newQrisData.transactionAmount?.value ?? "0"}
            />
          </div>

          {newQrisData.tipOrConvenienceIndicator && (
            <div className="flex flex-col gap-1">
              <label className="flex items-center gap-1 text-xs text-slate-400">
                <span className="rounded bg-slate-700 px-1 py-0.5 font-mono">
                  55{zPad(newQrisData.tipOrConvenienceIndicator.value.length)}
                </span>
                Tip Indicator
              </label>
              <select
                className="bg-slate-800 border border-slate-700 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => changeData(e, "tipOrConvenienceIndicator")}
                value={newQrisData.tipOrConvenienceIndicator.value}
              >
                {Object.entries(TIP_INDICATOR_MEANING).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
