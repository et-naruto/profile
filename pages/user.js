import { useRouter } from 'next/router'
import { StarIcon, ArrowLeftIcon } from '@primer/octicons-react'
import Head from 'next/head'
import { useState, useEffect } from 'react'
import React from 'react'
import useSWR from 'swr'
import toast, { Toaster } from 'react-hot-toast'

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
    `https://api.github.com/users/${id}/repos?per_page=8&sort=stargazers_count`,
    fetcher
  )

  const { data: userData, error: userError } = useSWR(
    `https://api.github.com/users/${id}`,
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

  // If repo.length is 0, show a message
  if (repos.length < 1) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-nice-white px-6">
        <h1 className="text-center text-2xl font-bold text-black">
          {' '}
          No repos found for {id}
        </h1>
        {error ? (
          <p className="mt-3 text-center font-mono text-xl font-bold text-red-500">
            {error.message}
          </p>
        ) : null}

        <a href="/">
          <button className="mt-4 rounded-md border bg-gray-100 px-2 py-1 font-mono hover:border-gray-300 hover:bg-gray-200">
            Go Back
          </button>
        </a>
      </div>
    )
  }

  return (
    <>
      <div className="h-screen bg-nice-white">
        <Head>
          <title>{id}</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <div class="flex justify-center">
          {/* Get user avatar image */}
          <img
            className="w-custom mt-7 rounded-full shadow-lg"
            src={userData?.avatar_url}
            alt="User avatar"
          />
        </div>
        <div class="mt-3 flex justify-center">
          <a href={userData?.html_url}>
            <p class="font-mono text-3xl font-bold hover:text-gray-700">{userData?.login}</p>
          </a>
        </div>

        <div className="pb-3 flex flex-col items-center justify-center bg-nice-white py-2">
          <div className="container mx-auto px-9">
            <div className="grid gap-3 lg:grid-cols-4">
              {repos.map((repo) => (
                <div
                  className="mt-8 cursor-pointer rounded-xl border bg-white p-6 hover:shadow-lg"
                  key={repo.id}
                >
                  <a href={repo.html_url}>
                    <h1 className="break-all font-mono text-xl font-bold">
                      {repo.name}
                    </h1>
                    <p className="text-gray-60 mb-4 break-all text-sm">
                      {repo.description}
                    </p>

                    <span className="inline-block align-bottom font-mono">
                      <p className="text-sm ">
                        <span className="mr-4 font-mono">
                          Language: {repo.language}
                        </span>{' '}
                        Stars: {repo.stargazers_count}
                      </p>
                    </span>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
