using System.Linq.Expressions;

namespace api.Repository;

public interface IRepository<T> where T : class
{
    T? GetById(object id);
    IList<T> GetAll();
    void Add(T entity);
    void Update(T entity);
    T Random();
    IList<T> Where(Expression<Func<T, bool>> predicate);
}