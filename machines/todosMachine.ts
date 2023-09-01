import {createMachine, assign} from "xstate";

export const todosMachine = createMachine({
        /** @xstate-layout N4IgpgJg5mDOIC5QBUD2FUAICyBDAxgBYCWAdmAHRoayYAyquEZUAtOwMQbkVkBuqANaVqWPETIj0qWgyYt2rBP1T5cAF2KpSAbQAMAXX0HEoAA4zim7aZAAPRAE4KjgGx7HAFgCsngIwAzADsnp4BABwBADQgAJ6IAQF+FN6OAEz+QY5+aUFJrgC+BTGiOAQkPKKyjMykbJxgAE6NqI0UZgA2GgBmrQC2VNJlEpXS1fJ1isqkAmrWuobGthawVlqktg4IaekUfno5nrlh++HeQTHxCPueFK4Zjo7haX77+y9FJUPiFZRyEJAAIQcADCjTAGjAmAAcmAAO5LJAgFZrGxIrZ+VzOVxBPzhcKBI5pVw+S5OAJ6CiePSuALE86vameT4gUo-SQUf5AjgAETAHTA6jAiPMlnmm0Q5woaT0SRpcreOTJ1z0NIoek8kTpOw8bnCLLZ5Q5YIhmjqmHIcMw6mkFAAyoRUHCWJheo0+pgyGYAK7qDgAMX6ntIPvUmCIuDqkBFyLF6wlCACWIoQTOnhJ3iTrkCys8QW8d2est8aXOeQCBu+Rp4Jo0Lst1ttDqdLrdHq9vo4du9ACM+lYYyjxejEO5wilHnTXJmfI9wsrs0EKGdvHpvPjwriCd5Kxhhr8KLWzVALfDGxh7bg+C6bRguNpKCphIM9+ya+C6+aG7fUJfr+af2mWY620YxBzjNFQC2LE0hcVJ803ddfE1BcpT8ddAj8UJZXSRxdzEatKCPeszx-P8b2kDgmhaNpOh6foXwIkYiI-Y9TytMi7SvCiMCA1QQIWIxDGWCCNhHBBp0pNI0mCDUaTnaI4gSV4UjxJ5iRlPVmWKVkq2Yig+QFNif3vHgnykV9CIM-lBR41A+LmdYwOEpEh3jcTWCwyksJ2JJNL8Rw1zSZUbgLXIdjLLzEh3HTDX0wzbIAyjqNadounUNtGP3DkEuM6QHIE5yTFc0SE08nwUk8LwvDzPMxxC6Tx0SRxov8Rxzk1fDsp4XKXVKABRZpWkgDg7FgdRIQoXBuiFRoAAp9lVABKDg4oPXrzQGobwQgcDVmHKDEFYXIl3CYtpO8ek9HzbwQr8XFlw6rxMwedcurfSgNpPLaaJGu0zDASBMG9Mw9tRMTDoQVhmqpAIfHupMsO8bMQo8Jc8R8OHMzh2U0iKHTSHQOBbDWyQRP29zIdYMIpJa8J7jOrM11upTrluM50KyIIQiw+mNXeqyqnoGoFHYcnwYTI5UdggJvHQ54fPzdqBf0rkIEBcWDvsSULlZlrKUC2l6VxLztK+Sz9KF-1cGIAUIEbYWmE1yntYQXxkgUp5s1pNw-AagsOfOVIsTXRcVYPYiv1I6Rncg126WSVNfAzLMc1Z6TbgOcIniw6ksWCcPjVYkiOKbR1nXNNtg1DWOIfjzcUjl15Ug8PQHmVRJYJCbxkdlLIDjCQpYr0iPi6j0uLy4-8Tx-WuE03Jc5ckunJz91nUluWXV03SJ11cbPC56my8owOePPQgI7iQsJNW5jwe7u67l2w9NznkoIh-Npj1uPvqhkG36EAz5UwiLBXy9M0iM1cO4B+rNAi5BSASGUWRApeGnPjAoQA */
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
            } | {
                type: 'Speed up'
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

            "Deleting Todo Errored": {
                after: {
                    "1000": "Loaded!"
                },

                on: {
                    "Speed up": "Loaded!"
                }
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

