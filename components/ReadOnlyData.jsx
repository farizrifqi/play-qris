"use client";
import { zPad } from "@/lib/others";
import countries from "../lib/countries.json";

const countryMap = new Map(countries.map(c => [c.cca2, c]));
const currencyMap = new Map(countries.map(c => [c.ccn3, c]));

function getCountryName(countryCode) {
  return countryMap.get(countryCode)?.name.common ?? "";
}

function getCurrencyInfo(currencyCode) {
  const country = currencyMap.get(currencyCode);
  if (!country) return null;
  const code = Object.keys(country.currencies)[0];
  return {
    symbol: country.currencies[code].symbol,
    code,
    name: country.currencies[code].name,
  };
}

function getMerchantCategoryName(code, merchantcategorycode) {
  return merchantcategorycode.find(c => c.id === code)?.description ?? "Unknown";
}

const TIP_INDICATOR_MEANING = {
  "01": "Customer Input",
  "02": "Fixed",
  "03": "In Percent",
};

function DataField({ label, tag, value, suffix = "" }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex flex-row items-center gap-1">
        <span className="rounded text-xs bg-slate-700 p-0.5 font-mono">
          {tag}
        </span>
        <span className="text-slate-300">{label}</span>
      </div>
      <input
        disabled
        type="text"
        className="bg-slate-800 border border-slate-700 rounded px-2 py-1.5 text-sm text-slate-300"
        value={(value ?? '') + suffix}
      />
    </div>
  );
}

export default function ReadOnlyData({ merchantcategorycode, qrisData }) {
  const currencyInfo = qrisData.currency?.value
    ? getCurrencyInfo(qrisData.currency.value)
    : null;

  const isStatic = qrisData.method?.value === "11";
  const isDynamic = qrisData.method?.value === "12";

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3 text-sm">
        <span className="text-slate-400">
          Version: {qrisData.ver?.value ?? "—"}
        </span>
        <span className="text-slate-400">•</span>
        <span className={`font-medium ${isDynamic ? "text-emerald-400" : "text-blue-400"}`}>
          {isStatic ? "Static" : isDynamic ? "Dynamic" : "—"}
        </span>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-slate-300 border-b border-slate-700 pb-1 mb-3">
          Merchant Information
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {qrisData.merchantName && (
            <DataField
              label="Name"
              tag={qrisData.merchantName.tags + zPad(qrisData.merchantName.value.length)}
              value={qrisData.merchantName.value}
            />
          )}
          {qrisData.categoryMerchant && (
            <DataField
              label="Category"
              tag={qrisData.categoryMerchant.tags + zPad(qrisData.categoryMerchant.value.length)}
              value={getMerchantCategoryName(qrisData.categoryMerchant.value, merchantcategorycode)}
            />
          )}
          {qrisData.merchantCity && (
            <DataField
              label="City"
              tag={qrisData.merchantCity.tags + zPad(qrisData.merchantCity.value.length)}
              value={qrisData.merchantCity.value}
            />
          )}
          {qrisData.postalCode && (
            <DataField
              label="Postal"
              tag={qrisData.postalCode.tags + zPad(qrisData.postalCode.value.length)}
              value={qrisData.postalCode.value}
            />
          )}
          {qrisData.countryCode && (
            <DataField
              label="Country"
              tag={qrisData.countryCode.tags + zPad(qrisData.countryCode.value.length)}
              value={getCountryName(qrisData.countryCode.value)}
            />
          )}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-slate-300 border-b border-slate-700 pb-1 mb-3">
          Transaction Information
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {qrisData.currency && currencyInfo && (
            <DataField
              label="Currency"
              tag={qrisData.currency.tags + zPad(qrisData.currency.value.length)}
              value={`(${currencyInfo.symbol}) ${currencyInfo.code} - ${currencyInfo.name}`}
            />
          )}
          {qrisData.transactionAmount && isDynamic && (
            <DataField
              label="Amount"
              tag={`54${zPad(qrisData.transactionAmount.value.length)}`}
              value={qrisData.transactionAmount.value}
              suffix={currencyInfo ? ` ${currencyInfo.symbol}` : ""}
            />
          )}
          {qrisData.tipOrConvenienceIndicator && (
            <DataField
              label="Tip Indicator"
              tag={`55${zPad(qrisData.tipOrConvenienceIndicator.value.length)}`}
              value={TIP_INDICATOR_MEANING[qrisData.tipOrConvenienceIndicator.value] ?? "—"}
            />
          )}
          {qrisData.tipOrConvenienceIndicator?.value === "02" && qrisData.fixedFee && (
            <DataField
              label="Fixed Fee"
              tag={`56${zPad(qrisData.fixedFee.value.length)}`}
              value={qrisData.fixedFee.value}
              suffix={currencyInfo ? ` ${currencyInfo.symbol}` : ""}
            />
          )}
          {qrisData.tipOrConvenienceIndicator?.value === "03" && qrisData.percentFee && (
            <DataField
              label="Percent Fee"
              tag={`57${zPad(qrisData.percentFee.value.length)}`}
              value={`${qrisData.percentFee.value}%`}
            />
          )}
        </div>
      </div>

      {qrisData.additional && Object.keys(qrisData.additional).length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-slate-300 border-b border-slate-700 pb-1 mb-3">
            Additional Data
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {Object.entries(qrisData.additional).map(([key, field]) => {
              if (key === "lengthData" || key === "invalid") return null;
              return (
                <DataField
                  key={key}
                  label={key}
                  tag={field.tags + zPad(field.value.length)}
                  value={field.value}
                />
              );
            })}
          </div>
        </div>
      )}

      {qrisData.merchantAccount && (
        <div>
          <h3 className="text-sm font-semibold text-slate-300 border-b border-slate-700 pb-1 mb-3">
            Merchant Account
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {Object.entries(qrisData.merchantAccount).map(([tag, account]) => (
              <div key={tag} className="flex flex-col gap-1">
                <span className="text-xs text-slate-400">Tag {tag}</span>
                <div className="bg-slate-800 border border-slate-700 rounded px-2 py-1.5 text-xs text-slate-400 font-mono break-all">
                  {JSON.stringify(account, null, 0).slice(0, 100)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
