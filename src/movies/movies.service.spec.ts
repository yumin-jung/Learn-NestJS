import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movies.service';

describe('MoviesService', () => {
  let service: MoviesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MoviesService],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be 4', () => {
    expect(2 + 2).toEqual(4)
  });

  describe("getAll", () => {
    it("should return an array", () => {
      const res = service.getAll();
      expect(res).toBeInstanceOf(Array);
    })
  });

  describe("getOne", () => {
    it("should found a movie", () => {
      service.create({
        "title": "Title",
        "year": 2022,
        "genres": ["Genre"]
      })
      const movie = service.getOne(1);
      expect(movie).toBeDefined();
      expect(movie.id).toEqual(1);
    });

    it("should throw 404 error", () => {
      try {
        service.getOne(1000);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toEqual(`Movie with ID not found: 1000`);
      }
    })
  })

  describe("deleteOne", () => {
    it("deletes a movie", () => {
      service.create({
        "title": "Title",
        "year": 2022,
        "genres": ["Genre"]
      });
      const beforeDelete = service.getAll();
      service.deleteOne(1);
      const afterDelete = service.getAll();
      expect(afterDelete.length).toBeLessThan(beforeDelete.length);
    })
    it("should return 404 Error", () => {
      try {
        service.deleteOne(1000);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
      }
    })
  })

  describe("create", () => {
    it("should create a movie", () => {
      const beforeCreate = service.getAll().length;
      service.create({
        "title": "Title",
        "year": 2022,
        "genres": ["Genre"]
      });
      const afterCreate = service.getAll().length;
      expect(afterCreate).toBeGreaterThan(beforeCreate);
    })
  })

  describe("update", () => {
    it("should update a movie", () => {
      service.create({
        "title": "Title",
        "year": 2022,
        "genres": ["Genre"]
      });
      service.update(1, { title: "Updated test" });
      const movie = service.getOne(1);
      expect(movie.title).toEqual("Updated test");
    })
    it("should return 404 Error", () => {
      try {
        service.update(1000, {});
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
      }
    })
  })
});
