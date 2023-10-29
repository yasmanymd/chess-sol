using Microsoft.EntityFrameworkCore;
using api.Models;

namespace api.Repository;

public class JokeDbContext : DbContext
{
    public JokeDbContext() : base()
    { }

    public JokeDbContext(DbContextOptions<JokeDbContext> options) : base(options)
    { }

    public DbSet<Joke> Jokes { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Joke>().HasMany(e => e.Categories).WithMany(e => e.Jokes);
    }
}