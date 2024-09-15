"use client";
import Image from 'next/image'
import { checkQRIS, validate } from '@/lib/qris';
import { useEffect, useState } from 'react'
import ReadOnlyData from '../components/ReadOnlyData';
import EditData from '../components/EditData';
import Footer from '../components/Footer';
import merchantcategorycode from "../lib/mcc.json";
import QrCode from 'qrcode-reader'

export default function Home() {
  const [qris, setQris] = useState("")
  const [q, setQ] = useState("")
  const [qrisData, setQrisData] = useState({})

  const [newQris, setNewQris] = useState("")
  const [newQrisData, setNewQrisData] = useState("")

  const [qrisValid, setQrisValid] = useState(false)
  const [errMsg, setErrMsg] = useState("")
  const handleQ = (e) => {
    setQ(e.target.value)
    setQris(e.target.value)
  }
  const readQrisData = (qris, u = false) => {
    const isValid = validate(qris)
    const tempQrisData = checkQRIS({}, qris)
    setQrisValid(isValid && (tempQrisData.lengthData == qris.length) && !tempQrisData.invalid)
    if (isValid) {
      let x = tempQrisData
      if (u) setQrisData(x)
      setNewQris(qris)
      setNewQrisData(x)
    }
  }
  const uploadToClient = (e) => {
    setErrMsg("")
    let files = [...e.target.files];
    if (files && files.length == 1) {
      if (!files[0].type.includes("image")) {
        setErrMsg("File should be an image")
        return
      };
      const blob = new Blob(files, { type: files[0].type })
      const img = URL.createObjectURL(blob);
      const qr = new QrCode()
      qr.callback = function (error, result) {
        if (error) {
          setErrMsg(error)
          return;
        }
        if (validate(result?.result)) {
          setQris(result?.result)
          readQrisData(result?.result, true)
          return;
        }
        setErrMsg("Seems not a valid QRIS")
        return;
      }
      qr.decode(img)
      return;
    }
    setErrMsg("File 1 ja")
    return
  }
  const pushNewQrisData = (data) => {
    let tmep = data
    setNewQris(tmep)
  }
  useEffect(() => {
    readQrisData(newQris)
  }, [newQris])
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className='flex flex-col-reverse	lg:flex-row gap-4 pt-1'>
        <div className='flex flex-col gap-5'>
          <h1 class="bg-gradient-to-r from-blue-600 via-green-500 to-indigo-400 inline-block text-transparent bg-clip-text text-4xl sm:text-4xl font-extrabold text-center">PlayQRIS </h1>

          <div className='flex flex-col gap-2 p-5 bg-slate-900 rounded-lg'>
            <h1 className='font-bold'>QRIS DATA</h1>
            <input onChange={uploadToClient} type="file" className="text-white text-sm w-full border border-slate-800" accept="image/png, image/jpeg, image/jpg" />
            <div className='text-xs w-full text-center'>OR</div>
            <textarea className='p-2 text-black w-full rounded text-xs resize-none h-28'
              onChange={
                (e) =>
                  handleQ(e)

              } value={qris} spellCheck={false}>
            </textarea>
            <button onClick={() => { readQrisData(qris, true) }} className='bg-emerald-500 py-1 rounded hover:bg-emerald-400 transition-all'>Read Data</button>
            {errMsg ? <div className='text-center bg-red-500 text-sm'>{errMsg}</div> : ""}
          </div>
          {newQris && (<div className={`flex flex-col gap-2 p-5 bg-slate-900 rounded-lg `}>
            <h1 className='font-bold'>Result</h1>

            <textarea className='p-2 text-black w-full rounded text-xs resize-none h-28'
              value={newQris}
              spellCheck={false}
              readOnly
            >

            </textarea>
            <h1 className='font-bold'>QR Code</h1>
            <Image
              src={`https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${newQris}`}
              width={300}
              height={300}
              alt="QRIS"
            />
          </div>)}
        </div>
        <div className="flex flex-col gap-3 items-start justify-center">
          {qris == ""
            ? ""
            : !qrisValid || qrisData?.invalid || errMsg
              ? errMsg || "Invalid QRIS"
              : <>
                <ReadOnlyData merchantcategorycode={merchantcategorycode} qrisData={qrisData} />
                <EditData merchantcategorycode={merchantcategorycode} newQrisData={newQrisData} newQris={newQris} pushNewQrisData={pushNewQrisData} />
              </>
          }

          {/* {qris == "" ? "" : !qrisValid || qrisData?.invalid || errMsg ? errMsg || "Invalid QRIS" : <EditData merchantcategorycode={merchantcategorycode} newQrisData={newQrisData} newQris={newQris} pushNewQrisData={pushNewQrisData} />} */}
        </div>
      </div>
      <Footer />
    </main>
  )
}
