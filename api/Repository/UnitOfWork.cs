using Microsoft.EntityFrameworkCore;

namespace api.Repository;

public class UnitOfWork : IUnitOfWork, IDisposable
{
    private readonly JokeDbContext dbContext;
    private Dictionary<Type, object> repositories;

    public UnitOfWork(JokeDbContext dbContext)
    {
        this.dbContext = dbContext;
        this.repositories = new Dictionary<Type, object>();
    }

    public void Commit()
    {
        dbContext.SaveChanges();
    }

    public void Rollback()
    {
        foreach (var entry in dbContext.ChangeTracker.Entries())
        {
            switch (entry.State)
            {
                case EntityState.Added:
                    entry.State = EntityState.Detached;
                    break;
            }
        }
    }

    public IRepository<T> Repository<T>() where T : class
    {
        if (repositories.ContainsKey(typeof(T)))
        {
            return (IRepository<T>)repositories[typeof(T)];
        }

        var repository = new Repository<T>(dbContext);
        repositories.Add(typeof(T), repository);
        return repository;
    }

    private bool disposed = false;

    protected virtual void Dispose(bool disposing)
    {
        if (!this.disposed)
        {
            if (disposing)
            {
                dbContext.Dispose();
            }
        }
        this.disposed = true;
    }

    public void Dispose()
    {
        Dispose(true);
        GC.SuppressFinalize(this);
    }
}