import { useRouter } from 'next/router'
import { RepoIcon } from '@primer/octicons-react'
import Head from 'next/head'
import { useState, useEffect } from 'react'
import React from 'react'
import useSWR from 'swr'

const fetcher = async (url) => {
  // Authorization header is required for private repos
  const res = await fetch(url, {
    headers: {
      Authorization: `token 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`,
    },
  })

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
    `https://api.github.com/users/${id}/repos?per_page=8&sort=stargazers_count&direction=asc`,
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
      <>
        {error ? (
          <Head>
            <title>Error | {error.message}</title>
          </Head>
        ) : null}
        <div className="flex h-screen flex-col items-center justify-center bg-nice-white px-6">
          <h1 className="text-center text-2xl font-bold text-black">
            {' '}
            No users or orgs found for {id}
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
      </>
    )
  }

  return (
    <>
      <div className="h-screen bg-nice-white">
        <Head>
          <title>{id}</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <div className="flex h-90 flex-col items-center justify-center bg-blue-gray pt-10 pb-10">
          {/* Get user avatar image */}
          <img
            className="w-custom mt-7 rounded-full"
            src={userData?.avatar_url}
            alt="User avatar"
          />
          <a href={userData?.html_url}>
            <p className="mt-2 font-mono text-3xl font-bold text-white hover:text-gray-200">
              {userData?.login}
            </p>
          </a>

          <div className="mt-5">
            <div className="mx-6 grid grid-cols-3 gap-3">
              <div className="rounded border border-gray-600 bg-zinc-900 px-4 py-2  text-center">
                <p className="font-mono text-sm font-bold text-white">Followers</p>
                <p className="font-mono text-sm font-bold text-gray-300 ">
                  {userData?.followers}
                </p>
              </div>

              <div className="rounded border border-gray-600 bg-zinc-900 px-4 py-2 text-center">
                <p className="font-mono text-sm font-bold text-white ">Stars</p>
                <p className="font-mono text-sm font-bold text-gray-300 ">
                  {stars}
                </p>
              </div>

              <div className="rounded border border-gray-600 bg-zinc-900 px-4 py-2 text-center">
                <p className="font-mono text-sm font-bold text-white ">Repos</p>
                <p className="font-mono text-sm font-bold text-gray-300 ">
                  {userData?.public_repos}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/*
            <div className="grid gap-3 lg:grid-cols-3 -mt-3 mx-8 px-8">
              <div className="rounded shadow-lg bg-white px-4 py-2  text-center">
                <p className="font-mono text-sm font-bold text-black">Followers</p>
                <p className="font-mono text-sm font-bold text-gray-300 ">
                  {userData?.followers}
                </p>
              </div>

              <div className="rounded shadow-lg bg-white px-4 py-2 text-center">
                <p className="font-mono text-sm font-bold text-black ">Stars</p>
                <p className="font-mono text-sm font-bold text-gray-300 ">
                  {stars}
                </p>
              </div>

              <div className="rounded shadow-lg bg-white px-4 py-2 text-center">
                <p className="font-mono text-sm font-bold text-black ">Repos</p>
                <p className="font-mono text-sm font-bold text-gray-300 ">
                  {userData?.public_repos}
                </p>
              </div>
            </div>
         */}

        <div className="flex flex-col items-center justify-center bg-nice-white pb-10 mt-5">
          <div className="container mx-auto px-6">
            <div className="grid md:gap-3 lg:grid-cols-4">
              {repos.map((repo) => (
                <div
                  className="delay-30 mt-3 cursor-pointer rounded-xl border bg-white p-6 transition duration-100 ease-in-out shadow-md hover:shadow-xl hover:border-gray-800"
                  key={repo.id}
                >
                  <a href={repo.html_url}>
                    <h1 className="break-words font-mono text-xl font-bold">
                      <RepoIcon size={20} className="mr-2 text-gray-700" />
                      {repo.name}
                    </h1>
                    <p className="text-gray-60 mb-4 break-words text-sm">
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
