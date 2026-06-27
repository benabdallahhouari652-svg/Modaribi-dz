export default function ProfileLoading() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="rounded-xl border border-gray-200 bg-white p-8">
        <div className="flex animate-pulse flex-col space-y-6">
          <div className="h-8 w-48 rounded bg-gray-200" />
          <div className="h-4 w-64 rounded bg-gray-200" />
          <div className="flex items-center gap-6">
            <div className="h-20 w-20 rounded-full bg-gray-200" />
            <div className="flex-1 space-y-3">
              <div className="h-5 w-40 rounded bg-gray-200" />
              <div className="h-4 w-60 rounded bg-gray-200" />
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="rounded-lg bg-gray-100 p-4">
                <div className="mx-auto h-8 w-12 rounded bg-gray-200" />
                <div className="mx-auto mt-2 h-3 w-16 rounded bg-gray-200" />
              </div>
            ))}
          </div>
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-10 w-full rounded bg-gray-100" />
          ))}
        </div>
      </div>
    </div>
  )
}
