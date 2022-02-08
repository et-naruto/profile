import Head from 'next/head'
import Router from 'next/router'
import { useState, useEffect } from 'react'

export default function Home() {
  const [username, setUsername] = useState('');
  const handleChange = e => setUsername(e.target.value);
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            Router.push({
              pathname: '/user',
              query: { id: username },
            })
          }}
        >
          <input name="username" type="text" onChange={handleChange} className="py-3 px-5 text-3xl rounded-md shadow-xl border active:border-gray-200 font-mono text-center outline-0	" />
        </form>
      </main>
    </div>
  )
}
