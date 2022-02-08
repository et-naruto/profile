function Repo() {
  {
    repos.map((repo) => (
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
    ))
  }
}

export default Repo
