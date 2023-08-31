import {createMachine, assign} from "xstate";

export const todosMachine = createMachine({
        /** @xstate-layout N4IgpgJg5mDOIC5QBUD2FUAICyBDAxgBYCWAdmAHRoayYAyquEZUAtOwMQbkVkBuqANaVqWPETIj0qWgyYt2rBP1T5cAF2KpSAbQAMAXX0HEoAA4zim7aZAAPRKwDMADgoA2dwBYAnAEYvAFYAJgB2cND3FwAaEABPR2C9Hwowlydgl3dgwL9AvXSAX0LY0RwCEh5RWUZmUjZOMAAnJtQmijMAGw0AMzaAWyppcokq6Rr5esVlUgE1a11DY1sLWCstUlsHBFY-dz0KL3c8nxDIp2S-UNiEhGDjij8fF1C9IL0nbOCc4tLh8UqlDkEEgAEIOABhJpgDRgTAAOTAAHdlkgQKt1jY0dsvF4DnsLpFQn4Cp9gjdHH4XhQXHorp4-Dk8qTfiAygDJBQoTDNPVMOQkZh1NIKABlQioJEsTB9Jr9TBkMwAV3UHAAYgMFaRlepMERcPVIKjzJYFltEE4MocvC4Qm8AkdPO4KQgnIFAo9gj4fGEfa4fiU2f8KpzuRppQKhSLxZLpbL5YqVRxRUqAEb9KzG9GmjbmhC5LwUHxOK6BJy49yBUI+Z3xRABFJUwLevRl8tul6s9khnhh3lQfnIqMYMW4PjS4UYLjaSgqYRDDAjQFc6HhvmRyeoUfjvmbmZzcPaYxZjFm7GIMvuVIFVtnHLuVwu1hBGnN5KhW0fIIBv6Ljm91d+0HQVN23CdpA4ZpWnaLpegGBcxB7Sg+wjIdQNFMdwIwfdVEPRYjEMFYcyxUBtlyYJDiyC59gbbwYjrO4ogoN0kkCKj3GJfxikDUh0DgWxu1GMAiLWM9SMSElHiibIXDxN5cUyJ8vSvcJ0jCVsnFCVwri7YMhIQiY6gaVgRMxTZzx2PI3GSXE9A-UIbQuYIvBdPwnA8K4jgcrw3PCVx3F0v8kIoYEwVMsT7EQHJrKrctjjxX08ifKlQhpOlImOJl8iKQNBOXapMDVXBiE6SAo3oWpwtzCzdmyKSskyOTcS8RSGJtFJaTdIJGTpElgkCxD9JQ9c0OkKqSMiu5cgoAoOOrEtgguFwshdNipJ8PR7R8XEnj0ZyBqXUNANQkDowlKU+XjLUdXG8zxLub0ZqycJi0ZJaVoYhtHiyTblM0ytIgO-9kOOkbTpHDCdwHTdbrzbxC3LIJ-CCXJlpcz6X08Da-Bxkk0dObjCiAA */
        schema: {
            services: {} as {
                'loadTodos': {
                    data: string[]
                },
                'saveTodo': {
                    data: void
                }
            },
            events: {} as
                | {
                type: 'Create New'
            }
                | {
                type: 'Form input changed'
                value: string
            }
                | {
                type: 'Submit'
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
                            },

                            Submit: "Saving todo"
                        }
                    },

                    "Saving todo": {
                        invoke: {
                            src: "saveTodo",
                            onError: [
                                {
                                    target: "Showing form input",
                                    actions: "assignErrorToContext"
                                }],
                            onDone: [
                                {
                                    target: "#Todo Machine.Todos Loading---",
                                }]
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

