import { useRouter } from 'next/router'
import { StarIcon } from '@primer/octicons-react'
import Head from 'next/head'
import { useState, useEffect } from 'react'
import React from 'react'

export default function User(props) {
  const router = useRouter()
  const { id } = router.query


  // Get repo data from Github API using useEffect
  const [repos, setRepos] = useState([])
  useEffect(() => {
    fetch(`https://api.github.com/users/${id}/repos`)
      .then((res) => res.json())
      .then((data) => setRepos(data))

  }, [])



  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <Head>
        <title>{id}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="">
        {/* Map all repositories of user */}
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
