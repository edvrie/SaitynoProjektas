import ApiError from "./ApiError";

export const apiErrorHelper = (err, req, res, next) => {
    console.log(err);

    if (err instanceof ApiError) {
        res.status(err.code).json(err.message);
        return;
    }

    res.status(500).json("Something went wrong :(");
}