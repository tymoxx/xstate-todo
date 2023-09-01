import {createMachine, assign} from "xstate";

export const todosMachine = createMachine({
        /** @xstate-layout N4IgpgJg5mDOIC5QBUD2FUAICyBDAxgBYCWAdmAHRoayYAyquEZUAtOwMQbkVkBuqANaVqWPETIj0qWgyYt2rBP1T5cAF2KpSAbQAMAXX0HEoAA4zim7aZAAPRAE4KjgGx7HAFgCsngIwAzADsnp4BABwBADQgAJ6IAQF+FN6OAEz+QY5+aUFJrgC+BTGiOAQkPKKyjMykbJxgAE6NqI0UZgA2GgBmrQC2VNJlEpXS1fJ1isqkAmrWuobGthawVlqktg4IaekUfno5nrlh++HeQTHxCPueFK4Zjo7haX77+y9FJUPiFZRyEJAAIQcADCjTAGjAmAAcmAAO5LJAgFZrGxIrZ+VzOVxBPzhcKBI5pVw+S5OAJ6CiePSuALE86vameT4gUo-SQUf5AjgAETAHTA6jAiPMlnmm0Q5woaT0SRpcreOTJ1z0NIoek8kTpOw8bnCLLZ5Q5YIhmjqmHIcMw6mkFAAyoRUHCWJheo0+pgyGYAK7qDgAMX6ntIPvUmCIuDqkBFyLF6wlCACWIoQTOnhJ3iTrkCys8QW8d2est8aXOeQCBu+Rp4Jo0Lst1ttDqdLrdHq9vo4du9ACM+lYYyjxejEO5wilHnTXJmfI9wsrs0EKGdvHpvPjwriCd5Kxhhr8KLWzVALfDGxh7bg+C6bRguNpKCphIM9+ya+C6+aG7fUJfr+af2mWY620YxBzjNFQC2LE0hcVJ803ddfE1BcpT8ddAj8UJZXSRxdzEatKCPeszx-P8b2kDgmhaNpOh6foXwIkYiI-Y9TytMi7SvCiMCA1QQIWIxDGWCCNhHBBp0pNI0mCDUaTnaI4gSV4UjxJ5iRlPVmWKVkq2Yig+QFNifyo5pWnaLp1DbRj9w5QzBR41A+LmdYwOEpEh3jcTWCwgtfC8Lw8zzMdlRyNJx0SRxEl8PxHHOTV8Nsnh7OMyjuEfGYhCkV9CIM-kHIA6RnIEtyTA80SEx86k9iOKKcg8WK1zSUKNQLXIdjLLDZQCHcWVIdA4FsQ1mJE1ZhygxBWBeAI7hCbw8UxAJPDcMJQtuM50KCe5Sz0XFaTSRK32ymR6BqBR2FG1ExImhAjha2CevQ54sNyVJeq+HL9K5CBAUu8b7ElC4lIQKLKUceV6VxLrtI+piDyqTB-VwYgBQgRtTqYP6vJumKXCeAInmzWk3D8ULS2XebzlSLE10XQ7cuIr9SOkLHIIBxMXhTNMMyzHNgek24DnCJ4sOpLEs3p-TGZPb8m0dZ1zTbYNQ1Z672YiJdvHm15Ug8PQHmVRJYLm7x3GCcGsKTSWD2l9jz1-Lj-xPH9VYTTdNcxVcouFurlVSW4etXTdInXVxhetuz8tSjBXe89CZunNMlvdjwtdC-Yl3CbD03OeStoj5Ko5dUoAFEzPBCBY5unzp1mnwFtpZaSUUq5AllFwmueHxhc1XqiiAA */
        schema: {
            services: {} as {
                'loadTodos': {
                    data: string[]
                },
                'saveTodo': {
                    data: void
                },
                'deleteTodo': {
                    data: void
                }
            },
            events: {} as | {
                type: 'Create New'
            } | {
                type: 'Form input changed'
                value: string
            } | {
                type: 'Submit'
            } | {
                type: 'Delete'
                todo: string
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
                    "Create New": "Creating new todo",
                    Delete: "Deleting todo"
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
            },

            "Deleting todo": {
                invoke: {
                    src: 'deleteTodo',

                    onError: [{
                        target: "Deleting Todo Errored",
                        actions: "assignErrorToContext"
                    }],

                    onDone: "Todos Loading---"
                }
            },

            "Deleting Todo Errored": {}
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

