interface DateProps {
    date: string;
}

export const DateFunction = () => {
    const formatDateDay = (props: DateProps): string => {
        const { date } = props;
        const originalDate = new Date(date);
        const year = originalDate.getFullYear();
        const month = String(originalDate.getMonth() + 1).padStart(2, "0");
        const day = String(originalDate.getDate()).padStart(2, "0");

        const formattedDateDay = `${year}-${month}-${day}`;
        return formattedDateDay;
    };

    const formatDateMinute = (props: DateProps): string => {
        const { date } = props;
        const originalDate = new Date(date);
        const year = originalDate.getFullYear();
        const month = String(originalDate.getMonth() + 1).padStart(2, "0");
        const day = String(originalDate.getDate()).padStart(2, "0");
        const hours = String(originalDate.getHours()).padStart(2, "0");
        const minutes = String(originalDate.getMinutes()).padStart(2, "0");

        const formattedDateMinute = `${year}-${month}-${day} ${hours}:${minutes}`;

        return formattedDateMinute;
    };

    const formatDateT = (): string => {
        const originalDate = new Date();
        const year = originalDate.getFullYear();
        const month = String(originalDate.getMonth() + 1).padStart(2, "0");
        const day = String(originalDate.getDate()).padStart(2, "0");
        const hours = String(originalDate.getHours()).padStart(2, "0");
        const minutes = String(originalDate.getMinutes()).padStart(2, "0");
        const seconds = String(originalDate.getSeconds()).padStart(2, "0");

        const formattedDateT = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;

        return formattedDateT;
    };

    return {
        formatDateDay,
        formatDateMinute,
        formatDateT,
    };
};
