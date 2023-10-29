using api.Models;
using api.Repository;
using Microsoft.AspNetCore.Http.HttpResults;

namespace api.Services;

public class JokeService : IJokeService
{
    private readonly IUnitOfWork unitOfWork;
    private readonly IRepository<Joke> jokeRepository;
    private readonly IRepository<Category> categoryRepository;

    public JokeService(IUnitOfWork unitOfWork)
    {
        this.unitOfWork = unitOfWork;
        jokeRepository = this.unitOfWork.Repository<Joke>();
        categoryRepository = this.unitOfWork.Repository<Category>();
    }

    public Joke CreateJoke(JokeToCreate jokeToCreate)
    {
        ICollection<Category> categories = new List<Category>();
        foreach (var categoryToCreate in jokeToCreate.Categories)
        {
            var category = categoryRepository.Where(item => item.Value == categoryToCreate.Value).FirstOrDefault();
            if (category == null)
            {
                categories.Add(new Category()
                {
                    Id = Guid.NewGuid(),
                    Value = categoryToCreate.Value
                });
            }
            else
            {
                categories.Add(category);
            }
        }
        Joke joke = new Joke()
        {
            Id = Guid.NewGuid(),
            Categories = categories,
            Value = jokeToCreate.Value,
            CreatedAt = DateTime.UtcNow
        };
        jokeRepository.Add(joke);

        unitOfWork.Commit();

        return joke;
    }

    public IList<Joke> GetList()
    {
        return jokeRepository.GetAll();
    }

    public Joke Random()
    {
        return jokeRepository.Random();
    }

    public Joke UpdateJoke(JokeToUpdate jokeToUpdate)
    {
        var joke = jokeRepository.GetById(jokeToUpdate.Id);
        if (joke == null)
        {
            throw new Exception("Joke not found.");
        }
        joke.Value = jokeToUpdate.Value;
        jokeRepository.Update(joke);

        unitOfWork.Commit();

        return joke;
    }
}