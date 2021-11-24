import ApiError from "./ApiError";
import userModel from '../schemas/user';
import themeModel from '../schemas/theme';
import postModel from '../schemas/post';
import commentModel from '../schemas/comment';

interface User {
    username: string;
    userId: string;
    userRole: string;
    auth: string;
}

export const USER_ROLES = {
    ADMIN: "ADMIN",
    SIMPLE_USER: "SIMPLE_USER"
}

export const permissionCheckGeneric = (req, res, next) => {
    getUser(req.userData.userId).then((user) => {
        if ((user.userRole === USER_ROLES.ADMIN || user.userRole === USER_ROLES.SIMPLE_USER) && user !== null) {
            next();
            return;
        }
        next(ApiError.forbidden("You do not have permission for this action"));
        return;
    }).catch(() => {
        next(ApiError.badRequest("Could not fetch user data (perhaps you forgot to log in?)"));
        return;
    });
}

export const permissionCheckThemes = async (req, res, next) => {
    await getUser(req.userData.userId).then(async (user) => {
        await getTheme(req.params.id).then((theme) => {
            if ((user.userRole === USER_ROLES.SIMPLE_USER || user.userRole === USER_ROLES.ADMIN) && user !== null && theme !== null) {
                if (user._id.toString() === theme.userId || user.userRole === USER_ROLES.ADMIN){
                    next();
                    return;
                } else {
                    next(ApiError.forbidden("You do not have permission for this action"));
                    return;
                }
            }
            next(ApiError.badRequest("Could not process request"));
            return;
        }).catch(() => {
            next(ApiError.notFound("Cannot find deletable entries"));
            return;
        });
    }).catch(() => {
        next(ApiError.badRequest("Could not fetch user data (perhaps you forgot to log in?)"));
        return;
    });
}

export const permissionCheckPosts = async (req, res, next) => {
    await getUser(req.userData.userId).then(async (user) => {
        await getPost(req.params.postId).then((post) => {
            if ((user.userRole === USER_ROLES.SIMPLE_USER || user.userRole === USER_ROLES.ADMIN) && user !== null && post !== null) {
                if (user._id.toString() === post.userId || user.userRole === USER_ROLES.ADMIN){
                    next();
                    return;
                } else {
                    next(ApiError.forbidden("You do not have permission for this action"));
                    return;
                }
            }
            next(ApiError.badRequest("Could not process request"));
            return;

        }).catch(() => {
            next(ApiError.notFound("Cannot find deletable entries"));
            return;
        });
    }).catch(() => {
        next(ApiError.badRequest("Could not fetch user data (perhaps you forgot to log in?)"));
        return;
    });
}

export const permissionCheckComments = async (req, res, next) => {
    await getUser(req.userData.userId).then(async (user) => {
        await getComment(req.params.commentId).then((comment) => {
            if ((user.userRole === USER_ROLES.SIMPLE_USER || user.userRole === USER_ROLES.ADMIN) && user !== null && comment !== null) {
                if (user._id.toString() === comment.userId || user.userRole === USER_ROLES.ADMIN){
                    next();
                    return;
                } else {
                    next(ApiError.forbidden("You do not have permission for this action"));
                    return;
                }
            }
            next(ApiError.badRequest("Could not process request"));
            return;

        }).catch(() => {
            next(ApiError.notFound("Cannot find deletable entries"));
            return;
        });;
    }).catch(() => {
        next(ApiError.badRequest("Could not fetch user data (perhaps you forgot to log in?)"));
        return;
    });;
}

export const permissionCheckAdmin = async (req, res, next) => {
    const user = await getUser(req.userData.userId)
    if (user.userRole === USER_ROLES.ADMIN && user !== undefined ) {
        next();
        return;
    }
        
    next(ApiError.forbidden("You do not have permission for this action"));
    return;
}

const getUser = async (userId: string) => {
    const user = await userModel.findById(userId);
    return user;
}

const getTheme = async (themeId: string) => {
    const theme = await themeModel.findById(themeId);
    return theme;
}

const getPost = async (postId: string) => {
    const post = await postModel.findById(postId);
    return post;
}

const getComment = async (commentId: string) => {
    const comment = await commentModel.findById(commentId);
    return comment;
}