namespace api.Models;
public class Category : CategoryToCreate
{
    public Guid Id { get; set; }

    public ICollection<Joke> Jokes { get; } = new List<Joke>();
}
