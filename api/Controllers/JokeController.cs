using api.Models;
using api.Services;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers;

[ApiController]
[Route("api/[controller]/[action]")]
public class JokesController : ControllerBase
{
    private readonly ILogger<JokesController> logger;
    private IJokeService jokeService;

    public JokesController(ILogger<JokesController> logger, IJokeService jokeService)
    {
        this.logger = logger;
        this.jokeService = jokeService;
    }

    [HttpGet(Name = "Jokes")]
    public IList<Joke> GetJokes()
    {
        return jokeService.GetList();
    }

    [HttpGet(Name = "Random")]
    public ActionResult GetRandom()
    {
        try
        {
            return Ok(jokeService.Random());
        }
        catch
        {
            return NotFound();
        }
    }

    [HttpPost(Name = "CreateJoke")]
    public ActionResult CreateJoke([FromBody] JokeToCreate joke)
    {
        try
        {
            var created = jokeService.CreateJoke(joke);
            return Created(Url.Action("GetJoke", new { Id = created.Id }) ?? "", created);
        }
        catch
        {
            return BadRequest();
        }
    }

    [HttpPut(Name = "UpdateJoke")]
    public ActionResult UpdateJoke([FromBody] JokeToUpdate joke)
    {
        try
        {
            var updated = jokeService.UpdateJoke(joke);
            return Ok(updated);
        }
        catch
        {
            return BadRequest();
        }
    }

}
