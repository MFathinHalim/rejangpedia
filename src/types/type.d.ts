type Data = {
    _id?: any
    id?: string;
    Title: string;
    Image?: string;
    Pembuat: string;
    Diedit?: string;
    Link: string;
    Location?: {
        lat: string;
        lng: string;
    };
    Waktu?: string;
    Edit?: string;
    Content: {
        babTitle: string;
        babContent: string;
    }[] | string;
}

type userType = {
    _id?: any;
    id?: string;
    username: string;
    password?: string;
    desc?: string;
    atmin?: boolean;
    accessToken?: {
        accessNow: string;
        timeBefore: string;
    };
};
