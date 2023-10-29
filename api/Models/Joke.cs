namespace api.Models;
public class Joke
{
    public Guid Id { get; set; }
    public ICollection<Category> Categories { get; set; } = new List<Category>();
    public string? Value { get; set; }
    public DateTime CreatedAt { get; set; }
}
