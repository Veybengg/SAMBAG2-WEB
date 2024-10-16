import { parse, format, isValid } from 'date-fns';

export const dateFormat = (dateString) => {
    const date = parse(dateString, 'M/d/yyyy, h:mm:ss a', new Date());
    
    if (!isValid(date)) {
        return 'Invalid date';
    }

    return format(date, 'MMMM d yyyy - h:mm a').replace(/,/, '');
};
