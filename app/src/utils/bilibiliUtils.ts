// @ts-ignore
import {toAv, toBv} from "@/utils/bilibiliUtilsClassic";

const av2bv = (av: number): string => {
    return toBv(av);
}

const bv2av = (bv: string) => {
    return toAv(bv);
}

const av2cid = (av: number) => {
    let cid: number = 0;
    fetch(`https://api.bilibili.com/x/web-interface/view?aid=${av}`)
        .then(r => r.json())
        .then(r => {
            const d = r['data'];
            if (d)
                cid = Number.parseInt(d['cid']);
            else
                cid = -1;
        });
    return cid;
}

export {
    av2bv,
    bv2av,
    av2cid
};