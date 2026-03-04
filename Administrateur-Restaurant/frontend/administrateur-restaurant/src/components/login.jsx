import React from 'react'

const login = () => {
  return (
    <>
<div className="flex justify-center items-center h-screen">
  <div className="xl:w-[700px] px-10 h-[400px] rounded-3xl xl:shadow-xl">
    <h1 className="text-center text-3xl font-bold mt-2 mb-2">Login</h1>
    <hr />
    <div className="flex justify-center mt-10">
      <form action="">
        <input type="text" name="" id="" className="py-3 p-5 rounded-md  bg-zinc-50 md:w-[500px] w-[300px] outline-indigo-400" placeholder="Enter your email" />
        <br /><br />
        <input type="text" name="" id="" className="py-3 p-5 rounded-md  bg-zinc-50 md:w-[500px] w-[300px] outline-indigo-400" placeholder="Enter your password" />

        <div className="flex justify-end mt-3 mb-4">
          <a href="#" className="text-blue-700">Forgot password</a>
        </div>

        <button type="submit" className="py-3 bg-indigo-400 text-white w-full rounded-md font-bold">Submit</button>
      </form>
    </div>
  </div>
</div>
    </>
  )
}

export default login