import {createMachine} from "xstate";

export const todosMachine = createMachine({
        id: "Todo Machine",
        initial: "Todos Loading---",
        schema: {
            // events: {} as
            //     | { type: "Todos Loaded"; todos: string[] }
            //     | { type: "Todos Failed to Load"; errorMessage: string },
            services: {} as {
                'loadTodos': {
                    data: string[]
                }
            }
        },
        states: {
            "Todos Loading---": {
                invoke: {
                    src: "loadTodos",
                    onDone: [
                        {
                            target: "Loaded!"
                        }
                    ],
                    onError: [
                        {
                            target: "Todos Failed to Load"
                        }
                    ]
                }
            },
            "Loaded!": {},
            "Todos Failed to Load": {},
        },
    },
)

