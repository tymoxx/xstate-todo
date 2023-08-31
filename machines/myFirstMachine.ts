import {createMachine} from "xstate";

export const myMachine = createMachine({
    initial: 'notHovered',
    states: {
        notHovered: {
            on: {
                HOVER: {
                    target: 'hovered'
                }
            }
        },
        hovered: {
            on: {
                MOUSE_OUT: {
                    target: 'notHovered'
                }
            }
        }
    },
})
