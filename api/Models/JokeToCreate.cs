namespace api.Models;
public class JokeToCreate
{
    public ICollection<CategoryToCreate> Categories { get; set; } = new List<CategoryToCreate>();
    public string? Value { get; set; }
}
