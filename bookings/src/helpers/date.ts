import moment from "moment";

export const formatDateToMMMDD = (date: Date): string => {
    return moment(date).format("MMM Do");
};

export const formatDateToDDMMYY = (date: Date): string => {
    return moment(date).format("DD.MM.YY");
};

export const formatDateToHHMMDDMMM = (date: Date): string => {
    return moment(date).format("HH:mm A DD MMM");
};

export const formatDateToDDMMYYYY = (date: Date): string => {
    return moment(date).format("DD.MM.YYYY");
};