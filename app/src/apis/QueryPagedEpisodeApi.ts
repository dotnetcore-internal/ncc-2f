import axios from "axios";
import type { PageDescriptor, EpisodeIndexModel } from "@/apis/ContentModels";

export interface PagedEpisodeDto {
  "_page": PageDescriptor,
  list: EpisodeIndexModel[]
}

const queryPagedEpisodeImpl = async function(
  api: string,
  callback: (data: PagedEpisodeDto) => void,
  fallback: () => void = () => {
  }
) {
  await axios.get<PagedEpisodeDto>(api)
    .then(function(response) {
      callback(response.data);
    })
    .catch(fallback);
};

export const queryPagedEpisode = async function(
  pageNumber: number,
  locale: string,
  callback: (data: PagedEpisodeDto) => void,
  fallback: () => void = () => {
  }
) {
  if (pageNumber < 1)
    pageNumber = 1;
  await queryPagedEpisodeByIndex(pageNumber - 1, locale, callback, fallback);
};

export const queryPagedEpisodeByIndex = async function(
  pageIndex: number,
  locale: string,
  callback: (data: PagedEpisodeDto) => void,
  fallback: () => void = () => {
  }
) {
  if (pageIndex < 0)
    pageIndex = 0;
  const api = pageIndex === 0
    ? `/api/list_${locale}.json`
    : `/api/list_${pageIndex}_${locale}.json`;
  await queryPagedEpisodeImpl(api, callback, fallback);
};