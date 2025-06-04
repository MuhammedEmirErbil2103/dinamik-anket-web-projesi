using AnketAPIs.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;

namespace AnketAPIs.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StudentController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public StudentController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpGet("login/{email}/{password}")]
        public IActionResult Login(string email,string password)
        {
            string connectionString = _configuration.GetConnectionString("DefaultConnection");

            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                try
                {
                    connection.Open();

                    string query = "SELECT * FROM Students WHERE email = @Email AND password = @Password";
                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        command.Parameters.AddWithValue("@Email", email);
                        command.Parameters.AddWithValue("@Password", password);

                        using (SqlDataReader reader = command.ExecuteReader())
                        {
                            if (reader.HasRows)
                            {
                                reader.Read(); // İlk satırı oku

                                Student student = new Student
                                {
                                    id = reader.GetInt32(0), // Sıraları kontrol edin
                                    email = reader.GetString(1),
                                    password = reader.GetString(2),
                                    department = reader.GetString(3)
                                };

                                return Ok(student);
                            }

                            return NotFound(); // Kayıt bulunamadı
                        }
                    }
                }
                catch (Exception ex)
                {
                    return StatusCode(500, new { Message = "Internal server error", Error = ex.Message });
                }
            }
        }

    }
}