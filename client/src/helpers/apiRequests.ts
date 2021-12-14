import axios from 'axios';

interface RegisterData {
    username: string,
    email: string,
    password: string
}

const URL = 'https://saityno-projektas-nyqcd.ondigitalocean.app/api'

export const login = async (email: string, password: string) => {
    try {
        await axios.post('https://saityno-projektas-nyqcd.ondigitalocean.app/login', {
            email: email,
            password: password
        }).then((response) => {
            const token = response.data.authToken;
            localStorage.setItem("JWTToken", `Bearer ${token}`);
            localStorage.setItem("userData", `${response.data.userId};${response.data.username};${response.data.email};${response.data.userRole}`);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        })
    } catch (err) {
        console.log(err);
    }
}

export const register = async (data: RegisterData) => {
    try {
        await axios.post('https://saityno-projektas-nyqcd.ondigitalocean.app/signup', {
            username: data.username,
            email: data.email,
            password: data.password
        }).then(() => login(data.email, data.password));

    } catch (err) {
        console.log(err);
    }
}

export const fetchThemes = async () => {
    try{
        const response = await axios({
            url: `${URL}/themes`,
            method: 'GET'
        })
        return response;
    } catch (err) {
        console.log(err);
    }
}

export const fetchTheme = async (themeId: string) => {
    try{
        const response = await axios({
            url: `${URL}/themes/${themeId}`,
            method: 'GET'
        })
        return response;
    } catch (err) {
        console.log(err)
    }
}

export const postTheme = async (name: string) => {
    try{
        await axios.post(`${URL}/themes`, {name: name})
    } catch (err) {
        console.log(err);
    }
}

export const deleteTheme = async (themeId: string) => {
    try{
        await axios.delete(`${URL}/themes/${themeId}`)
    } catch (err) {
        console.log(err);
    }
}


export const patchTheme = async (themeId: string, value: string) => {
    try {
        await axios.patch(`${URL}/themes/${themeId}`, {
            name: value
        })
    } catch (err) {
        console.log(err);
    }
}

export const fetchPosts = async (id: string) => {
    try{
        const response = await axios({
            url: `${URL}/themes/${id}/posts`,
            method: 'GET'
        })
        return response;
    } catch (err) {
        console.log(err);
    }
}

export const fetchPost = async (themeId: string, postId: string) => {
    try {
        const response = await axios({
            url: `${URL}/themes/${themeId}/posts/${postId}`,
            method: 'GET'
        });
        return response;
    } catch (err) {
        console.log(err)
    }
}

export const postPost = async (id: string, data: object) => {
    try{
        await axios.post(`${URL}/themes/${id}/posts`, data)
    } catch (err) {
        console.log(err);
    }
}

export const deletePost = async (themeId: string, postId: string) => {
    try {
        axios.delete(`${URL}/themes/${themeId}/posts/${postId}`);
    } catch (err) {
        console.log(err);
    }
}

export const patchPost = async (themeId: string, postId: string, title: string, content: string) => {
    try {
        await axios.patch(`${URL}/themes/${themeId}/posts/${postId}`, {
            title: title,
            content: content
        })
    } catch (err) {
        console.log(err);
    }
}

export const fetchComments = async (themeId: string, postId: string) => {
    try {
        const response = await axios({
            url: `${URL}/themes/${themeId}/posts/${postId}/comments`,
            method: 'GET'
        });
        return response;
    } catch (err) {
        console.log(err);
    }
}

export const fetchComment = async (themeId: string, postId: string, commentId: string) => {
    try {
        const response = await axios({
            url: `${URL}/themes/${themeId}/posts/${postId}/comments/${commentId}`,
            method: 'GET'
        })
        return response;
    } catch (err) {
        console.log(err);
    }
}

export const postComment = async (themeId: string, postId: string, content: string) => {
    try {
        await axios.post(`${URL}/themes/${themeId}/posts/${postId}/comments`, {content: content});
    } catch (err) {
        console.log(err);
    }
}

export const patchComment = async (themeId: string, postId: string, commentId: string, content: string) => {
    try {
        await axios.patch(`${URL}/themes/${themeId}/posts/${postId}/comments/${commentId}`, {
            content: content
        })
    } catch (err) {
        console.log(err)
    }
}

export const deleteComment = async (themeId: string, postId: string, commentId: string) => {
    try {
        axios.delete(`${URL}/themes/${themeId}/posts/${postId}/comments/${commentId}`);
    } catch (err) {
        console.log(err);
    }
}