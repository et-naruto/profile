import { useRouter } from 'next/router'
import { StarIcon, ArrowLeftIcon } from '@primer/octicons-react'
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
    `https://api.github.com/users/${id}/repos?per_page=8&sort=stargazers_count`,
    fetcher
  )

  const { data: starsData, error: starsError } = useSWR(
    `https://api.github.com/users/${id}/repos`,
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

  // Get total repository count

  // Get total stargazers from all repos
  const [stars, setStars] = useState(0)
  // Load the stars when the component is mounted
  useEffect(() => {
    if (starsData) {
      setStars(starsData.reduce((acc, curr) => acc + curr.stargazers_count, 0))
    }
  }, [starsData])

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
      <div className="h-screen">
        <Head>
          <title>{id}</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <div class="flex flex-col items-center justify-center bg-blue-gray pb-6">
          {/* Get user avatar image */}
          <img
            className="w-custom mt-7 rounded-full border border-4 border-sky-400/100"
            src={userData?.avatar_url}
            alt="User avatar"
          />
          <a href={userData?.html_url}>
            <p class="mt-1 font-mono text-3xl font-bold text-white hover:text-gray-200">
              {userData?.login}
            </p>
          </a>

          <div className="mt-3">
            <div className="grid gap-3 lg:grid-cols-3">
              <div className="rounded border border-gray-600 px-4 py-2 text-center">
                <p class="font-mono text-sm font-bold text-white hover:text-gray-200">
                  Followers
                </p>
                <p class="font-mono text-sm font-bold text-gray-300 hover:text-gray-200">
                  {userData?.followers}
                </p>
              </div>

              <div className="rounded border border-gray-600 px-4 py-2 text-center">
                <p class="font-mono text-sm font-bold text-white hover:text-gray-200">
                  Stars
                </p>
                <p class="font-mono text-sm font-bold text-gray-300 hover:text-gray-200">
                  {stars}
                </p>
              </div>

              <div className="rounded border border-gray-600 px-4 py-2 text-center">
                <p class="font-mono text-sm font-bold text-white hover:text-gray-200">
                  Repositories
                </p>
                <p class="font-mono text-sm font-bold text-gray-300 hover:text-gray-200">
                {userData?.public_repos}
                </p>
              </div>

            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center bg-nice-white pb-10">
          <div className="container mx-auto px-6">
            <div className="grid gap-3 lg:grid-cols-4">
              {repos.map((repo) => (
                <div
                  className="transition ease-in-out delay-30 duration-100 mt-8 cursor-pointer rounded-xl border bg-white p-6 hover:shadow-lg"
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
