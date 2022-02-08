import Head from 'next/head'
import Router from 'next/router'
import { useState, useEffect } from 'react'

export default function Home() {
  const [username, setUsername] = useState('')
  const handleChange = (e) => setUsername(e.target.value)
  return (
    <>
      <div className="flex min-h-screen flex-col items-center justify-center p-8 bg-nice-white">
        <Head>
          <title>GitHub Profile</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <div >
          <form
           className="rounded-lg border text-center font-mono  shadow-xl outline-0 active:border-gray-200	"
            onSubmit={(e) => {
              e.preventDefault()
              Router.push({
                pathname: '/user',
                query: { id: username },
              })
            }}
          >
            <input
              label='username'
              name="username"
              type="text"
              onChange={handleChange}
              className=" py-3 px-5 rounded-lg text-center font-mono text-xl outline-0 	"
            />
          </form>
        </div>
      </div>
    </>
  )
}
