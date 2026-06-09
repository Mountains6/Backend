export default interface Book {
  id: number;
  title: string;
  author: string;
  publishedYear: number;
  price: number;
}

export type BookCreateInput = Omit<Book, 'id'>;
