using AnketAPIs.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;

namespace AnketAPIs.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class QuestionController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public QuestionController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpGet("all")]
        public IActionResult GetRandomQuestions()
        {
            // Veritabanı bağlantı dizesi
            string connectionString = _configuration.GetConnectionString("DefaultConnection");

            // Öğretmen listesi
            List<Question> teachers = new List<Question>();

            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    connection.Open();

                    // Sorgu
                    string query = "SELECT * FROM Questions;";

                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        using (SqlDataReader reader = command.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                teachers.Add(new Question
                                {
                                    id = reader.GetInt32(0), // id
                                    question = reader.GetString(1),
                                });
                            }
                        }
                    }
                }

                return Ok(teachers); // Tüm öğretmenleri döndür
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Internal server error", Error = ex.Message });
            }
        }
    }
}
