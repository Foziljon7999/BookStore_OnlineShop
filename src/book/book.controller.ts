import {Controller,Get, Post, Body, Patch, Param, Delete, Query, UseGuards, BadRequestException, NotFoundException } from '@nestjs/common';
import { BookService } from './book.service';
import { Book } from './entities/book.entity';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/auth.roles.guard';

@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Post()
  async create(@Body() book: Book): Promise<Book> {
    try {
      return await this.bookService.create(book);
    } catch (error) {
      console.error('Error creating book:', error);
      throw error; 
    }
  }

  @Get('by/:id')
  findOne(@Param('id') id: string) {
    const book =  this.bookService.findOne(+id);
    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }
    return book
  }

  @Get()
  async findAll(@Query('minPrice') minPrice: number, @Query('maxPrice') maxPrice: number): Promise<Book[]> {
    try {
      if (minPrice !== undefined && maxPrice !== undefined) {
        return await this.bookService.fiterByPrice(minPrice, maxPrice);
      }
      return await this.bookService.findAll();
    } catch (error) {
      console.error('Error finding books:', error);
      throw error; 
    }
  }

@UseGuards(AuthGuard, RolesGuard)
@Patch(':id')
async update(@Param('id') id: string, @Body() book: Book): Promise<Book> {
  try {
    const bookId = parseInt(id, 10);
    if (isNaN(bookId)) {
      throw new Error('Invalid ID format'); 
    }
    const updatedBook = await this.bookService.update(bookId, book);
    if (!updatedBook) {
      throw new Error(`Book not found with ID ${bookId}`); 
    }
    return updatedBook;
  } catch (error) {
    console.error(`Error updating book with ID ${id}:`, error);
    throw error; 
  }
}

@UseGuards(AuthGuard, RolesGuard)
@Delete(':id')
async remove(@Param('id') id: string): Promise<void> {
  try {
    const bookId = parseInt(id, 10);
    if (isNaN(bookId)) {
      throw new Error('Invalid ID format'); 
    }
    await this.bookService.remove(bookId); 
  } catch (error) {
    console.error(`Error removing book with ID ${id}:`, error);
    throw error;
  }
}

  @Get('search')
  async search(@Query('query') query: string): Promise<Book[]> {
    if (!query) {
      throw new BadRequestException('Query parameter is required');
    }
    try {
      const books = await this.bookService.search(query);
      if (books.length === 0) {
        throw new NotFoundException('No books found for the given query');
      }
      return books;
    } catch (error) {
      console.error('Error searching books:', error);
      throw error; 
    }
  }

  @Get('filter')
  async filterByPrice(
    @Query('minPrice') minPrice: string,
    @Query('maxPrice') maxPrice: string
  ): Promise<Book[]> {
    const min = parseFloat(minPrice);
    const max = parseFloat(maxPrice);

    if (isNaN(min) || isNaN(max)) {
      throw new BadRequestException('Both minPrice and maxPrice should be valid numbers');
    }

    return await this.bookService.fiterByPrice(min, max);
  }
}
