import {Inter} from 'next/font/google'
import {inspect} from "@xstate/inspect";
import {useMachine} from "@xstate/react";
import {todosMachine} from "@/machines/todosMachine";

const inter = Inter({subsets: ['latin']})

if (typeof window !== 'undefined') {
    inspect({
        // options
        // url: 'https://stately.ai/viz?inspect', // (default)
        iframe: false // open in new window
    });
}

export default function Home() {
    const [state, send] = useMachine(todosMachine, {
        devTools: true,
        services: {
            loadTodos: async () => {
                // throw new Error("Oh no");
                return ['Take bin', 'Do laundry', 22]
            }
        }
    });
    return (
        <>
            <pre>{JSON.stringify(state.value)}</pre>
            <pre>{JSON.stringify(state.context)}</pre>
            <div>
                {
                    state.matches('Loaded!')
                    && (
                        <button onClick={() => send({type: 'Create New'})}>
                            Create
                        </button>
                    )
                }
                {
                    state.matches('Creating new todo.Showing form input')
                    && <input
                    type="text"
                    onChange={e => {
                        send({
                            type: "Form input changed",
                            value: e.target.value,
                        })
                    }}
                  >

                  </input>
                }
            </div>
        </>
    )
}
