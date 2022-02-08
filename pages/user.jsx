import { useRouter } from 'next/router'
import { StarIcon, ArrowLeftIcon } from '@primer/octicons-react'
import Head from 'next/head'
import { useState, useEffect } from 'react'
import React from 'react'
import useSWR from 'swr'
import toast, { Toaster } from 'react-hot-toast'

const notify = () =>
  toast.error(
    <span>
      <a href="/">
        <button className="rounded-md border bg-gray-100 px-2 py-1 font-mono hover:border-gray-300 hover:bg-gray-200">
          {' '}
          Go Back{' '}
        </button>{' '}
      </a>
    </span>
  )

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
    `https://api.github.com/users/${id}/repos?per_page=8`,
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

  // notify() on load
  useEffect(() => {
    notify()
  }, [])

  return (
    <>
      <Head>
        <title>{id}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div></div>

      <div className="flex min-h-screen flex-col items-center justify-center bg-nice-white py-2">
        <div className="container mx-auto px-9">
          <div className="grid gap-3 lg:grid-cols-4">
            {repos.map((repo) => (
              <div
                className="cursor-pointer mt-8 rounded-xl border bg-white p-6 hover:shadow-lg"
                key={repo.id}
              >
                <a href={repo.html_url}>
                  <h1 className="font-mono text-2xl font-bold">{repo.name}</h1>
                  <p className="text-gray-60 mb-4 text-sm">
                    {repo.description}
                  </p>

                  <span className="inline-block align-bottom font-mono">
                    <p className="text-sm ">
                      <span className="mr-4 font-mono">{repo.language}</span>{' '}
                      Stars: {repo.stargazers_count}
                    </p>
                  </span>
                </a>
              </div>
            ))}
          </div>
        </div>

        {error ? (
          <>
            <p className="font-mono text-xl font-bold text-black">
              User is unavaliable
            </p>
            <p className="text-center font-mono text-xl font-bold text-red-400">
              {error.message}
            </p>
            <Toaster />
          </>
        ) : null}
      </div>
    </>
  )
}
