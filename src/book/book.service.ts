import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './entities/book.entity';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>
  ) {}
  async create(book: Book): Promise<Book> {
    return this.bookRepository.save(book);
  }

  async findAll(): Promise<Book[]> {
    return this.bookRepository.find();
  }

  async findOne(id: number): Promise<Book> {
    const book = await this.bookRepository.findOneBy({ id });
    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`); 
    }
    return book;
  }

  async update(id: number, updateBookDto: UpdateBookDto): Promise<Book> {
    const book = await this.findOne(id);
    const updatedBook = Object.assign(book, updateBookDto); 
    return this.bookRepository.save(updatedBook); 
  }

  async remove(id: number): Promise<void> {
    const book = await this.findOne(id);
    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`); 
    }
    await this.bookRepository.delete(book.id); 
  }
  async search(query: string): Promise<Book[]> {
    return this.bookRepository.createQueryBuilder('book')
        .where(`book.title ILIKE :query OR book.author ILIKE :query`, {
            query: `%${query}%`
        })
        .getMany();
}

  async fiterByPrice(minPrice: number, maxPrice: number): Promise<Book[]> {
    return this.bookRepository
    .createQueryBuilder('book')
    .where('book.price BETWEEN :minPrice AND :maxPrice', { minPrice, maxPrice })
    .getMany()
  }
}
