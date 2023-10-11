import { writable } from 'svelte/store';

// This has a dataformat of:
// {
//     roverName: [
//         [elementKey, element],
//         [elementKey, element],
//         ...
//     ],
//     roverName: [
//         [elementKey, element],
//         [elementKey, element],
//         ...
//     ],
//     ...
// }
const initialKeepables = {};
// This has a dataformat of:
// {
//     roverName: {
//         graphName: {
//             data: [y1, y2, y3, ...],
//             },
//         },
//         graphName: {
//             data: [y1, y2, y3, ...],
//             }
//         },
//     },
//     roverName: {
//         graphName: {
//             data: [y1, y2, y3, ...],
//             }
//         },
//         graphName: {
//             data: [y1, y2, y3, ...],
//             }
//         },
//     },
//     ...
// }
const initialGraphs = {};
// {notification_name: {status: 'warning', message: 'message'},
//  notification_name: {status: 'error', message: 'message'}, ... }
const initialNotifications = {};

function createKeepablesStore() {
    const { subscribe, set, update } = writable(initialKeepables);

    return {
        subscribe,
        removeElement: (roverName, elementKey) => update(n => {
            if (n[roverName]) {
                n[roverName] = n[roverName].filter(([key]) => key !== elementKey);
            }
            // if empty, remove rover
            if (n[roverName].length === 0) {
                delete n[roverName];
            }
            return { ...n };
        }),
        addElement: (roverName, element) => update(n => {
            if (!n[roverName]) {
                n[roverName] = [];
            }
            // if already exists, remove it
            n[roverName] = n[roverName].filter(([key]) => key !== element[0]);
            if (n[roverName]) {
                n[roverName].push(element);
            }
            return { ...n };
        }),
    };
}

function createGraphsStore() {
    const { subscribe, set, update } = writable(initialGraphs);

    return {
        subscribe,
        addGraph: (roverName, graphName, data) => update(n => {
            console.log('addGraph', roverName, graphName, data);
            if (!n[roverName]) {
                n[roverName] = {};
            }
            n[roverName][graphName] = data;
            return { ...n };
        }),
        removeGraph: (roverName, graphName) => update(n => {
            if (n[roverName]) {
                delete n[roverName][graphName];
            }
            // if empty, remove rover
            if (Object.keys(n[roverName]).length === 0) {
                delete n[roverName];
            }
            return { ...n };
        }),
    };
}

function createNotificationsStore() {
    const { subscribe, set, update } = writable(initialNotifications);

    return {
        subscribe,
        addNotification: (name, status, message) => update(n => {
            n[name] = {status, message};
            return { ...n };
        }),
        removeNotification: (name) => update(n => {
            delete n[name];
            return { ...n };
        }),
    };
}


export const keepables = createKeepablesStore();
export const graphdata = createGraphsStore();
export const notifications = createNotificationsStore();