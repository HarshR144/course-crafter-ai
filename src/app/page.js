import { getAuthSession } from "@/lib/auth";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  const session = await getAuthSession();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center dark:bg-black   dark:text-white">
    <main className="flex flex-col items-center justify-center flex-1 px-20 text-center">
      <h1 className="text-6xl font-bold">
        Welcome to{' '}
        <span className="text-blue-500">
          Course Crafter AI
        </span>
      </h1>

      <p className="mt-3 text-2xl">
        Curate videos and create courses using generative AI
      </p>

      <div className="mt-6 flex justify-center">
      {session ? (
            <Link href="/create">
              <button className="px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
                Create Course
              </button>
            </Link>
          ) : (
            <Link href="/api/auth/signin">
              <button className="px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
                Get Started
              </button>
            </Link>
          )}
      </div>
    </main>

    <footer className="w-full h-24 flex items-center justify-center border-t border-gray-800">
      <p className="text-gray-500">© 2024 Course Crafter AI</p>
    </footer>
  </div>
  );
}
