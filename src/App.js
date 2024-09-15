import { useState } from 'react';
import './App.css';
import axios from 'axios'
import * as XLSX from 'xlsx'

function App() {

  const [msg, setMsg] = useState("")
  const [status, setStatus] = useState(false)
  const [emailList, setEmaillist] = useState([])

  function handlemsg(event) {
    setMsg(event.target.value)
  }

  function handleFile(event) {
    const xlfile = event.target.files[0]
    console.log(xlfile)

    const reader = new FileReader()
    reader.onload = function (event) {
      const data = event.target.result
      const workbook = XLSX.read(data, { type: "binary" });

      const sheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[sheetName]
      const emailList = XLSX.utils.sheet_to_json(worksheet, { header: "A" })
      const totalEmail = emailList.map(function (item) {
        return item.A
      })
      console.log(totalEmail)
      setEmaillist(totalEmail)
    }

    reader.readAsBinaryString(xlfile)

  }

  function send() {
    setStatus(true)
    axios.post("http://localhost:5000/sendemail", { msg: msg, emailList: emailList })
      .then(function (data) {
        if (data.data === true) {
          alert("Email send Successfully")
          setStatus(false)
        }
        else {
          alert("Failed ")
        }
      })
  }
  return (
    <div className="App">
      <div className='bg-[#1c2c50] text-[#0ea6ec] text-center'>
        <h1 className='text-2xl font-medium px-5 py-3'> BULKMAIL </h1>
      </div>
      <div className='bg-gradient-to-r from-cyan-400 to-blue-800 flex flex-col justify-center items-center'>
        <div className=' text-[#0f1729] text-center text-xl'>
          <h1 className='font-medium px-5 py-3'> We can help your Business with sending multiple emails at once </h1>
        </div>
        <div className='bg-[#ddd] rounded-md'>
          <div className=' text-[#0f1729] text-center'>
            <h1 className='font-medium px-5 py-3'> Drag and Drop </h1>
          </div>
          <div className=' text-black flex flex-col items-center px-5 py-3'>
            <textarea id="input-wrapper" onChange={handlemsg} value={msg} className='w-[90%] box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25) h-32 py-2 px-2 outline-none border border-black rounded' placeholder='Enter the email text here...' ></textarea>
            <div>
              <input onChange={handleFile} type="file" className='border border-dashed border-3 py-2 px-2 mx-5 my-5 border-[#0ea6ec]' />
            </div>
            <p>Total Emails in the file : {emailList.length}</p>
            <button onClick={send} className='bg-[#1c2c50] mt-2 px-2 py-2 text-white font-medium rounded-md w-fit'>{status ? "Sending..." : "Send"}</button>
          </div>
        </div>
        <div className=' text-white text-center p-8'>
        </div>
        <div className=' text-white text-center p-8'>
        </div>
      </div>
    </div>
  );
}

export default App;
