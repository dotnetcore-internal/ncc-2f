import axios from "axios";
import type { EpisodeIndexModel } from "@/apis/ContentModels";

export const queryEpisodeMetadata = async function(
  api: string,
  callback: (data: EpisodeIndexModel) => void,
  fallback: () => void = () => {
  }
) {
  await axios.get<EpisodeIndexModel>(api)
    .then(function(response) {
      callback(response.data);
    })
    .catch(fallback);
};