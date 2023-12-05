import axios from "axios";
import type {EpisodeProfileModel} from "@/apis/ContentModels";

export const queryEpisodeMetadata = async function (
    api: string,
    callback: (data: EpisodeProfileModel) => void,
    fallback: () => void = () => {
    }
) {
    await axios.get<EpisodeProfileModel>(api)
        .then(function (response) {
            callback(response.data);
        })
        .catch(fallback);
};