import Image from 'next/image';

export default function AdminLoading() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-black">
            <div className="relative animate-pulse">
                <Image
                    src="/Logo.png"
                    alt="Loading..."
                    width={180}
                    height={56}
                    priority
                    className="h-14 w-auto object-contain opacity-90"
                    style={{ width: 'auto' }}
                />
            </div>
            <div className="mt-8 flex gap-2">
                <div className="w-2.5 h-2.5 bg-orange rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-2.5 h-2.5 bg-orange rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2.5 h-2.5 bg-orange rounded-full animate-bounce"></div>
            </div>
        </div>
    );
}
