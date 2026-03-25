export const ServerEvents = {
    Player: {
        Spawned: 'player:spawned',
        Ready: 'player:ready',
    },
} as const;

export const ClientEvents = {
    Player: {
        Ready: 'player:ready',
    },
} as const;
