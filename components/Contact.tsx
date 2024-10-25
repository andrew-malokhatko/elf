import Logo from "@/public/logo.png";
import Image from "next/image"


interface ContactProps {
    name: string,
    callback: () => void;
    selected?: boolean
}

export default function Contact({name, callback, selected = false}: ContactProps)
{
    return(
        <div className={(selected ? `bg-emerald-300` : `hover:bg-gray-100`) + ` h-[75px] cursor-pointer select-none w-full flex flex-row items-center gap-3 border-contactsfg  p-3`} onClick={callback}>
            <Image src={Logo} alt="logo" className="h-full rounded-full w-auto object-contain bg-gray-300" />
            <div className="flex flex-col gap-2">
                <h2 className="text-base">{name}</h2>
                <p className="text-sm text-gray-400">Latest Message....</p>
            </div>
        </div>
    )
}