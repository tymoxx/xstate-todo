import Image from 'next/image'
import {Inter} from 'next/font/google'
import {inspect} from "@xstate/inspect";
import {useMachine} from "@xstate/react";
import {todoAppMachine} from "@/machines/todoAppMachine";

const inter = Inter({subsets: ['latin']})

if (typeof window !== 'undefined') {
    inspect({
        // options
        // url: 'https://stately.ai/viz?inspect', // (default)
        iframe: false // open in new window
    });
}

export default function Home() {
    const [state, send] = useMachine(todoAppMachine, {
        devTools: true
    });
    return (
        <>
            <main>{JSON.stringify(state.value)}</main>
            <button onClick={() => {send({
                type: "Todos Loaded",
                todos: ['Take bin out']
            })}
            }>TODOs Loaded</button>
            <button onClick={() => {send({
                type: "Todos Failed to Load",
                errorMessage: 'Oh No!'
            })}}>TODOs Failed to Load</button>
        </>
    )
}
