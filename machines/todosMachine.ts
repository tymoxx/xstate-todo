import {createMachine, assign} from "xstate";

export const todosMachine = createMachine({
        /** @xstate-layout N4IgpgJg5mDOIC5QBUD2FUAICyBDAxgBYCWAdmAHRoayYAyquEZUAtOwMQbkVkBuqANaVqWPETIj0qWgyYt2rBP1T5cAF2KpSAbQAMAXX0HEoAA4zim7aZAAPRKwDMADgoA2dwBYAnAEYvAFYAJgB2cND3FwAaEABPR2C9Hwowlydgl3dgwL9AvXSAX0LY0RwCEh5RWUZmUjZOMAAnJtQmijMAGw0AMzaAWyppcokq6Rr5esVlUgE1a11DY1sLWCstUlsHBFY-UL0Kf1ynHx9Qlx9kn3dYhIQXLwo9QMCXPT90gJc-d2LS4fElUocggkAAhBwAMJNMAaMCYAByYAA7sskCBVusbOjtl4vAcfk49JFQn4Ck5srdHB9QhQ3ntPH4cnlyX8QGVAZIKNDYZp6phyMjMOppBQAMqEVDIliYPpNfqYMhmACu6g4ADEBorSCr1JgiLh6pA0eZLAstogTu5Un5XIFQtdyZT4ogAhQAsk9MEAtdAl5QoFiiUQKR0HBbByKpIVmaNhadt63EdbadzpdTjcXQnrhRwulgtcThkTl42ZHRlIaPRagp2DG1uacdTXk8fHjiS5Ql50l6qTt3IEKE5h7bvg7gq49L9g+WgRQQeD61jNk2EDk3M9Qk4vO4PWEjn3dp26e9IrvmfkijOAVGxlX1bhiJ1IMKsCCl43QNtdtl3VFsp4wTdkSYR9om7qnBcZyRMESShMEZY3hW3IwhoMqCq+GAfnGq7bsEhwDoW5xBD4LjBIeW5DoE-hekEw7fC8iEYCMc48mh-IYSKGDipK0r8nKCpKqq2HYl+lqXAR1HuE4xHUWRfY-G49pOHsgQyV4HzuFOQaFEAA */
        schema: {
            services: {} as {
                'loadTodos': {
                    data: string[]
                }
            },
            events: {} as
                {
                    type: 'Create New'
                } | {
                type: 'Form input changed'
                value: string
            }
        },
        context: {
            todos: [] as string[],
            errorMessage: undefined as string | undefined,
            createNewTodoFormInput: "",
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

            "Loaded!": {
                on: {
                    "Create New": "Creating new todo"
                }
            },

            "Todos Failed to Load": {},

            "Creating new todo": {
                states: {
                    "Showing form input": {
                        on: {
                            "Form input changed": {
                                actions: 'assignFormInputToContext'
                            }
                        }
                    }
                },

                initial: "Showing form input"
            }
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
}),
            assignFormInputToContext: assign((context, event) => {
                return {
                    createNewTodoFormInput: event.value
                }
            })
        }
    }
)

