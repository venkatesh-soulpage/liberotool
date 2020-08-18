import moment from "moment";

export const getDateInStandardFormat = (date_time) => {
  return moment(date_time).format("YYYY-MM-DD");
};
