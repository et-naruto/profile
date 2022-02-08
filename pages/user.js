import { useRouter } from 'next/router'
import { StarIcon } from '@primer/octicons-react'
import Head from 'next/head'
import { useState, useEffect } from 'react'
import React from 'react'
import useSWR from 'swr'

const fetcher = async (url) => {
  const res = await fetch(url)

  // If the status code is not in the range 200-299,
  // we still try to parse and throw it.
  if (!res.ok) {
    const error = new Error('An error occurred while fetching the data.')
    // Attach extra info to the error object.
    error.info = await res.json()
    error.status = res.status
    // Redirect to /
    throw error
  }

  return res.json()
}

export default function User() {
  const router = useRouter()
  const { id } = router.query
  // Fetch user's repo using GITHUB API v3 using swr
  const { data, error } = useSWR(
    `https://api.github.com/users/${id}/repos`,
    fetcher
  )

  // Set the initial state of the component
  const [repos, setRepos] = useState([])
  // Load the repos when the component is mounted
  useEffect(() => {
    if (data) {
      setRepos(data)
    }
  }, [data])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <Head>
        <title>{id}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="">
      {error ? <p className='text-red-400'>User is unavaliable</p> : null}
        {repos.map((repo) => (
          <div
            className="mt-8 rounded-2xl border p-6 font-mono shadow-xl"
            key={repo.id}
          >
            <h1 className="text-2xl font-bold">{repo.name}</h1>
            <p className="text-md font-semibold">{repo.description}</p>
            <p className="text-sm ">{repo.language}</p>

            <p className="text-sm">
              <StarIcon className="text-sm" /> {repo.stargazers_count}
            </p>
          </div>
        ))}
      </main>
    </div>
  )
}
