"use client";
import Image from 'next/image'
import { checkQRIS, validate } from '@/lib/qris';
import { useEffect, useState } from 'react'
import countries from '../lib/countries.json'
import { dynamicSort } from '@/lib/others';
// let str = "00020101021126660014ID.LINKAJA.WWW011893600911002000451602152103121300045160303UMI51450015ID.OR.GPNQR.WWW02150000000000000000303UMI520454995802ID5903SGB6007JAKARTA610510110621007063282835303360630489C4"
//let str = "00020101021151440014ID.CO.QRIS.WWW0215ID10200384380620303UMI5204737253033605802ID5910Zera Store6015Kota Balikpapan61057611663042CFE"
export default function Home() {
  const [qris, setQris] = useState("")
  const [qrisData, setQrisData] = useState({})
  const [con, setCountry] = useState([])
  const handleQris = (e) => {
    setQris(e.target.value)
  }
  countries.sort(dynamicSort("common"))

  const handleChangeCurrency = (e) => {

  }
  const handleChangeCountry = (e) => {

  }
  useEffect(() => {

    if (qris.length > 0) {
      if (validate(qris)) {
        let x = checkQRIS({}, qris)
        setQrisData(x)
      }
      // console.log(country)
    } else {
    }
  }, [qris, con])
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
              <div className='flex flex-row items-center gap-1'><span className='rounded text-xs bg-slate-700 p-0.5'>59</span>Name</div>
              <input type="text" defaultValue={qrisData.merchantName ? qrisData.merchantName.value : ''} />
            </div>
            <div className='flex flex-col gap-1'>
              <div className='flex flex-row items-center gap-1'><span className='rounded text-xs bg-slate-700 p-0.5'>60</span>City</div>
              <input type="text" defaultValue={qrisData.merchantCity ? qrisData.merchantCity.value : ''} />
            </div>

            <div className='flex flex-col gap-1'>
              <div className='flex flex-row items-center gap-1'><span className='rounded text-xs bg-slate-700 p-0.5'>61</span>Postal Code</div>
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
          </div>
        </div>
      </div>
    </main>
  )
}
