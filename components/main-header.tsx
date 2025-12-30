"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from 'next/navigation'

import logo from '../assets/images/logo-small.svg';

export default function MainHeader() {
    const pathname = usePathname();

    return (
        <header className={`w-full ${pathname === `/study-mode` ? 'md:w-3/4 lg:w-full' : 'sm:w-5/6 md:w-4/5 lg:w-5/6'} h-24 flex justify-between items-center bg-[#F7F3F0] mt-6`}>
            <div>
                <Link className='flex flex-row items-center' href='/study-mode'>
                    <Image
                        src={logo.src}
                        width={0}
                        height={0}
                        alt='app logo'
                        style={{ width: '60px', height: '60px' }}
                        loading='eager'
                    />

                    <span className='hidden md:block ml-3 font-black text-2xl'>Flashcard</span>
                </Link>
            </div>

            <div className='bg-white rounded-full py-1 px-2 border-black border-l-1 border-t-1 border-r-1 border-b-3'>
                <Link href='/study-mode'>
                    <button className={`rounded-full py-3 px-6 ${pathname === `/study-mode` ? 'bg-yellow-500' : 'bg-white'} font-bold mr-1 border-black border-1 cursor-pointer`}>Study Mode</button>
                </Link>

                <Link href='/all-cards'>
                    <button className={`rounded-full py-3 px-6 ${pathname === `/all-cards` ? 'bg-yellow-500' : 'bg-white'} font-bold cursor-pointer`}>All Cards</button>
                </Link>

            </div>
        </header>
    )
}