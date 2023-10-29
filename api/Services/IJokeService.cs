using api.Models;

namespace api.Services;

public interface IJokeService
{
    Joke CreateJoke(JokeToCreate jokeToCreate);
    Joke UpdateJoke(JokeToUpdate jokeToUpdate);
    IList<Joke> GetList();
    Joke Random();
}