using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;

namespace api.Repository;

public class Repository<T> : IRepository<T> where T : class
{
    private readonly JokeDbContext _dbContext;
    private readonly DbSet<T> dbSet;
    public T? GetById(object id)
    {
        return dbSet.Find(id);
    }
    public Repository(JokeDbContext dbContext)
    {
        _dbContext = dbContext;
        dbSet = _dbContext.Set<T>();
    }
    public IList<T> GetAll()
    {
        return dbSet.ToList();
    }
    public void Add(T entity)
    {
        dbSet.Add(entity);
    }

    public T Random()
    {
        var count = dbSet.Count();
        if (count == 0)
        {
            throw new Exception("Error: There is no jokes.");
        }
        Random rand = new Random();
        int toSkip = rand.Next(1, count);
        return dbSet.Skip(toSkip).Take(1).First();
    }

    public IList<T> Where(Expression<Func<T, bool>> predicate)
    {
        return dbSet.Where(predicate).ToList();
    }

    public void Update(T entity)
    {
        dbSet.Update(entity);
    }
}