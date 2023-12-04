import {useEmitter} from "@/hooks/useEmitter";

const emitter = useEmitter();

export const jumpTimeStamp = (timestamp: string | number, to: 'bilibili' | 'youtube') => {
    emitter.emit('updateTimeStamp', {timestamp: timestamp, to: to});
};