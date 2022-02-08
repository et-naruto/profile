import Head from 'next/head'
import Router from 'next/router'
import { useState, useEffect } from 'react'

export default function Home() {
  const [username, setUsername] = useState('')
  const handleChange = (e) => setUsername(e.target.value)
  return (
    <>
      <div className="flex min-h-screen flex-col items-center justify-center bg-nice-white p-8">
        <Head>
          <title>GitHub Profile</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <div>
          <h1 className="text-3xl font-bold mb-2 text-center font-mono">GitHub Profile</h1>
          <p className="text-md text-gray-500 font-semibold mb-2 text-center font-mono">Heads up! There is a 60 times request limit.</p>
          <form
            className="rounded-lg bg-white border border-gray-500 text-center font-mono  shadow-xl outline-0 active:border-gray-600	"
            onSubmit={(e) => {
              e.preventDefault()
              Router.push({
                pathname: '/user',
                query: { id: username },
              })
            }}
          >
            <input
              label="username"
              name="username"
              type="text"
              placeholder="GitHub username"
              onChange={handleChange}
              className=" rounded-lg py-3 px-5 text-center font-mono text-xl outline-0 	"
            />
          </form>
        </div>
      </div>
    </>
  )
}
