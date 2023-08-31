import {useMachine} from "@xstate/react";
import {createMachine} from "xstate";

export const todoAppMachine = createMachine({
    id: "Todo Machine",
    initial: "Loading Todos",
    schema: {
        events: {} as
            | { type: "Todos Loaded"; todos: string[] }
            | { type: "Todos Failed to Load"; errorMessage: string },
    },
    states: {
        "Loading Todos": {
            on: {
                "Todos Loaded": {
                    target: "Todos Loaded",
                    actions:  "alertTodos"
                },
                "Todos Failed to Load": {
                    target: "Todos Failed to Load",
                }
            }
        },
        "Todos Loaded": {},
        "Todos Failed to Load": {},
    },
}, {
    actions: {
        alertTodos: (context, event) => {
            alert(JSON.stringify(event));
        }
    }
})

