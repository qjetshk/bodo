'use client'
import { useRouter } from "next/navigation";

const NotFound = () => {
    const router = useRouter()
    
    const handleGoBack = () => {
        router.back()
    }

    return (
        <section className="w-full h-screen flex justify-center items-center">
            <section className="flex flex-col gap-5 items-center ">
                <div className="font-unbounded text-2xl font-semibold text-center flex flex-col gap-3">
                    <h1 className="text-4xl">Упс...</h1>
                    <h1>Unfortunately, such a page could not be found.</h1>
                </div>

                <div>
                    <h2 className="text-lg text-center">
                        But YOU can always{" "}
                        <button 
                            onClick={handleGoBack} 
                            className="underline transition-colors hover:text-neutral-500"
                        >
                            go back
                        </button>
                    </h2>
                </div>
            </section>
        </section>
    );
};

export default NotFound;