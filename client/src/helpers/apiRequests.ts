import axios, { AxiosError, AxiosRequestConfig } from 'axios';

interface FetchOptions extends AxiosRequestConfig {
    errorHandler?: (err: AxiosError) => void;
    withAccessToken?: boolean;
  }
  

export const fetchThemes = async () => {
    try{
        const response = await axios({
            url: 'https://saityno-projektas-nyqcd.ondigitalocean.app/api/themes',
            method: 'GET'
        })
        return response;
    } catch (err) {
        console.log(err);
    }
}

export const fetchPosts = async (id: string) => {
    try{
        const response = await axios({
            url: `https://saityno-projektas-nyqcd.ondigitalocean.app/api/themes/${id}/posts`,
            method: 'GET'
        })
        return response;
    } catch (err) {
        console.log(err);
    }
}