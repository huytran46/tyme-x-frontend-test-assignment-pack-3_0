import * as React from 'react'

import { Button } from '@/components/ui/button'

const Header = () => (
  <header className="flex flex-col md:flex-row items-center justify-between p-8 gap-8 mx-auto max-w-7xl w-full">
    <div>
      <h1 className="text-5xl font-bold leading-tight text-center md:text-left">
        NEW
        <br />
        ARRIVAL
      </h1>
      <div className="flex gap-4 mt-6">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="w-16 h-16 bg-gray-200 rounded" />
        ))}
      </div>
    </div>

    <div className="flex flex-col items-center">
      <div className="w-64 h-64 bg-gray-200 rounded mb-4 flex items-center justify-center">
        <span className="text-lg text-gray-400">Featured Image</span>
      </div>
      <Button className="w-40">THE DJ</Button>
    </div>
  </header>
)

const Aside = ({ children }: { children: React.ReactNode }) => (
  <aside className="w-full md:w-64 flex-shrink-0 mb-8 md:mb-0">{children}</aside>
)

const Main = ({ children }: { children: React.ReactNode }) => {
  return <main className="flex-1 flex flex-col md:flex-row max-w-7xl mx-auto w-full p-6 gap-8">{children}</main>
}

const Footer = () => (
  <footer className="mt-12 border-t py-8 bg-white">
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-8 px-6">
      <div>
        <div className="font-semibold mb-2">NAVIGATION</div>
        <ul className="space-y-1 text-sm">
          <li>Home</li>
          <li>Whitepaper</li>
          <li>Marketplace</li>
          <li>About us</li>
        </ul>
      </div>
      <div>
        <div className="font-semibold mb-2">CONTACT US</div>
        <ul className="space-y-1 text-sm">
          <li>Email</li>
          <li>Chat</li>
          <li>Phone</li>
        </ul>
      </div>
      <div className="flex-1 max-w-md">
        <div className="font-semibold mb-2">NEWSLETTER</div>
        <form className="flex gap-2">
          <input placeholder="Enter your email" className="flex-1 border rounded px-2 py-1" />
          <button type="submit" className="px-4 py-2 rounded bg-black text-white">
            Subscribe
          </button>
        </form>
      </div>
    </div>
  </footer>
)

export { Aside, Footer, Header, Main }
