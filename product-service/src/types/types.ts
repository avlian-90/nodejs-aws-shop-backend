export type Product = {
    id: number;
    title: string;
    description: string;
    price: number;
}

export type Response = {
    statusCode: number,
    body: {message: string} | Product[] | Product
}

