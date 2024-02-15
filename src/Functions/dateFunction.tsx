interface DateFunctionPropsInterface {
    datejoined: string;
}

const dateFunction = (props: DateFunctionPropsInterface): string => {
    const { datejoined } = props;
    let originalDate = new Date(datejoined);

    const year = originalDate.getFullYear();
    const month = String(originalDate.getMonth() + 1).padStart(2, "0");
    const day = String(originalDate.getDate()).padStart(2, "0");
    const hours = String(originalDate.getHours()).padStart(2, "0");
    const minutes = String(originalDate.getMinutes()).padStart(2, "0");

    const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}`;
    return formattedDate;
};

export default dateFunction;
