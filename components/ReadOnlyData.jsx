"use client";
import { dynamicSort, zPad } from "@/lib/others";
import countries from "../lib/countries.json";
import { useEffect, useState } from "react";

countries.sort(dynamicSort("common"));

export default function ReadOnlyData({ merchantcategorycode, qrisData }) {
  console.log({ qrisData });
  // const [qrisData, setQrisData] = useState(q);
  // useEffect(() => {
  //   setQrisData(q);
  // }, [q]);
  const getCountryName = (countryCode) => {
    return countries.filter((c) => c.cca2 == countryCode)[0]?.name.common;
  };
  const getCountryCurrency = (currencyCode) => {
    const dataCountry = countries.filter((c) => c.ccn3 == currencyCode)[0];
    const currenciesCC = Object.keys(dataCountry?.currencies)[0];
    return {
      symbolPendek: dataCountry.currencies[currenciesCC].symbol,
      symbolPanjang: currenciesCC,
      nama: dataCountry.currencies[currenciesCC].name,
    };
  };
  const getCategoryMerchant = (code) => {
    return (
      merchantcategorycode.filter((c) => (c.id = code))[0]?.description ||
      "Unknown"
    );
  };
  const indicatorMeaning = {
    "01": "Customer Input",
    "02": "Fixed",
    "03": "In Percent",
  };
  return (
    <div className="flex flex-col gap-2 p-5 bg-slate-900 rounded-lg text-sm">
      <div className="text-lg font-bold border-b border-gray-700 py-1">
        Original Data
      </div>
      <span>Version: {qrisData.ver ? parseInt(qrisData.ver.value) : ""}</span>
      <span>
        Type:{" "}
        {qrisData.method
          ? parseInt(qrisData.method.value) == 11
            ? "Static"
            : parseInt(qrisData.method.value) == 12
            ? "Dynamic"
            : parseInt(qrisData.method.value)
          : ""}
      </span>
      <div className="font-semibold border-b border-gray-700 py-1">
        Merchant Information
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div className="flex flex-col gap-1">
          <div className="flex flex-row items-center gap-1">
            <span className="rounded text-xs bg-slate-700 p-0.5">
              {qrisData.merchantName
                ? qrisData.merchantName.tags +
                  zPad(qrisData.merchantName.value.length)
                : "5900"}
            </span>
            Name
          </div>
          <input
            disabled
            type="text"
            defaultValue={
              qrisData.merchantName ? qrisData.merchantName.value : ""
            }
          />
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex flex-row items-center gap-1">
            <span className="rounded text-xs bg-slate-700 p-0.5">
              {qrisData.categoryMerchant
                ? qrisData.categoryMerchant.tags +
                  zPad(qrisData.categoryMerchant.value.length)
                : "5200"}
            </span>
            Category
          </div>
          <input
            disabled
            type="text"
            defaultValue={
              qrisData.categoryMerchant
                ? getCategoryMerchant(qrisData.categoryMerchant.value)
                : ""
            }
          />
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex flex-row items-center gap-1">
            <span className="rounded text-xs bg-slate-700 p-0.5">
              {qrisData.merchantCity
                ? qrisData.merchantCity.tags +
                  zPad(qrisData.merchantCity.value.length)
                : "6000"}
            </span>
            City
          </div>
          <input
            disabled
            type="text"
            defaultValue={
              qrisData.merchantCity ? qrisData.merchantCity.value : ""
            }
          />
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex flex-row items-center gap-1">
            <span className="rounded text-xs bg-slate-700 p-0.5">
              {qrisData.postalCode
                ? qrisData.postalCode.tags +
                  zPad(qrisData.postalCode.value.length)
                : "6100"}
            </span>
            Postal
          </div>
          <input
            disabled
            type="text"
            defaultValue={qrisData.postalCode ? qrisData.postalCode.value : ""}
          />
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex flex-row items-center gap-1">
            <span className="rounded text-xs bg-slate-700 p-0.5">
              {qrisData.countryCode
                ? qrisData.countryCode.tags +
                  zPad(qrisData.countryCode.value.length)
                : "5802"}
            </span>
            Country
          </div>
          <input
            disabled
            type="text"
            defaultValue={
              qrisData.countryCode.value
                ? `${getCountryName(qrisData.countryCode.value)}`
                : ""
            }
          />
        </div>
      </div>
      <div className="font-semibold border-b border-gray-700 py-1">
        Transaction Information
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div className="flex flex-col gap-1">
          <div className="flex flex-row items-center gap-1">
            <span className="rounded text-xs bg-slate-700 p-0.5 ">
              {qrisData.currency
                ? qrisData.currency.tags + zPad(qrisData.currency.value.length)
                : "5802"}
            </span>
            Currency
          </div>
          <input
            disabled
            type="text"
            className="text-xs h-full"
            defaultValue={
              qrisData.currency.value
                ? `(${
                    getCountryCurrency(qrisData.currency.value).symbolPendek
                  }) ${
                    getCountryCurrency(qrisData.currency.value).symbolPanjang
                  } - ${getCountryCurrency(qrisData.currency.value).nama}`
                : ""
            }
          />
        </div>
        <div
          className={`flex flex-col gap-1 ${
            qrisData.method && qrisData.method.value == "11" ? "hidden" : ""
          }`}
        >
          <div className="flex flex-row items-center gap-1">
            <span className="rounded text-xs bg-slate-700 p-0.5">
              {qrisData.method && qrisData.method.value != "11"
                ? `54${zPad(qrisData.transactionAmount.value.length)}`
                : ""}
            </span>
            Amount
          </div>
          <input
            disabled
            type="text"
            value={
              qrisData.transactionAmount
                ? `${
                    getCountryCurrency(qrisData.currency.value).symbolPendek
                  } ${qrisData.transactionAmount.value}`
                : ""
            }
          />
        </div>
        {qrisData.tipOrConvenienceIndicator ? (
          <div
            className={`flex flex-col gap-1 ${
              parseInt(qrisData.tipOrConvenienceIndicator.value) <= 3 ||
              parseInt(qrisData.tipOrConvenienceIndicator.value) >= 1
                ? "hidden"
                : ""
            }`}
          >
            <div className="flex flex-row items-center gap-1">
              <span className="rounded text-xs bg-slate-700 p-0.5">
                {parseInt(qrisData.tipOrConvenienceIndicator.value) >= 1 ||
                parseInt(qrisData.tipOrConvenienceIndicator.value) <= 3
                  ? `55${qrisData.tipOrConvenienceIndicator.value}`
                  : ""}
              </span>
              Tax System
            </div>
            <input
              disabled
              type="text"
              value={
                parseInt(qrisData.tipOrConvenienceIndicator.value) >= 1 ||
                parseInt(qrisData.tipOrConvenienceIndicator.value) <= 3
                  ? indicatorMeaning[qrisData.tipOrConvenienceIndicator.value]
                  : "???"
              }
            />
          </div>
        ) : (
          ""
        )}
        {qrisData.tipOrConvenienceIndicator ? (
          <div
            className={`flex flex-col gap-1 ${
              qrisData.tipOrConvenienceIndicator.value < 2 ||
              qrisData.tipOrConvenienceIndicator.value > 3
                ? "hidden"
                : ""
            }`}
          >
            {qrisData.tipOrConvenienceIndicator.value == "02" && (
              <div className="flex flex-row items-center gap-1">
                <span className="rounded text-xs bg-slate-700 p-0.5">
                  {qrisData.tipOrConvenienceIndicator.value == "02"
                    ? `56${zPad(qrisData.fixedFee.value.length)}`
                    : `57${zPad(qrisData.percentFee.value.length)}`}
                </span>
                {qrisData.tipOrConvenienceIndicator.value == "02"
                  ? "Fixed Tax"
                  : "Percent Tax"}
              </div>
            )}

            <input
              disabled
              type="text"
              value={
                qrisData.tipOrConvenienceIndicator.value == "02"
                  ? `${
                      getCountryCurrency(qrisData.currency.value).symbolPendek
                    } ${qrisData.fixedFee.value}`
                  : qrisData.percentFee?.value
                  ? `${qrisData.percentFee.value}% (${
                      getCountryCurrency(qrisData.currency.value).symbolPendek
                    } ${
                      (qrisData.percentFee.value *
                        qrisData.transactionAmount.value) /
                      100
                    })`
                  : ""
              }
            />
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}
