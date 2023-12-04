import {useEmitter} from "@/hooks/useEmitter";

const emitter = useEmitter();

export const jumpTimeStamp = (timestamp: string | number) => {
    emitter.emit('updateTimeStamp', {timestamp: timestamp});
};