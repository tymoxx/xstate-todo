import {createMachine, assign} from "xstate";

export const todosMachine = createMachine({
        /** @xstate-layout N4IgpgJg5mDOIC5QBUD2FUAICyBDAxgBYCWAdmAHRoayYAyquEZUAtOwMQbkVkBuqANaVqWPETIj0qWgyYt2rBP1T5cAF2KpSAbQAMAXX0HEoAA4zim7aZAAPRAE4KjgGx7HAFgCsngIwAzADsnp4BABwBADQgAJ6IAQF+FN6OAEz+QY5+aUFJrgC+BTGiOAQkPKKyjMykbJxgAE6NqI0UZgA2GgBmrQC2VNJlEpXS1fJ1isqkAmrWuobGthawVlqktg4IaekUfno5nrlh++HeQTHxCPueFK4Zjo7haX77+y9FJUPiFZRyEJAAIQcADCjTAGjAmAAcmAAO5LJAgFZrGxIrZ+bIUMJBPQ+DLhSIhbyXRBBPLYtJpVz+V5+cJPIKfEClH6SCj-IEcAAiYA6YHUYER5ks802iHOFDSeiSelcsreOVJ1z0cooeMiASpjg8bnCzNZ5XZYIhmjqmHIcMw6mkFAAyoRUHCWJheo0+pgyGYAK7qDgAMX6ntIPvUmCIuDqkGFyNF63FCACrmcQTOnhp3iTrkCys8QW8d2eMt8aXOeQCBu+Rp4Jo0Lst1ttDqdLrdHq9vo4du9ACM+lYYyixejEO5wilHlrXJmfI9wsrs0EKGdvHpvITwkF6X5vJWMMNfhRa2aoBb4Y2MPbcHwXTaMFxtJQVMJBvu2TXwXXzQ276grzfzV-aZZjrbRjEHOM0VALZkzSFxUnzTd118Tx5ziUdJR3cJAj8UIZXSRw9zEatKGPetz1-f9b2kDgmhaNpOh6fpX2IkZSM-E8zytSi7WvaiMGA1RQIWIxDGWSCNhHBBpz0KU0mCPE5TnaJ0MTV4UnpJ5qWlPVPCIg92V5flON-B8eGfKQ3xIigjIFfjUEEuZ1nAsSkSHeMpNYXDZNwnYkh0zE1zSZUbgLXIdjLbzEl3YoWSrNibL5OzAJoujWnaLp1DbFiDJ4WyTOkRzhJckw3IkhMvJ8FJPC8Lw8zzMcQqpcdEkcaL-Ecc5UP099KHyl1SgAUWaVpIC7MwwEgTBvTMCDVmHaDEFYVrsQCHw-DybMfGzEKPCXekfDWzM1plNIeus-rzSGkbwQgDg7FgdRIQoXBukFRoAAp9lVABKDhDQSy7T2u+jo1ckV5o8xaEFYXIl3CYsqW8alV3zElVNeLdly6rxMweddzoSqp6BqBROG4J8ZiESzWMPYn-jJpQVCcsDFj8UqIdRSToecNwPB8fxglCCIVKudM4N8bxkc3RIAlSPwili0h0DgWwAd+cTIag+wlrCWS-PCe4EazNd0auXDsaw3DsK8Ut00JumxhJiZ6lYTWuYTI5drguWsJeI5806h32U5CBAXdhade2NVs1cXF5J3aXlTTZcdwiVw4869cmVi9X2WJ-1cGIfkIEbZ2IAjqGo98ZJlKeWOAjcPwmoLM4d0D5M10XYOP1NcjuOkSvta2LVklTXwMyzHNVKpW4DgZRxcTx6V6R79i++-Cim0dZ1zTbYNQyH7mo4iJcpbpVIPD0B5lUSODiW8dxgh1XCkzXo8OP7i8-14gDT1-I+CZNxnz8DJNqC8kjKlSLcOWq5NyRHXK4Bk78gbf0AZ5NOdxkJhFQuSDwUsQr7HhnhdM5wlJBEKLneKh5UEg1GhXMqWtj5bGWs8KU4CjYygzqbEKWoz7YWlFkHUXhpyKwKEAA */
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
                            cond: "Has todos"
                        },
                        "Creating new todo"
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
        guards: {
            "Has todos": (context, event) => {
                return event.data.length > 0;
            }
        },
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

