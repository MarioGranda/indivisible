import { Entry } from "@/shared/models/strapi";
import axios, { AxiosInstance } from "axios";

interface StrapiResponse<T, M = Record<string, unknown>> {
  data: T;
  meta: M;
}

let strapiPromise: Promise<AxiosInstance>;

const STRAPI_TIMEOUT = 3000;

const createClient = async () => {
  return axios.create({
    baseURL: process.env.STRAPI_API_URL,
    headers: {
      Authorization: `Bearer ${process.env.STRAPI_API_KEY}`,
    },
    timeout: STRAPI_TIMEOUT,
  });
};

const getClient = async () => {
  if (!strapiPromise) {
    strapiPromise = createClient();
  }

  return strapiPromise;
};

export const fetchStrapiHomePage = async (): Promise<Entry[]> => {
  const client = await getClient();

  const { data } = await client.get<StrapiResponse<Entry[]>>("/home-pages", {});

  return data.data;
};

export const fetchStrapiBullets = async (): Promise<Entry[]> => {
  const client = await getClient();

  const { data } = await client.get<StrapiResponse<Entry[]>>("/bullets", {});

  return data.data;
};
