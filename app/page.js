"use client";
import Image from 'next/image'
import { checkQRIS, validate } from '@/lib/qris';
import { useEffect, useState } from 'react'
import countries from '../lib/countries.json'
import { dynamicSort, zPad } from '@/lib/others';

export default function Home() {
  const [qris, setQris] = useState("")
  const [qrisData, setQrisData] = useState({})

  countries.sort(dynamicSort("common"))

  // Handle Form
  const handleQris = (e) => {
    setQris(e.target.value)
    if (validate(e.target.value)) {
      let x = checkQRIS({}, e.target.value)
      setQrisData(x)
    }

  }
  const handleChangeCurrency = (e) => {

  }
  const handleChangeCountry = (e) => {

  }
  const handleMerchantName = (e) => {
    var temp = { ...qrisData }
    temp.merchantName.value = e.target.value
    setQrisData(temp)
  }
  useEffect(() => {

  }, [qris, qrisData])
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-16">
      <div className='flex flex-row gap-4'>
        <div className='flex flex-col gap-5'>
          <div className='flex flex-col gap-2 p-5 bg-slate-900 rounded-lg'>
            <h1 className='font-bold'>QRIS DATA</h1>
            <textarea className='p-2 text-black w-full rounded text-xs resize-none h-24'
              onChange={
                (e) => {
                  handleQris(e)
                }
              } spellCheck={false}>
            </textarea>
          </div>
          <div className={`flex flex-col gap-2 p-5 bg-slate-900 rounded-lg ${validate(qris) ? 'block' : 'hidden'}`}>
            <h1 className='font-bold'>QR CODE</h1>
            <Image
              src={`https://chart.googleapis.com/chart?cht=qr&chl=${qris}&chs=500x500&choe=UTF-8&chld=L|2%22%20rel=%22nofollow%22%20alt=%22qr%20code%22`}
              width={300}
              height={300}
              alt="QRIS"
            />
          </div>
        </div>
        <div className='flex flex-col gap-2 p-5 bg-slate-900 rounded-lg text-sm'>
          <span>Version: {qrisData.ver ? parseInt(qrisData.ver.value) : ''}</span>
          <span>Type: {qrisData.method ? (parseInt(qrisData.method.value) == 11 ? "Static" : parseInt(qrisData.method.value) == 12 ? "Dynamic" : parseInt(qrisData.method.value)) : ''}</span>

          <div className='grid grid-cols-3 gap-2'>
            <div className='flex flex-col gap-1'>
              <div className='flex flex-row items-center gap-1'><span className='rounded text-xs bg-slate-700 p-0.5'>{qrisData.merchantName ? qrisData.merchantName.tags + zPad(qrisData.merchantName.value.length) : "5900"}</span>Name</div>
              <input type="text" onChange={(e) => (handleMerchantName(e))} value={qrisData.merchantName ? qrisData.merchantName.value : ''} />
            </div>
            <div className='flex flex-col gap-1'>
              <div className='flex flex-row items-center gap-1'><span className='rounded text-xs bg-slate-700 p-0.5'>{qrisData.merchantCity ? qrisData.merchantCity.tags + zPad(qrisData.merchantCity.value.length) : "6000"}</span>City</div>
              <input type="text" defaultValue={qrisData.merchantCity ? qrisData.merchantCity.value : ''} />
            </div>

            <div className='flex flex-col gap-1'>
              <div className='flex flex-row items-center gap-1'><span className='rounded text-xs bg-slate-700 p-0.5'>{qrisData.postalCode ? qrisData.postalCode.tags + zPad(qrisData.postalCode.value.length) : "6100"}</span>Postal Code</div>
              <input type="text" defaultValue={qrisData.postalCode ? qrisData.postalCode.value : ''} />
            </div>
            <div className='flex flex-col gap-1'>
              <div className='flex flex-row items-center gap-1'><span className='rounded text-xs bg-slate-700 p-0.5'>61</span>Country</div>
              <select value={qrisData.countryCode ? qrisData.countryCode.value : ''} onChange={(e) => { handleChangeCountry(e) }}>
                {
                  countries.map((c, i) => (
                    <option key={i} value={c.cca2}>{c.name.common}</option>
                  ))
                }
              </select>
            </div>
            <div className='flex flex-col gap-1'>
              <div className='flex flex-row items-center gap-1'><span className='rounded text-xs bg-slate-700 p-0.5'>53</span>Currency</div>
              <select value={qrisData.currency ? qrisData.currency.value : ''} onChange={(e) => { handleChangeCurrency(e) }}>
                {
                  countries.map((c, i) => (
                    <option key={i} value={c.ccn3}>{c.name.common} &ndash; {Object.keys(c.currencies)[0]}</option>
                  ))
                }
              </select>
            </div>
            <div className={`flex flex-col gap-1 ${qrisData.method && qrisData.method.value == "11" ? 'hidden' : ''}`}>
              <div className='flex flex-row items-center gap-1'><span className='rounded text-xs bg-slate-700 p-0.5'>54</span>Amount</div>
              <input type="text" defaultValue={qrisData.transactionAmount ? qrisData.transactionAmount.value : ''} />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
