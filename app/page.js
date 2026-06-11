"use client";
import Image from "next/image";
import { checkQRIS, validate } from "@/lib/qris";
import { useEffect, useState } from "react";
import ReadOnlyData from "@/components/ReadOnlyData";
import EditData from "@/components/EditData";
import merchantcategorycode from "@/lib/mcc.json";
import QrCode from "qrcode-reader";

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "PlayQRIS",
  url: "https://play-qris.vercel.app",
  description:
    "Read, validate, and edit QRIS (Indonesian QR Code Standard) payment data.",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  author: {
    "@type": "Person",
    name: "Fariz Rifqi",
    url: "https://github.com/farizrifqi",
  },
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
};

export default function Home() {
  const [qris, setQris] = useState("");
  const [q, setQ] = useState("");
  const [qrisData, setQrisData] = useState({});

  const [newQris, setNewQris] = useState("");
  const [newQrisData, setNewQrisData] = useState("");

  const [qrisValid, setQrisValid] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const handleQ = (e) => {
    setQ(e.target.value);
    setQris(e.target.value);
  };

  const readQrisData = (qris, u = false) => {
    const isValid = validate(qris);
    const tempQrisData = checkQRIS({}, qris);
    setQrisValid(
      isValid && (tempQrisData.lengthData == qris.length) && !tempQrisData.invalid
    );
    if (isValid) {
      let x = tempQrisData;
      if (u) setQrisData(x);
      setNewQris(qris);
      setNewQrisData(x);
    }
  };

  const uploadToClient = async (e) => {
    setErrMsg("");
    setIsLoading(true);
    try {
      let files = [...e.target.files];
      if (files && files.length == 1) {
        if (!files[0].type.includes("image")) {
          setErrMsg("File should be an image");
          setIsLoading(false);
          return;
        }
        const blob = new Blob(files, { type: files[0].type });
        const img = URL.createObjectURL(blob);
        const qr = new QrCode();
        qr.callback = function (error, result) {
          URL.revokeObjectURL(img);
          setIsLoading(false);
          if (error) {
            setErrMsg(error);
            return;
          }
          if (validate(result?.result)) {
            setQris(result?.result);
            readQrisData(result?.result, true);
            setShowResult(true);
            return;
          }
          setErrMsg("Seems not a valid QRIS");
          return;
        };
        qr.decode(img);
        return;
      }
      setErrMsg("Please select exactly one file");
      setIsLoading(false);
    } catch (error) {
      setErrMsg("Error processing image");
      setIsLoading(false);
    }
  };

  const pushNewQrisData = (data) => {
    setNewQris(data);
  };

  useEffect(() => {
    readQrisData(newQris);
  }, [newQris]);

  const resetForm = () => {
    setQris("");
    setQ("");
    setQrisData({});
    setNewQris("");
    setNewQrisData("");
    setQrisValid(false);
    setErrMsg("");
    setShowResult(false);
  };

  const ldJson = JSON.stringify(structuredData).replace(/</g, '\\u003c').replace(/>/g, '\\u003e');

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: ldJson }}
      />
      <main className="flex min-h-screen flex-col items-center justify-center bg-slate-950 text-white p-4">
      <div className="w-full max-w-4xl">
        <div className="mb-8">
          <h1 className="bg-gradient-to-r from-blue-600 via-green-500 to-indigo-400 inline-block text-transparent bg-clip-text text-5xl sm:text-6xl font-extrabold text-center mb-4">
            PlayQRIS
          </h1>
          <p className="text-center text-slate-400 max-w-md mx-auto">
            Read, validate, and edit QRIS (Indonesian QR Code Standard) payment data
          </p>
        </div>

        <div className="bg-slate-900 rounded-2xl shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
            {/* Left Panel - Input */}
            <div className="space-y-6">
              <div className="bg-slate-800 rounded-xl p-4">
                <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m2 0a2 2 0 100-4 2 2 0 000 4zm-6 4a2 2 0 100-4 2 2 0 000 4zm0 0v-4a2 2 0 012-2h2a2 2 0 012 2v4m-6 0a2 2 0 100-4 2 2 0 000 4zm0 0v-4a2 2 0 012-2h2a2 2 0 012 2v4m-6 0a2 2 0 100-4 2 2 0 000 4z" />
                  </svg>
                  Input QRIS Data
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Upload QRIS Image
                    </label>
                    <input
                      type="file"
                      accept="image/png, image/jpeg, image/jpg"
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onChange={uploadToClient}
                      disabled={isLoading}
                    />
                    {isLoading && (
                      <div className="flex items-center mt-2">
                        <div className="animate-spin rounded-full w-4 h-4 border-b-2 border-blue-500"></div>
                        <span className="ml-2 text-sm text-blue-400">Processing...</span>
                      </div>
                    )}
                    <p className="text-xs text-slate-500 mt-1">
                      Supported formats: PNG, JPG, JPEG
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Or Paste QRIS Code
                    </label>
                    <textarea
                      rows="4"
                      placeholder="Paste QRIS code here (starts with 000201 or 000202)..."
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      value={qris}
                      onChange={handleQ}
                      spellCheck={false}
                      disabled={isLoading}
                    />
                    <div className="flex items-center mt-2">
                      <button
                        onClick={() => {
                          readQrisData(qris, true);
                          setShowResult(true);
                        }}
                        className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-2 px-4 rounded-lg transition-all disabled:opacity-50"
                        disabled={isLoading || !qris.trim()}
                      >
                        Read Data
                      </button>
                    </div>
                  </div>

                  {errMsg && (
                    <div className="bg-red-900/50 border border-red-500 text-red-400 px-4 py-3 rounded-lg text-sm">
                      {errMsg}
                    </div>
                  )}
                </div>
              </div>

              {showResult && !qrisValid && (
                <div className="bg-red-900/50 border border-red-500 text-red-400 px-4 py-3 rounded-lg">
                  Invalid QRIS Code. Please check the format and try again.
                </div>
              )}
            </div>

            {/* Right Panel - Results */}
            <div className="space-y-6">
              {qris && qrisValid && (
                <>
                  <div className="bg-slate-800 rounded-xl p-4">
                    <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
                      <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      QRIS Data Analysis
                    </h2>
                    <div className="space-y-4">
                      <ReadOnlyData
                        merchantcategorycode={merchantcategorycode}
                        qrisData={qrisData}
                      />
                    </div>
                  </div>

                  <div className="bg-slate-800 rounded-xl p-4">
                    <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
                      <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.1 0-2 .9-2 2s0 2 1.1 2m0 4v1m0-6v1m0 10v1M12 11V8m0 10V9m6-6a9 9 0 00-18 0 9 9 0 0018 0z" />
                      </svg>
                      Edit QRIS Data
                    </h2>
                    <EditData
                      newQrisData={newQrisData}
                      newQris={newQris}
                      pushNewQrisData={pushNewQrisData}
                    />
                    <div className="mt-4">
                      <button
                        onClick={() => {
                          if (newQris) {
                            setShowResult(false);
                          }
                        }}
                        className="w-full bg-gray-600 hover:bg-gray-500 text-white font-medium py-2 px-4 rounded-lg transition-all"
                      >
                        Back to Input
                      </button>
                    </div>
                  </div>
                </>
              )}

              {!qris && (
                <div className="bg-slate-800 rounded-xl p-16 text-center">
                  <div className="space-y-4">
                    <svg className="w-16 h-16 mx-auto text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m2 0a2 2 0 100-4 2 2 0 000 4zm-6 4a2 2 0 100-4 2 2 0 000 4zm0 0v-4a2 2 0 012-2h2a2 2 0 012 2v4m-6 0a2 2 0 100-4 2 2 0 000 4zm0 0v-4a2 2 0 012-2h2a2 2 0 012 2v4m-6 0a2 2 0 100-4 2 2 0 000 4z" />
                    </svg>
                    <p className="text-lg font-medium text-slate-400">
                      Ready to scan or enter QRIS data
                    </p>
                    <p className="text-sm text-slate-500 max-w-md mx-auto">
                      Upload a QRIS code image or paste the QRIS string to begin
                    </p>
                    <button
                      onClick={resetForm}
                      className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-all"
                    >
                      Clear & Start Over
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* QR Code Preview */}
        {newQris && (
          <div className="mt-8 bg-slate-900 rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-slate-800/50 px-6 py-4">
              <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.1 0-2 .9-2 2s0 2 1.1 2m0 4v1m0-6v1m0 10v1M12 11V8m0 10V9m6-6a9 9 0 00-18 0 9 9 0 0018 0z" />
                </svg>
                Generated QR Code Preview
              </h2>
            </div>
            <div className="flex items-center justify-center p-8">
              <div className="relative">
                <Image
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
                    newQris
                  )}`}
                  width={300}
                  height={300}
                  alt="QRIS Code"
                  className="rounded-lg shadow-lg border border-slate-700"
                />
                {/* Add a small overlay icon to indicate it's interactive */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur">
                    <svg className="w-6 h-6 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-slate-800/50 px-6 py-4 text-center text-sm text-slate-400">
              Share or scan this QRIS code to make payments
            </div>
          </div>
        )}

        <div className="mt-8 text-center text-slate-500 text-sm">
          <p>
            Built with <span className="text-red-400">♥</span> by Fariz Rifqi •{" "}
            <a href="https://github.com/farizrifqi/play-qris" className="text-blue-400 hover:underline">
              GitHub Repository
            </a>
          </p>
        </div>
      </div>
    </>
  );
}