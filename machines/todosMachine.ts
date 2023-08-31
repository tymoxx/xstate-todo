import {createMachine, assign} from "xstate";

export const todosMachine = createMachine({
        schema: {
            services: {} as {
                'loadTodos': {
                    data: string[]
                }
            }
        },
        context: {
            todos: [] as string[],
            errorMessage: undefined as string | undefined
        },
        id: "Todo Machine",
        initial: "Todos Loading---",
        states: {
            "Todos Loading---": {
                invoke: {
                    src: "loadTodos",
                    onDone: [
                        {
                            actions: "assignTodosToContext",
                            target: "Loaded!",
                        }
                    ],
                    onError: [
                        {
                            actions: "assignErrorToContext",
                            target: "Todos Failed to Load"
                        }
                    ]
                }
            },
            "Loaded!": {},
            "Todos Failed to Load": {},
        },
    },
    {
        actions: {
            assignTodosToContext: assign((context, event) => {
                return {
                    todos: event.data,
                }
            }),
            assignErrorToContext: assign((context, event) => {
                return {
                    errorMessage: (event.data as Error).message,
                }
            })
        }
    }
)

