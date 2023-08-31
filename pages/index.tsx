import Image from 'next/image'
import {Inter} from 'next/font/google'
import {inspect} from "@xstate/inspect";
import {useMachine} from "@xstate/react";
import {myMachine} from "@/machines/myFirstMachine";

const inter = Inter({subsets: ['latin']})

if (typeof window !== 'undefined') {
    inspect({
        // options
        // url: 'https://stately.ai/viz?inspect', // (default)
        iframe: false // open in new window
    });
}

export default function Home() {
    const [state, send] = useMachine(myMachine, {
        devTools: true
    });
    return (
        <>
            <main>{JSON.stringify(state)}</main>
            <button onClick={() => {send('HOVER')}}>Press</button>
            <button onClick={() => {send('MOUSE_OUT')}}>Press</button>
        </>
    )
}
